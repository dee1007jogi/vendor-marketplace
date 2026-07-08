import React, { useState } from 'react';
import { FileUpload } from './FileUpload';

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const vendorId = localStorage.getItem("vendorMatchUserId");
      
      // Create the proposal
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

      // Upload attachments if there are any
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur z-10">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Submit Proposal Quote</h2>
            <p className="text-sm text-slate-500">{requirementTitle}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:bg-slate-100 p-2 rounded-lg">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Bid Amount ($)</label>
              <input 
                type="number" 
                required 
                value={bidAmount} 
                onChange={(e) => setBidAmount(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Timeline (Weeks)</label>
              <input 
                type="number" 
                required 
                value={timelineWeeks} 
                onChange={(e) => setTimelineWeeks(Number(e.target.value))}
                className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Cover Letter</label>
            <textarea 
              required
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
              placeholder="Detail your approach and technical capability..."
            ></textarea>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Proposal Attachments</label>
            <p className="text-xs text-slate-500 mb-2">Upload your PDF portfolios, tech specs, or pitch decks here.</p>
            <FileUpload 
              onFilesSelected={setFiles} 
              maxFiles={5} 
              maxSizeMB={15} 
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg" 
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-sm font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-5 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl disabled:opacity-50">
              {isSubmitting ? "Submitting..." : "Send Proposal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
