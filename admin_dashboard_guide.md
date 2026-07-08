# VendiMatch: Admin Dashboard Complete Walkthrough

Welcome to the VendiMatch Admin Command Center! This dashboard provides you with the ultimate control over the marketplace, ensuring quality, security, and smooth operations across all buyers and vendors.

Below is a detailed breakdown of how the Admin Dashboard is structured and how to use its various features.

---

## 1. Dashboard (Command Center Overview)
The main landing page gives you a bird's-eye view of the platform's health and active alerts.
- **Key Metrics**: See total users (buyers/vendors), total active projects, and marketplace revenue.
- **Alerts Feed**: Monitor incoming real-time notifications about things requiring immediate attention (e.g., new vendors requiring verification or disputes being raised).

## 2. Verification Queue
Quality control is paramount. The Verification Queue is heavily augmented by AI to streamline the onboarding process.
- **AI-Powered Scanning**: Google GenAI automatically scans uploaded business documents, checking for inconsistencies and flagging high-risk vendors.
- **Review & Decide**: Admins can see the AI's risk score and extracted text, then manually click **Approve** or **Reject**.
- **Bulk Actions**: Select multiple low-risk, verified vendors to approve them all at once.

## 3. Vendors & Buyers (User Management)
Full CRM capabilities for all platform participants.
- **Vendor Management**: View vendor profiles, adjust their subscription tiers, suspend accounts, or manually update their AI matching tags if the system categorized them incorrectly.
- **Buyer Management**: Track buyer spending, active RFPs, and manage account limits.

## 4. Moderation & Disputes
When things don't go according to plan, the admin steps in.
- **Disputes**: When a buyer and vendor disagree on a milestone or project delivery, they can raise a dispute. Admins can view the chat logs, downloaded delivery files, and escrow amounts, and make a final binding ruling (releasing funds to the vendor or refunding the buyer).
- **Fraud Alerts**: AI monitors chat messages and proposals for off-platform payment attempts or phishing links, surfacing suspicious activity here for admin review.

## 5. Transactions & Revenue
Financial oversight and platform monetization.
- **Escrow Ledger**: Track all money currently held in escrow across all active projects.
- **Payouts**: Approve and process withdrawal requests from vendors to their bank accounts.
- **Revenue Analytics**: Track VendiMatch's earnings through subscription plans and project commission fees.

## 6. AI Matching Logs & Settings
Fine-tune the platform's brain.
- **Matching Logs**: If a buyer complains they aren't getting good vendor recommendations, you can audit the AI Matching Logs to see exactly why the algorithm scored specific vendors the way it did for a given RFP, and adjust weights if necessary.
- **Notification Templates**: Customize the exact text sent via email or WebSocket when a vendor is approved or a quote is accepted.
- **System Audit Log**: A tamper-proof history of every action taken by any admin on the dashboard, ensuring internal accountability.

---

> [!CAUTION]
> **Important:** Actions taken in the **Verification Queue** and **Disputes** tabs directly impact real users and their finances. Always double-check AI recommendations before executing a final approval or releasing escrow funds!
