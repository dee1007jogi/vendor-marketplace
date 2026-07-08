/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Lead, Requirement, VendorProfile, Proposal, User } from "../types";
import { 
  Building2, TrendingUp, Sparkles, Star, MapPin, 
  Clock, DollarSign, ArrowRight, ShieldCheck, 
  Settings, Check, RefreshCw, AlertCircle, 
  Send, Loader2, LineChart, UploadCloud, Trash
} from "lucide-react";

interface VendorDashboardProps {
  currentUser: User;
  vendorProfiles: VendorProfile[];
  requirements: Requirement[];
  leads: Lead[];
  proposals: Proposal[];
  onUpdateProfile: (profileData: Partial<VendorProfile>) => Promise<any>;
  onSubmitProposal: (propData: {
    leadId: string;
    requirementId: string;
    vendorId: string;
    bidAmount: number;
    timelineWeeks: number;
    coverLetter: string;
    aiOptimizedProposalText?: string;
  }) => Promise<any>;
  onOpenConsultationChat: (buyerId: string, requirementId: string) => void;
  onVerifyUser: (verificationDocs: any) => Promise<any>;
}

export default function VendorDashboard({
  currentUser,
  vendorProfiles,
  requirements,
  leads,
  proposals,
  onUpdateProfile,
  onSubmitProposal,
  onOpenConsultationChat,
  onVerifyUser,
}: VendorDashboardProps) {
  // Navigation tabs: "leads", "proposals", "profile"
  const [activeTab, setActiveTab] = useState<"leads" | "proposals" | "profile">("leads");

  // Selected lead context for active bidding overview
  const [biddingLeadId, setBiddingLeadId] = useState<string | null>(null);

  // Form states for profile configuration
  const activeProfile = useMemo(() => {
    return vendorProfiles.find(p => p.userId === currentUser.id);
  }, [vendorProfiles, currentUser]);

  const [bizName, setBizName] = useState(activeProfile?.businessName || "");
  const [bizLocation, setBizLocation] = useState(activeProfile?.location || "");
  const [bizPricingMin, setBizPricingMin] = useState(activeProfile?.pricingMin || 1000);
  const [bizPricingModel, setBizPricingModel] = useState<any>(activeProfile?.pricingModel || "fixed");
  const [profileServicesText, setProfileServicesText] = useState(activeProfile?.services.join(", ") || "");

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Agency Compliance Documents Form States
  const [gstNum, setGstNum] = useState(currentUser.verificationDocs?.gstNumber || activeProfile?.gstNumber || "");
  const [gstFileName, setGstFileName] = useState(currentUser.verificationDocs?.gstFileName || "");
  const [panNum, setPanNum] = useState(currentUser.verificationDocs?.panNumber || activeProfile?.panNumber || "");
  const [panFileName, setPanFileName] = useState(currentUser.verificationDocs?.panFileName || "");
  const [aadhaarNum, setAadhaarNum] = useState(currentUser.verificationDocs?.aadhaarNumber || "");
  const [aadhaarFileName, setAadhaarFileName] = useState(currentUser.verificationDocs?.aadhaarFileName || "");
  const [cosNum, setCosNum] = useState(currentUser.verificationDocs?.registrationNumber || "");
  const [cosFileName, setCosFileName] = useState(currentUser.verificationDocs?.cosFileName || "");
  
  const [isVerifyingSubmit, setIsVerifyingSubmit] = useState(false);

  const simulateAttachDoc = (docType: "cos" | "gst" | "pan" | "aadhaar") => {
    if (docType === "cos") {
      const num = cosNum.trim() || "COS-" + Math.floor(Math.random() * 900000 + 100000);
      setCosFileName(`CoS_Incorporation_${num}.pdf`);
    } else if (docType === "gst") {
      const num = gstNum.trim() || "07AAAAA" + Math.floor(Math.random() * 9000).toString() + "A1Z1";
      setGstFileName(`GST_Certificate_${num}.pdf`);
    } else if (docType === "pan") {
      const num = panNum.trim() || "PAN" + Math.floor(Math.random() * 90000).toString() + "A";
      setPanFileName(`PAN_Card_${num}.pdf`);
    } else if (docType === "aadhaar") {
      const num = aadhaarNum.trim() || Math.floor(Math.random() * 900000000000 + 100000000000).toString();
      setAadhaarFileName(`Aadhaar_Representative_${num.slice(-4)}.pdf`);
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cosFileName || !gstFileName || !panFileName || !aadhaarFileName) {
      alert("Vendor compliance audits require attaching all four critical documents (CoS, GST, PAN, Aadhaar).");
      return;
    }
    setIsVerifyingSubmit(true);
    try {
      await onVerifyUser({
        businessName: bizName || activeProfile?.businessName || `${currentUser.name} Agency`,
        registrationNumber: cosNum,
        cosFileName,
        gstNumber: gstNum,
        gstFileName,
        panNumber: panNum,
        panFileName,
        aadhaarNumber: aadhaarNum,
        aadhaarFileName,
      });
      alert("Agency compliance filing successfully submitted! Administrator will review your corporate registries shortly.");
    } catch (err) {
      console.error(err);
      alert("Error submitting government verification parameters.");
    } finally {
      setIsVerifyingSubmit(false);
    }
  };

  // Form states for bidding
  const [bidAmount, setBidAmount] = useState(3000);
  const [bidWeeks, setBidWeeks] = useState(6);
  const [coverLetterOutline, setCoverLetterOutline] = useState("");
  const [optimizedProposal, setOptimizedProposal] = useState("");
  
  // AI loader
  const [isAiOptimizing, setIsAiOptimizing] = useState(false);
  const [isSubmittingBid, setIsSubmittingBid] = useState(false);

  // Filter leads and proposals associated with active vendor
  const vendorLeads = useMemo(() => {
    return leads
      .filter(l => l.vendorId === currentUser.id && l.status !== "proposal_submitted")
      .sort((a, b) => b.matchingScore - a.matchingScore);
  }, [leads, currentUser]);

  const vendorProposals = useMemo(() => {
    return proposals.filter(p => p.vendorId === currentUser.id);
  }, [proposals, currentUser]);

  const activeBiddingLead = useMemo(() => {
    if (!biddingLeadId) return null;
    return leads.find(l => l.id === biddingLeadId);
  }, [biddingLeadId, leads]);

  const activeBiddingRequirement = useMemo(() => {
    if (!activeBiddingLead) return null;
    return requirements.find(r => r.id === activeBiddingLead.requirementId);
  }, [activeBiddingLead, requirements]);

  const [selectedAttachments, setSelectedAttachments] = useState<File[]>([]);


  // Initialize bid details if bidding modal opens
  const handleOpenBidding = (leadId: string) => {
    const lead = leads.find(l => l.id === leadId);
    if (!lead) return;
    const req = requirements.find(r => r.id === lead.requirementId);
    if (!req) return;

    setBiddingLeadId(leadId);
    setBidAmount(req.budgetMin + Math.round((req.budgetMax - req.budgetMin) / 2));
    setBidWeeks(req.timelineWeeks);
    setCoverLetterOutline("");
    setOptimizedProposal("");
  };

  // Enhance cover letter with Gemini
  const handleGeminiOptimizeLetter = async () => {
    if (!coverLetterOutline) {
      alert("Please enter a basic outline of your strategy or cover letter notes in the textarea to optimize.");
      return;
    }
    if (!activeBiddingRequirement) return;

    setIsAiOptimizing(true);
    setOptimizedProposal("");

    try {
      const response = await fetch("/api/proposals/gemini-optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coverLetter: coverLetterOutline,
          requirementId: activeBiddingRequirement.id,
          vendorBusinessName: activeProfile?.businessName || currentUser.name
        })
      });

      if (!response.ok) {
        throw new Error("Gemini copywriting service failed.");
      }

      const data = await response.json();
      if (data.optimizedText) {
        setOptimizedProposal(data.optimizedText);
      }
    } catch (err) {
      console.error(err);
      alert("AI optimizer fallback: Structured a premium document layout for you.");
      // Fallback
      setOptimizedProposal(`### AI Optimized Proposal Pitch\n\n**Executive Summary:**\nWe are highly qualified to deliver the "${activeBiddingRequirement.title}" project. Our standard portfolio demonstrates MERN matching capabilities and rapid turnaround speeds.\n\n**Commitment Strategy:**\n${coverLetterOutline}\n\n**Milestones Planned:**\n- Core modules creation: Week 1-3\n- Full backend testing & QA handoff: Week 4-6`);
    } finally {
      setIsAiOptimizing(false);
    }
  };

  // Submit complete bid proposal
  const handleSubmitBidCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeBiddingLead || !activeBiddingRequirement) return;

    setIsSubmittingBid(true);
    try {
      await onSubmitProposal({
        leadId: activeBiddingLead.id,
        requirementId: activeBiddingRequirement.id,
        vendorId: currentUser.id,
        bidAmount,
        timelineWeeks: bidWeeks,
        coverLetter: coverLetterOutline || "See our attached technical proposals.",
        aiOptimizedProposalText: optimizedProposal || undefined
      });

      setBiddingLeadId(null);
      setActiveTab("proposals");
    } catch (err) {
      console.error(err);
      alert("Bid registration failed. Check container logs.");
    } finally {
      setIsSubmittingBid(false);
    }
  };

  // Save profile settings
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);

    try {
      const servicesArray = profileServicesText
        .split(",")
        .map(s => s.trim())
        .filter(s => s.length > 0);

      await onUpdateProfile({
        userId: currentUser.id,
        businessName: bizName,
        location: bizLocation,
        pricingMin: Number(bizPricingMin),
        pricingModel: bizPricingModel,
        services: servicesArray,
      });

      // Show alert or confirm transition
      alert("Platform settings saved successfully. Matching leads will instantly recalibrate!");
    } catch (err) {
      console.error(err);
      alert("Failed updating platform details.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Calculated stats summary
  const statistics = useMemo(() => {
    const totalEarningsEst = vendorProposals
      .filter(p => p.status === "accepted")
      .reduce((sum, current) => sum + current.bidAmount, 0);

    const pendingBidsCount = vendorProposals.filter(p => p.status === "pending").length;
    const conversionRate = vendorProposals.length > 0 
      ? Math.round((vendorProposals.filter(p => p.status === "accepted").length / vendorProposals.length) * 100) 
      : 0;

    return {
      totalEarningsEst,
      pendingBidsCount,
      conversionRate,
      activeLeadsCount: vendorLeads.length
    };
  }, [vendorProposals, vendorLeads]);

  return (
    <div className="space-y-8" id="vendor-dashboard-root">
      
      {/* Upper Analytics row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Stat 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Pipeline Closed Value</span>
            <DollarSign size={18} className="text-emerald-500" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-950">${statistics.totalEarningsEst}</span>
            <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-0.5">
              <TrendingUp size={11} /> 100% Client satisfaction rate
            </p>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Active Bids Pending</span>
            <Send size={16} className="text-indigo-500" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-950">{statistics.pendingBidsCount}</span>
            <p className="text-[10px] text-slate-500 mt-1 font-semibold">Active negotiations pipeline</p>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Conversion rate</span>
            <LineChart size={18} className="text-indigo-400" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-950">{statistics.conversionRate}%</span>
            <p className="text-[10px] text-indigo-600 font-semibold mt-1">Proposal to win ratio</p>
          </div>
        </div>

        {/* Stat 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Direct Matching opportunities</span>
            <Sparkles size={16} className="text-teal-500 fill-teal-100" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-950">{statistics.activeLeadsCount}</span>
            <p className="text-[10px] text-teal-600 font-semibold mt-1">Rule-based category matches</p>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Tab configuration panel left */}
        <div className="col-span-1 lg:col-span-3 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">Vendor Management Options</h2>
          <div className="flex flex-row lg:flex-col gap-2 flex-wrap">
            <button
              onClick={() => {
                setActiveTab("leads");
                setBiddingLeadId(null);
              }}
              className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                activeTab === "leads"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                  : "bg-white border-transparent text-slate-600 hover:bg-slate-50"
              }`}
              id="vendor-leads-btn"
            >
              RFP Lead Stream ({vendorLeads.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("proposals");
                setBiddingLeadId(null);
              }}
              className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                activeTab === "proposals"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                  : "bg-white border-transparent text-slate-600 hover:bg-slate-50"
              }`}
              id="active-bids-btn"
            >
              My Submitted Bids ({vendorProposals.length})
            </button>

            <button
              onClick={() => {
                setActiveTab("profile");
                setBiddingLeadId(null);
              }}
              className={`flex-1 lg:flex-initial text-left px-4 py-2.5 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                activeTab === "profile"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 font-bold"
                  : "bg-white border-transparent text-slate-600 hover:bg-slate-50"
              }`}
              id="profile-settings-btn"
            >
              Agency Profile Settings
            </button>
          </div>
        </div>

        {/* Dynamic content grid right */}
        <div className="col-span-1 lg:col-span-9">
          
          {activeTab === "leads" && !biddingLeadId && (
            /* Match leads list feed */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">RFP Matching Lead Stream</h3>
                <p className="text-xs text-slate-500">Curated opportunities aligning with your target industry settings and pricing thresholds.</p>
              </div>

              {vendorLeads.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <AlertCircle className="mx-auto text-slate-300" size={28} />
                  <h4 className="font-bold text-slate-700 text-sm">No Active Incoming Leads</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Try updating your listed skills array in settings to raise matching confidence thresholds!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendorLeads.map((lead) => {
                    const req = requirements.find(r => r.id === lead.requirementId);
                    if (!req) return null;
                    return (
                      <div key={lead.id} className="border border-slate-100 p-4.5 rounded-2xl hover:border-slate-350 transition-all flex flex-col justify-between sm:flex-row sm:items-center gap-4 bg-slate-50/50">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="bg-slate-100 text-slate-600 text-[9px] uppercase font-bold px-2 py-0.5 rounded">
                              {req.category}
                            </span>
                            
                            <span className="text-[10px] text-slate-400 font-bold">RFP No: {req.id}</span>
                          </div>

                          <h4 className="font-bold text-slate-950 text-sm leading-tight">{req.title}</h4>
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{req.description}</p>
                          
                          <div className="flex gap-4 text-xs font-semibold text-slate-500 flex-wrap">
                            <span className="flex items-center gap-0.5 text-slate-900 font-bold">
                              Budget: ${req.budgetMin} - ${req.budgetMax}
                            </span>
                            <span>•</span>
                            <span>Target Duration: {req.timelineWeeks} Weeks</span>
                            <span>•</span>
                            <span>Workspace: {req.locationPreference}</span>
                          </div>
                        </div>

                        {/* Matching indices block */}
                        <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 border-t sm:border-t-0 border-slate-200/50 pt-3 sm:pt-0">
                          <div className="text-left sm:text-right bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl text-emerald-800 text-xs font-bold leading-none flex items-center gap-1 font-mono">
                            <TrendingUp size={12} className="text-emerald-500" />
                            <span>{lead.matchingScore}% Fit</span>
                          </div>
                          
                          <button
                            onClick={() => handleOpenBidding(lead.id)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-xs font-bold transition-all shadow-sm flex items-center gap-1 cursor-pointer"
                            id={`accept-lead-[${lead.id}]`}
                          >
                            <span>Construct Bid RFP</span>
                            <ArrowRight size={12} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Active RFP Tender Bid Creation modal overlay */}
          {activeTab === "leads" && biddingLeadId && activeBiddingRequirement && activeBiddingLead && (
            <div className="bg-white border border-indigo-200 rounded-3xl p-6 sm:p-8 shadow-md shadow-indigo-50 space-y-6">
              
              {/* Back to stream row */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <button
                  onClick={() => setBiddingLeadId(null)}
                  className="text-slate-500 hover:text-slate-800 text-xs font-bold uppercase transition-colors cursor-pointer"
                >
                  ← Return to RFP Lead Stream
                </button>
                <div className="bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg text-xs font-bold font-mono">
                  {activeBiddingLead.matchingScore}% Weighted Match score
                </div>
              </div>

              {/* Requirement Summary */}
              <div className="bg-slate-50 p-4.5 rounded-2xl border border-slate-100 space-y-2">
                <span className="text-[10px] font-extrabold uppercase text-indigo-700 block bg-indigo-50 border border-indigo-100 w-max px-2 py-0.5 rounded">Client RFP Scope Specs</span>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">{activeBiddingRequirement.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">{activeBiddingRequirement.description}</p>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200/50">
                  <p>Target budget space: <strong className="text-slate-800">${activeBiddingRequirement.budgetMin} - ${activeBiddingRequirement.budgetMax}</strong></p>
                  <p>Client delivery goal: <strong className="text-slate-800">{activeBiddingRequirement.timelineWeeks} Weeks max</strong></p>
                  <p>RFP Location model: <strong className="text-slate-800">{activeBiddingRequirement.locationPreference} Map</strong></p>
                </div>
              </div>

              {/* Bid configuration form */}
              <form onSubmit={handleSubmitBidCampaign} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Bid Price */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Bid Contract Value ($)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={bidAmount}
                      onChange={(e) => setBidAmount(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-extrabold focus:outline-none focus:border-indigo-500 text-slate-800"
                    />
                    <p className="text-[10px] text-slate-400">Specify your total commercial scope cost.</p>
                  </div>

                  {/* Proposed Timeline */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Bidding Timeline (Weeks)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={52}
                      value={bidWeeks}
                      onChange={(e) => setBidWeeks(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-extrabold focus:outline-none focus:border-indigo-500 text-slate-800"
                    />
                    <p className="text-[10px] text-slate-400">Client schedule goals were configured at {activeBiddingRequirement.timelineWeeks} weeks.</p>
                  </div>
                </div>

                {/* Cover letter draft */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5 flex flex-col">
                    <label className="block text-xs font-bold uppercase text-slate-400">RFP Pitch Proposal outline</label>
                    <textarea
                      placeholder="Outline your capability strategy, tech execution plans, and scheduling estimates draft. Click optimize with Gemini to format professionally."
                      value={coverLetterOutline}
                      onChange={(e) => setCoverLetterOutline(e.target.value)}
                      className="w-full flex-1 min-h-[160px] px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:bg-white focus:outline-none font-medium text-slate-800 leading-relaxed resize-none"
                    />
                    
                    {/* Gemini Optimization action */}
                    <button
                      type="button"
                      onClick={handleGeminiOptimizeLetter}
                      disabled={isAiOptimizing}
                      className="w-full mt-2 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-teal-300 rounded-xl py-2 px-4 text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm cursor-pointer disabled:opacity-50"
                      id="optimize-proposal-btn"
                    >
                      {isAiOptimizing ? (
                        <>
                          <Loader2 size={13} className="animate-spin text-teal-300" />
                          <span>Gemini Copywriting Architect...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles size={13} className="fill-teal-300 text-teal-300" />
                          <span>Structure Proposal Outline with Gemini AI</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Gemini Refined Output preview */}
                  <div className="space-y-1.5 flex flex-col">
                    <label className="block text-xs font-bold uppercase text-slate-400">Refined Content Preview (Optional)</label>
                    <div className="w-full flex-1 min-h-[160px] max-h-[300px] overflow-y-auto px-4 py-3 bg-indigo-50/40 border border-indigo-200 rounded-xl text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line prose select-text">
                      {optimizedProposal || "AI formatted proposal layouts will display preview lines once compiled above."}
                    </div>
                  </div>
                </div>

                {/* Bidding footer submit */}
                <div className="flex justify-end gap-3 border-t border-slate-100 pt-5 mt-4">
                  <button
                    type="button"
                    onClick={() => setBiddingLeadId(null)}
                    className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
                  >
                    Draft Cancel
                  </button>
                  
                  <button
                    type="submit"
                    disabled={isSubmittingBid}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-1 cursor-pointer disabled:opacity-50"
                    id="submit-proposal-btn"
                  >
                    {isSubmittingBid ? "Registering bid..." : "Publish RFP Bid Proposal Campaign"}
                    <Send size={12} />
                  </button>
                </div>

              </form>
            </div>
          )}

          {activeTab === "proposals" && (
            /* Vendor Submitted Proposals list */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">My Submitted RFP Bids</h3>
                <p className="text-xs text-slate-500">Track pending review cycles, shortlisted negotiations, or finalized contracts.</p>
              </div>

              {vendorProposals.length === 0 ? (
                <div className="text-center py-10 space-y-1">
                  <AlertCircle className="mx-auto text-slate-350" size={26} />
                  <h4 className="font-bold text-slate-800 text-sm">No Claims Submitted</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto">
                    Check the RFP Matching Lead stream to draft bids and register deals.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {vendorProposals.map((prop) => {
                    const reqObj = requirements.find(r => r.id === prop.requirementId);
                    return (
                      <div key={prop.id} className="border border-slate-100 p-4 rounded-xl space-y-3 bg-slate-50/40">
                        <div className="flex items-start justify-between flex-wrap gap-2 text-xs">
                          <div>
                            <h4 className="font-bold text-slate-950 text-sm">{reqObj?.title || `Requirement No: ${prop.requirementId}`}</h4>
                            <p className="text-[10px] text-slate-500 font-semibold mt-0.5">Bid ID: {prop.id} • Target delivery schedule: {prop.timelineWeeks} Weeks</p>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 font-mono text-sm">${prop.bidAmount}</span>
                            
                            <span className={`inline-block text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full ${
                              prop.status === "accepted"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : prop.status === "shortlisted"
                                ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                : "bg-slate-100 text-slate-600 border"
                            }`}>
                              {prop.status}
                            </span>
                          </div>
                        </div>

                        <p className="text-xs text-slate-600 line-clamp-2 italic italic-leading">"{prop.coverLetter}"</p>

                        {prop.status === "accepted" && (
                          <div className="border-t border-slate-200/50 pt-2 flex justify-between items-center text-xs">
                            <span className="text-slate-500 flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                              <ShieldCheck size={12} /> Contract Sealed & Binding
                            </span>
                            
                            <button
                              onClick={() => onOpenConsultationChat(reqObj?.buyerId || "", prop.requirementId)}
                              className="text-indigo-600 hover:underline font-bold text-[11px] cursor-pointer"
                            >
                              Go to Chat workspace →
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "profile" && (
            /* Profile Settings configurations */
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-bold text-slate-900">Agency Settings & Qualifications</h3>
                <p className="text-xs text-slate-500">Edit business parameters to auto-tune matching indexes computed by backend algorithms.</p>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Agency Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Business Agency Name</label>
                    <input
                      type="text"
                      required
                      value={bizName}
                      onChange={(e) => setBizName(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Operating City, State</label>
                    <input
                      type="text"
                      required
                      value={bizLocation}
                      onChange={(e) => setBizLocation(e.target.value)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* pricing threshold */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Starting Entrance Rate ($)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      value={bizPricingMin}
                      onChange={(e) => setBizPricingMin(Number(e.target.value))}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-800"
                    />
                  </div>

                  {/* Pricing Model */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Pricing Strategy Model</label>
                    <select
                      value={bizPricingModel}
                      onChange={(e) => setBizPricingModel(e.target.value as any)}
                      className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold text-slate-800 cursor-pointer"
                    >
                      <option value="fixed">Fixed-Price Contracts</option>
                      <option value="hourly">Hourly Billing Rate</option>
                      <option value="hybrid">Hybrid retainers</option>
                    </select>
                  </div>
                </div>

                {/* Services comma array */}
                <div className="space-y-1.5 pt-1">
                  <label className="block text-xs font-bold uppercase text-slate-400">Services & Skills Tag Matrix</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MERN Fullstack development, Figma UI/UX, Docker, API integration"
                    value={profileServicesText}
                    onChange={(e) => setProfileServicesText(e.target.value)}
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-indigo-500 text-slate-850"
                  />
                  <p className="text-[10px] text-slate-400 font-medium">Coordinate skills array separated by commas for optimal alignment parsing.</p>
                </div>

                <div className="flex justify-end pt-4 border-t border-slate-50 mt-4">
                  <button
                    type="submit"
                    disabled={isUpdatingProfile}
                    className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isUpdatingProfile ? "Calibrating database..." : "Recalibrate Matching Metrics"}
                  </button>
                </div>
              </form>

              {/* B2B Agency Compliance Upload Panel */}
              <div className="border-t border-slate-100 pt-6 space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <ShieldCheck className="text-indigo-600" size={18} />
                    <span>Government B2B Registry Compliance Audit</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Upload official corporate registration, tax ID numbers, administrative identification certificates to earn a verified green badge. Verified vendors enjoy 6x priority on lead matches.
                  </p>
                </div>

                {/* Status Banners */}
                {currentUser.verified ? (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3">
                    <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs">
                      <span className="font-bold block text-sm">Agency Fully Verified!</span>
                      <p className="mt-1 font-medium">Your business parameters (GST, Corporate Registration, PAN, and Aadhaar) are audited against ministry records. Clients see a green 'Verified' seal next to your proposals.</p>
                    </div>
                  </div>
                ) : currentUser.verificationDocs?.cosStatus === "pending" || currentUser.verificationDocs?.gstStatus === "pending" ? (
                  <div className="bg-amber-50 border border-amber-200 text-amber-805 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-amber-600 shrink-0 mt-0.5 animate-pulse" size={18} />
                    <div className="text-xs">
                      <span className="font-bold block text-sm text-amber-900">Regulatory Audit Pending...</span>
                      <p className="mt-1 font-semibold text-amber-700">Your documents (GST, PAN, Aadhaar, CoS) are currently with our trust compliance operations officer. Bids placed during audit remain active.</p>
                    </div>
                  </div>
                ) : currentUser.verificationDocs?.cosStatus === "rejected" || currentUser.verificationDocs?.gstStatus === "rejected" ? (
                  <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs text-rose-700">
                      <span className="font-bold block text-sm text-rose-950">Filing Resubmission Mandatory</span>
                      <p className="mt-1 font-semibold">Feedback: {currentUser.verificationDocs.rejectReason || "Incorrect or illegible documentation files attached."}</p>
                      <p className="mt-1 text-[11px] font-semibold text-rose-600">Please audit the document inputs and upload correct, complete files below.</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-indigo-50 border border-indigo-100 text-indigo-850 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle className="text-indigo-650 shrink-0 mt-0.5" size={18} />
                    <div className="text-xs font-medium">
                      <span className="font-bold block text-indigo-900">Compliance Deficit Warning</span>
                      <p className="mt-1 leading-relaxed">Your business credentials represent a self-declared state. Submit the four government documents below to gain client trust, unlock high-budget bids, and accelerate payout routes.</p>
                    </div>
                  </div>
                )}

                {/* Submissions form */}
                {!currentUser.verified && (
                  <form onSubmit={handleVerifySubmit} className="space-y-6">
                    {/* The 4 fields (CoS, GST, PAN, Aadhaar) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Certificate of Incorporation */}
                      <div className="space-y-2 p-4 border border-slate-150 rounded-2xl bg-slate-50 relative">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">1. Company Registration (CoS)</span>
                        <div className="space-y-1.5 mt-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">CIN / REG ID</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. U72200KA2021PTC123456"
                            value={cosNum}
                            onChange={(e) => setCosNum(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-800 font-medium"
                          />
                        </div>
                        <div className="mt-3">
                          {cosFileName ? (
                            <div className="flex justify-between items-center bg-indigo-50/50 p-2 rounded-xl text-[10px] border border-indigo-100 font-sans">
                              <span className="font-bold text-slate-700 truncate max-w-[150px]">{cosFileName}</span>
                              <button type="button" onClick={() => setCosFileName("")} className="text-rose-600 font-bold hover:underline cursor-pointer">Clear</button>
                            </div>
                          ) : (
                            <div onClick={() => simulateAttachDoc("cos")} className="border-2 border-dashed border-slate-300 hover:border-indigo-400 p-3 text-center rounded-xl bg-white cursor-pointer transition-colors">
                              <span className="text-[10px] font-bold text-indigo-650 block">✓ Mock Attach CoS Document</span>
                              <p className="text-[8px] text-slate-400">Click to automatically generate standard incorporation receipt</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* GST Number */}
                      <div className="space-y-2 p-4 border border-slate-150 rounded-2xl bg-slate-50 relative">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">2. Goods and Services Tax (GST)</span>
                        <div className="space-y-1.5 mt-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">GSTIN Identification</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 29AAAAA1111A1Z1"
                            value={gstNum}
                            onChange={(e) => setGstNum(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-800 font-medium"
                          />
                        </div>
                        <div className="mt-3">
                          {gstFileName ? (
                            <div className="flex justify-between items-center bg-indigo-50/50 p-2 rounded-xl text-[10px] border border-indigo-100 font-sans">
                              <span className="font-bold text-slate-700 truncate max-w-[150px]">{gstFileName}</span>
                              <button type="button" onClick={() => setGstFileName("")} className="text-rose-600 font-bold hover:underline cursor-pointer">Clear</button>
                            </div>
                          ) : (
                            <div onClick={() => simulateAttachDoc("gst")} className="border-2 border-dashed border-slate-300 hover:border-indigo-400 p-3 text-center rounded-xl bg-white cursor-pointer transition-colors">
                              <span className="text-[10px] font-bold text-indigo-650 block">✓ Mock Attach GST Certificate</span>
                              <p className="text-[8px] text-slate-400">Click to attach state compliance GST papers</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Business PAN */}
                      <div className="space-y-2 p-4 border border-slate-150 rounded-2xl bg-slate-50 relative">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">3. Corporate PAN ID</span>
                        <div className="space-y-1.5 mt-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Permanent Account Number</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. AAAAA1111A"
                            value={panNum}
                            onChange={(e) => setPanNum(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-800 font-medium"
                          />
                        </div>
                        <div className="mt-3">
                          {panFileName ? (
                            <div className="flex justify-between items-center bg-indigo-50/50 p-2 rounded-xl text-[10px] border border-indigo-100 font-sans">
                              <span className="font-bold text-slate-700 truncate max-w-[150px]">{panFileName}</span>
                              <button type="button" onClick={() => setPanFileName("")} className="text-rose-600 font-bold hover:underline cursor-pointer">Clear</button>
                            </div>
                          ) : (
                            <div onClick={() => simulateAttachDoc("pan")} className="border-2 border-dashed border-slate-300 hover:border-indigo-400 p-3 text-center rounded-xl bg-white cursor-pointer transition-colors">
                              <span className="text-[10px] font-bold text-indigo-650 block">✓ Mock Attach PAN Card</span>
                              <p className="text-[8px] text-slate-400">Click to generate director/business tax identity card</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Aadhaar Representative */}
                      <div className="space-y-2 p-4 border border-slate-150 rounded-2xl bg-slate-50 relative">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 block">4. Aadhaar Representative Identity</span>
                        <div className="space-y-1.5 mt-1.5">
                          <label className="block text-[10px] font-bold text-slate-500 uppercase">Director UIDAI Aadhaar Number</label>
                          <input
                            type="text"
                            required
                            placeholder="e.g. 1293 8374 9283 (12 Digits)"
                            value={aadhaarNum}
                            onChange={(e) => setAadhaarNum(e.target.value)}
                            className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-indigo-500 font-mono text-slate-800 font-medium"
                          />
                        </div>
                        <div className="mt-3">
                          {aadhaarFileName ? (
                            <div className="flex justify-between items-center bg-indigo-50/50 p-2 rounded-xl text-[10px] border border-indigo-100 font-sans">
                              <span className="font-bold text-slate-700 truncate max-w-[150px]">{aadhaarFileName}</span>
                              <button type="button" onClick={() => setAadhaarFileName("")} className="text-rose-600 font-bold hover:underline cursor-pointer">Clear</button>
                            </div>
                          ) : (
                            <div onClick={() => simulateAttachDoc("aadhaar")} className="border-2 border-dashed border-slate-300 hover:border-indigo-400 p-3 text-center rounded-xl bg-white cursor-pointer transition-colors">
                              <span className="text-[10px] font-bold text-indigo-650 block">✓ Mock Attach Aadhaar Card</span>
                              <p className="text-[8px] text-slate-400">Click to automatically upload verification ID profile</p>
                            </div>
                          )}
                        </div>
                      </div>

                    </div>

                    <div className="flex justify-end pt-2 border-t border-slate-100 mt-2">
                      <button
                        type="submit"
                        disabled={isVerifyingSubmit || !cosFileName || !gstFileName || !panFileName || !aadhaarFileName}
                        className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:shadow-md transition-all font-sans"
                      >
                        {isVerifyingSubmit ? (
                          <>
                            <Loader2 size={12} className="animate-spin" />
                            <span>Uploading compliance items...</span>
                          </>
                        ) : (
                          "Transmit Compliance Audit Filing"
                        )}
                      </button>
                    </div>
                  </form>
                )}

                {/* Compliance History Folders catalog */}
                {(currentUser.verified || currentUser.verificationDocs?.cosStatus) && (
                  <div className="bg-slate-50/50 rounded-2xl p-4 border border-slate-200/60 space-y-3 font-sans">
                    <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Audited Compliance catalog</h5>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      {/* Document row Incorporation */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex justify-between items-center">
                        <div>
                          <span className="font-bold block text-slate-800">Certificate of Incorporation</span>
                          <span className="text-[9px] text-slate-450 font-mono block mt-0.5">{currentUser.verificationDocs?.cosFileName || "CoS_Certificate.pdf"}</span>
                        </div>
                        <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full border truncate capitalize ${
                          currentUser.verificationDocs?.cosStatus === "approved" || currentUser.verified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {currentUser.verified ? "approved" : (currentUser.verificationDocs?.cosStatus || "pending")}
                        </span>
                      </div>

                      {/* GST */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex justify-between items-center">
                        <div>
                          <span className="font-bold block text-slate-800">Tax Registration GST Certificate</span>
                          <span className="text-[9px] text-slate-450 font-mono block mt-0.5">{currentUser.verificationDocs?.gstFileName || "GST_Certificate.pdf"}</span>
                        </div>
                        <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full border truncate capitalize ${
                          currentUser.verificationDocs?.gstStatus === "approved" || currentUser.verified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {currentUser.verified ? "approved" : (currentUser.verificationDocs?.gstStatus || "pending")}
                        </span>
                      </div>

                      {/* PAN */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex justify-between items-center">
                        <div>
                          <span className="font-bold block text-slate-800">Corporate PAN registration</span>
                          <span className="text-[9px] text-slate-450 font-mono block mt-0.5">{currentUser.verificationDocs?.panFileName || "PAN_Card.pdf"}</span>
                        </div>
                        <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full border truncate capitalize ${
                          currentUser.verificationDocs?.panStatus === "approved" || currentUser.verified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {currentUser.verified ? "approved" : (currentUser.verificationDocs?.panStatus || "pending")}
                        </span>
                      </div>

                      {/* Aadhaar */}
                      <div className="p-3 bg-white rounded-xl border border-slate-200/80 flex justify-between items-center">
                        <div>
                          <span className="font-bold block text-slate-800">Director Aadhaar Verification</span>
                          <span className="text-[9px] text-slate-450 font-mono block mt-0.5">{currentUser.verificationDocs?.aadhaarFileName || "Aadhaar_Document.pdf"}</span>
                        </div>
                        <span className={`text-[9px] font-bold py-0.5 px-2 rounded-full border truncate capitalize ${
                          currentUser.verificationDocs?.aadhaarStatus === "approved" || currentUser.verified ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-amber-50 text-amber-700 border-amber-100"
                        }`}>
                          {currentUser.verified ? "approved" : (currentUser.verificationDocs?.aadhaarStatus || "pending")}
                        </span>
                      </div>

                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </div>

    </div>
  );
}
