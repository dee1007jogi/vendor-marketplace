/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, Suspense, lazy } from "react";
import { Routes, Route, useNavigate, useLocation, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { ReactLenis } from 'lenis/react';
import { User, PlatformState, VendorProfile, Requirement } from "./types";
import { getInitialPlatformState } from "./db/seededData";

// Import Views (We'll stub the new layouts and keep existing views mapped for now)
import Header from "./components/Header";
import Footer from "./components/Footer";
const LandingPage = lazy(() => import("./views/LandingPage"));
const VendorDiscovery = lazy(() => import("./views/VendorDiscovery"));
const VendorProfileView = lazy(() => import("./views/VendorProfile"));
const PostRequirement = lazy(() => import("./views/buyer/PostRequirement"));
const QuoteComparison = lazy(() => import("./views/buyer/QuoteComparison"));
const CompareVendors = lazy(() => import("./views/CompareVendors"));
const SeoCategoryPage = lazy(() => import("./views/SeoCategoryPage"));
const PricingPage = lazy(() => import("./views/PricingPage"));
const DesignSystem = lazy(() => import("./views/DesignSystem"));
const BuyerLayout = lazy(() => import("./views/buyer/BuyerLayout"));
const BuyerOverview = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerOverview })));
const BuyerRequirements = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerRequirements })));
const BuyerShortlist = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerShortlist })));
const BuyerProjects = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerProjects })));
const BuyerPayments = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerPayments })));
const BuyerSettings = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerSettings })));
const BuyerReviews = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerReviews })));
const BuyerDisputes = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerDisputes })));
const BuyerSavedSearches = lazy(() => import("./views/buyer/BuyerModules").then(m => ({ default: m.BuyerSavedSearches })));
const VendorLayout = lazy(() => import("./views/vendor/VendorLayout"));
const VendorOverview = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorOverview })));
const VendorLeads = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorLeads })));
const VendorQuotes = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorQuotes })));
const VendorProjects = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorProjects })));
const VendorPortfolio = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorPortfolio })));
const VendorAnalytics = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorAnalytics })));
const VendorWallet = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorWallet })));
const VendorSettings = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorSettings })));
const VendorServiceOfferings = lazy(() => import("./views/vendor/VendorModules").then(m => ({ default: m.VendorServiceOfferings })));
const ChatInbox = lazy(() => import("./views/ChatInbox"));
const AdminLayout = lazy(() => import("./views/admin/AdminLayout"));

const AdminDashboard = lazy(() => import("./views/admin").then(m => ({ default: m.AdminDashboard })));
const VerificationQueue = lazy(() => import("./views/admin").then(m => ({ default: m.VerificationQueue })));
const AdminDisputes = lazy(() => import("./views/admin").then(m => ({ default: m.DisputeResolution })));
const AdminSettings = lazy(() => import("./views/admin").then(m => ({ default: m.PlatformSettings })));
const AdminVendors = lazy(() => import("./views/admin").then(m => ({ default: m.AdminVendors })));
const AdminBuyers = lazy(() => import("./views/admin").then(m => ({ default: m.AdminBuyers })));
const AdminCategories = lazy(() => import("./views/admin").then(m => ({ default: m.AdminCategories })));
const AdminTransactions = lazy(() => import("./views/admin").then(m => ({ default: m.AdminTransactions })));
const AdminProfile = lazy(() => import("./views/admin").then(m => ({ default: m.AdminProfile })));

const AdminFraud = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminFraud })));
const AdminModeration = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminModeration })));
const AdminRevenue = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminRevenue })));
const AdminAnalytics = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminAnalytics })));
const AdminMatchingLogs = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminMatchingLogs })));
const AdminNotificationTemplates = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminNotificationTemplates })));
const AdminSubscriptionPlans = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminSubscriptionPlans })));
const AdminAuditLog = lazy(() => import("./views/admin/AdminModules").then(m => ({ default: m.AdminAuditLog })));

function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-[50vh] w-full">
      <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-sm font-semibold text-slate-500">Loading module...</p>
    </div>
  );
}
import RegisterModal from "./components/RegisterModal";
import LoginModal from "./components/LoginModal";
import ForgotPasswordModal from "./components/ForgotPasswordModal";
import SupportWidget from "./components/SupportWidget";

