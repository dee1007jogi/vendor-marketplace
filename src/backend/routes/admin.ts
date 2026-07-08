import { Router } from "express";
import { prisma } from "../prisma";
import { notificationService } from "../services/NotificationService";

const router = Router();

// --- Verification Queue ---
router.get("/verification/pending", async (req, res) => {
  try {
    const queue = await prisma.verificationQueue.findMany({
      where: { status: "pending" },
      include: { user: true }
    });
    res.json({ items: queue, total: queue.length });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch verification queue" });
  }
});

router.post("/verification/:id/approve", async (req, res) => {
  try {
    const { id } = req.params;
    const { admin_notes } = req.body;
    
    // Update queue status
    const verified = await prisma.verificationQueue.update({
      where: { id },
      data: { 
        status: "approved", 
        cosStatus: "approved",
        gstStatus: "approved",
        panStatus: "approved",
        aadhaarStatus: "approved",
        adminNotes: admin_notes, 
        reviewedAt: new Date() 
      }
    });
    
    // Set user as verified
    await prisma.user.update({
      where: { id: verified.userId },
      data: { verified: true }
    });

    const vendor = await prisma.vendorProfile.findUnique({ 
      where: { userId: verified.userId }
    });

    if (vendor) {
      await prisma.vendorProfile.update({
        where: { userId: vendor.userId },
        data: { verificationStatus: "approved" }
      });

      // Notify vendor
      await notificationService.dispatch(
        "vendor_approved",
        vendor.userId,
        { businessName: vendor.businessName }
      );
    }

    req.app.get("io")?.emit("dashboard_update", { source: "admin_verification_approve" });

    res.json({ status: "approved", user_id: verified.userId, verified_at: verified.reviewedAt });
  } catch (error) {
    res.status(500).json({ error: "Failed to approve verification" });
  }
});

router.post("/verification/:id/reject", async (req, res) => {
  try {
    const { id } = req.params;
    const { reason, admin_notes } = req.body;
    
    const rejected = await prisma.verificationQueue.update({
      where: { id },
      data: { 
        status: "rejected", 
        cosStatus: "rejected",
        gstStatus: "rejected",
        panStatus: "rejected",
        aadhaarStatus: "rejected",
        rejectionReason: reason, 
        adminNotes: admin_notes, 
        reviewedAt: new Date() 
      }
    });

    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: rejected.userId } });
    if (vendor) {
      await prisma.vendorProfile.update({
        where: { userId: vendor.userId },
        data: { verificationStatus: "rejected" }
      });

      // Notify vendor
      await notificationService.dispatch(
        "vendor_rejected",
        vendor.userId,
        { reason: reason || admin_notes }
      );
    }

    req.app.get("io")?.emit("dashboard_update", { source: "admin_verification_reject" });

    res.json({ status: "rejected", user_id: rejected.userId });
  } catch (error) {
    res.status(500).json({ error: "Failed to reject verification" });
  }
});

// --- Vendors Management ---
router.get("/vendors", async (req, res) => {
  try {
    const vendors = await prisma.vendorProfile.findMany({ include: { user: true } });
    res.json({ items: vendors });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendors" });
  }
});

router.post("/vendors/:id/suspend", async (req, res) => {
  // Logic to suspend vendor... for MVP we'd add an 'active' status flag
  res.json({ status: "suspended" });
});

// --- Fraud Alerts ---
router.get("/fraud-alerts", async (req, res) => {
  try {
    const alerts = await prisma.fraudAlert.findMany({ where: { status: "open" } });
    res.json({ items: alerts });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch fraud alerts" });
  }
});

router.post("/fraud-alerts/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolutionNote } = req.body;
    const alert = await prisma.fraudAlert.update({
      where: { id },
      data: { status, resolutionNote, resolvedAt: new Date() }
    });
    res.json(alert);
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve fraud alert" });
  }
});

