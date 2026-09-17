import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Sparkles, Megaphone, ExternalLink, ArrowRight, 
  Clock, ShieldCheck, ChevronRight, Minimize2, Maximize2, Zap
} from 'lucide-react';
import { AdCampaign } from '../types';
import { getStoredAdCampaigns, recordAdTelemetry } from '../lib/adEngine';

interface AdPopupBannerProps {
  onOpenAdRunner?: () => void;
}

export default function AdPopupBanner({ onOpenAdRunner }: AdPopupBannerProps) {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => getStoredAdCampaigns());
  
  // Visibility States
  const [showTopBanner, setShowTopBanner] = useState<boolean>(true);
  const [showPopupModal, setShowPopupModal] = useState<boolean>(false);
  const [showCornerWidget, setShowCornerWidget] = useState<boolean>(true);
  const [isCornerExpanded, setIsCornerExpanded] = useState<boolean>(true);

  // Sync with ad storage
  useEffect(() => {
    const handleUpdate = () => setCampaigns(getStoredAdCampaigns());
    window.addEventListener("bussinest_ads_updated", handleUpdate);
    return () => window.removeEventListener("bussinest_ads_updated", handleUpdate);
  }, []);

  // Filter Active Campaigns by Placement
  const activeTopBanner = useMemo(() => {
    return campaigns.find(c => c.placement === "top_banner" && c.status === "active");
  }, [campaigns]);

  const activePopupModal = useMemo(() => {
    return campaigns.find(c => c.placement === "popup_modal" && c.status === "active");
  }, [campaigns]);

  const activeCornerWidget = useMemo(() => {
    return campaigns.find(c => c.placement === "floating_corner" && c.status === "active");
  }, [campaigns]);

  // Delayed Entrance for Luxury Popup Modal (after 1.8s)
  useEffect(() => {
    if (!activePopupModal) return;
    
    // Check if dismissed in this session
    const isDismissed = sessionStorage.getItem(`bussinest_modal_dismissed_${activePopupModal.id}`);
    if (!isDismissed) {
      const timer = setTimeout(() => {
        setShowPopupModal(true);
        recordAdTelemetry(activePopupModal.id, "impression");
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [activePopupModal]);

  // Record impression for top banner on mount
  useEffect(() => {
    if (activeTopBanner && showTopBanner) {
      recordAdTelemetry(activeTopBanner.id, "impression");
    }
  }, [activeTopBanner, showTopBanner]);

  // Record impression for corner widget on mount
  useEffect(() => {
    if (activeCornerWidget && showCornerWidget) {
      recordAdTelemetry(activeCornerWidget.id, "impression");
    }
  }, [activeCornerWidget, showCornerWidget]);

  const handleDismissModal = () => {
    setShowPopupModal(false);
    if (activePopupModal) {
      sessionStorage.setItem(`bussinest_modal_dismissed_${activePopupModal.id}`, "true");
    }
  };

  const handleAdClick = (campaign: AdCampaign) => {
    recordAdTelemetry(campaign.id, "click");
    if (campaign.ctaUrl) {
      if (campaign.ctaUrl.startsWith("http")) {
        window.open(campaign.ctaUrl, "_blank");
      } else {
        window.location.href = campaign.ctaUrl;
      }
    }
  };

  return (
    <>
      {/* ========================================================================= */}
      {/* 1. GLOBAL STICKY TOP ANNOUNCEMENT BANNER */}
      {/* ========================================================================= */}
      {activeTopBanner && showTopBanner && (
        <div className="w-full bg-gradient-to-r from-sky-600 via-sky-700 to-blue-700 text-white text-xs py-2 px-4 border-b border-sky-300/40 relative z-40 overflow-hidden shadow-md">
          {/* Subtle gold shimmer */}
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[1.5px]" />

          <div className="max-w-[1400px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 truncate min-w-0">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shrink-0 shadow-xs">
                {activeTopBanner.badgeText || "⚡ SPONSORED"}
              </span>
              <span className="font-bold text-white text-xs sm:text-sm truncate">
                {activeTopBanner.headline}
              </span>
              <span className="text-sky-100/90 text-xs hidden md:inline truncate">
                • {activeTopBanner.description}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => handleAdClick(activeTopBanner)}
                className="px-3.5 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-sm transition-all flex items-center gap-1 cursor-pointer active:scale-95"
              >
                <span>{activeTopBanner.ctaText}</span>
                <ArrowRight size={13} />
              </button>

              <button
                onClick={() => setShowTopBanner(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Dismiss Banner"
              >
                <X size={15} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. LUXURY FLOATING GLASS SPOTLIGHT POPUP MODAL */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activePopupModal && showPopupModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/20 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-gradient-to-b from-white via-sky-50/80 to-white border-2 border-amber-400/70 rounded-3xl max-w-lg w-full text-slate-900 shadow-2xl overflow-hidden relative"
            >
              {/* Gold Hairline Accent */}
              <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

              {/* Close Button */}
              <button
                onClick={handleDismissModal}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-slate-950 transition-colors cursor-pointer border border-slate-200 shadow-md"
              >
                <X size={16} />
              </button>

              {/* Modal Banner Visual */}
              <div className="relative h-44 sm:h-48 overflow-hidden">
                <img 
                  src={activePopupModal.bannerImage} 
                  alt={activePopupModal.headline} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
                
                {/* Badges Over Visual */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md">
                    {activePopupModal.badgeText || "⚡ FEATURED EXPO SPOTLIGHT"}
                  </span>
                  <span className="text-[11px] font-mono font-bold text-sky-900 bg-white/95 px-2.5 py-0.5 rounded-full border border-sky-200 shadow-sm">
                    Bussinest Verified
                  </span>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 sm:p-6 space-y-4">
                <div>
                  <div className="text-[11px] font-mono text-sky-700 font-bold mb-1">
                    By {activePopupModal.advertiserName} • {activePopupModal.targetLocation}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black font-heading text-slate-950 leading-tight">
                    {activePopupModal.headline}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                    {activePopupModal.description}
                  </p>
                </div>

                {/* Trust Guarantee Pill */}
                <div className="p-2.5 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold">
                    <ShieldCheck size={16} />
                    <span>50/50 Milestone Escrow Protected</span>
                  </div>
                  <span className="text-[11px] text-amber-800 font-mono font-semibold">
                    Fast SLA Dispatch
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex items-center justify-between gap-3">
                  <button
                    onClick={handleDismissModal}
                    className="text-xs text-slate-500 hover:text-slate-800 font-semibold cursor-pointer underline-offset-4 hover:underline"
                  >
                    No thanks, maybe later
                  </button>

                  <button
                    onClick={() => handleAdClick(activePopupModal)}
                    className="px-6 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>{activePopupModal.ctaText}</span>
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 3. INTERACTIVE FLOATING CORNER GLASS PILL WIDGET */}
      {/* ========================================================================= */}
      {activeCornerWidget && showCornerWidget && (
        <div className="fixed bottom-6 right-6 z-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white/95 backdrop-blur-xl border-2 border-sky-200 rounded-2xl shadow-2xl text-slate-900 overflow-hidden max-w-xs sm:max-w-sm"
          >
            {/* Top Shimmer */}
            <div className="gold-line-animated h-[2px]" />

            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[9px] font-black uppercase tracking-wider">
                  {activeCornerWidget.badgeText || "⚡ SPONSORED PROMO"}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setIsCornerExpanded(!isCornerExpanded)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                  >
                    {isCornerExpanded ? <Minimize2 size={13} /> : <Maximize2 size={13} />}
                  </button>
                  <button
                    onClick={() => setShowCornerWidget(false)}
                    className="p-1 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800"
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>

              {isCornerExpanded && (
                <div className="space-y-2">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                    {activeCornerWidget.headline}
                  </h4>
                  <p className="text-[11px] text-slate-600 line-clamp-2">
                    {activeCornerWidget.description}
                  </p>
                  
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                      By {activeCornerWidget.advertiserName}
                    </span>
                    <button
                      onClick={() => handleAdClick(activeCornerWidget)}
                      className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-xs flex items-center gap-1 cursor-pointer active:scale-95"
                    >
                      <span>{activeCornerWidget.ctaText}</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}
