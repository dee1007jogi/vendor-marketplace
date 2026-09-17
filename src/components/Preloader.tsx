import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function Preloader({ onComplete, minDuration = 1800 }: PreloaderProps) {
  const [isFinished, setIsFinished] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
    }, minDuration);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [minDuration, onComplete]);

  // Interactive 3D Perspective Tilt Values
  const rotateX = -mousePos.y * 25;
  const rotateY = mousePos.x * 25;

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="minimal-3d-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950/95 backdrop-blur-3xl select-none cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Top Curtain Split */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-slate-950 border-b border-sky-500/20 z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(2,132,199,0.18),transparent_70%)]" />
          </motion.div>

          {/* Bottom Curtain Split */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.55, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-slate-950 border-t border-sky-500/20 z-10"
          >
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(2,132,199,0.18),transparent_70%)]" />
          </motion.div>

          {/* Laser Gold Beam Center Split Line */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 2, opacity: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="absolute top-1/2 left-0 right-0 h-[2.5px] bg-gradient-to-r from-transparent via-amber-400 to-transparent z-30 shadow-[0_0_20px_#f59e0b] pointer-events-none -translate-y-1/2"
          />

          {/* Interactive 3D Stage Container */}
          <div className="relative z-20 flex items-center justify-center perspective-[1000px]">
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
              }}
              transition={{ type: "spring", stiffness: 180, damping: 16 }}
              className="relative w-44 h-44 sm:w-52 sm:h-52 flex items-center justify-center"
            >
              {/* Outer 3D Orbiting Gold Ring */}
              <motion.div
                animate={{ rotateZ: 360, rotateX: [0, 40, 0] }}
                transition={{
                  rotateZ: { duration: isHovered ? 3.5 : 7, repeat: Infinity, ease: "linear" },
                  rotateX: { duration: 5, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute inset-0 rounded-full border-2 border-amber-400/80 shadow-[0_0_35px_rgba(245,158,11,0.35)] flex items-center justify-between"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-amber-400 shadow-[0_0_15px_#f59e0b] -translate-x-1.5" />
                <div className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_15px_#fbbf24] translate-x-1.5" />
              </motion.div>

              {/* Middle Counter-Rotating Sky Blue Ring */}
              <motion.div
                animate={{ rotateZ: -360, rotateY: [0, 40, 0] }}
                transition={{
                  rotateZ: { duration: isHovered ? 2.8 : 5.5, repeat: Infinity, ease: "linear" },
                  rotateY: { duration: 4.5, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute inset-4 rounded-full border-2 border-sky-400/90 shadow-[0_0_35px_rgba(56,189,248,0.4)] flex items-center justify-between"
              >
                <div className="w-3 h-3 rounded-full bg-sky-400 shadow-[0_0_12px_#38bdf8] -translate-y-1.5" />
                <div className="w-3 h-3 rounded-full bg-sky-300 shadow-[0_0_12px_#7dd3fc] translate-y-1.5" />
              </motion.div>

              {/* Inner Concentric Glass Ring */}
              <motion.div
                animate={{ rotateZ: 360 }}
                transition={{ duration: isHovered ? 1.8 : 3.5, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
                className="absolute inset-8 rounded-full border border-white/50 backdrop-blur-md"
              />

              {/* Center Emissive 3D Rotating Prism Core */}
              <motion.div
                animate={{
                  rotateY: [0, 180, 360],
                  scale: isHovered ? [1.1, 1.25, 1.1] : [0.95, 1.08, 0.95],
                  translateZ: [0, 25, 0],
                }}
                transition={{
                  rotateY: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                  translateZ: { duration: 1.8, repeat: Infinity, ease: "easeInOut" },
                }}
                style={{ transformStyle: "preserve-3d" }}
                className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-tr from-sky-500 via-blue-600 to-indigo-600 rounded-2xl border-2 border-white/90 shadow-[0_0_45px_rgba(56,189,248,0.65)] flex items-center justify-center transform rotate-45"
              >
                <div className="w-7 h-7 sm:w-9 sm:h-9 bg-amber-400 rounded-xl shadow-[0_0_22px_#f59e0b] transform -rotate-45 animate-pulse" />
              </motion.div>

              {/* Interactive Radial Pulse Ring */}
              <motion.div
                animate={{
                  scale: [1, 1.55, 1],
                  opacity: [0.3, 0.75, 0.3],
                }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full bg-sky-500/10 border border-sky-400/25 pointer-events-none"
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

