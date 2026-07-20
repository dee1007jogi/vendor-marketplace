# Vendimatch Technology Stack

Below is a detailed breakdown of all the tools, libraries, and frameworks powering your application, categorized by Frontend, Backend, and External Services.

---

## 🎨 Frontend Stack (Client-side)

**Core Framework & Build Tool:**
- **React (v19)**: The core UI library used to build the interface.
- **Vite**: The blazing-fast frontend build tool and development server.
- **React Router DOM**: Handles navigation and routing between pages without reloading.

**Styling & UI Components:**
- **Tailwind CSS (v4)**: Utility-first CSS framework for rapid styling.
- **Lucide React**: The icon library used throughout the application.
- **clsx, tailwind-merge, class-variance-authority**: Utilities used for building dynamic, reusable UI components (similar to the shadcn/ui pattern).
- **Motion (Framer Motion)**: Used for smooth UI animations and page transitions.
- **Lenis**: Provides smooth scrolling effects on long pages.

**Data Management & Forms:**
- **React Hook Form**: Manages complex form states (like posting requirements).
- **Zod**: Schema validation (ensures users fill out forms correctly before submitting).
- **@hookform/resolvers**: Bridges Zod validation with React Hook Form.

**Data Display:**
- **Recharts**: Powers the data visualization charts (like revenue charts in the admin dashboard).
- **@tanstack/react-table**: Advanced data tables used for the admin dashboard and vendor lists.
- **@tanstack/react-virtual**: Optimizes rendering for long lists of items.

**Other Utilities:**
- **Socket.io-client**: Connects to the backend for real-time live chat.
- **React Helmet Async**: Manages the `<head>` of the document dynamically for SEO (Title tags, meta descriptions).

---

## ⚙️ Backend Stack (Server-side)

**Core Environment & Framework:**
- **Node.js**: The Javascript runtime environment running the server.
- **Express**: The robust web framework handling API routing (`/api/*`).
- **esbuild / tsx**: Used to compile the TypeScript server code into plain JavaScript for production (`dist/server.js`).

**Database & ORM:**
- **Prisma**: The Object-Relational Mapper (ORM) used to interact with the database using TypeScript instead of raw SQL.
- **SQLite**: The current database configured in your Prisma schema. (Note: For production, this is usually swapped to PostgreSQL or MySQL).

**Authentication & Security:**
- **JSONWebToken (JWT)**: Used to generate secure tokens to verify logged-in buyers, vendors, and admins.
- **Bcrypt / Bcryptjs**: Used to securely hash and verify user passwords before saving them to the database.

**Real-time & Communication:**
- **Socket.io**: The websocket server enabling real-time chat between buyers and vendors.

**Utilities:**
- **Multer**: Middleware used for handling multipart/form-data (when users upload files/attachments).
- **Zod**: Also used on the backend to validate incoming API request bodies.
- **Axios**: Used by the backend to make HTTP requests to other external services if needed.

---

## 🔌 External Services You Need to Connect

To make the app fully functional in production, you will need to set up accounts for the following services and plug their API keys into your `.env` (or Hostinger Environment Variables).

### 1. Payments & Escrow
You have both Stripe and Razorpay SDKs installed. You only need to configure the one you intend to use (or both if you offer regional options).
- **Stripe**: Needs `STRIPE_SECRET_KEY` and webhook secrets. Used for subscriptions or escrow payments.
- **Razorpay**: Needs `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`. Popular alternative for Indian markets.

### 2. Artificial Intelligence (AI)
- **Google Gemini (@google/genai)**: The AI service used to parse buyer requirements and optimize vendor proposals. You will need a **Google AI API Key** to connect this.

### 3. Email & SMS Notifications
- **SendGrid**: Used for sending transactional emails (like OTPs, welcome emails, or "You have a new quote!" alerts). Needs a `SENDGRID_API_KEY`.
- **Twilio**: Used for sending SMS alerts and WhatsApp notifications. Needs a `TWILIO_ACCOUNT_SID` and `TWILIO_AUTH_TOKEN`.

### 4. Push Notifications & Auth Add-ons
- **Firebase Admin**: Used for sending push notifications to mobile devices or web browsers. You will need a Firebase Service Account JSON file/keys.

### 5. Caching & Background Jobs
- **Redis (ioredis)**: Used for caching heavy queries or managing background queues (like BullMQ). While SQLite runs locally, Redis requires an actual Redis server (either hosted on Hostinger, AWS ElastiCache, or Upstash). You will need a `REDIS_URL`.

### 6. Cloud Storage (For File Uploads)
- Currently, `multer` saves files locally. If you deploy on Hostinger/Vercel/Heroku, local files are deleted when the server restarts. You will need to connect **AWS S3**, **Cloudinary**, or **Google Cloud Storage** to permanently store user uploaded files (like PDFs and profile avatars).
