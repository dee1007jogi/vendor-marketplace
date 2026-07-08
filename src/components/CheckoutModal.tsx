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
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }} 
          animate={{ opacity: 1, scale: 1, y: 0 }} 
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden z-10"
        >
          <div className="bg-indigo-600 p-6 flex items-start justify-between">
            <div className="text-white">
              <h2 className="text-xl font-bold">{title}</h2>
              <p className="text-indigo-200 text-sm mt-1">Secured by VendiMatch Escrow & Stripe</p>
            </div>
            <button onClick={onClose} className="text-indigo-200 hover:text-white bg-indigo-700/50 hover:bg-indigo-700 p-2 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          
          <div className="p-8">
            <div className="flex justify-between items-end border-b border-slate-100 pb-6 mb-6">
              <span className="text-slate-500 font-bold uppercase tracking-wider text-xs">Total Amount</span>
              <span className="text-4xl font-black text-slate-900">₹{amount.toLocaleString()}</span>
            </div>

            {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-xl font-bold text-sm text-center border border-red-100">{error}</div>}

            <div className="space-y-4 mb-8">
              <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl flex items-center gap-3">
                <CreditCard className="text-slate-400" />
                <div className="flex-1">
                  <p className="text-sm font-bold text-slate-900">Card ending in 4242</p>
                  <p className="text-xs text-slate-500">Expires 12/26</p>
                </div>
                <button className="text-indigo-600 font-bold text-sm">Edit</button>
              </div>
            </div>

            <button 
              onClick={handleCheckout} 
              disabled={processing}
              className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                processing ? "bg-slate-100 text-slate-400 cursor-not-allowed" : "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/20"
              }`}
            >
              {processing ? (
                <>
                  <div className="h-5 w-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <ShieldCheck size={20} /> Pay ₹{amount.toLocaleString()}
                </>
              )}
            </button>
            <p className="text-center text-xs text-slate-400 font-medium mt-4">By proceeding, you agree to the VendiMatch Terms of Service.</p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
