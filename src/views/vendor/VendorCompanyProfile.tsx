import React from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  Building2, ShieldCheck, MapPin, Globe, Phone, Mail, 
  Calendar, Users, Briefcase, Award, CheckCircle2, Clock,
  ExternalLink, MessageSquare, Edit3, FileText,
  BadgeCheck, Sparkles, Star, Package, Layers, Wrench,
  ArrowUpRight, TrendingUp, Zap, Factory
} from "lucide-react";
import { User } from "../../types";
import Animated3DLetterAvatar from "../../components/Animated3DLetterAvatar";

const defaultVendorFallback: User = {
  id: "user-vendor-1",
  name: "Apex Precision Engineering Ltd",
  companyName: "Apex Precision Engineering Ltd",
  email: "contact@apexprecision.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
  role: "vendor",
  verified: true,
  createdAt: new Date().toISOString(),
  vendorProfile: {
    userId: "user-vendor-1",
    businessName: "Apex Precision Engineering Ltd",
    leadCredits: 150,
    categories: ["Manufacturing", "Industrial Supplies", "Engineering"],
    services: ["CNC Machining", "Laser Cutting", "Sheet Metal Fabrication"],
    category: "Industrial Automation",
    gstNumber: "27AAACA1234A1Z5",
    panNumber: "AAACA1234A",
    location: "Pune",
    coordinates: [18.5204, 73.8567],
    portfolio: [],
    availability: "immediate",
    pricingModel: "hybrid",
    pricingMin: 25000,
    subscriptionPlan: "gold",
    responseTime: "Within 2 hours",
    ratings: { avg: 4.8, count: 142, quality: 4.9, timeliness: 4.7, communication: 4.8 }
  }
};

