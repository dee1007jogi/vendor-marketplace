import { Router } from "express";
import { prisma } from "../prisma";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import { notificationService } from "../services/NotificationService";
import { generateOtp, storeOtp, getOtp, deleteOtp } from "../services/otp.service";
import { sendOtpViaChannel } from "../services/notification.service";
import { hashPassword, verifyPassword } from "../services/password.service";
import redis from "../lib/redis";

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}
const upload = multer({ dest: "uploads/" });

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "vendimatch_secret_mvp_2024";

function generateToken(user: any) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

// =======================
// LOGIN (Password)
// =======================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ 
      where: { email },
      include: { verificationQueue: true }
    });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    if (!user.passwordHash) {
      return res.status(500).json({ error: "Account not configured for password login" });
    }

    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    const token = generateToken(user);
    const mappedUser = {
      ...user,
      verificationDocs: user.verificationQueue ? {
        businessName: user.verificationQueue.businessName,
        registrationNumber: user.verificationQueue.registrationNumber,
        cosFileName: user.verificationQueue.cosFileName,
        cosFileUrl: user.verificationQueue.cosFileUrl,
        cosStatus: user.verificationQueue.cosStatus,
        gstNumber: user.verificationQueue.gstNumber,
        gstFileName: user.verificationQueue.gstFileName,
        gstFileUrl: user.verificationQueue.gstFileUrl,
        gstStatus: user.verificationQueue.gstStatus,
        panNumber: user.verificationQueue.panNumber,
        panFileName: user.verificationQueue.panFileName,
        panFileUrl: user.verificationQueue.panFileUrl,
        panStatus: user.verificationQueue.panStatus,
        aadhaarNumber: user.verificationQueue.aadhaarNumber,
        aadhaarFileName: user.verificationQueue.aadhaarFileName,
        aadhaarFileUrl: user.verificationQueue.aadhaarFileUrl,
        aadhaarStatus: user.verificationQueue.aadhaarStatus,
        rejectReason: user.verificationQueue.rejectionReason,
        submittedAt: user.verificationQueue.submittedAt
      } : undefined,
      verificationQueue: undefined
    };
    res.json({ user: mappedUser, token, role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Login failed" });
  }
});

// =======================
// REGISTER (BUYER)
// =======================
router.post("/register/buyer", async (req, res) => {
  try {
    const { name, email, phone, password, termsAccepted } = req.body;

    if (!termsAccepted) {
      return res.status(400).json({ error: "You must accept the Terms of Service." });
    }

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });

    if (existing) {
      return res.status(400).json({ error: "Email or phone already registered" });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash: hashed,
        role: "buyer",
        isNew: true
      }
    });

    const token = generateToken(user);
    res.status(201).json({ success: true, message: "Registration successful", userId: user.id, requiresVerification: true, user, token });
  } catch (error) {
    res.status(500).json({ error: "Registration failed" });
  }
});

