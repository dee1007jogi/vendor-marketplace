import { Router } from "express";
import { prisma } from "../prisma";
import { parseRequirementFromText, matchVendorsToRequirement } from "../services/ai.service";

const router = Router();

// POST /api/requirements/analyze - Use AI to extract metadata from requirement description
router.post("/analyze", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Prompt is required" });

    const result = await parseRequirementFromText(prompt);

    if (!result.success || !result.data) {
      // Fallback
      return res.json({
        title: "Parsed Requirement",
        category: "Software Development",
        subcategory: "General",
        budgetMin: 10000,
        budgetMax: 50000,
        timelineWeeks: 4,
        customSpecs: { parsed: "AI Parsing failed" },
        mode: "fallback"
      });
    }

    res.json({
      ...result.data,
      title: result.data.shortSummary || "New Requirement",
      budgetMin: result.data.budgetRange?.min || 0,
      budgetMax: result.data.budgetRange?.max || 0,
      timelineWeeks: result.data.timeline?.includes("week") ? parseInt(result.data.timeline) : 4,
      customSpecs: { skills: result.data.requiredSkills },
      mode: "ai"
    });
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: "Failed to analyze requirement" });
  }
});

// POST /api/requirements/post - Guided requirement posting (with mocked AI matching)
router.post("/post", async (req, res) => {
  try {
    const { 
      buyerId, 
      buyerName, 
      title, 
      description, 
      category, 
      budgetMin, 
      budgetMax, 
      timelineWeeks, 
      locationPreference,
      attachmentsJson,
      aiMetadataJson
    } = req.body;

    if (!buyerId) return res.status(400).json({ error: "buyerId is required" });

    const newReq = await prisma.requirement.create({
      data: {
        buyerId,
        buyerName: buyerName || "Buyer",
        title: title || "New Requirement",
        description: description || "",
        category: category || "General",
        budgetMin: Number(budgetMin) || 0,
        budgetMax: Number(budgetMax) || 0,
        timelineWeeks: Number(timelineWeeks) || 4,
        locationPreference: locationPreference || "Any",
        attachmentsJson: attachmentsJson || "[]",
        aiMetadataJson: aiMetadataJson || "{}",
        status: "open"
      }
    });

    // True AI Matching Logic based on Blueprint Weighted Scoring
    const vendors = await prisma.vendorProfile.findMany();
    
    const leadsData = [];
    
    for (const v of vendors) {
      let score = 0;
      
      // 1. Category match (30%)
      const catMatch = v.category === category || v.categoriesJson.includes(category);
      if (catMatch) score += 30;
      
      // 2. Location match (15%)
      if (locationPreference === "Any" || v.location === locationPreference) score += 15;
      
      // 3. Budget fit (15%)
      // If vendor's minimum pricing is <= buyer's max budget
      if (v.pricingMin <= (Number(budgetMax) || Infinity)) score += 15;
      
      // 4. Ratings (10%)
      let ratings = { avg: 4.0 };
      try { if (v.ratingsJson) ratings = JSON.parse(v.ratingsJson); } catch (e) {}
      if (ratings.avg >= 4.5) score += 10;
      else if (ratings.avg >= 4.0) score += 5;
      
      // 5. Response time (10%)
      if (v.responseTime && (v.responseTime.includes("hour") || v.responseTime.includes("immediate"))) score += 10;
      
      // 6. Experience (10%)
      // Proxy: Vendors with a filled portfolio or verified badge (we'll use portfolio as a proxy here)
      const hasExperience = v.portfolioJson && v.portfolioJson.length > 2;
      if (hasExperience) score += 10;
      
      // 7. Conversion History (10%)
      // Proxy: Paid subscribers generally have higher conversion intent and history
      const highConversion = v.subscriptionPlan && v.subscriptionPlan !== "free";
      if (highConversion) score += 10;
      
      // Only create lead if score > 0 (relaxed for MVP/testing)
      if (score > 0) {
        leadsData.push({
          requirementId: newReq.id,
          vendorId: v.userId,
          matchingScore: score,
          scoreBreakdown: JSON.stringify({
            category: catMatch ? 30 : 0,
            location: (locationPreference === "Any" || v.location === locationPreference) ? 15 : 0,
            budget: (v.pricingMin <= (Number(budgetMax) || Infinity)) ? 15 : 0,
            ratings: ratings.avg >= 4.5 ? 10 : 5,
            responseTime: 10,
            experience: hasExperience ? 10 : 0,
            conversion: highConversion ? 10 : 0
          }),
          status: "new"
        });
      }
    }

    // Sort leads by score and take top 5
    leadsData.sort((a, b) => b.matchingScore - a.matchingScore);
    const topLeads = leadsData.slice(0, 5);

    if (topLeads.length > 0) {
      await prisma.lead.createMany({
        data: topLeads
      });
    }

    req.app.get("io")?.emit("dashboard_update", { source: "requirements" });

    res.json({ success: true, requirement: newReq });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to post requirement" });
  }
});

export default router;