export default function VendorCompanyProfile() {
  const context = useOutletContext<{ currentUser?: User }>();
  const navigate = useNavigate();

  const currentUser = context?.currentUser || defaultVendorFallback;

  const vp = currentUser.vendorProfile;
  const businessName = typeof vp?.businessName === "string" ? vp.businessName : currentUser.companyName || currentUser.name || "Apex Precision Engineering Ltd";
  const gstin = typeof vp?.gstNumber === "string" ? vp.gstNumber : currentUser.gstin || "29AAAAA0000A1Z5";
  const pan = typeof vp?.panNumber === "string" ? vp.panNumber : currentUser.panNumber || "AAAAA0000A";
  
  const rawCategory = vp?.category || "Industrial Automation";
  const category = typeof rawCategory === "string" ? rawCategory : (rawCategory as any)?.title || (rawCategory as any)?.name || "Industrial Automation";
  
  const rawCategories = vp?.categories || ["Manufacturing", "Industrial Supplies", "Engineering"];
  const categories = Array.isArray(rawCategories) ? rawCategories : [];
  
  const rawServices = vp?.services || ["CNC Machining", "Laser Cutting", "Sheet Metal Fabrication"];
  const services = Array.isArray(rawServices) ? rawServices : [];

  const pricingModel = vp?.pricingModel || "hybrid";
  const pricingMin = vp?.pricingMin || 25000;
  const location = typeof vp?.location === "string" ? vp.location : currentUser.city || "Pune";
  const city = currentUser.city || "Pune";
  const state = currentUser.state || "Maharashtra";
  const pincode = currentUser.pincode || "411001";
  const address = currentUser.address || `MIDC Industrial Area, Phase III, ${city}, ${state} - ${pincode}`;
  const website = currentUser.website || "https://example-vendor.com";
  const description = currentUser.description || `${businessName} is a verified wholesale manufacturer and B2B supplier specializing in ${category}. We serve enterprises across India with precision-engineered products, competitive MOQ pricing, and milestone-backed delivery through Bussinest verified escrow.`;
  const designation = currentUser.designation || "Managing Director";
  const phone = currentUser.phone || "+91 98765 43210";
  const whatsapp = currentUser.whatsapp || phone;
  const yearEstablished = currentUser.yearEstablished || "2015";
  const companySize = currentUser.companySize || "51-200 Employees";
  const annualTurnover = currentUser.annualTurnover || "₹10 Cr – ₹50 Cr";
  const responseTime = vp?.responseTime || "Within 2 hours";
  const availability = vp?.availability || "immediate";
  const subscriptionPlan = vp?.subscriptionPlan || "gold";
  const ratings = vp?.ratings || { avg: 4.8, count: 142, quality: 4.9, timeliness: 4.7, communication: 4.8 };
  const leadCredits = vp?.leadCredits || 0;

  const pricingLabels: Record<string, string> = {
    hourly: "Hourly Rate",
    fixed: "Fixed Project",
    retainer: "Monthly Retainer",
    hybrid: "Hybrid (Fixed + Milestone)",
  };

  const availabilityLabels: Record<string, string> = {
    immediate: "Immediate – Ready Now",
    two_weeks: "Within 2 Weeks",
    one_month: "Within 1 Month",
    unavailable: "Currently Booked",
  };

  const planBadge: Record<string, { label: string; color: string }> = {
    free: { label: "Free Tier", color: "bg-slate-100 text-slate-700 border-slate-200" },
    silver: { label: "Silver Partner", color: "bg-slate-100 text-slate-700 border-slate-300" },
    gold: { label: "Gold Partner", color: "bg-amber-100 text-amber-800 border-amber-300" },
    enterprise: { label: "Enterprise", color: "bg-sky-100 text-sky-800 border-sky-300" },
  };

  const badge = planBadge[subscriptionPlan] || planBadge.free;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-20 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-emerald-700 flex items-center gap-1.5 mb-1">
            <Factory size={13} /> Vendor Business Dossier
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Company Profile
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            Your live verified B2B supplier profile visible to buyers across the wholesale directory.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/vendor/settings")}
            className="neo-btn px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 size={14} /> Edit Profile
          </button>
          <button
            onClick={() => navigate("/vendor/portfolio")}
            className="neo-btn-primary px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Layers size={14} /> Manage Portfolio
          </button>
        </div>
      </div>

      {/* Main Profile Container */}
      <div className="neo-card rounded-3xl overflow-hidden shadow-lg border border-emerald-100 bg-white">
        
        {/* Cover Hero Banner */}
        <div className="h-48 sm:h-60 w-full bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-700 relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-emerald-100 border border-white/30 flex items-center gap-1.5">
                <ShieldCheck size={13} /> Verified Manufacturer
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs border ${badge.color}`}>
                <Sparkles size={11} /> {badge.label}
              </span>
              <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                <CheckCircle2 size={12} /> Escrow Verified
              </span>
            </div>
            <span className="text-white/80 font-mono text-xs font-semibold hidden sm:block">ID: {(currentUser?.id || "user-vendor-1").slice(0, 10)}</span>
          </div>

          <div className="relative z-10 text-white flex flex-wrap items-center gap-3 text-xs font-medium">
            <span className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <Star size={13} className="text-amber-300 fill-amber-300" /> {ratings.avg}/5 ({ratings.count} reviews)
            </span>
            <span className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <Clock size={13} className="text-sky-300" /> Response: {responseTime}
            </span>
            <span className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <Zap size={13} className="text-amber-300" /> {leadCredits} Lead Credits
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="p-6 sm:p-10 relative">
          
          {/* Header Row with Floating Avatar Token */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="p-1.5 bg-white rounded-3xl shadow-2xl border-2 border-emerald-100 shrink-0">
                <Animated3DLetterAvatar 
                  role="vendor" 
                  size="2xl" 
                  customImage={currentUser.useCustomAvatar ? (currentUser.customAvatar || currentUser.avatar) : undefined}
                  useCustomAvatar={currentUser.useCustomAvatar}
                />
              </div>

              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {businessName}
                  </h2>
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-emerald-200">
                    Verified Vendor
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 flex flex-wrap items-center gap-2">
                  <span>{category}</span>
                  <span>•</span>
                  <span>{pricingLabels[pricingModel] || "Hybrid"}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-emerald-700 font-bold">
                    <MapPin size={13} /> {location}, {state}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/vendor/settings")}
                className="neo-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-emerald-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={13} /> Manage
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Annual Revenue</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">{annualTurnover}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Team Size</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">{companySize}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Established</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">Year {yearEstablished}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50/60 to-white border border-amber-100 text-center">
              <p className="text-[11px] font-extrabold text-amber-600 uppercase tracking-wider">Avg Rating</p>
              <p className="text-base sm:text-lg font-black text-amber-700 mt-1 flex items-center justify-center gap-1">
                <Star size={16} className="fill-amber-400 text-amber-400" /> {ratings.avg}/5
              </p>
            </div>
          </div>

          {/* Two Columns: Left Details, Right Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About & Manufacturing Focus */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-emerald-600" /> Company Overview
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {description}
                </p>
              </div>

              {/* Services & Capabilities */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Wrench size={16} className="text-emerald-600" /> Services & Capabilities
                </h3>
                
                <div className="mb-4">
                  <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Primary Category</p>
                  <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200">
                    {category}
                  </span>
                </div>

                {categories.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Additional Categories</p>
                    <div className="flex flex-wrap gap-2">
                      {categories.map((cat: any, i: number) => {
                        const catName = typeof cat === "string" ? cat : cat?.name || cat?.title || "Category";
                        return (
                          <span key={i} className="px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-semibold border border-sky-100">
                            {catName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}

                {services.length > 0 && (
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">Offered Services</p>
                    <div className="flex flex-wrap gap-2">
                      {services.map((svc: any, i: number) => {
                        const svcName = typeof svc === "string" ? svc : svc?.title || svc?.name || "Service Offering";
                        return (
                          <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200/80 flex items-center gap-1.5">
                            <Package size={11} className="text-slate-400" /> {svcName}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Statutory & Tax Identifiers */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BadgeCheck size={16} className="text-emerald-600" /> Statutory & Compliance
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">GSTIN Number</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                      <span>{gstin}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">VERIFIED</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PAN Number</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{pan}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Pricing Model</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{pricingLabels[pricingModel]}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Min Order Value</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">₹{pricingMin.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {/* Manufacturing Address */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-emerald-600" /> Manufacturing & Office Address
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {address}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>City: <strong className="text-slate-800">{city}</strong></span>
                  <span>State: <strong className="text-slate-800">{state}</strong></span>
                  <span>PIN: <strong className="text-slate-800">{pincode}</strong></span>
                </div>
              </div>

              {/* Ratings Breakdown */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Star size={16} className="text-amber-500" /> Performance Ratings
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Product Quality", value: ratings.quality, color: "emerald" },
                    { label: "Timeliness", value: ratings.timeliness, color: "sky" },
                    { label: "Communication", value: ratings.communication, color: "violet" },
                  ].map((r) => (
                    <div key={r.label} className="text-center p-4 rounded-xl bg-slate-50 border border-slate-200/70">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">{r.label}</p>
                      <p className="text-2xl font-black text-slate-900">{r.value}</p>
                      <div className="mt-2 w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${r.color === "emerald" ? "bg-emerald-500" : r.color === "sky" ? "bg-sky-500" : "bg-violet-500"}`}
                          style={{ width: `${(r.value / 5) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Column: Contact & Trust */}
            <div className="space-y-6">
              
              {/* Availability & Status */}
              <div className="neo-card p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 via-white to-teal-50/50 border border-emerald-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-emerald-600" /> Availability
                </h3>
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white border border-emerald-100">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Current Status</p>
                    <p className="text-sm font-bold text-emerald-700 mt-0.5 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      {availabilityLabels[availability]}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white border border-emerald-100">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Avg Response</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <Clock size={13} className="text-sky-500" /> {responseTime}
                    </p>
                  </div>
                </div>
              </div>

              {/* Contact Officer Card */}
              <div className="neo-card p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50 border border-sky-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={16} className="text-sky-600" /> Authorized Contact
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Representative</p>
                    <p className="font-bold text-slate-900 mt-0.5">{currentUser.name}</p>
                    <p className="text-xs text-emerald-700 font-semibold">{designation}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Business Email</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5 break-all">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Direct Phone</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      {phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">WhatsApp</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-emerald-600 shrink-0" />
                      {whatsapp}
                    </p>
                  </div>

                  {website && (
                    <div className="pt-2 border-t border-sky-100">
                      <a
                        href={website.startsWith("http") ? website : `https://${website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 underline"
                      >
                        <Globe size={13} /> {website.replace(/^https?:\/\//, '')} <ArrowUpRight size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Escrow Trust Badge */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950">Escrow Protected Vendor</h4>
                    <p className="text-[11px] text-emerald-800 font-medium mt-1 leading-snug">
                      All milestone payments for projects awarded to this vendor are secured through Bussinest Verified Escrow with buyer-approved release gates.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
