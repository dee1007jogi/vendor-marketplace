import React from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { 
  Compass, ArrowLeft, Home, Search, RefreshCw, Briefcase, 
  Building2, ShieldAlert, Sparkles, FileQuestion
} from "lucide-react";

export default function NotFoundPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vendors?query=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <div className="min-h-[calc(100vh-80px)] bg-gradient-to-br from-sky-100/90 via-indigo-50/80 to-blue-100/90 text-slate-900 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Background Animated Pastel Glow Spheres */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-300/30 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-[450px] h-[450px] bg-indigo-300/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(14,165,233,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(14,165,233,0.06)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

      <div className="max-w-4xl w-full mx-auto relative z-10">
        
        {/* Glossy Section Box */}
        <div className="bg-white/85 backdrop-blur-2xl rounded-3xl border border-white/90 shadow-[0_20px_60px_rgba(14,165,233,0.12)] p-6 sm:p-10 relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Visual Radar Graphic */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-60 h-60 sm:w-72 sm:h-72 flex items-center justify-center">
                
                {/* Radar Outer Rings */}
                <div className="absolute inset-0 rounded-full border border-sky-300/40 animate-ping opacity-30"></div>
                <div className="absolute inset-4 rounded-full border border-sky-400/30"></div>
                <div className="absolute inset-12 rounded-full border border-sky-400/20"></div>

                {/* Radar Sweeping Beam */}
                <motion.div 
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                  className="absolute inset-0 rounded-full bg-[conic-gradient(from_0deg,transparent_0_300deg,rgba(56,189,248,0.25)_360deg)] pointer-events-none"
                />

                {/* Floating Pastel Blips */}
                <motion.div 
                  animate={{ y: [0, -8, 0], opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 2.5 }}
                  className="absolute top-10 right-12 w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_12px_#fbbf24]"
                />
                <motion.div 
                  animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.9, 0.4] }}
                  transition={{ repeat: Infinity, duration: 3.2, delay: 0.5 }}
                  className="absolute bottom-14 left-10 w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_#34d399]"
                />

                {/* Center 404 Token Core */}
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-white/95 backdrop-blur-xl border border-sky-200 shadow-xl flex flex-col items-center justify-center p-4 text-center"
                >
                  <Compass className="text-sky-600 mb-1 animate-spin-slow" size={38} />
                  <span className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-indigo-600 to-amber-600 tracking-tighter">
                    404
                  </span>
                  <span className="text-[10px] font-mono font-bold text-sky-800 uppercase tracking-widest mt-1">Route Missing</span>
                </motion.div>
              </div>
            </div>

            {/* Error Details & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div>
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 border border-sky-200 text-sky-800 text-xs font-mono uppercase tracking-wider mb-3 font-bold shadow-xs">
                  <FileQuestion size={14} className="text-sky-600" /> Error Code: 404_ROUTE_NOT_FOUND
                </span>
                <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
                  Supply Chain Route Lost in Transit
                </h1>
                <p className="text-slate-600 text-sm sm:text-base mt-3 leading-relaxed max-w-xl font-medium">
                  The URL location you requested does not exist or has been relocated to another section of the Bussinest B2B marketplace network.
                </p>
              </div>

              {/* Quick Search Input */}
              <form onSubmit={handleSearch} className="relative max-w-md mx-auto lg:mx-0">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search verified vendors or RFPs..."
                    className="w-full pl-11 pr-28 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-xs font-medium"
                  />
                  <button
                    type="submit"
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs px-4 py-2 rounded-lg transition-all shadow-md cursor-pointer"
                  >
                    Search
                  </button>
                </div>
              </form>

              {/* Main CTA Buttons */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  onClick={() => navigate(-1)}
                  className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-5 py-3 rounded-xl font-bold text-sm transition-all shadow-sm cursor-pointer"
                >
                  <ArrowLeft size={16} /> Go Back
                </button>
                <Link
                  to="/"
                  className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-black text-sm transition-all shadow-lg shadow-sky-500/25 cursor-pointer"
                >
                  <Home size={16} /> Marketplace Home
                </Link>
                <Link
                  to="/vendors"
                  className="flex items-center gap-2 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer"
                >
                  <Building2 size={16} /> Vendor Directory
                </Link>
              </div>

              {/* System Status Footnote */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-mono text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700 font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Platform Operational
                </span>
                <span>•</span>
                <span>Bussinest Gateway v2.4</span>
                <span>•</span>
                <button onClick={() => window.location.reload()} className="hover:text-sky-700 underline flex items-center gap-1">
                  <RefreshCw size={12} /> Reload Session
                </button>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
