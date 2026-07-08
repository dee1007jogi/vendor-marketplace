# Backend Analysis & Pending Tasks

Based on a review of your project's backend structure (Express, Prisma, SQLite), I have identified several key areas that need to be worked on to take this MVP to production readiness.

## 1. Security & Authentication
> [!WARNING]
> Currently, many routes (e.g., `/api/buyer/requirements`, `/api/vendors/profile`) accept `userId` or `buyerId` directly via the request body or query parameters. This allows any user to impersonate another simply by providing a different ID.

- **Implement Auth Middleware**: Create a middleware that verifies the JWT token (issued in `auth.ts`), extracts the user ID, and attaches `req.user` to the request object.
- **Implement RBAC (Role-Based Access Control)**: Ensure that buyers can only access buyer-specific routes, vendors can only access vendor routes, and admins have proper elevated access.

## 2. Input Validation
- **Zod Middleware**: You have `zod` installed in `package.json`, but the route handlers are not currently using it to validate incoming request bodies. Implementing Zod validation middlewares will prevent malformed data from reaching the database and causing Prisma errors.

## 3. Replace Mock Implementations
> [!NOTE]
> There are several endpoints that contain mock logic which need to be connected to the actual services.

- **Payments (`/api/payments/checkout`)**: Needs to be fully integrated with the Razorpay or Stripe services rather than relying on the `mock_tx_...` gateway ID logic.
- **AI Service (`/api/requirements/post`)**: Mentions mocked AI matching. It needs to be properly hooked up to your `ai.service.ts` logic.
- **Notifications**: Triggering of actual notifications (Email/SMS/Push) instead of the `/mock-trigger` helper route.

## 4. Global Error Handling
- **Centralized Error Handler**: Replace repetitive `try-catch` blocks that just return `res.status(500).json({ error: '...' })` with a global Express error handler (`app.use((err, req, res, next) => { ... })`). This will make debugging easier and ensure consistent error responses to the frontend.

## 5. File Uploads & Cloud Storage
- **Move to Cloud Storage**: The project uses `multer` for handling attachments (e.g., in `proposals.ts`). Currently, files are stored locally. This needs to be hooked up to AWS S3, Cloudinary, or Google Cloud Storage to ensure files are accessible across different server instances in production.

## 6. Performance & Pagination
> [!TIP]
> Always paginate large data sets to ensure fast load times as the application scales.

- **Pagination**: Endpoints like `/api/vendors/search` or `/api/buyer/projects` use `findMany` without limits. Implement cursor-based or offset-based pagination.
- **Background Jobs**: For heavy actions (like generating AI proposals or sending batch emails), offload the work using a queue like **BullMQ** (since you already have Redis installed) rather than blocking the main HTTP thread.

## 7. WebSockets & Real-time
- **Secure Socket Connections**: Ensure the socket implementation (`ChatHandler.ts`) authenticates users before allowing them to join chat rooms, otherwise, unauthorized users could sniff websocket events.
