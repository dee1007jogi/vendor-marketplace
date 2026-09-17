import React from "react";

interface ShinyTextProps {
  text: string;
  className?: string;
  speed?: number;
}

export default function ShinyText({ text, className = "", speed = 3 }: ShinyTextProps) {
  return (
    <span
      className={`inline-block text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-100 to-amber-300 bg-[length:200%_auto] animate-shimmer ${className}`}
      style={{
        animationDuration: `${speed}s`,
        WebkitBackgroundClip: "text",
      }}
    >
      {text}
    </span>
  );
}
