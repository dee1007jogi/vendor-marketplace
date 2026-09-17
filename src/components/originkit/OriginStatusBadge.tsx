import React from "react";
import { ShieldCheck, Zap, Star, CheckCircle, AlertTriangle } from "lucide-react";

interface OriginStatusBadgeProps {
  status?: "verified" | "live" | "premium" | "warning" | "active";
  label?: string;
  size?: "sm" | "md";
  className?: string;
}

export const OriginStatusBadge: React.FC<OriginStatusBadgeProps> = ({
  status = "verified",
  label,
  size = "md",
  className = "",
}) => {
  const configs = {
    verified: {
      defaultLabel: "Verified Supplier",
      icon: ShieldCheck,
      badgeStyle:
        "bg-emerald-50 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-200 border-emerald-300 dark:border-emerald-700 shadow-emerald-500/10",
      dotColor: "bg-emerald-500",
      ping: true,
    },
    live: {
      defaultLabel: "Live Order Match",
      icon: Zap,
      badgeStyle:
        "bg-sky-50 dark:bg-sky-950/80 text-sky-800 dark:text-sky-200 border-sky-300 dark:border-sky-700 shadow-sky-500/10",
      dotColor: "bg-sky-500",
      ping: true,
    },
    premium: {
      defaultLabel: "Gold Tier Vendor",
      icon: Star,
      badgeStyle:
        "bg-amber-50 dark:bg-amber-950/80 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700 shadow-amber-500/10 font-black",
      dotColor: "bg-amber-500",
      ping: false,
    },
    warning: {
      defaultLabel: "Action Required",
      icon: AlertTriangle,
      badgeStyle:
        "bg-rose-50 dark:bg-rose-950/80 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700 shadow-rose-500/10",
      dotColor: "bg-rose-500",
      ping: true,
    },
    active: {
      defaultLabel: "Active Now",
      icon: CheckCircle,
      badgeStyle:
        "bg-blue-50 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700 shadow-blue-500/10",
      dotColor: "bg-blue-500",
      ping: true,
    },
  }[status];

  const Icon = configs.icon;

  return (
    <span
      className={`inline-flex items-center rounded-full border backdrop-blur-md font-bold shadow-2xs transition-all duration-300 ${
        size === "sm" ? "px-2.5 py-0.5 text-[10px] gap-1.5" : "px-3.5 py-1 text-xs gap-2"
      } ${configs.badgeStyle} ${className}`}
    >
      <span className="relative flex h-2 w-2">
        {configs.ping && (
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${configs.dotColor}`}
          />
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${configs.dotColor}`} />
      </span>

      <Icon size={size === "sm" ? 11 : 13} className="shrink-0 fill-current opacity-80" />

      <span>{label || configs.defaultLabel}</span>
    </span>
  );
};

export default OriginStatusBadge;
