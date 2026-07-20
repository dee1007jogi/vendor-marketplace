import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bot, ChevronRight, CheckCircle2, ChevronLeft, Building2 } from "lucide-react";
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
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Post a Requirement</h1>
            <p className="text-slate-500 font-medium">Get matched with top verified vendors instantly.</p>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="flex items-center justify-between mb-8 relative">
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-slate-200 -z-10 rounded-full">
            <div className="h-full bg-indigo-600 rounded-full transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
          </div>
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors duration-500 ${step >= s ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/30" : "bg-slate-200 text-slate-400"}`}>
              {step > s ? <CheckCircle2 size={16} /> : s}
            </div>
          ))}
        </div>

        {/* Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-12">
          
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 text-indigo-600 mb-6 bg-indigo-50 w-max px-4 py-2 rounded-full font-bold text-sm">
                <Bot size={18} /> AI Assistant
              </div>
              <h2 className="text-3xl font-black text-slate-900 mb-4">What service do you need?</h2>
              <p className="text-slate-500 mb-8 text-lg">Describe your requirement in plain English. Our AI will automatically categorize it, estimate the budget, and match you with the right vendors.</p>
              
              <textarea 
                rows={5}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="E.g., I need a website for my hospital business. It should have appointment booking, doctor profiles, and a patient portal."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-6 text-lg focus:bg-white focus:border-indigo-400 focus:ring-4 focus:ring-indigo-50 outline-none transition-all resize-none"
              ></textarea>
              
              <button 
                onClick={handleAIAnalysis}
                disabled={isAnalyzing || !prompt.trim()}
                className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2 text-lg"
              >
                {isAnalyzing ? (
                  <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Analyzing Requirements...</>
                ) : (
                  <>Analyze with AI <ChevronRight size={20} /></>
                )}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Refine Details</h2>
              <p className="text-slate-500 mb-8">We've pre-filled these based on your description. Feel free to adjust.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Project Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:border-indigo-400 outline-none font-medium text-slate-900" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                      <option>Software Development</option>
                      <option>Digital Marketing</option>
                      <option>Design & Creative</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Location Preference</label>
                    <select value={formData.locationPreference} onChange={e => setFormData({...formData, locationPreference: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                      <option>Any (Remote)</option>
                      <option>Bangalore</option>
                      <option>Mumbai</option>
                      <option>Delhi NCR</option>
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
                  <label className="block text-sm font-bold text-slate-700 mb-2">Expected Timeline</label>
                  <select value={formData.timelineWeeks} onChange={e => setFormData({...formData, timelineWeeks: Number(e.target.value)})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                    <option value={1}>Less than 1 week</option>
                    <option value={4}>1 Month</option>
                    <option value={8}>2 Months</option>
                    <option value={12}>3 Months+</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 mt-10">
                <button onClick={() => setStep(1)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-center">Continue</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h2 className="text-2xl font-black text-slate-900 mb-2">Additional Specifications</h2>
              <p className="text-slate-500 mb-8">Specific details help vendors provide accurate quotes.</p>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Technology / CMS</label>
                  <input type="text" value={formData.customSpecs.cms || ""} onChange={e => setFormData({...formData, customSpecs: {...formData.customSpecs, cms: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">E-Commerce Functionality Required?</label>
                  <select value={formData.customSpecs.ecommerce || "No"} onChange={e => setFormData({...formData, customSpecs: {...formData.customSpecs, ecommerce: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 font-medium text-slate-900 outline-none">
                    <option>Yes</option>
                    <option>No</option>
                    <option>Not Sure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Upload Attachments (Optional)</label>
                  <div className="w-full border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-slate-500 bg-slate-50 hover:bg-slate-100 cursor-pointer transition-colors">
                    <span className="font-bold text-indigo-600">Click to upload</span> or drag and drop
                    <span className="text-xs mt-1">PDF, DOCX, or images (Max 10MB)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4 mt-10">
                <button onClick={() => setStep(2)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center">Back</button>
                <button onClick={() => setStep(4)} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg transition-colors text-center">Review & Post</button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center justify-center mb-6 text-emerald-500">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-black text-center text-slate-900 mb-2">Ready to post!</h2>
              <p className="text-slate-500 text-center mb-8">Review your requirement summary below.</p>
              
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 mb-8">
                <h3 className="font-bold text-lg text-slate-900 mb-4">{formData.title}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 text-sm mb-4">
                  <div><span className="text-slate-500 block">Category</span><span className="font-bold text-slate-900">{formData.category}</span></div>
                  <div><span className="text-slate-500 block">Budget</span><span className="font-bold text-slate-900">₹{formData.budgetMin.toLocaleString()} - ₹{formData.budgetMax.toLocaleString()}</span></div>
                  <div><span className="text-slate-500 block">Timeline</span><span className="font-bold text-slate-900">{formData.timelineWeeks} Weeks</span></div>
                  <div><span className="text-slate-500 block">Location</span><span className="font-bold text-slate-900">{formData.locationPreference}</span></div>
                </div>
                <div>
                  <span className="text-slate-500 block text-sm">Description</span>
                  <p className="font-medium text-slate-900 text-sm mt-1">{formData.description}</p>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4">
                <button onClick={() => setStep(3)} className="px-6 py-4 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors text-center">Edit</button>
                <button onClick={handleSubmit} className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-500/25 transition-colors flex items-center justify-center gap-2">
                  <Building2 size={20} /> Post your requirement & Get Matched
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
