import { Router } from "express";
import { prisma } from "../prisma";
import { matchVendorsToRequirement } from "../services/ai.service";

const router = Router();

// PUT /api/vendors/:id/services - Update vendor services
router.put("/:id/services", async (req, res) => {
  try {
    const { id } = req.params;
    const { services } = req.body;
    
    if (!services || !Array.isArray(services)) {
      return res.status(400).json({ error: "Services must be an array" });
    }

    const updatedProfile = await prisma.vendorProfile.update({
      where: { userId: id },
      data: {
        servicesJson: JSON.stringify(services)
      }
    });

    req.app.get("io")?.emit("dashboard_update", { source: "vendor_services_updated" });

    res.json({ success: true, profile: updatedProfile });
  } catch (error) {
    console.error("Failed to update services:", error);
    res.status(500).json({ error: "Failed to update services" });
  }
});

// GET /api/vendors/:id/leads - Get vendor leads
router.get("/:id/leads", async (req, res) => {
  try {
    const { id } = req.params;
    const leads = await prisma.lead.findMany({
      where: { vendorId: id },
      include: {
        requirement: true,
      },
      orderBy: { requirement: { createdAt: 'desc' } }
    });
    res.json({ items: leads });
  } catch (error) {
    console.error("Failed to fetch leads:", error);
    res.status(500).json({ error: "Failed to fetch leads" });
  }
});

