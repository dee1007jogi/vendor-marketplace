/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, memo } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { User } from "../types";
import { Sun, Moon, Users, RotateCcw, ShieldCheck, Zap, LogIn, BellRing, UserPlus, Mail, Smartphone, Bell, HelpCircle, ChevronDown, Wallet, Sparkles, Store, ShoppingBag, User as UserIcon, Menu, X, ArrowRight, Layers, Percent, Navigation, Megaphone, Briefcase, Settings, FileText, LayoutDashboard } from "lucide-react";

import { useLiveLocation } from "../lib/geoService";
import Animated3DLetterAvatar from "./Animated3DLetterAvatar";
import PurpleCyberButton from "./ui/PurpleCyberButton";

interface HeaderProps {
  currentUser: User | null;
  allUsers: User[];
  onSwitchUser: (userId: string) => void;
  onResetDb: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenRegister: () => void;
  onOpenLogin: () => void;
  onOpenAdRunner?: () => void;
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
  onOpenAdRunner,
}: HeaderProps) {
  const isVendor = currentUser?.role?.toLowerCase() === "vendor";
  const isAdmin = currentUser?.role?.toLowerCase() === "admin";
  const navigate = useNavigate();
  const location = useLocation();

  const { cityName, isLive, loading: isLocating, detectLiveLocation } = useLiveLocation();

  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSwitchUser, setShowSwitchUser] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("bussinest-theme") as "light" | "dark") || 
             (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    }
    return "light";
  });

  useEffect(() => {
    localStorage.setItem("bussinest-theme", theme);
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
    <header className="sticky top-0 z-[60] w-full bg-white/85 backdrop-blur-3xl border-b border-white/80 shadow-md shadow-sky-950/5 animate-entrance-down">
      {/* Dev / Admin Bar - Glassy Pearl Sky */}
      <div className="bg-gradient-to-r from-sky-100/70 via-white/50 to-sky-100/70 backdrop-blur-xl text-sky-900 text-xs py-1.5 px-6 sm:px-10 lg:px-16 xl:px-20 border-b border-sky-200/40">
        <div className="flex items-center gap-4 mx-auto max-w-[1440px] w-full justify-between">
          <div className="flex items-center gap-2.5 sm:gap-4 flex-wrap">
            <button
              onClick={detectLiveLocation}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-white/90 border border-sky-200 hover:bg-white text-[11px] font-bold text-sky-900 shadow-2xs transition-all cursor-pointer"
              title={isLive ? `Live GPS location detected: ${cityName}` : "Click to refresh GPS location"}
            >
              <span className="relative flex h-2 w-2">
                {isLive && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isLive ? "bg-emerald-500" : isLocating ? "bg-amber-400 animate-pulse" : "bg-sky-400"}`}></span>
              </span>
              <Navigation size={11} className={isLive ? "text-emerald-600 fill-emerald-600" : "text-sky-600"} />
              <span>{isLocating ? "Detecting location..." : `📍 ${cityName || "Pune"} ${isLive ? "(Live GPS)" : ""}`}</span>
            </button>
            <span className="font-bold text-sky-900 hidden sm:flex items-center gap-1.5"><ShieldCheck size={14} className="text-emerald-600"/> Dev/Admin Mode</span>
            <button onClick={onResetDb} className="hidden sm:flex items-center gap-1 text-sky-700 hover:text-sky-900 font-semibold transition-colors cursor-pointer"><RotateCcw size={12} /> Reset Database</button>
          </div>
          <div className="flex items-center gap-2 relative">
            <span className="hidden sm:flex items-center gap-1 font-semibold text-sky-800"><Users size={12} /> Switch User:</span>
            <div className="relative">
              <button 
                onClick={() => setShowSwitchUser(!showSwitchUser)}
                className="bg-white/90 border border-sky-200 rounded-lg p-1.5 sm:px-2.5 sm:py-1 text-slate-800 outline-none cursor-pointer flex items-center justify-center sm:justify-between gap-2 min-w-0 sm:min-w-[180px] shadow-sm hover:bg-sky-50 transition-colors"
              >
                <div className="hidden sm:flex items-center gap-2">
                  {currentUser ? (
                    <>
                      {currentUser.role?.toLowerCase() === 'admin' ? <ShieldCheck size={14} className="text-emerald-600 shrink-0" /> : 
                       currentUser.role?.toLowerCase() === 'vendor' ? <Store size={14} className="text-sky-600 shrink-0" /> : 
                       <ShoppingBag size={14} className="text-amber-600 shrink-0" />}
                      <span className="truncate max-w-[140px] text-left font-bold text-xs">{currentUser.name}</span>
                    </>
                  ) : (
                    <>
                      <UserIcon size={14} className="text-slate-400 shrink-0" />
                      <span className="text-slate-600 font-medium text-xs">Guest</span>
                    </>
                  )}
                </div>
                <Menu size={16} className="text-sky-600 shrink-0" />
              </button>

              {showSwitchUser && (
                <>
                  <div className="fixed inset-0 z-[75]" onClick={() => setShowSwitchUser(false)}></div>
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-sky-200 rounded-2xl shadow-[0_20px_50px_rgba(2,132,199,0.18)] z-[80] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-3 border-b border-sky-100 bg-sky-50/80">
                      <p className="text-xs font-black text-sky-950 uppercase tracking-wider">Switch Active Persona</p>
                      <p className="text-[10px] text-slate-500 font-medium">Select an account or test as guest</p>
                    </div>

                    <button
                      onClick={() => { onSwitchUser(""); setShowSwitchUser(false); }}
                      className="w-full text-left px-3.5 py-2.5 hover:bg-sky-50/80 text-slate-800 flex items-center gap-3 transition-colors text-xs font-semibold cursor-pointer border-b border-sky-100/60"
                    >
                      <Animated3DLetterAvatar role="buyer" size="sm" title="Guest (B)" />
                      <div className="flex flex-col truncate flex-1">
                        <span className="font-bold text-xs text-slate-900">Guest (Logged out)</span>
                        <span className="text-[10px] text-sky-600 font-bold uppercase tracking-wider">Default Buyer (B)</span>
                      </div>
                    </button>

                    <div className="max-h-72 overflow-y-auto divide-y divide-sky-50">
                      {allUsers.map(u => (
                        <button
                          key={u.id}
                          onClick={() => { onSwitchUser(u.id); setShowSwitchUser(false); }}
                          className={`w-full text-left px-3.5 py-2.5 hover:bg-sky-50 text-slate-900 flex items-center gap-3 transition-colors cursor-pointer ${
                            currentUser?.id === u.id ? "bg-sky-50/60 border-l-4 border-sky-600" : ""
                          }`}
                        >
                          <Animated3DLetterAvatar role={u.role} size="sm" />
                          <div className="flex flex-col truncate flex-1">
                            <div className="flex items-center justify-between">
                              <span className="truncate font-bold leading-tight text-xs text-slate-900">{u.name}</span>
                              {currentUser?.id === u.id && (
                                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">Active</span>
                              )}
                            </div>
                            <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider mt-0.5">{u.role}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Main Navigation Row */}
      <div className="mx-auto max-w-[1440px] px-6 sm:px-10 lg:px-16 xl:px-20 w-full">
        <div className="flex h-14 sm:h-16 items-center justify-between gap-2">

          {/* Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 text-white shadow-md shadow-sky-600/20">
              <Zap className="fill-amber-300 stroke-amber-300 w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </div>
            <button onClick={() => { setActiveTab("home"); navigate("/"); }} className="cursor-pointer text-left flex items-center gap-1.5 shrink-0">
              <span className="text-base sm:text-lg font-black tracking-tight text-slate-900 font-heading whitespace-nowrap">
                Bussinest
              </span>
              <span className="hidden sm:inline-block text-[9px] bg-sky-100 text-sky-800 border border-sky-200/80 px-1.5 py-0.5 rounded-full font-mono uppercase font-bold shrink-0 whitespace-nowrap">
                B2B Wholesale
              </span>
            </button>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1.5 shrink-0 whitespace-nowrap">
            {(!currentUser || currentUser.role.toLowerCase() === "buyer") && (
              <button
                onClick={() => { setActiveTab("discover"); navigate("/vendors"); }}
                className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                  location.pathname.startsWith("/vendors") || activeTab === "discover"
                    ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs"
                    : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                }`}
                id="nav-discover"
              >
                Wholesale Directory
              </button>
            )}

            {(!currentUser) && (
              <>
                <button
                  onClick={() => {
                    setActiveTab("pricing");
                    navigate("/pricing");
                  }}
                  className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                    location.pathname === "/pricing" || activeTab === "pricing"
                      ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs"
                      : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                  }`}
                  id="nav-pricing"
                >
                  1–3% Tiered Pricing
                </button>
              </>
            )}

            
            {(!currentUser || currentUser.role.toLowerCase() === "buyer") && (
              <>
                {currentUser && (
                  <>
                    <button
                      onClick={() => { setActiveTab("buyer-dashboard"); navigate("/buyer/requirements"); }}
                      className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                        location.pathname.includes("/buyer/requirements") || activeTab === "buyer-dashboard"
                          ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs"
                          : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                      }`}
                      id="nav-buyer"
                    >
                      My Requirements
                    </button>
                    
                    <button
                      onClick={() => { navigate("/buyer/shortlist"); }}
                      className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                        location.pathname.includes("/buyer/shortlist")
                          ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs"
                          : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                      } relative`}
                    >
                      Shortlist
                      <span className="ml-1 inline-flex items-center justify-center bg-sky-200 text-sky-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">3</span>
                    </button>
                    
                    <button
                      onClick={() => { setActiveTab("chats"); navigate("/chats"); }}
                      className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                        location.pathname.startsWith("/chats") || activeTab === "chats"
                          ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs"
                          : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                      } relative`}
                    >
                      Chat
                      <span className="ml-1 inline-flex items-center justify-center bg-rose-100 text-rose-700 text-[10px] font-bold px-1.5 py-0.2 rounded-full">2</span>
                    </button>
                  </>
                )}
                <div className="ml-1 border-l border-sky-100 pl-2 flex items-center">
                  <button
                    onClick={() => {
                      navigate("/post-requirement");
                    }}
                    className="whitespace-nowrap px-4 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-extrabold cursor-pointer neo-btn-primary flex items-center justify-center gap-1.5 shrink-0 active:scale-95 shadow-sm"
                    id="nav-post-req"
                    title="Post Your Requirements"
                  >
                    <span>Post Requirements</span>
                    <Sparkles size={13} className="fill-sky-200" />
                  </button>
                </div>
              </>
            )}

            {isVendor && (
              <>
                <button onClick={() => { setActiveTab("vendor-dashboard"); navigate("/vendor/dashboard"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname === "/vendor/dashboard" ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"}`}>
                  Dashboard
                </button>
                <button onClick={() => { navigate("/vendor/leads"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname === "/vendor/leads" ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"} relative`}>
                  Leads
                </button>
                <button onClick={() => { navigate("/vendor/quotes"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname === "/vendor/quotes" ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"}`}>
                  Quotes
                </button>
                <button onClick={() => { navigate("/vendor/projects"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname === "/vendor/projects" ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"}`}>
                  Projects
                </button>
                <button onClick={() => { setActiveTab("chats"); navigate("/chats"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname.startsWith("/chats") ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"} relative`}>
                  Chat
                </button>
                <button onClick={() => { navigate("/vendor/analytics"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname === "/vendor/analytics" ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"}`}>
                  Analytics
                </button>
                <button onClick={() => { navigate("/vendor/wallet"); }} className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${location.pathname === "/vendor/wallet" ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs" : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"} flex items-center gap-1.5`}>
                  Wallet
                </button>
              </>
            )}

            {isAdmin && (
              <button
                onClick={() => { setActiveTab("admin"); navigate("/admin/dashboard"); }}
                className={`whitespace-nowrap px-3.5 py-2 h-9.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center cursor-pointer ${
                  location.pathname.startsWith("/admin")
                    ? "bg-sky-100 text-sky-800 font-extrabold shadow-2xs"
                    : "text-slate-600 hover:text-sky-700 hover:bg-sky-50/80"
                }`}
                id="nav-admin"
              >
                Admin Panel
              </button>
            )}

          </nav>

          {/* User profile controls & action buttons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 whitespace-nowrap">
            {currentUser ? (
              <div className="flex items-center gap-1 sm:gap-1.5 border-l border-slate-200 pl-2 sm:pl-3 shrink-0">
                <button
                  onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                  className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors cursor-pointer shrink-0"
                  title="Toggle Dark Mode"
                >
                  {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
                </button>

                <div className="relative shrink-0">
                  <button onClick={handleOpenNotifications} className="p-1.5 text-slate-400 hover:text-sky-600 transition-colors relative shrink-0">
                    <BellRing size={18} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  
                  {showNotifications && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-[0_20px_50px_rgba(2,132,199,0.18)] border border-sky-100 overflow-hidden z-[80]">
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
                    className="flex items-center gap-2 hover:bg-slate-50 p-1.5 pr-2.5 rounded-xl transition-all cursor-pointer ml-1 border border-slate-200/80 bg-white shadow-xs"
                  >
                    <Animated3DLetterAvatar 
                      role={currentUser.role} 
                      size="sm" 
                      customImage={currentUser?.useCustomAvatar ? (currentUser?.customAvatar || currentUser?.avatar) : undefined}
                      useCustomAvatar={currentUser?.useCustomAvatar}
                    />
                    <span className="text-xs font-semibold text-slate-700 hidden sm:inline max-w-[85px] truncate">
                      {currentUser.name.split(' ')[0]}
                    </span>
                    <ChevronDown size={13} className={`text-slate-400 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {showUserMenu && (
                    <>
                      <div className="fixed inset-0 z-[75]" onClick={() => setShowUserMenu(false)} />
                      <div className="absolute right-0 mt-2.5 w-60 bg-white/98 backdrop-blur-2xl rounded-2xl shadow-2xl shadow-sky-950/15 border border-sky-100 overflow-hidden z-[85] animate-entrance-down">
                        {/* User Info */}
                        <div className="px-4 py-3.5 border-b border-sky-100/80 flex items-center gap-3 bg-gradient-to-r from-sky-50/70 to-white">
                          <Animated3DLetterAvatar 
                            role={currentUser.role} 
                            size="md" 
                            customImage={currentUser?.useCustomAvatar ? (currentUser?.customAvatar || currentUser?.avatar) : undefined}
                            useCustomAvatar={currentUser?.useCustomAvatar}
                          />
                          <div className="overflow-hidden flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate leading-tight">{currentUser.name}</p>
                            <p className="text-[10px] text-slate-500 truncate mt-0.5 font-medium">{currentUser.email}</p>
                            <span className="inline-block text-[9px] font-extrabold text-sky-700 bg-sky-100/80 px-1.5 py-0.2 rounded-md uppercase tracking-wider mt-1 border border-sky-200/60">
                              {currentUser.role} Account
                            </span>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1.5 px-1.5 space-y-0.5">
                          {currentUser.role.toLowerCase() === "buyer" ? (
                            <>
                              <button onClick={() => { setShowUserMenu(false); navigate("/buyer/profile"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <UserIcon size={14} className="text-sky-600" /> Company Profile
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/buyer/requirements"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <FileText size={14} className="text-sky-600" /> My Requirements
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/buyer/settings"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <Settings size={14} className="text-sky-600" /> Settings
                              </button>
                            </>
                          ) : isVendor ? (
                            <>
                              <button onClick={() => { setShowUserMenu(false); navigate("/vendor/profile"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <Store size={14} className="text-sky-600" /> Company Profile
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/vendor/dashboard"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <LayoutDashboard size={14} className="text-sky-600" /> Vendor Dashboard
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/vendor/settings"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <Settings size={14} className="text-sky-600" /> Settings
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/vendor/portfolio"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <Briefcase size={14} className="text-sky-600" /> Portfolio
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/vendor/wallet"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <Wallet size={14} className="text-sky-600" /> Billing & Wallet
                              </button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => { setShowUserMenu(false); navigate("/admin/dashboard"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <LayoutDashboard size={14} className="text-sky-600" /> Admin Dashboard
                              </button>
                              <button onClick={() => { setShowUserMenu(false); navigate("/admin/settings"); }} className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:text-sky-800 hover:bg-sky-50 rounded-xl transition-colors cursor-pointer font-bold flex items-center gap-2.5">
                                <Settings size={14} className="text-sky-600" /> System Settings
                              </button>
                            </>
                          )}
                        </div>

                        <div className="p-1 border-t border-sky-100 bg-slate-50/50">
                          <button
                            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-rose-600 hover:bg-rose-50 rounded-xl transition-colors font-extrabold cursor-pointer"
                            onClick={() => {
                              localStorage.removeItem("vendorMatchUserId");
                              localStorage.removeItem("vendorMatchToken");
                              setShowUserMenu(false);
                              onSwitchUser("");
                              navigate("/");
                            }}
                          >
                            <LogIn size={14} className="rotate-180" /> Sign Out
                          </button>
                        </div>
                      </div>
                    </>
                  )}

                </div>

                <button className="text-slate-400 hover:text-sky-600 transition-colors ml-2 cursor-pointer hidden sm:block" title="Help / Support">
                  <HelpCircle size={20} />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 sm:gap-3 border-l border-sky-100 pl-3 sm:pl-4">
                {/* 3D Animated Default B token for guest / not logged in */}
                <div 
                  className="flex items-center gap-1.5 px-2.5 py-1.5 h-9.5 rounded-xl bg-sky-50/70 border border-sky-100/80 cursor-pointer hover:bg-sky-100/70 transition-colors"
                  onClick={onOpenLogin}
                  title="Guest Buyer Profile (3D 'B' Default Token) — Click to Log In"
                >
                  <Animated3DLetterAvatar role="buyer" size="sm" />
                  <span className="hidden xl:inline text-[11px] font-extrabold text-sky-800 uppercase tracking-wider">Guest</span>
                </div>
                <button
                  onClick={onOpenLogin}
                  className="text-xs sm:text-sm font-bold text-sky-900 bg-sky-50/80 hover:bg-sky-100 border border-sky-200/80 transition-all hidden sm:flex items-center justify-center cursor-pointer px-3.5 h-9.5 rounded-xl shadow-2xs"
                >
                  Log In
                </button>

                <div className="flex items-center h-9.5">
                  <PurpleCyberButton
                    size="sm"
                    variant="blue"
                    textState1="Join Today"
                    textState2="Join Now"
                    onClick={onOpenRegister}
                  />
                </div>
              </div>
            )}

            {/* Mobile Hamburger Menu Toggle Button */}
            <button
              onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}
              className="md:hidden p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-900 transition-colors cursor-pointer border border-sky-200/80 ml-1 min-w-[44px] min-h-[44px] flex items-center justify-center shadow-sm"
              aria-label="Toggle Mobile Navigation"
            >
              {isMobileNavOpen ? <X size={20} className="text-sky-700" /> : <Menu size={20} className="text-sky-700" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileNavOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-2xl border-b border-sky-200/80 shadow-2xl px-4 py-5 space-y-3 animate-in slide-in-from-top duration-200">
          {/* Profile / Guest Status Badge */}
          {currentUser ? (
            <div className="flex items-center gap-3 p-3 bg-sky-50/70 border border-sky-100 rounded-2xl mb-1">
              <Animated3DLetterAvatar role={currentUser.role} size="md" />
              <div className="overflow-hidden flex-1">
                <p className="text-sm font-bold text-slate-900 truncate">{currentUser.name}</p>
                <p className="text-xs text-sky-700 font-semibold uppercase tracking-wider">{currentUser.role} Account</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3 bg-sky-50/70 border border-sky-100 rounded-2xl mb-1">
              <Animated3DLetterAvatar role="buyer" size="md" />
              <div className="overflow-hidden flex-1">
                <p className="text-xs font-bold text-slate-900">Welcome, Guest Buyer (B)</p>
                <p className="text-[11px] text-slate-500">Sign in to access wholesale orders & quotes</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 gap-2">
            <button
              onClick={() => { setActiveTab("discover"); setIsMobileNavOpen(false); navigate("/vendors"); }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <Store size={18} className="text-sky-600" />
                <span>Wholesale Directory (120+ Sectors)</span>
              </div>
              <ChevronDown size={16} className="-rotate-90 text-sky-400" />
            </button>

            <button
              onClick={() => { setActiveTab("pricing"); setIsMobileNavOpen(false); navigate("/pricing"); }}
              className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
            >
              <div className="flex items-center gap-3">
                <Percent size={18} className="text-sky-600" />
                <span>1–3% Tiered Platform Pricing</span>
              </div>
              <ChevronDown size={16} className="-rotate-90 text-sky-400" />
            </button>

            {currentUser && (
              <>
                {currentUser.role?.toLowerCase() === "buyer" && (
                  <>
                    <button
                      onClick={() => { setIsMobileNavOpen(false); navigate("/buyer/requirements"); }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
                    >
                      <div className="flex items-center gap-3">
                        <ShoppingBag size={18} className="text-sky-600" />
                        <span>My RFQs & Quotes</span>
                      </div>
                      <ChevronDown size={16} className="-rotate-90 text-sky-400" />
                    </button>
                    <button
                      onClick={() => { setIsMobileNavOpen(false); navigate("/chats"); }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
                    >
                      <div className="flex items-center gap-3">
                        <Bell size={18} className="text-sky-600" />
                        <span>Supplier Chats</span>
                      </div>
                      <span className="bg-rose-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                    </button>
                  </>
                )}

                {currentUser.role?.toLowerCase() === "vendor" && (
                  <>
                    <button
                      onClick={() => { setIsMobileNavOpen(false); navigate("/vendor/dashboard"); }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
                    >
                      <div className="flex items-center gap-3">
                        <Store size={18} className="text-sky-600" />
                        <span>Vendor Dashboard</span>
                      </div>
                      <ChevronDown size={16} className="-rotate-90 text-sky-400" />
                    </button>
                    <button
                      onClick={() => { setIsMobileNavOpen(false); navigate("/vendor/leads"); }}
                      className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
                    >
                      <div className="flex items-center gap-3">
                        <Zap size={18} className="text-amber-500" />
                        <span>Leads Inbox</span>
                      </div>
                      <ChevronDown size={16} className="-rotate-90 text-sky-400" />
                    </button>
                  </>
                )}

                {currentUser.role?.toLowerCase() === "admin" && (
                  <button
                    onClick={() => { setIsMobileNavOpen(false); navigate("/admin/dashboard"); }}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl bg-sky-50/70 hover:bg-sky-100 text-slate-800 font-bold text-sm transition-colors border border-sky-100 min-h-[48px]"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldCheck size={18} className="text-emerald-600" />
                      <span>Admin Command Center</span>
                    </div>
                    <ChevronDown size={16} className="-rotate-90 text-sky-400" />
                  </button>
                )}
              </>
            )}

            {/* Prominent Mobile Post RFQ CTA */}
            <button
              onClick={() => {
                setIsMobileNavOpen(false);
                navigate("/post-requirement");
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-sky-600 via-sky-500 to-blue-600 text-white font-black text-sm shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2 cursor-pointer min-h-[48px] mt-2"
            >
              <Sparkles size={16} className="fill-amber-300 stroke-amber-300" />
              <span>Post Your Requirements (Instant RFQ)</span>
              <ArrowRight size={16} />
            </button>
          </div>

          {!currentUser && (
            <div className="grid grid-cols-2 gap-2.5 pt-3 border-t border-sky-100">
              <button
                onClick={() => { setIsMobileNavOpen(false); onOpenLogin(); }}
                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 min-h-[44px]"
              >
                <LogIn size={15} /> Log In
              </button>
              <button
                onClick={() => { setIsMobileNavOpen(false); onOpenRegister(); }}
                className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md min-h-[44px]"
              >
                <UserPlus size={15} /> Register Free
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
});

export default Header;
