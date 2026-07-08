import React, { useState } from "react";
import { MessageCircle, X, Send, HelpCircle } from "lucide-react";

export default function SupportWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-2xl hover:bg-indigo-700 transition-transform hover:scale-105 z-50 animate-bounce"
        style={{ animationDuration: '2s' }}
      >
        <MessageCircle size={28} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 bg-white rounded-2xl shadow-2xl overflow-hidden z-50 flex flex-col animate-in slide-in-from-bottom-10 duration-200 border border-slate-200">
      <div className="bg-[#4338ca] p-4 text-white flex justify-between items-center">
        <div className="flex items-center gap-2">
          <HelpCircle size={20} />
          <h3 className="font-bold text-[15px]">Support & Help</h3>
        </div>
        <button onClick={() => setIsOpen(false)} className="text-indigo-100 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>
      
      <div className="p-4 h-64 overflow-y-auto bg-slate-50 flex flex-col gap-3 text-[15px]">
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm self-start max-w-[85%]">
          <p className="text-slate-800 leading-snug">Hi there! 👋 How can we help you today?</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm self-start max-w-[85%] text-sm text-slate-500 space-y-3">
          <p className="font-bold text-slate-800 text-xs tracking-wide">SUGGESTED ARTICLES:</p>
          <button className="text-[#4f46e5] hover:underline text-left block w-full">How does escrow work?</button>
          <button className="text-[#4f46e5] hover:underline text-left block w-full">Upgrading my vendor tier</button>
          <button className="text-[#4f46e5] hover:underline text-left block w-full">Filing a dispute</button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm">
          <input 
            type="text" 
            placeholder="Type your message..." 
            className="flex-1 bg-transparent border-none outline-none text-[15px] text-slate-700 placeholder-slate-400"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && setMessage('')}
          />
          <button onClick={() => setMessage('')} className="text-[#8b5cf6] p-1 hover:bg-purple-50 rounded-full transition-colors disabled:opacity-50" disabled={!message.trim()}>
            <Send size={18} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
