import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /api/notifications/:userId
router.get("/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    
    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    res.json({ items: notifications });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
});

// POST /api/notifications/:id/read
router.post("/:id/read", async (req, res) => {
  try {
    const { id } = req.params;
    
    await prisma.notification.update({
      where: { id },
      data: { isRead: true }
    });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to mark as read" });
  }
});

import { notificationService } from "../services/NotificationService";

// POST /api/notifications/mock-trigger (Helper for manual testing)
router.post("/mock-trigger", async (req, res) => {
  try {
    const { userId } = req.body;
    await notificationService.dispatch("lead_new", userId, {
      buyerName: "Test Buyer",
      matchScore: 92,
      leadId: "lead_123"
    });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to trigger mock notification" });
  }
});

export default router;
