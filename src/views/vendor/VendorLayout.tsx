import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, Inbox, Send, Briefcase, 
  Image, BarChart2, Wallet, Settings, Bell, FileText, MessageSquare, Menu, X
} from "lucide-react";
import { User } from "../../types";
import CheckoutModal from "../../components/CheckoutModal";

interface VendorLayoutProps {
  currentUser: User;
  globalPlans?: any[];
}

export default function VendorLayout({ currentUser, globalPlans = [] }: VendorLayoutProps) {
  const location = useLocation();
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [selectedPlan, setSelectedPlan] = React.useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: "Dashboard", path: "/vendor/dashboard", icon: <LayoutDashboard size={18} /> },
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
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50 relative -mx-4 sm:-mx-6 lg:-mx-8">
      
      {/* Sidebar Navigation */}
      <aside className="w-[260px] shrink-0 bg-slate-950 border-r border-slate-800/60 hidden md:flex flex-col sticky top-[104px] h-[calc(100vh-104px)]">
        <div className="p-5 border-b border-slate-800/60 bg-slate-950/80 backdrop-blur z-10 shrink-0">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-500/80 block mb-1.5 flex items-center gap-1.5"><Briefcase size={12} /> Vendor Portal</span>
          <h2 className="text-xl font-bold text-white tracking-tight leading-tight">Control Center</h2>
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar overscroll-contain">
          <nav className="py-5 space-y-1.5 px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive 
                      ? "bg-indigo-500/10 text-indigo-400 shadow-sm ring-1 ring-indigo-500/20" 
                      : "text-slate-400 hover:bg-slate-800/40 hover:text-slate-200"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-800/60 bg-slate-950/80 backdrop-blur mt-auto shrink-0">
          <div className="bg-gradient-to-tr from-amber-500/20 to-orange-500/10 ring-1 ring-amber-500/30 rounded-xl shadow-sm p-3 text-center mb-4">
            <h3 className="font-bold text-[10px] text-amber-500/90 uppercase tracking-widest mb-1">Lead Credits</h3>
            <p className="text-2xl font-black text-amber-400 mb-2">{currentUser.vendorProfile?.leadCredits || 0}</p>
            <button 
              onClick={() => setIsCheckoutOpen(true)}
              className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-1.5 rounded-lg font-bold text-xs w-full shadow-md hover:shadow-lg transition-all"
            >
              Buy Credits
            </button>
          </div>
          <div className="flex items-center gap-3 mb-4 p-2.5 bg-slate-900/80 ring-1 ring-slate-800/60 rounded-xl shrink-0">
            <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-lg object-cover shrink-0 shadow-sm" />
            <div className="overflow-hidden">
              <h3 className="font-bold text-slate-200 text-sm truncate">{currentUser.name}</h3>
              <p className="text-[10px] text-indigo-400/80 uppercase tracking-widest font-bold">Vendor</p>
            </div>
          </div>
          <button className="flex items-center gap-3 text-slate-400 hover:text-indigo-400 text-sm font-bold w-full px-4 py-3 rounded-xl hover:bg-slate-800/50 transition-all duration-200">
            <Bell size={18} /> Notifications
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto min-w-0 pb-24 md:pb-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
          >
            <Outlet context={{ currentUser, globalPlans }} />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-50 flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
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
                isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-slate-950 shadow-2xl z-50 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/80 backdrop-blur sticky top-0 z-10">
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-indigo-500" />
                  <h2 className="text-sm font-black text-white uppercase tracking-wider">Vendor Portal</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg">
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
                      `flex items-center gap-3 px-4 py-3.5 rounded-xl text-base font-semibold transition-all ${
                        isActive ? "bg-indigo-500 text-white" : "text-slate-300 hover:bg-slate-800"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="p-4 border-t border-slate-800/60 sticky bottom-0 bg-slate-950 mt-auto">
                <div className="flex items-center gap-3 mb-4 p-2.5 bg-slate-900 rounded-xl shrink-0">
                  <img src={currentUser.avatar} alt={currentUser.name} className="w-9 h-9 rounded-lg object-cover shrink-0" />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-200 text-sm truncate">{currentUser.name}</h3>
                    <p className="text-[10px] text-indigo-400 uppercase tracking-widest font-bold">Vendor</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Lead Credits Checkout Modal injected from layout */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Buy Lead Credits</h3>
            <p className="text-slate-500 mb-6">Top up your balance to keep pitching.</p>
            <div className="space-y-3">
              {globalPlans.map((plan: any) => (
                <button 
                  key={plan.id}
                  onClick={async () => { 
                    if (plan.price === 0) {
                      // Instantly process free plans
                      try {
                        await fetch("/api/payments/checkout", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({ userId: currentUser.id, role: currentUser.role, amount: plan.price, credits: plan.credits, transactionType: "lead_purchase" })
                        });
                        setIsCheckoutOpen(false);
                        window.location.reload();
                      } catch(e) { alert("Failed to purchase free plan"); }
                    } else {
                      // Trigger real payment integration
                      setIsCheckoutOpen(false);
                      setSelectedPlan(plan);
                    }
                  }} 
                  className={`w-full font-bold py-3 px-4 rounded-xl transition-colors ${
                    plan.price > 2000 ? "bg-slate-900 hover:bg-slate-800 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                  }`}
                >
                  {plan.name} - ₹{plan.price.toLocaleString()}
                </button>
              ))}
              {globalPlans.length === 0 && <p className="text-sm text-slate-500">No plans configured yet.</p>}
            </div>
            <button onClick={() => setIsCheckoutOpen(false)} className="mt-4 text-slate-400 font-bold text-sm hover:text-slate-600">Cancel</button>
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
          userId={currentUser.id} 
          role={currentUser.role} 
          credits={selectedPlan.credits} 
          onSuccess={() => window.location.reload()} 
        />
      )}

    </div>
  );
}
