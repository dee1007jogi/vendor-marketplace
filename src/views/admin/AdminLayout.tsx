import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { io } from "socket.io-client";
import { 
  LayoutDashboard, ShieldCheck, Users, Briefcase, 
  AlertTriangle, FolderTree, FileText, CreditCard, 
  BarChart, Settings, LogOut, DollarSign, Search, Bell, ChevronDown, User as UserIcon, Menu, X, Megaphone, Sparkles
} from "lucide-react";
import { User } from "../../types";
import Animated3DLetterAvatar from "../../components/Animated3DLetterAvatar";

interface AdminLayoutProps {
  currentUser?: User | null;
}

export default function AdminLayout({ currentUser }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [pendingCount, setPendingCount] = useState(0);
  const [toastMessage, setToastMessage] = useState<any>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Fetch initial count
    fetch("/api/admin/v1/vendors/pending/count")
      .then(res => res.json())
      .then(data => setPendingCount(data.count || 0))
      .catch(console.error);

    // Initialize socket
    const socket = io();
    socket.emit("join:admin");

    socket.on("vendor:pending", (data) => {
      setToastMessage({
        title: "New Vendor Pending",
        body: `${data.businessName} needs verification.`,
        url: data.actionUrl
      });
      setTimeout(() => setToastMessage(null), 8000);
    });

    socket.on("admin:badge:verificationQueue", (count) => {
      setPendingCount(count);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const navItems = [
    { name: "Dashboard", path: "/admin/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Verification Queue", path: "/admin/verification", icon: <ShieldCheck size={18} /> },
    { name: "Vendors", path: "/admin/vendors", icon: <Briefcase size={18} /> },
    { name: "Buyers", path: "/admin/buyers", icon: <Users size={18} /> },
    { name: "Ad Campaigns & RMN", path: "/admin/ads", icon: <Megaphone size={18} className="text-amber-500" /> },
    { name: "Moderation", path: "/admin/moderation", icon: <FileText size={18} /> },
    { name: "Disputes", path: "/admin/disputes", icon: <AlertTriangle size={18} /> },
    { name: "Fraud Alerts", path: "/admin/fraud", icon: <ShieldCheck size={18} className="text-rose-400" /> },
    { name: "Categories", path: "/admin/categories", icon: <FolderTree size={18} /> },
    { name: "Transactions", path: "/admin/transactions", icon: <FileText size={18} /> },
    { name: "Revenue & Payouts", path: "/admin/revenue", icon: <CreditCard size={18} /> },
    { name: "Subscription Plans", path: "/admin/plans", icon: <DollarSign size={18} /> },
    { name: "Analytics", path: "/admin/analytics", icon: <BarChart size={18} /> },
    { name: "AI Matching Logs", path: "/admin/matching-logs", icon: <AlertTriangle size={18} /> },
    { name: "Notif Templates", path: "/admin/notifications", icon: <FileText size={18} /> },
    { name: "Settings", path: "/admin/settings", icon: <Settings size={18} /> },
    { name: "System Audit Log", path: "/admin/audit-log", icon: <ShieldCheck size={18} /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#e9eff6] text-slate-900 relative w-full font-sans">
      
      {/* Desktop Sidebar Navigation */}
      <aside data-lenis-prevent className="w-[270px] shrink-0 bg-[#e9eff6] border-r border-white/80 hidden md:flex flex-col sticky top-[104px] h-[calc(100vh-104px)] overflow-y-auto shadow-[8px_0_20px_rgba(163,177,198,0.35)] z-20 custom-scrollbar">
        <div className="p-5 bg-[#e9eff6] sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200/60 relative">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 text-white flex items-center justify-center shadow-md">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-wider uppercase">Bussinest</h2>
            <span className="text-[10px] font-extrabold text-sky-600 tracking-widest uppercase">Admin Command</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 space-y-1.5 px-3">
          <div className="text-[10px] font-extrabold text-sky-900 uppercase tracking-widest mb-2 mt-1 px-3">Core Engine</div>
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
              <span className="flex-1">{item.name}</span>
              {item.path === "/admin/verification" && pendingCount > 0 && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-amber-950 shadow-sm">
                  {pendingCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 sticky bottom-0 bg-[#f4f8fd]/95 backdrop-blur mt-auto border-t border-sky-100/80">
          <div className="neo-card rounded-2xl p-3">
            <div className="flex items-center gap-2.5 mb-2.5">
              <Animated3DLetterAvatar 
                role="admin" 
                size="md" 
                customImage={currentUser?.useCustomAvatar ? (currentUser?.customAvatar || currentUser?.avatar) : undefined}
                useCustomAvatar={currentUser?.useCustomAvatar}
              />
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-slate-900 truncate">{currentUser?.name || "Super Admin"}</p>
                <p className="text-[9px] text-amber-700 uppercase tracking-wider font-extrabold truncate">System Administrator (A)</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/")}
              className="neo-btn flex items-center justify-center gap-1.5 text-slate-700 hover:text-rose-600 text-xs font-bold w-full py-2 rounded-xl transition-all duration-200 cursor-pointer"
            >
              <LogOut size={12} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Top Bar */}
        <header className="hidden md:flex h-16 bg-[#f4f8fd]/90 backdrop-blur-xl border-b border-sky-100/90 items-center justify-between px-8 sticky top-[104px] z-10 shadow-xs">
          <div className="flex items-center gap-2 w-96 relative group">
            <Search size={18} className="text-slate-400 absolute left-3.5 group-focus-within:text-sky-600 transition-colors z-10" />
            <input 
              type="text" 
              placeholder="Search across platform (vendors, buyers, disputes)..." 
              className="neo-input w-full py-2 pl-10 pr-12 text-xs font-medium outline-none text-slate-800 placeholder:text-slate-400"
            />
            <div className="absolute right-3 px-1.5 py-0.5 rounded-lg border border-slate-200/80 bg-white/80 text-[10px] font-bold text-slate-500 pointer-events-none shadow-2xs">
              ⌘K
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="neo-btn-circle w-9 h-9 flex items-center justify-center relative text-slate-600 hover:text-sky-700 transition-colors cursor-pointer">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <button className="neo-btn flex items-center gap-2 px-3 py-1.5 rounded-xl cursor-pointer">
              <Animated3DLetterAvatar role="admin" size="sm" />
              <span className="text-xs font-bold text-slate-800 hidden sm:block">{currentUser?.name?.split(' ')[0] || 'Admin'}</span>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>
        </header>

        {/* Page Content */}
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
                <Outlet context={{ pendingCount, currentUser, navItems }} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="sticky bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-sky-100 md:hidden flex justify-around items-center z-50 pt-1 pb-1 shadow-[0_-4px_12px_rgba(0,100,200,0.06)] mt-auto">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-14 transition-colors ${
                  isActive ? "text-sky-600 font-bold" : "text-slate-500 hover:text-slate-900"
                }`
              }
            >
              {item.icon}
              <span className="text-[10px] font-bold mt-1 max-w-full truncate px-1">{item.name.split(' ')[0]}</span>
            </NavLink>
          ))}
          <button 
            onClick={() => setIsMobileMenuOpen(true)}
            className="flex flex-col items-center justify-center w-16 h-14 text-slate-500 hover:text-slate-900 transition-colors"
          >
            <Menu size={18} />
            <span className="text-[10px] font-bold mt-1">Menu</span>
          </button>
        </nav>
      </div>

      {/* Real-time Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-24 md:bottom-6 right-6 bg-white/95 backdrop-blur-xl border border-sky-200 shadow-2xl p-4 rounded-2xl z-50 animate-in slide-in-from-bottom-5 duration-300 max-w-sm">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-amber-500 mt-0.5 shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-sm text-slate-900">{toastMessage.title}</h4>
              <p className="text-xs text-slate-600 mt-1">{toastMessage.body}</p>
              <div className="mt-3 flex gap-3">
                <button 
                  onClick={() => { navigate(toastMessage.url); setToastMessage(null); }}
                  className="text-xs font-bold bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg transition-all shadow-sm"
                >
                  Review Now
                </button>
                <button 
                  onClick={() => setToastMessage(null)}
                  className="text-xs font-bold text-slate-400 hover:text-slate-700"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[290px] bg-white/95 backdrop-blur-2xl shadow-2xl z-50 flex flex-col md:hidden overflow-y-auto border-l border-sky-100"
            >
              <div className="p-4 flex items-center justify-between border-b border-sky-100 bg-sky-50/60">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-white" />
                  </div>
                  <h2 className="text-sm font-black text-slate-900 uppercase">Admin Command</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg border border-slate-200 shadow-2xs">
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
                      `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold transition-all ${
                        isActive ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold shadow-md shadow-sky-500/20" : "text-slate-700 hover:bg-sky-50"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                ))}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
