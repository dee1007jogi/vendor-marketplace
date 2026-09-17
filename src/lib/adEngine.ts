import { AdPlacementType, AdTimeSlot, AdPricingBreakdown, AdCampaign } from '../types';

export interface AdPlacementConfig {
  type: AdPlacementType;
  title: string;
  subtitle: string;
  baseRatePerDay: number;
  estWeeklyViews: string;
  estCtr: string;
  recommendedDuration: number;
  badge: string;
  dimensions: string;
  previewClass: string;
}

export const AD_PLACEMENTS: Record<AdPlacementType, AdPlacementConfig> = {
  popup_modal: {
    type: "popup_modal",
    title: "Luxury Floating Glass Spotlight Modal",
    subtitle: "High-impact popup modal triggering upon visitor entry with 100% focused attention",
    baseRatePerDay: 1499,
    estWeeklyViews: "45,000+ Views / Wk",
    estCtr: "5.8% CTR (Highest Conversion)",
    recommendedDuration: 7,
    badge: "🔥 Maximum Visibility",
    dimensions: "640 × 420 px (Modal Hero)",
    previewClass: "border-amber-400/80 shadow-amber-500/20"
  },
  top_banner: {
    type: "top_banner",
    title: "Global Sticky Header Announcement Bar",
    subtitle: "Sitewide persistent top strip visible across all pages and sourcing flows",
    baseRatePerDay: 899,
    estWeeklyViews: "120,000+ Views / Wk",
    estCtr: "3.4% CTR (Broad Reach)",
    recommendedDuration: 15,
    badge: "⚡ 100% Sitewide Reach",
    dimensions: "Full Width × 44 px",
    previewClass: "border-sky-400/80 shadow-sky-500/20"
  },
  hero_spotlight: {
    type: "hero_spotlight",
    title: "Homepage Prime Spotlight Card",
    subtitle: "Featured directly above-the-fold in the main landing marketplace showcase",
    baseRatePerDay: 1999,
    estWeeklyViews: "85,000+ Views / Wk",
    estCtr: "6.2% CTR (Enterprise Tier)",
    recommendedDuration: 7,
    badge: "👑 Prime Homepage Feature",
    dimensions: "1200 × 380 px (Cinema Hero)",
    previewClass: "border-yellow-400/90 shadow-yellow-500/30"
  },
  category_sponsor: {
    type: "category_sponsor",
    title: "Sourcing Category Sponsored Header",
    subtitle: "Pinned to high-intent buyers browsing specific industrial categories (e.g. CNC, Steel)",
    baseRatePerDay: 799,
    estWeeklyViews: "35,000+ Views / Wk",
    estCtr: "4.5% CTR (High Intent)",
    recommendedDuration: 15,
    badge: "🎯 Targeted Intent",
    dimensions: "980 × 160 px (Category Banner)",
    previewClass: "border-emerald-400/80 shadow-emerald-500/20"
  },
  floating_corner: {
    type: "floating_corner",
    title: "Interactive Floating Glass Pill Widget",
    subtitle: "Bottom-corner floating pill with live interactive expand/contract micro-actions",
    baseRatePerDay: 499,
    estWeeklyViews: "60,000+ Views / Wk",
    estCtr: "3.9% CTR (Interactive)",
    recommendedDuration: 30,
    badge: "✨ Non-Intrusive & Persistent",
    dimensions: "360 × 120 px (Corner Float)",
    previewClass: "border-indigo-400/80 shadow-indigo-500/20"
  },
  marketplace_native: {
    type: "marketplace_native",
    title: "Promoted Native Directory Card",
    subtitle: "Sponsored top placement in the verified supplier directory with gold verified badge",
    baseRatePerDay: 699,
    estWeeklyViews: "50,000+ Views / Wk",
    estCtr: "4.8% CTR (Direct RFQs)",
    recommendedDuration: 15,
    badge: "🏷️ Native Feed Placement",
    dimensions: "Standard Vendor Card",
    previewClass: "border-amber-400/60 shadow-amber-500/10"
  }
};

export interface AdTimeSlotConfig {
  id: AdTimeSlot;
  name: string;
  timeRange: string;
  multiplier: number;
  description: string;
  badge: string;
}

