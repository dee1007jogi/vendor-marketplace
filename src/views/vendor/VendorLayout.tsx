import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Inbox, Send, Briefcase, Building2,
  Image, BarChart2, Wallet, Settings, Bell, FileText, MessageSquare, Menu, X, Sparkles, Award
} from "lucide-react";
import { User } from "../../types";
import CheckoutModal from "../../components/CheckoutModal";
import Animated3DLetterAvatar from "../../components/Animated3DLetterAvatar";

interface VendorLayoutProps {
  currentUser: User;
  globalPlans?: any[];
}

const defaultVendorFallback: User = {
  id: "user-vendor-1",
  name: "Apex Precision Engineering Ltd",
  companyName: "Apex Precision Engineering Ltd",
  email: "contact@apexprecision.com",
  phone: "+91 98765 43210",
  avatar: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
  role: "vendor",
  verified: true,
  createdAt: new Date().toISOString(),
  vendorProfile: {
    userId: "user-vendor-1",
    businessName: "Apex Precision Engineering Ltd",
    leadCredits: 150,
    categories: ["Manufacturing", "Industrial Supplies", "Engineering"],
    services: ["CNC Machining", "Laser Cutting", "Sheet Metal Fabrication"],
    category: "Industrial Automation",
    gstNumber: "27AAACA1234A1Z5",
    panNumber: "AAACA1234A",
    location: "Pune",
    coordinates: [18.5204, 73.8567],
    portfolio: [],
    availability: "immediate",
    pricingModel: "hybrid",
    pricingMin: 25000,
    subscriptionPlan: "gold",
    responseTime: "Within 2 hours",
    ratings: { avg: 4.8, count: 142, quality: 4.9, timeliness: 4.7, communication: 4.8 }
  }
};

