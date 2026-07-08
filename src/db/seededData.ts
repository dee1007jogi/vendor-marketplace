/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { PlatformState, User, VendorProfile, Requirement, Lead, Proposal, ChatMessage, Review } from "../types";

// Seeded Users List
export const seededUsers: User[] = [
  {
    id: "user-buyer-1",
    name: "Rajesh Kumar",
    email: "rajesh@venturestack.in",
    phone: "+91 98765 43210",
    role: "buyer",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2025-01-15T08:30:00Z",
  },
  {
    id: "user-buyer-2",
    name: "Priya Sharma",
    email: "priya@zenithapparel.com",
    phone: "+91 91234 56789",
    role: "buyer",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2025-02-10T11:45:00Z",
  },
  {
    id: "user-vendor-1",
    name: "Aravind Swamy",
    email: "aravind@webapex.io",
    phone: "+91 99887 76655",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2024-06-01T10:00:00Z",
  },
  {
    id: "user-vendor-2",
    name: "Meera Nair",
    email: "meera@vividcraft.design",
    phone: "+91 94433 22110",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2024-08-12T14:15:00Z",
  },
  {
    id: "user-vendor-3",
    name: "Vikram Malhotra",
    email: "vikram@apexevents.co.in",
    phone: "+91 98221 12233",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2024-09-05T09:30:00Z",
  },
  {
    id: "user-vendor-4",
    name: "Sanjay Gupta",
    email: "sanjay@cloudstream.tech",
    phone: "+91 97771 12244",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2024-11-20T16:40:00Z",
  },
  {
    id: "user-admin",
    name: "System Admin",
    email: "admin@vendimatch.ai",
    phone: "+91 80000 11111",
    role: "admin",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-vendor-5",
    name: "Devendra Soni",
    email: "devendra@niftydevs.in",
    phone: "+91 98112 23344",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2024-12-05T10:15:00Z",
  },
  {
    id: "user-vendor-6",
    name: "Ananya Sen",
    email: "ananya@growthsprout.co",
    phone: "+91 91122 33445",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2025-01-20T11:00:00Z",
  },
  {
    id: "user-vendor-7",
    name: "Rohan Deshmukh",
    email: "rohan@deccanlabs.io",
    phone: "+91 95554 43322",
    role: "vendor",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&q=80",
    verified: true,
    createdAt: "2025-02-18T09:45:00Z",
  }
];

