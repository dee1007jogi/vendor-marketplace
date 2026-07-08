/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// User roles definition
export type UserRole = "buyer" | "vendor" | "admin";

// Verification documents model
export interface VerificationDocs {
  businessName?: string;
  registrationNumber?: string;
  
  // CoS (Certificate of Incorporation / Status)
  cosFileName?: string;
  cosFileUrl?: string;
  cosStatus?: "pending" | "approved" | "rejected";
  cosUploadedAt?: string;

  // GST State
  gstNumber?: string;
  gstFileName?: string;
  gstFileUrl?: string;
  gstStatus?: "pending" | "approved" | "rejected";
  gstUploadedAt?: string;

  // PAN State
  panNumber?: string;
  panFileName?: string;
  panFileUrl?: string;
  panStatus?: "pending" | "approved" | "rejected";
  panUploadedAt?: string;

  // Aadhaar State
  aadhaarNumber?: string;
  aadhaarFileName?: string;
  aadhaarFileUrl?: string;
  aadhaarStatus?: "pending" | "approved" | "rejected";
  aadhaarUploadedAt?: string;

  rejectReason?: string;
  submittedAt?: string;
}

// User base interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  verified: boolean;
  verificationDocs?: VerificationDocs;
  vendorProfile?: VendorProfile;
  createdAt: string;
}

// Portfolio item model
export interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  url: string;
  type: "image" | "video" | "document" | "link";
  thumbnail?: string;
}

// Vendor Profile Details
export interface VendorProfile {
  userId: string;
  businessName: string;
  gstNumber?: string;
  panNumber?: string;
  category: string; // Primay category
  categories: string[]; // Secondary categories
  services: string[];
  servicesJson?: string;
  pricingModel: "hourly" | "fixed" | "retainer" | "hybrid";
  pricingMin: number;
  portfolio: PortfolioItem[];
  introVideoUrl?: string;
  ratings: {
    avg: number;
    count: number;
    quality: number;
    timeliness: number;
    communication: number;
  };
  responseTime: string; // e.g. "Within 2 hours"
  availability: "immediate" | "two_weeks" | "one_month" | "unavailable";
  subscriptionPlan: "free" | "silver" | "gold" | "enterprise";
  location: string;
  coordinates: [number, number]; // [lat, lng]
  leadCredits?: number;
}

// Extracted AI RFP analysis metadata
export interface AIMetadata {
  extractedKeywords: string[];
  complexityLevel: "Low" | "Medium" | "High";
  recommendedTimelineWeeks: number;
  estimatedBudgetConfidence: "Confident" | "Variable" | "Incomplete_Data";
  suggestedCategories: string[];
  skillsRequired: string[];
}

// Buyer's Posted Requirement
export interface Requirement {
  id: string;
  buyerId: string;
  buyerName: string;
  title: string;
  description: string;
  category: string;
  budgetMin: number;
  budgetMax: number;
  timelineWeeks: number;
  locationPreference: string; // "Local" | "Remote" | "Hybrid" | Specific Location
  attachments: { name: string; url: string; size: string }[];
  status: "open" | "matched" | "closed";
  aiMetadata?: AIMetadata;
  createdAt: string;
}

// Lead generated for a vendor corresponding to a requirement
export interface Lead {
  id: string;
  requirementId: string;
  vendorId: string;
  matchingScore: number; // calculated overall matching score (0-100)
  scoreBreakdown: {
    categoryMatch: number; // weight 30%
    locationMatch: number; // weight 15%
    budgetMatch: number; // weight 25%
    timelineMatch: number; // weight 10%
    aiSkillMatch: number; // weight 20%
  };
  status: "new" | "viewed" | "accepted" | "declined" | "proposal_submitted";
  viewedAt?: string;
  respondedAt?: string;
}

// Vendor proposal submitted for a requirement/lead
export interface Proposal {
  id: string;
  leadId: string;
  requirementId: string;
  vendorId: string;
  vendorBusinessName: string;
  vendorAvatar: string;
  vendorRating: number;
  bidAmount: number;
  timelineWeeks: number;
  coverLetter: string;
  aiOptimizedProposalText?: string; // Generated with Gemini API
  status: "pending" | "shortlisted" | "accepted" | "declined";
  createdAt: string;
}

// Real-time Chat message
export interface ChatMessage {
  id: string;
  requirementId: string;
  senderId: string;
  senderRole: UserRole;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    url: string;
    type: "image" | "document" | "link";
  };
}

// Chat Session Metadata
export interface ChatSession {
  requirementId: string;
  requirementTitle: string;
  partnerId: string;
  partnerName: string;
  partnerAvatar: string;
  partnerBusinessName?: string;
  lastMessageText: string;
  lastMessageTime: string;
}

// Vendor Review
export interface Review {
  id: string;
  vendorId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  reviewText: string;
  dimensions: {
    quality: number;
    timeliness: number;
    communication: number;
    valueForMoney: number;
  };
  createdAt: string;
}

// Full Platform state representation for easy syncing or DB usage
export interface PlatformState {
  users: User[];
  vendorProfiles: VendorProfile[];
  requirements: Requirement[];
  leads: Lead[];
  proposals: Proposal[];
  messages: ChatMessage[];
  reviews: Review[];
  settings?: Record<string, any>;
}