export default function VendorLayout({ currentUser, globalPlans = [] }: VendorLayoutProps) {
  const location = useLocation();
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const activeUser = currentUser || defaultVendorFallback;

  const navItems = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Company Profile", path: "/vendor/profile", icon: <Building2 size={18} /> },
    { name: "Service Offerings", path: "/vendor/requirements", icon: <FileText size={18} /> },
    { name: "Leads Inbox", path: "/vendor/leads", icon: <Inbox size={18} /> },
    { name: "Quotes", path: "/vendor/quotes", icon: <Send size={18} /> },
    { name: "Projects", path: "/vendor/projects", icon: <Briefcase size={18} /> },
    { name: "Portfolio", path: "/vendor/portfolio", icon: <Image size={18} /> },
    { name: "Analytics", path: "/vendor/analytics", icon: <BarChart2 size={18} /> },
    { name: "Wallet", path: "/vendor/wallet", icon: <Wallet size={18} /> },
    { name: "Settings", path: "/vendor/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#e9eff6] text-slate-900 relative w-full font-sans">
      
      {/* Sidebar Navigation */}
      <aside data-lenis-prevent className="w-[270px] shrink-0 bg-[#e9eff6] border-r border-white/80 hidden md:flex flex-col sticky top-[104px] h-[calc(100vh-104px)] z-20 shadow-[8px_0_20px_rgba(163,177,198,0.35)]">
        <div className="p-5 border-b border-slate-200/60 bg-[#e9eff6] z-10 shrink-0 relative">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 block mb-1 flex items-center gap-1.5">
            <Briefcase size={12} className="text-purple-600" /> Vendor Command Hub
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
            Control Center
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-100"></span>
          </h2>
        </div>

        <div data-lenis-prevent className="flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-contain">
          <nav className="py-4 space-y-1.5 px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm transition-all duration-200 ${
                    isActive 
                      ? "bg-gradient-to-r from-sky-400 to-sky-600 text-white font-black shadow-[4px_4px_10px_rgba(14,165,233,0.35)]" 
                      : "text-slate-700 hover:text-sky-800 hover:bg-white/60 font-bold"
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-200/60 bg-[#e9eff6] mt-auto shrink-0 space-y-3">
          {/* Lead Credits Card */}
          <div className="bg-[#e9eff6] rounded-2xl p-4 text-center relative overflow-hidden shadow-[inset_3px_3px_7px_rgba(163,177,198,0.35),inset_-3px_-3px_7px_rgba(255,255,255,0.9)] border border-white/70">
            <div className="flex items-center justify-between mb-1">
              <span className="font-extrabold text-[10px] text-amber-700 uppercase tracking-wider flex items-center gap-1">
                <Sparkles size={11} className="text-amber-500 fill-amber-400" /> Lead Credits
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-amber-100/90 text-amber-800 border border-amber-200/60">AAA Trust</span>
            </div>
            <p className="text-2xl font-black text-amber-700 my-1">{activeUser.vendorProfile?.leadCredits ?? 0}</p>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white px-3 py-2.5 rounded-xl font-extrabold text-xs w-full shadow-[4px_4px_10px_rgba(14,165,233,0.35)] transition-all cursor-pointer"
            >
              Top Up Credits
            </button>
          </div>

          {/* User Profile Pill */}
          <div className="flex items-center gap-3 p-3 bg-[#e9eff6] rounded-2xl shrink-0 shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
            <Animated3DLetterAvatar 
              role="vendor" 
              size="md" 
              customImage={activeUser?.useCustomAvatar ? (activeUser?.customAvatar || activeUser?.avatar) : undefined}
              useCustomAvatar={activeUser?.useCustomAvatar}
            />
            <div className="overflow-hidden flex-1">
              <h3 className="font-bold text-slate-900 text-sm truncate">{activeUser.vendorProfile?.businessName || activeUser.companyName || activeUser.name || "Vendor"}</h3>
              <p className="text-[10px] text-purple-700 font-extrabold uppercase tracking-wider flex items-center gap-1">
                <Award size={10} /> Verified Partner (V)
              </p>
            </div>
          </div>

          <button className="flex items-center justify-center gap-2 bg-[#e9eff6] hover:bg-white text-slate-700 hover:text-purple-800 text-xs font-bold w-full px-3 py-2.5 rounded-xl shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.8)] border border-white/80 cursor-pointer transition-all">
            <Bell size={14} /> Alerts & Notifications
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-8 sm:py-10 overflow-y-auto min-w-0 pb-28 md:pb-16">
        <div className="max-w-[1320px] mx-auto w-full px-2 sm:px-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Outlet context={{ currentUser: activeUser, globalPlans }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-sky-100 z-50 flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-4px_24px_rgba(0,100,200,0.06)]">
        {[
          { name: "Home", path: "/vendor/dashboard", icon: <LayoutDashboard size={20} /> },
          { name: "Leads", path: "/vendor/leads", icon: <Inbox size={20} /> },
          { name: "Projects", path: "/vendor/projects", icon: <Briefcase size={20} /> },
          { name: "Messages", path: "/chats", icon: <MessageSquare size={20} /> }
        ].map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${
                isActive ? "text-sky-600 font-bold" : "text-slate-500 hover:text-slate-900"
              }`
            }
          >
            {item.icon}
            <span className="text-[10px] font-semibold">{item.name}</span>
          </NavLink>
        ))}
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center w-full h-full gap-1 text-slate-500 hover:text-slate-900 transition-colors"
        >
          <Menu size={20} />
          <span className="text-[10px] font-semibold">Menu</span>
        </button>
      </nav>

      {/* Mobile Sliding Drawer Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-sky-950/35 backdrop-blur-md z-50 md:hidden"
            />
            <motion.aside 
              data-lenis-prevent
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[290px] bg-white/95 backdrop-blur-2xl shadow-2xl z-50 flex flex-col md:hidden overflow-y-auto border-l border-sky-100"
            >
              <div className="p-4 flex items-center justify-between border-b border-sky-100 bg-sky-50/60 sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-sky-600" />
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Vendor Portal</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 bg-[#ffffff] rounded-lg shadow-sm border border-slate-200">
                  <X size={18} />
                </button>
              </div>
              
              <nav className="flex-1 py-4 px-4 space-y-1">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-500/20" : "text-slate-700 hover:bg-sky-50"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-sky-100 sticky bottom-0 bg-white mt-auto">
                <div className="flex items-center gap-3 mb-3 p-2.5 bg-sky-50/80 rounded-xl shrink-0 border border-sky-100">
                  <Animated3DLetterAvatar 
                    role="vendor" 
                    size="md" 
                    customImage={activeUser?.useCustomAvatar ? (activeUser?.customAvatar || activeUser?.avatar) : undefined}
                    useCustomAvatar={activeUser?.useCustomAvatar}
                  />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{activeUser.vendorProfile?.businessName || activeUser.name || "Vendor"}</h3>
                    <p className="text-[10px] text-sky-600 uppercase tracking-widest font-bold">Verified Vendor (V)</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Lead Credits Checkout Modal injected from layout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/35 backdrop-blur-md">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full text-center border border-sky-100 relative overflow-hidden">
            <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Buy Lead Credits</h3>
            <p className="text-slate-500 text-sm mb-6">Top up your balance to unlock high-intent wholesale RFPs.</p>
            <div className="space-y-3">
              {globalPlans.map((plan: any) => (
                <button 
                  key={plan.id}
                  onClick={async () => { 
                    if (plan.price === 0) {
                      try {
                        await fetch("/api/payments/checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: activeUser.id, role: activeUser.role, amount: plan.price, credits: plan.credits, transactionType: "lead_purchase" })
                        });
                        setIsCheckoutOpen(false);
                        window.location.reload();
                      } catch(e) { alert("Failed to purchase free plan"); }
                    } else {
                      setIsCheckoutOpen(false);
                      setSelectedPlan(plan);
                    }
                  }} 
                  className={`w-full font-bold py-3 px-4 rounded-xl transition-all cursor-pointer ${
                    plan.price > 2000 
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20" 
                      : "bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-md shadow-sky-500/20"
                  }`}
                >
                  {plan.name} - ₹{plan.price.toLocaleString()}
                </button>
              ))}
              {globalPlans.length === 0 && <p className="text-sm text-slate-500">No plans configured yet.</p>}
            </div>
            <button onClick={() => setIsCheckoutOpen(false)} className="mt-5 text-slate-400 font-bold text-sm hover:text-slate-600 cursor-pointer">Cancel</button>
          </div>
        </div>
      )}

      {selectedPlan && (
        <CheckoutModal 
          isOpen={true} 
          onClose={() => setSelectedPlan(null)} 
          title={`Subscribe to ${selectedPlan.name} Plan`} 
          amount={selectedPlan.price} 
          transactionType="lead_purchase" 
          userId={activeUser.id} 
          role={activeUser.role} 
          credits={selectedPlan.credits} 
          onSuccess={() => window.location.reload()} 
        />
      )}

    </div>
  );
}