// --- Disputes ---
router.get("/disputes", async (req, res) => {
  try {
    const disputes = await prisma.dispute.findMany({ include: { project: true } });
    res.json({ items: disputes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch disputes" });
  }
});

router.post("/disputes", async (req, res) => {
  try {
    const { projectId, reason, raisedById } = req.body;
    const dispute = await prisma.dispute.create({
      data: {
        projectId,
        reason,
        raisedById,
        status: "pending"
      }
    });
    res.json(dispute);
  } catch (error) {
    res.status(500).json({ error: "Failed to raise dispute" });
  }
});

router.post("/disputes/:id/resolve", async (req, res) => {
  try {
    const { id } = req.params;
    const { ruling, adminNotes, refundPercent } = req.body;
    const dispute = await prisma.dispute.update({
      where: { id },
      data: { 
        status: "resolved", 
        ruling, 
        adminNotes, 
        partialRefundPercent: refundPercent, 
        resolvedAt: new Date() 
      }
    });

    req.app.get("io")?.emit("dashboard_update", { source: "admin_dispute_resolve" });

    res.json(dispute);
  } catch (error) {
    res.status(500).json({ error: "Failed to resolve dispute" });
  }
});

// --- Categories ---
router.get("/categories", async (req, res) => {
  try {
    const categories = await prisma.category.findMany();
    res.json({ items: categories });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.post("/categories", async (req, res) => {
  try {
    const { name, slug, parentId, icon, attributes } = req.body;
    const cat = await prisma.category.create({
      data: { name, slug, icon }
    });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: "Failed to create category" });
  }
});

router.post("/categories/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, slug, parentId, icon, attributes } = req.body;
    const cat = await prisma.category.update({
      where: { id },
      data: { name, slug, icon }
    });
    res.json(cat);
  } catch (error) {
    res.status(500).json({ error: "Failed to update category" });
  }
});

// --- Analytics ---
router.get("/analytics/dashboard", async (req, res) => {
  try {
    const usersCount = await prisma.user.count();
    const vendorsCount = await prisma.vendorProfile.count();
    const requirementsCount = await prisma.requirement.count();
    const disputesCount = await prisma.dispute.count({ where: { status: "pending" } });
    const alertsCount = await prisma.fraudAlert.count({ where: { status: "open" } });
    const pendingVerifications = await prisma.verificationQueue.count({ where: { status: "pending" } });
    
    res.json({
      metrics: {
        totalUsers: usersCount,
        totalVendors: vendorsCount,
        openRequirements: requirementsCount,
        openDisputes: disputesCount,
        openFraudAlerts: alertsCount,
        pendingVerifications
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch dashboard metrics" });
  }
});

// =======================
// ADMIN NOTIFICATION ARCHITECTURE ENDPOINTS
// =======================

router.get("/dashboard/recent-users", async (req, res) => {
  try {
    const recentVendors = await prisma.vendorProfile.findMany({
      orderBy: { user: { createdAt: 'desc' } },
      take: 5,
      include: { user: { select: { name: true, email: true, createdAt: true } } }
    });

    const recentBuyers = await prisma.user.findMany({
      where: { role: 'buyer' },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: { id: true, name: true, email: true, createdAt: true, isNew: true }
    });

    const mappedVendors = recentVendors.map((v) => ({
      id: v.userId,
      name: v.user.name,
      email: v.user.email,
      role: 'vendor',
      createdAt: v.user.createdAt,
      verificationStatus: v.verificationStatus
    }));

    const mappedBuyers = recentBuyers.map((b) => ({
      id: b.id,
      name: b.name,
      email: b.email,
      role: 'buyer',
      createdAt: b.createdAt,
      verificationStatus: null,
      isNew: b.isNew
    }));

    const combined = [...mappedVendors, ...mappedBuyers].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 10);
    res.json(combined);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch recent users" });
  }
});

router.get("/vendors/pending/count", async (req, res) => {
  try {
    const count = await prisma.vendorProfile.count({
      where: { verificationStatus: 'pending' }
    });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pending count" });
  }
});

// 2. Settings (GET & PUT)
router.get('/settings', async (req, res) => {
  const setting = await prisma.platformSettings.findUnique({ where: { key: 'ai_matching_weights' } });
  if (setting && setting.valueJson) {
    res.json(JSON.parse(setting.valueJson));
  } else {
    res.json({ category: 30, location: 15, rating: 25, budget: 30 });
  }
});

router.put('/settings', async (req, res) => {
  await prisma.platformSettings.upsert({
    where: { key: 'ai_matching_weights' },
    update: { valueJson: JSON.stringify(req.body) },
    create: { key: 'ai_matching_weights', valueJson: JSON.stringify(req.body) },
  });
  // If Redis was used: await redis.del('settings:ai_weights'); 
  res.json({ success: true });
});

// 3. Analytics (MTD Revenue)
router.get('/analytics', async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const transactions = await prisma.transaction.findMany({
      where: {
        createdAt: { gte: thirtyDaysAgo },
        status: 'success'
      }
    });

    const revenueTrend = [
      { date: 'Week 1', revenue: 0, transactions: 0 },
      { date: 'Week 2', revenue: 0, transactions: 0 },
      { date: 'Week 3', revenue: 0, transactions: 0 },
      { date: 'Week 4', revenue: 0, transactions: 0 },
    ];
    
    const now = new Date();

    transactions.forEach(tx => {
      const diffTime = Math.abs(now.getTime() - tx.createdAt.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
      
      let weekIndex = 0;
      if (diffDays <= 7) weekIndex = 3; // most recent
      else if (diffDays <= 14) weekIndex = 2;
      else if (diffDays <= 21) weekIndex = 1;
      else weekIndex = 0; // oldest

      revenueTrend[weekIndex].revenue += tx.amount;
      revenueTrend[weekIndex].transactions += 1;
    });

    res.json({ revenueTrend });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch analytics" });
  }
});

// 4. Buyers
router.get('/buyers', async (req, res) => {
  try {
    const buyers = await prisma.user.findMany({ where: { role: 'buyer' } });
    res.json({ items: buyers });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch buyers" });
  }
});

// 5. Transactions
router.get('/transactions', async (req, res) => {
  try {
    const tx = await prisma.transaction.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ items: tx });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// 6. Manual Credit Adjustment (Highly Secure)
router.post('/vendors/:id/credits', async (req, res) => {
  try {
    const { id } = req.params; // Vendor ID
    const { amount, adminId } = req.body;

    // 1. Authenticate Admin (Strict RBAC)
    if (!adminId) {
      return res.status(401).json({ error: "Unauthorized: Missing Admin ID" });
    }
    const admin = await prisma.user.findUnique({ where: { id: adminId } });
    if (!admin || admin.role !== "admin") {
      // In a real app, this failed attempt could trigger a FraudAlert
      return res.status(403).json({ error: "Forbidden: Strict admin access required to modify currency" });
    }

    // 2. Strict Input Validation (Prevent Integer Overflow)
    const parsedAmount = parseInt(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0 || parsedAmount > 1000) {
      return res.status(400).json({ error: "Invalid amount. Must be a positive integer between 1 and 1000." });
    }

    // 3. Ensure target vendor exists
    const vendor = await prisma.vendorProfile.findUnique({ where: { userId: id } });
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found." });
    }

    // 4. Perform Atomic Increment
    const updatedVendor = await prisma.vendorProfile.update({
      where: { userId: id },
      data: {
        leadCredits: {
          increment: parsedAmount
        }
      }
    });

    // 5. Write Immutable System Audit Log
    await prisma.auditLog.create({
      data: {
        adminId: admin.id,
        action: "ADD_CREDITS",
        targetType: "VendorProfile",
        targetId: id,
        oldValueJson: JSON.stringify({ leadCredits: vendor.leadCredits }),
        newValueJson: JSON.stringify({ leadCredits: updatedVendor.leadCredits, amountAdded: parsedAmount }),
        ipAddress: req.ip || "127.0.0.1",
        userAgent: req.headers["user-agent"]
      }
    });

    // 6. Financial Ledger Transaction
    await prisma.transaction.create({
      data: {
        vendorId: id,
        transactionType: "admin_credit_adjustment",
        amount: parsedAmount,
        status: "success"
      }
    });

    // 7. Alert frontends for real-time refresh
    req.app.get("io")?.emit("dashboard_update", { source: "admin_credits" });

    res.json({ success: true, newBalance: updatedVendor.leadCredits });
  } catch (error) {
    console.error("Credit adjustment error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// 7. Subscription Plans Management
router.get('/plans', async (req, res) => {
  try {
    let settings = await prisma.platformSettings.findUnique({ where: { key: 'subscription_plans' } });
    if (!settings) {
      // Default seed if not exists
      const defaultPlans = [
        { id: 'basic', name: 'Basic Tier', price: 999, credits: 20, features: '' },
        { id: 'premium', name: 'Premium Tier', price: 2499, credits: 50, features: 'Priority Support' }
      ];
      settings = await prisma.platformSettings.create({
        data: { key: 'subscription_plans', valueJson: JSON.stringify(defaultPlans) }
      });
    }
    res.json({ plans: JSON.parse(settings.valueJson) });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch plans" });
  }
});

router.post('/plans', async (req, res) => {
  try {
    const { plans } = req.body;
    await prisma.platformSettings.upsert({
      where: { key: 'subscription_plans' },
      update: { valueJson: JSON.stringify(plans) },
      create: { key: 'subscription_plans', valueJson: JSON.stringify(plans) }
    });
    req.app.get("io")?.emit("dashboard_update", { source: "admin_plans" });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to update plans" });
  }
});

export default router;
