import { Router } from "express";
import { prisma } from "../prisma";
import { GoogleGenAI } from "@google/genai";

const router = Router();

// GET /api/chats/conversations?userId=...
router.get("/conversations", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: "Missing userId" });

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { buyerId: String(userId) },
          { vendorId: String(userId) }
        ]
      },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1
        },
        requirement: {
          select: { title: true }
        }
      },
      orderBy: { updatedAt: 'desc' }
    });
    res.json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/chats/conversations/:id/messages
router.get("/conversations/:id/messages", async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      where: { conversationId: req.params.id },
      orderBy: { createdAt: 'asc' },
      include: { sender: { select: { id: true, name: true, role: true } } }
    });
    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/chats/conversations/:id/messages (REST fallback)
router.post("/conversations/:id/messages", async (req, res) => {
  const { senderId, content, messageType, fileUrl } = req.body;
  try {
    const newMsg = await prisma.message.create({
      data: {
        conversationId: req.params.id,
        senderId,
        content,
        messageType: messageType || "text",
        fileUrl
      }
    });
    // Update conversation updatedAt
    await prisma.conversation.update({
      where: { id: req.params.id },
      data: { updatedAt: new Date() }
    });
    res.json({ success: true, message: newMsg });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// AI Assist
function getAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") return null;
  return new GoogleGenAI({ apiKey });
}

router.post("/ai-assist", async (req, res) => {
  const { messages, currentPersonaType } = req.body;
  const ai = getAI();

  if (!ai) {
    const textOptions = [
      "I appreciate your question! Let's schedule a call to discuss details.",
      "That falls perfectly within our capability spectrum!",
      "Could you clarify the daily capacity requirements?"
    ];
    return res.json({ response: textOptions[Math.floor(Math.random() * textOptions.length)] });
  }

  try {
    const threadContext = messages.map((m: any) => `${m.role === currentPersonaType ? "YOU" : "PARTNER"}: ${m.text}`).join("\n");
    const prompt = `You are a professional business advisor and communications strategist training a platform user to land a commercial agreement.\nThe user is participating as a "${currentPersonaType}".\n\nHistory:\n${threadContext}\n\nTask: Write a single strategic message the user can send next. Return pure text.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: { temperature: 0.7 }
    });
    res.json({ response: response.text?.trim() || "Let's connect this session to our technical consultants to verify the exact specifications!" });
  } catch (error: any) {
    res.json({ response: "Would love to discuss these technical challenges during our planned discovery layout next Tuesday." });
  }
});

export default router;