// Seeded Vendor Profiles List
export const seededVendorProfiles: VendorProfile[] = [
  {
    userId: "user-vendor-1",
    businessName: "WebApex Technologies",
    gstNumber: "07AAAAA1111A1Z1",
    panNumber: "AAAAA1111A",
    category: "Software Development",
    categories: ["Software Development", "E-commerce Development", "Mobile App Development"],
    services: ["MERN Fullstack development", "Next.js Web Platforms", "iOS & Android Apps", "SaaS Dashboards", "API Integrations"],
    pricingModel: "fixed",
    pricingMin: 1500, // Fixed contracts usually starting here (USD or thousands INR depending on scale)
    portfolio: [
      {
        id: "port-wa-1",
        title: "FinTech Dashboard Platform",
        description: "A secure analytical dashboard for high-net-worth investments built in React + Node.js.",
        url: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80",
        type: "image",
      },
      {
        id: "port-wa-2",
        title: "Multi-vendor B2B E-commerce marketplace",
        description: "Custom bulk order commerce backend with automatic tax calculation and invoice delivery.",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        type: "image",
      }
    ],
    introVideoUrl: "https://www.w3sheets.com/media/sample-video.mp4", // placeholder sample format video
    ratings: {
      avg: 4.9,
      count: 42,
      quality: 4.9,
      timeliness: 4.8,
      communication: 5.0,
    },
    responseTime: "Within 1 hour",
    availability: "immediate",
    subscriptionPlan: "enterprise",
    location: "New Delhi, Delhi",
    coordinates: [28.6139, 77.2090],
  },
  {
    userId: "user-vendor-2",
    businessName: "VividCraft Designs",
    gstNumber: "29BBBBB2222B2Z2",
    panNumber: "BBBBB2222B",
    category: "Creative & Design",
    categories: ["Creative & Design", "UI/UX Design", "Branding & Strategy"],
    services: ["Figma UI/UX Prototypes", "Corporate Identity Solutions", "Web Design", "Mobile App UI Design", "Product Packaging"],
    pricingModel: "hourly",
    pricingMin: 45, // $45 per hour
    portfolio: [
      {
        id: "port-vc-1",
        title: "NeoBank Brand Design Redux",
        description: "A comprehensive brand strategy, aesthetic guidelines, and digital asset suite.",
        url: "https://images.unsplash.com/photo-1561070791-26c113006238?auto=format&fit=crop&w=600&q=80",
        type: "image",
      },
      {
        id: "port-vc-2",
        title: "SaaS Mobile Application Design",
        description: "High fidelity dark mode visual UI designed for complex operations.",
        url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
        type: "image",
      }
    ],
    ratings: {
      avg: 4.8,
      count: 24,
      quality: 4.8,
      timeliness: 4.7,
      communication: 4.9,
    },
    responseTime: "Within 2 hours",
    availability: "two_weeks",
    subscriptionPlan: "gold",
    location: "Bangalore, Karnataka",
    coordinates: [12.9716, 77.5946],
  },
  {
    userId: "user-vendor-3",
    businessName: "Apex B2B Event Solutions",
    gstNumber: "27CCCCC3333C3Z3",
    panNumber: "CCCCC3333C",
    category: "Event Management",
    categories: ["Event Management", "B2B Staffing", "Digital Event Hosting"],
    services: ["Exhibition Booth Fab", "B2B Vendor Coordination", "Aviation Lounge Event Organizing", "Hostess and Corporate Crew Support"],
    pricingModel: "hybrid",
    pricingMin: 2500,
    portfolio: [
      {
        id: "port-ae-1",
        title: "Global Tech Summit 2024",
        description: "Physical exhibition managing 120 booths, multi-stage lighting, and catering logistics.",
        url: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=600&q=80",
        type: "image",
      }
    ],
    ratings: {
      avg: 4.5,
      count: 15,
      quality: 4.4,
      timeliness: 4.6,
      communication: 4.5,
    },
    responseTime: "Within 4 hours",
    availability: "immediate",
    subscriptionPlan: "silver",
    location: "Mumbai, Maharashtra",
    coordinates: [19.0760, 72.8777],
  },
  {
    userId: "user-vendor-4",
    businessName: "CloudStream DevOps & SRE Specialists",
    gstNumber: "36DDDDD4444D4Z4",
    panNumber: "DDDDD4444D",
    category: "Cloud & DevOps",
    categories: ["Cloud & DevOps", "IT Infrastructure", "Cyber Security Integrations"],
    services: ["AWS Infrastructure Setup", "Kubernetes cluster setups", "Docker Containerizations", "CI/CD pipeline creations", "Database migrations"],
    pricingModel: "hourly",
    pricingMin: 60, // $60 per hour
    portfolio: [
      {
        id: "port-cs-1",
        title: "High-Availability Media Streaming Cloud Setup",
        description: "Zero downtime infrastructure architecture handling peak loads exceeding 50k requests per second during sporting events.",
        url: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80",
        type: "image",
      }
    ],
    ratings: {
      avg: 4.95,
      count: 18,
      quality: 5.0,
      timeliness: 4.9,
      communication: 4.9,
    },
    responseTime: "Within 1 hour",
    availability: "one_month",
    subscriptionPlan: "enterprise",
    location: "Hyderabad, Telangana",
    coordinates: [17.3850, 78.4867],
  },
  {
    userId: "user-vendor-5",
    businessName: "NiftyDevs Indian Studio",
    gstNumber: "07SONI9918K1Z5",
    panNumber: "SONI9918K",
    category: "Software Development",
    categories: ["Software Development", "E-commerce Development"],
    services: ["Custom Indian payment SDK modules", "Custom eCommerce apps", "MERN Stack blueprints", "Shopify custom stylesheets"],
    pricingModel: "fixed",
    pricingMin: 1200,
    portfolio: [
      {
        id: "port-nd-1",
        title: "Handicrafts Hub eCommerce",
        description: "A high-performance modern web checkout customized for rural artisans with unified UPI.",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        type: "image"
      }
    ],
    ratings: {
      avg: 5.0,
      count: 6,
      quality: 5.0,
      timeliness: 5.0,
      communication: 5.0
    },
    responseTime: "Within 1 hour",
    availability: "immediate",
    subscriptionPlan: "silver",
    location: "Gurugram, Haryana",
    coordinates: [28.4595, 77.0266]
  },
  {
    userId: "user-vendor-6",
    businessName: "GrowthSprout Performance Agency",
    gstNumber: "29ANAN8822K2Z6",
    panNumber: "ANAN8822K",
    category: "Marketing & Growth",
    categories: ["Marketing & Growth", "Branding & Strategy"],
    services: ["Digital performance campaigns", "Customer acquisition strategies", "D2C analytics setups", "SEO optimizations"],
    pricingModel: "hourly",
    pricingMin: 50,
    portfolio: [
      {
        id: "port-gs-1",
        title: "3x Direct Scaling Campaign",
        description: "Successfully scaling a sustainable cosmetic brand with targeted organic optimization and social funnel setup.",
        url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        type: "image"
      }
    ],
    ratings: {
      avg: 4.8,
      count: 12,
      quality: 4.8,
      timeliness: 4.7,
      communication: 4.9
    },
    responseTime: "Within 2 hours",
    availability: "immediate",
    subscriptionPlan: "gold",
    location: "Bengaluru, Karnataka",
    coordinates: [12.9716, 77.5946]
  },
  {
    userId: "user-vendor-7",
    businessName: "Deccan UI & Custom Design Labs",
    gstNumber: "27ROHA7733M3Z7",
    panNumber: "ROHA7733M",
    category: "Creative & Design",
    categories: ["Creative & Design", "UI/UX Design"],
    services: ["High-fidelity Figma libraries", "Dynamic user-journey boards", "Responsive dashboard wireframes", "Corporate visual languages"],
    pricingModel: "hybrid",
    pricingMin: 1800,
    portfolio: [
      {
        id: "port-dl-1",
        title: "Smart AgriTech Mobile App UI",
        description: "Designing an ultra-accessible native layout for farmers and supply chain coordinates with simple regional guides.",
        url: "https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?auto=format&fit=crop&w=600&q=80",
        type: "image"
      }
    ],
    ratings: {
      avg: 4.9,
      count: 15,
      quality: 4.9,
      timeliness: 4.8,
      communication: 5.0
    },
    responseTime: "Within 3 hours",
    availability: "two_weeks",
    subscriptionPlan: "silver",
    location: "Pune, Maharashtra",
    coordinates: [18.5204, 73.8567]
  }
];

