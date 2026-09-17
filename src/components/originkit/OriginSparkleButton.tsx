import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

interface OriginSparkleButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "gold" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  icon?: React.ReactNode;
}

export const OriginSparkleButton: React.FC<OriginSparkleButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  icon,
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number; id: number }[]>([]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newRipple = { x, y, id: Date.now() };

    setRipples((prev) => [...prev, newRipple]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 text-white shadow-lg shadow-sky-600/30 border border-sky-400/40 hover:brightness-110",
    gold:
      "bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-amber-950 shadow-lg shadow-amber-500/30 border border-amber-300/60 hover:brightness-110 font-black",
    secondary:
      "bg-white dark:bg-slate-900 text-slate-800 dark:text-sky-200 shadow-md border border-sky-200 dark:border-sky-800 hover:bg-sky-50 dark:hover:bg-slate-800",
    ghost:
      "bg-transparent text-sky-700 dark:text-sky-300 hover:bg-sky-100/60 dark:hover:bg-sky-950/60 border border-transparent",
  }[variant];

  const sizeStyles = {
    sm: "px-3.5 py-1.5 text-xs rounded-xl gap-1.5",
    md: "px-5 py-2.5 text-sm rounded-2xl gap-2",
    lg: "px-7 py-3.5 text-base rounded-2xl gap-2.5",
  }[size];

  return (
    <motion.button
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      onPointerDown={handlePointerDown}
      onClick={onClick}
      className={`relative inline-flex items-center justify-center font-extrabold overflow-hidden transition-all duration-300 cursor-pointer ${variantStyles} ${sizeStyles} ${className}`}
    >
      {/* Metallic Shimmer Sweep Overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

      {/* Ripple Click Elements */}
      {ripples.map((r) => (
        <span
          key={r.id}
          className="absolute bg-white/40 rounded-full animate-ping pointer-events-none"
          style={{
            top: r.y - 20,
            left: r.x - 20,
            width: 40,
            height: 40,
          }}
        />
      ))}

      {/* Left Sparkle Icon */}
      <Sparkles
        size={size === "sm" ? 13 : size === "md" ? 16 : 18}
        className="animate-sparkle-pulse shrink-0 fill-current opacity-90"
      />

      {/* Label Content */}
      <span className="relative z-10">{children}</span>

      {/* Optional Right Icon or Default Arrow */}
      {icon ? (
        <span className="relative z-10 shrink-0">{icon}</span>
      ) : (
        <ArrowRight
          size={size === "sm" ? 13 : size === "md" ? 15 : 17}
          className="transition-transform duration-300 group-hover:translate-x-1 shrink-0"
        />
      )}
    </motion.button>
  );
};

export default OriginSparkleButton;
