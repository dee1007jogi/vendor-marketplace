import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, CreditCard, ShieldCheck } from "lucide-react";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  amount: number;
  transactionType: string; // e.g., "lead_purchase", "escrow_deposit"
  userId: string;
  role: string;
  projectId?: string;
  credits?: number;
  onSuccess?: () => void;
}

export default function CheckoutModal({ isOpen, onClose, title, amount, transactionType, userId, role, projectId, credits, onSuccess }: CheckoutModalProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleCheckout = async () => {
    setProcessing(true);
    setError("");
    
    try {
      // Simulating a real payment gateway checkout delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch("/api/payments/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role, amount, transactionType, projectId, credits })
      });

      const data = await res.json();
      if (data.success) {
        if (onSuccess) onSuccess();
        onClose();
      } else {
        setError(data.error || "Payment failed");
      }
    } catch (e) {
      setError("An unexpected error occurred during checkout.");
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-sky-950/35 backdrop-blur-md" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden z-10"
        >
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          <div className="bg-gradient-to-r from-sky-600 to-blue-700 p-6 flex items-start justify-between">
            <div className="text-white">
              <h2 className="text-xl font-black">{title}</h2>
              <p className="text-sky-100 text-xs mt-1">Secured by Bussinest Escrow (CRISIL AAA Rated)</p>
            </div>
            <button onClick={onClose} className="text-sky-100 hover:text-white bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors cursor-pointer">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-end border-b border-sky-100 pb-6 mb-6">
              <span className="text-slate-500 font-extrabold uppercase tracking-wider text-xs">Total Amount</span>
              <span className="text-4xl font-black text-slate-900">₹{amount.toLocaleString()}</span>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-bold text-sm text-center border border-red-100">{error}</div>}

            <div className="space-y-4 mb-8">
              <div className="bg-sky-50/70 border border-sky-100 p-4 rounded-xl flex items-center gap-3">
                <CreditCard className="text-sky-600" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Wholesale Escrow Account / Card</p>
                  <p className="text-xs text-slate-500">Encrypted 256-bit bank transfer</p>
                </div>
                <button className="text-sky-600 font-bold text-sm">Edit</button>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={processing}
              className={`w-full py-4 rounded-xl font-black text-base flex items-center justify-center gap-2 transition-all cursor-pointer ${
                processing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25"
              }`}
            >
              {processing ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Secure Escrow...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} /> Pay ₹{amount.toLocaleString()}
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 font-medium mt-4">Protected by 50/50 Dual Escrow Milestone Release.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
