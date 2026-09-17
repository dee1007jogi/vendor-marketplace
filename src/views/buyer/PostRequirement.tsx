import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ChevronRight, CheckCircle2, ChevronLeft, Building2, Sparkles, Zap } from "lucide-react";
import { User } from "../../types";

interface PostRequirementProps {
  currentUser: User | null;
}

export default function PostRequirement({ currentUser }: PostRequirementProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Form State
  const [prompt, setPrompt] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    category: "Software Development",
    subcategory: "",
    budgetMin: 50000,
    budgetMax: 100000,
    timelineWeeks: 4,
    locationPreference: "Any",
    description: "",
    customSpecs: {}
  });

  const handleAIAnalysis = async () => {
    if (!prompt.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const res = await fetch("/api/requirements/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);

      setFormData({
        ...formData,
        title: data.title || "E-Commerce Web Application",
        category: data.category || "Software Development",
        subcategory: data.subcategory || "Web Development",
        budgetMin: data.budgetMin || 80000,
        budgetMax: data.budgetMax || 150000,
        timelineWeeks: data.timelineWeeks || 6,
        description: prompt,
        customSpecs: data.customSpecs || {}
      });
      setStep(2);
    } catch (e) {
      console.error(e);
      alert("AI analysis failed. Please manually fill the details.");
      // Fallback
      setFormData({ ...formData, description: prompt });
      setStep(2);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      alert("Please login to post a requirement.");
      return;
    }

    try {
      const res = await fetch("/api/requirements/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          buyerId: currentUser.id,
          buyerName: currentUser.name,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          budgetMin: formData.budgetMin,
          budgetMax: formData.budgetMax,
          timelineWeeks: formData.timelineWeeks,
          locationPreference: formData.locationPreference,
          aiMetadataJson: JSON.stringify(formData.customSpecs)
        })
      });
      
      const data = await res.json();
      if (data.success) {
        navigate("/buyer/requirements");
      } else {
        alert(data.error);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to post requirement");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-white rounded-2xl shadow-sm hover:bg-sky-50 border border-sky-100 transition-colors cursor-pointer"><ChevronLeft size={20} className="text-slate-700" /></button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">Post a Bulk Wholesale Requirement</h1>
            <p className="text-slate-500 font-medium text-sm">Get matched with top verified manufacturers and suppliers in minutes.</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 relative px-2">
          <div className="absolute left-4 right-4 top-1/2 h-1 bg-slate-200 -z-10 rounded-full">
            <div className="h-full bg-gradient-to-r from-sky-500 to-blue-600 rounded-full transition-all duration-500 shadow-sm" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-9 h-9 rounded-2xl flex items-center justify-center font-black text-sm transition-all duration-300 ${step >= s ? "bg-gradient-to-tr from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/30 scale-105" : "bg-white border border-slate-200 text-slate-400"}`}>
              {step > s ? <CheckCircle2 size={18} /> : s}
            </div>
          ))}
        </div>

        {/* Container */}
        <div className="bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-xl shadow-sky-950/5 border border-sky-100 p-6 md:p-12 relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center gap-2.5 text-sky-700 mb-6 bg-sky-50 w-max px-4 py-2 rounded-full font-bold text-xs border border-sky-200/80 shadow-2xs">
                  <Bot size={16} className="text-sky-600" />
                  <span>AI Automated RFQ Generator</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3 font-heading">What service or wholesale goods do you need?</h2>
                <p className="text-slate-500 mb-8 text-base font-medium">Describe your requirement in plain English. Our AI will automatically categorize it, estimate the contract budget, and match you with verified suppliers.</p>
                
                <textarea 
                  rows={5}
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="E.g., I need 5,000 units of custom stainless steel industrial valves with ISO 9001 certification. Delivery required in Pune within 6 weeks."
                  className="w-full bg-sky-50/40 border border-sky-200 rounded-2xl p-5 text-base focus:bg-white focus:border-sky-500 focus:ring-4 focus:ring-sky-100 outline-none transition-all resize-none font-medium text-slate-800 placeholder:text-slate-400 shadow-inner"
                ></textarea>
                
                <button 
                  onClick={handleAIAnalysis}
                  disabled={isAnalyzing || !prompt.trim()}
                  className="mt-8 w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-lg shadow-sky-600/25 transition-all flex items-center justify-center gap-2 text-base cursor-pointer button-luxury-glow"
                >
                  {isAnalyzing ? (
                    <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Parsing Specs & Estimating Budget...</>
                  ) : (
                    <>Analyze with AI & Match Suppliers <Sparkles size={18} className="fill-amber-300 stroke-amber-300" /></>
                  )}
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading">Refine Order Specifications</h2>
                <p className="text-slate-500 mb-8 font-medium">We've pre-filled these parameters from your prompt. Confirm or fine-tune them below.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Requirement Title</label>
                    <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-sky-400 outline-none font-medium text-slate-900" />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                      <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                        <option>Software Development</option>
                        <option>Industrial Manufacturing</option>
                        <option>Raw Materials & Chemicals</option>
                        <option>Packaging & Printing</option>
                        <option>Textiles & Apparel</option>
                        <option>Electrical & Machinery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Location Preference</label>
                      <select value={formData.locationPreference} onChange={e => setFormData({...formData, locationPreference: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                        <option>Any (All India)</option>
                        <option>Pune, Maharashtra</option>
                        <option>Mumbai, Maharashtra</option>
                        <option>Bangalore, Karnataka</option>
                        <option>Delhi NCR</option>
                        <option>Ahmedabad, Gujarat</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Estimated Budget Range (₹)</label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                      <input type="number" value={formData.budgetMin} onChange={e => setFormData({...formData, budgetMin: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none" placeholder="Min" />
                      <span className="text-slate-400 font-bold hidden sm:block">to</span>
                      <input type="number" value={formData.budgetMax} onChange={e => setFormData({...formData, budgetMax: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none" placeholder="Max" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Expected Fulfillment Timeline</label>
                    <select value={formData.timelineWeeks} onChange={e => setFormData({...formData, timelineWeeks: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                      <option value={1}>Immediate (&lt; 1 week)</option>
                      <option value={2}>2 Weeks</option>
                      <option value={4}>1 Month</option>
                      <option value={8}>2 Months</option>
                      <option value={12}>3 Months+</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 mt-10">
                  <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer">Back</button>
                  <button onClick={() => setStep(3)} className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-600/20 transition-all text-center cursor-pointer button-luxury-glow">Continue</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="text-2xl font-black text-slate-900 mb-2 font-heading">Technical Specifications & Compliance</h2>
                <p className="text-slate-500 mb-8 font-medium">Clear quality tolerances help suppliers generate binding bids faster.</p>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Quality Standards / Certifications (Optional)</label>
                    <input type="text" placeholder="E.g., ISO 9001, CE, BIS, RoHS, FDA Compliant" value={formData.customSpecs.cms || ""} onChange={e => setFormData({...formData, customSpecs: {...formData.customSpecs, cms: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Escrow Protected 50/50 Dual-Milestone?</label>
                    <select value={formData.customSpecs.ecommerce || "Yes"} onChange={e => setFormData({...formData, customSpecs: {...formData.customSpecs, ecommerce: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                      <option value="Yes">Yes — Full Escrow Protection (Recommended)</option>
                      <option value="No">Direct Negotiation (Standard)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Technical Drawings & CAD Files (Optional)</label>
                    <div className="w-full border-2 border-dashed border-sky-200 rounded-2xl p-8 flex flex-col items-center justify-center text-slate-500 bg-sky-50/50 hover:bg-sky-50 cursor-pointer transition-colors">
                      <span className="font-bold text-sky-600">Click to upload blueprints</span> or drag and drop
                      <span className="text-xs mt-1 text-slate-400">PDF, DWG, STEP, DOCX, or ZIP (Max 25MB)</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4 mt-10">
                  <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer">Back</button>
                  <button onClick={() => setStep(4)} className="flex-1 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-sky-600/20 transition-all text-center cursor-pointer button-luxury-glow">Review & Publish</button>
                </div>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div 
                key="step4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex items-center justify-center mb-6 text-emerald-500">
                  <CheckCircle2 size={54} className="animate-pulse" />
                </div>
                <h2 className="text-2xl font-black text-center text-slate-900 mb-2 font-heading">Ready to Publish!</h2>
                <p className="text-slate-500 text-center mb-8 font-medium">Verify your RFQ summary before broadcasting to verified manufacturers.</p>
                
                <div className="bg-sky-50/50 rounded-2xl p-6 border border-sky-100 mb-8">
                  <h3 className="font-bold text-lg text-slate-900 mb-4 font-heading">{formData.title}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm mb-4">
                    <div><span className="text-slate-500 block text-xs font-semibold">Category</span><span className="font-bold text-slate-900">{formData.category}</span></div>
                    <div><span className="text-slate-500 block text-xs font-semibold">Budget Range</span><span className="font-bold text-sky-700 font-mono">₹{formData.budgetMin.toLocaleString()} – ₹{formData.budgetMax.toLocaleString()}</span></div>
                    <div><span className="text-slate-500 block text-xs font-semibold">Timeline</span><span className="font-bold text-slate-900">{formData.timelineWeeks} Weeks</span></div>
                    <div><span className="text-slate-500 block text-xs font-semibold">Location Target</span><span className="font-bold text-slate-900">{formData.locationPreference}</span></div>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-xs font-semibold">Requirement Description</span>
                    <p className="font-medium text-slate-800 text-sm mt-1 leading-relaxed">{formData.description}</p>
                  </div>
                </div>

                <div className="flex flex-col-reverse sm:flex-row gap-4">
                  <button onClick={() => setStep(3)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center cursor-pointer">Edit Details</button>
                  <button onClick={handleSubmit} className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2 cursor-pointer button-luxury-glow">
                    <Building2 size={20} /> Publish Bulk RFQ & Notify Suppliers
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