// =======================
// REGISTER (VENDOR - MULTIPART)
// =======================
router.post("/register/vendor", upload.fields([
  { name: 'panFile', maxCount: 1 },
  { name: 'gstFile', maxCount: 1 },
  { name: 'aadhaarFile', maxCount: 1 },
  { name: 'registrationProofFile', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 }
]), async (req, res) => {
  try {
    const step1 = JSON.parse(req.body.step1 || "{}");
    const step2 = JSON.parse(req.body.step2 || "{}");

    const { businessName, contactPersonName, email, phone, password } = step1;
    const { serviceCategories, serviceAreas } = step2;

    const existing = await prisma.user.findFirst({
      where: { OR: [{ email }, { phone }] }
    });

    if (existing) {
      return res.status(400).json({ error: "Email or phone already registered" });
    }

    const hashed = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name: contactPersonName || businessName,
        email,
        phone,
        passwordHash: hashed,
        role: "vendor",
        isNew: true
      }
    });

    const vendorProfile = await prisma.vendorProfile.create({
      data: {
        userId: user.id,
        businessName: businessName,
        category: (serviceCategories && serviceCategories[0]) || "Other",
        location: (serviceAreas && serviceAreas[0]) || "Remote",
        categoriesJson: JSON.stringify(serviceCategories || []),
        servicesJson: "[]",
        portfolioJson: "[]",
        ratingsJson: "{}",
        pricingModel: "fixed",
        pricingMin: 0,
        verificationStatus: "pending"
      }
    });

    const filesDict = req.files as { [fieldname: string]: Express.Multer.File[] };
    await prisma.verificationQueue.create({
      data: {
        userId: user.id,
        panFileUrl: filesDict['panFile']?.[0]?.path,
        gstFileUrl: filesDict['gstFile']?.[0]?.path,
        aadhaarFileUrl: filesDict['aadhaarFile']?.[0]?.path,
        // address proof and video intro are not in new schema, omitting them or they can be stored in metadata if needed.
        status: "pending"
      }
    });

    // Notify Admin of new registration
    const adminUser = await prisma.user.findFirst({ where: { role: 'admin' } });
    if (adminUser) {
      await notificationService.dispatch(
        "admin_new_registration",
        adminUser.id,
        { role: "vendor", name: businessName, email, userId: user.id }
      );
      
      const io = req.app.get("io");
      if (io) {
        io.to("admin:notifications").emit("vendor:pending", {
          vendorId: user.id,
          businessName: businessName,
          registeredAt: new Date(),
          actionUrl: `/admin/users/${user.id}`
        });
        const pendingCount = await prisma.vendorProfile.count({ where: { verificationStatus: 'pending' } });
        io.to("admin:notifications").emit("admin:badge:verificationQueue", pendingCount);
      }
    }

    const token = generateToken(user);
    res.status(201).json({ 
      success: true, 
      message: "Vendor registration submitted. Awaiting verification.", 
      vendorId: user.id, 
      verificationStatus: "pending",
      user, 
      token 
    });
  } catch (error) {
    console.error("Vendor Registration Error", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// =======================
// OTP LOGIN
// =======================
router.post("/otp/send", async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: "Phone required" });

  try {
    const otp = generateOtp();
    await storeOtp(phone, otp);
    
    // For demo purposes if it's not a real number or Twilio is failing, we could still log it
    console.log(`\n\n===========================================`);
    console.log(`[Twilio/WhatsApp] Attempting to send OTP to ${phone}`);
    console.log(`[Twilio/WhatsApp] Your OTP is: ${otp}`);
    console.log(`===========================================\n\n`);

    // We can default to SMS or allow a channel param if requested.
    await sendOtpViaChannel(phone, otp, 'sms');

    res.json({ success: true, message: "OTP sent successfully" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send OTP" });
  }
});

router.post("/otp/verify", async (req, res) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) return res.status(400).json({ error: "Phone and OTP required" });

  try {
    const storedOtp = await getOtp(phone);
    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ error: "OTP expired or invalid" });
    }

    // Find user
    const user = await prisma.user.findFirst({ 
      where: { phone },
      include: { verificationQueue: true }
    });
    if (!user) {
      // If not found, it means they might just have verified their phone during registration
      return res.status(404).json({ error: "User not found. Please register.", action: "register" });
    }

    await deleteOtp(phone);
    const token = generateToken(user);
    const mappedUser = {
      ...user,
      verificationDocs: user.verificationQueue ? {
        businessName: user.verificationQueue.businessName,
        registrationNumber: user.verificationQueue.registrationNumber,
        cosFileName: user.verificationQueue.cosFileName,
        cosFileUrl: user.verificationQueue.cosFileUrl,
        cosStatus: user.verificationQueue.cosStatus,
        gstNumber: user.verificationQueue.gstNumber,
        gstFileName: user.verificationQueue.gstFileName,
        gstFileUrl: user.verificationQueue.gstFileUrl,
        gstStatus: user.verificationQueue.gstStatus,
        panNumber: user.verificationQueue.panNumber,
        panFileName: user.verificationQueue.panFileName,
        panFileUrl: user.verificationQueue.panFileUrl,
        panStatus: user.verificationQueue.panStatus,
        aadhaarNumber: user.verificationQueue.aadhaarNumber,
        aadhaarFileName: user.verificationQueue.aadhaarFileName,
        aadhaarFileUrl: user.verificationQueue.aadhaarFileUrl,
        aadhaarStatus: user.verificationQueue.aadhaarStatus,
        rejectReason: user.verificationQueue.rejectionReason,
        submittedAt: user.verificationQueue.submittedAt
      } : undefined,
      verificationQueue: undefined
    };
    res.json({ success: true, user: mappedUser, token, role: user.role });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to verify OTP" });
  }
});

