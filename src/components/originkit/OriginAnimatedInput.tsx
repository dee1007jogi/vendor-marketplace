import React, { useState } from "react";
import { Search, X, Command, Sparkles } from "lucide-react";

interface OriginAnimatedInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (val: string) => void;
  onClear?: () => void;
  shortcut?: string;
  label?: string;
  className?: string;
}

export const OriginAnimatedInput: React.FC<OriginAnimatedInputProps> = ({
  placeholder = "Search wholesale vendors, products or categories...",
  value: externalValue,
  onChange,
  onClear,
  shortcut = "⌘K",
  label = "Instant Search",
  className = "",
}) => {
  const [internalVal, setInternalVal] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const val = externalValue !== undefined ? externalValue : internalVal;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    if (externalValue === undefined) setInternalVal(text);
    onChange?.(text);
  };

  const handleClear = () => {
    if (externalValue === undefined) setInternalVal("");
    onChange?.("");
    onClear?.();
  };

  return (
    <div className={`flex flex-col gap-1.5 w-full ${className}`}>
      {label && (
        <label className="text-xs font-bold text-slate-700 dark:text-sky-200 flex items-center gap-1.5">
          <Sparkles size={12} className="text-amber-500 animate-pulse" />
          <span>{label}</span>
        </label>
      )}

      <div
        className={`relative flex items-center rounded-2xl bg-white/90 dark:bg-slate-900/90 border transition-all duration-300 backdrop-blur-xl shadow-md ${
          isFocused
            ? "border-sky-500 shadow-[0_0_20px_rgba(56,189,248,0.35)] ring-2 ring-sky-400/40"
            : "border-sky-200/80 dark:border-sky-900/60 hover:border-sky-400/60"
        }`}
      >
        {/* Animated Search Icon */}
        <div className="pl-4 pr-2 text-slate-400 dark:text-sky-400 flex items-center pointer-events-none transition-transform duration-300">
          <Search
            size={18}
            className={`transition-all duration-300 ${
              isFocused ? "text-sky-600 dark:text-sky-300 scale-110" : ""
            }`}
          />
        </div>

        {/* Input element */}
        <input
          type="text"
          value={val}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full py-3.5 pr-20 text-sm font-semibold text-slate-900 dark:text-slate-100 bg-transparent outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />

        {/* Right Action Icons: Clear + Shortcut Badge */}
        <div className="absolute right-3 flex items-center gap-2">
          {val && (
            <button
              onClick={handleClear}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              title="Clear input"
            >
              <X size={14} />
            </button>
          )}

          {shortcut && (
            <div className="hidden sm:flex items-center gap-0.5 px-2 py-1 rounded-lg bg-sky-100/80 dark:bg-sky-950/80 border border-sky-200/80 dark:border-sky-800 text-[10px] font-black text-sky-800 dark:text-sky-300 shadow-2xs">
              <Command size={10} />
              <span>{shortcut.replace("⌘", "")}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OriginAnimatedInput;