// Seeded Buyer Requirements
export const seededRequirements: Requirement[] = [
  {
    id: "req-1",
    buyerId: "user-buyer-1",
    buyerName: "Rajesh Kumar",
    title: "E-Commerce portal for High-End Wellness Products",
    description: "We are looking for a development agency to build a premium e-commerce portal for wellness supplements and wellness services. Needs robust administrative dashboards, recurring subscription configurations, third-party payment gateways (Stripe & Razorpay), dynamic stock tracking, and customized delivery calculations.",
    category: "Software Development",
    budgetMin: 3000,
    budgetMax: 7000,
    timelineWeeks: 8,
    locationPreference: "Hybrid",
    attachments: [
      { name: "RFP_Document_WellnessCommon.pdf", url: "#", size: "1.4 MB" },
      { name: "BrandStylesLayout.png", url: "#", size: "2.1 MB" }
    ],
    status: "open",
    aiMetadata: {
      extractedKeywords: ["Wellness supplement store", "subscriptions", "Razorpay integration", "Stripe API", "stock tracking"],
      complexityLevel: "Medium",
      recommendedTimelineWeeks: 8,
      estimatedBudgetConfidence: "Confident",
      suggestedCategories: ["Software Development", "E-commerce Development"],
      skillsRequired: ["React", "Express", "Mongoose", "Stripe Checkout", "Node.js Schema design"]
    },
    createdAt: "2026-06-01T10:00:00Z"
  },
  {
    id: "req-2",
    buyerId: "user-buyer-2",
    buyerName: "Priya Sharma",
    title: "Brand Strategy, Visual Language & Web Guidelines for Fashion Label",
    description: "Looking for an agency to design a fresh, bold, high-fashion visual language and digital identity for our premium conscious-apparel business. Scope includes logo design, tone of voice documentation, packaging typography elements, premium high-fidelity Figma components, and digital styling standard guides.",
    category: "Creative & Design",
    budgetMin: 2000,
    budgetMax: 4000,
    timelineWeeks: 6,
    locationPreference: "Remote",
    attachments: [
      { name: "Zenith Apparel Brand Brief.txt", url: "#", size: "12 KB" }
    ],
    status: "open",
    aiMetadata: {
      extractedKeywords: ["Brand strategy", "Fashion identity", "Logo system", "Figma Design kit", "Conscious brand packaging"],
      complexityLevel: "Low",
      recommendedTimelineWeeks: 5,
      estimatedBudgetConfidence: "Confident",
      suggestedCategories: ["Creative & Design", "UI/UX Design"],
      skillsRequired: ["Figma Mockups", "Adobe Illustrator", "Typography planning", "Luxury Brand Strategy"]
    },
    createdAt: "2026-06-05T14:30:00Z"
  }
];

