import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /api/dashboards/buyer/stats
router.get("/buyer/stats", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const activeProjects = await prisma.requirement.count({
      where: { buyerId: String(userId), status: "open" }
    });

    const pendingQuotes = await prisma.proposal.count({
      where: { requirement: { buyerId: String(userId) }, status: "pending" }
    });

    // 1. SAVED VENDORS
    const savedVendors = await prisma.savedVendor.count({
      where: { buyerId: String(userId) },
    });

    // 2. PROFILE VIEWS
    const profileViews = await prisma.profileView.count({
      where: { targetId: String(userId) },
    });

    // 3. TOTAL SPENT
    const totalSpentAgg = await prisma.proposal.aggregate({
      where: { requirement: { buyerId: String(userId) }, status: "accepted" },
      _sum: { bidAmount: true },
    });

    res.json({
      activeProjects,
      pendingQuotes,
      savedVendors,
      profileViews,
      totalSpent: totalSpentAgg._sum.bidAmount || 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch buyer stats" });
  }
});

// GET /api/dashboards/vendor/stats
router.get("/vendor/stats", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const leadsReceived = await prisma.lead.count({
      where: { vendorId: String(userId), status: "new" }
    });

    const quotesSent = await prisma.proposal.count({
      where: { vendorId: String(userId) }
    });

    const quotesAccepted = await prisma.proposal.count({
      where: { vendorId: String(userId), status: "accepted" }
    });

    const conversionRate = quotesSent > 0 ? Math.round((quotesAccepted / quotesSent) * 100) : 0;
    
    const profileViews = await prisma.profileView.count({
      where: { targetId: String(userId) },
    });

    const savedByBuyers = await prisma.savedVendor.count({
      where: { vendorProfile: { userId: String(userId) } },
    });

    const totalEarnedAgg = await prisma.proposal.aggregate({
      where: { vendorId: String(userId), status: "accepted" },
      _sum: { bidAmount: true },
    });

    res.json({
      profileViews,
      leadsReceived,
      quotesSent,
      conversionRate,
      savedByBuyers,
      totalEarned: totalEarnedAgg._sum.bidAmount || 0
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor stats" });
  }
});

export default router;
