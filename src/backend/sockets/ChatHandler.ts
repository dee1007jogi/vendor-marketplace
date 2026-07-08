import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";
import { notificationService } from "../services/NotificationService";

export function initializeChatSocket(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`[Socket] User connected: ${socket.id}`);

    // Join a specific conversation room
    socket.on("join:chat", ({ conversationId }) => {
      socket.join(`chat_${conversationId}`);
      console.log(`[Socket] User joined room: chat_${conversationId}`);
    });

    // Admin notifications room
    socket.on("join:admin", () => {
      socket.join("admin:notifications");
      console.log(`[Socket] Admin joined room: admin:notifications`);
    });

    // Send message
    socket.on("send:message", async (data) => {
      const { conversationId, senderId, messageType, content, fileUrl } = data;
      try {
        const message = await prisma.message.create({
          data: {
            conversationId,
            senderId,
            messageType: messageType || "text",
            content,
            fileUrl
          },
          include: { sender: { select: { id: true, name: true, role: true } } }
        });

        const conversation = await prisma.conversation.findUnique({
          where: { id: conversationId },
          select: { buyerId: true, vendorId: true }
        });

        // Broadcast to room
        io.to(`chat_${conversationId}`).emit("message:new", message);

        // Dispatch notification if the recipient is not actively in the room (Simulated here)
        if (conversation) {
          const recipientId = senderId === conversation.buyerId ? conversation.vendorId : conversation.buyerId;
          await notificationService.dispatch("message_new", recipientId, {
            senderName: message.sender.name,
            textPreview: content ? content.substring(0, 50) + "..." : "Sent an attachment",
            conversationId
          });
        }
      } catch (err) {
        console.error("[Socket] Error sending message:", err);
      }
    });

    // Typing indicators
    socket.on("typing:start", ({ conversationId, userName }) => {
      socket.to(`chat_${conversationId}`).emit("typing:indicator", { userName, isTyping: true });
    });

    socket.on("typing:end", ({ conversationId }) => {
      socket.to(`chat_${conversationId}`).emit("typing:indicator", { isTyping: false });
    });

    // Read receipt
    socket.on("message:read", async ({ messageId, conversationId, userId }) => {
      await prisma.message.update({ where: { id: messageId }, data: { isRead: true } });
      socket.to(`chat_${conversationId}`).emit("read:receipt", { messageId, userId });
    });

    socket.on("disconnect", () => {
      console.log(`[Socket] User disconnected: ${socket.id}`);
    });
  });
}
