/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import http from "http";
import { Server as SocketIOServer } from "socket.io";
import { createServer as createViteServer } from "vite";
import { prisma } from "./src/backend/prisma";
import { initializeChatSocket } from "./src/backend/sockets/ChatHandler";

// Import Routers
import authRouter from "./src/backend/routes/auth";
import stateRouter from "./src/backend/routes/state";
import paymentsRouter from "./src/backend/routes/payments";
import notificationsRouter from "./src/backend/routes/notifications";
import vendorsRouter from "./src/backend/routes/vendors";
import requirementsRouter from "./src/backend/routes/requirements";
import proposalsRouter from "./src/backend/routes/proposals";
import chatsRouter from "./src/backend/routes/chats";
import adminRouter from "./src/backend/routes/admin";
import publicRouter from "./src/backend/routes/public";
import dashboardsRouter from "./src/backend/routes/dashboards";
import buyerRouter from "./src/backend/routes/buyer";
import verificationRouter from "./src/backend/routes/verification";

// Setup express app
const app = express();
const httpServer = http.createServer(app);
const io = new SocketIOServer(httpServer, { cors: { origin: "*" } });

// Initialize real-time chat
initializeChatSocket(io);

const PORT = 3000;

// 1. Raw body for Stripe Webhook (must be parsed before express.json)
app.use("/api/payments/webhook", express.raw({ type: "application/json" }));

// 2. JSON parsing for all other routes
app.use(express.json());

// Attach io to express app to emit events from routes
app.set("io", io);

import { errorHandler } from "./src/backend/middlewares/errorHandler";

// Mount Modular API Routes
app.use("/api/state", stateRouter);
app.use("/api/auth", authRouter);
app.use("/api/payments", paymentsRouter);
app.use("/api/notifications", notificationsRouter);
app.use("/api/vendors", vendorsRouter);
app.use("/api/requirements", requirementsRouter);
app.use("/api/proposals", proposalsRouter);
app.use("/api/chats", chatsRouter);
app.use("/api/admin/v1", adminRouter);
app.use("/api/public", publicRouter);
app.use("/api/dashboards", dashboardsRouter);
app.use("/api/buyer", buyerRouter);
app.use("/api/user/verification", verificationRouter);

// Global Error Handler
app.use(errorHandler as express.ErrorRequestHandler);

// Integrate Vite Middleware for asset piping during development, static serve for prod
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, () => {
    console.log(`[Vendimatch] AI-Powered B2B Marketplace running at http://localhost:${PORT}`);
  });
}

startServer();
