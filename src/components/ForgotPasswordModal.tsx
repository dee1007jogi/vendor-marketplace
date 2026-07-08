import React, { useState } from "react";
import { X, Mail, Phone, Lock, ChevronRight, KeyRound } from "lucide-react";

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestReset: (identifier: string) => Promise<boolean>;
  onVerifyResetOtp: (identifier: string, otp: string) => Promise<{ resetToken: string }>;
  onResetPassword: (resetToken: string, newPassword: string) => Promise<void>;
  onOpenLogin: () => void;
}

export default function ForgotPasswordModal({ isOpen, onClose, onRequestReset, onVerifyResetOtp, onResetPassword, onOpenLogin }: ForgotPasswordModalProps) {
  const [step, setStep] = useState(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier) return setError("Please enter your email or mobile number");
    setLoading(true);
    setError("");
    try {
      await onRequestReset(identifier);
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Failed to send reset code");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 6) return setError("Please enter a valid 6-digit OTP");
    setLoading(true);
    setError("");
    try {
      const data = await onVerifyResetOtp(identifier, otp);
      setResetToken(data.resetToken);
      setStep(3);
    } catch (err: any) {
      setError(err.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) return setError("Passwords do not match");
    setLoading(true);
    setError("");
    try {
      await onResetPassword(resetToken, newPassword);
      alert("Password reset successfully. Please log in.");
      onClose();
      onOpenLogin();
    } catch (err: any) {
      setError(err.message || "Failed to reset password");
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
          
          {/* STEP 1: Identify */}
          {step === 1 && (
            <form onSubmit={handleRequest} className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <KeyRound size={28} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Forgot Password?</h2>
                <p className="text-slate-500 font-medium mt-2">Enter your registered email or mobile number to receive a reset code.</p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100">{error}</div>}

              <div>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={identifier} onChange={e => setIdentifier(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-medium text-slate-900 transition-all" placeholder="Email or Mobile Number" />
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-colors">
                {loading ? "Sending..." : "Send Reset Code"}
              </button>
              
              <button type="button" onClick={() => { onClose(); onOpenLogin(); }} className="w-full text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors pt-2">
                Back to Login
              </button>
            </form>
          )}

          {/* STEP 2: Verify OTP */}
          {step === 2 && (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900">Enter Reset Code</h2>
                <p className="text-slate-500 font-medium mt-2">We sent a 6-digit code to <br/><span className="font-bold text-slate-800">{identifier}</span></p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100">{error}</div>}

              <div>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" value={otp} onChange={e => setOtp(e.target.value)} maxLength={6} required className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-black tracking-[0.5em] text-center text-slate-900 transition-all" placeholder="••••••" />
                </div>
              </div>

              <button type="submit" disabled={loading || otp.length < 6} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-indigo-500/25 transition-colors">
                {loading ? "Verifying..." : "Verify Code"}
              </button>
            </form>
          )}

          {/* STEP 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleReset} className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-black text-slate-900">Set New Password</h2>
                <p className="text-slate-500 font-medium mt-2">Create a strong new password for your account.</p>
              </div>

              {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl text-center border border-red-100">{error}</div>}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">New Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-medium text-slate-900 transition-all" placeholder="••••••••" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-50 rounded-xl py-3 pl-11 pr-4 outline-none font-medium text-slate-900 transition-all" placeholder="••••••••" />
                  </div>
                </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-bold py-3 rounded-xl shadow-lg shadow-emerald-500/25 transition-colors">
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
