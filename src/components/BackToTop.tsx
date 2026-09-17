import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      
      // Calculate scroll progress percentage (0 - 100)
      if (scrollHeight > 0) {
        const progress = Math.min(100, Math.max(0, (scrollTop / scrollHeight) * 100));
        setScrollProgress(progress);
      }

      // Show button after scrolling down 300px
      if (scrollTop > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  // SVG circular progress calculation
  const radius = 22;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scrollProgress / 100) * circumference;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed bottom-6 right-20 sm:right-22 z-50 flex items-center group"
        >
          {/* Tooltip on Hover */}
          <div className="absolute right-full mr-3 px-2.5 py-1 rounded-xl bg-white/95 backdrop-blur-md text-slate-800 text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap shadow-md border border-sky-200 hidden sm:flex items-center gap-1.5">
            <span>Back to top</span>
            <span className="text-sky-700 font-mono text-[10px]">({Math.round(scrollProgress)}%)</span>
          </div>

          <motion.button
            onClick={scrollToTop}
            whileHover={{ y: -3, scale: 1.05 }}
            whileTap={{ scale: 0.92 }}
            aria-label="Back to top"
            title="Back to Top"
            className="relative h-12 w-12 sm:h-13 sm:w-13 rounded-full bg-white/90 backdrop-blur-xl border border-sky-200/80 text-sky-700 shadow-xl shadow-sky-900/15 flex items-center justify-center cursor-pointer transition-colors hover:bg-white hover:text-sky-900 hover:border-sky-400 group/btn"
          >
            {/* Circular SVG Scroll Progress Ring */}
            <svg 
              className="absolute inset-0 h-full w-full -rotate-90 pointer-events-none p-0.5" 
              viewBox="0 0 52 52"
            >
              {/* Background Ring Track */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-sky-100 fill-none"
                strokeWidth="2.5"
              />
              {/* Animated Progress Ring in Gold */}
              <circle
                cx="26"
                cy="26"
                r={radius}
                className="stroke-amber-400 fill-none transition-all duration-150"
                strokeWidth="2.5"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
              />
            </svg>

            {/* Inner Glow & Arrow Icon */}
            <div className="relative z-10 flex flex-col items-center justify-center">
              <ArrowUp 
                size={20} 
                className="stroke-[2.5] text-sky-700 group-hover/btn:text-sky-950 transition-transform duration-200 group-hover/btn:-translate-y-0.5" 
              />
            </div>
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
