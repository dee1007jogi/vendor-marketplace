/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from "react";
import { Requirement, VendorProfile, Lead, Proposal, User, AIMetadata } from "../types";
import { 
  FileText, Plus, Sparkles, Star, MapPin, 
  Clock, DollarSign, ArrowRight, ShieldCheck, 
  TrendingUp, Check, AlertCircle, FileSpreadsheet, Loader2,
  UploadCloud, Trash
} from "lucide-react";

interface BuyerDashboardProps {
  currentUser: User;
  requirements: Requirement[];
  vendorProfiles: VendorProfile[];
  leads: Lead[];
  proposals: Proposal[];
  onPostRequirement: (reqData: Partial<Requirement>) => Promise<any>;
  onTriggerActionProposal: (proposalId: string, action: "shortlist" | "accept" | "decline") => void;
  onOpenConsultationChat: (vendorId: string) => void;
  onVerifyUser: (verificationDocs: any) => Promise<any>;
}

export default function BuyerDashboard({
  currentUser,
  requirements,
  vendorProfiles,
  leads,
  proposals,
  onPostRequirement,
  onTriggerActionProposal,
  onOpenConsultationChat,
  onVerifyUser,
}: BuyerDashboardProps) {
  // Navigation tabs of the dashboard
  const [dashboardTab, setDashboardTab] = useState<"list" | "create" | "verification">("list");
  
  // Buyer Verification Fields
  const [companyName, setCompanyName] = useState(currentUser.verificationDocs?.businessName || "");
  const [companyRegNo, setCompanyRegNo] = useState(currentUser.verificationDocs?.registrationNumber || "");
  const [cosFileName, setCosFileName] = useState(currentUser.verificationDocs?.cosFileName || "");
  const [isVerifyingSubmit, setIsVerifyingSubmit] = useState(false);

  const simulateFileAttach = () => {
    const cleanNum = companyRegNo.trim() || "REG-" + Math.floor(Math.random() * 1000000);
    setCosFileName(`CoS_Incorporation_${cleanNum}.pdf`);
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cosFileName) {
      alert("Please attach your simulated Certificate of Incorporation file.");
      return;
    }
    setIsVerifyingSubmit(true);
    try {
      await onVerifyUser({
        businessName: companyName,
        registrationNumber: companyRegNo,
        cosFileName,
        cosFileUrl: "https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?auto=format&fit=crop&w=600&q=80"
      });
      alert("B2B registration documents submitted successfully! Admin review in progress.");
    } catch (err) {
      console.error(err);
      alert("Verification submission error.");
    } finally {
      setIsVerifyingSubmit(false);
    }
  };
  
  // Selected Posted RFP context for viewing matches or bids details
  const [selectedReqId, setSelectedReqId] = useState<string | null>(null);

  // Active sub-tab under selected RFP: matches or received proposals
  const [reqDetailsTab, setReqDetailsTab] = useState<"matches" | "bids">("matches");

  // Form State for creating a new RFP
  const [rfpTitle, setRfpTitle] = useState("");
  const [rfpDesc, setRfpDesc] = useState("");
  const [rfpCategory, setRfpCategory] = useState("Software Development");
  const [rfpBudgetMin, setRfpBudgetMin] = useState(2000);
  const [rfpBudgetMax, setRfpBudgetMax] = useState(5000);
  const [rfpTimeline, setRfpTimeline] = useState(6);
  const [rfpLocation, setRfpLocation] = useState("Remote");

  // AI assistant loading states & parsed state
  const [isAiParsing, setIsAiParsing] = useState(false);
  const [aiMetadata, setAiMetadata] = useState<AIMetadata | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get requirements posted by active buyer
  const buyerRequirements = useMemo(() => {
    return requirements.filter(r => r.buyerId === currentUser.id);
  }, [requirements, currentUser]);

  // Handle active selected requirement context
  const activeReq = useMemo(() => {
    if (selectedReqId) return requirements.find(r => r.id === selectedReqId);
    if (buyerRequirements.length > 0) return buyerRequirements[0];
    return null;
  }, [selectedReqId, buyerRequirements, requirements]);

  // Leads matching active requirement
  const activeLeads = useMemo(() => {
    if (!activeReq) return [];
    return leads
      .filter(l => l.requirementId === activeReq.id)
      .sort((a, b) => b.matchingScore - a.matchingScore);
  }, [activeReq, leads]);

  // Bids submitted matching active requirement
  const activeProposals = useMemo(() => {
    if (!activeReq) return [];
    return proposals.filter(p => p.requirementId === activeReq.id);
  }, [activeReq, proposals]);

  // Trigger RFP parsing via Gemini API
  const handleAIAssistParser = async () => {
    if (!rfpTitle || !rfpDesc) {
      alert("Please provide at least a title and generic description outline to run the AI compiler.");
      return;
    }

    setIsAiParsing(true);
    setAiMetadata(null);

    try {
      const response = await fetch("/api/requirements/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: rfpTitle,
          description: rfpDesc,
          category: rfpCategory
        })
      });

      if (!response.ok) {
        throw new Error("Gemini rfp parse route failed.");
      }

      const data = await response.json();
      if (data.aiMetadata) {
        setAiMetadata(data.aiMetadata);
        // Pre-fill refined timelines or categories from AI recommendation!
        if (data.aiMetadata.recommendedTimelineWeeks) {
          setRfpTimeline(data.aiMetadata.recommendedTimelineWeeks);
        }
      }
    } catch (err) {
      console.error(err);
      alert("AI Compiler fallback: Generated standard metadata parameters for this description.");
      // Fallback
      setAiMetadata({
        extractedKeywords: [rfpCategory, "Modular design"],
        complexityLevel: "Medium",
        recommendedTimelineWeeks: 8,
        estimatedBudgetConfidence: "Confident",
        suggestedCategories: [rfpCategory],
        skillsRequired: ["Figma Mockups", "React Frontend", "Express Database Routing"]
      });
    } finally {
      setIsAiParsing(false);
    }
  };

  // Submit complete Posted requirement
  const handleCreateRequirement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rfpTitle || !rfpDesc) {
      alert("Please configure a title and valid description.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onPostRequirement({
        buyerId: currentUser.id,
        buyerName: currentUser.name,
        title: rfpTitle,
        description: rfpDesc,
        category: rfpCategory,
        budgetMin: Number(rfpBudgetMin),
        budgetMax: Number(rfpBudgetMax),
        timelineWeeks: Number(rfpTimeline),
        locationPreference: rfpLocation,
        aiMetadata: aiMetadata || undefined
      });

      // Reset form fields
      setRfpTitle("");
      setRfpDesc("");
      setAiMetadata(null);
      setDashboardTab("list");
      setSelectedReqId(null); // Select the latest one posted automatically
    } catch (err) {
      console.error(err);
      alert("RFP registry failed. Check node express logs.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8" id="buyer-dashboard-root">
      
      {/* Dashboard Top Navigation */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Procurement Command Center</h1>
          <p className="text-xs text-slate-500">Monitor active RFPs, explore rule-based machine matches, and review incoming bids.</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => setDashboardTab("list")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              dashboardTab === "list"
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            Manage RFPs ({buyerRequirements.length})
          </button>

          <button
            onClick={() => setDashboardTab("create")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              dashboardTab === "create"
                ? "bg-slate-900 border-slate-900 text-white"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            id="draft-rfp-btn"
          >
            <Plus size={14} className="inline mr-1" />
            <span>Draft New RFP</span>
          </button>

          <button
            onClick={() => setDashboardTab("verification")}
            className={`px-4 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 ${
              dashboardTab === "verification"
                ? "bg-indigo-700 border-indigo-700 text-white font-bold"
                : currentUser.verified
                ? "bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                : currentUser.verificationDocs?.cosStatus === "pending"
                ? "bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-105 animate-pulse"
                : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
            id="buyer-verification-tab-btn"
          >
            <ShieldCheck size={13} className={currentUser.verified ? "text-emerald-600 fill-current" : "text-slate-500"} />
            <span>B2B Trust Info</span>
            {currentUser.verified && (
              <span className="bg-emerald-200 text-emerald-800 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full">✓ Verified</span>
            )}
            {!currentUser.verified && currentUser.verificationDocs?.cosStatus === "pending" && (
              <span className="bg-amber-205 text-amber-900 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded-full">Pending</span>
            )}
            {!currentUser.verified && (!currentUser.verificationDocs?.cosStatus) && (
              <span className="bg-red-50 text-red-600 text-[8px] font-extrabold uppercase px-1.5 py-0.2 rounded border border-red-200">Unverified</span>
            )}
          </button>
        </div>
      </div>

      {dashboardTab === "create" ? (
        /* Create RFP Wizard Interface */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="text-indigo-600 animate-pulse" size={18} />
              <span>AI-Assisted RFP Constructor</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Draft your company requirements. Launch our Gemini analyzer to automatically map keywords, assess project complexity, and target qualified agencies.
            </p>
          </div>

          <form onSubmit={handleCreateRequirement} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {/* Title */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-400">RFP Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MERN Supplements Marketplace, HR Staffing Support"
                    value={rfpTitle}
                    onChange={(e) => setRfpTitle(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:bg-white focus:outline-none font-medium text-slate-800"
                    id="rfp-title-input"
                  />
                </div>

                {/* Initial Category */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase text-slate-400">Core Domain Category</label>
                  <select
                    value={rfpCategory}
                    onChange={(e) => setRfpCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                  >
                    <option value="Software Development">Software Development</option>
                    <option value="Creative & Design">Creative & Design</option>
                    <option value="Event Management">Event Management</option>
                    <option value="Cloud & DevOps">Cloud & DevOps</option>
                  </select>
                </div>

                {/* Locations Preferences & Timelines */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Location Match</label>
                    <select
                      value={rfpLocation}
                      onChange={(e) => setRfpLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500 font-medium text-slate-800"
                    >
                      <option value="Remote">Remote (Full Remote)</option>
                      <option value="Local">Local (Same state only)</option>
                      <option value="Hybrid">Hybrid Workspace</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Target Duration (Weeks)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={52}
                      value={rfpTimeline}
                      onChange={(e) => setRfpTimeline(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-800 font-bold"
                    />
                  </div>
                </div>

                {/* Budget Min and Max */}
                <div className="grid grid-cols-2 gap-4 animate-opacity">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Scope Budget: Min ($)</label>
                    <input
                      type="number"
                      required
                      min={100}
                      value={rfpBudgetMin}
                      onChange={(e) => setRfpBudgetMin(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-800 font-bold"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold uppercase text-slate-400">Scope Budget: Max ($)</label>
                    <input
                      type="number"
                      required
                      min={rfpBudgetMin}
                      value={rfpBudgetMax}
                      onChange={(e) => setRfpBudgetMax(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none text-slate-800 font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                {/* Detailed RFP outline brief */}
                <div className="space-y-1.5 flex-1 flex flex-col">
                  <label className="block text-xs font-bold uppercase text-slate-400"> Rfp Technical Specifications</label>
                  <textarea
                    required
                    placeholder="Provide a thorough, comprehensive blueprint. What are your user flows? What is your technological target? (e.g. 'We need a high-performance React supplement store. Admin dashboard must manage recurring monthly subscriptions, integrate standard pricing cards, Stripe APIs, automatic emailing updates...')"
                    value={rfpDesc}
                    onChange={(e) => setRfpDesc(e.target.value)}
                    className="w-full flex-1 min-h-[160px] px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:bg-white focus:outline-none font-medium text-slate-800 leading-relaxed resize-none"
                    id="rfp-desc-input"
                  />
                </div>

                {/* AI Analyzer button */}
                <button
                  type="button"
                  onClick={handleAIAssistParser}
                  disabled={isAiParsing}
                  className="w-full bg-slate-900 border border-slate-800 hover:bg-slate-800 text-teal-300 rounded-xl py-3 px-4 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                  id="ai-refine-btn"
                >
                  {isAiParsing ? (
                    <>
                      <Loader2 size={14} className="animate-spin text-teal-300" />
                      <span>Gemini NLP Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} className="fill-teal-300" />
                      <span>Compile RFP Metrics with Gemini AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* AI Generated RFP Metadata Overlay */}
            {aiMetadata && (
              <div className="bg-indigo-50/50 border border-indigo-200/60 rounded-2xl p-5 space-y-4 animate-fadeIn">
                <div className="flex items-center gap-2 text-indigo-700">
                  <Sparkles size={16} className="fill-indigo-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">AI Derived RFP Metrics Blueprint</span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 font-medium">Complexity Rating:</span>
                    <span className="block font-bold text-slate-900 uppercase tracking-wider">{aiMetadata.complexityLevel}</span>
                  </div>
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 font-medium">Estimated Match Schedule:</span>
                    <span className="block font-bold text-slate-900">{aiMetadata.recommendedTimelineWeeks} Weeks recommended</span>
                  </div>
                  <div className="space-y-1 bg-white p-3 rounded-xl border border-indigo-100">
                    <span className="text-slate-400 font-medium">Budget Confidence Gauge:</span>
                    <span className="block font-bold text-emerald-600 text-[11px] uppercase tracking-wide flex items-center gap-1">
                      <ShieldCheck size={12} /> {aiMetadata.estimatedBudgetConfidence.replace("_", " ")}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border-t border-slate-200/50 pt-4">
                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Target Skill Matrices Required:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiMetadata.skillsRequired.map((skill) => (
                        <span key={skill} className="bg-white border border-indigo-100 text-indigo-800 text-[10px] px-2 py-0.5 rounded-md font-semibold">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-400 font-bold block uppercase text-[9px] mb-1">Semantic SEO Keywords:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {aiMetadata.extractedKeywords.map((kw) => (
                        <span key={kw} className="bg-slate-100 border border-slate-200 text-slate-700 text-[10px] px-2.2 py-0.5 rounded-md font-medium">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Cancel / Submit trigger */}
            <div className="flex justify-end gap-3 border-t border-slate-100 pt-5">
              <button
                type="button"
                onClick={() => setDashboardTab("list")}
                className="px-5 py-2.5 bg-slate-50 border border-slate-200 text-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Draft Cancel
              </button>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-md cursor-pointer disabled:opacity-50"
                id="rfp-submit-btn"
              >
                {isSubmitting ? "Draft Registering..." : "Publish Live RFP Specification"}
                <ArrowRight size={13} />
              </button>
            </div>
          </form>
        </div>
      ) : dashboardTab === "verification" ? (
        /* B2B Trust & Verification Panel */
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 max-w-4xl mx-auto shadow-sm space-y-6">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="text-indigo-600 fill-indigo-50" size={20} />
              <span>B2B Trust & Verification Center</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Submit your company documents to unlock verified B2B badges, build instant trust with vendor agencies, and protect the marketplace ecosystem.
            </p>
          </div>

          {/* Status Alert Banner */}
          {currentUser.verified ? (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 flex items-start gap-3">
              <ShieldCheck className="text-emerald-600 shrink-0 mt-0.5" size={18} />
              <div className="text-xs">
                <span className="font-bold block text-sm">Account Verified!</span>
                <p className="mt-1 font-medium">Your business profiles and registration documents are successfully audited against ministry registries. Verified RFPs receive 4x more proposal bid submissions.</p>
              </div>
            </div>
          ) : currentUser.verificationDocs?.cosStatus === "pending" ? (
            <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5 animate-pulse" size={18} />
              <div className="text-xs">
                <span className="font-bold block text-sm text-amber-900">Review in Progress...</span>
                <p className="mt-1 font-semibold text-amber-700">Your Certificate of Incorporation (CoS) has been submitted and is currently being audited by our trust operations desk. This usually takes 10 to 30 minutes.</p>
              </div>
            </div>
          ) : currentUser.verificationDocs?.cosStatus === "rejected" ? (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-rose-600 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-rose-700">
                <span className="font-bold block text-sm text-rose-900">Verification Declined</span>
                <p className="mt-1 font-semibold">Feedback: {currentUser.verificationDocs.rejectReason || "Corporate numbers could not be validated against official registers."}</p>
                <p className="mt-1 text-[11px] font-medium text-rose-600">Please audit your business certificate credentials or resubmit with correct files below.</p>
              </div>
            </div>
          ) : (
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-850 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="text-indigo-600 shrink-0 mt-0.5" size={18} />
              <div className="text-xs text-indigo-700 font-medium">
                <span className="font-bold block text-indigo-900">Unverified Account Status</span>
                <p className="mt-0.5 leading-relaxed">Please provide your Certificate of Incorporation (CoS) or Business registration ID below to assure high-grade engineering vendors of your posting authenticity.</p>
              </div>
            </div>
          )}

          {/* Form */}
          {(!currentUser.verified) && (
            <form onSubmit={handleVerifySubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Legal Entity Name */}
                <div className="space-y-1.5 font-sans">
                  <label className="block text-[11px] font-bold uppercase text-slate-400">Company Legal Registered Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. VentureStack Technologies Private Limited"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:bg-white focus:outline-none font-medium text-slate-800"
                  />
                </div>

                {/* CIN Registration ID */}
                <div className="space-y-1.5 font-sans">
                  <label className="block text-[11px] font-bold uppercase text-slate-400">Corporate Identity Number (CIN) / Registration ID</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. U72200KA2021PTC123456"
                    value={companyRegNo}
                    onChange={(e) => setCompanyRegNo(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:border-indigo-500 focus:bg-white focus:outline-none font-medium text-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Secure Document Drag and Drop Box */}
              <div className="space-y-2 font-sans">
                <label className="block text-[11px] font-bold uppercase text-slate-400">Required Document: Certificate of Incorporation / Status (CoS)</label>
                
                {cosFileName ? (
                  <div className="p-4 border border-indigo-200 rounded-2xl bg-indigo-50/20 flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-indigo-150 text-indigo-700 rounded-lg flex items-center justify-center font-bold text-[10px]">
                        PDF
                      </div>
                      <div>
                        <span className="font-semibold text-slate-800">{cosFileName}</span>
                        <p className="text-[10px] text-slate-400 font-medium">File attached & ready • 1.4 MB</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCosFileName("")}
                      className="text-rose-600 hover:text-rose-800 hover:bg-rose-50 text-xs px-3 py-1.5 rounded-lg font-bold transition-all cursor-pointer"
                    >
                      Remove File
                    </button>
                  </div>
                ) : (
                  <div 
                    onClick={simulateFileAttach}
                    className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/10 rounded-2xl p-6 text-center transition-all cursor-pointer space-y-2 bg-slate-50"
                    title="Click to auto-generate mock CoS PDF file"
                  >
                    <UploadCloud className="mx-auto text-slate-400" size={28} />
                    <div>
                      <span className="block text-xs font-bold text-indigo-650 hover:underline">Simulate Document Attachment (CoS)</span>
                      <p className="text-[10px] text-slate-450 mt-1">Accepts business registration papers, Certificate of Incorporation or GST document. (Click to mock attach)</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t border-slate-100 pt-5 flex justify-end">
                <button
                  type="submit"
                  disabled={isVerifyingSubmit || !cosFileName}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-md"
                >
                  {isVerifyingSubmit ? (
                    <>
                      <Loader2 size={12} className="animate-spin" />
                      <span>Submitting credentials...</span>
                    </>
                  ) : (
                    "Submit For Verification"
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Show Current Submitted documents if verified or under review */}
          {(currentUser.verified || currentUser.verificationDocs?.cosStatus) && (
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200/80 space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wide">Submitted Compliance Catalog</h4>
              <div className="divide-y divide-slate-150">
                <div className="flex justify-between items-center py-2 text-xs font-sans">
                  <div>
                    <span className="font-bold text-slate-800">Certificate of Incorporation/Status (CoS)</span>
                    <p className="text-[10px] text-slate-450 mt-0.5 font-mono">File: {currentUser.verificationDocs?.cosFileName || "CoS_Certificate.pdf"}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full capitalize border ${
                    currentUser.verificationDocs?.cosStatus === "approved" || currentUser.verified
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : currentUser.verificationDocs?.cosStatus === "rejected"
                      ? "bg-rose-50 text-rose-700 border-rose-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}>
                    {currentUser.verified ? "approved" : (currentUser.verificationDocs?.cosStatus || "pending")}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* RFP Management Dashboard lists */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Active RFP List selection pane */}
          <div className="col-span-1 lg:col-span-4 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">My Posted RFPs ({buyerRequirements.length})</h2>
            
            {buyerRequirements.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center space-y-4 shadow-sm">
                <FileText className="mx-auto text-slate-300" size={32} />
                <h3 className="font-bold text-slate-900 text-sm">No Active RFPs</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Start landing perfect agency bids. Tap the 'Draft New RFP' button above to compile your goals.
                </p>
                <button
                  onClick={() => setDashboardTab("create")}
                  className="bg-indigo-50 text-indigo-700 text-xs font-bold px-4 py-2 rounded-lg hover:bg-indigo-100 cursor-pointer"
                >
                  Draft RFP specs
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {buyerRequirements.map((req) => {
                  const isSelectedId = activeReq?.id === req.id;
                  const bidsCount = proposals.filter(p => p.requirementId === req.id).length;
                  return (
                    <div
                      key={req.id}
                      onClick={() => {
                        setSelectedReqId(req.id);
                        setReqDetailsTab("matches");
                      }}
                      className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                        isSelectedId
                          ? "bg-indigo-50/50 border-indigo-400 ring-1 ring-indigo-400"
                          : "bg-white border-slate-200 hover:border-slate-300"
                      }`}
                      id={`buyer-rfp-[${req.id}]`}
                    >
                      <div className="flex justify-between items-start">
                        <span className={`inline-block text-[9px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                          req.status === "open"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-100 text-slate-600 border border-slate-200"
                        }`}>
                          {req.status}
                        </span>
                        
                        <span className="text-[10px] text-slate-400 font-semibold">{new Date(req.createdAt).toLocaleDateString()}</span>
                      </div>

                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight mt-2 line-clamp-1">{req.title}</h3>
                      <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-relaxed">{req.description}</p>
                      
                      <div className="flex items-center justify-between text-xs border-t border-slate-100 pt-3 mt-3">
                        <span className="font-bold text-slate-900">
                          ${req.budgetMin} - ${req.budgetMax}
                        </span>

                        <span className="bg-slate-100 text-slate-700 font-semibold text-[10px] px-2.2 py-0.5 rounded-lg flex items-center gap-1">
                          <FileSpreadsheet size={10} />
                          {bidsCount} {bidsCount === 1 ? "Bid" : "Bids"} received
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Active RFP Details workspace (matched agencies & bidding deals) */}
          <div className="col-span-1 lg:col-span-8">
            {activeReq ? (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                
                {/* Upper description specifications overview */}
                <div className="space-y-4 border-b border-slate-100 pb-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold uppercase px-2.2 py-0.5 rounded-full">
                        {activeReq.category}
                      </span>
                      <h2 className="text-xl font-bold text-slate-950 mt-1">{activeReq.title}</h2>
                    </div>
                    
                    <div className="text-right">
                      <span className="font-semibold block text-xs text-slate-400">RFP Budget Target Range</span>
                      <span className="text-base font-extrabold text-slate-900">${activeReq.budgetMin} - ${activeReq.budgetMax}</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-3xl font-medium bg-slate-50 border border-slate-100 p-4 rounded-xl">{activeReq.description}</p>

                  {activeReq.aiMetadata && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-indigo-50/20 border border-indigo-100/40 p-3.5 rounded-xl text-[11px]">
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px] leading-none mb-1">RFP Scope Difficulty</span>
                        <span className="font-bold text-indigo-900">{activeReq.aiMetadata.complexityLevel} Complexity</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px] leading-none mb-1">Target Schedule</span>
                        <span className="font-bold text-slate-800">{activeReq.timelineWeeks} Weeks cap</span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px] leading-none mb-1">Required Skills target</span>
                        <span className="font-medium text-slate-600 block truncate" title={activeReq.aiMetadata.skillsRequired.join(", ")}>
                          {activeReq.aiMetadata.skillsRequired.slice(0, 2).join(", ")}...
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 font-bold block uppercase text-[9px] leading-none mb-1">RFP Location matches</span>
                        <span className="font-bold text-indigo-900">{activeReq.locationPreference} Workspace</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Sub-tab Selection: Matches vs Bids list */}
                <div className="flex border-b border-slate-100">
                  <button
                    onClick={() => setReqDetailsTab("matches")}
                    className={`px-5 py-3 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                      reqDetailsTab === "matches"
                        ? "border-indigo-600 text-indigo-700 font-extrabold"
                        : "border-transparent text-slate-500 hover:text-indigo-600"
                    }`}
                  >
                    AI Weighted Matches ({activeLeads.length})
                  </button>

                  <button
                    onClick={() => setReqDetailsTab("bids")}
                    className={`px-5 py-3 text-xs font-bold border-b-2 -mb-px transition-colors cursor-pointer ${
                      reqDetailsTab === "bids"
                        ? "border-indigo-600 text-indigo-700 font-extrabold"
                        : "border-transparent text-slate-500 hover:text-indigo-600"
                    }`}
                    id="bids-deals-tab"
                  >
                    Agency Proposal Bids ({activeProposals.length})
                  </button>
                </div>

                {reqDetailsTab === "matches" ? (
                  /* Matches Panel with progress bar diagnostics */
                  <div className="space-y-4">
                    {activeLeads.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 rounded-xl space-y-2 border border-slate-100">
                        <AlertCircle className="mx-auto text-slate-400" size={24} />
                        <h4 className="font-bold text-slate-800 text-sm">No Matches Yet</h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          Our rule-based matches are updating. Try editing user categories.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeLeads.map((lead) => {
                          const vendor = vendorProfiles.find(v => v.userId === lead.vendorId);
                          if (!vendor) return null;
                          return (
                            <div key={lead.id} className="border border-slate-100/80 hover:border-slate-200 bg-white p-4 rounded-2xl shadow-sm space-y-3">
                              {/* Header match metrics info */}
                              <div className="flex items-start justify-between flex-wrap gap-2">
                                <div className="flex items-center gap-3">
                                  <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-800 font-bold text-xs">
                                    {vendor.businessName[0]}
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{vendor.businessName}</h4>
                                    <p className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">
                                      <MapPin size={11} /> {vendor.location} • Starting price: ${vendor.pricingMin}
                                    </p>
                                  </div>
                                </div>

                                <div className="text-right">
                                  <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-teal-50 to-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-xl text-xs font-bold font-mono">
                                    <TrendingUp size={12} className="text-emerald-500" />
                                    <span>{lead.matchingScore}% Fit</span>
                                  </div>
                                </div>
                              </div>

                              {/* Breakdown percentages */}
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2 text-[10px] text-slate-600 border-t border-slate-50">
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold block uppercase text-[8px]">Sector fit: 30%</span>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${lead.scoreBreakdown.categoryMatch}%` }}></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold block uppercase text-[8px]">Location: 15%</span>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${lead.scoreBreakdown.locationMatch}%` }}></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold block uppercase text-[8px]">Pricing: 25%</span>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${lead.scoreBreakdown.budgetMatch}%` }}></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold block uppercase text-[8px]">Timeline: 10%</span>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${lead.scoreBreakdown.timelineMatch}%` }}></div>
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <span className="text-slate-400 font-bold block uppercase text-[8px]">AI Skill Match: 20%</span>
                                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: `${lead.scoreBreakdown.aiSkillMatch}%` }}></div>
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-end gap-2 pt-2">
                                <button
                                  onClick={() => onOpenConsultationChat(vendor.userId)}
                                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide cursor-pointer"
                                >
                                  Open Conversation
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  /* Received Proposals Tab */
                  <div className="space-y-4">
                    {activeProposals.length === 0 ? (
                      <div className="text-center py-8 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                        <AlertCircle className="mx-auto text-slate-400" size={24} />
                        <h4 className="font-bold text-slate-800 text-sm">No Proposals Registered</h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">
                          Once matching agencies submit cover letters, contract parameters will display lists here.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {activeProposals.map((proposal) => {
                          const isShortlisted = proposal.status === "shortlisted";
                          const isAccepted = proposal.status === "accepted";
                          return (
                            <div 
                              key={proposal.id} 
                              className={`border p-5 rounded-2xl space-y-4 shadow-sm bg-white hover:border-slate-350 transition-all ${
                                isAccepted ? "border-emerald-350 bg-emerald-50/10" : "border-slate-100/90"
                              }`}
                              id={`proposal-[${proposal.id}]`}
                            >
                              <div className="flex items-start justify-between flex-wrap gap-3">
                                <div className="flex items-center gap-3">
                                  <img 
                                    src={proposal.vendorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"}
                                    alt={proposal.vendorBusinessName}
                                    className="h-9 w-9 rounded-full object-cover"
                                  />
                                  <div>
                                    <h4 className="font-bold text-slate-900 text-sm">{proposal.vendorBusinessName}</h4>
                                    <p className="text-[10px] text-slate-500 flex items-center gap-1 font-semibold">
                                      <Star size={11} className="fill-amber-400 text-amber-400" /> 
                                      {proposal.vendorRating} average rating • Submitted {new Date(proposal.createdAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>

                                <div className="bg-slate-50 border border-slate-100 px-3.5 py-1.5 rounded-xl text-xs font-mono text-slate-800 flex gap-4 text-center">
                                  <div>
                                    <span className="block text-slate-400 text-[9px] uppercase font-bold leading-none mb-0.5">Bid Price</span>
                                    <span className="font-extrabold text-slate-900">${proposal.bidAmount}</span>
                                  </div>
                                  <div className="border-l border-slate-200 pl-3">
                                    <span className="block text-slate-400 text-[9px] uppercase font-bold leading-none mb-0.5">Timeline</span>
                                    <span className="font-extrabold text-slate-900">{proposal.timelineWeeks} wks</span>
                                  </div>
                                </div>
                              </div>

                              {/* Cover Letter layout specs */}
                              <div className="space-y-2">
                                <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wide">Agency Message Outline:</span>
                                <p className="text-xs text-slate-600 leading-relaxed max-w-2xl bg-slate-50 border border-slate-100/50 p-3.5 rounded-xl">{proposal.coverLetter}</p>
                              </div>

                              {/* AI Enhanced blueprint cover letter if any */}
                              {proposal.aiOptimizedProposalText && (
                                <div className="bg-indigo-50/50 border border-indigo-200/50 p-4 rounded-xl space-y-2">
                                  <div className="flex items-center gap-1.5 text-indigo-700 text-xs font-bold">
                                    <Sparkles size={13} className="fill-indigo-300" />
                                    <span>Gemini Compiles: RFP Direct Semantic Alignment</span>
                                  </div>
                                  <div className="text-xs text-slate-700 leading-relaxed font-normal whitespace-pre-line prose max-w-none">
                                    {proposal.aiOptimizedProposalText}
                                  </div>
                                </div>
                              )}

                              {/* Actions Shortlisting and seal */}
                              <div className="flex items-center justify-between border-t border-slate-50 pt-3.5 mt-2 text-xs flex-wrap gap-2">
                                <div>
                                  <span className="text-slate-400 font-bold uppercase text-[9px]">Proposal Status: </span>
                                  <span className={`ml-1 font-bold inline-block text-[10px] uppercase ${
                                    isAccepted ? "text-emerald-600" : isShortlisted ? "text-indigo-600" : "text-slate-500"
                                  }`}>
                                    {proposal.status}
                                  </span>
                                </div>

                                <div className="flex gap-2">
                                  {!isAccepted && (
                                    <button
                                      disabled={isShortlisted}
                                      onClick={() => onTriggerActionProposal(proposal.id, "shortlist")}
                                      className="px-4 py-1.5 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold hover:bg-slate-50 transition-colors disabled:opacity-40 cursor-pointer"
                                    >
                                      {isShortlisted ? "Shortlisted" : "Shortlist bid"}
                                    </button>
                                  )}
                                  
                                  {!isAccepted && (
                                    <button
                                      onClick={() => onTriggerActionProposal(proposal.id, "accept")}
                                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg py-1.5 px-4 text-xs font-bold transition-all cursor-pointer"
                                    >
                                      Seal Final Contract Match
                                    </button>
                                  )}

                                  {isAccepted && (
                                    <span className="inline-flex items-center gap-1.5 bg-emerald-100 text-emerald-900 border border-emerald-200 text-xs font-bold px-4 py-2 rounded-lg">
                                      <Check size={14} /> Bid Sealed & Accepted
                                    </span>
                                  )}
                                </div>
                              </div>

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-slate-50 border border-slate-200 border-dashed rounded-3xl p-12 text-center text-slate-500">
                <FileText className="mx-auto mb-2 text-slate-300" size={32} />
                <p className="text-sm font-semibold">Please select an RFP requirement on the left pane to analyze diagnostic indices.</p>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
