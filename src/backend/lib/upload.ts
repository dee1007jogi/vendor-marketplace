import multer from "multer";
import path from "path";
import fs from "fs";

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer disk storage configuration that preserves original file extensions
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || "";
    const sanitizedBase = path
      .basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9_-]/g, "_")
      .slice(0, 35);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const finalName = `${sanitizedBase || "doc"}-${uniqueSuffix}${ext}`;
    cb(null, finalName);
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max file size
  },
});

/**
 * Normalizes a stored file path to a forward-slash web URL
 * e.g. "uploads\\foo.png" -> "/uploads/foo.png"
 */
export function normalizeUploadUrl(filePath?: string | null): string | null {
  if (!filePath) return null;
  if (filePath.startsWith("http://") || filePath.startsWith("https://") || filePath.startsWith("blob:")) {
    return filePath;
  }
  const clean = filePath.replace(/\\/g, "/").replace(/^\/?/, "");
  return `/${clean}`;
}

/**
 * Sniff file header / extension to determine proper MIME type
 */
export function detectMimeAndExt(filePath: string, originalName?: string): { mime: string; ext: string } {
  const ext =
    path.extname(filePath).toLowerCase() ||
    (originalName ? path.extname(originalName).toLowerCase() : "");

  if (ext === ".png") return { mime: "image/png", ext: ".png" };
  if (ext === ".jpg" || ext === ".jpeg") return { mime: "image/jpeg", ext: ".jpg" };
  if (ext === ".pdf") return { mime: "application/pdf", ext: ".pdf" };
  if (ext === ".webp") return { mime: "image/webp", ext: ".webp" };
  if (ext === ".gif") return { mime: "image/gif", ext: ".gif" };
  if (ext === ".svg") return { mime: "image/svg+xml", ext: ".svg" };
  if (ext === ".mp4") return { mime: "video/mp4", ext: ".mp4" };
  if (ext === ".webm") return { mime: "video/webm", ext: ".webm" };
  if (ext === ".doc") return { mime: "application/msword", ext: ".doc" };
  if (ext === ".docx") return { mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", ext: ".docx" };

  // Magic bytes sniffing fallback
  try {
    if (fs.existsSync(filePath)) {
      const fd = fs.openSync(filePath, "r");
      const buffer = Buffer.alloc(16);
      fs.readSync(fd, buffer, 0, 16, 0);
      fs.closeSync(fd);

      if (buffer.length >= 4 && buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
        return { mime: "image/png", ext: ".png" };
      }
      if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
        return { mime: "image/jpeg", ext: ".jpg" };
      }
      if (buffer.length >= 4 && buffer.slice(0, 4).toString() === "%PDF") {
        return { mime: "application/pdf", ext: ".pdf" };
      }
      if (buffer.length >= 4 && buffer.slice(0, 4).toString() === "GIF8") {
        return { mime: "image/gif", ext: ".gif" };
      }
      if (buffer.length >= 12 && buffer.slice(8, 12).toString() === "WEBP") {
        return { mime: "image/webp", ext: ".webp" };
      }
      if (buffer.length >= 8 && buffer.slice(4, 8).toString() === "ftyp") {
        return { mime: "video/mp4", ext: ".mp4" };
      }
    }
  } catch (e) {
    // Ignore error
  }

  return { mime: "application/octet-stream", ext: "" };
}
