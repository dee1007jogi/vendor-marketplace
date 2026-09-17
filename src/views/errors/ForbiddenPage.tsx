import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Lock, KeyRound, ArrowLeft, Home, 
  ShieldCheck, AlertOctagon 
} from "lucide-react";

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-yellow-100/90 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Security Laser Beam Background Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-amber-300/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(245,158,11,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,158,11,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Glossy Section Box */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_60px_rgba(245,158,11,0.12)] p-6 sm:p-10 relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Security Lock Vault Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Security Scanning Reticle */}
                <motion.div 
                  animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.7, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute inset-0 rounded-3xl border-2 border-amber-400/50"
                />
                
                {/* Horizontal Laser Scanning Line */}
                <motion.div 
                  animate={{ y: [-110, 110, -110] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                  className="absolute left-4 right-4 h-[2.5px] bg-gradient-to-r from-transparent via-amber-500 to-transparent shadow-[0_0_15px_#f59e0b] z-20"
                />

                {/* Center Lock Badge */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 bg-white/95 rounded-3xl border border-amber-200 shadow-xl">
                  <div className="p-4 rounded-2xl bg-amber-100 text-amber-700 border border-amber-200 mb-2">
                    <Lock size={44} className="animate-pulse" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-black text-amber-700 tracking-tight">403</span>
                  <span className="text-[10px] font-mono font-bold text-amber-800 uppercase tracking-widest mt-1">Access Restricted</span>
                </div>
              </div>
            </div>

            {/* Information & Action Section */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 border border-amber-200 text-amber-900 text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-xs">
                  <AlertOctagon size={14} className="text-amber-600" /> Security Privilege Violation 403
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Enterprise Vault Access Forbidden
                </h1>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
                  Your current user account credentials do not hold the required security clearance or role authorization (Buyer / Vendor / Admin) to access this protected marketplace endpoint.
                </p>
              </div>

              {/* Requirement Bullet Points */}
              <div className="space-y-2.5 bg-amber-50/80 p-4 rounded-2xl border border-amber-200/80 text-xs text-amber-950 font-semibold">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-600 shrink-0" />
                  <span>Requires verified account registration with appropriate role.</span>
                </div>
                <div className="flex items-center gap-2">
                  <KeyRound size={16} className="text-amber-600 shrink-0" />
                  <span>Enterprise admin features require Level 4 Security Clearance.</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={16} /> Go Back
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-amber-500/25 cursor-pointer"
                >
                  <Home size={16} /> Marketplace Home
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
