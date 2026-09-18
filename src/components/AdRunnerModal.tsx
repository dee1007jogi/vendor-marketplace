import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X, Sparkles, Megaphone, Clock, Calendar, MapPin,
  Layers, ShieldCheck, CheckCircle2, ArrowRight, Eye,
  TrendingUp, Zap, HelpCircle, AlertCircle, Percent,
  Building2, Image as ImageIcon, ExternalLink, ChevronRight, Check
} from 'lucide-react';
import { AdPlacementType, AdTimeSlot, AdCampaign, User } from '../types';
import {
  AD_PLACEMENTS, AD_TIME_SLOTS, DURATION_DISCOUNT_TIERS,
  calculateAdPrice, addAdCampaign
} from '../lib/adEngine';

interface AdRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onCampaignCreated?: (campaign: AdCampaign) => void;
  initialPlacement?: AdPlacementType;
}

const PRESET_IMAGES = [
  { label: "Machinery & CNC", url: "/uploads/INDUSTRIAL MACHINERY & CNC.png" },
  { label: "Raw Steel & Metals", url: "/uploads/STEEL & METALSCHINERY & CNC.png" },
  { label: "Bulk Chemicals & Pharma", url: "/uploads/pharama.png" },
  { label: "Construction, Cement & Tiles", url: "/uploads/CONSTRUCTION, CEMENT & TILES.png" },
  { label: "Textiles, Yarns & Uniforms", url: "/uploads/TEXTILES, YARNS & UNIFORMS.png" },
  { label: "Packaging & Corrugated Boxes", url: "/uploads/PACKAGING & CORRUGATED BOXEs.png" },
  { label: "Electricals, Solar & Power", url: "/uploads/ELECTRICALS, SOLAR & POWER.png" },
];

const POPULAR_CATEGORIES = [
  "All Industrial Categories",
  "Industrial Machinery & CNC",
  "Textiles & Garments",
  "Raw Steel & Metals",
  "Chemicals & Polymers",
  "Automotive & Precision Spares",
  "Packaging & Corrugated Boxes",
  "Electrical & Electronics",
  "Construction & Infrastructure Materials"
];

const POPULAR_LOCATIONS = [
  "All India (Pan-Marketplace)",
  "Pune Auto Cluster, Maharashtra",
  "Surat Textile Belt, Gujarat",
  "Ludhiana Industrial Hub, Punjab",
  "Vapi Chemical Complex, Gujarat",
  "Ahmedabad GIDC Belt, Gujarat",
  "Delhi NCR Sourcing Belt",
  "Bangalore Industrial Corridor, Karnataka",
  "Chennai Automotive Belt, Tamil Nadu",
  "Hyderabad Pharma & Industrial Hub, Telangana"
];