export const AD_TIME_SLOTS: Record<AdTimeSlot, AdTimeSlotConfig> = {
  all_day: {
    id: "all_day",
    name: "24/7 Continuous Delivery",
    timeRange: "All 24 Hours",
    multiplier: 1.0,
    description: "Evenly distributed delivery across all day and night traffic slots",
    badge: "Standard Delivery (1.0x)"
  },
  prime_b2b: {
    id: "prime_b2b",
    name: "Prime B2B Sourcing Hours",
    timeRange: "09:00 AM – 07:00 PM IST",
    multiplier: 1.25,
    description: "Peak corporate procurement hours when enterprise buyers submit heavy RFQs",
    badge: "⚡ +25% Peak Intent Boost"
  },
  evening_procurement: {
    id: "evening_procurement",
    name: "Evening Procurement Shift",
    timeRange: "06:00 PM – 12:00 AM IST",
    multiplier: 1.10,
    description: "Target evening factory managers and late-shift supply chain executives",
    badge: "🌙 +10% Evening Multiplier"
  },
  weekend_priority: {
    id: "weekend_priority",
    name: "Weekend Priority Bidding",
    timeRange: "Saturday & Sunday",
    multiplier: 1.15,
    description: "Weekend strategic planning sessions for factory expansions and new vendor shortlists",
    badge: "📆 +15% Weekend Priority"
  }
};

export const DURATION_DISCOUNT_TIERS = [
  { minDays: 30, discountPct: 40, label: "30+ Days (40% OFF - Enterprise Growth)" },
  { minDays: 15, discountPct: 25, label: "15 Days (25% OFF - Bi-Weekly Surge)" },
  { minDays: 7,  discountPct: 15, label: "7 Days (15% OFF - Weekly Standard)" },
  { minDays: 3,  discountPct: 5,  label: "3 Days (5% OFF - Flash Promo)" },
  { minDays: 1,  discountPct: 0,  label: "1-2 Days (Standard Daily Rate)" },
];

export const CATEGORY_TARGETING_SURCHARGE = 150; // per day
export const LOCATION_TARGETING_SURCHARGE = 200; // per day
export const GST_RATE = 0.18; // 18% GST

export function calculateAdPrice(params: {
  placement: AdPlacementType;
  durationDays: number;
  timeSlot: AdTimeSlot;
  targetCategory?: string;
  targetLocation?: string;
}): AdPricingBreakdown {
  const placementConfig = AD_PLACEMENTS[params.placement] || AD_PLACEMENTS.popup_modal;
  const timeSlotConfig = AD_TIME_SLOTS[params.timeSlot] || AD_TIME_SLOTS.all_day;
  const duration = Math.max(1, params.durationDays);

  const baseRatePerDay = placementConfig.baseRatePerDay;
  const grossAmount = baseRatePerDay * duration;

  // Determine volume discount
  let durationDiscountPct = 0;
  for (const tier of DURATION_DISCOUNT_TIERS) {
    if (duration >= tier.minDays) {
      durationDiscountPct = tier.discountPct;
      break;
    }
  }

  const durationDiscountAmount = Math.round((grossAmount * durationDiscountPct) / 100);
  const baseAfterDiscount = grossAmount - durationDiscountAmount;

  // Time slot multiplier surcharge on discounted base
  const timeSlotMultiplier = timeSlotConfig.multiplier;
  const timeSlotSurcharge = Math.round(baseAfterDiscount * (timeSlotMultiplier - 1));

  // Targeted Category / Location precision surcharges
  const hasCategoryTargeting = params.targetCategory && params.targetCategory !== "all";
  const hasLocationTargeting = params.targetLocation && params.targetLocation !== "all";

  const categoryTargetingFee = hasCategoryTargeting ? CATEGORY_TARGETING_SURCHARGE * duration : 0;
  const locationTargetingFee = hasLocationTargeting ? LOCATION_TARGETING_SURCHARGE * duration : 0;

  const subtotal = baseAfterDiscount + timeSlotSurcharge + categoryTargetingFee + locationTargetingFee;
  const gstAmount = Math.round(subtotal * GST_RATE);
  const totalPayable = subtotal + gstAmount;

  return {
    baseRatePerDay,
    durationDays: duration,
    grossAmount,
    durationDiscountPct,
    durationDiscountAmount,
    timeSlotMultiplier,
    timeSlotSurcharge,
    categoryTargetingFee,
    locationTargetingFee,
    subtotal,
    gstRatePct: 18,
    gstAmount,
    totalPayable
  };
}

