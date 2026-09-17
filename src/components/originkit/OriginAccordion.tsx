import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";

export interface OriginAccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  badge?: string;
}

interface OriginAccordionProps {
  items: OriginAccordionItem[];
  allowMultiple?: boolean;
  className?: string;
}

export const OriginAccordion: React.FC<OriginAccordionProps> = ({
  items,
  allowMultiple = false,
  className = "",
}) => {
  const [openIds, setOpenIds] = useState<string[]>([items[0]?.id || ""]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds((prev) =>
        prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
      );
    } else {
      setOpenIds((prev) => (prev.includes(id) ? [] : [id]));
    }
  };

  return (
    <div className={`space-y-3.5 w-full ${className}`}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);

        return (
          <div
            key={item.id}
            className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
              isOpen
                ? "bg-white/95 dark:bg-slate-900/95 border-sky-300 dark:border-sky-700 shadow-lg shadow-sky-500/5 ring-1 ring-sky-400/20"
                : "bg-white/70 dark:bg-slate-900/70 border-sky-100 dark:border-sky-900/60 hover:border-sky-300/60"
            }`}
          >
            {/* Header button */}
            <button
              onClick={() => toggleItem(item.id)}
              className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left cursor-pointer transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.icon ? (
                  <div className="p-2 rounded-xl bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300 shrink-0">
                    {item.icon}
                  </div>
                ) : (
                  <Sparkles size={16} className="text-amber-500 shrink-0 animate-pulse" />
                )}

                <span className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-slate-100">
                  {item.title}
                </span>

                {item.badge && (
                  <span className="sparkle-badge px-2.5 py-0.5 rounded-full text-[10px] font-black text-sky-800 dark:text-sky-300 uppercase tracking-wider">
                    {item.badge}
                  </span>
                )}
              </div>

              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="p-1 rounded-full text-slate-400 dark:text-sky-400"
              >
                <ChevronDown size={18} />
              </motion.div>
            </button>

            {/* Expandable Content Area */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 pt-1 text-sm font-medium text-slate-600 dark:text-slate-300 border-t border-sky-100/60 dark:border-sky-900/40 leading-relaxed">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default OriginAccordion;
