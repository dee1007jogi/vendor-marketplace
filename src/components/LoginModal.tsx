import React, { useState } from "react";
import { X, Mail, Phone, Lock, ChevronRight, MessageCircle } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (data: any, method: "email" | "otp" | "social") => Promise<void>;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
  onRequestOtp: (phone: string) => Promise<boolean>;
}

export default function LoginModal({ isOpen, onClose, onLogin, onOpenRegister, onOpenForgotPassword, onRequestOtp }: LoginModalProps) {
  const [tab, setTab] = useState<"email" | "otp">("email");
  
  // Email state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // OTP state
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Escape key handler & Body Scroll Lock
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin({ email, password }, "email");
      onClose();
    } catch (err: any) {
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone) {
      setError("Please enter your mobile number");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const success = await onRequestOtp(phone);
      if (success) setOtpSent(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onLogin({ phone, otp }, "otp");
      onClose();
    } catch (err: any) {
      setError(err.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      data-lenis-prevent
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-sky-950/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      <div 
        data-lenis-prevent
        className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 border border-sky-100 flex flex-col max-h-[85vh] sm:max-h-[90vh]"
      >
        <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px] z-30"></div>
        
        {/* Sticky Fixed Header with Close Button */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-3.5 border-b border-sky-100 flex items-center justify-between z-30 shrink-0">
          <span className="text-[11px] font-black tracking-wider uppercase bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
            Account Login
          </span>
          <button 
            type="button"
            onClick={onClose} 
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer flex items-center gap-1.5 font-extrabold text-xs shadow-xs"
            title="Close (Esc)"
          >
            <span>Close</span>
            <X size={16} />
          </button>
        </div>

        <div 
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="overflow-y-auto flex-1 overscroll-contain custom-scrollbar p-6 sm:p-8"
        >
          <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Log in to Bussinest</h2>

          {/* Prominent WhatsApp Login */}
          <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#25D366]/25 transition-colors mb-6">
            <MessageCircle size={20} /> Continue with WhatsApp
          </button>
          
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or log in with</span>
          </div>

          {/* Tabs */}
          <div className="flex neo-inset p-1 rounded-2xl mb-6">
            <button onClick={() => { setTab("email"); setError(""); }} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${tab === "email" ? "bg-white text-sky-700 shadow-md font-black" : "text-slate-500 hover:text-slate-800"}`}>Email Login</button>
            <button onClick={() => { setTab("otp"); setError(""); }} className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all duration-200 cursor-pointer ${tab === "otp" ? "bg-white text-sky-700 shadow-md font-black" : "text-slate-500 hover:text-slate-800"}`}>Mobile OTP</button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-xs font-bold rounded-xl mb-6 text-center border border-red-100 animate-entrance-up">{error}</div>}

          {/* EMAIL TAB */}
          {tab === "email" ? (
            <div key="email" className="space-y-4 animate-entrance-up">
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="neo-input w-full rounded-xl py-3 pl-11 pr-4 font-semibold text-slate-900 text-sm" placeholder="name@company.com" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="neo-input w-full rounded-xl py-3 pl-11 pr-4 font-semibold text-slate-900 text-sm" placeholder="••••••••" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button type="button" onClick={() => { onClose(); onOpenForgotPassword(); }} className="text-xs font-bold text-sky-700 hover:text-sky-900 cursor-pointer">Forgot Password?</button>
                </div>

                <button type="submit" disabled={loading} className="w-full neo-btn-primary py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md">
                  {loading ? "Logging in..." : "Log In"} <ChevronRight size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div key="otp" className="space-y-4 animate-entrance-up">
              {!otpSent ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="neo-input w-full rounded-xl py-3 pl-11 pr-4 font-semibold text-slate-900 text-sm" placeholder="+91 9876543210" />
                    </div>
                  </div>
                  <button type="button" onClick={handleSendOtp} disabled={loading || !phone} className="w-full neo-btn-primary py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md">
                    {loading ? "Sending OTP..." : "Send OTP"} <ChevronRight size={16} />
                  </button>
                </div>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-xs text-slate-500 font-medium">OTP sent to <span className="font-bold text-slate-900">{phone}</span></p>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs font-bold text-sky-700 hover:underline mt-1">Change Number</button>
                  </div>
                  <div>
                    <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} className="neo-input w-full rounded-xl py-3 pl-4 pr-4 font-black tracking-[0.5em] text-center text-slate-900 text-base" placeholder="••••••" />
                  </div>
                  <button type="submit" disabled={loading || otp.length < 6} className="w-full neo-btn-primary py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md">
                    {loading ? "Verifying..." : "Verify & Log In"} <ChevronRight size={16} />
                  </button>
                </form>
              )}
            </div>
          )}


          {/* Social Logins removed from bottom as it is now prominently at the top */}
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100 space-y-2">
          <p className="text-slate-500 font-medium text-sm">
            Don't have an account? <button onClick={() => { onClose(); onOpenRegister(); }} className="text-indigo-600 font-bold hover:underline">Sign up</button>
          </p>
          <div>
            <button type="button" onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-700 underline cursor-pointer">
              Cancel & Close Modal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
