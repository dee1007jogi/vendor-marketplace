import { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { io } from "socket.io-client";
import { 
  LayoutDashboard, ShieldCheck, Users, Briefcase, 
  AlertTriangle, FolderTree, FileText, CreditCard, 
  BarChart, Settings, LogOut, DollarSign, Search, Bell, ChevronDown, User as UserIcon, Menu, X
} from "lucide-react";
import { User } from "../../types";

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
    <div className="flex min-h-[calc(100vh-64px)] bg-slate-50/50 relative -mx-4 sm:-mx-6 lg:-mx-8 font-sans">
      
      {/* Desktop Sidebar Navigation */}
      <aside data-lenis-prevent className="w-[260px] shrink-0 bg-[#0f172a] hidden md:flex flex-col sticky top-[104px] h-[calc(100vh-104px)] overflow-y-auto shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-20">
        <div className="p-6 bg-[#0f172a] sticky top-0 z-10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <ShieldCheck size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-black text-white tracking-wider uppercase">VendiMatch</h2>
            <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">Command Center</span>
          </div>
        </div>
        
        <nav className="flex-1 py-4 space-y-1 px-4">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-2 px-2">Core</div>
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`
              }
            >
              <div className={`transition-transform duration-200 group-hover:scale-110`}>{item.icon}</div>
              {item.name === "Verification Queue" && pendingCount > 0 ? (
                <div className="flex items-center justify-between w-full">
                  <span>{item.name}</span>
                  <span className="bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-md animate-pulse shadow-lg shadow-rose-500/30">
                    {pendingCount}
                  </span>
                </div>
              ) : (
                <span>{item.name}</span>
              )}
            </NavLink>
          ))}

          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-6 px-2">Operations</div>
          {navItems.slice(4, 9).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`
              }
            >
              <div className={`transition-transform duration-200 group-hover:scale-110`}>{item.icon}</div>
              <span>{item.name}</span>
            </NavLink>
          ))}

          <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 mt-6 px-2">System</div>
          {navItems.slice(9).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                  isActive 
                    ? "bg-indigo-500/10 text-indigo-400" 
                    : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
                }`
              }
            >
              <div className={`transition-transform duration-200 group-hover:scale-110`}>{item.icon}</div>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-4 sticky bottom-0 bg-[#0f172a] mt-auto">
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <img src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" className="w-10 h-10 rounded-xl bg-slate-800" />
              <div className="overflow-hidden">
                <p className="text-sm font-bold text-white truncate">{currentUser?.name || "Super Admin"}</p>
                <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold truncate">System Administrator</p>
              </div>
            </div>
            <button 
              onClick={() => navigate("/")}
              className="flex items-center justify-center gap-2 text-slate-300 hover:text-white bg-slate-700/50 hover:bg-rose-500 hover:border-rose-500 text-xs font-bold w-full py-2 rounded-lg transition-all duration-200 border border-slate-600/50"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Admin Top Bar */}
        <header className="hidden md:flex h-16 bg-white border-b border-slate-200 items-center justify-between px-8 sticky top-[104px] z-10 shadow-sm">
          <div className="flex items-center gap-2 w-96 relative group">
            <Search size={18} className="text-slate-400 absolute left-3 group-focus-within:text-indigo-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search across platform (vendors, buyers, disputes)..." 
              className="w-full bg-slate-100 hover:bg-slate-200/50 focus:bg-white border border-transparent focus:border-indigo-300 rounded-xl py-2 pl-10 pr-4 text-sm font-medium outline-none transition-all placeholder:text-slate-400 text-slate-900"
            />
            <div className="absolute right-3 px-1.5 py-0.5 rounded border border-slate-300 bg-white text-[10px] font-bold text-slate-400 pointer-events-none">
              ⌘K
            </div>
          </div>
          
          <div className="flex items-center gap-5">
            <button className="relative text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-slate-200"></div>
            <button className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-lg transition-colors cursor-pointer">
              <span className="text-sm font-bold text-slate-700 hidden sm:block">{currentUser?.name?.split(' ')[0] || 'Admin'}</span>
              <img src={currentUser?.avatar || "https://ui-avatars.com/api/?name=Admin"} alt="Admin" className="w-8 h-8 rounded-full border border-slate-200 shadow-sm" />
              <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-8">
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
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <nav className="sticky bottom-0 left-0 right-0 bg-white border-t border-slate-200 md:hidden flex justify-around items-center z-50 pt-1 pb-1 shadow-[0_-4px_12px_rgba(0,0,0,0.05)] mt-auto">
          {navItems.slice(0, 4).map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center justify-center w-16 h-14 transition-colors ${
                  isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
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
        <div className="fixed bottom-24 md:bottom-6 right-6 bg-slate-900 text-white p-4 rounded-xl shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-3">
            <ShieldCheck className="text-amber-400 mt-0.5 shrink-0" size={20} />
            <div>
              <h4 className="font-bold text-sm">{toastMessage.title}</h4>
              <p className="text-xs text-slate-300 mt-1">{toastMessage.body}</p>
              <div className="mt-3 flex gap-3">
                <button 
                  onClick={() => { navigate(toastMessage.url); setToastMessage(null); }}
                  className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 px-3 py-1.5 rounded-md transition-colors"
                >
                  Review Now
                </button>
                <button 
                  onClick={() => setToastMessage(null)}
                  className="text-xs font-bold text-slate-400 hover:text-white"
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
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden"
            />
            <motion.aside 
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="fixed top-0 right-0 bottom-0 w-[280px] bg-[#0f172a] shadow-2xl z-50 flex flex-col md:hidden overflow-y-auto"
            >
              <div className="p-4 flex items-center justify-between border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
                    <ShieldCheck size={18} className="text-white" />
                  </div>
                  <h2 className="text-sm font-black text-white uppercase">Menu</h2>
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
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
