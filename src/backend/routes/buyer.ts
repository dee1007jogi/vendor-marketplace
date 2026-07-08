import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /api/buyer/requirements
router.get("/requirements", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const requirements = await prisma.requirement.findMany({
      where: { buyerId: String(userId) },
      include: {
        _count: { select: { proposals: true } }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(requirements);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch requirements" });
  }
});

// GET /api/buyer/requirements/:id/quotes
router.get("/requirements/:id/quotes", async (req, res) => {
  try {
    const { id } = req.params;
    
    const requirement = await prisma.requirement.findUnique({
      where: { id }
    });

    if (!requirement) return res.status(404).json({ error: "Requirement not found" });

    const quotes = await prisma.proposal.findMany({
      where: { requirementId: id },
      include: {
        vendorProfile: {
          include: { user: { select: { verified: true } } }
        }
      }
    });

    const sortedQuotes = quotes.sort((a, b) => {
      return a.bidAmount - b.bidAmount;
    });

    res.json({ requirement, quotes: sortedQuotes });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch quotes" });
  }
});

// POST /api/buyer/requirements/:id/accept-quote
router.post("/requirements/:id/accept-quote", async (req, res) => {
  try {
    const { id } = req.params;
    const { quoteId } = req.body;

    // 1. Find Quote
    const quote = await prisma.proposal.findUnique({ where: { id: quoteId } });
    if (!quote) return res.status(404).json({ error: "Quote not found" });

    // 2. Update Requirement to Awarded
    await prisma.requirement.update({
      where: { id },
      data: { status: "awarded", awardedVendorId: quote.vendorId }
    });

    // 3. Update Quotes Status
    await prisma.proposal.updateMany({
      where: { requirementId: id, id: { not: quoteId } },
      data: { status: "rejected" }
    });

    await prisma.proposal.update({
      where: { id: quoteId },
      data: { status: "accepted" }
    });

    // 4. Milestones can now be generated dynamically via the /generate-milestones endpoint.
    // (Mocking logic removed in favor of dynamic generation based on budget)

    res.json({ success: true, message: "Quote accepted and project awarded." });
  } catch (error) {
    res.status(500).json({ error: "Failed to accept quote" });
  }
});

// GET /api/buyer/projects
router.get("/projects", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "userId required" });

    const projects = await prisma.requirement.findMany({
      where: { buyerId: String(userId), status: "awarded" },
      include: {
        proposals: { where: { status: "accepted" } },
        ProjectMilestone: true
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// POST /api/buyer/tracking/view
router.post("/tracking/view", async (req, res) => {
  try {
    const { buyerId, vendorId, requirementId } = req.body;
    
    // MVP: Storing view tracking events into AuditLog for Contextual Bandit
    // (In production, this streams to BigQuery or a Feature Store)
    // We reuse adminId as the actor ID here since AuditLog enforces it.
    await prisma.auditLog.create({
      data: {
        adminId: buyerId,
        action: "profile_view",
        targetType: "vendor",
        targetId: vendorId,
        newValueJson: JSON.stringify({ requirementId, timestamp: new Date() }),
        ipAddress: req.ip || "127.0.0.1"
      }
    });

    res.json({ success: true, tracking: "logged" });
  } catch (error) {
    console.error("Tracking Error:", error);
    res.status(500).json({ error: "Failed to track view" });
  }
});

// POST /api/buyer/projects/:projectId/generate-milestones
router.post("/projects/:projectId/generate-milestones", async (req, res) => {
  const { projectId } = req.params;
  
  try {
    const project = await prisma.requirement.findUnique({
      where: { id: projectId },
      // include: { awardedVendor: true }
    });

    if (!project) return res.status(404).json({ error: 'Project not found' });

    // Check if milestones already exist to prevent duplication
    const existing = await prisma.projectMilestone.count({ where: { projectId } });
    if (existing > 0) {
      return res.status(400).json({ error: 'Milestones already generated for this project' });
    }

    // Assuming we use budgetMax or we can use the bidAmount if we joined proposal, but requirement has budgetMax.
    const budget = project.budgetMax;
    const now = new Date();
    let milestonesData = [];

    if (budget > 10000) {
      // 4 Milestones: 25% each
      const amountPerMilestone = budget / 4;
      milestonesData = [
        { title: 'Phase 1: Kickoff & Design', description: 'Initial designs, wireframes, and project blueprint.', dueDate: new Date(now.setDate(now.getDate() + 7)), amount: amountPerMilestone },
        { title: 'Phase 2: Development (Alpha)', description: 'Core functionality implementation, internal alpha release.', dueDate: new Date(now.setDate(now.getDate() + 21)), amount: amountPerMilestone },
        { title: 'Phase 3: Beta & Testing', description: 'Feature complete, user acceptance testing (UAT) and bug fixes.', dueDate: new Date(now.setDate(now.getDate() + 35)), amount: amountPerMilestone },
        { title: 'Phase 4: Launch & Handover', description: 'Final deployment, source code handover, and training.', dueDate: new Date(now.setDate(now.getDate() + 49)), amount: amountPerMilestone },
      ];
    } else {
      // 2 Milestones: 50% each
      const amountPerMilestone = budget / 2;
      milestonesData = [
        { title: 'Initial Deposit', description: 'Project kickoff and resource allocation.', dueDate: new Date(now.setDate(now.getDate() + 3)), amount: amountPerMilestone },
        { title: 'Final Delivery', description: 'Project completion and final sign-off.', dueDate: new Date(now.setDate(now.getDate() + 14)), amount: amountPerMilestone },
      ];
    }

    // Save to database
    const createdMilestones = await prisma.$transaction(
      milestonesData.map((m) =>
        prisma.projectMilestone.create({
          data: {
            projectId,
            title: m.title,
            description: m.description,
            amount: m.amount,
            dueDate: m.dueDate,
            status: 'pending',
          },
        })
      )
    );

    res.json({ 
      message: `Generated ${createdMilestones.length} milestones.`, 
      milestones: createdMilestones 
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate milestones' });
  }
});

export default router;
