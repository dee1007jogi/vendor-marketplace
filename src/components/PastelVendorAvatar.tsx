import React, { useState } from "react";

export interface PastelVendorAvatarProps {
  src?: string | null;
  name: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  roundness?: "rounded-2xl" | "rounded-full" | "rounded-3xl";
  showStatusDot?: boolean;
}

const PASTEL_PALETTES = [
  {
    gradient: "bg-gradient-to-tr from-sky-200 via-indigo-200 to-purple-200",
    text: "text-slate-800",
    border: "border-sky-200/80",
    glow: "shadow-sky-200/50",
  },
  {
    gradient: "bg-gradient-to-tr from-emerald-200 via-teal-200 to-cyan-200",
    text: "text-teal-950",
    border: "border-emerald-200/80",
    glow: "shadow-emerald-200/50",
  },
  {
    gradient: "bg-gradient-to-tr from-rose-200 via-amber-200 to-pink-200",
    text: "text-rose-950",
    border: "border-rose-200/80",
    glow: "shadow-rose-200/50",
  },
  {
    gradient: "bg-gradient-to-tr from-purple-200 via-fuchsia-200 to-pink-200",
    text: "text-purple-950",
    border: "border-purple-200/80",
    glow: "shadow-purple-200/50",
  },
  {
    gradient: "bg-gradient-to-tr from-amber-200 via-yellow-200 to-orange-200",
    text: "text-amber-950",
    border: "border-amber-200/80",
    glow: "shadow-amber-200/50",
  },
  {
    gradient: "bg-gradient-to-tr from-blue-200 via-sky-200 to-teal-200",
    text: "text-blue-950",
    border: "border-blue-200/80",
    glow: "shadow-blue-200/50",
  },
];

function getInitials(name: string): string {
  if (!name) return "V";
  const cleaned = name.trim().replace(/[^a-zA-Z0-9\s]/g, "");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return name.substring(0, 2).toUpperCase();
  if (parts.length === 1) {
    return parts[0].substring(0, Math.min(2, parts[0].length)).toUpperCase();
  }
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function getPaletteForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % PASTEL_PALETTES.length;
  return PASTEL_PALETTES[index];
}

export const PastelVendorAvatar: React.FC<PastelVendorAvatarProps> = ({
  src,
  name,
  size = "md",
  className = "",
  roundness = "rounded-2xl",
  showStatusDot = false,
}) => {
  const [hasError, setHasError] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10 text-xs font-black",
    md: "w-14 h-14 text-sm font-black",
    lg: "w-16 h-16 sm:w-20 sm:h-20 text-base sm:text-lg font-black",
    xl: "w-24 h-24 text-2xl font-black",
    "2xl": "w-32 h-32 text-4xl font-black",
  }[size];

  const initials = getInitials(name);
  const palette = getPaletteForName(name || "Vendor");
  const isValidSrc = Boolean(src && typeof src === "string" && src.trim().length > 0 && !hasError);

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {isValidSrc ? (
        <div
          className={`relative overflow-hidden ${sizeClasses} ${roundness} border-2 ${palette.border} shadow-sm bg-white group-hover:shadow-md transition-all`}
        >
          <img
            src={src!}
            alt={name}
            loading="lazy"
            decoding="async"
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover ${roundness}`}
          />
          {/* Subtle Specular Shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
        </div>
      ) : (
        /* 3D Pastel Letter Avatar Fallback */
        <div
          className={`relative flex items-center justify-center select-none overflow-hidden ${sizeClasses} ${roundness} ${palette.gradient} ${palette.text} ${palette.border} border-2 shadow-sm ${palette.glow} transition-transform group-hover:scale-105 duration-200`}
        >
          {/* Diagonal Glass Reflection */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent pointer-events-none" />
          
          {/* Inner inset shadow for 3D depth */}
          <div className="absolute inset-0 shadow-[inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-2px_4px_rgba(0,0,0,0.08)] pointer-events-none" />

          {/* Letter with 3D Emboss */}
          <span className="tracking-tight uppercase relative z-10 drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
            {initials}
          </span>
        </div>
      )}

      {showStatusDot && (
        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full shadow-sm" />
      )}
    </div>
  );
};

export default PastelVendorAvatar;
