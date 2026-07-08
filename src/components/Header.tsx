/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, memo } from "react";
import { User } from "../types";
import { Sun, Moon, Users, RotateCcw, ShieldCheck, Zap, LogIn, BellRing, UserPlus, Mail, Smartphone, Bell, HelpCircle, ChevronDown, Wallet, Sparkles, Store, ShoppingBag, User as UserIcon, Menu } from "lucide-react";

interface HeaderProps {
  currentUser: User | null;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  onResetDb: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
}

const Header = memo(function Header({
  currentUser,
  allUsers,
  onSwitchUser,
  onResetDb,
  activeTab,
  setActiveTab,
  onOpenRegister,
  onOpenLogin,
}: HeaderProps) {
  const isVendor = currentUser?.role?.toLowerCase() === "vendor";
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("vendimatch-theme") as "light" | "dark") || 
             (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("vendimatch-theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [theme]);

  useEffect(() => {
    if (currentUser) {
      fetch(`/api/notifications/${currentUser.id}`)
        .then(r => r.json())
        .then(data => {
          if (data.items && data.items.length > 0) {
            setNotifications(data.items);
          } else {
            // Mock notifications if none exist
            setNotifications([]);
          }
        })
        .catch(() => {
          setNotifications([]);
        });
    } else {
      setNotifications([]);
    }
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleOpenNotifications = async () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications && unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.isRead).map(n => n.id);
      for (const id of unreadIds) {
        await fetch(`/api/notifications/${id}/read`, { method: "POST" }).catch(() => {});
      }
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
      {/* Dev / Admin Bar */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 flex justify-between items-center sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mx-auto max-w-7xl w-full justify-between">
          <div className="flex items-center gap-4">
            <span className="font-bold text-white flex items-center gap-1"><ShieldCheck size={14} className="text-emerald-400"/> Dev/Admin Mode</span>
            <button onClick={onResetDb} className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer"><RotateCcw size={12} /> Reset Database</button>
          </div>
          <div className="flex items-center gap-2 relative">
            <span className="hidden sm:flex items-center gap-1"><Users size={12} /> Switch User:</span>
            <div className="relative">
              <button 
                onClick={() => setShowSwitchUser(!showSwitchUser)}
                className="bg-slate-800 border border-slate-700 rounded p-1.5 sm:px-2.5 sm:py-1 text-white outline-none cursor-pointer flex items-center justify-center sm:justify-between gap-2 min-w-0 sm:min-w-[180px]"
              >
                <div className="hidden sm:flex items-center gap-2">
                  {currentUser ? (
                    <>
                      {currentUser.role?.toLowerCase() === 'admin' ? <ShieldCheck size={14} className="text-emerald-400 shrink-0" /> : 
                       currentUser.role?.toLowerCase() === 'vendor' ? <Store size={14} className="text-indigo-400 shrink-0" /> : 
                       <ShoppingBag size={14} className="text-amber-400 shrink-0" />}
                      <span className="truncate max-w-[140px] text-left">{currentUser.name}</span>
                    </>
                  ) : (
                    <>
                      <UserIcon size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-300">Guest</span>
                    </>
                  )}
                </div>
                <Menu size={16} className="text-slate-300 shrink-0" />
              </button>

              {showSwitchUser && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowSwitchUser(false)}></div>
                  <div className="absolute right-0 top-full mt-1 w-56 sm:w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                    <button
                      onClick={() => { onSwitchUser(""); setShowSwitchUser(false); }}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-700 text-slate-300 flex items-center gap-3 transition-colors"
                    >
                      <UserIcon size={14} />
                      <span>Guest (Logged out)</span>
                    </button>
                    {allUsers.map(u => (
                      <button
                        key={u.id}
                        onClick={() => { onSwitchUser(u.id); setShowSwitchUser(false); }}
                        className="w-full text-left px-4 py-2 hover:bg-slate-700 text-white flex items-center gap-3 border-t border-slate-700/50 transition-colors"
                      >
                        {u.role?.toLowerCase() === 'admin' ? <ShieldCheck size={14} className="text-emerald-400 shrink-0" /> : 
                         u.role?.toLowerCase() === 'vendor' ? <Store size={14} className="text-indigo-400 shrink-0" /> : 
                         <ShoppingBag size={14} className="text-amber-400 shrink-0" />}
                        <div className="flex flex-col truncate w-full">
                          <span className="truncate font-medium leading-tight text-sm">{u.name}</span>
                          <span className="text-[10px] text-slate-400 uppercase tracking-wider">{u.role}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Navigation Row */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-slate-900 to-indigo-800 text-white shadow-md shadow-indigo-200">
              <Zap className="fill-teal-300 stroke-teal-300 w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <button onClick={() => setActiveTab("home")} className="text-left cursor-pointer min-w-0">
              <span className="text-base sm:text-lg font-bold tracking-tight text-slate-900 flex items-center gap-1.5 truncate">
                VendiMatch <span className="hidden sm:inline-block text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold shrink-0">AI RFP</span>
              </span>
              <p className="hidden sm:block text-[10px] text-slate-500 leading-none">B2B Vendor Matching marketplace</p>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            {(!currentUser || currentUser.role.toLowerCase() === "buyer") && (
              <button
                onClick={() => { setActiveTab("discover"); window.location.href = "/vendors"; }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "discover"
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
                id="nav-discover"
              >
                Find Vendors
              </button>
            )}

            {(!currentUser) && (
              <button
                onClick={() => {
                  setActiveTab("pricing");
                  window.location.href = "/pricing";
                }}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "pricing"
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
                id="nav-pricing"
              >
                Pricing
              </button>
            )}
            
            {(!currentUser || currentUser.role.toLowerCase() === "buyer") && (
              <>
                {currentUser && (
                  <>
                    <button
                      onClick={() => { setActiveTab("buyer-dashboard"); window.location.href = "/buyer/requirements"; }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === "buyer-dashboard"
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                      }`}
                      id="nav-buyer"
                    >
                      My Requirements
                    </button>
                    
                    <button
                      onClick={() => { window.location.href = "/buyer/shortlist"; }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600 hover:bg-slate-50 relative`}
                    >
                      Shortlist
                      <span className="ml-1.5 inline-flex items-center justify-center bg-indigo-100 text-indigo-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">3</span>
                    </button>
                    
                    <button
                      onClick={() => { setActiveTab("chats"); window.location.href = "/chats"; }}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                        activeTab === "chats"
                          ? "bg-indigo-50 text-indigo-700 font-semibold"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                      } relative`}
                    >
                      Chat
                      <span className="ml-1.5 inline-flex items-center justify-center bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">2</span>
                    </button>
                  </>
                )}
                <div className="ml-2 border-l border-slate-200 pl-3">
                  <button
                    onClick={() => {
                      if (!currentUser) return onOpenLogin();
                      window.location.href = "/post-requirement";
                    }}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-colors cursor-pointer bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm flex items-center gap-1.5"
                    id="nav-post-req"
                  >
                    <span>Post Requirement</span>
                    <Sparkles size={14} className="fill-indigo-300" />
                  </button>
                </div>
              </>
            )}

            {isVendor && (
              <>
                <button onClick={() => { setActiveTab("vendor-dashboard"); window.location.href = "/vendor/dashboard"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === "vendor-dashboard" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"}`}>
                  Dashboard
                </button>
                <button onClick={() => { window.location.href = "/vendor/leads"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600 hover:bg-slate-50 relative`}>
                  Leads
                </button>
                <button onClick={() => { window.location.href = "/vendor/quotes"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600 hover:bg-slate-50`}>
                  Quotes
                </button>
                <button onClick={() => { window.location.href = "/vendor/projects"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600 hover:bg-slate-50`}>
                  Projects
                </button>
                <button onClick={() => { setActiveTab("chats"); window.location.href = "/chats"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${activeTab === "chats" ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"} relative`}>
                  Chat
                </button>
                <button onClick={() => { window.location.href = "/vendor/analytics"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600 hover:bg-slate-50`}>
                  Analytics
                </button>
                <button onClick={() => { window.location.href = "/vendor/wallet"; }} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer text-slate-600 hover:text-indigo-600 hover:bg-slate-50 flex items-center gap-1.5`}>
                  Wallet
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => { setActiveTab("admin"); window.location.href = "/admin/dashboard"; }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === "admin"
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:text-indigo-600 hover:bg-slate-50"
                }`}
                id="nav-admin"
              >
                Admin Panel
              </button>
            )}

          </nav>

          {/* User profile controls & action buttons */}
          <div className="flex items-center gap-4">
            {currentUser ? (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <span className="hidden lg:block text-right">
                  <span className="block text-xs font-semibold text-slate-800 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="block text-[10px] text-indigo-600 font-semibold uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                </span>
                
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors mr-1 cursor-pointer"
                  title="Toggle Dark Mode"
                >
                  {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                </button>

                <div className="relative">
                  <button onClick={handleOpenNotifications} className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
                    <BellRing size={20} />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                      <div className="bg-slate-50 p-4 border-b border-slate-100 flex justify-between items-center">
                        <h3 className="font-bold text-slate-900">Notifications</h3>
                        <span className="text-xs font-bold text-indigo-600 cursor-pointer">View All</span>
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500 text-sm font-medium">No notifications yet.</div>
                        ) : (
                          <div className="divide-y divide-slate-50">
                            {notifications.map(n => (
                              <div key={n.id} className={`p-4 hover:bg-slate-50 transition-colors ${n.isRead ? 'opacity-70' : 'bg-indigo-50/30'}`}>
                                <div className="flex items-start gap-3">
                                  <div className={`mt-1 rounded-full p-1.5 ${n.type === 'email' ? 'bg-blue-100 text-blue-600' : n.type === 'whatsapp' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                                    {n.type === 'email' ? <Mail size={12} /> : n.type === 'whatsapp' ? <Smartphone size={12} /> : <Bell size={12} />}
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-bold text-slate-900">{n.title}</h4>
                                    <p className="text-xs text-slate-600 mt-0.5 line-clamp-2">{n.message}</p>
                                    <span className="text-[10px] font-bold text-slate-400 mt-2 block">{new Date(n.createdAt).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:bg-slate-50 p-1 rounded-lg transition-colors cursor-pointer ml-2"
                  >
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-slate-100"
                    />
                    <ChevronDown size={16} className="text-slate-400" />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50">
                      <div className="p-3 border-b border-slate-50 bg-slate-50/50">
                        <p className="text-sm font-bold text-slate-900">{currentUser.name}</p>
                        <p className="text-xs text-slate-500">{currentUser.email}</p>
                      </div>
                      <div className="p-2">
                        <button onClick={() => window.location.href = isAdmin ? "/admin/profile" : isVendor ? "/vendor/settings" : "/buyer/settings"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">My Profile</button>
                        
                        {isVendor ? (
                          <>
                            <button onClick={() => window.location.href = "/vendor/portfolio"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Portfolio</button>
                            <button onClick={() => window.location.href = "/pricing"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Subscription</button>
                            <button onClick={() => window.location.href = "/vendor/wallet"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Billing & Invoices</button>
                          </>
                        ) : currentUser.role.toLowerCase() === "buyer" ? (
                          <>
                            <button onClick={() => window.location.href = "/buyer/payments"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Payment Methods</button>
                            <button onClick={() => window.location.href = "/buyer/payments"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Billing & Invoices</button>
                          </>
                        ) : null}
                        
                        <button onClick={() => window.location.href = isAdmin ? "/admin/settings" : isVendor ? "/vendor/settings" : "/buyer/settings"} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-md transition-colors">Settings</button>
                      </div>
                      <div className="p-2 border-t border-slate-50">
                        <button
                          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-md transition-colors font-medium cursor-pointer"
                          onClick={() => {
                            localStorage.removeItem("vendorMatchUserId");
                            localStorage.removeItem("vendorMatchToken");
                            window.location.href = "/";
                          }}
                        >
                          <LogIn size={16} className="rotate-180" /> Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <button className="text-slate-400 hover:text-indigo-600 transition-colors ml-2 cursor-pointer" title="Help / Support">
                  <HelpCircle size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
                <button
                  onClick={onOpenLogin}
                  className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition-colors hidden sm:block"
                >
                  Log In
                </button>
                <button
                  onClick={onOpenRegister}
                  className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold py-2 px-4 rounded-lg shadow-sm transition-colors flex items-center gap-2"
                >
                  <UserPlus size={16} /> Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
});

export default Header;
