import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

export interface OriginTabItem {
  id: string;
  label: string;
  icon?: LucideIcon;
  badge?: number | string;
}

interface OriginSegmentedTabsProps {
  tabs: OriginTabItem[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const OriginSegmentedTabs: React.FC<OriginSegmentedTabsProps> = ({
  tabs,
  activeTab,
  onChange,
  className = "",
  size = "md",
}) => {
  const sizeClasses = {
    sm: "px-2.5 py-1 text-xs gap-1.5",
    md: "px-4 py-2 text-sm gap-2",
    lg: "px-5 py-2.5 text-base gap-2.5",
  }[size];

  return (
    <div
      className={`inline-flex items-center p-1.5 rounded-2xl bg-slate-100/90 dark:bg-slate-900/90 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-inner ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const Icon = tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center justify-center font-extrabold rounded-xl transition-colors duration-200 cursor-pointer ${sizeClasses} ${
              isActive
                ? "text-sky-950 dark:text-sky-100"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            {/* Animated Spring Sliding Active Pill Indicator */}
            {isActive && (
              <motion.div
                layoutId="originSegmentedTabActive"
                className="absolute inset-0 bg-white dark:bg-sky-950 rounded-xl shadow-md border border-sky-200/80 dark:border-sky-800"
                transition={{ type: "spring", stiffness: 450, damping: 35 }}
              />
            )}

            {/* Content (Z-10 relative) */}
            <span className="relative z-10 flex items-center gap-1.5">
              {Icon && (
                <Icon
                  size={size === "sm" ? 13 : size === "md" ? 15 : 17}
                  className={isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-400"}
                />
              )}
              <span>{tab.label}</span>

              {tab.badge !== undefined && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                    isActive
                      ? "bg-sky-100 dark:bg-sky-900 text-sky-700 dark:text-sky-300"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {tab.badge}
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default OriginSegmentedTabs;