// Seeded Leads Matching Vendors to Requirements
export const seededLeads: Lead[] = [
  {
    id: "lead-1",
    requirementId: "req-1",
    vendorId: "user-vendor-1", // WebApex (Development)
    matchingScore: 94,
    scoreBreakdown: {
      categoryMatch: 100, // exact Software Development match
      locationMatch: 100, // Hybrid with New Delhi based WebApex vs New Delhi buyer Rajesh is high
      budgetMatch: 90,
      timelineMatch: 100,
      aiSkillMatch: 90
    },
    status: "new"
  },
  {
    id: "lead-2",
    requirementId: "req-1",
    vendorId: "user-vendor-4", // CloudStream (Cloud/DevOps - partially fits scale)
    matchingScore: 72,
    scoreBreakdown: {
      categoryMatch: 80, // Cloud setup is adjacent to dev
      locationMatch: 60, // Hyderabad vs Delhi (Hybrid)
      budgetMatch: 80,
      timelineMatch: 80,
      aiSkillMatch: 60
    },
    status: "viewed"
  },
  {
    id: "lead-3",
    requirementId: "req-2",
    vendorId: "user-vendor-2", // VividCraft (Design)
    matchingScore: 96,
    scoreBreakdown: {
      categoryMatch: 100, // Creative design match
      locationMatch: 100, // Remote option means full remote compatibility
      budgetMatch: 95,
      timelineMatch: 90,
      aiSkillMatch: 95
    },
    status: "proposal_submitted"
  }
];