// GET /api/vendors/facets - Get facet counts for sidebar
router.get("/facets", async (req, res) => {
  try {
    const vendors = await prisma.vendorProfile.findMany({
      select: { category: true, location: true, pricingMin: true }
    });

    const categoryCounts: Record<string, number> = {};
    const locationCounts: Record<string, number> = {};

    vendors.forEach(v => {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
      locationCounts[v.location] = (locationCounts[v.location] || 0) + 1;
    });

    res.json({
      categories: Object.entries(categoryCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      locations: Object.entries(locationCounts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count)
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch facets" });
  }
});

// GET /api/vendors/search - Main discovery search
router.get("/search", async (req, res) => {
  try {
    const { 
      q, 
      category, 
      location, 
      minBudget, 
      maxBudget, 
      minRating, 
      responseTime,
      verifiedOnly,
      sort = "best_match",
      page = "1",
      limit = "20",
      cursor // New cursor parameter for cursor-based pagination
    } = req.query;

    const where: any = {};

    if (q) {
      where.OR = [
        { businessName: { contains: String(q) } },
        { category: { contains: String(q) } },
        { servicesJson: { contains: String(q) } }
      ];
    }

    if (category) {
      // Split by commas for multiple categories if needed, but simple equals for now
      where.category = { equals: String(category) };
    }

    if (location && location !== "All") {
      where.location = { equals: String(location) };
    }

    if (minBudget || maxBudget) {
      where.pricingMin = {};
      if (minBudget) where.pricingMin.gte = Number(minBudget);
      if (maxBudget) where.pricingMin.lte = Number(maxBudget);
    }

    if (verifiedOnly === "true") {
      where.user = { verified: true };
    }

    const limitNum = parseInt(String(limit), 10);
    const pageNum = parseInt(String(page), 10);
    
    // DB optimization: If sorting by price_asc, we can use Prisma's native cursor/limit
    // avoiding fetching the entire dataset into memory.
    const findArgs: any = {
      where,
      include: { user: { select: { avatar: true, verified: true } } }
    };
    
    if (sort === "price_asc") {
      findArgs.orderBy = { pricingMin: "asc" };
      findArgs.take = limitNum;
      
      // Implement Cursor-based Pagination if cursor is provided
      if (cursor) {
        findArgs.cursor = { userId: String(cursor) };
        findArgs.skip = 1;
      } else if (pageNum > 1) {
        // Fallback to skip if page is explicitly provided without cursor
        findArgs.skip = (pageNum - 1) * limitNum;
      }
    }

    let vendors = await prisma.vendorProfile.findMany(findArgs);

    let processedVendors = vendors.map(v => {
      let ratings = { avg: 4.8, count: 24, quality: 4.9, timeliness: 4.7, communication: 4.8 };
      try { 
        if (v.ratingsJson) {
          const parsed = JSON.parse(v.ratingsJson);
          if (Object.keys(parsed).length > 0) ratings = { ...ratings, ...parsed };
        }
      } catch (e) {}
      
      let services = ["Web Development", "UI/UX Design", "Cloud Architecture", "API Integration", "Consulting"];
      try { 
        if (v.servicesJson) {
          const parsed = JSON.parse(v.servicesJson);
          if (parsed.length > 0) services = parsed;
        }
      } catch (e) {}

      // simple match score calculation
      let matchScore = 70;
      if ((v as any).user.verified) matchScore += 10;
      if (ratings.avg >= 4.5) matchScore += 10;
      if (v.responseTime && v.responseTime.includes("hour")) matchScore += 5;
      if (q && v.businessName.toLowerCase().includes(String(q).toLowerCase())) matchScore += 5;

      return { ...v, ratings, services, matchScore };
    });

    if (minRating) processedVendors = processedVendors.filter(v => v.ratings.avg >= Number(minRating));
    if (responseTime) processedVendors = processedVendors.filter(v => v.responseTime && v.responseTime.includes(String(responseTime)));

    // Only sort in memory if not already sorted natively by DB
    if (sort === "rating") processedVendors.sort((a, b) => b.ratings.avg - a.ratings.avg);
    else if (sort === "best_match") processedVendors.sort((a, b) => b.matchScore - a.matchScore);

    let paginated = processedVendors;
    // If we didn't natively paginate in the DB, slice it here
    if (sort !== "price_asc") {
      const startIndex = (pageNum - 1) * limitNum;
      paginated = processedVendors.slice(startIndex, startIndex + limitNum);
    }
    
    // Determine the next cursor (the ID of the last element)
    const nextCursor = paginated.length > 0 ? paginated[paginated.length - 1].userId : null;

    res.json({
      items: paginated.map(v => ({
        id: v.userId,
        businessName: v.businessName,
        slug: v.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        logo: (v as any).user.avatar,
        category: v.category,
        location: v.location,
        verified: (v as any).user.verified,
        premium: v.subscriptionPlan === "premium" || v.subscriptionPlan === "enterprise",
        rating: v.ratings.avg,
        reviewCount: v.ratings.count,
        responseTime: v.responseTime,
        startingPrice: v.pricingMin,
        matchScore: v.matchScore,
        services: v.services.slice(0, 3)
      })),
      total: sort === "price_asc" && !cursor ? await prisma.vendorProfile.count({ where }) : processedVendors.length,
      page: pageNum,
      nextCursor,
      totalPages: sort === "price_asc" ? Math.ceil((await prisma.vendorProfile.count({ where })) / limitNum) : Math.ceil(processedVendors.length / limitNum)
    });
  } catch (error) {
    res.status(500).json({ error: "Search failed" });
  }
});

// GET /api/vendors/compare - Fetch selected vendors for comparison
router.get("/compare", async (req, res) => {
  try {
    const ids = req.query.ids as string;
    if (!ids) return res.json([]);

    const vendorIds = ids.split(",");
    
    const vendors = await prisma.vendorProfile.findMany({
      where: { userId: { in: vendorIds } },
      include: {
        user: { select: { verified: true, avatar: true } }
      }
    });

    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch comparison data" });
  }
});

// GET /api/vendors/:slug - Fetch full vendor profile
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params;
    if (slug === "profile") return res.status(404).end(); // avoid conflict with POST /profile

    const allVendors = await prisma.vendorProfile.findMany({
      include: { user: { select: { avatar: true, verified: true, createdAt: true } } }
    });

    const vendor = allVendors.find(v => v.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-') === slug || v.userId === slug);

    if (!vendor) return res.status(404).json({ error: "Vendor not found" });

    const viewerId = (req as any).user?.id; // Optional: logged-in user
    if (viewerId && viewerId !== vendor.userId) {
      try {
        await prisma.profileView.create({
          data: {
            viewerId: viewerId,
            targetId: vendor.userId,
            source: 'direct_link',
          },
        });
      } catch (e) { /* log silently */ }
    }

    let ratings = { avg: 4.8, count: 24, quality: 4.9, timeliness: 4.7, communication: 4.8 };
    try { 
      if (vendor.ratingsJson) {
        const parsed = JSON.parse(vendor.ratingsJson);
        if (Object.keys(parsed).length > 0) ratings = { ...ratings, ...parsed };
      }
    } catch (e) {}

    let portfolio = [
      { title: "Enterprise Dashboard", description: "A highly scalable B2B dashboard built with React and Node.", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" },
      { title: "E-Commerce App", description: "Mobile-first e-commerce solution serving millions of users.", imageUrl: "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=600&q=80" }
    ];
    try { 
      if (vendor.portfolioJson) {
        const parsed = JSON.parse(vendor.portfolioJson);
        if (parsed.length > 0) portfolio = parsed;
      }
    } catch (e) {}

    let services = ["Web Development", "UI/UX Design", "Cloud Architecture", "API Integration", "Consulting"];
    try { 
      if (vendor.servicesJson) {
        const parsed = JSON.parse(vendor.servicesJson);
        if (parsed.length > 0) services = parsed;
      }
    } catch (e) {}

    res.json({
      id: vendor.userId,
      businessName: vendor.businessName,
      logo: vendor.user.avatar,
      verified: vendor.user.verified,
      premium: vendor.subscriptionPlan === "premium" || vendor.subscriptionPlan === "enterprise",
      category: vendor.category,
      location: vendor.location,
      pricingMin: vendor.pricingMin,
      pricingModel: vendor.pricingModel,
      responseTime: vendor.responseTime,
      teamSize: "10-50",
      foundedYear: new Date(vendor.user.createdAt).getFullYear(),
      ratings,
      portfolio,
      services,
      description: `We are a premier ${vendor.category} provider based in ${vendor.location}. We deliver scalable and robust solutions tailored to your business needs.`
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor profile" });
  }
});

// Update Vendor Profile details
router.post("/profile", async (req, res) => {
  const { userId, businessName, location, pricingMin, pricingModel, services, categories } = req.body;
  
  try {
    const existing = await prisma.vendorProfile.findUnique({
      where: { userId }
    });

    if (!existing) {
      // Create new
      const newProfile = await prisma.vendorProfile.create({
        data: {
          userId,
          businessName: businessName || "Enterprise Venture",
          category: categories?.[0] || "Software Development",
          pricingModel: pricingModel || "fixed",
          pricingMin: Number(pricingMin) || 1000,
          responseTime: "Within 2 hours",
          availability: "immediate",
          subscriptionPlan: "silver",
          location: location || "Global",
          categoriesJson: JSON.stringify(categories || ["Software Development"]),
          servicesJson: JSON.stringify(services || []),
          portfolioJson: JSON.stringify([]),
          ratingsJson: JSON.stringify({ avg: 5.0, count: 1, quality: 5, timeliness: 5, communication: 5 }),
          coordinatesJson: JSON.stringify([12.9716, 77.5946])
        }
      });
      res.json({ success: true, profile: newProfile });
    } else {
      // Update existing
      const updatedProfile = await prisma.vendorProfile.update({
        where: { userId },
        data: {
          businessName: businessName || existing.businessName,
          location: location || existing.location,
          pricingMin: pricingMin ? Number(pricingMin) : existing.pricingMin,
          pricingModel: pricingModel || existing.pricingModel,
          category: categories?.[0] || existing.category,
          categoriesJson: categories ? JSON.stringify(categories) : existing.categoriesJson,
          servicesJson: services ? JSON.stringify(services) : existing.servicesJson
        }
      });
      res.json({ success: true, profile: updatedProfile });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/vendors/kyc - Submit KYC details
router.post("/kyc", async (req, res) => {
  const { userId, panUrl, gstUrl, aadhaarUrl, videoUrl } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing vendor ID" });

  try {
    const queue = await prisma.verificationQueue.create({
      data: {
        userId,
        panFileUrl: panUrl,
        gstFileUrl: gstUrl,
        aadhaarFileUrl: aadhaarUrl,
        // videoIntroUrl is no longer in schema, we can safely omit or drop it
        status: "pending"
      }
    });
    res.json({ success: true, queue });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/vendors/match
router.post("/match", async (req, res) => {
  const { requirementId } = req.body;

  try {
    const requirement = await prisma.requirement.findUnique({ where: { id: requirementId } });
    if (!requirement) return res.status(404).json({ error: "Requirement not found" });

    // Fetch a shortlist of potential vendors (top 20)
    const potentialVendors = await prisma.vendorProfile.findMany({
      where: {
        category: requirement.category,
        location: requirement.locationPreference === "Any" ? undefined : requirement.locationPreference
      },
      take: 20,
      include: { user: true }
    });

    if (potentialVendors.length === 0) {
      return res.json({ matches: [], message: "No vendors found in this category/location" });
    }

    const vendorsPayload = potentialVendors.map(v => {
      let rating = 4.0;
      try { rating = JSON.parse(v.ratingsJson).avg; } catch (e) {}
      return {
        id: v.userId,
        name: v.businessName,
        description: v.servicesJson,
        category: v.category,
        location: v.location,
        rating
      };
    });

    const result = await matchVendorsToRequirement(requirement.description, vendorsPayload);

    if (!result.success || !result.data) {
      // Fallback
      const fallbackMatches = potentialVendors.slice(0, 5).map(v => ({ ...v, matchScore: 75, aiReasoning: "Fallback match" }));
      return res.json({ matches: fallbackMatches, mode: "fallback" });
    }

    const vendorMap = new Map(potentialVendors.map(v => [v.userId, v]));
    const enrichedMatches = result.data
      .filter((m: any) => vendorMap.has(m.vendorId))
      .slice(0, 5)
      .map((m: any) => ({
        ...vendorMap.get(m.vendorId),
        matchScore: m.matchScore,
        aiReasoning: m.reasoning,
      }));

    res.json({ matches: enrichedMatches, mode: "ai" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Matching failed" });
  }
});

// GET /api/vendors/:id/similar
// Uses AI (Gemini) Collaborative Filtering to return top similar vendors
router.get("/:id/similar", async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get the current vendor's profile
    const currentVendor = await prisma.user.findUnique({
      where: { id },
      include: { vendorProfile: true }
    });

    if (!currentVendor || !currentVendor.vendorProfile) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    const { category, location } = currentVendor.vendorProfile;

    // Fetch up to 10 potential candidates to score
    const candidateVendors = await prisma.user.findMany({
      where: {
        role: "VENDOR",
        id: { not: id },
        vendorProfile: { isNot: null }
      },
      include: { vendorProfile: true },
      take: 10
    });

    if (candidateVendors.length === 0) {
      return res.json({ items: [] });
    }

    const { findSimilarVendors } = await import("../services/ai.service");
    
    const targetPayload = {
      name: currentVendor.vendorProfile.businessName,
      category: currentVendor.vendorProfile.category,
      location: currentVendor.vendorProfile.location,
      services: currentVendor.vendorProfile.servicesJson || ""
    };

    const candidatesPayload = candidateVendors.map(v => ({
      id: v.id,
      name: v.vendorProfile!.businessName,
      category: v.vendorProfile!.category,
      location: v.vendorProfile!.location,
      services: v.vendorProfile!.servicesJson || ""
    }));

    const result = await findSimilarVendors(targetPayload, candidatesPayload);

    let scoredVendors = [];

    if (result.success && result.data) {
      const vendorMap = new Map(candidateVendors.map(v => [v.id, v]));
      
      scoredVendors = result.data
        .filter((r: any) => vendorMap.has(r.vendorId))
        .map((r: any) => {
          const v = vendorMap.get(r.vendorId)!;
          return {
            id: v.id,
            businessName: v.vendorProfile!.businessName,
            category: v.vendorProfile!.category,
            location: v.vendorProfile!.location,
            avatar: v.avatar,
            verified: v.verified,
            affinityScore: r.affinityScore,
            aiReasoning: r.reasoning
          };
        })
        .slice(0, 3); // Return top 3
    } else {
      // Fallback logic if AI fails
      scoredVendors = candidateVendors.slice(0, 3).map(v => {
        let score = 75;
        if (v.vendorProfile?.category === category) score += 10;
        if (v.vendorProfile?.location === location) score += 10;
        return {
          id: v.id,
          businessName: v.vendorProfile!.businessName,
          category: v.vendorProfile!.category,
          location: v.vendorProfile!.location,
          avatar: v.avatar,
          verified: v.verified,
          affinityScore: score,
          aiReasoning: "Fallback matching based on category/location."
        };
      });
      scoredVendors.sort((a, b) => b.affinityScore - a.affinityScore);
    }

    res.json({ items: scoredVendors });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch similar vendors" });
  }
});

export default router;