// Initial Seed Ad Campaigns for Live Presentation & Testing
export const INITIAL_AD_CAMPAIGNS: AdCampaign[] = [
  {
    id: "ad-prime-modal-1",
    advertiserId: "user-vendor-1",
    advertiserName: "Apex Precision Forgings",
    advertiserEmail: "rajeshwar.patil@apexforge.co.in",
    advertiserPhone: "+91 98220 11456",
    advertiserRole: "vendor",
    title: "Q3 Bulk Forging & CNC Machining Expo Sale",
    headline: "Save 20% on Heavy Drop Forgings & Precision CNC Turning",
    description: "Direct OEM Tier-1 Certified Supplier with 150 MT/month capacity. Instant Milestone Escrow Quotes with delivery within 7 days.",
    badgeText: "⚡ FLASH DEALS • 20% OFF MOQ",
    ctaText: "Request Fast Quote",
    ctaUrl: "/vendors?category=Industrial+Machinery+%26+CNC",
    bannerImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
    placement: "popup_modal",
    timeSlot: "prime_b2b",
    targetCategory: "Industrial Machinery & CNC",
    targetLocation: "Pune Auto Cluster, Maharashtra",
    durationDays: 7,
    startDate: "2026-09-01T00:00:00Z",
    endDate: "2026-09-30T23:59:59Z",
    pricing: {
      baseRatePerDay: 1499,
      durationDays: 7,
      grossAmount: 10493,
      durationDiscountPct: 15,
      durationDiscountAmount: 1574,
      timeSlotMultiplier: 1.25,
      timeSlotSurcharge: 2230,
      categoryTargetingFee: 1050,
      locationTargetingFee: 1400,
      subtotal: 13599,
      gstRatePct: 18,
      gstAmount: 2448,
      totalPayable: 16047
    },
    status: "active",
    paymentStatus: "paid",
    stats: {
      impressions: 48200,
      clicks: 2795,
      ctr: 5.8,
      budgetSpent: 16047
    },
    verifiedBadge: true,
    createdAt: "2026-09-01T08:30:00Z"
  },
  {
    id: "ad-top-strip-1",
    advertiserId: "user-vendor-2",
    advertiserName: "Surat TexFab Mills",
    advertiserEmail: "haresh@surattexfab.com",
    advertiserPhone: "+91 98980 44221",
    advertiserRole: "vendor",
    title: "GST Zero-Loss Wholesale Textile Procurement",
    headline: "Surat Textile Belt Mega Sourcing: 25,000 Meters/Day Direct Weaving",
    description: "Certified Flame Retardant & Industrial Uniform Fabrics. 50/50 Escrow protected.",
    badgeText: "🔥 TEXTILE HUB SPECIAL",
    ctaText: "View Mill Catalog",
    ctaUrl: "/vendors?category=Textiles+%26+Garments",
    bannerImage: "https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=1000&q=80",
    placement: "top_banner",
    timeSlot: "all_day",
    targetCategory: "Textiles & Garments",
    targetLocation: "Surat Textile Belt, Gujarat",
    durationDays: 15,
    startDate: "2026-09-05T00:00:00Z",
    endDate: "2026-09-20T23:59:59Z",
    pricing: {
      baseRatePerDay: 899,
      durationDays: 15,
      grossAmount: 13485,
      durationDiscountPct: 25,
      durationDiscountAmount: 3371,
      timeSlotMultiplier: 1.0,
      timeSlotSurcharge: 0,
      categoryTargetingFee: 2250,
      locationTargetingFee: 3000,
      subtotal: 15364,
      gstRatePct: 18,
      gstAmount: 2766,
      totalPayable: 18130
    },
    status: "active",
    paymentStatus: "paid",
    stats: {
      impressions: 94300,
      clicks: 3206,
      ctr: 3.4,
      budgetSpent: 18130
    },
    verifiedBadge: true,
    createdAt: "2026-09-05T09:00:00Z"
  },
  {
    id: "ad-hero-spotlight-1",
    advertiserId: "user-vendor-3",
    advertiserName: "Bharat TMT & Structural Steels",
    advertiserEmail: "amandeep@bharattmt.co.in",
    advertiserPhone: "+91 98140 33990",
    advertiserRole: "vendor",
    title: "Fe 550D TMT Rebars & MS Angle Billets",
    headline: "Ludhiana Heavy Steel Rolling: Instant Dispatch of 500+ Metric Tons",
    description: "Direct Mill Pricing with BIS & ISO 9001 Certifications. Verified CRISIL AAA credit solvency.",
    badgeText: "👑 FEATURED MILL SPOTLIGHT",
    ctaText: "Check Live Ton Rates",
    ctaUrl: "/vendors?category=Raw+Steel+%26+Metals",
    bannerImage: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=1000&q=80",
    placement: "hero_spotlight",
    timeSlot: "prime_b2b",
    targetCategory: "Raw Steel & Metals",
    targetLocation: "Ludhiana Industrial Hub, Punjab",
    durationDays: 30,
    startDate: "2026-09-01T00:00:00Z",
    endDate: "2026-09-30T23:59:59Z",
    pricing: {
      baseRatePerDay: 1999,
      durationDays: 30,
      grossAmount: 59970,
      durationDiscountPct: 40,
      durationDiscountAmount: 23988,
      timeSlotMultiplier: 1.25,
      timeSlotSurcharge: 8996,
      categoryTargetingFee: 4500,
      locationTargetingFee: 6000,
      subtotal: 55478,
      gstRatePct: 18,
      gstAmount: 9986,
      totalPayable: 65464
    },
    status: "active",
    paymentStatus: "paid",
    stats: {
      impressions: 142000,
      clicks: 8804,
      ctr: 6.2,
      budgetSpent: 65464
    },
    verifiedBadge: true,
    createdAt: "2026-09-01T10:00:00Z"
  },
  {
    id: "ad-floating-corner-1",
    advertiserId: "user-vendor-4",
    advertiserName: "Gujarat PolyChem Synth",
    advertiserEmail: "sanjay.shah@polychem.co.in",
    advertiserPhone: "+91 98250 88901",
    advertiserRole: "vendor",
    title: "Bulk Polymers & Industrial Resins",
    headline: "Virgin HDPE, PP Granules & Epoxy Resins Delivered Ex-Stock",
    description: "Vapi Chemical Hub stock ready for dispatch with certified lab test COA.",
    badgeText: "✨ VAPI STOCK DISPATCH",
    ctaText: "Order Lab Samples",
    ctaUrl: "/vendors?category=Chemicals+%26+Polymers",
    bannerImage: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=1000&q=80",
    placement: "floating_corner",
    timeSlot: "evening_procurement",
    targetCategory: "Chemicals & Polymers",
    targetLocation: "Vapi Chemical Complex, Gujarat",
    durationDays: 15,
    startDate: "2026-09-08T00:00:00Z",
    endDate: "2026-09-23T23:59:59Z",
    pricing: {
      baseRatePerDay: 499,
      durationDays: 15,
      grossAmount: 7485,
      durationDiscountPct: 25,
      durationDiscountAmount: 1871,
      timeSlotMultiplier: 1.10,
      timeSlotSurcharge: 561,
      categoryTargetingFee: 2250,
      locationTargetingFee: 3000,
      subtotal: 11425,
      gstRatePct: 18,
      gstAmount: 2057,
      totalPayable: 13482
    },
    status: "active",
    paymentStatus: "paid",
    stats: {
      impressions: 51200,
      clicks: 1996,
      ctr: 3.9,
      budgetSpent: 13482
    },
    verifiedBadge: true,
    createdAt: "2026-09-08T11:00:00Z"
  }
];

