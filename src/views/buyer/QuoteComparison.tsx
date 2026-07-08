import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, FileText, CheckCircle2, MessageSquare, Award, Star } from "lucide-react";
import { User } from "../../types";

interface QuoteComparisonProps {
  currentUser: User | null;
}

export default function QuoteComparison({ currentUser }: QuoteComparisonProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<{ requirement: any, quotes: any[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCoverLetter, setSelectedCoverLetter] = useState<{ vendorName: string, text: string } | null>(null);

  useEffect(() => {
    fetch(`/api/buyer/requirements/${id}/quotes`)
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(console.error);
  }, [id]);

  const handleAcceptQuote = async (quoteId: string) => {
    if (!confirm("Are you sure? This will award the project to this vendor and automatically decline all other quotes.")) return;

    try {
      const res = await fetch(`/api/buyer/requirements/${id}/accept-quote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quoteId })
      });
      const result = await res.json();
      if (result.success) {
        navigate(`/${currentUser?.role?.toLowerCase() === 'vendor' ? 'vendor' : 'buyer'}/projects`);
      } else {
        alert(result.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to accept quote");
    }
  };

  const trackViewAndNavigate = async (vendorId: string) => {
    try {
      await fetch("/api/buyer/tracking/view", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId: currentUser?.id, vendorId, requirementId: id })
      });
    } catch (e) {
      console.error("Failed tracking", e);
    }
    window.open(`/vendor/${vendorId}`, "_blank");
  };

  if (loading) return <div className="p-12 text-center text-slate-500 font-bold">Loading Quotes...</div>;
  if (!data || !data.requirement) return <div className="p-12 text-center text-red-500 font-bold">Requirement not found</div>;

  const { requirement, quotes } = data;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to={`/${currentUser?.role?.toLowerCase() === 'vendor' ? 'vendor' : 'buyer'}/requirements`} className="p-2 bg-white border border-slate-200 rounded-full shadow-sm hover:bg-slate-50">
          <ChevronLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-900">{requirement.title}</h1>
          <p className="text-slate-500 font-medium">Budget: ₹{requirement.budgetMin.toLocaleString()} - ₹{requirement.budgetMax.toLocaleString()} • Quotes Received: {quotes.length}</p>
        </div>
        {requirement.status === 'awarded' && (
          <div className="ml-auto bg-emerald-100 text-emerald-700 px-4 py-2 rounded-full font-bold flex items-center gap-2">
            <Award size={18} /> Project Awarded
          </div>
        )}
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 text-sm uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-bold">Vendor</th>
              <th className="px-6 py-4 font-bold">Quote Price</th>
              <th className="px-6 py-4 font-bold">Delivery</th>
              <th className="px-6 py-4 font-bold">Proposal</th>
              <th className="px-6 py-4 font-bold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {quotes.map((quote, index) => {
              const vendor = quote.vendorProfile || { companyName: "Unknown Vendor" };
              const isAccepted = quote.status === 'accepted';
              const isRejected = quote.status === 'rejected';
              
              const matchScore = quote.lead?.matchingScore || 0;
              let badgeText = "";
              if (index === 0 && matchScore >= 70 && quote.lead?.scoreBreakdown) {
                 try {
                   const bd = JSON.parse(quote.lead.scoreBreakdown);
                   badgeText = `Best match based on category (${bd.categoryScore}/30), budget (${bd.budgetScore}/15), and location (${bd.locationScore}/15).`;
                 } catch(e) {}
              }

              return (
                <tr key={quote.id} className={`hover:bg-slate-50 transition-colors ${isAccepted ? 'bg-emerald-50/50' : ''}`}>
                  <td className="px-6 py-6">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200 overflow-hidden shrink-0 mt-1">
                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${vendor.businessName || vendor.companyName}`} alt={vendor.companyName} />
                      </div>
                      <div>
                        <button onClick={() => trackViewAndNavigate(vendor.userId)} className="font-bold text-slate-900 hover:text-indigo-600 text-left block">
                          {vendor.businessName || vendor.companyName}
                        </button>
                        <div className="flex items-center gap-1 text-xs text-slate-500 mt-1 mb-2">
                          <Star size={12} className="text-amber-400 fill-amber-400" />
                          <span className="font-bold text-slate-700">{quote.vendorRating || 4.8}</span> (128)
                          {vendor.user?.verified && <CheckCircle2 size={12} className="text-emerald-500 ml-1" title="Verified Trust Badge"/>}
                        </div>
                        {badgeText && (
                          <div className="bg-indigo-50 border border-indigo-100 text-indigo-800 text-xs px-2 py-1.5 rounded-md flex items-start gap-1.5 max-w-[220px] shadow-sm">
                             <span className="font-black text-indigo-900 bg-indigo-200 px-1 rounded text-[10px] uppercase">AI</span>
                             <span className="leading-tight">{badgeText}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6 font-black text-slate-900 text-lg">
                    ₹{quote.bidAmount.toLocaleString()}
                  </td>
                  <td className="px-6 py-6 font-medium text-slate-600">
                    {quote.timelineWeeks} Weeks
                  </td>
                  <td className="px-6 py-6">
                    <button 
                      onClick={() => setSelectedCoverLetter({ vendorName: vendor.businessName || vendor.companyName, text: quote.coverLetter || "No cover letter provided." })}
                      className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <FileText size={16} /> View Cover Letter
                    </button>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center justify-end gap-3">
                      <button onClick={() => navigate("/chats")} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Chat with Vendor">
                        <MessageSquare size={20} />
                      </button>
                      
                      {requirement.status === 'open' && (
                        <button 
                          onClick={() => handleAcceptQuote(quote.id)}
                          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-bold text-sm shadow-md transition-all"
                        >
                          Accept
                        </button>
                      )}
                      {isAccepted && <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"><CheckCircle2 size={14}/> Accepted</span>}
                      {isRejected && <span className="bg-red-50 text-red-600 px-3 py-1.5 rounded-lg font-bold text-xs">Declined</span>}
                    </div>
                  </td>
                </tr>
              );
            })}
            {quotes.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-slate-500 font-medium">
                  No quotes received yet. You will be notified when vendors submit their proposals.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Cover Letter Modal */}
      {selectedCoverLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="text-xl font-black text-slate-900">Cover Letter from {selectedCoverLetter.vendorName}</h3>
              <button 
                onClick={() => setSelectedCoverLetter(null)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-200"
              >
                Close
              </button>
            </div>
            <div className="p-8">
              <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap font-medium">
                {selectedCoverLetter.text}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setSelectedCoverLetter(null)}
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-2 rounded-xl font-bold transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
