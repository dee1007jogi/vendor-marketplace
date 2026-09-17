import React, { useState } from "react";
import { 
  Search, Bell, ChevronLeft, ChevronRight, Play, Pause, SkipBack, SkipForward, 
  Repeat, Shuffle, Home, BarChart2, MessageSquare, Settings, Crown, Calendar as CalendarIcon,
  Sliders, Zap, RefreshCw, CheckCircle2
} from "lucide-react";

export const NeomorphicKitShowcase: React.FC = () => {
  // Interactive state
  const [searchValue, setSearchValue] = useState("");
  const [activeNav, setActiveNav] = useState("Home Base");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isSyncActive, setIsSyncActive] = useState(true);
  const [selectedDate, setSelectedDate] = useState(11);
  const [sliderValues, setSliderValues] = useState([40, 75, 25, 85, 60, 35, 70]);

  const navItems = [
    { name: "Home Base", icon: Home },
    { name: "Data Analytics", icon: BarChart2 },
    { name: "Messages", icon: MessageSquare },
    { name: "Preferences", icon: Settings },
  ];

  const daysOfWeek = ["S", "M", "T", "W", "T", "F", "S"];
  const daysInMonth = Array.from({ length: 28 }, (_, i) => i + 1);

  const handleSliderChange = (index: number, val: number) => {
    const next = [...sliderValues];
    next[index] = val;
    setSliderValues(next);
  };

  return (
    <div className="min-h-screen bg-[#e9eff6] text-slate-800 p-4 sm:p-8 lg:p-12 font-sans flex items-center justify-center">
      {/* Outer Neomorphic Main Window */}
      <div className="w-full max-w-[1320px] bg-[#e9eff6] rounded-3xl p-6 sm:p-8 shadow-[16px_16px_36px_rgba(163,177,198,0.45),-16px_-16px_36px_rgba(255,255,255,0.95)] border border-white/60 space-y-6">
        
        {/* TOP HEADER BAR */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-2">
          {/* Search Box - Deep Inset Neomorphic Well */}
          <div className="w-full md:w-2/3 relative flex items-center">
            <div className="w-full bg-[#e9eff6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] rounded-full py-3.5 px-5 pl-12 flex items-center border border-white/40">
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Type to search elements, layers..."
                className="w-full bg-transparent text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
              />
            </div>
            <Search size={18} className="absolute left-4 text-slate-400 pointer-events-none" />
          </div>

          {/* Header Controls: Sort Dropdown & Bell Notification */}
          <div className="flex items-center gap-4 w-full md:w-auto justify-end">
            <div className="bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] rounded-full px-5 py-2.5 flex items-center gap-2 cursor-pointer hover:shadow-md transition-all text-xs font-bold text-slate-600 border border-white/60">
              <span>Sort: <strong className="text-slate-900">Date</strong></span>
              <ChevronRight size={14} className="rotate-90 text-slate-400" />
            </div>

            <button className="relative w-11 h-11 rounded-full bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] flex items-center justify-center text-slate-600 hover:text-purple-600 transition-all border border-white/60 cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-600 animate-ping" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-purple-600" />
            </button>
          </div>
        </div>

        {/* MAIN DASHBOARD CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 1. LEFT SIDEBAR PANEL (Col 1-3) */}
          <div className="lg:col-span-3 bg-[#e9eff6] rounded-3xl p-6 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.9)] border border-white/60 flex flex-col justify-between space-y-8">
            <div className="space-y-8">
              {/* Brand Header with Crown Logo */}
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-[4px_4px_10px_rgba(163,177,198,0.4)] flex items-center justify-center text-white">
                  <Crown size={22} className="fill-white" />
                </div>
                <div>
                  <h2 className="text-lg font-black text-purple-950 tracking-wider">UI KIT PRO</h2>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Soft Neomorphic</span>
                </div>
              </div>

              {/* User Avatar Circle */}
              <div className="flex justify-center my-4">
                <div className="w-20 h-20 rounded-full bg-[#e9eff6] shadow-[inset_4px_4px_8px_rgba(163,177,198,0.4),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] p-1.5 flex items-center justify-center border border-white/60">
                  <div className="w-full h-full rounded-full bg-slate-300/60 flex items-center justify-center text-slate-500">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Left Menu Items */}
              <nav className="space-y-3">
                {navItems.map((item) => {
                  const isActive = activeNav === item.name;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveNav(item.name)}
                      className={`w-full py-3 px-4 rounded-full text-xs font-black transition-all flex items-center gap-3 cursor-pointer ${
                        isActive
                          ? "bg-purple-700 text-white shadow-[6px_6px_14px_rgba(91,33,182,0.35)]"
                          : "text-slate-500 hover:text-purple-700 hover:bg-white/40"
                      }`}
                    >
                      <item.icon size={16} className={isActive ? "text-white" : "text-slate-400"} />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom 75% Circular Progress Indicator */}
            <div className="flex flex-col items-center justify-center pt-4">
              <div className="relative w-28 h-28 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-200"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="text-purple-700"
                    strokeDasharray="75, 100"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute font-black text-slate-800 text-base">75%</span>
              </div>
            </div>
          </div>

          {/* 2. MIDDLE DASHBOARD CARDS (Col 4-8) */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            {/* PERFORMANCE SLIDERS CARD */}
            <div className="bg-[#e9eff6] rounded-3xl p-6 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.9)] border border-white/60 space-y-6 flex-1 flex flex-col justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">PERFORMANCE SLIDERS</h3>
              
              <div className="flex items-end justify-between px-4 h-48 py-2">
                {sliderValues.map((val, idx) => (
                  <div key={idx} className="flex flex-col items-center h-full justify-end group">
                    <div className="relative w-4 h-full bg-[#e9eff6] shadow-[inset_2px_2px_5px_rgba(163,177,198,0.4),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] rounded-full flex flex-col justify-end p-0.5 overflow-hidden">
                      <div 
                        style={{ height: `${val}%` }}
                        className="w-full bg-purple-700 rounded-full transition-all duration-300 relative"
                      />
                      {/* Floating Handle Knob */}
                      <div 
                        style={{ bottom: `calc(${val}% - 8px)` }}
                        className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-white shadow-md border-2 border-purple-700 z-10 cursor-pointer"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MEDIA CONTROL HUB CARD */}
            <div className="bg-[#e9eff6] rounded-3xl p-6 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.9)] border border-white/60 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">MEDIA CONTROL HUB</h3>

              <div className="flex items-center justify-around py-2">
                <button className="p-3 text-slate-400 hover:text-purple-700 transition-colors cursor-pointer">
                  <Shuffle size={18} />
                </button>
                <button className="w-10 h-10 rounded-full bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] flex items-center justify-center text-slate-600 hover:text-purple-700 transition-all border border-white/60 cursor-pointer">
                  <SkipBack size={16} />
                </button>

                {/* Main Circular Arc Play Button */}
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-700"
                      strokeDasharray="65, 100"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <button 
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="absolute w-16 h-16 rounded-full bg-[#e9eff6] shadow-[6px_6px_14px_rgba(163,177,198,0.4),-6px_-6px_14px_rgba(255,255,255,0.95)] flex items-center justify-center text-purple-700 border border-white/80 cursor-pointer hover:scale-105 transition-transform"
                  >
                    {isPlaying ? <Pause size={22} className="fill-purple-700" /> : <Play size={22} className="fill-purple-700 translate-x-0.5" />}
                  </button>
                </div>

                <button className="w-10 h-10 rounded-full bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] flex items-center justify-center text-slate-600 hover:text-purple-700 transition-all border border-white/60 cursor-pointer">
                  <SkipForward size={16} />
                </button>
                <button className="p-3 text-slate-400 hover:text-purple-700 transition-colors cursor-pointer">
                  <Repeat size={18} />
                </button>
              </div>
            </div>

          </div>

          {/* 3. RIGHT PANEL CARDS (Col 9-12) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col justify-between">
            
            {/* CALENDAR WIDGET CARD */}
            <div className="bg-[#e9eff6] rounded-3xl p-6 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.9)] border border-white/60 space-y-4">
              <div className="flex items-center justify-between text-xs font-black text-purple-950 uppercase tracking-widest">
                <button className="p-1 hover:text-purple-700 transition-colors cursor-pointer"><ChevronLeft size={16} /></button>
                <span>NOVEMBER 2026</span>
                <button className="p-1 hover:text-purple-700 transition-colors cursor-pointer"><ChevronRight size={16} /></button>
              </div>

              {/* Calendar Days Header */}
              <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-slate-400">
                {daysOfWeek.map((d, idx) => <span key={idx}>{d}</span>)}
              </div>

              {/* Calendar Date Grid */}
              <div className="grid grid-cols-7 gap-1.5 text-center text-xs font-extrabold text-slate-700">
                {daysInMonth.map((day) => {
                  const isSelected = selectedDate === day;
                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(day)}
                      className={`h-7 w-7 mx-auto rounded-full flex items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? "bg-purple-700 text-white shadow-[4px_4px_10px_rgba(91,33,182,0.35)]"
                          : "hover:bg-white/60"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS CARD */}
            <div className="bg-[#e9eff6] rounded-3xl p-6 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.9)] border border-white/60 space-y-5">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">QUICK ACTIONS</h3>

              {/* Sync Toggle Switch */}
              <div className="flex items-center gap-3">
                <div 
                  onClick={() => setIsSyncActive(!isSyncActive)}
                  className={`w-20 h-9 rounded-full p-1 transition-all cursor-pointer flex items-center justify-between shadow-[inset_3px_3px_6px_rgba(163,177,198,0.4),inset_-3px_-3px_6px_rgba(255,255,255,0.95)] ${
                    isSyncActive ? "bg-purple-700" : "bg-slate-200"
                  }`}
                >
                  <span className={`text-[10px] font-black pl-2.5 ${isSyncActive ? "text-white" : "text-transparent"}`}>SYNC</span>
                  <div className={`w-7 h-7 rounded-full bg-white shadow-md transition-transform ${isSyncActive ? "translate-x-0" : "-translate-x-8"}`} />
                  <span className={`text-[10px] font-black pr-2.5 ${!isSyncActive ? "text-slate-500" : "text-transparent"}`}>IDLE</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button className="w-full py-3.5 px-6 rounded-full bg-blue-600 hover:bg-blue-700 text-white font-black text-xs uppercase tracking-wider shadow-[6px_6px_14px_rgba(37,99,235,0.35),-6px_-6px_14px_rgba(255,255,255,0.9)] transition-all cursor-pointer active:translate-y-0.5">
                  APPLY CONFIGURATION
                </button>

                <button className="w-full py-3.5 px-6 rounded-full bg-[#e9eff6] hover:bg-white text-slate-500 hover:text-slate-900 font-extrabold text-xs uppercase tracking-wider shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/60 transition-all cursor-pointer">
                  RESET DEFAULTS
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default NeomorphicKitShowcase;
