/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Interactive Live Location & Proximity Vendor Map for Bussinest
 */

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  MapPin, Navigation, Compass, ShieldCheck, Star, Zap, Clock, 
  ChevronRight, Building2, Truck, SlidersHorizontal, RefreshCw,
  ExternalLink, Phone, ArrowUpRight, CheckCircle2, Lock
} from "lucide-react";
import { 
  useLiveLocation, 
  calculateHaversineDistanceKm, 
  getDispatchEstimate, 
  resolveCoordinatesForLocation,
  KNOWN_INDUSTRIAL_HUBS,
  GeoCoordinates
} from "../lib/geoService";

export interface ProximityVendor {
  id: string;
  name: string;
  category: string;
  location: string;
  creditScore: string;
  rating: number;
  reviews: number;
  responseTime: string;
  dealVolume: string;
  logo: string;
  tags: string[];
  capacity: string;
  startingPrice?: number;
  coords?: GeoCoordinates;
  slug?: string;
}

export interface VendorProximityMapProps {
  vendors: ProximityVendor[];
  onSelectVendor?: (vendor: ProximityVendor) => void;
  onRequestRfq?: (vendorName: string, category: string) => void;
}

export default function VendorProximityMap({ 
  vendors, 
  onSelectVendor,
  onRequestRfq 
}: VendorProximityMapProps) {
  const { 
    coords, 
    cityName, 
    stateName, 
    isLive, 
    loading, 
    error, 
    detectLiveLocation, 
    setManualHub 
  } = useLiveLocation();

  const [selectedRadiusKm, setSelectedRadiusKm] = useState<number>(150);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeVendorId, setActiveVendorId] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<"interactive" | "satellite">("interactive");

  // User reference coordinates
  const userLat = coords?.lat || 18.5204;
  const userLng = coords?.lng || 73.8567;

  // Compute live distances for all vendors
  const vendorsWithDistance = useMemo(() => {
    return vendors.map((v) => {
      const vCoords = v.coords || resolveCoordinatesForLocation(v.location);
      const distanceKm = calculateHaversineDistanceKm(userLat, userLng, vCoords.lat, vCoords.lng);
      const dispatch = getDispatchEstimate(distanceKm);

      return {
        ...v,
        vCoords,
        distanceKm,
        dispatch
      };
    }).sort((a, b) => a.distanceKm - b.distanceKm);
  }, [vendors, userLat, userLng]);

  // Filtered by radius & category
  const filteredVendors = useMemo(() => {
    return vendorsWithDistance.filter((v) => {
      const matchRadius = v.distanceKm <= selectedRadiusKm;
      const matchCat = selectedCategory === "all" || v.category.toLowerCase().includes(selectedCategory.toLowerCase());
      return matchRadius && matchCat;
    });
  }, [vendorsWithDistance, selectedRadiusKm, selectedCategory]);

  const activeVendor = useMemo(() => {
    if (!activeVendorId) return filteredVendors[0] || vendorsWithDistance[0];
    return vendorsWithDistance.find(v => v.id === activeVendorId) || filteredVendors[0];
  }, [activeVendorId, filteredVendors, vendorsWithDistance]);

  return (
    <div className="w-full bg-white/90 backdrop-blur-3xl rounded-[2.5rem] border border-sky-200/90 shadow-2xl shadow-sky-950/10 p-5 sm:p-8 lg:p-10 relative overflow-hidden">
      
      {/* Top Animated Gold Line */}
      <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

      {/* Header Bar with Live Location Status & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-sky-100">
        
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2 border border-sky-200 shadow-xs">
            <Compass size={14} className="text-sky-600 animate-spin-slow" />
            <span>Live Geolocation & Factory Proximity</span>
          </div>
          <h3 className="text-2xl sm:text-3xl font-black font-heading text-slate-900 tracking-tight flex items-center gap-2">
            <span>Suppliers Near</span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600 underline decoration-amber-400 decoration-2">
              {cityName || "Your Industrial Cluster"}
            </span>
            {isLive && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-black border border-emerald-200 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" /> Live GPS
              </span>
            )}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Real-time highway distance calculation, same-day freight routes, and local factory verification.
          </p>
        </div>

        {/* Live GPS Trigger & Hub Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Detect Live GPS Button */}
          <button
            onClick={detectLiveLocation}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold text-xs shadow-md shadow-sky-600/25 transition-all flex items-center gap-2 cursor-pointer active:scale-95 disabled:opacity-60"
            title="Request live browser location"
          >
            {loading ? (
              <RefreshCw size={14} className="animate-spin" />
            ) : (
              <Navigation size={14} className={isLive ? "text-amber-300" : ""} />
            )}
            <span>{loading ? "Acquiring GPS..." : isLive ? "Refresh Live GPS" : "Detect My Live Location"}</span>
          </button>

          {/* Quick Hub Dropdown Selector */}
          <div className="relative">
            <select
              value={cityName.toLowerCase()}
              onChange={(e) => setManualHub(e.target.value)}
              className="px-3.5 py-2.5 bg-sky-50/80 hover:bg-sky-100/80 text-sky-900 font-bold text-xs rounded-xl border border-sky-200 transition-colors cursor-pointer outline-none shadow-xs"
              aria-label="Select manual industrial hub"
            >
              {Object.entries(KNOWN_INDUSTRIAL_HUBS).map(([key, hub]) => (
                <option key={key} value={key}>
                  {hub.name} ({hub.state})
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {error && (
        <div className="my-4 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs font-semibold text-amber-900 flex items-center justify-between">
          <span>{error}</span>
        </div>
      )}

      {/* Main Map & Proximity Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-stretch">
        
        {/* Left Column (7 cols): Interactive Radar Map Canvas */}
        <div className="lg:col-span-7 flex flex-col justify-between">
          
          {/* Map Container */}
          <div className="relative w-full h-[360px] sm:h-[420px] rounded-3xl overflow-hidden border-2 border-sky-200/90 shadow-xl shadow-sky-500/10 bg-gradient-to-br from-[#f0f7ff] via-white to-[#e0f0fe] flex flex-col justify-between p-4 text-slate-900">
            
            {/* Background Radar Grid Pattern */}
            <div 
              className="absolute inset-0 opacity-40 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle at center, rgba(2, 132, 199, 0.25) 1px, transparent 1px), linear-gradient(to right, rgba(2, 132, 199, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.08) 1px, transparent 1px)",
                backgroundSize: "40px 40px"
              }}
            />

            {/* Simulated Live Concentric Radar Wave Rings */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border-2 border-sky-400/30 rounded-full pointer-events-none animate-ping duration-1000" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border border-sky-400/25 rounded-full pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] border border-sky-300/20 rounded-full pointer-events-none" />

            {/* Top Tactical Map Overlay Bar */}
            <div className="relative z-10 flex items-center justify-between">
              
              <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-sky-200 text-xs font-mono font-bold text-slate-800 flex items-center gap-2 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>GPS: {userLat.toFixed(4)}° N, {userLng.toFixed(4)}° E</span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md p-1 rounded-xl border border-sky-200 text-[11px] font-bold shadow-sm">
                <div className="hidden sm:flex items-center gap-1.5 px-2 text-sky-700 text-[10px] font-mono border-r border-sky-100">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="font-extrabold text-sky-800">LIVE ROUTE SIMULATOR</span>
                </div>
                <button
                  onClick={() => setMapMode("interactive")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${mapMode === "interactive" ? "bg-sky-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  ⚡ Animated Routes
                </button>
                <button
                  onClick={() => setMapMode("satellite")}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${mapMode === "satellite" ? "bg-sky-600 text-white shadow-xs" : "text-slate-600 hover:text-slate-900"}`}
                >
                  OpenStreetMap
                </button>
              </div>

            </div>

            {/* Interactive OpenStreetMap Iframe or Tactical Vector Pins */}
            {mapMode === "satellite" ? (
              <div className="absolute inset-0 z-0">
                <iframe
                  title="OpenStreetMap Live Cluster"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${userLng - 0.2}%2C${userLat - 0.15}%2C${userLng + 0.2}%2C${userLat + 0.15}&layer=mapnik&marker=${userLat}%2C${userLng}`}
                  className="opacity-80 filter contrast-110"
                />
              </div>
            ) : (
              /* Vector Radar Cluster with Animated Dynamic Route Paths */
              <div className="relative z-10 my-auto h-52 sm:h-64 w-full flex items-center justify-center overflow-visible">
                
                {/* SVG Route Animations Layer */}
                <svg 
                  className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-0" 
                  viewBox="-300 -130 600 260"
                  style={{ overflow: "visible" }}
                >
                  <defs>
                    <linearGradient id="goldRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.8" />
                      <stop offset="50%" stopColor="#f59e0b" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.9" />
                    </linearGradient>

                    <linearGradient id="skyRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.4" />
                    </linearGradient>

                    <filter id="routeGlow" x="-30%" y="-30%" width="160%" height="160%">
                      <feGaussianBlur stdDeviation="3.5" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>

                  {/* Render animated curved route paths for each nearby supplier */}
                  {filteredVendors.slice(0, 5).map((v, i) => {
                    const angle = (i * (360 / Math.min(filteredVendors.length, 5)) + 30) * (Math.PI / 180);
                    const radiusPx = 75 + (i * 24);
                    const vx = Math.cos(angle) * radiusPx;
                    const vy = Math.sin(angle) * (radiusPx * 0.7);
                    const isSelected = activeVendor?.id === v.id;

                    // Organic bezier curve control point offset
                    const midX = vx * 0.5;
                    const midY = vy * 0.5;
                    const curveOffset = (i % 2 === 0 ? 1 : -1) * 24;
                    const cx = midX - (Math.sin(angle) * curveOffset);
                    const cy = midY + (Math.cos(angle) * curveOffset);

                    const pathD = `M 0 0 Q ${cx} ${cy} ${vx} ${vy}`;
                    const pathReverseD = `M ${vx} ${vy} Q ${cx} ${cy} 0 0`;
                    const pathId = `route-curve-${v.id}-${i}`;

                    return (
                      <g key={`route-${v.id}`}>
                        {/* Static/Glow Highway Route Corridor */}
                        <path
                          d={pathD}
                          fill="none"
                          stroke={isSelected ? "url(#goldRouteGrad)" : "url(#skyRouteGrad)"}
                          strokeWidth={isSelected ? 4 : 2}
                          strokeOpacity={isSelected ? 0.95 : 0.35}
                          strokeLinecap="round"
                          filter={isSelected ? "url(#routeGlow)" : undefined}
                        />

                        {/* Animated Marching Dash Stream Line */}
                        <path
                          id={pathId}
                          d={pathD}
                          fill="none"
                          stroke={isSelected ? "#f59e0b" : "#38bdf8"}
                          strokeWidth={isSelected ? 2.5 : 1.5}
                          strokeDasharray="6 6"
                          className={isSelected ? "animate-route-flow-fast" : "animate-route-flow"}
                          strokeOpacity={isSelected ? 1 : 0.75}
                          strokeLinecap="round"
                        />

                        {/* Moving Glowing Delivery Packet / Freight Truck along route */}
                        <g>
                          <circle r={isSelected ? 5 : 3.5} fill={isSelected ? "#fbbf24" : "#0284c7"}>
                            <animateMotion repeatCount="indefinite" dur={isSelected ? "2.2s" : "3.6s"} path={pathReverseD} />
                          </circle>
                          <circle r={isSelected ? 10 : 6} fill={isSelected ? "rgba(251,191,36,0.35)" : "rgba(2,132,199,0.2)"}>
                            <animateMotion repeatCount="indefinite" dur={isSelected ? "2.2s" : "3.6s"} path={pathReverseD} />
                          </circle>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                {/* Center User Pin */}
                <div className="relative flex flex-col items-center z-10">
                  <div className="relative">
                    <span className="absolute -inset-2.5 rounded-full bg-sky-400 animate-ping opacity-60" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-blue-600 border-2 border-white shadow-xl flex items-center justify-center text-white font-black text-xs">
                      <MapPin size={16} className="fill-white" />
                    </div>
                  </div>
                  <div className="mt-1.5 px-2.5 py-0.5 rounded-full bg-white/95 border border-sky-300 backdrop-blur-md text-[10px] font-mono font-bold text-sky-900 tracking-wide shadow-md flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>📍 You ({cityName})</span>
                  </div>
                </div>

                {/* Floating Transit Route Waypoint Pill for Active Vendor */}
                {activeVendor && (() => {
                  const activeIdx = filteredVendors.slice(0, 5).findIndex(v => v.id === activeVendor.id);
                  if (activeIdx < 0) return null;
                  const angle = (activeIdx * (360 / Math.min(filteredVendors.length, 5)) + 30) * (Math.PI / 180);
                  const radiusPx = 75 + (activeIdx * 24);
                  const vx = Math.cos(angle) * radiusPx;
                  const vy = Math.sin(angle) * (radiusPx * 0.7);
                  const midX = vx * 0.52;
                  const midY = vy * 0.52;
                  const curveOffset = (activeIdx % 2 === 0 ? 1 : -1) * 24;
                  const cx = midX - (Math.sin(angle) * curveOffset);
                  const cy = midY + (Math.cos(angle) * curveOffset);

                  return (
                    <motion.div
                      key={`waypoint-${activeVendor.id}`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1, x: cx, y: cy }}
                      className="absolute z-20 pointer-events-none -translate-x-1/2 -translate-y-1/2"
                    >
                      <div className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-300 shadow-md flex items-center gap-1.5 text-[10px] font-bold text-amber-900 whitespace-nowrap">
                        <Truck size={12} className="text-amber-600 animate-bounce" />
                        <span className="font-mono">{activeVendor.distanceKm}km</span>
                        <span className="text-slate-300">•</span>
                        <span>{activeVendor.dispatch.transitTime}</span>
                      </div>
                    </motion.div>
                  );
                })()}

                {/* Satellite Vendor Pins positioned relative to user center */}
                {filteredVendors.slice(0, 5).map((v, i) => {
                  const angle = (i * (360 / Math.min(filteredVendors.length, 5)) + 30) * (Math.PI / 180);
                  const radiusPx = 75 + (i * 24);
                  const x = Math.cos(angle) * radiusPx;
                  const y = Math.sin(angle) * (radiusPx * 0.7);
                  const isSelected = activeVendor?.id === v.id;

                  return (
                    <motion.div
                      key={v.id}
                      animate={{ x, y }}
                      whileHover={{ scale: 1.15 }}
                      onClick={() => setActiveVendorId(v.id)}
                      className="absolute z-10 cursor-pointer flex flex-col items-center group"
                    >
                      <div className={`relative p-1 rounded-2xl transition-all ${
                        isSelected 
                          ? "bg-gradient-to-tr from-amber-400 to-amber-500 shadow-[0_0_20px_rgba(251,191,36,0.6)] scale-110" 
                          : "bg-white border-2 border-sky-200 hover:border-sky-500 shadow-md"
                      }`}>
                        <img 
                          src={v.logo} 
                          alt={v.name} 
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl object-cover bg-white" 
                        />
                        <span className={`absolute -top-2 -right-2 text-[9px] font-mono font-black px-1.5 py-0.2 rounded-full shadow-sm ${
                          isSelected ? "bg-amber-400 text-slate-950 font-bold" : "bg-sky-600 text-white"
                        }`}>
                          {v.distanceKm}km
                        </span>
                      </div>

                      <span className="text-[9px] font-bold text-slate-800 bg-white/95 px-1.5 py-0.5 rounded mt-1 truncate max-w-[90px] border border-sky-200 shadow-sm">
                        {v.name.split(" ")[0]}
                      </span>
                    </motion.div>
                  );
                })}

              </div>
            )}

            {/* Bottom Radius Filter Slider */}
            <div className="relative z-10 bg-white/95 backdrop-blur-md p-3 rounded-2xl border border-sky-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2">
                <SlidersHorizontal size={14} className="text-amber-500" />
                <span className="text-xs font-bold text-slate-700">Sourcing Radius:</span>
                <span className="text-xs font-mono font-black text-amber-800 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                  ≤ {selectedRadiusKm} KM
                </span>
              </div>

              <div className="flex items-center gap-2 flex-1 max-w-xs">
                <input 
                  type="range"
                  min={25}
                  max={600}
                  step={25}
                  value={selectedRadiusKm}
                  onChange={(e) => setSelectedRadiusKm(Number(e.target.value))}
                  className="w-full h-2 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600 border border-sky-200"
                />
              </div>

              <span className="text-[11px] font-bold text-slate-500 font-mono">
                {filteredVendors.length} Suppliers Found
              </span>
            </div>

          </div>

          {/* Quick Category Filter Chips */}
          <div className="flex flex-wrap items-center gap-2 mt-3.5">
            {[
              { id: "all", label: "All Sectors" },
              { id: "steel", label: "Steel & Alloys" },
              { id: "machinery", label: "Industrial CNC" },
              { id: "packaging", label: "Packaging" },
              { id: "chemicals", label: "Chemicals & APIs" }
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setSelectedCategory(chip.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === chip.id
                    ? "bg-sky-600 text-white shadow-sm shadow-sky-600/30"
                    : "bg-sky-50 text-slate-600 hover:bg-sky-100 hover:text-sky-900 border border-sky-100"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>

        </div>

        {/* Right Column (5 cols): Active Nearby Supplier Highlight Card */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          
          {activeVendor ? (
            <motion.div
              key={activeVendor.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-sky-200/90 shadow-xl flex flex-col justify-between h-full relative overflow-hidden group"
            >
              <div className="gold-line-animated absolute top-0 left-0 right-0 h-[2.5px]" />

              {/* Vendor Header */}
              <div>
                
                {/* Distance Badge & Dispatch Pill */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-black border border-emerald-200">
                    <MapPin size={13} className="text-emerald-600" />
                    <span>{activeVendor.distanceKm} km away</span>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                    activeVendor.dispatch.isSameDay 
                      ? "bg-amber-50 text-amber-900 border-amber-200" 
                      : "bg-sky-50 text-sky-800 border-sky-200"
                  }`}>
                    {activeVendor.dispatch.dispatchBadge}
                  </span>
                </div>

                {/* Vendor Brand Identity */}
                <div className="flex items-center gap-3.5 mb-3.5">
                  <img 
                    src={activeVendor.logo} 
                    alt={activeVendor.name} 
                    className="w-14 h-14 rounded-2xl object-cover border border-sky-100 shadow-sm shrink-0" 
                  />
                  <div>
                    <h4 className="text-base sm:text-lg font-black text-slate-900 font-heading leading-tight group-hover:text-sky-600 transition-colors">
                      {activeVendor.name}
                    </h4>
                    <p className="text-xs font-bold text-sky-700 mt-0.5">{activeVendor.category}</p>
                    <p className="text-[11px] text-slate-500 font-medium">{activeVendor.location}</p>
                  </div>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 gap-2 bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-xs mb-4">
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Credit Score</span>
                    <span className="font-black text-amber-950 flex items-center gap-1">
                      <Star size={12} className="fill-amber-500 text-amber-500" /> {activeVendor.creditScore}
                    </span>
                  </div>
                  <div>
                    <span className="block text-[10px] font-bold uppercase text-slate-400">Avg Dispatch SLA</span>
                    <span className="font-bold text-sky-900 flex items-center gap-1">
                      <Clock size={12} className="text-sky-600" /> {activeVendor.responseTime}
                    </span>
                  </div>
                </div>

                {/* Logistics Route Information */}
                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1 mb-4">
                  <div className="flex items-center justify-between font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5"><Truck size={13} className="text-sky-600" /> Freight Transit:</span>
                    <span className="text-slate-900 font-bold">{activeVendor.dispatch.transitTime}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Escrow Protection:</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1"><Lock size={11} /> 50/50 RBI Escrow</span>
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-2 border-t border-sky-100">
                <button
                  onClick={() => onRequestRfq ? onRequestRfq(activeVendor.name, activeVendor.category) : null}
                  className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap size={14} className="text-amber-300" />
                  <span>Request Local Instant RFQ</span>
                </button>

                <div className="grid grid-cols-2 gap-2">
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${activeVendor.vCoords.lat},${activeVendor.vCoords.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-[11px] font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ExternalLink size={12} />
                    <span>Get Directions</span>
                  </a>
                  <button
                    onClick={() => onSelectVendor ? onSelectVendor(activeVendor) : null}
                    className="py-2 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-[11px] font-bold transition-colors border border-sky-200 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ChevronRight size={12} />
                  </button>
                </div>
              </div>

            </motion.div>
          ) : (
            <div className="p-8 text-center bg-sky-50/50 rounded-3xl border border-sky-100 h-full flex flex-col items-center justify-center">
              <MapPin size={36} className="text-sky-300 mb-2" />
              <p className="text-xs font-bold text-slate-600">No verified suppliers within {selectedRadiusKm} km.</p>
              <button
                onClick={() => setSelectedRadiusKm(500)}
                className="mt-3 text-xs font-bold text-sky-700 hover:underline cursor-pointer"
              >
                Expand Sourcing Radius to 500 km
              </button>
            </div>
          )}

        </div>

      </div>

      {/* Closest Suppliers Horizontal Fast-Pick Strip */}
      <div className="mt-8 pt-6 border-t border-sky-100">
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Truck size={14} className="text-sky-600" /> Closest Verified Suppliers ({filteredVendors.length} within {selectedRadiusKm} km)
          </span>
          <span className="text-[11px] font-mono font-bold text-sky-700">
            Sorted by Proximity
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {filteredVendors.slice(0, 3).map((v) => (
            <div
              key={v.id}
              onClick={() => setActiveVendorId(v.id)}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                activeVendor?.id === v.id
                  ? "bg-sky-50/90 border-sky-400 ring-2 ring-sky-200 shadow-sm"
                  : "bg-white/70 hover:bg-sky-50/50 border-sky-100"
              }`}
            >
              <div className="flex items-center gap-3 min-w-0">
                <img src={v.logo} alt={v.name} className="w-10 h-10 rounded-xl object-cover border border-sky-100 bg-white shrink-0" />
                <div className="truncate">
                  <h5 className="font-bold text-xs text-slate-900 truncate">{v.name}</h5>
                  <p className="text-[10px] text-slate-500 font-medium truncate">{v.category} • {v.location}</p>
                </div>
              </div>

              <div className="text-right shrink-0">
                <span className="block font-black text-xs text-emerald-700 font-mono">📍 {v.distanceKm} km</span>
                <span className="text-[9px] font-bold text-slate-400">{v.dispatch.dispatchBadge.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
