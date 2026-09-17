import React from "react";

export interface NeumorphicToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  labelLeft?: string;
  labelRight?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  id?: string;
}

export default function NeumorphicToggle({
  checked,
  onChange,
  labelLeft,
  labelRight,
  size = "md",
  className = "",
  id = "neo-toggle-input",
}: NeumorphicToggleProps) {
  const scaleClass =
    size === "sm"
      ? "scale-75 origin-center"
      : size === "lg"
      ? "scale-110 origin-center"
      : "";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {labelLeft && (
        <span
          onClick={() => onChange(false)}
          className={`text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
            !checked ? "text-indigo-600 font-black" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {labelLeft}
        </span>
      )}

      <div className={`neo-toggle-container ${scaleClass}`}>
        <label className="neo-toggle-switch" htmlFor={id}>
          <input
            className="neo-togglesw"
            type="checkbox"
            id={id}
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
          />
          <div className="neo-toggle-indicator left"></div>
          <div className="neo-toggle-indicator right"></div>
          <div className="neo-toggle-button"></div>
        </label>
      </div>

      {labelRight && (
        <span
          onClick={() => onChange(true)}
          className={`text-xs sm:text-sm font-bold cursor-pointer transition-colors ${
            checked ? "text-amber-600 font-black" : "text-slate-500 hover:text-slate-800"
          }`}
        >
          {labelRight}
        </span>
      )}
    </div>
  );
}
