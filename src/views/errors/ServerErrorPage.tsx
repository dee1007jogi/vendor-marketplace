import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  ServerCrash, RefreshCw, Home, Cpu, Wrench, AlertTriangle, 
  Terminal, ChevronRight, Copy, Check, ShieldAlert, Sparkles 
} from "lucide-react";

export default function ServerErrorPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = React.useState(false);
  const [showLogs, setShowLogs] = React.useState(false);

  const errorCode = `ERR_INTERNAL_SERVER_500: Database transaction deadlock during milestone lock.
Timestamp: ${new Date().toISOString()}
Trace: at PostgreSQLPool.query (/server/db/connection.ts:84:12)
       at async HandleEscrowLock (/server/controllers/payments.ts:142:5)`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(errorCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-rose-100/90 via-pink-50/80 to-amber-100/90 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Animated Danger Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-rose-300/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-amber-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(244,63,94,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(244,63,94,0.06)_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Glossy Section Box */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_60px_rgba(244,63,94,0.12)] p-6 sm:p-10 relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Icon Animation */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-56 h-56 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Pulsing Warning Rings */}
                <motion.div 
                  animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.6, 0.2] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute inset-0 rounded-3xl border-2 border-rose-300/60"
                />
                <div className="absolute inset-6 rounded-2xl bg-rose-100/40 border border-rose-200"></div>

                {/* Animated Engine Gear spinning */}
                <motion.div 
                  animate={{ rotate: -360 }}
                  transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                  className="absolute inset-10 rounded-full border border-dashed border-rose-400/40"
                />

                {/* Center 500 Badge */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 bg-white/95 rounded-2xl border border-rose-200 shadow-xl">
                  <div className="p-3.5 rounded-2xl bg-rose-100 text-rose-600 border border-rose-200 mb-2">
                    <ServerCrash size={42} className="animate-bounce" />
                  </div>
                  <span className="text-4xl sm:text-5xl font-black text-rose-600 tracking-tight">500</span>
                  <span className="text-[10px] font-mono font-bold text-rose-800 uppercase tracking-widest mt-1">Engine Malfunction</span>
                </div>
              </div>
            </div>

            {/* Content & Action Options */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 border border-rose-200 text-rose-800 text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-xs">
                  <AlertTriangle size={14} className="text-rose-600" /> Critical System 500 Exception
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  High-Voltage Engine Maintenance
                </h1>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
                  Our automated B2B marketplace engines encountered an unexpected infrastructure anomaly while processing your request. Our engineering team has been notified.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={() => window.location.reload()}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white font-black text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-rose-500/25 cursor-pointer"
                >
                  <RefreshCw size={16} /> Re-initialize Engine
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Home size={16} /> Return to Safety
                </Link>
                <button
                  onClick={() => setShowLogs(!showLogs)}
                  className="flex items-center gap-1.5 text-xs text-rose-900 font-mono font-bold hover:bg-rose-100 px-3.5 py-2 rounded-lg bg-rose-50 border border-rose-200 cursor-pointer"
                >
                  <Terminal size={14} /> {showLogs ? "Hide Diagnostics" : "Inspect Logs"}
                </button>
              </div>

              {/* Collapsible Error Log Diagnostic Box */}
              {showLogs && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-4 rounded-xl bg-rose-50/90 border border-rose-200 font-mono text-xs text-rose-950 space-y-2 relative shadow-inner"
                >
                  <div className="flex items-center justify-between border-b border-rose-200/80 pb-2">
                    <span className="text-rose-800 font-bold flex items-center gap-1.5">
                      <Cpu size={14} /> Stack Diagnostic Trace
                    </span>
                    <button
                      onClick={handleCopyCode}
                      className="text-rose-900 hover:bg-rose-200 flex items-center gap-1 text-[11px] bg-white border border-rose-200 px-2.5 py-1 rounded cursor-pointer font-bold"
                    >
                      {copied ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                      {copied ? "Copied!" : "Copy Trace"}
                    </button>
                  </div>
                  <pre className="text-[11px] text-rose-900 whitespace-pre-wrap overflow-x-auto font-mono leading-relaxed font-semibold">
                    {errorCode}
                  </pre>
                </motion.div>
              )}

              {/* Live Telemetry Ping Box */}
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-center justify-between text-xs font-mono font-bold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                  <span className="text-amber-900">Escrow Vault API Health:</span>
                </div>
                <span className="text-amber-800 font-extrabold">DEGRADED (AUTO-RETRYING)</span>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
