import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, FileText, Bookmark, MessageSquare, 
  Briefcase, Wallet, Settings, Bell, Star, FileCheck, Search, Menu, X, ShieldCheck, Building2
} from "lucide-react";
import { User } from "../../types";
import Animated3DLetterAvatar from "../../components/Animated3DLetterAvatar";

interface BuyerLayoutProps {
  currentUser: User;
}

export default function BuyerLayout({ currentUser }: BuyerLayoutProps) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { name: "Dashboard", path: "/buyer/dashboard", icon: <LayoutDashboard size={18} /> },
    { name: "Company Profile", path: "/buyer/profile", icon: <Building2 size={18} /> },
    { name: "My Requirements", path: "/buyer/requirements", icon: <FileText size={18} /> },
    { name: "Shortlist", path: "/buyer/shortlist", icon: <Bookmark size={18} /> },
    { name: "Projects & Escrow", path: "/buyer/projects", icon: <Briefcase size={18} /> },
    { name: "Invoices & Payments", path: "/buyer/payments", icon: <Wallet size={18} /> },
    { name: "Reviews Given", path: "/buyer/reviews", icon: <Star size={18} /> },
    { name: "Disputes", path: "/buyer/disputes", icon: <FileCheck size={18} /> },
    { name: "Saved Searches", path: "/buyer/saved-searches", icon: <Search size={18} /> },
    { name: "Settings", path: "/buyer/settings", icon: <Settings size={18} /> },
  ];

  return (
    <div className="flex min-h-[calc(100vh-64px)] bg-[#e9eff6] text-slate-900 relative w-full font-sans">
      
      {/* Sidebar Navigation */}
      <aside data-lenis-prevent className="w-[270px] shrink-0 bg-[#e9eff6] border-r border-white/80 hidden md:flex flex-col sticky top-[104px] h-[calc(100vh-104px)] z-20 shadow-[8px_0_20px_rgba(163,177,198,0.35)]">
        <div className="p-5 border-b border-slate-200/60 bg-[#e9eff6] z-10 shrink-0 relative">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-purple-700 block mb-1 flex items-center gap-1.5">
            <Briefcase size={12} className="text-purple-600" /> Buyer Command Hub
          </span>
          <h2 className="text-xl font-black text-slate-900 tracking-tight leading-tight flex items-center gap-2">
            Procurement Desk
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
          <div className="flex items-center gap-3 p-3 bg-[#e9eff6] rounded-2xl shrink-0 shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
            <Animated3DLetterAvatar 
              role="buyer" 
              size="md" 
              customImage={currentUser?.useCustomAvatar ? (currentUser?.customAvatar || currentUser?.avatar) : undefined}
              useCustomAvatar={currentUser?.useCustomAvatar}
            />
            <div className="overflow-hidden flex-1">
              <h3 className="font-bold text-slate-900 text-sm truncate">{currentUser.companyName || currentUser.name}</h3>
              <p className="text-[10px] text-purple-700 uppercase tracking-widest font-black flex items-center gap-1">
                <ShieldCheck size={10} /> Verified Buyer (B)
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
              <Outlet context={{ currentUser }} />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-sky-100 z-50 flex justify-around items-center h-16 px-2 pb-safe shadow-[0_-4px_24px_rgba(0,100,200,0.06)]">
        {[
          { name: "Home", path: "/buyer/dashboard", icon: <LayoutDashboard size={20} /> },
          { name: "Reqs", path: "/buyer/requirements", icon: <FileText size={20} /> },
          { name: "Projects", path: "/buyer/projects", icon: <Briefcase size={20} /> }
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
                  <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">Buyer Portal</h2>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-500 hover:text-slate-900 bg-white rounded-lg shadow-sm border border-slate-200">
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
                  <Animated3DLetterAvatar role="buyer" size="md" />
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-slate-800 text-sm truncate">{currentUser.name}</h3>
                    <p className="text-[10px] text-sky-600 uppercase tracking-widest font-bold">Verified Buyer (B)</p>
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

    </div>
  );
}
