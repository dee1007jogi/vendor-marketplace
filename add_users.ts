import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Add a Buyer
  const buyerId = "user-buyer-custom";
  const existingBuyer = await prisma.user.findUnique({ where: { id: buyerId } });
  if (!existingBuyer) {
    await prisma.user.create({
      data: {
        id: buyerId,
        name: "Custom Buyer",
        email: "buyer@vendimatch.ai",
        phone: "+91 99999 00000",
        role: "buyer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        verified: true,
      }
    });
    console.log("Added custom buyer");
  } else {
    console.log("Buyer already exists");
  }

  // Add an Admin
  const adminId = "user-admin-custom";
  const existingAdmin = await prisma.user.findUnique({ where: { id: adminId } });
  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        id: adminId,
        name: "Custom Admin",
        email: "admin@vendimatch.ai",
        phone: "+91 88888 00000",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
        verified: true,
      }
    });
    console.log("Added custom admin");
  } else {
    console.log("Admin already exists");
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
