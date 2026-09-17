import { Router } from "express";
import { AD_PLACEMENTS, AD_TIME_SLOTS, calculateAdPrice, INITIAL_AD_CAMPAIGNS } from "../../lib/adEngine";
import { AdCampaign, AdPlacementType, AdTimeSlot } from "../../types";

const router = Router();

// In-memory campaign cache initialized with seeds
let inMemoryCampaigns: AdCampaign[] = [...INITIAL_AD_CAMPAIGNS];

// 1. Get Available Placements & Time Slots
router.get("/placements", (req, res) => {
  res.json({
    placements: Object.values(AD_PLACEMENTS),
    timeSlots: Object.values(AD_TIME_SLOTS),
    pricingPolicy: {
      currency: "INR",
      currencySymbol: "₹",
      gstRate: "18%",
      discountSchedule: [
        { minDays: 30, discountPct: 40, label: "30+ Days (40% OFF - Enterprise)" },
        { minDays: 15, discountPct: 25, label: "15 Days (25% OFF - Bi-Weekly)" },
        { minDays: 7,  discountPct: 15, label: "7 Days (15% OFF - Weekly)" },
        { minDays: 3,  discountPct: 5,  label: "3 Days (5% OFF - Flash Promo)" },
      ],
      surcharges: {
        categoryTargetingPerDay: 150,
        locationTargetingPerDay: 200
      }
    }
  });
});

// 2. Dynamic Price Calculator Endpoint
router.post("/calculate-price", (req, res) => {
  try {
    const { placement, durationDays, timeSlot, targetCategory, targetLocation } = req.body;
    
    if (!placement || !durationDays) {
      return res.status(400).json({ error: "Missing placement or durationDays" });
    }

    const calculation = calculateAdPrice({
      placement: placement as AdPlacementType,
      durationDays: Number(durationDays),
      timeSlot: (timeSlot || "all_day") as AdTimeSlot,
      targetCategory,
      targetLocation
    });

    res.json(calculation);
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to calculate ad pricing" });
  }
});

