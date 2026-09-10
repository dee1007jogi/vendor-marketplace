import React, { useState } from "react";
import { Eye, EyeOff, Sparkles, Check, Copy, CheckCheck } from "lucide-react";

export function generateStrongPassword(): string {
  const upper = "ABCDEFGHJKLMNPQRSTUVWXYZ";
  const lower = "abcdefghijkmnopqrstuvwxyz";
  const numbers = "23456789";
  const symbols = "!@#$%&*?";
  
  // Guarantee rules
  let pwd = "";
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += upper[Math.floor(Math.random() * upper.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += lower[Math.floor(Math.random() * lower.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  pwd += numbers[Math.floor(Math.random() * numbers.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];
  pwd += symbols[Math.floor(Math.random() * symbols.length)];
  
  const allChars = upper + lower + numbers + symbols;
  for (let i = 0; i < 4; i++) {
    pwd += allChars[Math.floor(Math.random() * allChars.length)];
  }
  
  // Shuffle characters
  return pwd.split('').sort(() => 0.5 - Math.random()).join('');
}

export function getPasswordStrength(pwd: string) {
  if (!pwd) {
    return {
      score: 0,
      label: "",
      color: "text-slate-400",
      bars: ["bg-slate-200", "bg-slate-200", "bg-slate-200", "bg-slate-200"],
      rules: [
        { label: "8+ characters", passed: false },
        { label: "1 uppercase", passed: false },
        { label: "1 number", passed: false },
        { label: "1 symbol", passed: false },
      ],
    };
  }

  const hasLength = pwd.length >= 8;
  const hasUpper = /[A-Z]/.test(pwd);
  const hasLower = /[a-z]/.test(pwd);
  const hasNumber = /[0-9]/.test(pwd);
  const hasSpecial = /[^A-Za-z0-9]/.test(pwd);

  const rules = [
    { label: "8+ characters", passed: hasLength },
    { label: "1 uppercase", passed: hasUpper },
    { label: "1 number", passed: hasNumber },
    { label: "1 symbol", passed: hasSpecial },
  ];

  let score = 0;
  if (hasLength) score++;
  if (hasUpper && hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial && pwd.length >= 10) score++;

  let label = "Weak";
  let color = "text-rose-500";
  let bars = ["bg-rose-500", "bg-slate-200", "bg-slate-200", "bg-slate-200"];

  if (score === 2) {
    label = "Fair";
    color = "text-amber-500";
    bars = ["bg-amber-500", "bg-amber-500", "bg-slate-200", "bg-slate-200"];
  } else if (score === 3) {
    label = "Good";
    color = "text-blue-500";
    bars = ["bg-blue-500", "bg-blue-500", "bg-blue-500", "bg-slate-200"];
  } else if (score >= 4) {
    label = "Strong";
    color = "text-emerald-500";
    bars = ["bg-emerald-500", "bg-emerald-500", "bg-emerald-500", "bg-emerald-500"];
  }

  return { score, label, color, bars, rules };
}

interface PasswordFieldsProps {
  passwordValue: string;
  confirmValue: string;
  onPasswordChange: (val: string) => void;
  onConfirmChange: (val: string) => void;
  passwordError?: string;
  confirmError?: string;
}

export function PasswordFieldsWithSuggestion({
  passwordValue,
  confirmValue,
  onPasswordChange,
  onConfirmChange,
  passwordError,
  confirmError,
}: PasswordFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [copied, setCopied] = useState(false);

  const strength = getPasswordStrength(passwordValue);

  const handleSuggest = () => {
    const generated = generateStrongPassword();
    onPasswordChange(generated);
    onConfirmChange(generated);
    
    // Copy to clipboard
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(generated);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-500 uppercase">
          Password *
        </label>
        <button
          type="button"
          onClick={handleSuggest}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors"
          title="Click to generate and copy a strong password"
        >
          {copied ? (
            <>
              <CheckCheck size={13} className="text-emerald-600" />
              <span className="text-emerald-600">Copied & Applied!</span>
            </>
          ) : (
            <>
              <Sparkles size={13} />
              <span>Suggest Strong Password</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {/* Password input */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={passwordValue}
            onChange={(e) => onPasswordChange(e.target.value)}
            className={`w-full bg-slate-50 border ${
              passwordError ? "border-rose-400" : "border-slate-200"
            } focus:border-indigo-500 rounded-xl py-3 pl-3.5 pr-10 outline-none font-medium text-slate-900 transition-colors`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {passwordError && (
            <p className="text-red-500 text-xs mt-1">{passwordError}</p>
          )}
        </div>

        {/* Confirm input */}
        <div className="relative">
          <input
            type={showConfirm ? "text" : "password"}
            value={confirmValue}
            onChange={(e) => onConfirmChange(e.target.value)}
            className={`w-full bg-slate-50 border ${
              confirmError ? "border-rose-400" : "border-slate-200"
            } focus:border-indigo-500 rounded-xl py-3 pl-3.5 pr-10 outline-none font-medium text-slate-900 transition-colors`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {confirmError && (
            <p className="text-red-500 text-xs mt-1">{confirmError}</p>
          )}
        </div>
      </div>

      {/* Strength indicator bar & chips */}
      {passwordValue && (
        <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 mt-1 space-y-1.5 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 font-medium">Strength:</span>
            <span className={`font-bold ${strength.color}`}>{strength.label}</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5 h-1.5">
            {strength.bars.map((barColor, idx) => (
              <div
                key={idx}
                className={`h-full rounded-full transition-all duration-300 ${barColor}`}
              />
            ))}
          </div>

          <div className="grid grid-cols-2 gap-x-2 gap-y-1 pt-1">
            {strength.rules.map((rule, idx) => (
              <div
                key={idx}
                className={`flex items-center gap-1.5 text-[11px] font-medium transition-colors ${
                  rule.passed ? "text-emerald-600" : "text-slate-400"
                }`}
              >
                <div
                  className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                    rule.passed
                      ? "bg-emerald-100 text-emerald-600"
                      : "bg-slate-200 text-slate-400"
                  }`}
                >
                  <Check size={9} strokeWidth={3} />
                </div>
                <span>{rule.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