// LocalStorage Helper for Synchronized Real-Time Ad Operations
const AD_STORAGE_KEY = "bussinest_ad_campaigns_v1";

export function getStoredAdCampaigns(): AdCampaign[] {
  if (typeof window === "undefined") return INITIAL_AD_CAMPAIGNS;
  try {
    const raw = localStorage.getItem(AD_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse ad campaigns from storage", e);
  }
  localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(INITIAL_AD_CAMPAIGNS));
  return INITIAL_AD_CAMPAIGNS;
}

export function saveStoredAdCampaigns(campaigns: AdCampaign[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(AD_STORAGE_KEY, JSON.stringify(campaigns));
    window.dispatchEvent(new CustomEvent("bussinest_ads_updated"));
  } catch (e) {
    console.error("Failed to save ad campaigns", e);
  }
}

export function addAdCampaign(campaign: AdCampaign): AdCampaign {
  const all = getStoredAdCampaigns();
  const updated = [campaign, ...all];
  saveStoredAdCampaigns(updated);
  return campaign;
}

export function updateAdCampaignStatus(id: string, status: AdCampaign['status']): boolean {
  const all = getStoredAdCampaigns();
  const index = all.findIndex(c => c.id === id);
  if (index === -1) return false;
  all[index].status = status;
  saveStoredAdCampaigns(all);
  return true;
}

export function recordAdTelemetry(id: string, type: "impression" | "click"): void {
  const all = getStoredAdCampaigns();
  const campaign = all.find(c => c.id === id);
  if (!campaign) return;

  if (type === "impression") {
    campaign.stats.impressions += 1;
  } else if (type === "click") {
    campaign.stats.clicks += 1;
  }
  campaign.stats.ctr = Number(((campaign.stats.clicks / Math.max(1, campaign.stats.impressions)) * 100).toFixed(2));
  saveStoredAdCampaigns(all);
}
