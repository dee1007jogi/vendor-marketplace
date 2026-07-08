import React, { useState, useEffect, useRef } from "react";
import { User } from "../types";
import { 
  Send, Sparkles, MessageSquare, ShieldCheck, 
  RefreshCw, PlusCircle, AlertCircle, ChevronLeft 
} from "lucide-react";
import { io, Socket } from "socket.io-client";

interface ChatInboxProps {
  currentUser: User;
}

export default function ChatInbox({ currentUser }: ChatInboxProps) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);
  const [usersInfo, setUsersInfo] = useState<any[]>([]);
  
  const [aiCoachLoading, setAiCoachLoading] = useState(false);
  const [aiCoachSuggestion, setAiCoachSuggestion] = useState("");
  const [showMobileChat, setShowMobileChat] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch initial data
  useEffect(() => {
    // 1. Fetch system users to map names/avatars
    fetch("/api/state")
      .then(res => res.json())
      .then(data => setUsersInfo(data.users || []))
      .catch(console.error);

    // 2. Fetch conversations
    fetch(`/api/chats/conversations?userId=${currentUser.id}`)
      .then(res => res.json())
      .then(data => {
        setConversations(data);
        if (data.length > 0) setActiveConvId(data[0].id);
      })
      .catch(console.error);
  }, [currentUser.id]);

  // Init socket
  useEffect(() => {
    const newSocket = io(window.location.origin);
    setSocket(newSocket);

    newSocket.on("message:new", (msg: any) => {
      setMessages(prev => {
        if (!prev.some(m => m.id === msg.id)) {
          return [...prev, msg];
        }
        return prev;
      });
      // Also update conversation's last message locally
      setConversations(prevConvs => prevConvs.map(c => {
        if (c.id === msg.conversationId) {
          return { ...c, messages: [msg], updatedAt: msg.createdAt };
        }
        return c;
      }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Fetch messages for active conversation
  useEffect(() => {
    if (!activeConvId || !socket) return;
    
    // Join room
    socket.emit("join:chat", { conversationId: activeConvId });
    
    // Load history
    fetch(`/api/chats/conversations/${activeConvId}/messages`)
      .then(res => res.json())
      .then(data => setMessages(data))
      .catch(console.error);
      
  }, [activeConvId, socket]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !activeConvId || !socket) return;

    const content = inputText;
    setInputText("");
    setAiCoachSuggestion("");

    socket.emit("send:message", {
      conversationId: activeConvId,
      senderId: currentUser.id,
      content
    });
  };

  const handleConsultAICoach = async () => {
    if (!activeConvId || messages.length === 0) {
      alert("Please begin messaging to evaluate thread semantics with Gemini.");
      return;
    }
    setAiCoachLoading(true);
    try {
      const payloadMessages = messages.map((m) => ({
        role: m.senderId === currentUser.id ? currentUser.role : "partner",
        text: m.content,
      }));

      const response = await fetch("/api/chats/ai-assist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: payloadMessages,
          currentPersonaType: currentUser.role,
        }),
      });
      const data = await response.json();
      if (data.response) setAiCoachSuggestion(data.response);
    } catch (err) {
      console.error(err);
    } finally {
      setAiCoachLoading(false);
    }
  };

  const activeConv = conversations.find(c => c.id === activeConvId);
  const activePartnerId = activeConv ? (activeConv.buyerId === currentUser.id ? activeConv.vendorId : activeConv.buyerId) : null;
  const activePartner = usersInfo.find(u => u.id === activePartnerId);

  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row h-[85vh] md:h-[70vh]">
      
      {/* Sidebar */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex-col bg-slate-50 ${showMobileChat ? 'hidden md:flex' : 'flex'} h-full`}>
        <div className="p-4 border-b border-slate-200 bg-white">
          <h2 className="font-bold text-slate-900 text-sm sm:text-base flex items-center gap-1.5">
            <MessageSquare size={18} className="text-indigo-600" />
            <span>RFP Collaboration Hub</span>
          </h2>
          <p className="text-[10px] text-slate-500 mt-0.5 leading-none">Real-time WebSocket connection</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100 p-2 space-y-1">
          {conversations.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              <AlertCircle size={20} className="mx-auto text-slate-350 mb-1.5" />
              <span>No active chat workspaces yet.</span>
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConvId;
              const partnerId = conv.buyerId === currentUser.id ? conv.vendorId : conv.buyerId;
              const partner = usersInfo.find(u => u.id === partnerId);
              const lastMsg = conv.messages && conv.messages.length > 0 ? conv.messages[0] : null;

              return (
                <div
                  key={conv.id}
                  onClick={() => { setActiveConvId(conv.id); setAiCoachSuggestion(""); setShowMobileChat(true); }}
                  className={`flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all ${
                    isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-100" : "bg-transparent text-slate-700 hover:bg-slate-200/50"
                  }`}
                >
                  <img
                    src={partner?.avatar || "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80"}
                    alt={partner?.name}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-white/10"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <span className={`text-xs font-bold truncate ${isActive ? "text-white" : "text-slate-900"}`}>
                        {partner?.name || "Partner"}
                      </span>
                      <span className="text-[9px] text-slate-400 opacity-80 shrink-0 font-mono">
                        {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <span className={`block text-[10px] font-extrabold tracking-tight truncate uppercase leading-tight mt-0.5 ${isActive ? "text-indigo-200" : "text-indigo-600"}`}>
                      {conv.requirement?.title || "Workspace"}
                    </span>
                    <p className={`text-[11px] truncate mt-1 leading-snug font-normal ${isActive ? "text-indigo-100 opacity-90" : "text-slate-500"}`}>
                      {lastMsg ? lastMsg.content : "No messages yet"}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main chat viewport */}
      <div className={`flex-1 flex-col bg-white overflow-hidden relative ${showMobileChat ? 'flex' : 'hidden md:flex'} h-full`}>
        {activeConv && activePartner ? (
          <>
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50 shrink-0">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setShowMobileChat(false)}
                  className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-200 rounded-full"
                >
                  <ChevronLeft size={20} />
                </button>
                <img src={activePartner.avatar} alt={activePartner.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <h3 className="font-bold text-slate-900 text-sm leading-tight">{activePartner.name}</h3>
                  <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-wider flex items-center gap-1 leading-none mt-0.5">
                    <ShieldCheck size={12} /> {activeConv.requirement?.title || "Project"} Workspace
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto bg-slate-50/20 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-10 italic text-slate-400 text-xs text-medium">
                  Workspace channel established. Say hi to start the negotiation!
                </div>
              ) : (
                messages.map((msg) => {
                  const isOutgoing = msg.senderId === currentUser.id;
                  const senderUser = msg.sender || usersInfo.find(u => u.id === msg.senderId);
                  return (
                    <div key={msg.id} className={`flex items-start gap-2.5 max-w-[80%] ${isOutgoing ? "ml-auto flex-row-reverse" : "mr-auto"}`}>
                      <div className={`rounded-2xl p-4 shadow-sm text-xs ${isOutgoing ? "bg-indigo-600 text-white rounded-tr-none font-medium" : "bg-white border border-slate-200 text-slate-800 rounded-tl-none font-normal"}`}>
                        <div className="flex items-center justify-between gap-4 text-[9px] font-bold uppercase tracking-wide opacity-80 mb-1">
                          <span>{senderUser?.role || (isOutgoing ? currentUser.role : "partner")}</span>
                          <span className="font-mono">{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-line prose max-w-none">{msg.content}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {aiCoachSuggestion && (
              <div className="mx-4 my-2.5 bg-indigo-50 border border-indigo-200 rounded-xl p-3.5 space-y-2 relative shadow-md shadow-indigo-100/50 animate-fadeIn">
                <button onClick={() => setAiCoachSuggestion("")} className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 cursor-pointer">
                  <PlusCircle size={15} className="rotate-45" />
                </button>
                <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold uppercase tracking-wide leading-none">
                  <Sparkles size={13} className="fill-indigo-300" />
                  <span>Negotiation Coach Suggestion</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed max-w-2xl font-normal">"{aiCoachSuggestion}"</p>
                <button onClick={() => { setInputText(aiCoachSuggestion); setAiCoachSuggestion(""); }} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] uppercase tracking-wide px-3 py-1 rounded shadow-sm transition-colors cursor-pointer">
                  Apply Suggested Draft
                </button>
              </div>
            )}

            <div className="p-3 bg-white border-t border-slate-200 space-y-2.5">
              <form onSubmit={handleSendMessage} className="flex gap-2.5 items-center">
                <button type="button" onClick={handleConsultAICoach} disabled={aiCoachLoading} className="h-10 w-10 flex items-center justify-center rounded-xl border border-indigo-200 hover:bg-indigo-50 text-indigo-600 transition-colors cursor-pointer shrink-0 disabled:opacity-40" title="Let Gemini AI structure the perfect response.">
                  {aiCoachLoading ? <RefreshCw size={18} className="animate-spin text-indigo-600" /> : <Sparkles size={18} className="fill-indigo-100" />}
                </button>
                <input type="text" placeholder="Collaborate or negotiate pricing..." value={inputText} onChange={(e) => setInputText(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:bg-white focus:outline-none focus:border-indigo-500 font-medium text-slate-800" />
                <button type="submit" disabled={!inputText.trim()} className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white rounded-xl h-10 px-4.5 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer shrink-0">
                  <span>Send</span>
                  <Send size={12} />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col justify-center items-center p-12 text-center text-slate-400 bg-slate-50">
            <MessageSquare size={36} className="text-slate-300 mb-2" />
            <p className="text-sm font-semibold max-w-xs">Select or open an active session on the left sidebar to start chatting.</p>
          </div>
        )}
      </div>

    </div>
  );
}
