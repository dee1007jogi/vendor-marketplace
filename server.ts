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

import fs from "fs";
import { detectMimeAndExt } from "./src/backend/lib/upload";

// Smart Serve uploaded documents with proper Content-Type, Content-Disposition, and MIME sniffing
app.get(["/uploads/:filename", "/uploads/*"], (req, res, next) => {
  let fileParam = req.params.filename || (req.params as any)[0] || req.url.replace(/^\/uploads\/?/, "").split("?")[0];
  if (!fileParam) return next();

  // Strip query parameters
  fileParam = fileParam.split("?")[0];
  const filename = path.basename(fileParam);
  let filePath = path.join(process.cwd(), "uploads", filename);

  // Check if file exists directly or try adding extension
  if (!fs.existsSync(filePath)) {
    // Try matching if extension was omitted
    const files = fs.existsSync(path.join(process.cwd(), "uploads")) ? fs.readdirSync(path.join(process.cwd(), "uploads")) : [];
    const matched = files.find(f => f === filename || f.startsWith(filename + "."));
    if (matched) {
      filePath = path.join(process.cwd(), "uploads", matched);
    } else {
      return res.status(404).send("File not found");
    }
  }

  const reqName = (req.query.name as string) || "";
  const isDownload = req.query.download === "1" || req.query.download === "true";
  const { mime, ext } = detectMimeAndExt(filePath, reqName);

  let downloadName = reqName || path.basename(filePath);
  if (!path.extname(downloadName) && ext) {
    downloadName += ext;
  }

  res.setHeader("Content-Type", mime);
  if (isDownload) {
    res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(downloadName)}"`);
  } else {
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(downloadName)}"`);
  }

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// Fallback static serve for uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
      server: {
        middlewareMode: true,
        watch: {
          ignored: ["**/uploads/**", "**/uploads/*", "**/*.db*", "**/.git/**"],
        },
      },
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
