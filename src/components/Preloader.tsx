import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

interface PreloaderProps {
  onComplete?: () => void;
  minDuration?: number;
}

export default function Preloader({ onComplete, minDuration = 2400 }: PreloaderProps) {
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFinished(true);
      setTimeout(() => {
        if (onComplete) onComplete();
      }, 600);
    }, minDuration);

    return () => clearTimeout(timer);
  }, [minDuration, onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          key="pastel-btrack-preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center overflow-hidden bg-[#eef5fa] select-none"
        >
          {/* Top Shutter Curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
            className="absolute top-0 left-0 right-0 h-1/2 bg-[#eef5fa] border-b border-sky-200/50 z-10"
          />

          {/* Bottom Shutter Curtain */}
          <motion.div
            initial={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.65, ease: [0.77, 0, 0.175, 1] }}
            className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#eef5fa] border-t border-sky-200/50 z-10"
          />

          {/* Embedded Scoped Styles for B-Track Path Motion */}
          <style>{`
            :root {
              --bg-surface: #eef5fa;
              --trench-shadow: rgba(130, 160, 185, 0.38);
              --blue-accent: #5baee8;
              --blue-glow: rgba(91, 174, 232, 0.38);
              --glass-base: #86c5f2;
              --glass-deep: #3b8ec8;
            }

            .stage-btrack {
              position: relative;
              width: 300px;
              height: 330px;
            }
            @media (min-width: 640px) {
              .stage-btrack {
                width: 420px;
                height: 460px;
              }
            }

            .orb-rig {
              position: absolute;
              top: 0;
              left: 0;
              width: 36px;
              height: 36px;
              margin: -18px 0 0 -18px;
              pointer-events: none;
              offset-path: path("M 150,70 L 150,410 C 220,410 320,390 320,320 C 320,255 230,240 160,240 C 220,240 300,230 300,150 C 300,70 210,70 150,70");
              animation: traceB 4.6s cubic-bezier(0.42, 0.05, 0.25, 0.98) infinite;
            }

            .glass-orb {
              width: 100%;
              height: 100%;
              border-radius: 50%;
              background: radial-gradient(
                circle at 36% 28%,
                #ffffff 0%,
                rgba(255, 255, 255, 0.88) 18%,
                rgba(195, 230, 255, 0.45) 45%,
                var(--glass-base) 75%,
                var(--glass-deep) 100%
              );
              box-shadow:
                inset 0 2px 3px rgba(255, 255, 255, 0.95),
                inset 0 -3px 5px rgba(45, 110, 160, 0.45),
                0 4px 16px var(--blue-glow),
                8px 12px 20px rgba(100, 140, 175, 0.28),
                2px 4px 6px rgba(0, 0, 0, 0.04);
              position: relative;
            }

            .glass-orb::before {
              content: "";
              position: absolute;
              top: 16%;
              left: 20%;
              width: 32%;
              height: 22%;
              border-radius: 50%;
              background: radial-gradient(circle, #ffffff 0%, rgba(255, 255, 255, 0) 80%);
              transform: rotate(-30deg);
            }

            .glass-orb::after {
              content: "";
              position: absolute;
              bottom: 12%;
              right: 18%;
              width: 25%;
              height: 20%;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(215, 240, 255, 0.85) 0%, transparent 80%);
            }

            .fluid-trail {
              stroke-dasharray: 1200;
              stroke-dashoffset: 1200;
              animation: fillFluidB 4.6s cubic-bezier(0.42, 0.05, 0.25, 0.98) infinite;
            }

            @keyframes traceB {
              0% {
                offset-distance: 0%;
                opacity: 0;
                transform: scale(0.7);
              }
              3% {
                opacity: 1;
                transform: scale(1);
              }
              94% {
                opacity: 1;
                transform: scale(1);
              }
              98%, 100% {
                offset-distance: 100%;
                opacity: 0;
                transform: scale(0.8);
              }
            }

            @keyframes fillFluidB {
              0% {
                stroke-dashoffset: 1200;
                opacity: 0;
              }
              4% {
                opacity: 1;
              }
              88% {
                stroke-dashoffset: 0;
                opacity: 1;
              }
              97%, 100% {
                stroke-dashoffset: 0;
                opacity: 0;
              }
            }
          `}</style>

          {/* Center Content Container */}
          <div className="relative z-20 flex flex-col items-center justify-center gap-6">
            <div className="stage-btrack">
              <svg viewBox="0 0 440 480" className="w-full h-full overflow-visible">
                <defs>
                  <filter id="recessShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="5" result="blur" />
                    <feOffset dx="4" dy="6" result="offset" />
                    <feComponentTransfer in="offset" result="shadow">
                      <feFuncA type="linear" slope="0.28" />
                    </feComponentTransfer>
                    <feMerge>
                      <feMergeNode in="shadow" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>

                  <linearGradient id="pastelBlueFluid" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b6e0ff" stopOpacity="0.15" />
                    <stop offset="40%" stopColor="#7fc7f8" stopOpacity="0.6" />
                    <stop offset="85%" stopColor="#4ea2e2" stopOpacity="0.95" />
                    <stop offset="100%" stopColor="#a4d7fb" stopOpacity="0.9" />
                  </linearGradient>

                  <path id="bPath" d="M 150,70 L 150,410 C 220,410 320,390 320,320 C 320,255 230,240 160,240 C 220,240 300,230 300,150 C 300,70 210,70 150,70" />
                </defs>

                <use href="#bPath" fill="none" stroke="#cfdce8" strokeWidth="36" strokeLinecap="round" strokeLinejoin="round" filter="url(#recessShadow)" />
                <use href="#bPath" fill="none" stroke="#e8f1f7" strokeWidth="28" strokeLinecap="round" strokeLinejoin="round" />
                <use href="#bPath" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.95" transform="translate(-1, -1)" />
                <use href="#bPath" className="fluid-trail" fill="none" stroke="url(#pastelBlueFluid)" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" />
              </svg>

              <div className="orb-rig">
                <div className="glass-orb" />
              </div>
            </div>

            <div className="text-xs font-bold uppercase tracking-[0.32em] text-[#8fa5b8] flex items-center gap-2">
              <span>Initializing Bussinest</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#5baee8] animate-pulse" />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


