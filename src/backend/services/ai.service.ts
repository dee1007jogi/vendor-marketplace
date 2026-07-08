import { GoogleGenAI, Type } from "@google/genai";
import { config } from "../config";

// Initialize the client
const ai = new GoogleGenAI({ 
  apiKey: config.gemini.apiKey 
});

const MODEL = config.gemini.model;

export interface AIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  rawText?: string;
}

/**
 * Core function to call Gemini and force JSON output.
 */
async function callGeminiJSON<T>(
  systemInstruction: string,
  userPrompt: string
): Promise<AIResponse<T>> {
  try {
    const response = await ai.models.generateContent({
      model: MODEL,
      contents: [
        { role: "user", parts: [{ text: userPrompt }] },
      ],
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json", // Forces valid JSON!
        temperature: 0.2, // Low temp for deterministic business logic
      },
    });

    const rawText = response.text;
    if (!rawText) throw new Error("Empty response from Gemini");

    // Attempt to parse the JSON
    const data = JSON.parse(rawText) as T;
    return { success: true, data, rawText };
  } catch (error: any) {
    console.error("[Gemini Error]", error.message);
    // Fallback: attempt to extract JSON from markdown if parsing fails
    const match = error?.response?.text?.match(/\{.*\}/s);
    if (match) {
      try {
        return { success: true, data: JSON.parse(match[0]) };
      } catch (_) {}
    }
    return { success: false, error: error.message };
  }
}

// ------------------ EXPORTED SERVICES ------------------

/**
 * 1. PROPOSAL GENERATION
 * Replaces hardcoded 'mockOptimized'
 */
export async function generateProposalBlueprint(requirement: string, vendorDetails: string): Promise<AIResponse<any>> {
  const systemInstruction = `You are a senior proposal manager. Generate a structured project proposal blueprint in JSON.
  The output MUST strictly follow this schema:
  {
    "title": "Catchy project title",
    "executiveSummary": "2-3 sentence overview",
    "scopeOfWork": ["Deliverable 1", "Deliverable 2", "Deliverable 3"],
    "timelineWeeks": 4,
    "pricingStrategy": "Fixed price or Hourly estimate with reasoning",
    "uniqueSellingPoints": ["USP 1", "USP 2"]
  }`;

  const userPrompt = `Requirement: ${requirement}\nVendor Capabilities: ${vendorDetails}`;
  return callGeminiJSON<any>(systemInstruction, userPrompt);
}

/**
 * 2. VENDOR MATCHING (Replaces hardcoded 95%, 85%)
 */
export async function matchVendorsToRequirement(
  requirementText: string,
  vendorList: Array<{ id: string; name: string; description: string; category: string; location: string; rating: number }>
): Promise<AIResponse<Array<{ vendorId: string; matchScore: number; reasoning: string }>>> {
  
  const vendorSummaries = vendorList.map(v => 
    `ID: ${v.id}, Name: ${v.name}, Cat: ${v.category}, Loc: ${v.location}, Desc: ${v.description.slice(0, 100)}`
  ).join('\n');

  const systemInstruction = `You are an AI recruitment/matchmaking engine. Score each vendor from 0-100 based on how perfectly they fit the requirement. 
  Use strict JSON output: [{ "vendorId": "string", "matchScore": number, "reasoning": "why" }]. 
  Sort descending by matchScore. Be critical—do not give everyone 90+. 
  Consider: Industry expertise, location proximity, and service description relevance.`;

  const userPrompt = `Requirement: ${requirementText}\n\nCandidates:\n${vendorSummaries}`;
  
  return callGeminiJSON<Array<{ vendorId: string; matchScore: number; reasoning: string }>>(systemInstruction, userPrompt);
}

/**
 * 3. REQUIREMENT PARSING (Guided Posting)
 * Replaces the mocked AI matching for structured form filling.
 */
export async function parseRequirementFromText(freeText: string): Promise<AIResponse<any>> {
  const systemInstruction = `You are a smart form-filler. Extract structured data from the user's requirement description.
  Output JSON matching this schema:
  {
    "category": "Tech | Design | Marketing | Consulting | Other",
    "budgetRange": { "min": number, "max": number, "currency": "USD" },
    "timeline": "string (e.g., 'ASAP', '2 weeks', '1 month')",
    "requiredSkills": ["skill1", "skill2"],
    "locationPreference": "Remote | Onsite | Hybrid",
    "shortSummary": "1-sentence summary of the project"
  }`;

  const userPrompt = `Extract details from this requirement: "${freeText}"`;
  return callGeminiJSON<any>(systemInstruction, userPrompt);
}

/**
 * 4. COLLABORATIVE FILTERING (Similar Vendors)
 */
export async function findSimilarVendors(
  targetVendor: { name: string; category: string; location: string; services: string },
  candidateVendors: Array<{ id: string; name: string; category: string; location: string; services: string }>
): Promise<AIResponse<Array<{ vendorId: string; affinityScore: number; reasoning: string }>>> {
  
  const vendorSummaries = candidateVendors.map(v => 
    `ID: ${v.id}, Name: ${v.name}, Cat: ${v.category}, Loc: ${v.location}, Services: ${v.services}`
  ).join('\n');

  const systemInstruction = `You are a B2B matchmaking engine. Score the similarity of each candidate vendor compared to the Target Vendor on a scale of 0-100.
  Use strict JSON output: [{ "vendorId": "string", "affinityScore": number, "reasoning": "why" }]. 
  Sort descending by affinityScore.
  Consider: Overlapping categories, similar services, and geographic proximity.`;

  const userPrompt = `Target Vendor:\nName: ${targetVendor.name}, Cat: ${targetVendor.category}, Loc: ${targetVendor.location}, Services: ${targetVendor.services}\n\nCandidates:\n${vendorSummaries}`;
  
  return callGeminiJSON<Array<{ vendorId: string; affinityScore: number; reasoning: string }>>(systemInstruction, userPrompt);
}