// Seeded Proposals (Bids)
export const seededProposals: Proposal[] = [
  {
    id: "prop-1",
    leadId: "lead-3",
    requirementId: "req-2",
    vendorId: "user-vendor-2",
    vendorBusinessName: "VividCraft Designs",
    vendorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    vendorRating: 4.8,
    bidAmount: 3200,
    timelineWeeks: 5,
    coverLetter: "Greetings Priya! We would love to tackle the Zenith Apparel Visual branding transformation. VividCraft specializes in high-concept fashion digital identity. We've done extensive work styling sustainable retailers and premium D2C apparel labels. Our approach is deeply structural, mapping your sustainable core values into a sharp, visual typography kit and clean modern palettes. Our proposal includes full Figma resources and three premium packaging variants.",
    aiOptimizedProposalText: "### AI Optimized Executive Summary\n*VividCraft offers high alignment (96%) for Zenith Apparel's eco-conscious fashion mission.*\n\n**Key Strengths Applied:**\n1. Specialized apparel design workflow & premium Figma UI toolkit mapping.\n2. Rapid 5-week schedule fits right under your 6-week target limit.\n3. Bid of $3,200 fits fully within your $2,000-$4,000 budget guide.\n\n**Deliverables Matrix:**\n- Visual Branding Identity Drafts with 3 primary concepts\n- Responsive eCommerce Typography Guidelines & Figma UI components library\n- Sustainable Materials Custom Packaging Design mockup system",
    status: "pending",
    createdAt: "2026-06-06T11:00:00Z"
  }
];

// Seeded Reviews
export const seededReviews: Review[] = [
  {
    id: "rev-1",
    vendorId: "user-vendor-1",
    buyerId: "user-buyer-1",
    buyerName: "Rajesh Kumar",
    rating: 5,
    reviewText: "WebApex developed our flagship SaaS portal brilliantly. We were seeking clean code, fast loading speeds, and robust API endpoints. Their communication and documentation was top-tier. Highly recommended for full-stack Node.js requirements!",
    dimensions: {
      quality: 5,
      timeliness: 5,
      communication: 5,
      valueForMoney: 5
    },
    createdAt: "2025-05-10T12:00:00Z"
  },
  {
    id: "rev-2",
    vendorId: "user-vendor-2",
    buyerId: "user-buyer-2",
    buyerName: "Priya Sharma",
    rating: 5,
    reviewText: "Incredible aesthetic sensibilities! VividCraft turned our messy rough drafts into a highly immersive brand identity. Perfect coordination.",
    dimensions: {
      quality: 5,
      timeliness: 4,
      communication: 5,
      valueForMoney: 5
    },
    createdAt: "2025-04-18T10:15:00Z"
  }
];

// Seeded Chat messages
export const seededMessages: ChatMessage[] = [
  {
    id: "msg-1",
    requirementId: "req-2",
    senderId: "user-buyer-2",
    senderRole: "buyer",
    text: "Hi Meera, I just saw VividCraft's brand proposal for Zenith. The fashion portfolio samples are beautiful!",
    timestamp: "2026-06-06T11:30:00Z"
  },
  {
    id: "msg-2",
    requirementId: "req-2",
    senderId: "user-vendor-2",
    senderRole: "vendor",
    text: "Thank you Priya! We are absolutely thrilled about the conscious apparel concept. Sustainable luxury requires very subtle typography and high-contrast space.",
    timestamp: "2026-06-06T11:45:00Z"
  },
  {
    id: "msg-3",
    requirementId: "req-2",
    senderId: "user-buyer-2",
    senderRole: "buyer",
    text: "Do you also support coding custom Shopify stylesheets, or do you completely handoff on Figma designs?",
    timestamp: "2026-06-06T12:00:00Z"
  },
  {
    id: "msg-4",
    requirementId: "req-2",
    senderId: "user-vendor-2",
    senderRole: "vendor",
    text: "We specialize in Figma handoff, but we have a trusted partner who handles custom Shopify Theme integration perfectly, or we can assist your tech team during development! Let's schedule a brief call this Thursday to map details.",
    timestamp: "2026-06-06T12:15:00Z"
  }
];

// The starting state of our platform
export const getInitialPlatformState = (): PlatformState => ({
  users: [...seededUsers],
  vendorProfiles: [...seededVendorProfiles],
  requirements: [...seededRequirements],
  leads: [...seededLeads],
  proposals: [...seededProposals],
  messages: [...seededMessages],
  reviews: [...seededReviews]
});