// 3. Get Active Ads by Placement & Context
router.get("/active", (req, res) => {
  try {
    const { placement, category, location } = req.query;

    let active = inMemoryCampaigns.filter(c => c.status === "active");

    if (placement && typeof placement === "string") {
      active = active.filter(c => c.placement === placement);
    }

    if (category && typeof category === "string" && category !== "all") {
      active = active.filter(c => c.targetCategory === "all" || c.targetCategory.toLowerCase().includes(category.toLowerCase()));
    }

    if (location && typeof location === "string" && location !== "all") {
      active = active.filter(c => c.targetLocation === "all" || c.targetLocation.toLowerCase().includes(location.toLowerCase()));
    }

    res.json({
      items: active,
      total: active.length
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch active ads" });
  }
});

// 4. Create New Ad Campaign
router.post("/campaigns", (req, res) => {
  try {
    const {
      advertiserId,
      advertiserName,
      advertiserEmail,
      advertiserPhone,
      advertiserRole,
      title,
      headline,
      description,
      badgeText,
      ctaText,
      ctaUrl,
      bannerImage,
      placement,
      timeSlot,
      targetCategory,
      targetLocation,
      targetAudience,
      durationDays,
      startDate
    } = req.body;

    if (!headline || !placement || !durationDays) {
      return res.status(400).json({ error: "Missing mandatory ad parameters" });
    }

    const duration = Number(durationDays) || 7;
    const start = startDate ? new Date(startDate) : new Date();
    const end = new Date(start.getTime() + duration * 24 * 60 * 60 * 1000);

    const pricing = calculateAdPrice({
      placement: placement as AdPlacementType,
      durationDays: duration,
      timeSlot: (timeSlot || "all_day") as AdTimeSlot,
      targetCategory: targetCategory || "all",
      targetLocation: targetLocation || "all"
    });

    const newCampaign: AdCampaign = {
      id: `ad-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      advertiserId: advertiserId || "user-vendor-1",
      advertiserName: advertiserName || "Verified Enterprise Supplier",
      advertiserEmail: advertiserEmail || "procurement@bussinest.com",
      advertiserPhone: advertiserPhone || "+91 98000 00000",
      advertiserRole: advertiserRole || "vendor",
      title: title || `${headline.slice(0, 30)}... Campaign`,
      headline,
      description: description || "Certified OEM supplier with fast turnaround and 50/50 escrow protection.",
      badgeText: badgeText || "⚡ VERIFIED SPONSOR",
      ctaText: ctaText || "Get Quote",
      ctaUrl: ctaUrl || "/vendors",
      bannerImage: bannerImage || "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80",
      placement: placement as AdPlacementType,
      timeSlot: (timeSlot || "all_day") as AdTimeSlot,
      targetCategory: targetCategory || "all",
      targetLocation: targetLocation || "all",
      targetAudience: targetAudience || "all_visitors",
      durationDays: duration,
      startDate: start.toISOString(),
      endDate: end.toISOString(),
      pricing,
      status: "active", // Auto-activated for interactive demonstration
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

    inMemoryCampaigns.unshift(newCampaign);

    // Notify connected admin sockets
    req.app.get("io")?.emit("ad_campaign_created", newCampaign);

    res.status(201).json({
      success: true,
      campaign: newCampaign
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to create ad campaign" });
  }
});

// 5. Get All Campaigns (Admin & Advertiser View)
router.get("/campaigns", (req, res) => {
  try {
    const { advertiserId, status, placement } = req.query;

    let list = [...inMemoryCampaigns];

    if (advertiserId && typeof advertiserId === "string") {
      list = list.filter(c => c.advertiserId === advertiserId);
    }
    if (status && typeof status === "string" && status !== "all") {
      list = list.filter(c => c.status === status);
    }
    if (placement && typeof placement === "string" && placement !== "all") {
      list = list.filter(c => c.placement === placement);
    }

    res.json({
      items: list,
      total: list.length,
      revenueSummary: {
        totalRevenue: list.reduce((acc, c) => acc + (c.pricing?.totalPayable || 0), 0),
        activeCampaigns: list.filter(c => c.status === "active").length,
        totalImpressions: list.reduce((acc, c) => acc + (c.stats?.impressions || 0), 0),
        totalClicks: list.reduce((acc, c) => acc + (c.stats?.clicks || 0), 0),
        averageCtr: Number((list.reduce((acc, c) => acc + (c.stats?.ctr || 0), 0) / Math.max(1, list.length)).toFixed(2))
      }
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
});

// 6. Update Campaign Status (Active / Paused / Approved / Rejected)
router.patch("/campaigns/:id/status", (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const campaign = inMemoryCampaigns.find(c => c.id === id);
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    campaign.status = status;
    req.app.get("io")?.emit("ad_status_updated", { id, status });

    res.json({ success: true, campaign });
  } catch (err) {
    res.status(500).json({ error: "Failed to update campaign status" });
  }
});

// 7. Telemetry Tracking (Impressions & Clicks)
router.post("/campaigns/:id/track-impression", (req, res) => {
  const { id } = req.params;
  const campaign = inMemoryCampaigns.find(c => c.id === id);
  if (campaign) {
    campaign.stats.impressions += 1;
    campaign.stats.ctr = Number(((campaign.stats.clicks / Math.max(1, campaign.stats.impressions)) * 100).toFixed(2));
  }
  res.json({ success: true });
});

router.post("/campaigns/:id/track-click", (req, res) => {
  const { id } = req.params;
  const campaign = inMemoryCampaigns.find(c => c.id === id);
  if (campaign) {
    campaign.stats.clicks += 1;
    campaign.stats.ctr = Number(((campaign.stats.clicks / Math.max(1, campaign.stats.impressions)) * 100).toFixed(2));
  }
  res.json({ success: true });
});

export default router;
