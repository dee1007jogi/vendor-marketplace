import React, { useState } from "react";
import { Download, FileText, Loader2, Check } from "lucide-react";

interface ExportButtonProps {
  label?: string;
  type?: "csv" | "pdf";
  data?: any[];
  fileName?: string;
}

export default function ExportButton({ label, type = "csv", data = [], fileName = "export" }: ExportButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");

  const handleExport = () => {
    setStatus("loading");
    // Simulate network delay / generation time
    setTimeout(() => {
      setStatus("success");
      
      // Trigger fake download
      if (typeof window !== "undefined") {
        console.log(`[Exporting] ${fileName}.${type} with ${data.length} records.`);
      }

      setTimeout(() => setStatus("idle"), 2000);
    }, 1500);
  };

  return (
    <button
      onClick={handleExport}
      disabled={status === "loading"}
      className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2 text-sm disabled:opacity-70"
    >
      {status === "idle" && (type === "csv" ? <Download size={16} /> : <FileText size={16} />)}
      {status === "loading" && <Loader2 size={16} className="animate-spin text-indigo-600" />}
      {status === "success" && <Check size={16} className="text-emerald-500" />}
      
      {status === "idle" && (label || `Export ${type.toUpperCase()}`)}
      {status === "loading" && "Generating..."}
      {status === "success" && "Done"}
    </button>
  );
}
