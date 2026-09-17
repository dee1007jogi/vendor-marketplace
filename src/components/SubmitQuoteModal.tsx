import React, { useState } from 'react';
import { FileUpload } from './FileUpload';
import { Zap, Sparkles, X, Send, DollarSign, Calendar, FileText, CheckCircle2 } from 'lucide-react';

interface SubmitQuoteModalProps {
  onClose: () => void;
  requirementTitle: string;
  requirementId: string;
  leadId: string;
}

export function SubmitQuoteModal({ onClose, requirementTitle, requirementId, leadId }: SubmitQuoteModalProps) {
  const [bidAmount, setBidAmount] = useState<number>(5000);
  const [timelineWeeks, setTimelineWeeks] = useState<number>(4);
  const [coverLetter, setCoverLetter] = useState<string>('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAutoGenerating, setIsAutoGenerating] = useState(false);

  const handleAutoQuoteAI = () => {
    setIsAutoGenerating(true);
    setTimeout(() => {
      setBidAmount(4800);
      setTimelineWeeks(3);
      setCoverLetter(
        `Dear Procurement Team,\n\n` +
        `We are pleased to submit our formal commercial proposal for "${requirementTitle}". ` +
        `Our engineering team specializes in wholesale execution, ISO-certified quality assurance, ` +
        `and milestone-backed delivery guaranteed via Bussinest Escrow.\n\n` +
        `• Guaranteed SLA: 3 Weeks\n` +
        `• Full Warranty & Replacement Guarantee included\n` +
        `• Flexible Milestone-backed payments via Verified Escrow\n\n` +
        `We look forward to partnering on this project.\nBest regards,\nApex Engineering Procurement Team`
      );
      setIsAutoGenerating(false);
    }, 600);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const vendorId = localStorage.getItem("vendorMatchUserId");
      
      const propResponse = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leadId,
          requirementId,
          vendorId,
          bidAmount,
          timelineWeeks,
          coverLetter
        })
      });

      if (!propResponse.ok) {
        throw new Error("Failed to create proposal");
      }

      const { proposal } = await propResponse.json();

      if (files.length > 0 && proposal?.id) {
        const formData = new FormData();
        files.forEach(file => {
          formData.append('files', file);
        });

        const uploadRes = await fetch(`/api/proposals/${proposal.id}/attachments`, {
          method: "POST",
          body: formData
        });

        if (!uploadRes.ok) {
          throw new Error("Failed to upload attachments");
        }
      }

      alert("Proposal submitted successfully!");
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Failed to submit quote");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close on Escape key
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto"
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl my-auto max-h-[90vh] flex flex-col border border-sky-100 relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>

        {/* Modal Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-sky-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-xl z-20 shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">Submit Proposal Quote</h2>
              <span className="bg-sky-100 text-sky-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">Verified RFP</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium truncate max-w-md mt-0.5">{requirementTitle}</p>
          </div>
          <button 
            onClick={onClose} 
            className="text-slate-400 hover:text-slate-700 hover:bg-sky-50 p-2 rounded-xl transition-colors cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body Container */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* AI Auto-Quote Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md shadow-sky-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shrink-0">
                <Zap size={22} className="animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-black flex items-center gap-1.5">
                  Smart AI Auto-Quote <Sparkles size={14} className="text-amber-300" />
                </h4>
                <p className="text-xs text-sky-100 font-medium">Auto-generate optimized pricing, SLA timeline & cover letter.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoQuoteAI}
              disabled={isAutoGenerating}
              className="neo-btn bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-md transition-all cursor-pointer shrink-0 flex items-center gap-1.5"
            >
              <Zap size={14} className="fill-slate-950" />
              {isAutoGenerating ? "Generating..." : "Auto-Quote AI"}
            </button>
          </div>

          {/* Pricing & Timeline Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <DollarSign size={14} className="text-emerald-600" /> Bid Amount ($)
              </label>
              <input 
                type="number" 
                required 
                value={bidAmount} 
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" 
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                <Calendar size={14} className="text-sky-600" /> Timeline (Weeks)
              </label>
              <input 
                type="number" 
                required 
                value={timelineWeeks} 
                onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all" 
              />
            </div>
          </div>

          {/* Cover Letter Input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
              <FileText size={14} className="text-indigo-600" /> Cover Letter & Technical Approach
            </label>
            <textarea 
              required
              rows={5}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none resize-none font-medium leading-relaxed"
              placeholder="Detail your approach, technical capabilities, warranty terms, and manufacturing capacity..."
            ></textarea>
          </div>

          {/* Proposal Attachments */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Proposal Attachments</label>
            <p className="text-xs text-slate-500 mb-2">Upload your technical specifications, pitch decks, or compliance certificates.</p>
            <FileUpload 
              onFilesSelected={setFiles} 
              maxFiles={5} 
              maxSizeMB={15} 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3 sticky bottom-0 bg-white py-2">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2.5 text-sm font-black text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 rounded-xl shadow-lg shadow-sky-500/25 disabled:opacity-50 transition-all cursor-pointer flex items-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? "Submitting..." : "Send Proposal"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