import { useRealTimeUpdates } from "./hooks/useRealTimeUpdates";

export default function App() {
  useRealTimeUpdates();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [dbState, setDbState] = useState<PlatformState | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRegisterOpen, setIsRegisterOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isForgotOpen, setIsForgotOpen] = useState<boolean>(false);
  const [initialChatReqId, setInitialChatReqId] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();

  const reloadState = async () => {
    try {
      const response = await fetch("/api/state");
      if (!response.ok) throw new Error("Failed to sync database state");
      const stateObj = await response.json();
      setDbState(stateObj);
      
      if (currentUser) {
        const refreshedSelf = stateObj.users.find((u: User) => u.id === currentUser.id);
        if (refreshedSelf) setCurrentUser(refreshedSelf);
      } else {
        const savedUserId = localStorage.getItem("vendorMatchUserId");
        if (savedUserId) {
          const u = stateObj.users.find((u: User) => u.id === savedUserId);
          if (u) setCurrentUser(u);
        } else {
          // We are truly a guest! No fallback.
          setCurrentUser(null);
        }
      }
    } catch (err) {
      console.error("Boot state fetch error, falling back to local data:", err);
      const fallbackState = getInitialPlatformState();
      setDbState(fallbackState);
      
      if (currentUser) {
        const refreshedSelf = fallbackState.users.find((u: User) => u.id === currentUser.id);
        if (refreshedSelf) setCurrentUser(refreshedSelf);
      } else {
        const savedUserId = localStorage.getItem("vendorMatchUserId");
        if (savedUserId) {
          const u = fallbackState.users.find((u: User) => u.id === savedUserId);
          if (u) setCurrentUser(u);
        } else {
          setCurrentUser(null);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reloadState();
  }, []);

  const handleSwitchUser = useCallback(async (userId: string) => {
    if (!dbState) return;
    const targetUser = dbState.users.find(u => u.id === userId);
    if (targetUser) {
      setCurrentUser(targetUser);
      localStorage.setItem("vendorMatchUserId", targetUser.id);
      if (targetUser.role.toLowerCase() === "buyer") navigate("/buyer/dashboard");
      else if (targetUser.role.toLowerCase() === "vendor") navigate("/vendor/dashboard");
      else navigate("/admin/dashboard");
    }
  }, [dbState, navigate]);

  const handleRegisterUser = async (regForm: any) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(regForm)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to register user");
      }
      const data = await response.json();
      await reloadState();
      setCurrentUser(data.user);
      localStorage.setItem("vendorMatchUserId", data.user.id);
      localStorage.setItem("vendorMatchToken", data.token);
      
      if (data.user.role.toLowerCase() === "buyer") navigate("/buyer/dashboard");
      else navigate("/vendor/dashboard");
      return data.user;
    } catch (err: any) {
      throw err;
    }
  };

  const handleLoginUser = async (data: any, method: "email" | "otp" | "social") => {
    const endpoint = method === "email" ? "/api/auth/login" : "/api/auth/otp/verify";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to login");
    }
    const resData = await response.json();
    setCurrentUser(resData.user);
    localStorage.setItem("vendorMatchUserId", resData.user.id);
    localStorage.setItem("vendorMatchToken", resData.token);
    
    if (resData.user.role.toLowerCase() === "buyer") navigate("/buyer/dashboard");
    else if (resData.user.role.toLowerCase() === "vendor") navigate("/vendor/dashboard");
    else navigate("/admin/dashboard");
  };

  const handleLoginOtpRequest = async (phone: string) => {
    const response = await fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to send OTP");
    }
    return true;
  };

  const handleForgotRequest = async (identifier: string) => {
    const response = await fetch("/api/auth/forgot-password/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier })
    });
    if (!response.ok) throw new Error((await response.json()).error);
    return true;
  };

  const handleForgotVerify = async (identifier: string, otp: string) => {
    const response = await fetch("/api/auth/forgot-password/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, otp })
    });
    if (!response.ok) throw new Error((await response.json()).error);
    return await response.json();
  };

  const handleForgotReset = async (resetToken: string, newPassword: string) => {
    const response = await fetch("/api/auth/forgot-password/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resetToken, newPassword })
    });
    if (!response.ok) throw new Error((await response.json()).error);
  };

  const handleResetDb = useCallback(async () => {
    if (!window.confirm("Restore platform to its clean pre-seeded starting configurations?")) return;
    setLoading(true);
    try {
      const response = await fetch("/api/state/reset", { method: "POST" });
      if (!response.ok) throw new Error("Reset failed");
      const data = await response.json();
      setDbState(data.state);
      
      const defaultBuyer = data.state.users.find((u: User) => u.id === "user-buyer-1") || data.state.users[0];
      setCurrentUser(defaultBuyer);
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  // Mocking the activeTab for the Header
  const getActiveTab = () => {
    if (location.pathname === "/") return "home";
    if (location.pathname.startsWith("/vendors")) return "discover";
    if (location.pathname.startsWith("/buyer")) return "buyer-dashboard";
    if (location.pathname.startsWith("/vendor")) return "vendor-dashboard";
    if (location.pathname.startsWith("/admin")) return "admin";
    if (location.pathname.startsWith("/chats")) return "chats";
    return "discover";
  };

  const handleSetActiveTab = useCallback((tab: string) => {
    if (tab === "home") navigate("/");
    if (tab === "discover") navigate("/vendors");
    if (tab === "buyer-dashboard") navigate("/buyer/dashboard");
    if (tab === "vendor-dashboard") navigate("/vendor/dashboard");
    if (tab === "admin") navigate("/admin/dashboard");
    if (tab === "chats") navigate("/chats");
  }, [navigate]);

  const handleOpenRegister = useCallback(() => setIsRegisterOpen(true), []);
  const handleOpenLogin = useCallback(() => setIsLoginOpen(true), []);

  if (loading || !dbState) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center space-y-3">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-semibold text-slate-500">Compiling VendiMatch platform databases...</p>
      </div>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothTouch: true }}>
      <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      <Header
        currentUser={currentUser}
        allUsers={dbState.users}
        onSwitchUser={handleSwitchUser}
        onResetDb={handleResetDb}
        activeTab={getActiveTab()}
        setActiveTab={handleSetActiveTab}
        onOpenRegister={handleOpenRegister}
        onOpenLogin={handleOpenLogin}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegister={handleRegisterUser}
        onOpenLogin={() => { setIsRegisterOpen(false); setIsLoginOpen(true); }}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLogin={handleLoginUser}
        onRequestOtp={handleLoginOtpRequest}
        onOpenRegister={() => { setIsLoginOpen(false); setIsRegisterOpen(true); }}
        onOpenForgotPassword={() => { setIsLoginOpen(false); setIsForgotOpen(true); }}
      />

      <ForgotPasswordModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onRequestReset={handleForgotRequest}
        onVerifyResetOtp={handleForgotVerify}
        onResetPassword={handleForgotReset}
        onOpenLogin={() => { setIsForgotOpen(false); setIsLoginOpen(true); }}
      />

      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8">
            <Suspense fallback={<GlobalLoader />}>
              <Routes location={location}>
                {/* Landing Page (Public) */}
                <Route path="/" element={<LandingPage />} />

                {/* Pricing Page (Public) */}
                <Route path="/pricing" element={<PricingPage globalPlans={dbState?.settings?.subscription_plans || []} />} />

                {/* Design System Preview */}
                <Route path="/design-system" element={<DesignSystem />} />

                {/* Vendor Directory Search (Public) */}
                <Route path="/vendors" element={<VendorDiscovery />} />

                {/* Vendor Profile Page (Public) */}
                <Route path="/vendor/:slug" element={<VendorProfileView />} />

                {/* Standalone Post Requirement Flow */}
                <Route path="/post-requirement" element={<PostRequirement currentUser={currentUser} />} />

                {/* Buyer Portal Routing */}
                <Route path="/buyer" element={
                  currentUser?.role?.toLowerCase() === "buyer" 
                    ? <BuyerLayout currentUser={currentUser} />
                    : <Navigate to={currentUser?.role?.toLowerCase() === "admin" ? "/admin/dashboard" : currentUser?.role?.toLowerCase() === "vendor" ? "/vendor/dashboard" : "/"} replace />
                }>
                  <Route path="dashboard" element={<BuyerOverview />} />
                  <Route path="requirements" element={<BuyerRequirements />} />
                  <Route path="requirements/:id/quotes" element={<QuoteComparison currentUser={currentUser} />} />
                  <Route path="shortlist" element={<BuyerShortlist />} />
                  <Route path="projects" element={<BuyerProjects />} />
                  <Route path="payments" element={<BuyerPayments />} />
                  <Route path="reviews" element={<BuyerReviews />} />
                  <Route path="disputes" element={<BuyerDisputes />} />
                  <Route path="saved-searches" element={<BuyerSavedSearches />} />
                  <Route path="settings" element={<BuyerSettings />} />
                </Route>

                {/* Vendor Portal Routing */}
                <Route path="/vendor" element={
                  currentUser?.role?.toLowerCase() === "vendor"
                    ? <VendorLayout currentUser={currentUser} globalPlans={dbState?.settings?.subscription_plans || []} />
                    : <Navigate to={currentUser?.role?.toLowerCase() === "admin" ? "/admin/dashboard" : currentUser?.role?.toLowerCase() === "buyer" ? "/buyer/dashboard" : "/"} replace />
                }>
                  <Route path="dashboard" element={<VendorOverview />} />
                  <Route path="requirements" element={<VendorServiceOfferings />} />
                  <Route path="requirements/:id/quotes" element={<QuoteComparison currentUser={currentUser} />} />
                  <Route path="leads" element={<VendorLeads />} />
                  <Route path="quotes" element={<VendorQuotes />} />
                  <Route path="projects" element={<VendorProjects />} />
                  <Route path="portfolio" element={<VendorPortfolio />} />
                  <Route path="analytics" element={<VendorAnalytics />} />
                  <Route path="wallet" element={<VendorWallet />} />
                  <Route path="settings" element={<VendorSettings />} />
                </Route>

                {/* Vendor Compare Page */}
                <Route path="/compare" element={<CompareVendors />} />

                <Route path="/chats/*" element={
                  <ChatInbox currentUser={currentUser!} />
                } />

                {/* Admin Portal Routing */}
                <Route path="/admin" element={
                  currentUser?.role?.toLowerCase() === "admin"
                    ? <AdminLayout currentUser={currentUser} />
                    : <Navigate to={currentUser?.role?.toLowerCase() === "vendor" ? "/vendor/dashboard" : currentUser?.role?.toLowerCase() === "buyer" ? "/buyer/dashboard" : "/"} replace />
                }>
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="verification" element={<VerificationQueue />} />
                  <Route path="vendors" element={<AdminVendors />} />
                  <Route path="buyers" element={<AdminBuyers />} />
                  <Route path="moderation" element={<AdminModeration />} />
                  <Route path="disputes" element={<AdminDisputes />} />
                  <Route path="fraud" element={<AdminFraud />} />
                  <Route path="categories" element={<AdminCategories />} />
                  <Route path="transactions" element={<AdminTransactions />} />
                  <Route path="revenue" element={<AdminRevenue />} />
                  <Route path="analytics" element={<AdminAnalytics />} />
                  <Route path="matching-logs" element={<AdminMatchingLogs />} />
                  <Route path="notifications" element={<AdminNotificationTemplates />} />
                  <Route path="plans" element={<AdminSubscriptionPlans />} />
                  <Route path="settings" element={<AdminSettings />} />
                  <Route path="profile" element={<AdminProfile />} />
                  <Route path="audit-log" element={<AdminAuditLog />} />
                </Route>

                {/* Programmatic SEO Category Pages (Catch-All for pattern /:category-in-:city) */}
                <Route path="/:slug" element={<SeoCategoryPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
      </main>
      <Footer />
      <SupportWidget />
      </div>
    </ReactLenis>
  );
}