// =======================
// FORGOT PASSWORD
// =======================
router.post("/forgot-password/request", async (req, res) => {
  const { identifier } = req.body;
  const user = await prisma.user.findFirst({
    where: { OR: [{ email: identifier }, { phone: identifier }] }
  });

  if (!user) return res.status(404).json({ error: "Account not found" });

  try {
    const otp = generateOtp();
    await storeOtp(identifier, otp);

    console.log(`\n\n===========================================`);
    console.log(`[RESET] Attempting to send Password Reset OTP to ${identifier}`);
    console.log(`[RESET] Your OTP is: ${otp}`);
    console.log(`===========================================\n\n`);

    // If identifier is phone, send SMS. If it's email, in real app send Email. We'll fallback to SMS if it has +
    if (identifier.startsWith('+')) {
      await sendOtpViaChannel(identifier, otp, 'sms');
    }

    res.json({ success: true, message: "Reset OTP sent" });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Failed to send reset OTP" });
  }
});

router.post("/forgot-password/verify", async (req, res) => {
  const { identifier, otp } = req.body;
  try {
    const storedOtp = await getOtp(identifier);

    if (!storedOtp || storedOtp !== otp) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Issue temporary reset token
    const resetToken = jwt.sign({ identifier, purpose: 'reset' }, JWT_SECRET, { expiresIn: '15m' });
    await deleteOtp(identifier);
    
    res.json({ success: true, resetToken });
  } catch (err: any) {
    res.status(500).json({ error: err.message || "Verification failed" });
  }
});

router.post("/forgot-password/reset", async (req, res) => {
  const { resetToken, newPassword } = req.body;

  try {
    const decoded: any = jwt.verify(resetToken, JWT_SECRET);
    if (decoded.purpose !== 'reset') throw new Error();

    const hashed = await hashPassword(newPassword);
    
    await prisma.user.updateMany({
      where: { OR: [{ email: decoded.identifier }, { phone: decoded.identifier }] },
      data: { passwordHash: hashed }
    });

    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ error: "Invalid or expired reset token" });
  }
});

// =======================
// DEVICE PUSH TOKENS
// =======================
router.post("/device-token", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Unauthorized" });

  const tokenStr = authHeader.split(' ')[1];
  try {
    const decoded: any = jwt.verify(tokenStr, JWT_SECRET);
    const { pushToken } = req.body;
    
    if (!pushToken) {
      return res.status(400).json({ error: "Push token required" });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) return res.status(404).json({ error: "User not found" });

    let tokens: string[] = [];
    if (user.deviceTokens) {
      try {
        tokens = JSON.parse(user.deviceTokens);
      } catch (e) {}
    }

    if (!tokens.includes(pushToken)) {
      tokens.push(pushToken);
      await prisma.user.update({
        where: { id: decoded.id },
        data: { deviceTokens: JSON.stringify(tokens) }
      });
    }

    res.json({ success: true, message: "Device token registered successfully" });
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
