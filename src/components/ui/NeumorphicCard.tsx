import React from "react";

export interface NeumorphicCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: "soft" | "inset" | "dark";
  onClick?: () => void;
}

export default function NeumorphicCard({
  children,
  className = "",
  variant = "soft",
  onClick,
}: NeumorphicCardProps) {
  const variantClass =
    variant === "inset"
      ? "neo-card-inset"
      : variant === "dark"
      ? "neo-card-dark"
      : "neo-card-soft";

  return (
    <div
      onClick={onClick}
      className={`neo-3d-card ${variantClass} ${className}`}
    >
      {children}
    </div>
  );
}
