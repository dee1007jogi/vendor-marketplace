import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  FileQuestion, ServerCrash, Lock, WifiOff, ShieldAlert, 
  Sparkles, Terminal, CheckCircle2, ArrowRight, LayoutGrid
} from "lucide-react";
import NotFoundPage from "./NotFoundPage";
import ServerErrorPage from "./ServerErrorPage";
import ForbiddenPage from "./ForbiddenPage";
import OfflinePage from "./OfflinePage";

export default function ErrorPagesShowcase() {
  const [activeTab, setActiveTab] = useState<"404" | "500" | "403" | "offline">("404");
  const [triggerCrash, setTriggerCrash] = useState(false);

  if (triggerCrash) {
    throw new Error("Simulated Enterprise React Render Crash: Attempted to access unmapped escrow state.");
  }

  const errorTabs = [
    { id: "404", name: "404 Route Not Found", icon: <FileQuestion size={16} />, color: "border-sky-300 text-sky-900 bg-sky-100/80 shadow-xs" },
    { id: "500", name: "500 Server Error", icon: <ServerCrash size={16} />, color: "border-rose-300 text-rose-950 bg-rose-100/80 shadow-xs" },
    { id: "403", name: "403 Forbidden Access", icon: <Lock size={16} />, color: "border-amber-300 text-amber-950 bg-amber-100/80 shadow-xs" },
    { id: "offline", name: "Offline / Disconnected", icon: <WifiOff size={16} />, color: "border-emerald-300 text-emerald-950 bg-emerald-100/80 shadow-xs" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      
      {/* Top Floating Control Bar (Pastel Luminous Glass) */}
      <div className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-sky-100 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-center gap-2.5">
            <span className="p-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md">
              <LayoutGrid size={18} />
            </span>
            <div>
              <h1 className="text-sm font-black tracking-wide text-slate-900 uppercase flex items-center gap-1.5">
                Error Page Design System <Sparkles size={13} className="text-amber-500" />
              </h1>
              <p className="text-[11px] font-mono text-slate-500 font-medium">Interactive Pastel Preview & Diagnostics Hub</p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 flex-wrap">
            {errorTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-bold text-xs transition-all cursor-pointer border ${
                  activeTab === tab.id
                    ? `${tab.color} font-black shadow-md scale-105`
                    : "border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}

            <button
              onClick={() => setTriggerCrash(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl font-bold text-xs bg-rose-100 hover:bg-rose-200 text-rose-900 border border-rose-300 transition-all cursor-pointer shadow-xs"
              title="Test React Error Boundary Catch"
            >
              <ShieldAlert size={14} className="text-rose-600" /> Test ErrorBoundary
            </button>
          </div>

        </div>
      </div>

      {/* Render Active Error Page Component */}
      <div className="flex-1 w-full relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full"
          >
            {activeTab === "404" && <NotFoundPage />}
            {activeTab === "500" && <ServerErrorPage />}
            {activeTab === "403" && <ForbiddenPage />}
            {activeTab === "offline" && <OfflinePage />}
          </motion.div>
        </AnimatePresence>
      </div>

    </div>
  );
}
