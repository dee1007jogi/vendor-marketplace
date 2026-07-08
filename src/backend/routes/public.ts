import { Router } from "express";
import { prisma } from "../prisma";

const router = Router();

// GET /api/public/stats (Trust bar stats)
router.get("/stats", async (req, res) => {
  try {
    const vendorCount = await prisma.vendorProfile.count();
    // For MVP, hardcode or calculate some values if DB is small
    res.json({
      vendorCount: vendorCount > 0 ? vendorCount : 5234,
      projectValueCr: 120,
      satisfactionRate: 98,
      avgResponseTime: "< 2 min"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch stats" });
  }
});

// Define the default categories only ONCE here
const DEFAULT_CATEGORIES = [
  { name: 'Web Development', slug: 'web-dev', description: 'React, Node, PHP, etc.', icon: 'fa-code' },
  { name: 'Mobile Apps', slug: 'mobile-apps', description: 'iOS, Android, React Native.', icon: 'fa-mobile' },
  { name: 'AI & Machine Learning', slug: 'ai-ml', description: 'LLMs, Computer Vision, Data.', icon: 'fa-brain' },
  { name: 'Design & Creative', slug: 'design', description: 'UI/UX, Graphics, Branding.', icon: 'fa-paint-brush' },
  { name: 'Marketing', slug: 'marketing', description: 'SEO, Social Media, Content.', icon: 'fa-bullhorn' },
  { name: 'Consulting', slug: 'consulting', description: 'Business, Strategy, Finance.', icon: 'fa-handshake' },
];

router.get('/categories', async (req, res) => {
  try {
    // 1. Check how many categories exist
    const count = await prisma.category.count();

    // 2. If zero, SEED the database with the constants
    if (count === 0) {
      console.warn('[Seed] Categories table empty. Seeding default categories...');
      await prisma.category.createMany({
        data: DEFAULT_CATEGORIES,
        // sqlite skipDuplicates workaround using ignore on db level, or just raw:
        // skipDuplicates: true, (prisma handles this if possible)
      });
    }

    // 3. Fetch categories (now guaranteed to have data)
    let categories = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: 'asc' },
      select: { id: true, name: true, slug: true, description: true, icon: true },
    });
    
    const { popular, withCounts } = req.query;
    if (popular === "true") categories = categories.slice(0, 6);
    else if (withCounts === "true") categories = categories.slice(0, 8);

    res.json({ items: categories });
  } catch (error) {
    console.error(error);
    // Ultimate fallback: return the hardcoded list without saving to DB (avoid total failure)
    res.json({ items: DEFAULT_CATEGORIES, warning: 'Using fallback (DB unavailable)' });
  }
});

// GET /api/public/vendors/featured
router.get("/vendors/featured", async (req, res) => {
  try {
    const limit = Number(req.query.limit) || 3;
    const vendors = await prisma.vendorProfile.findMany({
      take: limit,
      include: { user: true }
    });
    
    const formatted = vendors.map(v => {
      let ratings = { avg: 4.8, count: 120 };
      try {
        if (v.ratingsJson) ratings = JSON.parse(v.ratingsJson);
      } catch (e) {}
      
      return {
        id: v.userId,
        businessName: v.businessName,
        logo: v.user?.avatar || "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=150&q=80",
        rating: ratings.avg || 4.8,
        reviewCount: ratings.count || Math.floor(Math.random() * 200) + 50,
        responseTime: v.responseTime || "2 min",
        verified: v.user?.verified || true,
        premium: v.subscriptionPlan === "premium" || v.subscriptionPlan === "enterprise"
      };
    });
    res.json({ items: formatted });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch featured vendors" });
  }
});

// GET /api/public/testimonials
router.get("/testimonials", async (req, res) => {
  res.json({
    items: [
      {
        id: "1",
        quote: "Found a web development agency within 2 hours. The AI matching was spot on. Saved weeks of searching.",
        name: "Priya Mehta",
        title: "Founder, StartupX",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80"
      },
      {
        id: "2",
        quote: "The escrow protection gave me the confidence to hire an out-of-state logistics provider. Incredible platform.",
        name: "Rahul Verma",
        title: "Operations Head, Logistics Corp",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80"
      },
      {
        id: "3",
        quote: "As a vendor, I receive high-intent qualified leads every day. My agency has doubled its revenue in 6 months.",
        name: "Anjali Singh",
        title: "CEO, Creative Spark",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80"
      }
    ]
  });
});

// GET /api/public/seo-stats
router.get("/seo-stats", async (req, res) => {
  try {
    const { category, city } = req.query;
    
    // Convert hyphens to spaces or handle mapping, e.g. "software-development" -> "Software Development"
    // Since this is MVP and SQLite `contains` is case-insensitive, we'll do basic replacement.
    const catFormatted = typeof category === 'string' ? category.replace(/-/g, ' ') : '';
    const cityFormatted = typeof city === 'string' ? city.replace(/-/g, ' ') : '';

    const vendors = await prisma.vendorProfile.findMany({
      where: {
        AND: [
          catFormatted ? { category: { contains: catFormatted } } : {},
          cityFormatted ? { location: { contains: cityFormatted } } : {}
        ]
      }
    });

    const count = vendors.length || Math.floor(Math.random() * 50) + 10; // fallback to fake data for MVP SEO if empty
    
    res.json({
      vendorCount: count,
      avgRating: 4.8,
      priceRange: "₹50k to ₹2L"
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch SEO stats" });
  }
});

export default router;
