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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Log in to VendorMatch</h2>

          {/* Prominent WhatsApp Login */}
          <button className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1DA851] text-white font-bold py-3 rounded-xl shadow-lg shadow-[#25D366]/25 transition-colors mb-6">
            <MessageCircle size={20} /> Continue with WhatsApp
          </button>
          
          <div className="relative flex items-center justify-center mb-6">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
            <span className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Or log in with</span>
          </div>

          {/* Tabs */}
          <div className="flex bg-slate-100 p-1 rounded-xl mb-6">
            <button onClick={() => { setTab("email"); setError(""); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === "email" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Email</button>
            <button onClick={() => { setTab("otp"); setError(""); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-colors ${tab === "otp" ? "bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>Mobile OTP</button>
          </div>

          {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl mb-6 text-center border border-red-100">{error}</div>}

          {/* EMAIL TAB */}
          {tab === "email" && (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-medium text-slate-900 transition-all" placeholder="name@company.com" />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-medium text-slate-900 transition-all" placeholder="••••••••" />
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={() => { onClose(); onOpenForgotPassword(); }} className="text-sm font-bold text-indigo-600 hover:text-indigo-800">Forgot Password?</button>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-colors mt-2">
                {loading ? "Logging in..." : "Log In"}
              </button>
            </form>
          )}

          {/* OTP TAB */}
          {tab === "otp" && (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Mobile Number</label>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-medium text-slate-900 transition-all" placeholder="+91 9876543210" />
                    </div>
                  </div>
                  <button onClick={handleSendOtp} disabled={loading || !phone} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-colors mt-2">
                    {loading ? "Sending OTP..." : "Send OTP"}
                  </button>
                </>
              ) : (
                <form onSubmit={handleOtpSubmit} className="space-y-4">
                  <div className="text-center mb-2">
                    <p className="text-sm text-slate-500 font-medium">OTP sent to <span className="font-bold text-slate-900">{phone}</span></p>
                    <button type="button" onClick={() => setOtpSent(false)} className="text-xs font-bold text-indigo-600 hover:underline mt-1">Change Number</button>
                  </div>
                  <div>
                    <div className="relative">
                      <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input type="text" required value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-black tracking-[0.5em] text-center text-slate-900 transition-all" placeholder="••••••" />
                    </div>
                  </div>
                  <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-colors mt-2">
                    {loading ? "Verifying..." : "Verify & Log In"}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* Social Logins removed from bottom as it is now prominently at the top */}
        </div>

        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
          <p className="text-slate-500 font-medium text-sm">
            Don't have an account? <button onClick={() => { onClose(); onOpenRegister(); }} className="text-indigo-600 font-bold hover:underline">Sign up</button>
          </p>
        </div>
      </div>
    </div>
  );
}
