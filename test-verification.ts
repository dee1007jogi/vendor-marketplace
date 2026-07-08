import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();
const API_BASE = 'http://localhost:3000/api';

async function testVerificationFlow() {
  console.log("=== Starting Verification E2E Test ===");

  try {
    // 1. Fetch an unverified vendor from the database
    const vendor = await prisma.user.findFirst({
      where: { role: 'vendor' },
      include: { vendorProfile: true }
    });

    if (!vendor) {
      console.error("❌ No vendor found in database.");
      process.exit(1);
    }
    
    // Ensure the vendor is initially unverified for the test
    await prisma.user.update({
      where: { id: vendor.id },
      data: { verified: false }
    });
    
    // Delete any existing queue for this vendor to ensure clean slate
    await prisma.verificationQueue.deleteMany({
      where: { userId: vendor.id }
    });

    console.log(`✅ Using Vendor: ${vendor.name} (${vendor.id})`);

    // 2. Submit Verification Docs (Simulate Frontend Request)
    console.log("\n[1/4] Submitting Verification Request...");
    const submitReq = await fetch(`${API_BASE}/user/verification`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: vendor.id,
        businessName: vendor.vendorProfile?.businessName || vendor.name,
        panNumber: 'ABCDE1234F',
        panFileName: 'pan_card.jpg',
        panFileUrl: 'https://example.com/pan.jpg',
        gstNumber: '22AAAAA0000A1Z5',
        gstFileName: 'gst_certificate.pdf',
        gstFileUrl: 'https://example.com/gst.pdf'
      })
    });

    const submitRes = await submitReq.json() as any;
    if (submitReq.ok && submitRes.success) {
      console.log("✅ Verification submitted successfully!");
    } else {
      console.error("❌ Failed to submit verification:", submitRes);
      process.exit(1);
    }

    // 3. Admin: Check Pending Queue
    console.log("\n[2/4] Fetching Admin Pending Queue...");
    const queueReq = await fetch(`${API_BASE}/admin/v1/verification/pending`);
    const queueRes = await queueReq.json() as any;
    
    const targetItem = queueRes.items.find((item: any) => item.userId === vendor.id);
    if (targetItem) {
      console.log("✅ Found vendor in pending queue!");
      console.log(`   ID: ${targetItem.id}, Status: ${targetItem.status}`);
    } else {
      console.error("❌ Vendor not found in admin pending queue.");
      process.exit(1);
    }

    // 4. Admin: Approve Request
    console.log(`\n[3/4] Admin Approving Verification (${targetItem.id})...`);
    const approveReq = await fetch(`${API_BASE}/admin/v1/verification/${targetItem.id}/approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: 'Looks good! Verified automatically by test.' })
    });
    
    const approveRes = await approveReq.json() as any;
    if (approveReq.ok && approveRes.status === 'approved') {
      console.log("✅ Verification approved!");
    } else {
      console.error("❌ Failed to approve verification:", approveRes);
      process.exit(1);
    }

    // 5. Final State Check
    console.log("\n[4/4] Verifying Final User State...");
    const finalUser = await prisma.user.findUnique({
      where: { id: vendor.id },
      include: { vendorProfile: true }
    });

    if (finalUser?.verified && finalUser.vendorProfile?.verificationStatus === 'approved') {
      console.log("✅ User and VendorProfile successfully updated to verified status!");
      console.log("🎉 Verification E2E Test completed successfully!");
    } else {
      console.error("❌ Final state mismatch:", finalUser);
      process.exit(1);
    }

  } catch (error) {
    console.error("Test failed with error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

testVerificationFlow();
