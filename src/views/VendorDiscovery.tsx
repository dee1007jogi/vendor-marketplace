import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, SlidersHorizontal, MapPin, Star, Zap, ShieldCheck, 
  Grid, List as ListIcon, Map as MapIcon, ChevronDown, Check, 
  Building2, PaintRoller, Laptop, Heart, Navigation, RefreshCw,
  Compass, Truck, Sparkles, Phone, MessageSquare, Calendar, Clock,
  ChevronLeft, ChevronRight, Flame, Quote, ArrowRight, ArrowUpRight, DollarSign, X
} from "lucide-react";
import { 
  useLiveLocation, 
  calculateHaversineDistanceKm, 
  getDispatchEstimate, 
  resolveCoordinatesForLocation,
  KNOWN_INDUSTRIAL_HUBS 
} from "../lib/geoService";
import VendorProximityMap from "../components/VendorProximityMap";
import OriginAnimatedInput from "../components/originkit/OriginAnimatedInput";
import OriginStatusBadge from "../components/originkit/OriginStatusBadge";
import OriginGlowingCard from "../components/originkit/OriginGlowingCard";
import OriginSparkleButton from "../components/originkit/OriginSparkleButton";
import PastelVendorAvatar from "../components/PastelVendorAvatar";
import AppointmentModal from "../components/AppointmentModal";

// Curated business gallery image sets for business slider showcase
const getBusinessGalleryImages = (vendor: any) => {
  if (vendor.gallery && Array.isArray(vendor.gallery) && vendor.gallery.length > 0) return vendor.gallery;
  if (vendor.images && Array.isArray(vendor.images) && vendor.images.length > 0) return vendor.images;

  const sampleSets = [
    [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80"
    ],
    [
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
    ]
  ];

  let hash = 0;
  const str = vendor.id || vendor.businessName || "default";
  for (let idx = 0; idx < str.length; idx++) {
    hash = str.charCodeAt(idx) + ((hash << 5) - hash);
  }
  const setIndex = Math.abs(hash) % sampleSets.length;
  return sampleSets[setIndex];
};

