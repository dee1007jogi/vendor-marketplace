import { Router } from "express";
import { prisma } from "../prisma";
import { generateProposalBlueprint } from "../services/ai.service";

import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Ensure uploads dir exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ 
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

const router = Router();

// GET all proposals
router.get("/", async (req, res) => {
  const { vendorId, buyerId } = req.query;
  try {
    const where: any = {};
    if (vendorId) where.vendorId = String(vendorId);
    if (buyerId) where.requirement = { buyerId: String(buyerId) };

    const proposals = await prisma.proposal.findMany({
      where,
      include: {
        requirement: true,
        vendorProfile: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json({ items: proposals });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Add attachments to a proposal
router.post("/:proposalId/attachments", upload.array('files', 5), async (req, res) => {
  const { proposalId } = req.params;
  
  try {
    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return res.status(404).json({ error: "Proposal not found" });

    const existingAttachments = JSON.parse(proposal.attachmentsJson || "[]");
    
    const newAttachments = (req.files as Express.Multer.File[] || []).map(file => ({
      name: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      url: `/uploads/${file.filename}`, // In production, this would be an S3/GCS URL
      uploadedAt: new Date().toISOString()
    }));

    const updatedAttachments = [...existingAttachments, ...newAttachments];

    await prisma.proposal.update({
      where: { id: proposalId },
      data: { attachmentsJson: JSON.stringify(updatedAttachments) }
    });

    res.json({ success: true, attachments: updatedAttachments });
  } catch (error: any) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload attachments" });
  }
});

// Smart Proposal Gemini Optimization
router.post("/gemini-optimize", async (req, res) => {
  const { coverLetter, requirementId, vendorBusinessName } = req.body;
  
  try {
    const reqPost = await prisma.requirement.findUnique({ where: { id: requirementId } });
    if (!reqPost) return res.status(404).json({ error: "RFP requirement not found." });

    const vendor = await prisma.vendorProfile.findFirst({ where: { businessName: vendorBusinessName } });
    const vendorDetails = vendor ? `${vendor.category} - ${vendor.location} - ${vendor.servicesJson}` : coverLetter;

    const result = await generateProposalBlueprint(
      reqPost.description,
      `${vendorBusinessName}: ${vendorDetails}`
    );

    if (!result.success) {
      return res.status(500).json({ error: "AI generation failed", fallback: "Could not generate proposal." });
    }

    res.json({ optimizedText: JSON.stringify(result.data, null, 2), aiData: result.data });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Submit Proposal Bid
router.post("/", async (req, res) => {
  const { leadId, requirementId, vendorId, bidAmount, timelineWeeks, coverLetter, aiOptimizedProposalText } = req.body;
  
  try {
    const vendor = await prisma.vendorProfile.findUnique({ 
      where: { userId: vendorId },
      include: { user: true }
    });
    
    const reqPost = await prisma.requirement.findUnique({ where: { id: requirementId } });
    
    if (!vendor || !reqPost) return res.status(404).json({ error: "Vendor or Requirement not found." });

    let ratings = { avg: 4.5 };
    try {
      if (vendor.ratingsJson) {
        const parsed = JSON.parse(vendor.ratingsJson);
        if (parsed && typeof parsed.avg === 'number') ratings.avg = parsed.avg;
      }
    } catch (e) {}

    const newProp = await prisma.$transaction(async (tx) => {
      const prop = await tx.proposal.create({
        data: {
          leadId,
          requirementId,
          vendorId,
          vendorBusinessName: vendor.businessName,
          vendorAvatar: vendor.user.avatar,
          vendorRating: ratings.avg,
          bidAmount: Number(bidAmount),
          timelineWeeks: Number(timelineWeeks),
          coverLetter,
          aiOptimizedProposalText: aiOptimizedProposalText || null,
          status: "pending"
        }
      });

      await tx.lead.update({
        where: { id: leadId },
        data: { status: "proposal_submitted" }
      });

      // Starter message
      const conv = await tx.conversation.create({
        data: {
          buyerId: reqPost.buyerId,
          vendorId,
          requirementId,
        }
      });
      
      await tx.message.create({
        data: {
          conversationId: conv.id,
          senderId: vendorId,
          content: `Hello, we have submitted our official RFP bid for your requirement ($${bidAmount} over ${timelineWeeks} weeks). Feel free to check the customized plan on your dashboard. Looking forward to discussing details!`
        }
      });

      return prop;
    });

    req.app.get("io")?.emit("dashboard_update", { source: "proposals" });

    res.json({ success: true, proposal: newProp });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Shortlist/Accept Proposal
router.post("/:proposalId/action", async (req, res) => {
  const { proposalId } = req.params;
  const { action } = req.body; // "shortlist" | "accept" | "decline"
  
  try {
    const proposal = await prisma.proposal.findUnique({ where: { id: proposalId } });
    if (!proposal) return res.status(404).json({ error: "Proposal bid not found." });

    let status = "declined";
    if (action === "shortlist") status = "shortlisted";
    else if (action === "accept") status = "accepted";

    const updatedProp = await prisma.$transaction(async (tx) => {
      const updated = await tx.proposal.update({
        where: { id: proposalId },
        data: { status }
      });

      if (status === "accepted") {
        await tx.requirement.update({
          where: { id: proposal.requirementId },
          data: { status: "closed" }
        });
      }
      return updated;
    });

    req.app.get("io")?.emit("dashboard_update", { source: "proposals_action" });

    res.json({ success: true, proposal: updatedProp });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Upload Attachments to Proposal
router.post("/:proposalId/attachments", async (req: any, res: any) => {
  const { proposalId } = req.params;
  const files = req.files || req.body.files || []; // Accommodate multer or direct body array

  if (!Array.isArray(files) || files.length === 0) {
    return res.status(400).json({ error: "No files provided." });
  }

  try {
    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      select: { attachmentsJson: true },
    });

    if (!proposal) return res.status(404).json({ error: "Proposal not found." });

    // Parse existing attachments
    let currentAttachments: any[] = [];
    if (proposal.attachmentsJson) {
      try {
        currentAttachments = JSON.parse(proposal.attachmentsJson) || [];
      } catch (e) {}
    }
    
    // Process new files
    const newAttachments = files.map((file: any) => ({
      name: file.originalname || file.name || "attachment",
      url: file.url || `/uploads/proposals/${proposalId}/${file.filename || file.name}`,
      size: file.size || 0,
      mimeType: file.mimetype || file.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
    }));

    // Save back to JSON field
    const updated = await prisma.proposal.update({
      where: { id: proposalId },
      data: {
        attachmentsJson: JSON.stringify([...currentAttachments, ...newAttachments]),
      },
    });

    // Also push to normalized Attachment table
    await prisma.attachment.createMany({
      data: newAttachments.map((f: any) => ({
        targetId: proposalId,
        targetType: "Proposal",
        fileName: f.name,
        fileUrl: f.url,
        fileSize: f.size,
        mimeType: f.mimeType,
        uploadedBy: "system", // This should ideally be req.user.id
      }))
    });

    res.json({ success: true, attachments: JSON.parse(updated.attachmentsJson || "[]") });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload attachments" });
  }
});

export default router;