export default function AdRunnerModal({
  isOpen,
  onClose,
  currentUser,
  onCampaignCreated,
  initialPlacement = "popup_modal"
}: AdRunnerModalProps) {
  // Step State
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Form State
  const [placement, setPlacement] = useState<AdPlacementType>(initialPlacement);
  const [headline, setHeadline] = useState<string>("Exclusive 20% Factory Direct Bulk Discounts");
  const [description, setDescription] = useState<string>("ISO 9001 Certified OEM Manufacturer. Immediate production capacity with 50/50 milestone escrow protection.");
  const [badgeText, setBadgeText] = useState<string>("⚡ FLASH SOURCING DEAL");
  const [ctaText, setCtaText] = useState<string>("Request Instant Quote");
  const [ctaUrl, setCtaUrl] = useState<string>("/vendors");
  const [bannerImage, setBannerImage] = useState<string>(PRESET_IMAGES[0].url);

  // Schedule & Time State
  const [durationDays, setDurationDays] = useState<number>(7);
  const [timeSlot, setTimeSlot] = useState<AdTimeSlot>("prime_b2b");
  const [startDate, setStartDate] = useState<string>(() => new Date().toISOString().split("T")[0]);

  // Targeting & Preferences
  const [targetCategory, setTargetCategory] = useState<string>("All Industrial Categories");
  const [targetLocation, setTargetLocation] = useState<string>("All India (Pan-Marketplace)");
  const [targetAudience, setTargetAudience] = useState<"all_visitors" | "verified_buyers" | "rfq_creators" | "msme_enterprises">("verified_buyers");

  // Advertiser Contact Info
  const [advertiserName, setAdvertiserName] = useState<string>(currentUser?.vendorProfile?.businessName || currentUser?.name || "Apex Precision Industrialist");
  const [advertiserEmail, setAdvertiserEmail] = useState<string>(currentUser?.email || "procurement@bussinest.com");
  const [advertiserPhone, setAdvertiserPhone] = useState<string>(currentUser?.phone || "+91 98220 11456");

  // Dynamic Pricing Calculation
  const pricing = useMemo(() => {
    return calculateAdPrice({
      placement,
      durationDays,
      timeSlot,
      targetCategory: targetCategory.includes("All") ? "all" : targetCategory,
      targetLocation: targetLocation.includes("All") ? "all" : targetLocation
    });
  }, [placement, durationDays, timeSlot, targetCategory, targetLocation]);

  const activePlacementConfig = AD_PLACEMENTS[placement];
  const activeTimeSlotConfig = AD_TIME_SLOTS[timeSlot];

  const handleLaunchCampaign = async () => {
    setIsSubmitting(true);
    try {
      const campaignPayload = {
        advertiserId: currentUser?.id || "user-vendor-1",
        advertiserName,
        advertiserEmail,
        advertiserPhone,
        advertiserRole: currentUser?.role || "vendor",
        title: `${headline.slice(0, 35)}...`,
        headline,
        description,
        badgeText,
        ctaText,
        ctaUrl,
        bannerImage,
        placement,
        timeSlot,
        targetCategory: targetCategory.includes("All") ? "all" : targetCategory,
        targetLocation: targetLocation.includes("All") ? "all" : targetLocation,
        targetAudience,
        durationDays,
        startDate
      };

      // Try backend POST first
      let createdCampaign: AdCampaign | null = null;
      try {
        const response = await fetch("/api/ads/campaigns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(campaignPayload)
        });
        if (response.ok) {
          const data = await response.json();
          createdCampaign = data.campaign;
        }
      } catch (e) {
        console.warn("Backend ad campaign creation failed, using client ad engine", e);
      }

      // If backend failed or offline, save locally
      if (!createdCampaign) {
        const start = new Date(startDate);
        const end = new Date(start.getTime() + durationDays * 24 * 60 * 60 * 1000);

        createdCampaign = {
          id: `ad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          advertiserId: currentUser?.id || "user-vendor-1",
          advertiserName,
          advertiserEmail,
          advertiserPhone,
          advertiserRole: (currentUser?.role as any) || "vendor",
          title: `${headline.slice(0, 35)}...`,
          headline,
          description,
          badgeText,
          ctaText,
          ctaUrl,
          bannerImage,
          placement,
          timeSlot,
          targetCategory: targetCategory.includes("All") ? "all" : targetCategory,
          targetLocation: targetLocation.includes("All") ? "all" : targetLocation,
          targetAudience,
          durationDays,
          startDate: start.toISOString(),
          endDate: end.toISOString(),
          pricing,
          status: "active",
          paymentStatus: "paid",
          stats: {
            impressions: 1,
            clicks: 0,
            ctr: 0.0,
            budgetSpent: pricing.totalPayable
          },
          verifiedBadge: true,
          createdAt: new Date().toISOString()
        };
        addAdCampaign(createdCampaign);
      }

      setIsSuccess(true);
      if (onCampaignCreated) onCampaignCreated(createdCampaign);

      setTimeout(() => {
        setIsSuccess(false);
        onClose();
        setCurrentStep(1);
      }, 2200);
    } catch (err: any) {
      alert(err.message || "Failed to launch campaign");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-sky-950/25 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="bg-white rounded-3xl max-w-5xl w-full border border-sky-200 shadow-2xl overflow-hidden relative max-h-[94vh] flex flex-col"
        >
          {/* Top Gold Line */}
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

          {/* Modal Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-slate-900 via-[#0a275e] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 relative">
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner">
                <Megaphone size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                    Retail Media Network (RMN)
                  </span>
                  <span className="text-[11px] text-sky-200 font-mono flex items-center gap-1">
                    <Sparkles size={12} className="text-amber-300" /> High-Margin Discovery Ads
                  </span>
                </div>
                <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white leading-tight">
                  Ad Runner Studio & Campaign Launcher
                </h2>
                <p className="text-xs text-sky-200/80">
                  Run targeted B2B spotlight campaigns with dynamic time-slot pricing, geo-clustering & live preview.
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {/* Step Progression Bar */}
          <div className="px-5 py-3 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0">
            <div className="flex items-center justify-between min-w-[580px] max-w-3xl mx-auto text-xs font-bold">
              {[
                { step: 1, label: "1. Placement Picker" },
                { step: 2, label: "2. Creative & Preview" },
                { step: 3, label: "3. Schedule & Slots" },
                { step: 4, label: "4. Preferences" },
                { step: 5, label: "5. Cost & Launch" },
              ].map(s => {
                const isActive = currentStep === s.step;
                const isCompleted = currentStep > s.step;
                return (
                  <button
                    key={s.step}
                    onClick={() => setCurrentStep(s.step as any)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all cursor-pointer ${isActive
                      ? 'bg-sky-600 text-white shadow-xs'
                      : isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'text-slate-500 hover:text-slate-800'
                      }`}
                  >
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${isActive ? 'bg-white text-sky-900' : isCompleted ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                      {isCompleted ? <Check size={12} /> : s.step}
                    </span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Modal Main Content Area */}
          <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">

            {/* SUCCESS STATE OVERLAY */}
            {isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-10 rounded-3xl bg-emerald-50 border-2 border-emerald-300 text-center space-y-4 my-6"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-emerald-950 font-heading">
                  Ad Campaign Successfully Scheduled & Launched!
                </h3>
                <p className="text-sm text-emerald-800 max-w-md mx-auto">
                  Your ad is now active in the <strong>{activePlacementConfig.title}</strong> queue with <strong>{activeTimeSlotConfig.name}</strong> delivery.
                </p>
                <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-xl text-xs font-mono font-bold text-slate-800 border border-emerald-200">
                  Total Billed: ₹{pricing.totalPayable.toLocaleString()} (GST 18% Included)
                </div>
              </motion.div>
            )}

            {!isSuccess && (
              <>
                {/* STEP 1: PLACEMENT PICKER */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 font-heading">
                        Select Where Your Ad Runs on the Marketplace
                      </h3>
                      <p className="text-xs text-slate-500">
                        Choose high-intent placements based on your target visibility, conversion rate, and budget.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {Object.values(AD_PLACEMENTS).map(p => {
                        const isSelected = placement === p.type;
                        return (
                          <div
                            key={p.type}
                            onClick={() => setPlacement(p.type)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden ${isSelected
                              ? 'bg-sky-50/60 border-sky-600 shadow-md ring-2 ring-sky-600/20'
                              : 'bg-white border-slate-200 hover:border-sky-300 hover:shadow-xs'
                              }`}
                          >
                            {isSelected && (
                              <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-sky-600 text-white flex items-center justify-center">
                                <Check size={12} />
                              </div>
                            )}

                            <div>
                              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-950 text-[10px] font-black uppercase tracking-wider mb-2">
                                {p.badge}
                              </span>
                              <h4 className="font-bold text-slate-900 text-sm mb-1 leading-snug">
                                {p.title}
                              </h4>
                              <p className="text-xs text-slate-500 leading-relaxed mb-3">
                                {p.subtitle}
                              </p>
                            </div>

                            <div className="pt-3 border-t border-slate-100 space-y-1.5 text-xs">
                              <div className="flex items-center justify-between">
                                <span className="text-slate-400 font-medium">Base Price:</span>
                                <span className="font-mono font-black text-sky-950 text-sm">₹{p.baseRatePerDay.toLocaleString()} / day</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>Est. Traffic:</span>
                                <span className="font-bold text-emerald-700">{p.estWeeklyViews}</span>
                              </div>
                              <div className="flex items-center justify-between text-[11px] text-slate-500">
                                <span>Expected CTR:</span>
                                <span className="font-bold text-amber-800">{p.estCtr}</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* STEP 2: CREATIVE BUILDER & LIVE PREVIEW */}
                {currentStep === 2 && (
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Form Controls */}
                    <div className="lg:col-span-6 space-y-4">
                      <div>
                        <h3 className="text-lg font-black text-slate-900 font-heading">
                          Customize Your Ad Creative
                        </h3>
                        <p className="text-xs text-slate-500">
                          Add an attention-grabbing headline, call to action, and select a high-impact B2B visual.
                        </p>
                      </div>

                      <div className="space-y-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Promotion Badge / Tag
                          </label>
                          <input
                            type="text"
                            value={badgeText}
                            onChange={(e) => setBadgeText(e.target.value)}
                            placeholder="e.g. ⚡ FLASH DEAL 20% OFF"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-xs font-bold text-amber-900 bg-amber-50/40"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Headline (Main Offer)
                          </label>
                          <input
                            type="text"
                            value={headline}
                            onChange={(e) => setHeadline(e.target.value)}
                            placeholder="e.g. Save 20% on Heavy Drop Forgings & Precision CNC"
                            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-xs font-bold text-slate-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1">
                            Tagline / Sub-description
                          </label>
                          <textarea
                            rows={2}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Describe your manufacturing capacity, certifications, or delivery turnaround..."
                            className="w-full px-3.5 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none text-xs text-slate-700 resize-none"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Action Button (CTA)
                            </label>
                            <input
                              type="text"
                              value={ctaText}
                              onChange={(e) => setCtaText(e.target.value)}
                              placeholder="e.g. Request Fast Quote"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-xs font-bold text-slate-900"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-slate-700 mb-1">
                              Target Action URL
                            </label>
                            <input
                              type="text"
                              value={ctaUrl}
                              onChange={(e) => setCtaUrl(e.target.value)}
                              placeholder="/vendors or profile URL"
                              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:ring-2 focus:ring-sky-500 text-xs font-mono text-slate-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-bold text-slate-700 mb-1.5">
                            Select High-Impact B2B Banner Visual
                          </label>
                          <div className="grid grid-cols-3 gap-2">
                            {PRESET_IMAGES.map((img, idx) => (
                              <div
                                key={idx}
                                onClick={() => setBannerImage(img.url)}
                                className={`rounded-xl overflow-hidden border-2 cursor-pointer relative group ${bannerImage === img.url ? 'border-sky-600 ring-2 ring-sky-600/30' : 'border-slate-200'
                                  }`}
                              >
                                <img src={img.url} alt={img.label} className="w-full h-14 object-cover" />
                                <div className="absolute inset-0 bg-sky-950/25 p-1 flex items-end">
                                  <span className="text-[9px] text-white font-bold truncate">{img.label}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Live Interactive Mockup Device */}
                    <div className="lg:col-span-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                          <Eye size={14} className="text-sky-600" /> Live Mockup Preview ({activePlacementConfig.title})
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                          {activePlacementConfig.dimensions}
                        </span>
                      </div>

                      {/* Mockup Frame based on placement */}
                      <div className="p-4 rounded-3xl bg-gradient-to-br from-sky-50 via-white to-sky-50/60 border-2 border-sky-200 shadow-inner flex flex-col justify-center min-h-[300px] relative overflow-hidden">

                        {/* 1. POPUP MODAL PREVIEW */}
                        {placement === "popup_modal" && (
                          <div className="bg-white border-2 border-amber-400/80 rounded-2xl p-4 text-slate-900 shadow-xl relative overflow-hidden">
                            <div className="gold-line-animated absolute top-0 left-0 right-0 h-[2px]" />
                            <div className="flex items-center justify-between mb-2">
                              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                                {badgeText || "⚡ PROMOTIONAL OFFER"}
                              </span>
                              <span className="text-[10px] text-amber-700 font-mono font-bold">Bussinest Verified</span>
                            </div>
                            <div className="flex gap-3 items-center">
                              <img src={bannerImage} alt="Ad banner" className="w-20 h-20 rounded-xl object-cover border border-amber-400/30 shrink-0" />
                              <div>
                                <h4 className="font-black text-sm text-slate-900 leading-tight mb-1">
                                  {headline}
                                </h4>
                                <p className="text-[11px] text-slate-600 line-clamp-2">
                                  {description}
                                </p>
                              </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-sky-100 flex items-center justify-between">
                              <span className="text-[10px] text-slate-500">By {advertiserName}</span>
                              <button className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md">
                                {ctaText} →
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 2. TOP BANNER PREVIEW */}
                        {placement === "top_banner" && (
                          <div className="w-full bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 border border-sky-400 p-2.5 rounded-xl flex items-center justify-between gap-3 text-white shadow-md">
                            <div className="flex items-center gap-2 truncate">
                              <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase shrink-0">
                                {badgeText || "SPONSORED"}
                              </span>
                              <span className="text-xs font-bold text-white truncate">{headline}</span>
                            </div>
                            <button className="px-3 py-1 rounded-lg bg-amber-400 text-slate-950 text-[11px] font-black shrink-0 shadow-xs">
                              {ctaText}
                            </button>
                          </div>
                        )}

                        {/* 3. HERO SPOTLIGHT PREVIEW */}
                        {placement === "hero_spotlight" && (
                          <div className="relative rounded-2xl overflow-hidden border border-sky-300 shadow-md group">
                            <img src={bannerImage} alt="Hero ad" className="w-full h-44 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/35 to-transparent p-4 flex flex-col justify-end text-white">
                              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase w-fit mb-1.5">
                                {badgeText}
                              </span>
                              <h4 className="text-base font-black leading-tight text-white mb-1">{headline}</h4>
                              <p className="text-xs text-sky-100 line-clamp-1 mb-2">{description}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] text-slate-300">{advertiserName}</span>
                                <button className="px-3 py-1.5 rounded-xl bg-sky-500 text-white font-bold text-xs shadow-sm">
                                  {ctaText}
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* 4. FLOATING CORNER / CATEGORY / NATIVE PREVIEW */}
                        {placement !== "popup_modal" && placement !== "top_banner" && placement !== "hero_spotlight" && (
                          <div className="bg-white border-2 border-sky-200 rounded-2xl p-4 text-slate-900 space-y-2 shadow-md">
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black text-amber-600 uppercase">{badgeText}</span>
                              <span className="text-[10px] text-slate-500 font-semibold">{placement.replace("_", " ")}</span>
                            </div>
                            <h4 className="font-bold text-sm text-slate-900">{headline}</h4>
                            <p className="text-xs text-slate-600">{description}</p>
                            <button className="w-full py-2 bg-amber-400 text-slate-950 rounded-xl text-xs font-bold shadow-xs">
                              {ctaText}
                            </button>
                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 3: SCHEDULE & TIME SLOTS */}
                {currentStep === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 font-heading">
                        Configure Campaign Duration & Time Slots
                      </h3>
                      <p className="text-xs text-slate-500">
                        Choose duration volume tiers and optimal procurement hours to maximize ROI.
                      </p>
                    </div>

                    {/* Duration Volume Discount Selector */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Select Campaign Duration (Longer campaigns unlock up to 40% OFF)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                        {[
                          { days: 1, label: "1 Day", discount: "0% OFF" },
                          { days: 3, label: "3 Days", discount: "5% OFF" },
                          { days: 7, label: "7 Days (1 Wk)", discount: "15% OFF" },
                          { days: 15, label: "15 Days", discount: "25% OFF" },
                          { days: 30, label: "30 Days (1 Mo)", discount: "40% OFF" },
                        ].map(t => (
                          <button
                            key={t.days}
                            onClick={() => setDurationDays(t.days)}
                            className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer ${durationDays === t.days
                              ? 'bg-sky-50 border-sky-600 text-sky-950 ring-2 ring-sky-600/20 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                              }`}
                          >
                            <span className="block font-black text-sm">{t.label}</span>
                            <span className={`block text-[11px] font-mono font-bold mt-0.5 ${t.days >= 15 ? 'text-amber-700' : 'text-emerald-700'
                              }`}>
                              {t.discount}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time of Day Slot Picker */}
                    <div className="space-y-2 pt-2">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                        <Clock size={14} className="text-sky-600" /> Time-of-Day Sourcing Slots (Procurement Peaks)
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {Object.values(AD_TIME_SLOTS).map(slot => {
                          const isSelected = timeSlot === slot.id;
                          return (
                            <div
                              key={slot.id}
                              onClick={() => setTimeSlot(slot.id)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${isSelected
                                ? 'bg-amber-50/60 border-amber-500 shadow-sm ring-2 ring-amber-500/20'
                                : 'bg-white border-slate-200 hover:border-slate-300'
                                }`}
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="font-bold text-slate-900 text-sm">{slot.name}</h4>
                                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900">
                                  {slot.badge}
                                </span>
                              </div>
                              <p className="text-[11px] font-mono text-slate-600 mb-1">{slot.timeRange}</p>
                              <p className="text-xs text-slate-500 leading-relaxed">{slot.description}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Start Date */}
                    <div className="max-w-xs space-y-1 pt-2">
                      <label className="block text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Calendar size={13} className="text-sky-600" /> Campaign Launch Start Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="px-3.5 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 w-full"
                      />
                    </div>
                  </div>
                )}

                {/* STEP 4: PREFERENCES & TARGETING */}
                {currentStep === 4 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 font-heading">
                        Targeting Preferences & Industrial Audience
                      </h3>
                      <p className="text-xs text-slate-500">
                        Narrow down your target audience to specific manufacturing sectors, geographic industrial hubs, or buyer roles.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Category Targeting */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Layers size={14} className="text-sky-600" /> Targeted Industry Sector
                        </label>
                        <select
                          value={targetCategory}
                          onChange={(e) => setTargetCategory(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                        >
                          {POPULAR_CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                        <p className="text-[11px] text-slate-500">
                          {targetCategory.includes("All")
                            ? "✓ Broad pan-marketplace delivery (No category surcharge)"
                            : "⚡ High-intent targeting (+₹150/day precision delivery)"}
                        </p>
                      </div>

                      {/* Location Hub Targeting */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                        <label className="block text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <MapPin size={14} className="text-emerald-600" /> Targeted Industrial Geographic Cluster
                        </label>
                        <select
                          value={targetLocation}
                          onChange={(e) => setTargetLocation(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-bold text-slate-900 bg-white"
                        >
                          {POPULAR_LOCATIONS.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                          ))}
                        </select>
                        <p className="text-[11px] text-slate-500">
                          {targetLocation.includes("All")
                            ? "✓ Pan-India reach (No geo surcharge)"
                            : "🎯 Regional cluster priority (+₹200/day localized delivery)"}
                        </p>
                      </div>
                    </div>

                    {/* Audience Segment Selection */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-700">
                        Target Audience Segment
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: "verified_buyers", title: "Verified Enterprise Buyers", desc: "Procurement teams with verified GSTIN and budget history." },
                          { id: "rfq_creators", title: "Active RFQ Creators", desc: "Buyers who posted RFP quotes within the last 14 days." },
                          { id: "all_visitors", title: "All Marketplace Traffic", desc: "Maximum volume across guest searches and browsing visitors." }
                        ].map(seg => (
                          <div
                            key={seg.id}
                            onClick={() => setTargetAudience(seg.id as any)}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${targetAudience === seg.id
                              ? 'bg-sky-50 border-sky-600 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                          >
                            <h4 className="font-bold text-slate-900 text-xs mb-1">{seg.title}</h4>
                            <p className="text-[11px] text-slate-500">{seg.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Details */}
                    <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-3">
                      <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wider">
                        Advertiser Verification Details
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Company / Brand Name</label>
                          <input
                            type="text"
                            value={advertiserName}
                            onChange={(e) => setAdvertiserName(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-bold text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Official Email</label>
                          <input
                            type="email"
                            value={advertiserEmail}
                            onChange={(e) => setAdvertiserEmail(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 text-slate-900"
                          />
                        </div>
                        <div>
                          <label className="block font-bold text-slate-600 mb-1">Direct Phone</label>
                          <input
                            type="tel"
                            value={advertiserPhone}
                            onChange={(e) => setAdvertiserPhone(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl bg-white border border-slate-300 font-mono text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: COST BREAKDOWN & 1-CLICK LAUNCH */}
                {currentStep === 5 && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-black text-slate-900 font-heading">
                        Review Dynamic Price Breakdown & Launch Campaign
                      </h3>
                      <p className="text-xs text-slate-500">
                        Transparent commercial breakdown calculated with placement rates, time multipliers, and volume discounts.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      {/* Left: Summary Specs */}
                      <div className="md:col-span-6 space-y-3">
                        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
                          <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                            Campaign Configuration
                          </h4>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Placement:</span>
                            <span className="font-bold text-slate-900">{activePlacementConfig.title}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Duration:</span>
                            <span className="font-bold text-slate-900">{durationDays} Days (Starting {startDate})</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Time-of-Day Slot:</span>
                            <span className="font-bold text-amber-900">{activeTimeSlotConfig.name} ({activeTimeSlotConfig.timeRange})</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Target Industry:</span>
                            <span className="font-bold text-slate-900">{targetCategory}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">Target Hub Cluster:</span>
                            <span className="font-bold text-slate-900">{targetLocation}</span>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                          <ShieldCheck size={28} className="text-emerald-600 shrink-0" />
                          <div className="text-xs">
                            <h5 className="font-bold text-emerald-950">100% Escrow Delivery Guarantee</h5>
                            <p className="text-emerald-800">
                              Impressions are tracked in real-time. Unserved impressions are refunded automatically to your wallet.
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Right: Price Receipt Card */}
                      <div className="md:col-span-6">
                        <div className="p-5 rounded-3xl bg-gradient-to-b from-slate-900 to-[#0a275e] text-white space-y-3.5 shadow-xl relative overflow-hidden">
                          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

                          <h4 className="font-black text-sm text-white uppercase tracking-wider flex items-center justify-between">
                            <span>Dynamic Price Quote</span>
                            <span className="text-[10px] font-mono text-amber-400">Live Formula</span>
                          </h4>

                          <div className="space-y-2 text-xs border-y border-white/10 py-3">
                            <div className="flex justify-between text-slate-300">
                              <span>Base Rate (₹{pricing.baseRatePerDay} × {pricing.durationDays}d):</span>
                              <span className="font-mono">₹{pricing.grossAmount.toLocaleString()}</span>
                            </div>

                            {pricing.durationDiscountAmount > 0 && (
                              <div className="flex justify-between text-emerald-400 font-semibold">
                                <span>Volume Duration Savings ({pricing.durationDiscountPct}% OFF):</span>
                                <span className="font-mono">-₹{pricing.durationDiscountAmount.toLocaleString()}</span>
                              </div>
                            )}

                            {pricing.timeSlotSurcharge > 0 && (
                              <div className="flex justify-between text-amber-300">
                                <span>Peak Intent Multiplier ({pricing.timeSlotMultiplier}x):</span>
                                <span className="font-mono">+₹{pricing.timeSlotSurcharge.toLocaleString()}</span>
                              </div>
                            )}

                            {pricing.categoryTargetingFee > 0 && (
                              <div className="flex justify-between text-sky-200">
                                <span>Category Precision Surcharge:</span>
                                <span className="font-mono">+₹{pricing.categoryTargetingFee.toLocaleString()}</span>
                              </div>
                            )}

                            {pricing.locationTargetingFee > 0 && (
                              <div className="flex justify-between text-sky-200">
                                <span>Location Cluster Surcharge:</span>
                                <span className="font-mono">+₹{pricing.locationTargetingFee.toLocaleString()}</span>
                              </div>
                            )}

                            <div className="flex justify-between text-slate-200 pt-2 border-t border-white/10 font-bold">
                              <span>Taxable Subtotal:</span>
                              <span className="font-mono">₹{pricing.subtotal.toLocaleString()}</span>
                            </div>

                            <div className="flex justify-between text-slate-400 text-[11px]">
                              <span>GST (18% Statutory):</span>
                              <span className="font-mono">₹{pricing.gstAmount.toLocaleString()}</span>
                            </div>
                          </div>

                          {/* Grand Total */}
                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-amber-400">Total Net Payable:</span>
                              <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                                ₹{pricing.totalPayable.toLocaleString()}
                              </span>
                            </div>

                            <button
                              onClick={handleLaunchCampaign}
                              disabled={isSubmitting}
                              className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-sm shadow-lg shadow-amber-400/30 transition-all cursor-pointer flex items-center gap-2 active:scale-95 disabled:opacity-50"
                            >
                              {isSubmitting ? (
                                <span className="flex items-center gap-2">
                                  <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                                  Launching...
                                </span>
                              ) : (
                                <>
                                  <Zap size={16} />
                                  <span>Launch Ad</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

          </div>

          {/* Modal Footer Controls */}
          {!isSuccess && (
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
              <button
                onClick={() => {
                  if (currentStep > 1) setCurrentStep((currentStep - 1) as any);
                  else onClose();
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                {currentStep === 1 ? "Cancel" : "← Previous Step"}
              </button>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-slate-700 hidden sm:inline">
                  Est. Net: <strong className="text-sky-900 font-black">₹{pricing.totalPayable.toLocaleString()}</strong>
                </span>

                {currentStep < 5 ? (
                  <button
                    onClick={() => setCurrentStep((currentStep + 1) as any)}
                    className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ChevronRight size={15} />
                  </button>
                ) : (
                  <button
                    onClick={handleLaunchCampaign}
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
                  >
                    <Zap size={15} />
                    <span>Confirm & Launch Campaign</span>
                  </button>
                )}
              </div>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
