import React from "react";

export interface Animated3DLetterAvatarProps {
  role?: "vendor" | "buyer" | "admin" | string | null;
  letter?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  className?: string;
  title?: string;
  glow?: boolean;
  customImage?: string | null;
  useCustomAvatar?: boolean;
}

export const Animated3DLetterAvatar: React.FC<Animated3DLetterAvatarProps> = ({
  role,
  letter,
  size = "md",
  className = "",
  title,
  glow = true,
  customImage,
  useCustomAvatar = true,
}) => {
  // Normalize role and determine letter:
  // Vendor -> V
  // Buyer -> B
  // Admin -> A
  // Not logged in / Guest -> B
  const normalizedRole = (role || "").toLowerCase().trim();
  
  let resolvedLetter = "B";
  let themeStyles = {
    gradient: "from-sky-500 via-blue-600 to-indigo-600",
    text: "text-white",
    ring: "ring-2 ring-sky-300/80 shadow-[0_4px_14px_rgba(14,165,233,0.32)]",
    embossClass: "letter-3d-emboss-b",
    badgeLabel: "Buyer",
    coinEdge: "#0284c7",
  };

  if (normalizedRole === "vendor") {
    resolvedLetter = "V";
    themeStyles = {
      gradient: "from-emerald-500 via-teal-500 to-sky-600",
      text: "text-white",
      ring: "ring-2 ring-emerald-300/80 shadow-[0_4px_14px_rgba(16,185,129,0.35)]",
      embossClass: "letter-3d-emboss-v",
      badgeLabel: "Vendor",
      coinEdge: "#059669",
    };
  } else if (normalizedRole === "admin") {
    resolvedLetter = "A";
    themeStyles = {
      gradient: "from-amber-400 via-amber-500 to-orange-500",
      text: "text-slate-950 font-black",
      ring: "ring-2 ring-amber-300/90 shadow-[0_4px_14px_rgba(245,158,11,0.38)]",
      embossClass: "letter-3d-emboss-a",
      badgeLabel: "Admin",
      coinEdge: "#d97706",
    };
  } else {
    // Default buyer or guest / not logged in
    resolvedLetter = "B";
    themeStyles = {
      gradient: "from-sky-500 via-blue-600 to-indigo-600",
      text: "text-white",
      ring: "ring-2 ring-sky-300/80 shadow-[0_4px_14px_rgba(14,165,233,0.32)]",
      embossClass: "letter-3d-emboss-b",
      badgeLabel: normalizedRole ? "Buyer" : "Guest (B)",
      coinEdge: "#2563eb",
    };
  }

  // If explicit letter prop was passed, use it
  if (letter && letter.trim().length > 0) {
    resolvedLetter = letter.trim().charAt(0).toUpperCase();
  }

  // Size dimensions mapping
  const sizeMap = {
    xs: { box: "w-6 h-6", text: "text-[11px]", border: "border" },
    sm: { box: "w-7 h-7", text: "text-xs", border: "border" },
    md: { box: "w-9 h-9", text: "text-sm", border: "border-1.5" },
    lg: { box: "w-11 h-11", text: "text-base font-extrabold", border: "border-2" },
    xl: { box: "w-16 h-16", text: "text-2xl font-black", border: "border-2" },
    "2xl": { box: "w-24 h-24", text: "text-4xl font-black", border: "border-4" },
  };

  const currentSize = sizeMap[size];

  const [imgError, setImgError] = React.useState(false);
  const hasCustomImage = Boolean(useCustomAvatar && customImage && customImage.trim().length > 0 && !imgError);

  if (hasCustomImage) {
    return (
      <div
        className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden ${currentSize.box} ${glow ? themeStyles.ring : ""} ${className}`}
        title={title || `${themeStyles.badgeLabel} Avatar`}
      >
        <img
          src={customImage!}
          alt={title || `${themeStyles.badgeLabel} Avatar`}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover rounded-full"
        />
        {/* Specular gloss finish */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none rounded-full" />
      </div>
    );
  }

  return (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 select-none ${currentSize.box} ${className}`}
      title={title || `${themeStyles.badgeLabel} Token (${resolvedLetter})`}
      style={{ perspective: "700px" }}
    >
      {/* 3D Rotating Token Coin */}
      <div
        className="w-full h-full relative animate-3d-letter-rotate"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        {/* Front Face (0deg) */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${themeStyles.gradient} ${themeStyles.text} ${glow ? themeStyles.ring : ""} flex items-center justify-center font-black leading-none backface-hidden shadow-inner overflow-hidden`}
          style={{
            transform: "rotateY(0deg)",
            boxShadow: "inset 0 1.5px 2px rgba(255,255,255,0.65), inset 0 -1.5px 2px rgba(0,0,0,0.18)",
          }}
        >
          {/* Subtle specular reflection diagonal shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          <span className={`${currentSize.text} ${themeStyles.embossClass} tracking-tighter drop-shadow-sm transition-transform`}>
            {resolvedLetter}
          </span>
        </div>

        {/* Back Face (180deg) */}
        <div
          className={`absolute inset-0 rounded-full bg-gradient-to-tr ${themeStyles.gradient} ${themeStyles.text} ${glow ? themeStyles.ring : ""} flex items-center justify-center font-black leading-none backface-hidden shadow-inner overflow-hidden`}
          style={{
            transform: "rotateY(180deg)",
            boxShadow: "inset 0 1.5px 2px rgba(255,255,255,0.65), inset 0 -1.5px 2px rgba(0,0,0,0.18)",
          }}
        >
          {/* Subtle specular reflection diagonal shine */}
          <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent pointer-events-none" />
          <span className={`${currentSize.text} ${themeStyles.embossClass} tracking-tighter drop-shadow-sm transition-transform`}>
            {resolvedLetter}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Animated3DLetterAvatar;