// Interactive Business Media & Image Slider Box with Pastel & Glassy Aesthetics
const BusinessImageSlider = ({ vendor, rank, matchScore, openingHours }: any) => {
  const images = useMemo(() => getBusinessGalleryImages(vendor), [vendor]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [isFav, setIsFav] = useState(false);

  const nextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev + 1) % images.length);
  };

  const prevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFav = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFav(!isFav);
  };

  return (
    <div className="relative w-full h-56 sm:h-auto sm:w-64 shrink-0 overflow-hidden group/slider bg-slate-900 rounded-2xl sm:rounded-r-none">
      {/* Background Image Showcase */}
      <img
        src={images[activeIdx]}
        alt={`${vendor.businessName} facility ${activeIdx + 1}`}
        className="w-full h-full object-cover transition-all duration-500 group-hover/slider:scale-105"
        loading="lazy"
      />
      {/* Soft Pastel Glass Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/25 to-slate-950/30 pointer-events-none" />

      {/* Top Badges: Rank & Heart */}
      <div className="absolute top-3 left-3 right-3 flex justify-between items-center z-10">
        <div className="bg-white/85 text-slate-900 font-black text-[11px] px-2.5 py-1 rounded-xl shadow-md border border-white/90 backdrop-blur-xl">
          #{rank}
        </div>
        <button
          onClick={toggleFav}
          className="w-8 h-8 rounded-full bg-white/85 hover:bg-white backdrop-blur-xl flex items-center justify-center text-slate-700 hover:text-rose-500 transition-all shadow-md cursor-pointer border border-white/90"
        >
          <Heart size={16} className={isFav ? "fill-rose-500 text-rose-500" : ""} />
        </button>
      </div>

      {/* Slider Chevron Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 cursor-pointer border border-white/90 shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-white/80 hover:bg-white text-slate-900 backdrop-blur-xl flex items-center justify-center opacity-0 group-hover/slider:opacity-100 transition-opacity z-10 cursor-pointer border border-white/90 shadow-md"
            aria-label="Next image"
          >
            <ChevronRight size={16} />
          </button>

          {/* Carousel Dots */}
          <div className="absolute bottom-3 right-3 flex items-center gap-1 z-10 bg-white/70 backdrop-blur-xl px-2 py-1 rounded-full border border-white/80 shadow-sm">
            {images.map((_: any, idx: number) => (
              <span
                key={idx}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setActiveIdx(idx);
                }}
                className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${
                  idx === activeIdx ? "bg-slate-900 w-3" : "bg-slate-600/60 hover:bg-slate-900"
                }`}
              />
            ))}
          </div>
        </>
      )}

      {/* Floating Pastel Profile Avatar & Badges */}
      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2.5">
        <PastelVendorAvatar
          src={vendor.logo}
          name={vendor.businessName}
          size="md"
          className="border-2 border-white shadow-2xl ring-2 ring-sky-200/50"
          showStatusDot={true}
        />
        <div className="flex flex-col gap-1">
          {matchScore && (
            <span className="px-2.5 py-0.5 bg-amber-100/95 text-amber-950 backdrop-blur-xl text-[10px] font-black rounded-full shadow-sm border border-amber-200/90 flex items-center gap-1 w-fit">
              <Flame size={12} className="text-amber-500 fill-amber-400" /> {matchScore}% Match
            </span>
          )}
          <span className="px-2.5 py-0.5 bg-emerald-100/95 text-emerald-950 backdrop-blur-xl text-[10px] font-bold rounded-full shadow-sm border border-emerald-200/90 flex items-center gap-1 w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {openingHours}
          </span>
        </div>
      </div>
    </div>
  );
};

// Mock debounce
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Memoized Vendor Card Component to prevent unnecessary re-renders
const VendorCard = React.memo(({ 
  vendor, 
  i, 
  viewMode, 
  querySort, 
  isCompared, 
  onToggleCompare,
  onScheduleAppointment,
  userLocation
}: { 
  vendor: any; 
  i: number; 
  viewMode: string; 
  querySort: string; 
  isCompared: boolean; 
  onToggleCompare: (id: string) => void;
  onScheduleAppointment?: (vendor: any) => void;
  userLocation?: { lat: number; lng: number } | null;
}) => {
  // Compute distance and SLA badge if not provided by backend
  const distanceKm = useMemo(() => {
    if (vendor.distanceKm !== undefined && vendor.distanceKm !== null) return vendor.distanceKm;
    if (!userLocation) return null;
    const vCoords = vendor.coords || resolveCoordinatesForLocation(vendor.location);
    return calculateHaversineDistanceKm(userLocation.lat, userLocation.lng, vCoords.lat, vCoords.lng);
  }, [vendor, userLocation]);

  const dispatchEstimate = useMemo(() => {
    if (distanceKm !== null) return getDispatchEstimate(distanceKm);
    return null;
  }, [distanceKm]);

  const consultationFee = vendor.consultationFee || 500;
  const appointmentFee = vendor.appointmentFee || 250;
  const openingHours = vendor.openingHours || "9:00 AM - 8:00 PM";
  const phoneNumber = vendor.phone || "+91 98765 43210";
  const whatsappNumber = vendor.whatsapp || "+91 98765 43210";

  // Business Name formatting (handle short fallback name gracefully)
  const businessTitle = useMemo(() => {
    if (!vendor.businessName) return "Verified Local Business";
    if (vendor.businessName.length <= 2) {
      return `${vendor.businessName.toUpperCase()} Enterprise & Services`;
    }
    return vendor.businessName;
  }, [vendor.businessName]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: i * 0.04 }}
      className={`bg-[#e9eff6] rounded-3xl border border-white/80 shadow-[8px_8px_20px_rgba(163,177,198,0.35),-8px_-8px_20px_rgba(255,255,255,0.95)] hover:shadow-[12px_12px_28px_rgba(163,177,198,0.45),-12px_-12px_28px_rgba(255,255,255,0.98)] transition-all duration-300 overflow-hidden flex ${viewMode === "list" || viewMode === "split" ? "flex-col sm:flex-row" : "flex-col"} group relative`}
    >
      {/* 1. Business Image Slider (Left Panel) */}
      <BusinessImageSlider 
        vendor={vendor} 
        rank={i + 1} 
        matchScore={querySort === "best_match" ? vendor.matchScore : null} 
        openingHours={openingHours} 
      />
      
      {/* 2. Business Information & Details (Body) */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
        <div>
          {/* Top Business Title & Rating Header */}
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 group-hover:text-purple-700 transition-colors leading-snug">{businessTitle}</h3>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-semibold mt-1">
                <div className="flex items-center gap-1 bg-[#e9eff6] px-2.5 py-1 rounded-xl shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/70">
                  <Star size={14} className="text-amber-400 fill-amber-400" />
                  <span className="text-slate-900 font-extrabold">{vendor.rating || 4.8}</span>
                </div>
                <span className="text-slate-500 font-medium">({vendor.reviewCount || 24} Verified Reviews)</span>
              </div>
            </div>
          </div>
          
          {/* Verified Badges & Location Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-3 text-xs font-semibold">
            {vendor.verified && (
              <span className={`flex items-center gap-1 ${vendor.premium ? "text-purple-900 bg-purple-100/90 border border-purple-200/90 shadow-2xs" : "text-emerald-900 bg-emerald-100/90 border border-emerald-200/90 shadow-2xs"} px-2.5 py-1 rounded-xl text-[11px] font-extrabold`}>
                <ShieldCheck size={13} /> {vendor.premium ? "AAA Prime Verified" : "GST Verified"}
              </span>
            )}
            <span className="flex items-center gap-1 text-slate-700 bg-[#e9eff6] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/70 px-2.5 py-1 rounded-xl text-[11px] font-semibold">
              <MapPin size={13} className="text-purple-600" /> {vendor.location || "Bangalore"}
            </span>
            {distanceKm !== null && (
              <span className="flex items-center gap-1 text-purple-900 bg-purple-100/80 border border-purple-200/90 px-2.5 py-1 rounded-xl text-[11px] font-bold shadow-2xs">
                <Navigation size={11} className="text-purple-600" /> {distanceKm} km (Local)
              </span>
            )}
          </div>

          {/* Consultation & Appointment Fees Bar */}
          <div className="mb-3.5 p-3 rounded-2xl bg-[#e9eff6] shadow-[inset_2px_2px_5px_rgba(163,177,198,0.35),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/70 flex flex-wrap items-center justify-between text-xs gap-2">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Consultation Fee:</span>
              <span className="font-black text-slate-900 text-sm">₹{consultationFee.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Booking Fee:</span>
              <span className="font-black text-emerald-700 text-sm">₹{appointmentFee.toLocaleString()}</span>
            </div>
          </div>

          {/* Business Summary / Customer Review Snippet */}
          <div className="mb-4 p-3 rounded-2xl bg-[#e9eff6] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.3),inset_-2px_-2px_4px_rgba(255,255,255,0.8)] border border-white/70 text-xs text-slate-700 italic flex items-start gap-2 font-medium">
            <Quote size={14} className="text-amber-500 fill-amber-400 shrink-0 mt-0.5" />
            <span className="line-clamp-2">Direct factory supplier with excellent SLA response under 2 hours & 50/50 escrow protection.</span>
          </div>

          {/* Communication & Appointment Action Bar */}
          <div className="flex items-center gap-2 mb-4">
            <a
              href={`tel:${phoneNumber}`}
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#e9eff6] hover:bg-white text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/80 cursor-pointer"
            >
              <Phone size={14} className="text-sky-600" /> Call Now
            </a>
            <a
              href={`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-2.5 px-3 rounded-xl bg-[#e9eff6] hover:bg-white text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[3px_3px_6px_rgba(163,177,198,0.3),-3px_-3px_6px_rgba(255,255,255,0.9)] border border-white/80 cursor-pointer"
            >
              <MessageSquare size={14} className="text-emerald-600 fill-emerald-600" /> WhatsApp
            </a>
            {onScheduleAppointment && (
              <button
                onClick={() => onScheduleAppointment(vendor)}
                className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all shadow-[4px_4px_10px_rgba(14,165,233,0.35)] cursor-pointer"
              >
                <Calendar size={14} className="text-white" /> Book Slot
              </button>
            )}
          </div>
        </div>

        <div>
          {/* Price & SLA Response Row */}
          <div className="flex items-center justify-between pt-3 border-t border-slate-200/60">
            <div>
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-0.5">Starting From</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900">₹{vendor.startingPrice ? vendor.startingPrice.toLocaleString() : "50,000"}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block mb-0.5">Responds In</span>
              <span className="text-xs sm:text-sm font-bold text-amber-950 bg-amber-100/90 px-3 py-1.5 rounded-xl border border-amber-200/90 flex items-center justify-end gap-1.5 shadow-2xs">
                <Zap size={14} className="text-amber-500 fill-amber-400" /> {vendor.responseTime || "2 hours"}
              </span>
            </div>
          </div>

          {/* Primary View Profile & Get Quote CTAs (Solid Single-Color Buttons) */}
          <div className="grid grid-cols-2 gap-2.5 mt-4">
            <Link to={`/vendor/${vendor.slug}`} className="text-center py-3 bg-[#e9eff6] hover:bg-white text-slate-900 font-extrabold text-xs rounded-xl transition-all border border-white/80 flex items-center justify-center min-h-[46px] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)]">
              View Profile
            </Link>
            <Link to="/post-requirement" className="text-center py-3 bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center min-h-[46px] shadow-[4px_4px_10px_rgba(14,165,233,0.35)]">
              Request Quotation
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

// Coursera / Google AI Inspired Featured Spotlight Banner Card (Pastel & Glassy Luxury)
const FeaturedSpotlightBannerCard = () => {
  return (
    <div className="w-full mb-8 rounded-3xl bg-slate-950/90 backdrop-blur-2xl text-white overflow-hidden border border-white/20 shadow-2xl relative group">
      <div className="grid grid-cols-1 md:grid-cols-2 items-stretch min-h-[300px] sm:min-h-[340px]">
        {/* Left Content Section */}
        <div className="p-6 sm:p-8 md:p-10 flex flex-col justify-between z-10 bg-gradient-to-br from-slate-900/95 via-sky-950/90 to-purple-950/95 backdrop-blur-2xl border-r border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-black uppercase tracking-widest text-sky-200 bg-sky-500/20 px-3 py-1 rounded-full border border-sky-300/30 backdrop-blur-md">
                Verified Business Solutions
              </span>
              <span className="text-xs font-bold text-emerald-200 bg-emerald-500/20 px-2.5 py-1 rounded-full border border-emerald-300/30 backdrop-blur-md flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live Marketplace
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight mb-3">
              One-Stop Professional Services & Local Solutions
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed max-w-lg mb-6">
              Connect with verified local experts, software architects, hardware repair centers, doctors, and wholesale manufacturers across India.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <Link
              to="/post-requirement"
              className="inline-flex items-center gap-2 text-white font-extrabold text-sm sm:text-base hover:text-sky-300 transition-colors cursor-pointer group/link"
            >
              <span>Explore Services & Book Slots</span>
              <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform text-sky-400" />
            </Link>
          </div>
        </div>

        {/* Right Feature Showcase Image Section */}
        <div className="relative p-2.5 sm:p-4 overflow-hidden bg-slate-900/90 flex items-center justify-center">
          {/* Pastel Multi-Color Gradient Frame */}
          <div className="relative w-full h-64 sm:h-full min-h-[260px] rounded-2xl overflow-hidden border-2 border-transparent bg-clip-border p-[2px] bg-gradient-to-tr from-sky-300 via-indigo-300 via-pink-300 to-emerald-300">
            <div className="w-full h-full rounded-2xl overflow-hidden relative bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80"
                alt="Professional Business Services Showcase"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/25 to-transparent" />

              {/* Floating Pastel Glass Pill Badges */}
              <div className="absolute top-4 right-6 bg-white/85 text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-xl border border-white/90 backdrop-blur-xl">
                Instant Appointment Slots
              </div>

              <div className="absolute top-16 left-6 bg-slate-900/80 text-white font-bold text-xs px-3.5 py-1.5 rounded-full shadow-xl border border-white/30 backdrop-blur-xl flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" /> 500+ Verified Service Categories
              </div>

              <div className="absolute bottom-16 left-8 bg-white/85 text-emerald-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-xl border border-white/90 backdrop-blur-xl">
                ₹500 Consultation & ₹250 Booking
              </div>

              <div className="absolute bottom-4 left-6 bg-amber-100/90 text-amber-950 font-extrabold text-xs px-3.5 py-1.5 rounded-full shadow-xl border border-amber-200/90 backdrop-blur-xl">
                SLA Response & Escrow Security
              </div>

              {/* Bottom Right Arrow Circular Button (Solid Single Color) */}
              <Link
                to="/post-requirement"
                className="absolute bottom-4 right-4 w-11 h-11 rounded-full bg-sky-600 hover:bg-sky-700 text-white flex items-center justify-center transition-all shadow-xl border border-white/40 backdrop-blur-xl cursor-pointer hover:scale-110"
              >
                <ArrowUpRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function VendorDiscovery() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // Geolocation & User Proximity State
  const { 
    coords: userCoords, 
    cityName: userCity, 
    isLive: isLiveLocation, 
    loading: isLocating, 
    detectLiveLocation, 
    setManualHub 
  } = useLiveLocation();

  // State for facets and results
  const [facets, setFacets] = useState({ categories: [], locations: [] });
  const [vendors, setVendors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // State for Filters
  const queryView = (searchParams.get("view") as "grid" | "list" | "map" | "split") || "list";
  const [viewMode, setViewMode] = useState<"grid" | "list" | "map" | "split">("list");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [appointmentVendor, setAppointmentVendor] = useState<any | null>(null);

  // Read URL params
  const queryQ = searchParams.get("search") || "";
  const queryCat = searchParams.get("category") || "";
  const queryLoc = searchParams.get("location") || "";
  const querySort = searchParams.get("sort") || "best_match";
  const queryMinRating = searchParams.get("minRating") || "";
  const queryResponseTime = searchParams.get("responseTime") || "";
  const queryVerified = searchParams.get("verifiedOnly") === "true";
  const queryOpenNow = searchParams.get("openNow") === "true";
  const queryMaxBudget = searchParams.get("maxBudget") || "";
  const queryFreeConsult = searchParams.get("freeConsult") === "true";

  const [categorySearch, setCategorySearch] = useState("");
  const [localQ, setLocalQ] = useState(queryQ);
  const debouncedQ = useDebounce(localQ, 500);

  const filteredCategories = useMemo(() => {
    if (!facets.categories) return [];
    if (!categorySearch.trim()) return facets.categories;
    return facets.categories.filter((c: any) => c.name.toLowerCase().includes(categorySearch.toLowerCase()));
  }, [facets.categories, categorySearch]);

  // Fetch Facets once
  useEffect(() => {
    fetch("/api/vendors/facets").then(r => r.json()).then(setFacets).catch(console.error);
  }, []);

  // Fetch Vendors
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQ) params.append("q", debouncedQ);
    if (queryCat) params.append("category", queryCat);
    if (queryLoc) params.append("location", queryLoc);
    if (querySort) params.append("sort", querySort);
    if (queryMinRating) params.append("minRating", queryMinRating);
    if (queryResponseTime) params.append("responseTime", queryResponseTime);
    if (queryVerified) params.append("verifiedOnly", "true");
    
    if (userCoords) {
      params.append("lat", String(userCoords.lat));
      params.append("lng", String(userCoords.lng));
    }
    
    try {
      const res = await fetch(`/api/vendors/search?${params.toString()}`);
      const data = await res.json();
      setVendors(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, queryCat, queryLoc, querySort, queryMinRating, queryResponseTime, queryVerified, userCoords]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Transform vendors for Map Component
  const mapVendors = useMemo(() => {
    return vendors.map(v => ({
      id: v.id,
      name: v.businessName,
      category: v.category,
      location: v.location,
      creditScore: "AAA (99.2%)",
      rating: v.rating,
      reviews: v.reviewCount,
      responseTime: v.responseTime || "2 hours",
      dealVolume: "₹1.5 Cr+ Dispatched",
      logo: v.logo || "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=150&auto=format&fit=crop&q=80",
      tags: v.services || ["Bulk Supply", "GST Verified"],
      capacity: "50 Tons / Month",
      startingPrice: v.startingPrice || 50000,
      coords: v.coords || resolveCoordinatesForLocation(v.location),
      slug: v.slug
    }));
  }, [vendors]);

  // Update URL helpers
  const updateFilter = (key: string, value: string | boolean | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === false || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setLocalQ("");
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", localQ);
  };

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= 3) {
        alert("You can only compare up to 3 vendors at a time.");
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#e9eff6] text-slate-900 w-full font-sans">
      
      {/* HEADER / SEARCH BAR (Sticky Neomorphic Top Bar) */}
      <div className="sticky top-[86px] sm:top-[94px] md:top-[104px] z-20 bg-[#e9eff6]/95 backdrop-blur-2xl border-b border-white/80 shadow-[0_4px_12px_rgba(163,177,198,0.25)] py-3 sm:py-4 w-full">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex w-full relative">
            <div className="w-full bg-[#e9eff6] shadow-[inset_3px_3px_7px_rgba(163,177,198,0.35),inset_-3px_-3px_7px_rgba(255,255,255,0.9)] rounded-2xl py-1 px-2 border border-white/70">
              <OriginAnimatedInput
                value={localQ}
                onChange={(val) => {
                  setLocalQ(val);
                  updateFilter("search", val);
                }}
                onClear={() => updateFilter("search", null)}
                placeholder="Search verified suppliers, CNC, steel, cartons, chemicals..."
                label=""
                shortcut="⌘K"
              />
            </div>
          </form>

          <div className="flex w-full md:w-auto items-center gap-2.5">
            {/* Live GPS Quick Detector */}
            <button
              type="button"
              onClick={detectLiveLocation}
              disabled={isLocating}
              className="px-4 py-2.5 rounded-2xl bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80 hover:bg-white text-slate-800 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer min-h-[46px] shrink-0"
              title="Detect live browser GPS location"
            >
              {isLocating ? <RefreshCw size={14} className="animate-spin text-purple-600" /> : <Navigation size={14} className={isLiveLocation ? "text-emerald-600 fill-emerald-600" : "text-purple-600"} />}
              <span className="hidden sm:inline">{isLocating ? "Locating..." : isLiveLocation ? `📍 ${userCity} (Live)` : `📍 ${userCity || "Near Me"}`}</span>
              <span className="sm:hidden">GPS</span>
            </button>

            <select 
              className="bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80 rounded-2xl py-3 px-4 outline-none font-extrabold text-slate-800 cursor-pointer flex-1 md:w-48 appearance-none text-xs sm:text-sm min-h-[46px]"
              value={queryLoc}
              onChange={(e) => updateFilter("location", e.target.value)}
            >
              <option value="">All India Delivery</option>
              {facets.locations.map((l: any) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
            
            <button 
              className="md:hidden p-3 bg-[#e9eff6] shadow-[4px_4px_10px_rgba(163,177,198,0.35),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80 rounded-2xl text-purple-900 font-bold text-xs flex items-center gap-1.5 min-h-[46px] min-w-[46px] justify-center cursor-pointer"
              onClick={() => setShowMobileFilters(true)}
              aria-label="Open Filters"
            >
              <SlidersHorizontal size={18} />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 flex flex-col md:flex-row gap-6 lg:gap-8 flex-1 relative z-0">
        
        {/* SIDEBAR FILTERS (Neomorphic & Soft Pastel UI Aesthetic) */}
        <div className={`fixed inset-0 z-50 bg-slate-950/40 backdrop-blur-md md:bg-transparent md:backdrop-blur-none md:static md:w-80 lg:w-[340px] md:block md:z-10 flex-shrink-0 ${showMobileFilters ? "flex flex-col justify-end md:block" : "hidden"}`}>
          <div className="bg-[#f0f4f8] md:bg-[#f0f4f8] rounded-t-3xl md:rounded-3xl max-h-[85vh] md:h-[calc(100vh-170px)] md:max-h-[calc(100vh-170px)] md:sticky md:top-36 md:self-start md:z-10 flex flex-col w-full overflow-hidden shadow-xl border border-white/80 p-4">
            
            {/* Sidebar Top Header */}
            <div className="p-2 border-b border-slate-200/60 flex justify-between items-center mb-3 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#f0f4f8] shadow-[3px_3px_7px_rgba(163,177,198,0.35),-3px_-3px_7px_rgba(255,255,255,0.9)] flex items-center justify-center text-sky-600 border border-white/60">
                  <SlidersHorizontal size={16} />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm leading-tight">Directory Filters</h3>
                  <span className="text-[10px] font-bold text-slate-400">Neomorphic Soft UI</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                {(queryCat || queryMinRating || queryResponseTime || queryVerified || queryOpenNow || localQ) && (
                  <button onClick={clearFilters} className="text-xs text-sky-700 font-bold hover:underline cursor-pointer">Reset All</button>
                )}
                <button onClick={() => setShowMobileFilters(false)} className="md:hidden text-slate-500 hover:text-slate-900 font-bold p-1 cursor-pointer">
                  <X size={16} />
                </button>
              </div>
            </div>
            
            {/* Scrollable Filter Cards */}
            <div className="space-y-4 overflow-y-auto flex-1 min-h-0 pb-6 pr-1.5 custom-scrollbar touch-pan-y overscroll-contain">

              {/* 1. Availability & Operating Hours (Neomorphic Toggle Switches) */}
              <div className="bg-[#f0f4f8] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
                <h4 className="font-extrabold text-emerald-950 mb-3 text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100/90 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-2xs">
                    <Clock size={13} />
                  </div>
                  <span>Availability & Hours</span>
                </h4>
                
                <div className="space-y-3">
                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Open Now Only
                    </span>
                    <div 
                      onClick={() => updateFilter("openNow", !queryOpenNow)}
                      className={`w-10 h-5 rounded-full p-0.5 transition-all cursor-pointer shadow-[inset_2px_2px_4px_rgba(163,177,198,0.35),inset_-2px_-2px_4px_rgba(255,255,255,0.9)] ${queryOpenNow ? "bg-emerald-500" : "bg-[#e2e8f0]"}`}
                    >
                      <div className={`w-4 h-4 rounded-full bg-white shadow-md transition-transform ${queryOpenNow ? "translate-x-5" : "translate-x-0"}`} />
                    </div>
                  </label>

                  <label className="flex items-center justify-between cursor-pointer group">
                    <span className="text-xs font-bold text-slate-700 group-hover:text-emerald-800 flex items-center gap-1.5">
                      <Zap size={13} className="text-amber-500 fill-amber-400" /> 24/7 Emergency Service
                    </span>
                    <input type="checkbox" className="hidden" />
                    <div className="w-10 h-5 rounded-full p-0.5 bg-[#e2e8f0] shadow-[inset_2px_2px_4px_rgba(163,177,198,0.35),inset_-2px_-2px_4px_rgba(255,255,255,0.9)]">
                      <div className="w-4 h-4 rounded-full bg-white shadow-md" />
                    </div>
                  </label>
                </div>
              </div>

              {/* 2. Service Category Filter with Neomorphic Search */}
              <div className="bg-[#f0f4f8] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
                <div className="flex justify-between items-center mb-2.5">
                  <h4 className="font-extrabold text-purple-950 text-[11px] uppercase tracking-wider flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-purple-100/90 text-purple-600 flex items-center justify-center border border-purple-200/80 shadow-2xs">
                      <Building2 size={13} />
                    </div>
                    <span>Service Category</span>
                  </h4>
                  <span className="text-[10px] font-bold text-purple-700 bg-purple-100/90 px-2 py-0.5 rounded-md border border-purple-200/80">
                    {facets.categories.length || 10} Total
                  </span>
                </div>

                {/* Neomorphic Inset Search Box */}
                <div className="mb-3 relative">
                  <input
                    type="text"
                    value={categorySearch}
                    onChange={(e) => setCategorySearch(e.target.value)}
                    placeholder="Search categories..."
                    className="w-full text-xs bg-[#f0f4f8] shadow-[inset_2px_2px_5px_rgba(163,177,198,0.3),inset_-2px_-2px_5px_rgba(255,255,255,0.9)] border border-white/70 rounded-xl py-2 px-3 pl-8 outline-none text-slate-800 font-semibold placeholder:text-slate-400"
                  />
                  <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1 custom-scrollbar touch-pan-y overscroll-contain">
                  {(filteredCategories.length > 0 ? filteredCategories : [
                    { name: "Web & Software Dev", count: 18 },
                    { name: "Mobile App MVP", count: 14 },
                    { name: "Hardware & Laptop Repair", count: 24 },
                    { name: "Doctors & Medical Clinics", count: 32 },
                    { name: "B2B Wholesale & Manufacturing", count: 45 },
                    { name: "Beauty Spas & Salons", count: 28 },
                    { name: "Electricians & Plumbers", count: 36 },
                    { name: "Interior & Architecture", count: 19 },
                    { name: "Real Estate Agents", count: 22 }
                  ]).map((c: any) => (
                    <label key={c.name} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        queryCat === c.name 
                          ? "bg-purple-600 text-white shadow-md" 
                          : "bg-[#f0f4f8] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/80"
                      }`}>
                        <input 
                          type="checkbox" 
                          checked={queryCat === c.name}
                          onChange={() => updateFilter("category", queryCat === c.name ? null : c.name)}
                          className="hidden"
                        />
                        {queryCat === c.name && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className="text-slate-700 group-hover:text-purple-700 font-bold text-xs flex-1 truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold bg-white/60 px-1.5 py-0.5 rounded-md border border-white/80">({c.count || 12})</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 3. Budget & Price Range Selector (Neomorphic Slider & Pills) */}
              <div className="bg-[#f0f4f8] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
                <h4 className="font-extrabold text-sky-950 mb-3 text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-sky-100/90 text-sky-600 flex items-center justify-center border border-sky-200/80 shadow-2xs">
                    <DollarSign size={13} />
                  </div>
                  <span>Budget & Service Pricing</span>
                </h4>

                <div className="grid grid-cols-3 gap-1.5 mb-3">
                  {[
                    { label: "< ₹10k", val: "10000" },
                    { label: "₹10k-50k", val: "50000" },
                    { label: "₹50k+", val: "100000" }
                  ].map(b => (
                    <button
                      key={b.val}
                      onClick={() => updateFilter("maxBudget", queryMaxBudget === b.val ? null : b.val)}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-extrabold transition-all cursor-pointer ${
                        queryMaxBudget === b.val
                          ? "bg-sky-600 text-white shadow-md"
                          : "bg-[#f0f4f8] shadow-[3px_3px_6px_rgba(163,177,198,0.25),-3px_-3px_6px_rgba(255,255,255,0.8)] text-slate-700 hover:text-sky-700 border border-white/70"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs font-bold text-slate-600 pt-1 border-t border-slate-200/50">
                  <span>Free Initial Consultation</span>
                  <div 
                    onClick={() => updateFilter("freeConsult", !queryFreeConsult)}
                    className={`w-8 h-4 rounded-full p-0.5 transition-all cursor-pointer shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] ${queryFreeConsult ? "bg-sky-600" : "bg-[#e2e8f0]"}`}
                  >
                    <div className={`w-3 h-3 rounded-full bg-white shadow-sm transition-transform ${queryFreeConsult ? "translate-x-4" : "translate-x-0"}`} />
                  </div>
                </div>
              </div>

              {/* 4. Rating & Reviews */}
              <div className="bg-[#f0f4f8] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
                <h4 className="font-extrabold text-amber-950 mb-3 text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-100/90 text-amber-600 flex items-center justify-center border border-amber-200/80 shadow-2xs">
                    <Star size={13} className="text-amber-500 fill-amber-400" />
                  </div>
                  <span>Customer Rating</span>
                </h4>
                <div className="space-y-2">
                  {[4, 3].map((r) => (
                    <label key={r} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        queryMinRating === String(r)
                          ? "bg-amber-500 text-white shadow-md"
                          : "bg-[#f0f4f8] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/80"
                      }`}>
                        <input 
                          type="checkbox" 
                          checked={queryMinRating === String(r)}
                          onChange={() => updateFilter("minRating", queryMinRating === String(r) ? null : String(r))}
                          className="hidden"
                        />
                        {queryMinRating === String(r) && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className="text-slate-700 group-hover:text-amber-700 font-bold text-xs flex items-center gap-1">
                        {Array.from({length: r}).map((_, i) => <Star key={i} size={13} className="text-amber-400 fill-amber-400" />)}
                        {Array.from({length: 5-r}).map((_, i) => <Star key={i} size={13} className="text-slate-300" />)}
                        & Up
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 5. Response Time SLA */}
              <div className="bg-[#f0f4f8] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
                <h4 className="font-extrabold text-indigo-950 mb-3 text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-100/90 text-indigo-600 flex items-center justify-center border border-indigo-200/80 shadow-2xs">
                    <Zap size={13} />
                  </div>
                  <span>Response Time SLA</span>
                </h4>
                <div className="space-y-2">
                  {["1 hour", "4 hours", "24 hours"].map((t) => (
                    <label key={t} className="flex items-center gap-2.5 cursor-pointer group">
                      <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                        queryResponseTime === t
                          ? "bg-sky-600 text-white shadow-md"
                          : "bg-[#f0f4f8] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/80"
                      }`}>
                        <input 
                          type="checkbox" 
                          checked={queryResponseTime === t}
                          onChange={() => updateFilter("responseTime", queryResponseTime === t ? null : t)}
                          className="hidden"
                        />
                        {queryResponseTime === t && <Check size={11} strokeWidth={3} />}
                      </div>
                      <span className="text-slate-700 group-hover:text-sky-700 font-bold text-xs">&lt; {t}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* 6. Compliance, Trust & Verification */}
              <div className="bg-[#f0f4f8] rounded-2xl p-4 shadow-[4px_4px_10px_rgba(163,177,198,0.3),-4px_-4px_10px_rgba(255,255,255,0.9)] border border-white/80">
                <h4 className="font-extrabold text-emerald-950 mb-3 text-[11px] uppercase tracking-wider flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100/90 text-emerald-600 flex items-center justify-center border border-emerald-200/80 shadow-2xs">
                    <ShieldCheck size={13} />
                  </div>
                  <span>Compliance & Security</span>
                </h4>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className={`w-4 h-4 rounded flex items-center justify-center transition-all ${
                      queryVerified
                        ? "bg-emerald-600 text-white shadow-md"
                        : "bg-[#f0f4f8] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/80"
                    }`}>
                      <input 
                        type="checkbox" 
                        checked={queryVerified}
                        onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
                        className="hidden"
                      />
                      {queryVerified && <Check size={11} strokeWidth={3} />}
                    </div>
                    <span className="text-slate-700 group-hover:text-emerald-700 font-bold text-xs">GST & KYC Verified Only</span>
                  </label>

                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <div className="w-4 h-4 rounded bg-[#f0f4f8] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3),inset_-1.5px_-1.5px_3px_rgba(255,255,255,0.8)] border border-white/80" />
                    <span className="text-slate-700 group-hover:text-emerald-700 font-bold text-xs">Escrow Secured Payments</span>
                  </label>
                </div>
              </div>

            </div>

            {/* Mobile Apply Button */}
            <div className="p-3 border-t border-slate-200 md:hidden bg-[#f0f4f8]">
              <button 
                onClick={() => setShowMobileFilters(false)}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-md min-h-[44px]"
              >
                Apply Filters & Show {total} Suppliers
              </button>
            </div>

          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="flex-1 min-w-0">
          
          {/* Featured Coursera / Google AI Inspired Spotlight Banner */}
          <FeaturedSpotlightBannerCard />

          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <h1 className="text-sm sm:text-base text-slate-700 font-medium">
                Showing <span className="font-black text-slate-900">{total}</span> wholesale suppliers
                {queryQ && <span> for "<span className="text-slate-900 font-bold">{queryQ}</span>"</span>}
                {queryCat && <span> in <span className="text-slate-900 font-bold">{queryCat}</span></span>}
                {queryLoc && <span> located in <span className="text-slate-900 font-bold">{queryLoc}</span></span>}
              </h1>
              {userCity && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Navigation size={12} className="text-sky-600" />
                  <span>Proximity calculated relative to <strong className="text-slate-700">{userCity}</strong> {isLiveLocation ? "(Live GPS)" : ""}</span>
                </p>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-white/80 border border-sky-100/80 px-3 py-2 rounded-xl shadow-2xs">
                <span>Sort:</span>
                <select 
                  className="bg-transparent border-none text-sky-900 font-bold outline-none cursor-pointer text-xs"
                  value={querySort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                >
                  <option value="best_match">Best Match</option>
                  <option value="nearest">📍 Distance: Nearest to Me</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Lowest Price</option>
                </select>
              </div>
              
              <div className="flex items-center bg-white/80 border border-sky-100/80 p-1 rounded-xl gap-1 shadow-2xs">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "grid" ? "bg-sky-600 text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"}`}
                  title="Grid View"
                  aria-label="Grid View"
                >
                  <Grid size={15} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer ${viewMode === "list" ? "bg-sky-600 text-white shadow-xs font-bold" : "text-slate-500 hover:text-slate-900"}`}
                  title="List View"
                  aria-label="List View"
                >
                  <ListIcon size={15} />
                </button>
                <button 
                  onClick={() => setViewMode("split")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer hidden md:flex items-center gap-1 text-xs font-bold ${viewMode === "split" ? "bg-sky-600 text-white shadow-xs font-bold" : "text-slate-500 hover:text-sky-700"}`}
                  title="Split View (Yelp Style List + Map)"
                  aria-label="Split View"
                >
                  <SlidersHorizontal size={14} />
                  <span className="text-[11px]">Split</span>
                </button>
                <button 
                  onClick={() => setViewMode("map")}
                  className={`p-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1 text-xs font-bold ${viewMode === "map" ? "bg-sky-600 text-white shadow-xs font-bold" : "text-slate-500 hover:text-sky-700"}`}
                  title="Live Radar Proximity Map View"
                  aria-label="Live Radar Proximity Map View"
                >
                  <MapIcon size={14} />
                  <span className="hidden lg:inline text-[11px]">Map</span>
                </button>
              </div>
            </div>
          </div>

          {/* Map View Mode */}
          {viewMode === "map" ? (
            <div className="mb-10">
              <VendorProximityMap 
                vendors={mapVendors} 
                onSelectVendor={(v) => navigate(`/vendor/${v.slug || v.id}`)}
                onRequestRfq={(name, cat) => navigate(`/post-requirement?vendor=${encodeURIComponent(name)}&cat=${encodeURIComponent(cat)}`)}
              />
            </div>
          ) : viewMode === "split" ? (
            /* Split Screen Mode: List on Left, Sticky Map on Right (Yelp Desktop Layout) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-7 space-y-5">
                {vendors.map((vendor, i) => (
                  <VendorCard 
                    key={vendor.id}
                    vendor={vendor}
                    i={i}
                    viewMode="split"
                    querySort={querySort}
                    isCompared={compareIds.includes(vendor.id)}
                    onToggleCompare={toggleCompare}
                    onScheduleAppointment={(v) => setAppointmentVendor(v)}
                    userLocation={userCoords}
                  />
                ))}
              </div>
              <div className="lg:col-span-5 sticky top-44 hidden lg:block">
                <VendorProximityMap 
                  vendors={mapVendors} 
                  onSelectVendor={(v) => navigate(`/vendor/${v.slug || v.id}`)}
                  onRequestRfq={(name, cat) => navigate(`/post-requirement?vendor=${encodeURIComponent(name)}&cat=${encodeURIComponent(cat)}`)}
                />
              </div>
            </div>
          ) : (
            /* Vendors Loading / Empty State */
            loading ? (
              <div className="flex justify-center items-center py-24">
                <div className="h-8 w-8 border-4 border-sky-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : vendors.length === 0 ? (
              <div className="bg-white/80 backdrop-blur-md rounded-3xl p-12 text-center border border-sky-200/80 shadow-sm">
                <div className="w-16 h-16 bg-sky-100/80 rounded-full flex items-center justify-center mx-auto mb-4 text-sky-600">
                  <Search size={24} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2 font-heading">No suppliers found</h3>
                <p className="text-slate-500 text-xs sm:text-sm mb-6 font-medium">Try adjusting your category or city filters to find more wholesale suppliers.</p>
                <button onClick={clearFilters} className="bg-sky-100 text-sky-800 font-bold px-6 py-2.5 rounded-xl hover:bg-sky-200 text-xs transition-colors cursor-pointer">
                  Clear All Filters
                </button>
              </div>
            ) : (
              /* Vendors Grid / List */
              <div className={`grid gap-5 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                <AnimatePresence>
                  {vendors.map((vendor, i) => (
                    <VendorCard 
                      key={vendor.id}
                      vendor={vendor}
                      i={i}
                      viewMode={viewMode}
                      querySort={querySort}
                      isCompared={compareIds.includes(vendor.id)}
                      onToggleCompare={toggleCompare}
                      onScheduleAppointment={(v) => setAppointmentVendor(v)}
                      userLocation={userCoords}
                    />
                  ))}
                </AnimatePresence>
              </div>
            )
          )}

          {/* Pagination */}
          {!loading && vendors.length > 0 && viewMode !== "map" && (
            <div className="mt-10 flex justify-center gap-1.5 pb-12">
              <button className="px-3.5 py-2 border border-sky-200/80 bg-white text-slate-400 rounded-xl font-bold text-xs cursor-not-allowed">Prev</button>
              <button className="px-3.5 py-2 border border-sky-600 bg-sky-600 text-white rounded-xl font-bold text-xs shadow-sm">1</button>
              <button className="px-3.5 py-2 border border-sky-200/80 bg-white text-slate-700 rounded-xl hover:bg-sky-50 font-bold text-xs cursor-pointer">2</button>
              <button className="px-3.5 py-2 border border-sky-200/80 bg-white text-slate-700 rounded-xl hover:bg-sky-50 font-bold text-xs cursor-pointer">3</button>
              <span className="px-2 py-2 text-slate-400 text-xs">...</span>
              <button className="px-3.5 py-2 border border-sky-200/80 bg-white text-slate-700 rounded-xl hover:bg-sky-50 font-bold text-xs cursor-pointer">Next</button>
            </div>
          )}

        </div>
      </div>

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white/95 backdrop-blur-2xl rounded-full shadow-2xl border border-sky-200 p-2 flex items-center gap-3 sm:gap-4 pr-5 sm:pr-6 w-[92%] sm:w-auto overflow-hidden gold-border-glow"
          >
            <div className="flex -space-x-2.5 ml-2">
              {compareIds.map(id => {
                const v = vendors.find(vend => vend.id === id);
                return v ? (
                  <PastelVendorAvatar key={id} src={v.logo} name={v.businessName} size="sm" roundness="rounded-full" />
                ) : <div key={id} className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-white bg-slate-200" />;
              })}
            </div>
            <div className="font-bold text-xs sm:text-sm text-slate-800">{compareIds.length} Selected</div>
            <button 
              disabled={compareIds.length < 2}
              onClick={() => navigate(`/compare?vendorIds=${compareIds.join(",")}`)} 
              className="bg-sky-600 hover:bg-sky-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 sm:px-6 py-2 rounded-full font-bold text-xs shadow-md transition-all cursor-pointer min-h-[36px]"
            >
              Compare
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Appointment Scheduling Modal */}
      <AppointmentModal
        isOpen={Boolean(appointmentVendor)}
        onClose={() => setAppointmentVendor(null)}
        vendorName={appointmentVendor?.businessName || ""}
        category={appointmentVendor?.category}
        consultationFee={appointmentVendor?.consultationFee || 500}
        appointmentFee={appointmentVendor?.appointmentFee || 250}
        phone={appointmentVendor?.phone || "+91 98765 43210"}
        whatsapp={appointmentVendor?.whatsapp || "+91 98765 43210"}
      />

    </div>
  );
}
