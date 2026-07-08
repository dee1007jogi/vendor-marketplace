import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({
      error: "Validation failed",
      details: err.errors,
    });
  }

  // Handle Prisma errors generically if needed
  if (err.code && err.code.startsWith("P2")) {
    return res.status(400).json({ error: "Database operation failed. Invalid data or constraint violation." });
  }

  return res.status(500).json({ error: "Internal server error" });
};
