import express from "express";
import { prisma } from "../prisma";

const router = express.Router();

// POST /api/user/verification - Submit verification documents
router.post("/", async (req, res) => {
  try {
    const { 
      userId, 
      businessName, 
      registrationNumber, 
      cosFileName, 
      cosFileUrl, 
      gstNumber, 
      gstFileName, 
      gstFileUrl, 
      panNumber, 
      panFileName, 
      panFileUrl, 
      aadhaarNumber, 
      aadhaarFileName, 
      aadhaarFileUrl 
    } = req.body;

    const user = await prisma.user.findUnique({ 
      where: { id: userId },
      include: { verificationQueue: true }
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Upsert verification queue record
    const updatedVerification = await prisma.verificationQueue.upsert({
      where: { userId },
      create: {
        userId,
        businessName,
        registrationNumber,
        cosFileName,
        cosFileUrl,
        cosStatus: cosFileUrl ? "pending" : null,
        gstNumber,
        gstFileName,
        gstFileUrl,
        gstStatus: gstFileUrl ? "pending" : null,
        panNumber,
        panFileName,
        panFileUrl,
        panStatus: panFileUrl ? "pending" : null,
        aadhaarNumber,
        aadhaarFileName,
        aadhaarFileUrl,
        aadhaarStatus: aadhaarFileUrl ? "pending" : null,
        status: "pending",
        submittedAt: new Date()
      },
      update: {
        businessName: businessName || undefined,
        registrationNumber: registrationNumber || undefined,
        cosFileName: cosFileName || undefined,
        cosFileUrl: cosFileUrl || undefined,
        cosStatus: cosFileUrl ? "pending" : undefined,
        gstNumber: gstNumber || undefined,
        gstFileName: gstFileName || undefined,
        gstFileUrl: gstFileUrl || undefined,
        gstStatus: gstFileUrl ? "pending" : undefined,
        panNumber: panNumber || undefined,
        panFileName: panFileName || undefined,
        panFileUrl: panFileUrl || undefined,
        panStatus: panFileUrl ? "pending" : undefined,
        aadhaarNumber: aadhaarNumber || undefined,
        aadhaarFileName: aadhaarFileName || undefined,
        aadhaarFileUrl: aadhaarFileUrl || undefined,
        aadhaarStatus: aadhaarFileUrl ? "pending" : undefined,
        status: "pending",
        submittedAt: new Date()
      }
    });

    // Ensure the user is marked as unverified until approved
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { verified: false },
      include: { verificationQueue: true }
    });

    // Update VendorProfile if role is vendor
    if (user.role === "vendor") {
      const vendor = await prisma.vendorProfile.findUnique({ where: { userId } });
      if (vendor) {
        await prisma.vendorProfile.update({
          where: { userId },
          data: {
            businessName: businessName || vendor.businessName,
            gstNumber: gstNumber || vendor.gstNumber,
            panNumber: panNumber || vendor.panNumber,
            verificationStatus: "pending"
          }
        });
      }
    }

    req.app.get("io")?.emit("dashboard_update", { source: "verification_submit" });

    res.json({ success: true, user: updatedUser });
  } catch (err: any) {
    console.error("Verification submission error:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
