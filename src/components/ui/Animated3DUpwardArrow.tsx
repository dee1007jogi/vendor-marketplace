import React from "react";
import { motion } from "framer-motion";
import { TrendingUp, ShieldCheck, Zap, Sparkles, ArrowUpRight } from "lucide-react";

export default function Animated3DUpwardArrow() {
  return (
    <div className="relative w-full h-full min-h-[360px] sm:min-h-[400px] flex items-center justify-center p-2 select-none">
      {/* Ambient Blue Background Glow */}
      <div className="absolute w-[85%] h-[85%] bg-blue-600/20 rounded-full filter blur-[80px] pointer-events-none" />

      {/* Main 3D Arrow Stage */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center"
      >
        {/* Animated 3D Vector Arrow */}
        <svg
          viewBox="0 0 500 400"
          className="w-full h-full overflow-visible drop-shadow-[0_25px_45px_rgba(29,78,216,0.4)]"
        >
          <defs>
            <linearGradient id="arrow3dGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1d4ed8" />
              <stop offset="45%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>

            <linearGradient id="arrow3dBevel" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.4" />
            </linearGradient>

            <filter id="glow3d">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Extruded Shadow / 3D Base */}
          <path
            d="M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130"
            fill="none"
            stroke="#020617"
            strokeWidth="50"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.35"
            transform="translate(12, 22)"
          />

          {/* 3D Under-layer Bevel */}
          <motion.path
            d="M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130"
            fill="none"
            stroke="url(#arrow3dBevel)"
            strokeWidth="46"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{
              d: [
                "M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130",
                "M 50 325 L 150 205 L 230 265 L 440 55 L 370 55 M 440 55 L 440 125",
                "M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130",
              ],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Main Top Gradient Ribbon Arrow */}
          <motion.path
            d="M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130"
            fill="none"
            stroke="url(#arrow3dGradient)"
            strokeWidth="38"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow3d)"
            animate={{
              d: [
                "M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130",
                "M 50 325 L 150 205 L 230 265 L 440 55 L 370 55 M 440 55 L 440 125",
                "M 50 320 L 150 210 L 230 260 L 440 60 L 370 60 M 440 60 L 440 130",
              ],
            }}
            transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Glowing Arrow Tip Head */}
          <motion.circle
            cx="440"
            cy="60"
            r="18"
            fill="#38bdf8"
            animate={{
              scale: [1, 1.25, 1],
              opacity: [0.85, 1, 0.85],
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </svg>

        {/* Floating Growth Badges */}
        <motion.div
          animate={{ y: [-6, 6, -6] }}
          transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-1 right-2 bg-slate-900/95 backdrop-blur-md border border-sky-400/40 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-white"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-sky-400 flex items-center justify-center font-black text-xs shadow-lg shadow-blue-500/30">
            <TrendingUp size={16} className="text-white" />
          </div>
          <div>
            <div className="text-[10px] font-mono text-sky-300 uppercase tracking-wider font-extrabold">
              Renewal Surge
            </div>
            <div className="text-xs font-black text-white">+50% Savings Unlocked</div>
          </div>
        </motion.div>

        <motion.div
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
          className="absolute -bottom-2 left-2 bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-white"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-xs border border-emerald-500/30">
            <ShieldCheck size={16} />
          </div>
          <div>
            <div className="text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-wider">
              100% Protected
            </div>
            <div className="text-xs font-bold text-slate-200">Instant Escrow Lock</div>
          </div>
        </motion.div>

        {/* Dynamic Light Beam Pulse */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.98, 1.02, 0.98] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-sky-400/10 rounded-full blur-3xl pointer-events-none"
        />
      </motion.div>
    </div>
  );
}
