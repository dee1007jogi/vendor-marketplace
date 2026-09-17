import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distServerPath = path.join(__dirname, "dist", "server.js");

import(pathToFileURL(distServerPath).href);
