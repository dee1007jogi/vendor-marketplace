import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  WifiOff, RefreshCw, Home, SignalLow, Radio, Check, 
  Sparkles
} from "lucide-react";

export default function OfflinePage() {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(navigator.onLine);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleTestConnection = () => {
    setIsRetrying(true);
    setTimeout(() => {
      setIsRetrying(false);
      if (navigator.onLine) {
        window.location.reload();
      }
    }, 1500);
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-emerald-100/90 via-teal-50/80 to-sky-100/90 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Animated Pulse Glows */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-300/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Glossy Section Box */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_60px_rgba(16,185,129,0.12)] p-6 sm:p-10 relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Wireless Radar Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Expanding Wifi Signal Waves */}
                <motion.div 
                  animate={{ scale: [1, 1.25, 1], opacity: [0.15, 0.5, 0.15] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-0 rounded-full border border-teal-400/50"
                />
                <div className="absolute inset-8 rounded-full border border-dashed border-teal-400/30"></div>

                {/* Center Disconnected Token */}
                <div className="relative z-10 flex flex-col items-center justify-center text-center p-6 bg-white/95 rounded-3xl border border-teal-200 shadow-xl">
                  <div className="p-4 rounded-2xl bg-teal-100 text-teal-700 border border-teal-200 mb-2">
                    <WifiOff size={44} className="animate-pulse" />
                  </div>
                  <span className="text-3xl sm:text-4xl font-black text-teal-700 tracking-tight">Offline</span>
                  <span className="text-[10px] font-mono font-bold text-teal-800 uppercase tracking-widest mt-1">Radar Link Severed</span>
                </div>
              </div>
            </div>

            {/* Information & Action Section */}
            <div className="lg:col-span-7 space-y-5">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-100 border border-teal-200 text-teal-900 text-xs font-mono font-bold uppercase tracking-wider mb-2 shadow-xs">
                  <SignalLow size={14} className="text-teal-700" /> Network Connectivity Loss
                </span>
                <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                  Marketplace Gateway Offline
                </h1>
                <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
                  Your device has lost its internet connection to the Bussinest cloud marketplace node. Please inspect your Wi-Fi or cellular data link.
                </p>
              </div>

              {/* Status Indicator */}
              <div className="p-4 rounded-2xl bg-teal-50/90 border border-teal-200 flex items-center justify-between text-xs font-mono font-bold">
                <span className="text-slate-600">Connection Status:</span>
                {isOnline ? (
                  <span className="text-emerald-700 font-extrabold flex items-center gap-1.5">
                    <Check size={14} /> LINK RESTORED (CLICK RETRY)
                  </span>
                ) : (
                  <span className="text-rose-700 font-extrabold flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping"></span> DISCONNECTED
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={handleTestConnection}
                  disabled={isRetrying}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 text-white font-black text-sm px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-500/25 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw size={16} className={isRetrying ? "animate-spin" : ""} />
                  {isRetrying ? "Pinging Cloud Server..." : "Test Connection"}
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold text-sm px-5 py-3 rounded-xl transition-all shadow-sm cursor-pointer"
                >
                  <Home size={16} /> Home
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
