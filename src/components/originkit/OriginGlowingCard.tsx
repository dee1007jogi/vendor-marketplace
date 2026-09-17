import React from "react";
import { motion } from "framer-motion";

interface OriginGlowingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: "sky" | "amber" | "emerald" | "rose" | "indigo";
  badgeText?: string;
  onClick?: () => void;
}

export const OriginGlowingCard: React.FC<OriginGlowingCardProps> = ({
  children,
  className = "",
  glowColor = "sky",
  badgeText,
  onClick,
}) => {
  const glowStyles = {
    sky: "from-sky-500/20 via-blue-500/10 to-transparent border-sky-300/40 dark:border-sky-700/60 shadow-sky-500/10",
    amber: "from-amber-500/20 via-yellow-500/10 to-transparent border-amber-300/40 dark:border-amber-700/60 shadow-amber-500/10",
    emerald: "from-emerald-500/20 via-teal-500/10 to-transparent border-emerald-300/40 dark:border-emerald-700/60 shadow-emerald-500/10",
    rose: "from-rose-500/20 via-pink-500/10 to-transparent border-rose-300/40 dark:border-rose-700/60 shadow-rose-500/10",
    indigo: "from-indigo-500/20 via-purple-500/10 to-transparent border-indigo-300/40 dark:border-indigo-700/60 shadow-indigo-500/10",
  }[glowColor];

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      onClick={onClick}
      className={`relative group rounded-3xl p-6 bg-white/85 dark:bg-slate-900/85 backdrop-blur-2xl border ${glowStyles} shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
    >
      {/* Background Ambient Radial Glow */}
      <div
        className={`absolute -top-24 -right-24 w-48 h-48 rounded-full bg-gradient-to-br ${glowStyles} blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-500`}
      />

      {/* Animated Border Beam Sweep */}
      <div className="absolute inset-0 rounded-3xl p-[1px] bg-gradient-to-r from-transparent via-sky-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Optional Badge */}
      {badgeText && (
        <div className="absolute top-4 right-4 z-10">
          <span className="sparkle-badge px-3 py-1 rounded-full text-[11px] font-black text-slate-800 dark:text-sky-200 uppercase tracking-wider shadow-sm">
            {badgeText}
          </span>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
};

export default OriginGlowingCard;
