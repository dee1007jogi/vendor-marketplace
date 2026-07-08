import { Router } from "express";
import { prisma } from "../prisma";
import { getInitialPlatformState } from "../../db/seededData";
import { hashPassword } from "../services/password.service";

const router = Router();

// Get entire state (Sync, useful for dashboard)
router.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: { verificationQueue: true }
    });
    const vendorProfiles = await prisma.vendorProfile.findMany();
    const requirements = await prisma.requirement.findMany();
    const leads = await prisma.lead.findMany();
    const proposals = await prisma.proposal.findMany();

    const mapUser = (u: any) => ({
      ...u,
      verificationDocs: u.verificationQueue ? {
        businessName: u.verificationQueue.businessName,
        registrationNumber: u.verificationQueue.registrationNumber,
        cosFileName: u.verificationQueue.cosFileName,
        cosFileUrl: u.verificationQueue.cosFileUrl,
        cosStatus: u.verificationQueue.cosStatus,
        gstNumber: u.verificationQueue.gstNumber,
        gstFileName: u.verificationQueue.gstFileName,
        gstFileUrl: u.verificationQueue.gstFileUrl,
        gstStatus: u.verificationQueue.gstStatus,
        panNumber: u.verificationQueue.panNumber,
        panFileName: u.verificationQueue.panFileName,
        panFileUrl: u.verificationQueue.panFileUrl,
        panStatus: u.verificationQueue.panStatus,
        aadhaarNumber: u.verificationQueue.aadhaarNumber,
        aadhaarFileName: u.verificationQueue.aadhaarFileName,
        aadhaarFileUrl: u.verificationQueue.aadhaarFileUrl,
        aadhaarStatus: u.verificationQueue.aadhaarStatus,
        rejectReason: u.verificationQueue.rejectionReason,
        submittedAt: u.verificationQueue.submittedAt
      } : undefined,
      verificationQueue: undefined, // hide internal db model
      vendorProfile: vendorProfiles.find(v => v.userId === u.id) ? {
        ...vendorProfiles.find(v => v.userId === u.id),
        categories: JSON.parse(vendorProfiles.find(v => v.userId === u.id)?.categoriesJson || "[]"),
        services: JSON.parse(vendorProfiles.find(v => v.userId === u.id)?.servicesJson || "[]"),
        portfolio: JSON.parse(vendorProfiles.find(v => v.userId === u.id)?.portfolioJson || "[]"),
        ratings: JSON.parse(vendorProfiles.find(v => v.userId === u.id)?.ratingsJson || "{}"),
        coordinates: JSON.parse(vendorProfiles.find(v => v.userId === u.id)?.coordinatesJson || "[]")
      } : undefined
    });

    // Map Prisma models back to the expected JSON structure for the frontend
    const mapVendorProfile = (p: any) => ({
      ...p,
      categories: JSON.parse(p.categoriesJson || "[]"),
      services: JSON.parse(p.servicesJson || "[]"),
      portfolio: JSON.parse(p.portfolioJson || "[]"),
      ratings: JSON.parse(p.ratingsJson || "{}"),
      coordinates: JSON.parse(p.coordinatesJson || "[]")
    });

    const mapRequirement = (r: any) => ({
      ...r,
      attachments: JSON.parse(r.attachmentsJson || "[]"),
      aiMetadata: r.aiMetadataJson ? JSON.parse(r.aiMetadataJson) : undefined
    });

    const settingsRecords = await prisma.platformSettings.findMany();
    const settings = settingsRecords.reduce((acc, curr) => {
      acc[curr.key] = JSON.parse(curr.valueJson);
      return acc;
    }, {} as any);

    const reviews = await prisma.review.findMany();

    res.json({
      users: users.map(mapUser),
      vendorProfiles: vendorProfiles.map(mapVendorProfile),
      requirements: requirements.map(mapRequirement),
      leads: leads.map(l => ({
        ...l,
        scoreBreakdown: JSON.parse(l.scoreBreakdown || "{}")
      })),
      proposals: proposals.map(p => ({
        ...p,
        attachments: JSON.parse(p.attachmentsJson || "[]")
      })),
      reviews,
      settings
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Reset database state
router.post("/reset", async (req, res) => {
  try {
    // Clear all tables
    await prisma.message.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.proposal.deleteMany();
    await prisma.lead.deleteMany();
    await prisma.requirement.deleteMany();
    await prisma.vendorProfile.deleteMany();
    await prisma.user.deleteMany();

    // Re-seed from initial platform state
    const startState = getInitialPlatformState();
    const hashedPass = await hashPassword("password123");

    for (const u of startState.users) {
      await prisma.user.create({
        data: {
          id: u.id,
          name: u.name,
          email: u.email,
          phone: u.phone || null,
          role: u.role,
          avatar: u.avatar || null,
          verified: u.verified || false,
          passwordHash: hashedPass
        }
      });
    }

    for (const v of startState.vendorProfiles) {
      await prisma.vendorProfile.create({
        data: {
          userId: v.userId,
          businessName: v.businessName,
          gstNumber: v.gstNumber || null,
          panNumber: v.panNumber || null,
          category: v.category,
          pricingModel: v.pricingModel,
          pricingMin: v.pricingMin,
          responseTime: v.responseTime || null,
          availability: v.availability || null,
          subscriptionPlan: v.subscriptionPlan || "free",
          location: v.location,
          categoriesJson: JSON.stringify(v.categories || []),
          servicesJson: JSON.stringify(v.services || []),
          portfolioJson: JSON.stringify(v.portfolio || []),
          ratingsJson: JSON.stringify(v.ratings || {}),
          coordinatesJson: JSON.stringify(v.coordinates || [])
        }
      });
    }

    for (const r of startState.requirements) {
      await prisma.requirement.create({
        data: {
          id: r.id,
          buyerId: r.buyerId,
          buyerName: r.buyerName,
          title: r.title,
          description: r.description,
          category: r.category,
          budgetMin: r.budgetMin,
          budgetMax: r.budgetMax,
          timelineWeeks: r.timelineWeeks,
          locationPreference: r.locationPreference,
          status: r.status,
          attachmentsJson: JSON.stringify(r.attachments || []),
          aiMetadataJson: r.aiMetadata ? JSON.stringify(r.aiMetadata) : null
        }
      });
    }

    for (const l of startState.leads) {
      await prisma.lead.create({
        data: {
          id: l.id,
          requirementId: l.requirementId,
          vendorId: l.vendorId,
          matchingScore: l.matchingScore,
          scoreBreakdown: JSON.stringify(l.scoreBreakdown || {}),
          status: l.status
        }
      });
    }

    for (const p of startState.proposals) {
      await prisma.proposal.create({
        data: {
          id: p.id,
          leadId: p.leadId,
          requirementId: p.requirementId,
          vendorId: p.vendorId,
          vendorBusinessName: p.vendorBusinessName,
          vendorAvatar: p.vendorAvatar || null,
          vendorRating: p.vendorRating,
          bidAmount: p.bidAmount,
          timelineWeeks: p.timelineWeeks,
          coverLetter: p.coverLetter,
          aiOptimizedProposalText: p.aiOptimizedProposalText || null,
          status: p.status
        }
      });
    }

    res.json({ success: true, state: startState });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
