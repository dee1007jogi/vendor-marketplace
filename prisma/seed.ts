import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ================== HELPER: Hash password ==================
async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 10);
}

// ================== MAIN SEED FUNCTION ==================
async function main() {
  console.log('🌱 Starting database seed...');

  // --- 1. CLEANUP (Reverse order of dependencies) ---
  console.log('🗑️  Cleaning up old data...');
  await prisma.analyticsEvent.deleteMany({});
  await prisma.review.deleteMany({});
  await prisma.savedVendor.deleteMany({});
  await prisma.projectMilestone.deleteMany({});
  await prisma.attachment.deleteMany({});
  await prisma.proposal.deleteMany({});
  await prisma.requirement.deleteMany({});
  await prisma.otpAttempt.deleteMany({});
  await prisma.userSession.deleteMany({});
  await prisma.category.deleteMany({});
  await prisma.platformSettings.deleteMany({});
  await prisma.vendorProfile.deleteMany({});
  await prisma.user.deleteMany({});
  console.log('✅ Cleanup complete.');

  // --- 2. SEED ADMIN ---
  console.log('👤 Seeding Admin...');
  const passwordHash = await hashPassword('Password123!');

  // Admin
  await prisma.user.create({
    data: {
      email: 'admin@vendorconnect.com',
      passwordHash,
      name: 'System Admin',
      role: 'ADMIN',
      verified: true,
    },
  });
  console.log(`✅ Created Admin user.`);

  // --- 3. SEED CATEGORIES ---
  console.log('📂 Seeding categories...');
  const categories = [
    { name: 'Web Development', slug: 'web-dev', description: 'React, Node, PHP, etc.', icon: 'fa-code', displayOrder: 1, isActive: true },
    { name: 'Mobile Apps', slug: 'mobile-apps', description: 'iOS, Android, React Native.', icon: 'fa-mobile', displayOrder: 2, isActive: true },
    { name: 'AI & Machine Learning', slug: 'ai-ml', description: 'LLMs, Computer Vision, Data.', icon: 'fa-brain', displayOrder: 3, isActive: true },
    { name: 'Design & Creative', slug: 'design', description: 'UI/UX, Graphics, Branding.', icon: 'fa-paint-brush', displayOrder: 4, isActive: true },
    { name: 'Marketing', slug: 'marketing', description: 'SEO, Social Media, Content.', icon: 'fa-bullhorn', displayOrder: 5, isActive: true },
    { name: 'Consulting', slug: 'consulting', description: 'Business, Strategy, Finance.', icon: 'fa-handshake', displayOrder: 6, isActive: true },
  ];
  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    });
  }
  console.log(`✅ Seeded ${categories.length} categories.`);

  // --- 4. SEED PLATFORM SETTINGS (AI Weights) ---
  console.log('⚙️  Seeding platform settings...');
  await prisma.platformSettings.upsert({
    where: { key: 'ai_matching_weights' },
    update: {}, // Keep existing if present
    create: {
      key: 'ai_matching_weights',
      valueJson: JSON.stringify({ category: 30, location: 15, rating: 25, budget: 30 }),
    },
  });
  console.log('✅ Platform settings seeded.');

  console.log('🎉 Seed completed successfully!');
}

// ================== EXECUTE ==================
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
