import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useInView } from "framer-motion";
import {
  Search, ShieldCheck, Zap, Star, ArrowRight, CheckCircle2, ChevronRight, ChevronLeft,
  Building2, Truck, Award, Sparkles, Mail, Gift, Bell,
  Calculator, Percent, Lock, Check, Copy,
  Layers, Package, Factory, Cpu, Flame, Wrench,
  ArrowUpRight, RefreshCw, Send, DollarSign, Clock, ThumbsUp, Pause, Play,
  Plus, X, FileText, TrendingUp, ExternalLink, QrCode, ChevronUp, ChevronDown, Compass,
  Navigation, MapPin,
  Shirt, Utensils, Smartphone, HeartPulse, Home, Car, Sprout, ShoppingBag, Store, Briefcase,
  Terminal, HardDrive, Server, Settings, Code, Laptop, Tag
} from "lucide-react";
import VendorProximityMap from "../components/VendorProximityMap";
import { Section3DLayer, Layer3DTransition, Card3DTilt, ScrollCraftHUD, ScrollHighlightText } from "../components/Section3DLayer";
import OriginSparkleButton from "../components/originkit/OriginSparkleButton";
import OriginStatusBadge from "../components/originkit/OriginStatusBadge";
import OriginGlowingCard from "../components/originkit/OriginGlowingCard";
import OriginAccordion from "../components/originkit/OriginAccordion";
import MagneticButton from "../components/animations/MagneticButton";
import SpotlightCard from "../components/animations/SpotlightCard";
import ShinyText from "../components/animations/ShinyText";
import PurpleCyberButton from "../components/ui/PurpleCyberButton";
import RenewalVoucherHero from "../components/RenewalVoucherHero";
import Animated3DUpwardArrow from "../components/ui/Animated3DUpwardArrow";

import {
  useLiveLocation,
  calculateHaversineDistanceKm,
  getDispatchEstimate,
  resolveCoordinatesForLocation,
  KNOWN_INDUSTRIAL_HUBS
} from "../lib/geoService";

// Bundled Category Images (guarantees images are hashed and bundled into /assets/ for live deployment)
import machineryImg from "../assets/categories/machinery.png";
import steelImg from "../assets/categories/steel.png";
import packagingImg from "../assets/categories/packaging.png";
import solarImg from "../assets/categories/contarct.png";
import pharmaImg from "../assets/categories/pharama.png";
import constructionImg from "../assets/categories/cement.png";
import textileImg from "../assets/categories/textile.png";

// Section definition for Smooth Scroll & Interactive Navigator HUD
export const LANDING_SECTIONS = [
  { id: "hero", label: "Search & Hero Console", shortName: "Hero", icon: Search, tag: "01" },
  { id: "spotlight", label: "Featured Wholesale Sectors", shortName: "Spotlight", icon: Sparkles, tag: "02" },
  { id: "categories", label: "Top Wholesale Categories", shortName: "Categories", icon: Building2, tag: "03" },
  { id: "calculator", label: "1–3% Tiered Fee & Escrow", shortName: "Calculator", icon: Calculator, tag: "04" },
  { id: "voucher", label: "50% Renewal Voucher", shortName: "Voucher", icon: Gift, tag: "05" },
  { id: "nearby", label: "Live GPS Proximity Map", shortName: "Map", icon: Compass, tag: "06" },
  { id: "vendors", label: "Preferred Verified Vendors", shortName: "Vendors", icon: ShieldCheck, tag: "07" },
  { id: "referral", label: "₹15k Partner Incentive", shortName: "Referral", icon: Award, tag: "08" },
  { id: "testimonials", label: "Client Case Studies", shortName: "Stories", icon: ThumbsUp, tag: "09" },
  { id: "about", label: "One-Stop Sourcing Hub", shortName: "About", icon: Layers, tag: "10" },
  { id: "compliance", label: "Trust & Compliance Bar", shortName: "Trust", icon: Lock, tag: "11" },
];

// Helper component for animating numbers with requestAnimationFrame
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-30px" });

  useEffect(() => {
    if (!isInView) return;
    let startTime: number | null = null;
    let animationFrameId: number;
    const duration = 1600; // ms

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeOut = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(easeOut * value));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCount(value);
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// High-performance Scroll Reveal Component with clean transitions
interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "zoom" | "none";
  className?: string;
  duration?: number;
  key?: React.Key;
}

const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = "up",
  className = "",
  duration = 0.45
}) => {
  const getInitial = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 20 };
      case "down": return { opacity: 0, y: -20 };
      case "left": return { opacity: 0, x: 20 };
      case "right": return { opacity: 0, x: -20 };
      case "zoom": return { opacity: 0, scale: 0.97 };
      case "none": return { opacity: 0 };
    }
  };

  return (
    <motion.div
      initial={getInitial()}
      whileInView={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      viewport={{ once: true, margin: "-20px" }}
      transition={{ duration, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Self-contained scroll progress meter that updates locally without re-rendering LandingPage
const ScrollProgressPill: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let ticking = false;
    const updateProgress = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY || document.documentElement.scrollTop;
      if (totalScroll > 0) {
        setProgress(Math.min(100, Math.max(0, (currentScroll / totalScroll) * 100)));
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateProgress);
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    updateProgress();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pt-2 mt-1 border-t border-sky-100 text-center">
      <span className="text-[10px] font-mono font-bold text-sky-800">
        {Math.round(progress)}%
      </span>
    </div>
  );
};

// Staggered Container for Grid Items
interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
}

const StaggerContainer: React.FC<StaggerContainerProps> = ({ children, className = "", staggerDelay = 0.05 }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-20px" }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: staggerDelay,
          }
        }
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  key?: React.Key;
}

const StaggerItem: React.FC<StaggerItemProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 16, scale: 0.98 },
        visible: {
          opacity: 1,
          y: 0,
          scale: 1,
          transition: {
            duration: 0.45,
            ease: [0.16, 1, 0.3, 1]
          }
        }
      }}
      style={{ willChange: "transform, opacity" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// Laurel Branch for Partner Program Badge
const LaurelBranch = ({ flip = false }: { flip?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={`w-3.5 h-3.5 text-amber-400 shrink-0 ${flip ? "-scale-x-100" : ""}`}
  >
    <path d="M12 2C9.5 4.5 8 8 8 12c0 2.5.8 4.8 2.2 6.6-.5.4-1.2.4-1.7 0C7 17.2 6 15 6 12c0-4 1.5-7.5 4-10H12zm2 0c2.5 2.5 4 6 4 10 0 3-1 5.2-2.5 6.6-.5.4-1.2.4-1.7 0C15.2 16.8 16 14.5 16 12c0-4-1.5-7.5-4-10h2zM7.5 7C6 8.5 5 10.5 5 13c0 2 .7 3.8 1.8 5.2-.4.3-.9.3-1.3 0C4.3 16.8 3.5 15 3.5 13c0-2.8 1.2-5.3 3-7h1zm9 0h1c1.8 1.7 3 4.2 3 7 0 2-.8 3.8-2 5.2-.4.3-.9.3-1.3 0 1.1-1.4 1.8-3.2 1.8-5.2 0-2.5-1-4.5-2.5-6z" />
  </svg>
);

// Circular Tier Medal Icon
const TierMedal = ({ type }: { type: "silver" | "gold" | "platinum" }) => {
  if (type === "gold") {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 p-[1.5px] shadow-[0_0_12px_rgba(245,158,11,0.5)] shrink-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-amber-400 to-amber-700 flex items-center justify-center text-amber-950 font-black text-xs">
          <Award size={15} className="text-amber-100" />
        </div>
      </div>
    );
  }
  if (type === "platinum") {
    return (
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-cyan-400 p-[1.5px] shadow-sm shrink-0 flex items-center justify-center">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-400 to-slate-700 flex items-center justify-center text-white text-xs">
          <Award size={15} className="text-cyan-200" />
        </div>
      </div>
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-500 p-[1.5px] shadow-sm shrink-0 flex items-center justify-center">
      <div className="w-full h-full rounded-full bg-gradient-to-br from-slate-400 to-slate-600 flex items-center justify-center text-white text-xs">
        <Award size={15} className="text-slate-200" />
      </div>
    </div>
  );
};

// Top Promo Slides for Mega Wholesale Banner (Justdial / B2B Hero Carousel)
const TOP_PROMO_SLIDES = [
  {
    id: "monsoon",
    tag: "MONSOON WHOLESALE",
    title: "Monsoon Here!",
    subtitle: "Find Umbrellas, Raincoats, Waterproof Gear, Tarpaulins & Industrial Sheds",
    buttonText: "Explore Now",
    link: "/vendors?search=Waterproof+Monsoon",
    bgImage: "https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "machinery",
    tag: "FACTORY DIRECT",
    title: "Machinery & CNC Expo!",
    subtitle: "Heavy CNC Lathes, Laser Cutters, Hydraulic Presses & Spares with 50/50 Escrow",
    buttonText: "Request Direct Quotes",
    link: "/vendors?category=machinery",
    bgImage: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1200&q=85",
  },
  {
    id: "steel",
    tag: "DIRECT FROM MILLS",
    title: "Raw Steel & Metals!",
    subtitle: "Bulk TMT Bars, Alloy Billets, MS Pipes & Structural Steels at Wholesale Index",
    buttonText: "Browse Verified Mills",
    link: "/vendors?category=metals",
    bgImage: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=1200&q=85",
  }
];

// Top Featured Services Spotlight Cards (matching reference image with 3-visible auto-sliding)
const TOP_SERVICES_SHOWCASE = [
  {
    id: "wholesale-sectors",
    categorySlug: "all",
    title: "WHOLESALE SECTORS",
    subtitle: "Get Instant RFQ",
    badge: "120+ SECTORS",
    moq: "FACTORY ORDERS",
    cardBg: "from-[#081b2c] via-[#0d2a45] to-[#133b5c]",
    borderColor: "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#133b5c] via-[#0d2a45] to-[#081b2c] border-amber-400/50 text-amber-300",
    personImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=85",
    personAlt: "B2B Procurement Manager",
  },
  {
    id: "industrial-machinery",
    categorySlug: "machinery",
    title: "INDUSTRIAL MACHINERY & CNC",
    subtitle: "Find Local Vendors",
    badge: "HEAVY MACHINES",
    moq: "MOQ: 1 Unit",
    cardBg: "from-[#0252bf] via-[#0240a3] to-[#01266f]",
    borderColor: "border-sky-400/40 shadow-[0_0_25px_rgba(56,189,248,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#0240a3] via-[#013282] to-[#01225c] border-sky-400/60 text-amber-300",
    personImage: machineryImg,
    personAlt: "Industrial CNC Engineer",
  },
  {
    id: "raw-materials-steel",
    categorySlug: "metals",
    title: "RAW MATERIALS, STEEL & METALS",
    subtitle: "Source Direct",
    badge: "DIRECT MILLS",
    moq: "MOQ: 500Kg/1Ton",
    cardBg: "from-[#3325c7] via-[#2417a8] to-[#140b6e]",
    borderColor: "border-indigo-400/40 shadow-[0_0_25px_rgba(129,140,248,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#2417a8] via-[#1a0e8c] to-[#100863] border-indigo-400/60 text-amber-300",
    personImage: steelImg,
    personAlt: "Steel & Metallurgy Specialist",
  },
  {
    id: "packaging-boxes",
    categorySlug: "packaging",
    title: "PACKAGING & CORRUGATED BOXES",
    subtitle: "Bulk Cartons",
    badge: "FAST DISPATCH",
    moq: "MOQ: 1,000 Pcs",
    cardBg: "from-[#027a9c] via-[#025a75] to-[#01384a]",
    borderColor: "border-cyan-400/40 shadow-[0_0_25px_rgba(34,211,238,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#025a75] via-[#014459] to-[#012e3d] border-cyan-400/60 text-amber-300",
    personImage: packagingImg,
    personAlt: "Packaging Logistics Specialist",
  },
  {
    id: "electricals-solar",
    categorySlug: "electricals",
    title: "ELECTRICALS, SOLAR & POWER",
    subtitle: "Top Power & Solar",
    badge: "SOLAR TECH",
    moq: "MOQ: 25 Units",
    cardBg: "from-[#047a55] via-[#035a3f] to-[#013525]",
    borderColor: "border-emerald-400/40 shadow-[0_0_25px_rgba(52,211,153,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#035a3f] via-[#02422e] to-[#012b1e] border-emerald-400/60 text-amber-300",
    personImage: solarImg,
    personAlt: "Solar & Electrical Engineer",
  },
  {
    id: "bulk-chemicals-pharma",
    categorySlug: "chemicals",
    title: "BULK CHEMICALS & PHARMA",
    subtitle: "Certified API",
    badge: "ISO 9001 TESTED",
    moq: "MOQ: 200 Ltr/Kg",
    cardBg: "from-[#087a77] via-[#055c5a] to-[#023837]",
    borderColor: "border-teal-400/40 shadow-[0_0_25px_rgba(45,212,191,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#055c5a] via-[#034443] to-[#022c2b] border-teal-400/60 text-amber-300",
    personImage: pharmaImg,
    personAlt: "Pharma Research Scientist",
  },
  {
    id: "construction-infra",
    categorySlug: "construction",
    title: "CONSTRUCTION, CEMENT & TILES",
    subtitle: "Direct Yard Pricing",
    badge: "INFRA GRADE",
    moq: "MOQ: 10 Tons",
    cardBg: "from-[#994703] via-[#753402] to-[#481e01]",
    borderColor: "border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.15)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#753402] via-[#592601] to-[#3b1900] border-amber-400/60 text-amber-300",
    personImage: constructionImg,
    personAlt: "Construction & Cement Head",
  },
  {
    id: "textiles-garments",
    categorySlug: "textiles",
    title: "TEXTILES, YARNS & UNIFORMS",
    subtitle: "Export Quality",
    badge: "MILL EXPORT",
    badgeColor: "bg-rose-400/30 text-rose-100",
    moq: "MOQ: 500 Mtrs",
    cardBg: "from-[#701228] via-[#560a1c] to-[#380411]",
    borderColor: "border-rose-600/50 shadow-[0_0_25px_rgba(112,18,40,0.35)]",
    rfqBtnTheme: "bg-gradient-to-b from-[#701228] via-[#560a1c] to-[#380411] border-rose-400/60 text-amber-300",
    personImage: textileImg,
    personAlt: "Textiles & Garment Director",
  },
];

// Complete Retail & Wholesale Business Sectors & Sourcing Categories
const WHOLESALE_CATEGORIES = [
  {
    id: "apparel-fashion-textiles",
    name: "Apparel, Clothing & Textiles",
    slug: "apparel-textiles",
    count: "2,450+ Mills & Outlets",
    icon: Shirt,
    tags: ["Readymade Garments", "Cotton & Denim", "Ethnic Apparel", "Workwear Fabrics"],
    badge: "Retail & Bulk",
    minMoq: "MOQ: 50 Pcs / Meters",
  },
  {
    id: "food-beverages-fmcg",
    name: "Food, Beverages & Packaged FMCG",
    slug: "food-beverages",
    count: "3,120+ Suppliers",
    icon: Utensils,
    tags: ["Organic Spices", "Grains & Pulses", "Packaged Snacks", "Beverages & Dairy"],
    badge: "Daily Essentials",
    minMoq: "Retail & Wholesale",
  },
  {
    id: "consumer-electronics-gadgets",
    name: "Electronics, Smart Devices & Mobiles",
    slug: "electronics-gadgets",
    count: "1,980+ Stores & Hubs",
    icon: Smartphone,
    tags: ["Smartphones & Audio", "Smart Home Appliances", "IT Gear", "Accessories"],
    badge: "Tech Sourcing",
    minMoq: "1 Unit to Wholesale",
  },
  {
    id: "beauty-personalcare-wellness",
    name: "Beauty, Cosmetics & Personal Care",
    slug: "beauty-personalcare",
    count: "1,350+ Distributors",
    icon: Sparkles,
    tags: ["Skincare Essentials", "Herbal Wellness", "Haircare Solutions", "Cosmetics"],
    badge: "Certified Safe",
    minMoq: "Retail Ready",
  },
  {
    id: "home-furniture-living",
    name: "Home Decor, Furniture & Kitchenware",
    slug: "home-living",
    count: "1,620+ Craft Hubs",
    icon: Home,
    tags: ["Wooden Furniture", "Cookware & Dining", "Home Lighting", "Bedding Fabrics"],
    badge: "Direct Factory",
    minMoq: "Retail & Bulk",
  },
  {
    id: "pharma-healthcare-medical",
    name: "Pharmaceuticals, APIs & Healthcare",
    slug: "pharma-healthcare",
    count: "1,140+ Labs & Suppliers",
    icon: HeartPulse,
    tags: ["Active Pharma APIs", "Surgical Supplies", "Wellness Supplements", "Diagnostic Tools"],
    badge: "GMP Certified",
    minMoq: "Medical Grade",
  },
  {
    id: "industrial-machinery-tools",
    name: "Industrial Machinery & Power Tools",
    slug: "industrial-machinery",
    count: "1,850+ Tooling Mills",
    icon: Factory,
    tags: ["CNC Lathes", "Hydraulic Systems", "Conveyors", "Die Casting Equipment"],
    badge: "ISO Approved",
    minMoq: "MOQ: 1 Unit",
  },
  {
    id: "metals-steel-raw-materials",
    name: "Metals, Alloy Steel & Raw Materials",
    slug: "metals-materials",
    count: "1,280+ Foundry Yards",
    icon: Flame,
    tags: ["TMT Rebars", "SS Sheets & Pipes", "Copper Ingot", "Aluminum Extrusions"],
    badge: "High Volume",
    minMoq: "MOQ: 500 Kg+",
  },
  {
    id: "packaging-cartons-containers",
    name: "Packaging, Corrugated Cartons & Poly",
    slug: "packaging-cartons",
    count: "2,100+ Manufacturers",
    icon: Package,
    tags: ["3-Ply Corrugated Cartons", "Eco Paper Bags", "Bubble Cushioning", "Retail Boxes"],
    badge: "Eco Friendly",
    minMoq: "MOQ: 500 Pcs",
  },
  {
    id: "electricals-solar-power",
    name: "Electrical Gear, Solar PV & Cables",
    slug: "electricals-solar",
    count: "1,410+ Distributors",
    icon: Cpu,
    tags: ["Solar PV Panels", "HT Switchgears", "Power Cables", "Commercial LEDs"],
    badge: "BIS Certified",
    minMoq: "Unit & Bulk",
  },
  {
    id: "automotive-parts-ev-spares",
    name: "Automotive Accessories, Tyres & EV",
    slug: "automotive-spares",
    count: "1,730+ Parts Yards",
    icon: Car,
    tags: ["OEM Auto Parts", "Tyres & Batteries", "Motorcycle Gear", "EV Batteries"],
    badge: "OEM Quality",
    minMoq: "Retail & Bulk",
  },
  {
    id: "agri-products-farming-inputs",
    name: "Agriculture Goods, Seeds & Bio Inputs",
    slug: "agri-farming",
    count: "1,550+ Agri Hubs",
    icon: Sprout,
    tags: ["Bio Fertilizers", "High Yield Seeds", "Drip Irrigation Kits", "Crop Care"],
    badge: "Govt Certified",
    minMoq: "Retail & Bulk Packs",
  },
  {
    id: "construction-cement-tiles",
    name: "Construction Supplies, Cement & Tiles",
    slug: "construction-building",
    count: "1,490+ Yard Suppliers",
    icon: Building2,
    tags: ["OPC 53 Cement", "Vitrified Floor Tiles", "Sanitary Fittings", "RMC Concrete"],
    badge: "Direct Yard",
    minMoq: "MOQ: 10 Tons+",
  },
  {
    id: "freight-logistics-warehousing",
    name: "Freight Logistics, Cold Chain & Fleet",
    slug: "freight-logistics",
    count: "950+ Fleet Logistics",
    icon: Truck,
    tags: ["Express Cargo", "Cold Storage Transport", "3PL Warehousing", "Port Drayage"],
    badge: "Nationwide",
    minMoq: "Single Trip / Parcel",
  },
  {
    id: "office-stationery-printing",
    name: "Office Supplies, Stationery & Printing",
    slug: "office-stationery",
    count: "1,220+ Print Presses",
    icon: FileText,
    tags: ["Copier Paper", "Corporate Merchandise", "Custom Branding", "Office Desk Gear"],
    badge: "Fast Dispatch",
    minMoq: "Retail & Corporate",
  },
  {
    id: "sports-fitness-outdoor",
    name: "Sports Goods, Gym Equipment & Fitness",
    slug: "sports-fitness",
    count: "880+ Manufacturers",
    icon: Award,
    tags: ["Gym Machinery", "Athletic Activewear", "Outdoor Sports Goods", "Fitness Accessories"],
    badge: "Premium Grade",
    minMoq: "Retail & Bulk",
  }
];

// Preferred Wholesale Vendors data with animated credit scores and geographical coordinates
export const PREFERRED_VENDORS = [
  {
    id: "v-apex-steel",
    name: "Apex Precision Forgings & Alloys",
    category: "Raw Materials & Steel",
    location: "Pune & Pimpri-Chinchwad Hub",
    coords: { lat: 18.5204, lng: 73.8567 },
    creditScore: "AAA (99.6/100)",
    creditRating: "CRISIL A1+ Prime",
    rating: 4.95,
    reviews: 248,
    responseTime: "< 2 mins",
    dealVolume: "₹18.4 Cr Fulfilled",
    logo: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=200&q=80",
    tags: ["GST Verified", "ISO 9001:2015", "MSME Gold", "Escrow Secured"],
    capacity: "5,000 MT / Month",
    startingPrice: 45000
  },
  {
    id: "v-nordic-pack",
    name: "Nordic PolyPack & EcoContainers",
    category: "Packaging & Corrugated Boxes",
    location: "Surat & Hazira Industrial Belt",
    coords: { lat: 21.1702, lng: 72.8311 },
    creditScore: "AAA (98.9/100)",
    creditRating: "ICRA A1 Wholesale",
    rating: 4.92,
    reviews: 312,
    responseTime: "< 3 mins",
    dealVolume: "₹12.1 Cr Fulfilled",
    logo: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=200&q=80",
    tags: ["FSC Certified", "100% Recyclable", "Zero Default Record"],
    capacity: "2.5M Cartons / Month",
    startingPrice: 12000
  },
  {
    id: "v-solaria-ind",
    name: "Zenith Industrial Controls & CNC",
    category: "Industrial Machinery",
    location: "Bengaluru & Peenya Zone",
    coords: { lat: 12.9716, lng: 77.5946 },
    creditScore: "AAA (99.2/100)",
    creditRating: "Dun & Bradstreet 5A1",
    rating: 4.98,
    reviews: 189,
    responseTime: "< 5 mins",
    dealVolume: "₹29.8 Cr Fulfilled",
    logo: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80",
    tags: ["CE Marked", "Siemens Partner", "Dedicated Escrow"],
    capacity: "120 CNC Units / Year",
    startingPrice: 185000
  },
  {
    id: "v-balaji-steels",
    name: "Shree Balaji Heavy TMT & Billets",
    category: "Raw Materials & Steel",
    location: "Mumbai & Thane Corridor",
    coords: { lat: 19.0760, lng: 72.8777 },
    creditScore: "AAA (99.4/100)",
    creditRating: "CRISIL Prime",
    rating: 4.96,
    reviews: 215,
    responseTime: "< 4 mins",
    dealVolume: "₹24.6 Cr Fulfilled",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80",
    tags: ["BIS Fe 550D", "Zero Defect", "RBI Escrow"],
    capacity: "8,500 MT / Month",
    startingPrice: 52000
  },
  {
    id: "v-deccan-pharma",
    name: "Deccan Active APIs & Solvents",
    category: "Chemicals & Bulk APIs",
    location: "Hyderabad & Genome Valley",
    coords: { lat: 17.3850, lng: 78.4867 },
    creditScore: "AAA (99.1/100)",
    creditRating: "FDA & GMP Certified",
    rating: 4.94,
    reviews: 176,
    responseTime: "< 6 mins",
    dealVolume: "₹31.2 Cr Fulfilled",
    logo: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?auto=format&fit=crop&w=200&q=80",
    tags: ["WHO-GMP", "ISO 14001", "Fast Dispatch"],
    capacity: "1,200 MT / Month",
    startingPrice: 85000
  },
  {
    id: "v-rajkot-dies",
    name: "Bharat Precision Dies & Lathes",
    category: "Industrial Machinery",
    location: "Rajkot Aji GIDC Hub",
    coords: { lat: 22.3039, lng: 70.8022 },
    creditScore: "AAA (98.8/100)",
    creditRating: "ICRA Rated",
    rating: 4.91,
    reviews: 142,
    responseTime: "< 8 mins",
    dealVolume: "₹9.8 Cr Fulfilled",
    logo: "https://images.unsplash.com/photo-1535813547-99c456a41d4a?auto=format&fit=crop&w=200&q=80",
    tags: ["Heavy Duty", "5-Year Warranty", "Direct Factory"],
    capacity: "80 Units / Year",
    startingPrice: 125000
  }
];

// Luxury Testimonial Case Studies (Matching Reference Design Template with Angled Polygon Cutouts, Metrics & Pastels)
interface CaseStudyDetail {
  industry: string;
  dealVolume: string;
  milestonePlan: string;
  savings: string;
  turnaround: string;
  summary: string;
}

interface TestimonialCaseStudyItem {
  id: string;
  brandName: string;
  brandIcon: React.ElementType;
  brandBadgeBg: string;
  metrics: Array<{ value: string; label: string }>;
  quote: string;
  authorName: string;
  authorRole: string;
  authorImage: string;
  polygonBg: string;
  cardBg: string;
  quoteMarkColor: string;
  layout: "avatar-left" | "avatar-right";
  fullDetails: CaseStudyDetail;
}

const TESTIMONIAL_CASE_STUDIES: TestimonialCaseStudyItem[] = [
  {
    id: "case-buffer-steel",
    brandName: "AutoSteel Global",
    brandIcon: Layers,
    brandBadgeBg: "bg-[#c2410c] text-white",
    metrics: [
      { value: "28%", label: "Increase in RFQ match rate" },
      { value: "22%", label: "Faster supplier conversion" }
    ],
    quote: "Bussinest has become the heartbeat of our raw materials lifecycle strategy, empowering us to contract directly with verified Tier-1 mills in a way that feels genuinely fast, transparent, and completely risk-free.",
    authorName: "Simon Heaton",
    authorRole: "Director of Global Procurement",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=500&q=85",
    polygonBg: "from-[#ea580c] via-[#f97316] to-[#c2410c]",
    cardBg: "bg-[#fff8f3] border-orange-200/80 shadow-orange-950/5",
    quoteMarkColor: "text-orange-900/90",
    layout: "avatar-left",
    fullDetails: {
      industry: "Automotive & Heavy Steel Fabrication",
      dealVolume: "₹4.20 Crore (80 MT Precision Coils)",
      milestonePlan: "50% Initial Escrow Lock • 50% Post-Lab QA Release",
      savings: "₹18.4 Lakhs saved vs broker markups",
      turnaround: "Sourced & Dispatched in 48 Hours",
      summary: "AutoSteel needed high-grade SS 304 coils for an urgent EV stamping contract. Through Bussinest's CRISIL AAA rated vendor network, they completed the order with zero downtime under 50/50 escrow protection."
    }
  },
  {
    id: "case-monarch-packaging",
    brandName: "Monarch Pack",
    brandIcon: Package,
    brandBadgeBg: "bg-[#0284c7] text-white",
    metrics: [
      { value: "3.36%", label: "Zero dispute escrow rate" },
      { value: "4.4%", label: "Boost in repeat bulk contracts" }
    ],
    quote: "Because we have every event and milestone flowing into Bussinest, we were able to build a delivery journey that adapts to what each plant is actually manufacturing—eliminating payment defaults and delays.",
    authorName: "Sue Cho",
    authorRole: "Head of Supply Chain Operations",
    authorImage: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=85",
    polygonBg: "from-[#0284c7] via-[#2563eb] to-[#1d4ed8]",
    cardBg: "bg-[#f0f7ff] border-sky-200/80 shadow-sky-950/5",
    quoteMarkColor: "text-sky-900/90",
    layout: "avatar-right",
    fullDetails: {
      industry: "Industrial Corrugated Boxes & Packaging",
      dealVolume: "₹2.85 Crore (2.5M Heavy Duty Cartons)",
      milestonePlan: "50% Material Staging • 50% Delivery Confirmation",
      savings: "40% Plant Capacity Expansion",
      turnaround: "Direct CEO Escalation Line in < 5 mins",
      summary: "Monarch expanded from regional distribution to 6 states by leveraging Bussinest's automated e-way bill verification and milestone release protocols."
    }
  },
  {
    id: "case-apex-machinery",
    brandName: "Apex Heavy CNC",
    brandIcon: Cpu,
    brandBadgeBg: "bg-[#059669] text-white",
    metrics: [
      { value: "₹32L+", label: "Saved in 1% tiered platform fee" },
      { value: "99.4%", label: "On-time delivery fulfillment" }
    ],
    quote: "Switching from traditional industrial brokerages charging 5–8% to Bussinest's transparent 1% fee saved our heavy engineering division over ₹32 Lakhs while protecting our milestone capital.",
    authorName: "Rajesh Kothari",
    authorRole: "Founder & Managing Director",
    authorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=500&q=85",
    polygonBg: "from-[#059669] via-[#10b981] to-[#047857]",
    cardBg: "bg-[#f0fdf4] border-emerald-200/80 shadow-emerald-950/5",
    quoteMarkColor: "text-emerald-900/90",
    layout: "avatar-left",
    fullDetails: {
      industry: "Heavy Machinery & 5-Axis CNC Milling",
      dealVolume: "₹18.40 Crore (12 CNC Machining Centers)",
      milestonePlan: "50% Factory Pre-dispatch • 50% Installation & QA",
      savings: "₹32.5 Lakhs saved compared to 5% dealer markup",
      turnaround: "Turnkey Installation in 18 Days",
      summary: "Apex acquired 12 specialized CNC machinery units directly from German-certified manufacturers on Bussinest with complete milestone guarantees."
    }
  },
  {
    id: "case-solaria-energy",
    brandName: "Solaria CleanTech",
    brandIcon: Zap,
    brandBadgeBg: "bg-[#4f46e5] text-white",
    metrics: [
      { value: "14 Days", label: "Average grid equipment turnaround" },
      { value: "100%", label: "Escrow secured capital safety" }
    ],
    quote: "Procuring 5MW commercial solar inverters and bi-facial panels used to take months of vendor vetting. Bussinest gave us instant access to tier-1 vetted manufacturers with zero escrow risk.",
    authorName: "Ananya Sharma",
    authorRole: "Chief Procurement Officer",
    authorImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=85",
    polygonBg: "from-[#4f46e5] via-[#6366f1] to-[#4338ca]",
    cardBg: "bg-[#f5f3ff] border-indigo-200/80 shadow-indigo-950/5",
    quoteMarkColor: "text-indigo-900/90",
    layout: "avatar-right",
    fullDetails: {
      industry: "Renewable Energy & Solar Power Grid",
      dealVolume: "₹6.75 Crore (5MW Solar Inverters & Arrays)",
      milestonePlan: "50% Component Sourcing • 50% Grid Interconnect QA",
      savings: "₹24.8 Lakhs in factory-direct pricing",
      turnaround: "Sourced & Delivered in 14 Days",
      summary: "Solaria accelerated its 50MW utility rollout by acquiring certified power electronics on Bussinest with complete milestone protection."
    }
  }
];

// Software & IT Digital Services (100% Brand-Free & Generic)
const SOFTWARE_IT_SERVICES = [
  "Custom Enterprise Software Development", "Cloud Infrastructure & Hosting Services", "Cybersecurity & Threat Prevention",
  "AI & Machine Learning Solutions", "Data Analytics & Business Intelligence", "ERP & CRM System Implementation",
  "Mobile Application & Web Development", "UI/UX Digital Product Design", "DevOps & CI/CD Pipeline Automation",
  "Database Administration & Optimization", "Blockchain & Smart Contract Development", "IT Helpdesk & Managed Technical Support",
  "E-Commerce Platform Solutions", "Embedded Systems & Firmware Engineering", "API Integration & Middleware Development",
  "Quality Assurance & Automated Testing", "IT Compliance & Security Auditing", "Virtualization & Container Orchestration",
  "Microservices Architecture Consulting", "Identity & Access Management Systems"
];

// Hardware & Technology Equipment (100% Brand-Free & Generic)
const HARDWARE_TECH_EQUIPMENT = [
  "Enterprise Servers & Rack Systems", "Data Center Storage & SAN Arrays", "Network Switches, Routers & Firewalls",
  "High-Performance Workstations & Desktop PCs", "Laptops & Portable Computing Hardware", "Smartphones & Mobile Devices",
  "Industrial IoT Sensors & Gateway Devices", "Graphics & Parallel Processing Hardware", "POS Terminals & Barcode Scanners",
  "CCTV Video Surveillance & Biometrics", "Uninterruptible Power Supply (UPS) Systems", "Commercial Printers, Scanners & Plotters",
  "Computer Components & Motherboards", "Audio-Visual Presentation Systems", "Smart Office & Building Automation",
  "Telecommunication PBX & VoIP Hardware", "Fiber Optic Cabling & Networking Gear", "Thermal Label & Receipt Printers",
  "Server Cooling & Thermal Management", "Electronic Test & Measurement Instruments"
];

// Industrial & Manufacturing Services
const INDUSTRIAL_MANUFACTURING_SERVICES = [
  "Industrial Machinery & CNC Machining", "Sheet Metal Fabrication & Laser Cutting", "Drop Forging, Casting & Precision Molds",
  "Raw Metals, TMT Steel & Alloy Billets", "Bulk Solvents, Polymers & Resin Supplies", "Textile Weaving, Dyeing & Yarn Spinning",
  "Corrugated Box & Eco Packaging Production", "Solar PV Panels & HT Electrical Gear", "Active Pharmaceutical Ingredients (APIs)",
  "Automotive Components & Spare Parts", "Hydraulic Pumps, Valves & Cylinders", "Pneumatic Systems & Air Compressors",
  "Conveyor Systems & Material Handling", "Industrial Safety Gear & Workwear", "Bio-Fertilizers & Agricultural Inputs",
  "OPC 53 Cement & Building Supplies", "Plastic Injection Molding Services", "Powder Coating & Surface Finishing",
  "Heat Treatment & Metal Annealing", "Transformer & Power Substation Gear"
];

// Professional & Corporate Services
const PROFESSIONAL_CORPORATE_SERVICES = [
  "Legal & Intellectual Property Advisory", "Accounting, Bookkeeping & Financial Audit", "Corporate Tax & Regulatory Compliance",
  "Architecture & Structural Engineering", "Human Resources & Executive Recruitment", "Search Engine Optimization & Digital Marketing",
  "Public Relations & Brand Management", "Freight Logistics & 3PL Warehousing", "Commercial Real Estate & Land Brokerage",
  "Business Management Consulting", "Market Research & Intelligence Analysis", "Event Management & Corporate Catering",
  "Commercial Facility Cleaning & Security", "Printing, Signage & Branding Services", "Commercial Photography & Videography",
  "Environmental Compliance Advisory", "Translation & Content Localization", "Insurance Advisory & Risk Assessment",
  "Import & Export Customs Clearance", "Contract Manufacturing Supervision"
];

// Consumer, Health & Local Services
const CONSUMER_LIFESTYLE_SERVICES = [
  "Women's PG & Shared Accommodations", "Men's PG & Co-Living Hostels", "Interior Designers & Home Decorators",
  "Licensed Plumbers & Drainage Repair", "Certified Electricians & Power Wiring", "CCTV Video Surveillance & Security",
  "HVAC & Air Conditioner Servicing", "Home Interior Architecture & Furnishing", "Auto Repair, Servicing & Detailing",
  "Hair, Beauty & Personal Care Salons", "Primary Healthcare & Medical Clinics", "Dental Care & Cosmetic Dentistry",
  "Fitness Gyms & Wellness Academies", "Express Parcel & Courier Delivery", "Primary & Secondary Education Academies",
  "Higher Education & Entrance Exam Coaching", "Pet Care & Veterinary Services", "Fine Dining & Catering Services",
  "Artisan Bakery & Confectionery", "Photography & Videography Studios", "Travel & Tour Package Advisory",
  "Home Appliance Repair & Servicing", "Pest Control & Disinfection Services", "Laundry & Dry Cleaning Services"
];

// Popular Indian Cities & Trade Hubs
const POPULAR_INDIAN_CITIES = [
  "Bangalore", "Mumbai", "Chennai", "Delhi-NCR", "Hyderabad", "Pune", "Ahmedabad", "Lucknow", "Patna", "Jaipur",
  "Indore", "Kochi", "Kolkata", "Coimbatore", "Nagpur", "Ludhiana", "Agra", "Bhubaneswar", "Bhopal", "Guwahati",
  "Surat", "Madurai", "Visakhapatnam", "Sonipat", "Vadodara", "Meerut", "Thiruvananthapuram", "Gurugram", "Kozhikode", "Varanasi",
  "Siliguri", "Prayagraj", "Rajkot", "Ghaziabad", "Mysuru", "Noida", "Chandigarh", "Navi Mumbai", "Vijayawada", "Durgapur",
  "Srinagar", "Nashik", "Panipat", "Jammu", "Jodhpur", "Udaipur", "Thane", "Raipur", "Amritsar", "Jabalpur"
];

export default function LandingPage() {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);

  // Directory Matrix Tab state
  const [activeDirTab, setActiveDirTab] = useState<"software" | "hardware" | "industrial" | "professional" | "consumer" | "cities">("software");

  // Active Section ID for Smooth Scrolling & Floating Section Navigator HUD
  const [activeSectionId, setActiveSectionId] = useState<string>("hero");
  const [isNavDockExpanded, setIsNavDockExpanded] = useState<boolean>(false);

  // Parallax Scroll values
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });
  const heroBgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0.4]);

  // Section Intersection Observer for Active Navigation Pill
  useEffect(() => {
    // Section IDs to observe
    const sectionIds = ["hero", "spotlight", "categories", "calculator", "voucher", "nearby", "vendors", "referral", "testimonials", "about", "compliance"];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-20% 0px -40% 0px",
        threshold: 0.15
      }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Smooth Scroll to Section with Sticky Header Offset
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -72; // Height offset for fixed header
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveSectionId(id);
    }
  };

  const handleNextSection = () => {
    const currentIndex = LANDING_SECTIONS.findIndex(s => s.id === activeSectionId);
    if (currentIndex < LANDING_SECTIONS.length - 1) {
      scrollToSection(LANDING_SECTIONS[currentIndex + 1].id);
    }
  };

  const handlePrevSection = () => {
    const currentIndex = LANDING_SECTIONS.findIndex(s => s.id === activeSectionId);
    if (currentIndex > 0) {
      scrollToSection(LANDING_SECTIONS[currentIndex - 1].id);
    }
  };

  // Live Geolocation State
  const {
    coords: userCoords,
    cityName: userCityName,
    stateName: userStateName,
    isLive: isLocationLive,
    loading: isLocationLoading,
    detectLiveLocation,
    setManualHub
  } = useLiveLocation();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All India");
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Sync selected city if live location is detected and user has not manually overridden
  useEffect(() => {
    if (isLocationLive && userCityName && selectedCity === "All India") {
      setSelectedCity(userCityName);
    }
  }, [isLocationLive, userCityName]);

  // Deal Fee & Escrow Calculator State
  const [dealAmount, setDealAmount] = useState<number>(1200000); // 12 Lakhs default

  // Referral Program State
  const [referralCode] = useState("BUSSI-2A3B");
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [copiedCodeOnly, setCopiedCodeOnly] = useState(false);

  // Selected Testimonial Case Study for Modal
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<TestimonialCaseStudyItem | null>(null);

  // Testimonial Carousel Sliding State with Staggered Elements
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [testimonialDirection, setTestimonialDirection] = useState(1);
  const [isTestimonialPaused, setIsTestimonialPaused] = useState(false);

  useEffect(() => {
    if (isTestimonialPaused) return;
    const interval = setInterval(() => {
      setTestimonialDirection(1);
      setTestimonialIndex((prev) => (prev + 1) % TESTIMONIAL_CASE_STUDIES.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isTestimonialPaused]);

  const handleNextTestimonial = () => {
    setTestimonialDirection(1);
    setTestimonialIndex((prev) => (prev + 1) % TESTIMONIAL_CASE_STUDIES.length);
  };

  const handlePrevTestimonial = () => {
    setTestimonialDirection(-1);
    setTestimonialIndex((prev) => (prev === 0 ? TESTIMONIAL_CASE_STUDIES.length - 1 : prev - 1));
  };

  const handleSelectTestimonial = (index: number) => {
    setTestimonialDirection(index >= testimonialIndex ? 1 : -1);
    setTestimonialIndex(index);
  };

  // CEO Concierge & 50% Renewal Voucher Modal State
  const [showCeoModal, setShowCeoModal] = useState(false);
  const [ceoMessage, setCeoMessage] = useState("");
  const [ceoSent, setCeoSent] = useState(false);

  const [copiedVoucher, setCopiedVoucher] = useState(false);
  const [selectedVoucherPlan, setSelectedVoucherPlan] = useState<"pro" | "enterprise">("pro");
  const [pushNotificationActive, setPushNotificationActive] = useState(true);
  const [reminderDays] = useState(15);
  const [simulatedAlert, setSimulatedAlert] = useState<string | null>(null);

  // Quick RFQ Modal State
  const [selectedRfqCategory, setSelectedRfqCategory] = useState<string | null>(null);
  const [rfqQuantity, setRfqQuantity] = useState("");
  const [rfqContact, setRfqContact] = useState("");
  const [rfqSuccess, setRfqSuccess] = useState(false);

  // Top Promo Carousel Banner State
  const [promoSlideIndex, setPromoSlideIndex] = useState(0);
  const [isPromoPlaying, setIsPromoPlaying] = useState(true);

  useEffect(() => {
    if (!isPromoPlaying) return;
    const timer = setInterval(() => {
      setPromoSlideIndex((prev) => (prev + 1) % TOP_PROMO_SLIDES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPromoPlaying]);

  // Top Services Carousel State (Ultra-speed continuous smooth track slide)
  const carouselContainerRef = useRef<HTMLDivElement>(null);
  const [serviceSlideIndex, setServiceSlideIndex] = useState(0);
  const [isServicePaused, setIsServicePaused] = useState(false);
  const [slideSpeed, setSlideSpeed] = useState<"ultra" | "normal">("ultra");
  const [carouselStep, setCarouselStep] = useState(320);

  // Dynamically calculate responsive card width + gap for pixel-perfect glide
  useEffect(() => {
    const updateDimensions = () => {
      if (carouselContainerRef.current) {
        const width = carouselContainerRef.current.offsetWidth;
        if (window.innerWidth >= 1024) {
          // 3 visible cards with 16px (gap-4)
          setCarouselStep((width - 32) / 3 + 16);
        } else if (window.innerWidth >= 640) {
          // 2 visible cards with 14px (gap-3.5)
          setCarouselStep((width - 14) / 2 + 14);
        } else {
          // 1 visible card with 14px
          setCarouselStep(width + 14);
        }
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const visibleCardsCount = typeof window !== "undefined" && window.innerWidth >= 1024 ? 3 : typeof window !== "undefined" && window.innerWidth >= 640 ? 2 : 1;
  const maxSlideIndex = Math.max(0, TOP_SERVICES_SHOWCASE.length - visibleCardsCount);

  useEffect(() => {
    if (isServicePaused) return;
    const intervalMs = slideSpeed === "ultra" ? 2200 : 3600;
    const interval = setInterval(() => {
      setServiceSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
    }, intervalMs);
    return () => clearInterval(interval);
  }, [isServicePaused, slideSpeed, maxSlideIndex]);

  const handleNextServices = () => {
    setServiceSlideIndex((prev) => (prev >= maxSlideIndex ? 0 : prev + 1));
  };

  const handlePrevServices = () => {
    setServiceSlideIndex((prev) => (prev <= 0 ? maxSlideIndex : prev - 1));
  };

  // Calculate Tiered Platform Fee: 3% (< 5L), 2% (5L-25L), 1% (> 25L)
  const calculatePlatformFee = (amount: number) => {
    let feePercent = 3.0;
    if (amount > 2500000) {
      feePercent = 1.0;
    } else if (amount >= 500000) {
      feePercent = 2.0;
    }
    const feeAmount = (amount * feePercent) / 100;
    const upfrontEscrow = amount * 0.5; // 50% Upfront milestone
    const completionEscrow = amount * 0.5; // 50% Upon delivery confirmation
    return { feePercent, feeAmount, upfrontEscrow, completionEscrow };
  };

  const { feePercent, feeAmount, upfrontEscrow, completionEscrow } = calculatePlatformFee(dealAmount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("search", searchQuery.trim());
    if (selectedCategory && selectedCategory !== "all") params.append("category", selectedCategory);
    if (selectedCity && selectedCity !== "All India") params.append("city", selectedCity);
    navigate(`/vendors?${params.toString()}`);
  };

  const handleCopyReferral = () => {
    navigator.clipboard.writeText(`https://bussinest.com/join?ref=${referralCode}`);
    setCopiedReferral(true);
    setTimeout(() => setCopiedReferral(false), 2500);
  };

  const handleCopyCodeOnly = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCodeOnly(true);
    setTimeout(() => setCopiedCodeOnly(false), 2500);
  };

  const handleCopyVoucher = () => {
    navigator.clipboard.writeText("CEO50RENEW");
    setCopiedVoucher(true);
    setTimeout(() => setCopiedVoucher(false), 2500);
  };

  const handleTriggerTestPush = () => {
    setSimulatedAlert("🔔 Push Notification Triggered: 50% Renewal Voucher is active! Your vendor listing auto-renews in " + reminderDays + " days.");
    setTimeout(() => setSimulatedAlert(null), 6000);
  };

  const handleSendCeoEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ceoMessage.trim()) return;
    setCeoSent(true);
    setTimeout(() => {
      setCeoSent(false);
      setShowCeoModal(false);
      setCeoMessage("");
    }, 2500);
  };

  const handleRfqSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRfqSuccess(true);
    setTimeout(() => {
      setRfqSuccess(false);
      setSelectedRfqCategory(null);
      setRfqQuantity("");
      setRfqContact("");
    }, 2500);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#f4f9ff] text-slate-900 overflow-x-hidden selection:bg-sky-500 selection:text-white font-body relative">

      {/* ========================================================================= */}
      {/* FLOATING INTERACTIVE SECTION NAVIGATOR HUD (Desktop Vertical Dock) */}
      {/* ========================================================================= */}
      <div
        className="fixed right-3 sm:right-5 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end group/hud"
        onMouseEnter={() => setIsNavDockExpanded(true)}
        onMouseLeave={() => setIsNavDockExpanded(false)}
      >
        {/* Quick Prev / Next Jump Buttons Header */}
        <div className="flex items-center gap-1 mb-2 bg-white/80 backdrop-blur-xl p-1 rounded-full border border-sky-200/80 shadow-lg shadow-sky-950/5 opacity-80 hover:opacity-100 transition-opacity">
          <button
            onClick={handlePrevSection}
            disabled={activeSectionId === LANDING_SECTIONS[0].id}
            className="w-7 h-7 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs cursor-pointer active:scale-90"
            title="Previous Section (Up)"
            aria-label="Previous Section"
          >
            <ChevronUp size={14} />
          </button>
          <button
            onClick={handleNextSection}
            disabled={activeSectionId === LANDING_SECTIONS[LANDING_SECTIONS.length - 1].id}
            className="w-7 h-7 rounded-full bg-white hover:bg-sky-50 text-slate-700 hover:text-sky-900 flex items-center justify-center transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-xs cursor-pointer active:scale-90"
            title="Next Section (Down)"
            aria-label="Next Section"
          >
            <ChevronDown size={14} />
          </button>
        </div>

        {/* Vertical Section Rail */}
        <div className="bg-white/85 backdrop-blur-2xl p-2 rounded-2xl sm:rounded-3xl border border-sky-200/90 shadow-2xl shadow-sky-950/10 flex flex-col gap-1.5 transition-all duration-300 relative">

          {LANDING_SECTIONS.map((sec) => {
            const isActive = activeSectionId === sec.id;
            const IconComponent = sec.icon;

            return (
              <div key={sec.id} className="relative flex items-center justify-end">
                {/* Expandable Label on Hover / Expanded */}
                <AnimatePresence>
                  {isNavDockExpanded && (
                    <motion.div
                      initial={{ opacity: 0, x: 10, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{ opacity: 0, x: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      onClick={() => scrollToSection(sec.id)}
                      className={`mr-2.5 px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap cursor-pointer transition-all flex items-center gap-1.5 shadow-sm ${isActive
                          ? "bg-sky-600 text-white shadow-sky-600/30 font-black"
                          : "bg-white/90 text-slate-700 hover:bg-sky-50 hover:text-sky-900 border border-sky-100"
                        }`}
                    >
                      <span className="font-mono text-[10px] opacity-75">{sec.tag}</span>
                      <span>{sec.label}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Section Icon / Bullet Button */}
                <button
                  onClick={() => scrollToSection(sec.id)}
                  className={`relative w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-200 cursor-pointer ${isActive
                      ? "bg-gradient-to-tr from-sky-600 to-blue-600 text-white shadow-md shadow-sky-600/35 scale-110"
                      : "bg-sky-50/60 hover:bg-sky-100 text-slate-500 hover:text-sky-700 hover:scale-105"
                    }`}
                  title={`${sec.tag}: ${sec.label}`}
                  aria-label={`Jump to ${sec.label}`}
                >
                  <IconComponent size={14} className={isActive ? "stroke-[2.5]" : "stroke-[1.75]"} />

                  {/* Active Indicator Pulse Ring */}
                  {isActive && (
                    <motion.span
                      layoutId="activeSectionGlow"
                      className="absolute -inset-1 rounded-2xl border-2 border-amber-400/80 pointer-events-none animate-pulse"
                      transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    />
                  )}
                </button>
              </div>
            );
          })}

          {/* Scroll Depth Meter Pill (Self-Contained RAF listener) */}
          <ScrollProgressPill />

        </div>

      </div>

      {/* ========================================================================= */}
      {/* MOBILE COMPACT SECTION NAVIGATOR (Floating Bottom Bar) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-5 left-4 z-40 lg:hidden flex items-center gap-1.5 bg-white/90 backdrop-blur-xl py-1.5 px-3 rounded-full border border-sky-200/90 shadow-xl shadow-sky-950/15">
        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping shrink-0" />
        <span className="text-[11px] font-bold text-sky-950 capitalize truncate max-w-[130px]">
          {LANDING_SECTIONS.find(s => s.id === activeSectionId)?.shortName || "Section"}
        </span>
        <button
          onClick={handleNextSection}
          className="ml-1 p-1 rounded-full bg-sky-100 hover:bg-sky-200 text-sky-800 transition-colors cursor-pointer"
          title="Jump to Next Section"
          aria-label="Next Section"
        >
          <ChevronDown size={13} />
        </button>
      </div>

      {/* ========================================================================= */}
      {/* 1. HERO SECTION: Minimal Prominent Element + 3D Layer Parallax */}
      {/* ========================================================================= */}
      <Section3DLayer id="hero" depthIntensity="dramatic" orbTheme="cyan" layerTag="01" layerTitle="Search & Hero Console">
        <div ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-12 sm:pt-16 md:pt-20 pb-16 sm:pb-24 border-b border-sky-100 w-full">

          {/* Daylight Industrial Modern Facility Backdrop with Gentle Parallax (No Black Background) */}
          <motion.div
            style={{ y: heroBgY, opacity: heroOpacity, transform: "translateZ(0)", willChange: "transform, opacity" }}
            className="absolute inset-0 z-0 bg-cover bg-center pointer-events-none"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=2400&q=85')`
              }}
            />
            {/* Uplifting Sky Blue + Pastel Glass Overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-sky-900/50 via-sky-800/30 to-[#f4f9ff]" />
            <div className="absolute inset-0 bg-gradient-to-r from-sky-900/40 via-sky-600/20 to-sky-900/40" />
          </motion.div>

          {/* Ambient Floating Pastel Orbs */}
          <div className="absolute top-12 left-10 w-96 h-96 rounded-full bg-sky-300/25 blur-3xl pointer-events-none animate-pulse-glow" />
          <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-amber-200/20 blur-3xl pointer-events-none animate-float" />

          {/* Hero Content Container */}
          <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 text-center flex flex-col items-center">

            {/* Credit Rating / Trust Header Pill with Gold Glow */}
            <div className="flex flex-wrap items-center justify-center gap-2 mb-4 sm:mb-6">
              <OriginStatusBadge status="verified" label="CRISIL / ICRA Certified" />
              <OriginStatusBadge status="premium" label="AAA Trust Score: 99.4%" />
            </div>

            {/* Prominent High-Impact Headline with ShinyText */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black font-heading tracking-tight text-white mb-4 sm:mb-6 leading-[1.12] sm:leading-[1.08] max-w-5xl drop-shadow-md px-2"
            >
              India's Premier <ShinyText text="B2B Wholesale" speed={3} className="font-black" /> Vendor Network
            </motion.h1>


            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="text-sm sm:text-lg md:text-xl text-sky-100 max-w-3xl mx-auto mb-8 sm:mb-10 font-medium leading-relaxed drop-shadow px-3"
            >
              Connect directly with verified wholesale manufacturers, bulk suppliers, and industrial contractors with <strong>50/50 Milestone Escrow</strong> and tiered 1–3% platform fees.
            </motion.p>

            {/* ========================================================= */}
            {/* HERO SINGLE PROMINENT ELEMENT: Neomorphic All-in-One Search Engine */}
            {/* ========================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="w-full max-w-5xl bg-[#e9eff6] p-4 sm:p-6 rounded-[32px] sm:rounded-[40px] shadow-[12px_16px_36px_rgba(15,23,42,0.12)] border border-slate-300/60 relative"
            >
              {/* Top Animated Gold Line */}
              <div className="absolute -top-[1px] left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-gold-sweep" />

              <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row items-stretch gap-3">

                {/* Product / Service Input (Neomorphic Inset Well) */}
                <div className="flex-1 flex items-center px-4 py-3 bg-[#e9eff6] shadow-[inset_2px_2px_5px_rgba(163,177,198,0.35)] rounded-2xl border border-slate-300/50 min-h-[48px]">
                  <Search className="text-blue-600 shrink-0 mr-3" size={20} />
                  <input
                    type="text"
                    placeholder="Search wholesale products, CNC, steel, packaging..."
                    className="w-full bg-transparent border-none outline-none text-slate-800 text-sm sm:text-base placeholder:text-slate-400 font-bold"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>

                {/* Quick Category Dropdown (Neomorphic Extruded Pill) */}
                <div className="flex items-center px-3.5 py-3 bg-[#e9eff6] shadow-[3px_3px_8px_rgba(163,177,198,0.3)] border border-slate-300/50 rounded-2xl md:w-56 min-h-[48px]">
                  <Building2 className="text-blue-600 shrink-0 mr-2" size={18} />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-transparent border-none outline-none text-slate-800 text-xs sm:text-sm font-extrabold cursor-pointer"
                  >
                    <option value="all">All Wholesale Categories</option>
                    {WHOLESALE_CATEGORIES.map(c => (
                      <option key={c.slug} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* City / Hub Selector with 1-Tap Live GPS Button */}
                <div className="flex items-center px-3 py-2.5 bg-[#e9eff6] shadow-[3px_3px_8px_rgba(163,177,198,0.3)] border border-slate-300/50 rounded-2xl md:w-52 min-h-[48px] gap-1.5">
                  <Truck className="text-blue-600 shrink-0" size={17} />
                  <select
                    value={selectedCity}
                    onChange={(e) => {
                      if (e.target.value === "LIVE_DETECT") {
                        detectLiveLocation();
                      } else {
                        setSelectedCity(e.target.value);
                      }
                    }}
                    className="w-full bg-transparent border-none outline-none text-slate-800 text-xs sm:text-sm font-extrabold cursor-pointer truncate pr-1"
                  >
                    <option value="All India">All India Delivery</option>
                    {isLocationLive && userCityName && (
                      <option value={userCityName}>📍 {userCityName} (Live GPS)</option>
                    )}
                    <option value="Pune & Pimpri">Pune / Pimpri</option>
                    <option value="Mumbai & MMR">Mumbai / MMR</option>
                    <option value="Delhi NCR">Delhi NCR</option>
                    <option value="Surat & Ahmedabad">Surat / Ahmedabad</option>
                    <option value="Bengaluru">Bengaluru</option>
                    <option value="Chennai">Chennai</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Ludhiana">Ludhiana</option>
                    <option value="Rajkot">Rajkot</option>
                  </select>

                  {/* 1-Tap GPS Detect Trigger Button */}
                  <button
                    type="button"
                    onClick={detectLiveLocation}
                    disabled={isLocationLoading}
                    className={`p-1.5 rounded-xl transition-all shrink-0 cursor-pointer ${isLocationLive
                        ? "bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs"
                        : "bg-[#e9eff6] shadow-[inset_1.5px_1.5px_3px_rgba(163,177,198,0.3)] border border-slate-300/40 text-blue-600"
                      }`}
                    title={isLocationLive ? `Live GPS Active: ${userCityName}` : "Detect My Live GPS Location"}
                    aria-label="Detect GPS Location"
                  >
                    {isLocationLoading ? (
                      <RefreshCw size={13} className="animate-spin text-blue-600" />
                    ) : (
                      <Navigation size={13} className={isLocationLive ? "text-emerald-700" : ""} />
                    )}
                  </button>
                </div>

                {/* CTA Button using Join Now Cyber Button Theme */}
                <div className="shrink-0 flex items-center justify-center w-full md:w-auto">
                  <PurpleCyberButton
                    type="submit"
                    variant="blue"
                    size="sm"
                    textState1="Find Vendors"
                    textState2="Search Now"
                    className="w-full md:w-auto"
                  />
                </div>
              </form>

              {/* Popular Wholesale Tags */}
              <div className="mt-3.5 pt-3 border-t border-slate-200/60 flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 sm:px-2 gap-2">
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-blue-900 text-[11px] sm:text-xs">Popular:</span>
                  {["Corrugated Boxes", "CNC Lathes", "SS 304 Sheets", "Solar Inverters", "HDPE Granules"].map(tag => (
                    <button
                      key={tag}
                      onClick={() => { setSearchQuery(tag); navigate(`/vendors?search=${encodeURIComponent(tag)}`); }}
                      className="px-2.5 py-1 rounded-xl bg-[#e9eff6] shadow-2xs hover:bg-white text-slate-700 font-bold transition-all border border-slate-300/50 cursor-pointer text-[10px] sm:text-[11px]"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> 100% GST & KYC Verified
                </span>
              </div>

              {/* 5-Pillar Core Service Shortcuts */}
              <div className="mt-3 pt-3 border-t border-sky-100/80 grid grid-cols-2 sm:grid-cols-5 gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/vendors?category=b2b")}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-sky-50/80 hover:bg-sky-100/90 border border-sky-200/80 text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Briefcase size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">B2B Sourcing</span>
                    <span className="text-[10px] font-bold text-sky-700">Quick Quotes</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/vendors?search=Repairs+Services")}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-purple-50/80 hover:bg-purple-100/90 border border-purple-200/80 text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Wrench size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">Repairs & Services</span>
                    <span className="text-[10px] font-bold text-purple-700">Nearest Vendor</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/vendors?search=Real+Estate")}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-amber-50/80 hover:bg-amber-100/90 border border-amber-200/80 text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Home size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">Real Estate</span>
                    <span className="text-[10px] font-bold text-amber-800">Finest Agents</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/vendors?search=Doctors+Healthcare")}
                  className="flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-emerald-50/80 hover:bg-emerald-100/90 border border-emerald-200/80 text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <HeartPulse size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">Doctors & Care</span>
                    <span className="text-[10px] font-bold text-emerald-800">Book Now</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/vendors?search=Travel+Logistics")}
                  className="col-span-2 sm:col-span-1 flex items-center gap-2 p-2 sm:p-2.5 rounded-xl bg-rose-50/80 hover:bg-rose-100/90 border border-rose-200/80 text-left transition-all group cursor-pointer shadow-2xs"
                >
                  <div className="w-8 h-8 rounded-lg bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform">
                    <Compass size={16} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-slate-900 block leading-tight">Travel & Flights</span>
                    <span className="text-[10px] font-bold text-rose-800">Lowest Fares</span>
                  </div>
                </button>
              </div>
            </motion.div>

            {/* ========================================================= */}
            {/* Real-time Platform Counter Stats (Glassy Cards) */}
            {/* ========================================================= */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-5xl"
            >
              <div className="glass-premium p-3 sm:p-4 rounded-2xl border border-sky-100 shadow-sm text-center">
                <p className="text-xl sm:text-3xl font-black text-sky-800 font-heading">
                  <AnimatedCounter value={5200} suffix="+" />
                </p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Verified Suppliers</p>
              </div>

              <div className="glass-premium p-3 sm:p-4 rounded-2xl border border-sky-100 shadow-sm text-center">
                <p className="text-xl sm:text-3xl font-black text-sky-800 font-heading">
                  <AnimatedCounter value={280} prefix="₹" suffix=" Cr+" />
                </p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Wholesale GMV</p>
              </div>

              <div className="glass-premium p-3 sm:p-4 rounded-2xl border border-sky-100 shadow-sm text-center">
                <p className="text-xl sm:text-3xl font-black text-sky-800 font-heading">
                  <AnimatedCounter value={99} suffix=".4%" />
                </p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Order Fulfillment</p>
              </div>

              <div className="glass-premium p-3 sm:p-4 rounded-2xl border border-sky-100 shadow-sm text-center">
                <p className="text-xl sm:text-3xl font-black text-sky-800 font-heading">
                  &lt; 2 mins
                </p>
                <p className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 mt-1">Direct Quote SLA</p>
              </div>
            </motion.div>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 01 Hero -> 02 Spotlight */}
      <Layer3DTransition currentTag="01" nextTag="02" nextTitle="Featured Wholesale Sectors" />

      {/* ========================================================================= */}
      {/* 2. TOP FEATURED SERVICES & MEGA WHOLESALE HUB (JUSTDIAL / B2B SPOTLIGHT) */}
      {/* ========================================================================= */}
      <Section3DLayer id="spotlight" depthIntensity="medium" orbTheme="blue" layerTag="02" layerTitle="Featured Wholesale Sectors">
        <div className="py-8 sm:py-10 bg-gradient-to-b from-white/95 via-sky-50/40 to-white/95 border-b border-sky-100 w-full relative">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">

              {/* Left: Wide Promo Hero Banner Carousel */}
              <div className="lg:col-span-4 xl:col-span-4 flex flex-col">
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border border-sky-200/80 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 min-h-[260px] sm:min-h-[290px] h-full flex flex-col justify-between p-5 sm:p-6 text-white group">

                  {/* Background Image with Overlay */}
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-all duration-700 opacity-40 mix-blend-overlay pointer-events-none scale-105 group-hover:scale-100"
                    style={{ backgroundImage: `url('${TOP_PROMO_SLIDES[promoSlideIndex].bgImage}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-sky-950/85 via-sky-900/40 to-transparent pointer-events-none" />
                  <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

                  {/* Top Badge & Seasonal Tag */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-extrabold uppercase tracking-wider text-white border border-white/30 shadow-sm flex items-center gap-1.5">
                      <Sparkles size={12} className="text-amber-300" />
                      {TOP_PROMO_SLIDES[promoSlideIndex].tag}
                    </span>

                    {/* Play/Pause Button */}
                    <button
                      onClick={() => setIsPromoPlaying(!isPromoPlaying)}
                      className="w-7 h-7 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md text-white flex items-center justify-center transition-colors cursor-pointer border border-white/30 shadow-xs"
                      title={isPromoPlaying ? "Pause autoplay" : "Resume autoplay"}
                      aria-label={isPromoPlaying ? "Pause carousel" : "Play carousel"}
                    >
                      {isPromoPlaying ? <Pause size={12} /> : <Play size={12} className="translate-x-0.5" />}
                    </button>
                  </div>

                  {/* Center Content: Headline & Subtitle */}
                  <div className="relative z-10 my-auto py-3">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={TOP_PROMO_SLIDES[promoSlideIndex].id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        transition={{ duration: 0.35 }}
                      >
                        <h3 className="text-2xl sm:text-3xl font-black font-heading tracking-tight leading-tight text-white drop-shadow-md">
                          {TOP_PROMO_SLIDES[promoSlideIndex].title}
                        </h3>
                        <p className="text-xs sm:text-sm text-sky-100/90 font-medium mt-1.5 line-clamp-2 max-w-sm drop-shadow">
                          {TOP_PROMO_SLIDES[promoSlideIndex].subtitle}
                        </p>
                      </motion.div>
                    </AnimatePresence>

                    <div className="mt-4">
                      <button
                        onClick={() => navigate(TOP_PROMO_SLIDES[promoSlideIndex].link)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-500/25 transition-all transform active:scale-95 cursor-pointer"
                      >
                        <span>{TOP_PROMO_SLIDES[promoSlideIndex].buttonText}</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>

                  {/* Footer Controls: Prev / Next Arrows & Pagination Dots */}
                  <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/15">

                    {/* Left & Right Arrow Controls */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setPromoSlideIndex((prev) => (prev === 0 ? TOP_PROMO_SLIDES.length - 1 : prev - 1))}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer border border-white/25"
                        aria-label="Previous promo slide"
                      >
                        <ChevronLeft size={15} />
                      </button>
                      <button
                        onClick={() => setPromoSlideIndex((prev) => (prev + 1) % TOP_PROMO_SLIDES.length)}
                        className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md flex items-center justify-center text-white transition-colors cursor-pointer border border-white/25"
                        aria-label="Next promo slide"
                      >
                        <ChevronRight size={15} />
                      </button>
                    </div>

                    {/* Pagination Dots */}
                    <div className="flex items-center gap-1.5">
                      {TOP_PROMO_SLIDES.map((slide, idx) => (
                        <button
                          key={slide.id}
                          onClick={() => setPromoSlideIndex(idx)}
                          className={`h-2 rounded-full transition-all cursor-pointer ${idx === promoSlideIndex
                              ? "w-6 bg-amber-400 shadow-sm shadow-amber-400/50"
                              : "w-2 bg-white/40 hover:bg-white/70"
                            }`}
                          aria-label={`Go to slide ${idx + 1}`}
                        />
                      ))}
                    </div>

                  </div>

                </div>
              </div>

              {/* Right: Exactly 3 Visible Top Services Showcase Carousel (8 cols on lg/xl) */}
              <div
                className="lg:col-span-8 xl:col-span-8 flex flex-col justify-between"
                onMouseEnter={() => setIsServicePaused(true)}
                onMouseLeave={() => setIsServicePaused(false)}
              >

                {/* Carousel Header & Controls Bar */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
                    <span className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5 font-heading">
                      <Sparkles size={14} className="text-sky-600" /> Featured Wholesale Sectors
                    </span>
                    <span className="text-[11px] font-bold text-sky-700 bg-sky-100/80 px-2.5 py-0.5 rounded-md hidden sm:inline-block border border-sky-200">
                      {serviceSlideIndex + 1}–{Math.min(serviceSlideIndex + visibleCardsCount, TOP_SERVICES_SHOWCASE.length)} of {TOP_SERVICES_SHOWCASE.length}
                    </span>
                  </div>

                  {/* Interactive Next/Prev Controls */}
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <button
                      onClick={handlePrevServices}
                      className="w-8 h-8 rounded-xl neo-btn text-slate-700 hover:text-sky-700 transition-all cursor-pointer active:scale-90 flex items-center justify-center"
                      aria-label="Previous wholesale services"
                    >
                      <ChevronLeft size={16} />
                    </button>
                    <button
                      onClick={handleNextServices}
                      className="w-8 h-8 rounded-xl neo-btn text-slate-700 hover:text-sky-700 transition-all cursor-pointer active:scale-90 flex items-center justify-center"
                      aria-label="Next wholesale services"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                {/* Ultra-Smooth Sliding Track Container */}
                <div ref={carouselContainerRef} className="overflow-hidden w-full rounded-3xl py-1">
                  <motion.div
                    className="flex gap-3.5 sm:gap-4 items-stretch cursor-grab active:cursor-grabbing"
                    animate={{ x: -serviceSlideIndex * carouselStep }}
                    transition={{
                      duration: slideSpeed === "ultra" ? 0.38 : 0.48,
                      ease: [0.16, 1, 0.3, 1] // Ultra-smooth snappy liquid glide
                    }}
                    drag="x"
                    dragConstraints={{
                      left: -maxSlideIndex * carouselStep,
                      right: 0
                    }}
                    onDragEnd={(_, info) => {
                      if (info.offset.x < -40 && serviceSlideIndex < maxSlideIndex) {
                        handleNextServices();
                      } else if (info.offset.x > 40 && serviceSlideIndex > 0) {
                        handlePrevServices();
                      }
                    }}
                  >
                    {TOP_SERVICES_SHOWCASE.map((service) => (
                      <div
                        key={service.id}
                        onClick={() => {
                          if (service.categorySlug === "all") {
                            navigate("/vendors");
                          } else {
                            navigate(`/vendors?category=${service.categorySlug}`);
                          }
                        }}
                        className={`w-full sm:w-[calc((100%-0.875rem)/2)] lg:w-[calc((100%-2rem)/3)] shrink-0 h-[300px] sm:h-[325px] rounded-[28px] p-5 sm:p-6 text-white relative overflow-hidden flex flex-col justify-between border ${service.borderColor} transition-all duration-300 cursor-pointer group hover:-translate-y-1.5 shadow-2xl bg-slate-900`}
                      >
                        {/* Background Gradient */}
                        <motion.div
                          key={`bg-${service.id}-${serviceSlideIndex}`}
                          initial={{ opacity: 0.3, scale: 0.96 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.55, delay: 0.35, ease: "easeOut" }}
                          className={`absolute inset-0 bg-gradient-to-br ${service.cardBg} pointer-events-none`}
                        />

                        {/* Top Glow Accent Bar */}
                        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-80 z-20" />

                        {/* Header Row: Top Left Tag & Top Right MOQ */}
                        <div className="relative z-20">
                          <motion.div
                            key={`badges-${service.id}-${serviceSlideIndex}`}
                            initial={{ opacity: 0, y: -6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
                            className="flex items-center justify-between gap-2 text-[10px] sm:text-[10.5px] font-bold text-white/80 tracking-wider uppercase font-sans"
                          >
                            <span>{service.badge}</span>
                            <span>{service.moq}</span>
                          </motion.div>

                          {/* Title - Reduced font size as requested */}
                          <motion.h3
                            key={`heading-${service.id}-${serviceSlideIndex}`}
                            initial={{ opacity: 0, y: 10, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.38, delay: 0.18, ease: "easeOut" }}
                            className="text-base sm:text-lg font-bold uppercase text-white tracking-tight leading-snug mt-2 font-heading max-w-[85%] drop-shadow-md"
                          >
                            {service.title}
                          </motion.h3>

                          {/* Subtitle - Reduced font size as requested */}
                          <motion.p
                            key={`subtitle-${service.id}-${serviceSlideIndex}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
                            className="text-[11px] sm:text-xs font-medium text-white/85 mt-0.5 drop-shadow-xs"
                          >
                            {service.subtitle}
                          </motion.p>
                        </div>

                        {/* Vertical Instant RFQ Button (Dynamic Box Theme) */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRfqCategory(service.title);
                          }}
                          className={`absolute left-6 sm:left-8 top-[128px] sm:top-[134px] z-30 px-2 py-2.5 rounded-2xl border shadow-xl shadow-black/60 hover:scale-105 active:scale-95 transition-all duration-200 flex flex-col items-center cursor-pointer group/vrfq ${service.rfqBtnTheme || "bg-gradient-to-b from-[#701228] via-[#560a1c] to-[#380411] border-amber-400/50 text-amber-300"}`}
                          title={`Instant RFQ for ${service.title}`}
                        >
                          <Zap size={12} className="text-amber-400 fill-amber-400 mb-1 group-hover/vrfq:scale-125 transition-transform" />
                          <div className="flex flex-col items-center text-[9px] sm:text-[9.5px] font-black uppercase font-mono tracking-tighter text-white leading-tight">
                            <span>I</span>
                            <span>N</span>
                            <span>S</span>
                            <span>T</span>
                            <span>A</span>
                            <span>N</span>
                            <span>T</span>
                            <span className="h-1" />
                            <span className="text-amber-300 font-extrabold">R</span>
                            <span className="text-amber-300 font-extrabold">F</span>
                            <span className="text-amber-300 font-extrabold">Q</span>
                          </div>
                        </button>

                        {/* Person / Industry Image with 4-Side All-Edge Vignette Mask Overlay */}
                        <motion.div
                          key={`img-${service.id}-${serviceSlideIndex}`}
                          initial={{ opacity: 0, scale: 0.9, y: 120 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 1.2, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute bottom-1 right-1 w-[56%] h-[65%] pointer-events-none overflow-hidden flex items-end justify-end z-10"
                        >
                          <img
                            src={service.personImage}
                            alt={service.personAlt}
                            loading="lazy"
                            decoding="async"
                            onError={(e) => {
                              const target = e.currentTarget;
                              target.onerror = null;
                              target.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=85";
                            }}
                            className="w-full h-full object-cover object-top filter contrast-[1.06] saturate-[1.1] drop-shadow-2xl group-hover:scale-105 transition-transform duration-500 rounded-2xl"
                            style={{
                              maskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 90%), linear-gradient(to top, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to left, transparent 0%, black 15%, black 85%, transparent 100%)",
                              WebkitMaskImage: "radial-gradient(ellipse at center, rgba(0,0,0,1) 35%, rgba(0,0,0,0) 90%), linear-gradient(to top, transparent 0%, black 15%, black 85%, transparent 100%), linear-gradient(to left, transparent 0%, black 15%, black 85%, transparent 100%)"
                            }}
                          />
                          {/* Soft Ambient Inner Vignette Layer */}
                          <div className="absolute inset-0 bg-radial from-transparent via-black/20 to-black/60 pointer-events-none rounded-2xl" />
                        </motion.div>

                        {/* Separator Line & Bottom Bar */}
                        <motion.div
                          key={`action-${service.id}-${serviceSlideIndex}`}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.35, delay: 0.3, ease: "easeOut" }}
                          className="relative z-20 mt-auto"
                        >
                          <div className="w-full h-[1px] bg-white/20 mb-3" />
                          <div className="flex items-center justify-end">
                            {/* Circle Arrow Button placed on Bottom Right */}
                            <div className="w-9 h-9 rounded-full border border-white/40 bg-white/10 backdrop-blur-md flex items-center justify-center text-white group-hover:bg-white group-hover:text-slate-950 transition-all duration-300 shadow-md">
                              <ChevronRight size={18} className="group-hover:translate-x-0.5 transition-transform" />
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    ))}

                  </motion.div>
                </div>

                {/* Progress Dots Indicator */}
                <div className="flex items-center justify-center gap-1.5 mt-3 pt-1">
                  {Array.from({ length: maxSlideIndex + 1 }).map((_, idx) => {
                    const isActive = idx === serviceSlideIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setServiceSlideIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${isActive
                            ? "w-8 bg-sky-600 shadow-sm shadow-sky-600/50"
                            : "w-2 bg-slate-300 hover:bg-slate-400"
                          }`}
                        aria-label={`Slide to step ${idx + 1}`}
                      />
                    );
                  })}
                </div>

              </div>

            </div>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 02 Spotlight -> 03 Categories */}
      <Layer3DTransition currentTag="02" nextTag="03" nextTitle="Top Wholesale Categories" />

      {/* ========================================================================= */}
      {/* 3. JUSTDIAL-STYLE WHOLESALE CATEGORIES GRID */}
      {/* ========================================================================= */}
      <Section3DLayer id="categories" depthIntensity="medium" orbTheme="gold" layerTag="03" layerTitle="Top Wholesale Categories">
        <div className="py-16 sm:py-20 bg-white/70 backdrop-blur-md border-b border-sky-100 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                    <Sparkles size={14} className="text-sky-600" /> Wholesale Directory
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
                    Top Wholesale & Retail Business Categories
                  </h2>
                  <p className="text-slate-500 mt-1.5 sm:mt-2 text-sm sm:text-base max-w-xl font-medium">
                    Source seamlessly across retail, wholesale, food, clothing, electronics, industrial & consumer sectors from verified suppliers across India.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/vendors")}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs sm:text-sm transition-colors border border-sky-200 self-start md:self-auto cursor-pointer shadow-sm min-h-[44px]"
                >
                  <span>View All 120+ Sectors</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </ScrollReveal>

            {/* Categories Responsive 2-Row Staggered Layout Grid */}
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6" staggerDelay={0.05}>
              {WHOLESALE_CATEGORIES.map((cat) => {
                const IconComp = cat.icon;
                return (
                  <StaggerItem key={cat.id}>
                    <Card3DTilt maxTilt={6}>
                      <motion.div
                        whileHover={{ y: -6, boxShadow: "0 20px 35px -10px rgba(2, 132, 199, 0.15)" }}
                        className="p-4 sm:p-6 rounded-3xl glass-premium border border-sky-100 hover:border-sky-300 transition-all flex flex-col justify-between h-full group relative overflow-hidden bg-white/80 shadow-sm layer-3d-card"
                      >
                        {/* Category Header */}
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <div className="h-11 w-11 sm:h-13 sm:w-13 rounded-2xl bg-sky-100 group-hover:bg-gradient-to-tr group-hover:from-sky-600 group-hover:to-blue-600 text-sky-700 group-hover:text-white transition-all flex items-center justify-center shadow-inner shrink-0 layer-3d-z-20">
                              <IconComp size={24} className="sm:w-6 sm:h-6" />
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[10px] font-extrabold tracking-wide uppercase shadow-2xs layer-3d-z-10">
                              {cat.badge}
                            </span>
                          </div>

                          <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors leading-snug">
                            {cat.name}
                          </h3>
                          <div className="flex items-center justify-between mt-1.5">
                            <p className="text-xs sm:text-sm font-bold text-sky-700">
                              {cat.count}
                            </p>
                            <span className="text-[11px] font-semibold text-slate-500 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-100">
                              {cat.minMoq}
                            </span>
                          </div>

                          {/* Sub-tags */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {cat.tags.map(t => (
                              <span key={t} className="text-[11px] bg-sky-50/90 group-hover:bg-sky-100 text-slate-700 group-hover:text-sky-800 px-2 py-0.5 rounded-md font-medium transition-colors">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Action Footer */}
                        <div className="mt-5 pt-3.5 border-t border-sky-100 flex items-center justify-between">
                          <button
                            onClick={() => setSelectedRfqCategory(cat.name)}
                            className="text-xs font-bold text-sky-700 hover:text-sky-900 flex items-center gap-1.5 cursor-pointer py-1 group/rfq"
                          >
                            <Zap size={14} className="text-amber-500 fill-amber-400" />
                            <span className="group-hover/rfq:underline">Instant RFQ</span>
                          </button>

                          <button
                            onClick={() => navigate(`/vendors?category=${cat.slug}`)}
                            className="p-2 rounded-xl bg-sky-50 group-hover:bg-sky-600 text-sky-700 group-hover:text-white transition-all cursor-pointer shadow-xs flex items-center gap-1 text-xs font-bold px-3"
                            title="Browse category"
                          >
                            <span>Explore</span>
                            <ChevronRight size={14} />
                          </button>
                        </div>
                      </motion.div>
                    </Card3DTilt>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

            {/* Alphabetical A-Z Directory Index (Enhanced YellowPages Feature) */}
            <div className="mt-12 pt-8 border-t border-sky-200/80">
              <div className="bg-gradient-to-r from-amber-500/10 via-sky-500/10 to-purple-500/10 p-6 sm:p-8 rounded-3xl border border-amber-300/50 shadow-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
                      <Sparkles size={13} className="text-amber-600" /> Alphabetical Directory Index
                    </div>
                    <h3 className="text-xl sm:text-2xl font-black font-heading text-slate-900">
                      Browse All Local Businesses & Services A–Z
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1">
                      Click any letter to instantly filter verified wholesale vendors, technicians, healthcare providers, and local stores.
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/vendors")}
                    className="px-4 py-2.5 bg-amber-400 hover:bg-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all self-start md:self-auto cursor-pointer"
                  >
                    Full Directory Index →
                  </button>
                </div>

                {/* A-Z Letter Buttons */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 justify-center sm:justify-start">
                  {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "#"].map((letter) => (
                    <button
                      key={letter}
                      onClick={() => navigate(`/vendors?search=${letter}`)}
                      className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-white hover:bg-amber-400 hover:text-slate-950 text-slate-800 font-black text-xs sm:text-sm flex items-center justify-center border border-sky-200/80 shadow-2xs hover:scale-110 transition-all cursor-pointer"
                      title={`Browse services starting with ${letter}`}
                    >
                      {letter}
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 03 Categories -> 04 Calculator */}
      <Layer3DTransition currentTag="03" nextTag="04" nextTitle="1–3% Tiered Fee & Escrow" />

      {/* ========================================================================= */}
      {/* 4. TRANSACTION PLATFORM FEE (1-3% TIERED) & 50/50 SPLIT ESCROW */}
      {/* ========================================================================= */}
      <Section3DLayer id="calculator" depthIntensity="medium" orbTheme="emerald" layerTag="04" layerTitle="1–3% Tiered Fee & Escrow">
        <div className="py-16 sm:py-20 bg-[#f0f7ff]/70 backdrop-blur-md border-b border-sky-100 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-200 text-sky-900 text-xs font-bold uppercase tracking-wider mb-3">
                  <Percent size={14} /> Transparent Wholesale Economics
                </div>
                <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight">
                  1–3% Tiered Platform Fee & 50/50 Split Escrow
                </h2>
                <p className="text-slate-600 mt-3 text-sm sm:text-base lg:text-lg font-medium">
                  After vendor registration, on every transaction: Pay industry-lowest tiered fees. Secure 50% upfront for production, with remaining 50% released upon buyer confirmation.
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

              {/* Left: Interactive Deal Value Calculator */}
              <ScrollReveal delay={0.1} className="lg:col-span-7 glass-premium p-5 sm:p-8 rounded-3xl border border-sky-200 shadow-xl shadow-sky-950/5 relative overflow-hidden layer-3d-depth-shadow">
                {/* Gold Top Border */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-amber-400 to-sky-400 animate-gold-sweep" />

                <div className="flex items-center justify-between mb-6 pb-4 border-b border-sky-100">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 sm:p-3 bg-sky-100 text-sky-700 rounded-2xl shadow-inner shrink-0">
                      <Calculator size={22} className="sm:w-6 sm:h-6" />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">Wholesale Fee & Milestone Calculator</h3>
                      <p className="text-[11px] sm:text-xs text-slate-500 font-medium">Live split computation on transaction size</p>
                    </div>
                  </div>
                  <span className="hidden sm:inline-block px-3 py-1 bg-emerald-50 text-emerald-800 font-bold text-xs rounded-full border border-emerald-200">
                    Zero Hidden Charges
                  </span>
                </div>

                {/* Slider for Deal Value */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-2 gap-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Transaction Deal Value:</span>
                    <span className="text-xl sm:text-3xl font-black text-sky-700 font-mono">
                      ₹{(dealAmount / 100000).toFixed(2)} Lakhs <span className="text-xs text-slate-400 font-normal">(₹{dealAmount.toLocaleString()})</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min={100000}
                    max={5000000}
                    step={50000}
                    value={dealAmount}
                    onChange={(e) => setDealAmount(Number(e.target.value))}
                    className="w-full h-3 bg-sky-100 rounded-lg appearance-none cursor-pointer accent-sky-600 my-2"
                  />
                  <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold text-slate-400 mt-1">
                    <span>₹1L (3%)</span>
                    <span>₹10L (2%)</span>
                    <span>₹25L+ (1%)</span>
                    <span>₹50 Lakhs</span>
                  </div>
                </div>

                {/* Tier Cards Indicator */}
                <div className="grid grid-cols-3 gap-2 sm:gap-3 mb-6 sm:mb-8">
                  <div className={`p-2.5 sm:p-3.5 rounded-2xl border text-center transition-all ${feePercent === 3.0 ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 shadow-sm' : 'bg-white/60 border-slate-200 opacity-60'}`}>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500">&lt; ₹5 Lakhs</span>
                    <span className="text-lg sm:text-xl font-black text-sky-800">3.0%</span>
                    <span className="block text-[9px] sm:text-[10px] text-slate-400">Standard Tier</span>
                  </div>

                  <div className={`p-2.5 sm:p-3.5 rounded-2xl border text-center transition-all ${feePercent === 2.0 ? 'bg-sky-50 border-sky-400 ring-2 ring-sky-200 shadow-sm' : 'bg-white/60 border-slate-200 opacity-60'}`}>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500">₹5L – ₹25L</span>
                    <span className="text-lg sm:text-xl font-black text-sky-800">2.0%</span>
                    <span className="block text-[9px] sm:text-[10px] text-sky-700 font-bold">Growth Tier</span>
                  </div>

                  <div className={`p-2.5 sm:p-3.5 rounded-2xl border text-center transition-all ${feePercent === 1.0 ? 'bg-amber-50 border-amber-400 ring-2 ring-amber-200 shadow-sm' : 'bg-white/60 border-slate-200 opacity-60'}`}>
                    <span className="block text-[10px] sm:text-[11px] font-bold text-slate-500">&gt; ₹25 Lakhs</span>
                    <span className="text-lg sm:text-xl font-black text-amber-700">1.0%</span>
                    <span className="block text-[9px] sm:text-[10px] text-amber-800 font-extrabold">Enterprise</span>
                  </div>
                </div>

                {/* 50/50 Milestone Payout Breakdown */}
                <div className="bg-sky-50/70 p-4 sm:p-5 rounded-2xl border border-sky-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 mb-3 sm:mb-4 flex items-center gap-2">
                    <Lock size={14} className="text-sky-700" /> 50% / 50% Milestone Escrow Schedule
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Upfront 50% */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">1. Upfront (50%)</span>
                        <span className="text-[10px] bg-sky-100 text-sky-800 px-2 py-0.5 rounded font-bold">On Order PO</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-slate-900">₹{upfrontEscrow.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 font-medium">Dispatched to vendor upon contract sign to fund production.</p>
                    </div>

                    {/* Remaining 50% */}
                    <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-sky-200 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-slate-700">2. Final (50%)</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">After Buyer QA</span>
                      </div>
                      <p className="text-xl sm:text-2xl font-black text-slate-900">₹{completionEscrow.toLocaleString()}</p>
                      <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1 font-medium">Auto-released from Escrow upon buyer delivery confirmation.</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-sky-200/60 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-slate-700 font-semibold gap-1">
                    <span>Platform Fee ({feePercent}%): <strong>₹{feeAmount.toLocaleString()}</strong></span>
                    <span className="text-emerald-700 font-bold">Net Vendor Payout: ₹{(dealAmount - feeAmount).toLocaleString()}</span>
                  </div>
                </div>
              </ScrollReveal>

              {/* Right: Escrow Protection Benefits */}
              <ScrollReveal delay={0.2} className="lg:col-span-5 space-y-4">
                <div className="p-5 sm:p-6 rounded-3xl glass-premium border border-sky-200 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center mb-3">
                    <ShieldCheck size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">Bank-Grade Escrow Security</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                    Buyer funds are secured in RBI-compliant digital escrow accounts. No capital risk, no delayed supplier collections.
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl glass-premium border border-sky-200 shadow-sm">
                  <div className="h-10 w-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                    <CheckCircle2 size={22} />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base sm:text-lg">Zero Chargeback or Fraud</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
                    Digital PO contracts and automated GST e-way bill reconciliation prevent bad debts and dispute delays.
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-tr from-sky-600 via-sky-500 to-blue-600 text-white shadow-xl shadow-sky-600/20 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none" />
                  <h3 className="font-bold text-white text-base sm:text-lg flex items-center gap-2">
                    <Zap size={20} className="text-amber-300" /> Start Transacting Today
                  </h3>
                  <p className="text-xs text-sky-100 mt-2 leading-relaxed font-medium">
                    Join 5,200+ manufacturers and bulk buyers already doing over ₹280 Cr in safe wholesale trade.
                  </p>
                  <button
                    onClick={() => navigate("/pricing")}
                    className="mt-4 w-full py-3 bg-white text-sky-900 hover:bg-sky-50 font-bold rounded-xl text-xs transition-colors cursor-pointer shadow-md min-h-[44px]"
                  >
                    View Tiered Pricing Plans
                  </button>
                </div>
              </ScrollReveal>

            </div>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 04 Calculator -> 05 Voucher */}
      <Layer3DTransition currentTag="04" nextTag="05" nextTitle="50% Renewal Voucher" />

      {/* ========================================================================= */}
      {/* 5. TOP 500 VENDOR PERKS: 50% Renewal Voucher WebGL 3D Hero & 3D Upward Arrow */}
      {/* ========================================================================= */}
      <Section3DLayer id="voucher" orbTheme="blue" layerTag="05" layerTitle="50% Renewal Voucher">
        <div className="py-8 sm:py-12 relative overflow-hidden w-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xl:gap-8 items-center">

              {/* Left Side: Renewal Voucher Hero Card */}
              <div className="lg:col-span-7 xl:col-span-7 w-full">
                <RenewalVoucherHero
                  onClaimSuccess={(code) => {
                    setCopiedVoucher(true);
                    setSimulatedAlert("🔔 Push Notification Triggered: 50% Renewal Voucher is active with code " + code);
                    setTimeout(() => setCopiedVoucher(false), 3000);
                  }}
                />
              </div>

              {/* Right Side: 3D Animated Upward Growth Arrow */}
              <div className="lg:col-span-5 xl:col-span-5 w-full flex items-center justify-center">
                <Animated3DUpwardArrow />
              </div>

            </div>
          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 05 Voucher -> 06 Nearby Suppliers */}
      <Layer3DTransition currentTag="05" nextTag="06" nextTitle="Live GPS Sourcing Radar" />

      {/* ========================================================================= */}
      {/* 6. LIVE GEOLOCATION & PROXIMITY SUPPLIER RADAR MAP */}
      {/* ========================================================================= */}
      <Section3DLayer id="nearby" depthIntensity="medium" orbTheme="cyan" layerTag="06" layerTitle="Live GPS Sourcing Radar">
        <div className="py-16 sm:py-20 bg-gradient-to-b from-white via-sky-50/50 to-white border-b border-sky-100 w-full relative">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3.5 border border-sky-200 shadow-xs">
                  <Navigation size={14} className="text-sky-600" /> Live GPS Sourcing Radar
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900 tracking-tight">
                  Map Verified Vendors Near You
                </h2>
                <p className="text-slate-600 mt-3 text-sm sm:text-base lg:text-lg font-medium max-w-2xl mx-auto">
                  Real-time highway distance calculation, direct local dispatch routes, and same-day factory procurement across India.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <VendorProximityMap
                vendors={PREFERRED_VENDORS}
                onRequestRfq={(vendorName, cat) => setSelectedRfqCategory(`${vendorName} (${cat})`)}
                onSelectVendor={() => navigate("/vendors")}
              />
            </ScrollReveal>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 06 Nearby Suppliers -> 07 Preferred Vendors */}
      <Layer3DTransition currentTag="06" nextTag="07" nextTitle="Preferred Wholesale Vendors" />

      {/* ========================================================================= */}
      {/* 7. PREFERRED VENDOR SECTION: Elite Certified Suppliers with Credit Badges */}
      {/* ========================================================================= */}
      <Section3DLayer id="vendors" depthIntensity="medium" orbTheme="blue" layerTag="07" layerTitle="Preferred Wholesale Vendors">
        <div className="py-16 sm:py-20 bg-[#f4f9ff] border-b border-sky-100 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

            <ScrollReveal>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14 gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider mb-2.5">
                    <ShieldCheck size={14} className="text-emerald-600" /> Verified Wholesale Network
                  </div>
                  <h2 className="text-2xl sm:text-4xl font-black font-heading text-slate-900 tracking-tight">
                    Preferred Wholesale Vendors
                  </h2>
                  <p className="text-slate-500 mt-1.5 sm:mt-2 text-sm sm:text-base max-w-xl font-medium">
                    Suppliers with certified AAA credit scores, zero dispute records, and rapid order dispatch guarantees.
                  </p>
                </div>

                <button
                  onClick={() => navigate("/vendors")}
                  className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 self-start md:self-auto cursor-pointer min-h-[44px]"
                >
                  <span>Browse All Preferred Vendors</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </ScrollReveal>

            {/* Preferred Vendor Staggered Cards Grid with 3D Mouse Tilt */}
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8" staggerDelay={0.1}>
              {PREFERRED_VENDORS.map((v) => {
                const vCoords = v.coords || resolveCoordinatesForLocation(v.location);
                const distKm = calculateHaversineDistanceKm(
                  userCoords?.lat || 18.5204,
                  userCoords?.lng || 73.8567,
                  vCoords.lat,
                  vCoords.lng
                );
                const dispatchInfo = getDispatchEstimate(distKm);

                return (
                  <StaggerItem key={v.id}>
                    <Card3DTilt intensity={8} className="h-full">
                      <motion.div
                        whileHover={{ y: -6, boxShadow: "0 25px 35px -12px rgba(2, 132, 199, 0.18)" }}
                        className="glass-premium rounded-3xl p-5 sm:p-7 border border-sky-200 shadow-sm flex flex-col justify-between h-full relative overflow-hidden group transition-all duration-300"
                      >
                        {/* Top Animated Gold Line */}
                        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent animate-gold-sweep" />

                        {/* Top Badge Banner */}
                        <div className="flex items-center justify-between mb-4 sm:mb-5 mt-1">
                          {/* Animated Credit Rating Badge */}
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full badge-credit-rating text-amber-950 text-xs font-black animate-rating-pulse">
                            <Star size={14} className="fill-amber-500 text-amber-500" />
                            <span>{v.creditScore}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className="text-[11px] font-black text-emerald-800 flex items-center gap-1 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                              <MapPin size={11} className="text-emerald-600" /> {distKm} km
                            </span>
                            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 bg-sky-50 px-2 py-1 rounded-lg border border-sky-100">
                              <Clock size={12} className="text-sky-600" /> {v.responseTime}
                            </span>
                          </div>
                        </div>

                        {/* Vendor Info */}
                        <div>
                          <div className="flex items-center gap-3.5 sm:gap-4 mb-4">
                            <img
                              src={v.logo}
                              alt={v.name}
                              onError={(e) => {
                                const target = e.currentTarget;
                                target.onerror = null;
                                target.src = "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=200&q=80";
                              }}
                              className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border border-sky-100 shadow-sm shrink-0 bg-white"
                            />
                            <div>
                              <h3 className="font-bold text-slate-900 text-base sm:text-lg group-hover:text-sky-600 transition-colors leading-snug">
                                {v.name}
                              </h3>
                              <p className="text-xs font-bold text-sky-700 mt-0.5">{v.category}</p>
                              <p className="text-[11px] text-slate-500 mt-0.5 font-medium">{v.location}</p>
                            </div>
                          </div>

                          {/* Dispatch & Transit Route Banner */}
                          <div className="mb-4 px-3 py-2 bg-slate-50/90 rounded-xl border border-slate-200/80 flex items-center justify-between text-xs font-semibold">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <Truck size={13} className="text-sky-600" /> {dispatchInfo.transitTime.split("(")[0]}
                            </span>
                            <span className="text-[10px] font-bold text-sky-800 bg-sky-100/70 px-2 py-0.5 rounded">
                              {dispatchInfo.dispatchBadge.split(" ")[0]}
                            </span>
                          </div>

                          {/* Stats pill */}
                          <div className="grid grid-cols-2 gap-2 my-3 bg-sky-50/70 p-3 rounded-2xl border border-sky-100 text-center">
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Total Volume</span>
                              <span className="text-xs sm:text-sm font-black text-sky-900">{v.dealVolume}</span>
                            </div>
                            <div>
                              <span className="block text-[10px] uppercase font-bold text-slate-400">Capacity</span>
                              <span className="text-xs sm:text-sm font-black text-sky-900">{v.capacity}</span>
                            </div>
                          </div>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5 mb-5 sm:mb-6">
                            {v.tags.map(t => (
                              <span key={t} className="text-[10px] font-bold bg-sky-50 text-sky-800 border border-sky-200/80 px-2 py-0.5 rounded-md">
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Card Actions */}
                        <div className="pt-4 border-t border-sky-100 grid grid-cols-2 gap-2.5 sm:gap-3">
                          <button
                            onClick={() => setSelectedRfqCategory(v.name)}
                            className="py-2.5 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-sm min-h-[42px]"
                          >
                            Instant RFQ
                          </button>
                          <button
                            onClick={() => navigate("/vendors")}
                            className="py-2.5 px-3 bg-sky-50 hover:bg-sky-100 text-sky-800 rounded-xl text-xs font-bold transition-all text-center border border-sky-200 cursor-pointer min-h-[42px]"
                          >
                            View Profile
                          </button>
                        </div>

                      </motion.div>
                    </Card3DTilt>
                  </StaggerItem>
                );
              })}
            </StaggerContainer>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 07 Preferred Vendors -> 08 Partner Referral */}
      <Layer3DTransition currentTag="07" nextTag="08" nextTitle="Partner Incentive Program" />

      {/* ========================================================================= */}
      {/* 8. REFERRAL BONUS PROGRAM SECTION (Luminous Royal Azure & Gold Partner Card) */}
      {/* ========================================================================= */}
      <Section3DLayer id="referral" depthIntensity="dramatic" orbTheme="purple" layerTag="08" layerTitle="Partner Incentive Program">
        <div className="py-16 sm:py-20 bg-gradient-to-b from-[#f8fbff] to-white border-b border-sky-100 w-full relative">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">

            <div className="bg-gradient-to-br from-white via-[#f8fbff] to-[#eef6ff] rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-14 text-slate-900 shadow-xl shadow-sky-500/10 relative overflow-hidden border-2 border-sky-200/90">

              {/* Ambient Background Glow */}
              <div className="absolute top-0 right-0 w-[550px] h-[550px] bg-sky-400/10 rounded-full blur-[110px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[450px] h-[450px] bg-amber-400/10 rounded-full blur-[110px] pointer-events-none" />

              {/* Futuristic 3D Polygonal Constellation Overlay (Top-Right) */}
              <svg className="absolute -top-10 -right-10 w-80 sm:w-96 h-80 sm:h-96 opacity-30 pointer-events-none text-sky-400" viewBox="0 0 300 300" fill="none" stroke="currentColor">
                <polygon points="150,20 280,70 240,190 100,230 40,120" strokeWidth="0.75" />
                <polygon points="150,20 200,100 240,190" strokeWidth="0.75" />
                <polygon points="150,20 100,80 40,120" strokeWidth="0.75" />
                <polygon points="100,80 200,100 160,180" strokeWidth="0.75" />
                <polygon points="40,120 100,230 160,180" strokeWidth="0.75" />
                <polygon points="240,190 160,180 100,230" strokeWidth="0.75" />
                <circle cx="150" cy="20" r="3" fill="currentColor" />
                <circle cx="280" cy="70" r="3" fill="currentColor" />
                <circle cx="240" cy="190" r="3" fill="currentColor" />
                <circle cx="100" cy="230" r="3" fill="currentColor" />
                <circle cx="40" cy="120" r="3" fill="currentColor" />
                <circle cx="200" cy="100" r="2.5" fill="currentColor" />
                <circle cx="100" cy="80" r="2.5" fill="currentColor" />
                <circle cx="160" cy="180" r="2.5" fill="currentColor" />
              </svg>

              {/* Futuristic Curved Perspective Wave Wireframe Overlay (Bottom-Left) */}
              <svg className="absolute -bottom-12 -left-12 w-96 h-80 opacity-25 pointer-events-none text-sky-500" viewBox="0 0 400 300" fill="none" stroke="currentColor">
                <path d="M0,150 Q100,80 200,180 T400,120" strokeWidth="0.75" />
                <path d="M0,170 Q100,100 200,200 T400,140" strokeWidth="0.75" />
                <path d="M0,190 Q100,120 200,220 T400,160" strokeWidth="0.75" />
                <path d="M0,210 Q100,140 200,240 T400,180" strokeWidth="0.75" />
                <path d="M0,230 Q100,160 200,260 T400,200" strokeWidth="0.75" />
                <path d="M0,250 Q100,180 200,280 T400,220" strokeWidth="0.75" />
                <path d="M0,270 Q100,200 200,300 T400,240" strokeWidth="0.75" />
                <line x1="50" y1="100" x2="50" y2="300" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="120" y1="80" x2="120" y2="300" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="190" y1="110" x2="190" y2="300" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="260" y1="140" x2="260" y2="300" strokeWidth="0.5" strokeDasharray="3,3" />
                <line x1="330" y1="120" x2="330" y2="300" strokeWidth="0.5" strokeDasharray="3,3" />
              </svg>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

                {/* Left Column: Offer Content & Interactive Share Controls */}
                <div className="lg:col-span-7 space-y-4">

                  {/* Laurel Header Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-900 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider shadow-xs">
                    <LaurelBranch />
                    <span>$ PARTNER INCENTIVE PROGRAM</span>
                    <LaurelBranch flip />
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-[42px] font-black font-heading tracking-tight leading-[1.15] text-slate-950">
                    Earn up to ₹15,000 Referral<br className="hidden sm:inline" /> Bonus per Verified Partner
                  </h2>

                  <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl font-normal">
                    Introduce manufacturers, distributors, or enterprise procurement leaders. Payouts sent directly into your escrow bank account upon their first completed order.
                  </p>

                  {/* Referral Box Area */}
                  <div className="space-y-3 pt-2 max-w-xl">
                    {/* Row 1: Unique Code Badge */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="text-slate-700 font-semibold">Your Unique Wholesale Referral Code:</span>
                      <div className="inline-flex items-center gap-2 bg-white border-2 border-sky-200 px-3 py-1.5 rounded-xl shadow-xs">
                        <span className="text-slate-600 text-xs">Your Unique Code: <strong className="text-sky-950 font-mono font-bold">{referralCode}</strong></span>
                        <button
                          onClick={handleCopyCodeOnly}
                          className="px-2.5 py-1 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-xs active:scale-95"
                          title="Copy Code"
                        >
                          {copiedCodeOnly ? <Check size={12} /> : <Copy size={12} />}
                          <span>{copiedCodeOnly ? "Copied" : "Copy"}</span>
                        </button>
                      </div>
                    </div>

                    {/* Row 2: Link Input + Copy Link Button + Social Share Icons */}
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      {/* Link Input + Copy Button */}
                      <div className="flex-1 flex items-center justify-between bg-white border-2 border-sky-200 rounded-xl p-1.5 pl-3.5 shadow-xs">
                        <span className="text-xs sm:text-sm font-mono text-sky-900 select-all truncate pr-2 font-medium">
                          {`https://bussinest.com/join?ref=${referralCode}`}
                        </span>
                        <button
                          onClick={handleCopyReferral}
                          className="px-3.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap min-h-[34px]"
                        >
                          {copiedReferral ? <Check size={14} /> : <Copy size={14} />}
                          <span>{copiedReferral ? "Copied!" : "Copy Link"}</span>
                        </button>
                      </div>

                      {/* Social Share Icons */}
                      <div className="flex items-center justify-start sm:justify-center gap-2 shrink-0">
                        {/* WhatsApp */}
                        <a
                          href={`https://wa.me/?text=${encodeURIComponent(`Join Bussinest using my partner code: ${referralCode} - https://bussinest.com/join?ref=${referralCode}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                          title="Share on WhatsApp"
                        >
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
                          </svg>
                        </a>

                        {/* LinkedIn */}
                        <a
                          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://bussinest.com/join?ref=${referralCode}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 rounded-full bg-[#0077B5] hover:bg-[#006097] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                          title="Share on LinkedIn"
                        >
                          <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                          </svg>
                        </a>

                        {/* Email */}
                        <a
                          href={`mailto:?subject=${encodeURIComponent("Exclusive Bussinest Wholesale Partner Invitation")}&body=${encodeURIComponent(`Join Bussinest wholesale ecosystem using my partner referral link: https://bussinest.com/join?ref=${referralCode}`)}`}
                          className="w-9 h-9 rounded-full bg-[#475569] hover:bg-[#334155] text-white flex items-center justify-center transition-transform hover:scale-110 shadow-sm cursor-pointer"
                          title="Share via Email"
                        >
                          <Mail size={16} />
                        </a>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Column: Referral Tier Milestones Staggered Glass Card */}
                <div className="lg:col-span-5 bg-white/95 backdrop-blur-2xl p-5 sm:p-7 rounded-[2rem] border-2 border-sky-200/90 space-y-3.5 shadow-xl shadow-sky-500/5 relative">

                  {/* Header */}
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 font-heading">
                    <Award size={20} className="text-amber-500" /> Referral Tier Milestones
                  </h3>

                  <StaggerContainer className="space-y-2.5" staggerDelay={0.08}>

                    {/* Tier 1: Silver Supplier Referral */}
                    <StaggerItem>
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between transition-all hover:bg-sky-100/70">
                        <div className="flex items-center gap-3">
                          <TierMedal type="silver" />
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Silver Supplier Referral</p>
                            <p className="text-[11px] sm:text-xs text-slate-500 font-normal">1-2 Verified Onboardings</p>
                          </div>
                        </div>
                        <span className="text-base sm:text-lg font-bold text-slate-900">₹5,000</span>
                      </div>
                    </StaggerItem>

                    {/* Tier 2: Gold Wholesale Referral (Active Featured Tier) */}
                    <StaggerItem>
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-amber-50/90 border-2 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.18)] flex items-center justify-between relative">
                        <div className="flex items-center gap-3">
                          <TierMedal type="gold" />
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-amber-950">Gold Wholesale Referral</p>
                            <p className="text-[11px] sm:text-xs text-amber-800/90 font-semibold">3-5 Verified Onboardings</p>
                          </div>
                        </div>
                        <span className="text-base sm:text-lg font-black text-amber-900">₹10,000 / each</span>
                      </div>
                    </StaggerItem>

                    {/* Tier 3: Platinum Enterprise Lead */}
                    <StaggerItem>
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex items-center justify-between transition-all hover:bg-sky-100/70">
                        <div className="flex items-center gap-3">
                          <TierMedal type="platinum" />
                          <div>
                            <p className="font-bold text-xs sm:text-sm text-slate-900">Platinum Enterprise Lead</p>
                            <p className="text-[11px] sm:text-xs text-slate-500 font-normal">6+ Bulk Manufacturers</p>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <div className="w-20 sm:w-24 h-1.5 bg-sky-200 rounded-full overflow-hidden mb-1 flex justify-start">
                            <div className="w-3/4 h-full bg-gradient-to-r from-sky-500 to-cyan-400 rounded-full" />
                          </div>
                          <span className="text-base sm:text-lg font-bold text-slate-900">₹15,000 / each</span>
                        </div>
                      </div>
                    </StaggerItem>

                  </StaggerContainer>

                  {/* Bottom Payout Info Pill */}
                  <div className="pt-1">
                    <div className="bg-sky-50/80 border border-sky-200 rounded-xl py-2.5 px-3.5 text-center text-[11px] sm:text-xs text-slate-700 flex items-center justify-center gap-1.5 shadow-xs">
                      <span>Instant bank payout via RazorpayX / IMPS on KYC completion</span>
                      <Sparkles size={13} className="text-amber-500 shrink-0 inline" />
                    </div>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 08 Referral -> 09 Testimonials */}
      <Layer3DTransition currentTag="08" nextTag="09" nextTitle="Enterprise Testimonials" />

      {/* ========================================================================= */}
      {/* 9. CLIENT TESTIMONIALS: Animated Staggered Sliding Case Studies */}
      {/* ========================================================================= */}
      <Section3DLayer id="testimonials" depthIntensity="dramatic" orbTheme="cyan" layerTag="09" layerTitle="Enterprise Testimonials">
        <div className="py-16 sm:py-24 bg-gradient-to-b from-[#f8fbff] via-[#f0f7ff]/70 to-[#f8fbff] border-b border-sky-100 w-full relative overflow-hidden">

          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-sky-300/10 rounded-full blur-[140px] pointer-events-none" />

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">

            <ScrollReveal>
              <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100 text-sky-800 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-xs border border-sky-200">
                  <ThumbsUp size={14} className="text-sky-600" /> Proven Industry Impact
                </div>
                <h2 className="text-3xl sm:text-5xl font-black font-heading text-slate-900 tracking-tight">
                  Trusted by 5,000+ Enterprise Procurement Leaders
                </h2>
                <p className="text-slate-600 mt-3.5 text-sm sm:text-base lg:text-lg font-medium max-w-2xl mx-auto">
                  Real stories and verified milestone metrics from factory owners, procurement directors, and wholesale suppliers scaling on Bussinest.
                </p>
              </div>
            </ScrollReveal>

            {/* Interactive Case Study Navigation Bar */}
            <div className="max-w-5xl mx-auto mb-6 sm:mb-8 flex flex-wrap items-center justify-between gap-3 bg-white/70 backdrop-blur-xl p-2 sm:p-2.5 rounded-2xl border border-sky-200/80 shadow-md shadow-sky-950/5">

              {/* Brand Tab Selectors */}
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                {TESTIMONIAL_CASE_STUDIES.map((item, idx) => {
                  const isActive = idx === testimonialIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelectTestimonial(idx)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${isActive
                          ? `${item.brandBadgeBg} shadow-md scale-102`
                          : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-sky-50"
                        }`}
                    >
                      <item.brandIcon size={14} />
                      <span>{item.brandName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Slider Navigation & Auto-Play Controls */}
              <div className="flex items-center gap-2 shrink-0 ml-auto">
                <button
                  onClick={() => setIsTestimonialPaused(!isTestimonialPaused)}
                  className={`p-2 rounded-xl text-xs font-bold transition-colors cursor-pointer border ${isTestimonialPaused
                      ? "bg-amber-100 text-amber-800 border-amber-300"
                      : "bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100"
                    }`}
                  title={isTestimonialPaused ? "Resume Auto-Slide" : "Pause Auto-Slide"}
                >
                  {isTestimonialPaused ? <Play size={14} /> : <Pause size={14} />}
                </button>

                <div className="h-4 w-px bg-slate-200" />

                <button
                  onClick={handlePrevTestimonial}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-700 hover:text-slate-950 border border-sky-200 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Previous Case Study"
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  onClick={handleNextTestimonial}
                  className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 text-slate-700 hover:text-slate-950 border border-sky-200 transition-all cursor-pointer shadow-xs active:scale-95"
                  title="Next Case Study"
                >
                  <ChevronRight size={16} />
                </button>
              </div>

            </div>

            {/* Staggered Animated Sliding Testimonial Stage */}
            <div
              className="max-w-5xl mx-auto min-h-[420px] sm:min-h-[380px] flex items-center justify-center relative"
              onMouseEnter={() => setIsTestimonialPaused(true)}
              onMouseLeave={() => setIsTestimonialPaused(false)}
            >
              <AnimatePresence mode="wait" custom={testimonialDirection}>
                {(() => {
                  const current = TESTIMONIAL_CASE_STUDIES[testimonialIndex];
                  const isAvatarLeft = current.layout === "avatar-left";

                  return (
                    <div
                      key={current.id}
                      className="w-full flex flex-col md:flex-row items-center gap-6 sm:gap-8 group"
                    >

                      {/* 1. AVATAR WITH ANGLED POLYGON (Animates First: t = 0s) */}
                      <motion.div
                        custom={testimonialDirection}
                        initial={(dir: number) => ({
                          opacity: 0,
                          x: dir > 0 ? 70 : -70,
                          scale: 0.88,
                          rotate: dir > 0 ? 6 : -6
                        })}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          rotate: 0,
                          transition: {
                            duration: 0.55,
                            ease: [0.22, 1, 0.36, 1]
                          }
                        }}
                        exit={(dir: number) => ({
                          opacity: 0,
                          x: dir > 0 ? -60 : 60,
                          scale: 0.88,
                          rotate: dir > 0 ? -6 : 6,
                          transition: {
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1]
                          }
                        })}
                        className={`w-full md:w-60 lg:w-68 shrink-0 flex items-center justify-center ${isAvatarLeft ? "order-1" : "order-1 md:order-2"}`}
                      >
                        <div className="relative w-44 sm:w-52 lg:w-56 h-48 sm:h-56 lg:h-60 flex items-center justify-center">
                          {/* Angled Polygon Silhouette */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-tr ${current.polygonBg} shadow-2xl transition-transform duration-500 group-hover:scale-105`}
                            style={{
                              clipPath: "polygon(26% 0%, 100% 0%, 100% 74%, 74% 100%, 0% 100%, 0% 26%)"
                            }}
                          />

                          {/* Portrait Photo Cutout */}
                          <div
                            className="relative w-[88%] h-[88%] overflow-hidden z-10"
                            style={{
                              clipPath: "polygon(26% 0%, 100% 0%, 100% 74%, 74% 100%, 0% 100%, 0% 26%)"
                            }}
                          >
                            <img
                              src={current.authorImage}
                              alt={current.authorName}
                              className="w-full h-full object-cover object-center scale-105 group-hover:scale-110 transition-transform duration-500"
                            />
                          </div>
                        </div>
                      </motion.div>

                      {/* 2. TESTIMONIAL CONTENT CARD SHELL (Enters at t = 0.1s, then children animate sequentially) */}
                      <motion.div
                        custom={testimonialDirection}
                        initial={(dir: number) => ({
                          opacity: 0,
                          x: dir > 0 ? 40 : -40,
                          scale: 0.98
                        })}
                        animate={{
                          opacity: 1,
                          x: 0,
                          scale: 1,
                          transition: {
                            duration: 0.5,
                            delay: 0.1,
                            ease: [0.22, 1, 0.36, 1]
                          }
                        }}
                        exit={(dir: number) => ({
                          opacity: 0,
                          x: dir > 0 ? -40 : 40,
                          scale: 0.98,
                          transition: {
                            duration: 0.3,
                            ease: [0.22, 1, 0.36, 1]
                          }
                        })}
                        className={`flex-1 w-full ${current.cardBg} border rounded-[2rem] p-6 sm:p-8 lg:p-9 shadow-xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 ${isAvatarLeft ? "order-2" : "order-2 md:order-1"}`}
                      >

                        {/* Top Row: Sequential Children */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-black/5">

                          {/* 2a. Brand Logo Pill (Animates at t = 0.22s) */}
                          <motion.div
                            initial={{ opacity: 0, y: -15, scale: 0.9 }}
                            animate={{
                              opacity: 1,
                              y: 0,
                              scale: 1,
                              transition: { duration: 0.4, delay: 0.22, ease: [0.22, 1, 0.36, 1] }
                            }}
                            className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl ${current.brandBadgeBg} font-black text-xs sm:text-sm tracking-wide shadow-sm self-start`}
                          >
                            <current.brandIcon size={16} />
                            <span>{current.brandName}</span>
                          </motion.div>

                          {/* 2b. Impact Metrics (Animates at t = 0.38s) */}
                          <motion.div
                            initial={{ opacity: 0, x: 25 }}
                            animate={{
                              opacity: 1,
                              x: 0,
                              transition: { duration: 0.45, delay: 0.38, ease: [0.22, 1, 0.36, 1] }
                            }}
                            className="flex items-center gap-4 sm:gap-6 self-start sm:self-auto"
                          >
                            <div>
                              <span className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">{current.metrics[0].value}</span>
                              <span className="block text-[11px] text-slate-500 font-semibold leading-tight">{current.metrics[0].label}</span>
                            </div>
                            <div className="h-8 w-px bg-slate-300/80 shrink-0" />
                            <div>
                              <span className="block text-xl sm:text-2xl font-black text-slate-900 tracking-tight font-heading">{current.metrics[1].value}</span>
                              <span className="block text-[11px] text-slate-500 font-semibold leading-tight">{current.metrics[1].label}</span>
                            </div>
                          </motion.div>

                        </div>

                        {/* 2c. Middle: Decorative Quote + Text (Animates at t = 0.55s) */}
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.5, delay: 0.55, ease: [0.22, 1, 0.36, 1] }
                          }}
                          className="my-5 sm:my-6"
                        >
                          <span className={`text-4xl sm:text-5xl font-serif font-black ${current.quoteMarkColor} leading-none block mb-1.5 select-none opacity-85`}>“</span>
                          <p className="text-slate-800 text-sm sm:text-base lg:text-[17px] font-medium leading-relaxed">
                            {current.quote}
                          </p>
                        </motion.div>

                        {/* 2d. Bottom: Author Bio + Read More Link (Animates at t = 0.72s) */}
                        <motion.div
                          initial={{ opacity: 0, y: 15 }}
                          animate={{
                            opacity: 1,
                            y: 0,
                            transition: { duration: 0.45, delay: 0.72, ease: [0.22, 1, 0.36, 1] }
                          }}
                          className="flex items-center justify-between gap-4 pt-4 border-t border-black/5"
                        >
                          <div>
                            <h4 className="font-bold text-slate-900 text-sm sm:text-base">{current.authorName}</h4>
                            <p className="text-slate-500 text-xs sm:text-sm font-medium">{current.authorRole}</p>
                          </div>

                          <button
                            onClick={() => setSelectedCaseStudy(current)}
                            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-700 hover:text-slate-950 transition-colors group/btn cursor-pointer py-1.5 px-3 rounded-xl bg-white/70 hover:bg-white border border-black/5 shadow-xs shrink-0"
                          >
                            <Plus size={14} className="text-slate-500 group-hover/btn:text-slate-950 transition-transform group-hover/btn:rotate-90" />
                            <span>Read full case study</span>
                          </button>
                        </motion.div>

                      </motion.div>

                    </div>
                  );
                })()}
              </AnimatePresence>
            </div>

            {/* Slide Indicators & Auto-Slide Progress Ribbon */}
            <div className="max-w-5xl mx-auto mt-6 flex items-center justify-center gap-3">
              {TESTIMONIAL_CASE_STUDIES.map((item, idx) => {
                const isActive = idx === testimonialIndex;
                return (
                  <button
                    key={`dot-${item.id}`}
                    onClick={() => handleSelectTestimonial(idx)}
                    className={`h-2.5 rounded-full transition-all cursor-pointer ${isActive
                        ? "w-10 bg-gradient-to-r from-sky-600 to-blue-600 shadow-sm"
                        : "w-2.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                    title={`Go to ${item.brandName}`}
                  />
                );
              })}
            </div>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 09 Testimonials -> 10 About Platform */}
      <Layer3DTransition currentTag="09" nextTag="10" nextTitle="One-Stop Sourcing Hub" />

      {/* ========================================================================= */}
      {/* 10. ONE-STOP B2B PLATFORM FOR ALL LOCAL & INDUSTRIAL BUSINESSES */}
      {/* ========================================================================= */}
      <Section3DLayer id="about" depthIntensity="medium" orbTheme="blue" layerTag="10" layerTitle="One-Stop Sourcing Hub">
        <div className="py-16 sm:py-24 bg-gradient-to-b from-white/70 via-sky-50/40 to-white/70 border-b border-sky-100 w-full relative overflow-hidden">
          {/* Subtle Ambient Background Lighting */}
          <div className="absolute top-1/3 left-1/4 w-[600px] h-[300px] bg-sky-300/15 rounded-full blur-[130px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[300px] bg-amber-200/15 rounded-full blur-[120px] pointer-events-none" />

          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">

            <ScrollReveal>
              <div className="bg-white/80 backdrop-blur-3xl rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 lg:p-14 border border-white/90 shadow-2xl shadow-sky-950/8 relative overflow-hidden">
                <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

                <div className="max-w-4xl mb-10 sm:mb-12">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-100/90 text-sky-900 text-xs font-bold uppercase tracking-wider mb-3.5 shadow-xs border border-sky-200/80">
                    <Building2 size={14} className="text-sky-600" /> Unified Wholesale Sourcing Network
                  </div>
                  <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black font-heading text-slate-900 tracking-tight leading-tight">
                    One-Stop Sourcing Hub for All Industrial & Local Businesses
                  </h2>
                  <p className="text-slate-600 mt-4 text-sm sm:text-base lg:text-lg leading-relaxed font-medium">
                    Welcome to <strong>Bussinest</strong>, your trusted wholesale discovery and procurement hub where enterprises, manufacturing plants, and regional distributors are empowered with streamlined day-to-day sourcing and exclusive contract purchasing. We take pride in delivering a secure, transparent B2B ecosystem backed by factory verification, CRISIL/ICRA AAA credit telemetry, and protected 50/50 split milestone escrow.
                  </p>
                </div>

                {/* 3 Core Value Pillars with Staggered Entrance */}
                <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12" staggerDelay={0.1}>

                  <StaggerItem>
                    <div className="p-6 sm:p-7 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 hover:border-sky-300 transition-all shadow-md shadow-sky-950/5 hover:shadow-xl group h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-600 text-white flex items-center justify-center mb-4 shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform">
                          <Zap size={22} className="text-amber-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                          Day-to-Day & Strategic Procurement
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          From routine packaging consumables and standard fasteners to heavy industrial CNC machinery, access verified quotes directly from tier-1 manufacturers within minutes.
                        </p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="p-6 sm:p-7 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 hover:border-sky-300 transition-all shadow-md shadow-sky-950/5 hover:shadow-xl group h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-4 shadow-md shadow-blue-600/20 group-hover:scale-105 transition-transform">
                          <ShieldCheck size={22} className="text-emerald-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                          Protected 50/50 Milestone Escrow
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          Mitigate transaction risk with automated milestone disbursements: 50% upfront production deposit and 50% final release upon digital delivery confirmation.
                        </p>
                      </div>
                    </div>
                  </StaggerItem>

                  <StaggerItem>
                    <div className="p-6 sm:p-7 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/90 hover:border-sky-300 transition-all shadow-md shadow-sky-950/5 hover:shadow-xl group h-full flex flex-col justify-between">
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-700 text-white flex items-center justify-center mb-4 shadow-md shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                          <Award size={22} className="text-amber-300" />
                        </div>
                        <h3 className="font-bold text-slate-900 text-base sm:text-lg mb-2">
                          Verified Factory Compliance & Ratings
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
                          Every supplier is vetted through GSTN API verification, plant capacity inspections, and real-time financial solvency scoring with transparent 1%–3% platform fees.
                        </p>
                      </div>
                    </div>
                  </StaggerItem>

                </StaggerContainer>

                {/* Comprehensive 6-Tab Directory Matrix (Hardware, Software, Industrial, Professional, Consumer & Cities) */}
                <div className="pt-8 border-t border-sky-100">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                    <div>
                      <h4 className="text-sm font-extrabold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                        <Compass size={18} className="text-sky-600" /> Unified Technology, Industrial & Local Directory
                      </h4>
                      <p className="text-xs text-slate-500 font-medium mt-0.5">Explore software engineering, IT hardware, industrial manufacturing, professional corporate services, consumer lifestyle & 50 top trade hubs.</p>
                    </div>

                    {/* Directory Matrix Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 bg-sky-50/80 p-1.5 rounded-2xl border border-sky-100/90 shadow-inner">
                      <button
                        onClick={() => setActiveDirTab("software")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeDirTab === "software" ? "bg-sky-600 text-white shadow-md font-black" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                      >
                        <Terminal size={14} className={activeDirTab === "software" ? "text-white" : "text-sky-600"} />
                        <span>Software & IT ({SOFTWARE_IT_SERVICES.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveDirTab("hardware")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeDirTab === "hardware" ? "bg-sky-600 text-white shadow-md font-black" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                      >
                        <Server size={14} className={activeDirTab === "hardware" ? "text-white" : "text-amber-600"} />
                        <span>Hardware & Tech ({HARDWARE_TECH_EQUIPMENT.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveDirTab("industrial")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeDirTab === "industrial" ? "bg-sky-600 text-white shadow-md font-black" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                      >
                        <Factory size={14} className={activeDirTab === "industrial" ? "text-white" : "text-indigo-600"} />
                        <span>Industrial ({INDUSTRIAL_MANUFACTURING_SERVICES.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveDirTab("professional")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeDirTab === "professional" ? "bg-sky-600 text-white shadow-md font-black" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                      >
                        <Briefcase size={14} className={activeDirTab === "professional" ? "text-white" : "text-emerald-600"} />
                        <span>Professional ({PROFESSIONAL_CORPORATE_SERVICES.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveDirTab("consumer")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeDirTab === "consumer" ? "bg-sky-600 text-white shadow-md font-black" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                      >
                        <ShoppingBag size={14} className={activeDirTab === "consumer" ? "text-white" : "text-purple-600"} />
                        <span>Consumer & Lifestyle ({CONSUMER_LIFESTYLE_SERVICES.length})</span>
                      </button>
                      <button
                        onClick={() => setActiveDirTab("cities")}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${activeDirTab === "cities" ? "bg-sky-600 text-white shadow-md font-black" : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                          }`}
                      >
                        <MapPin size={14} className={activeDirTab === "cities" ? "text-white" : "text-sky-600"} />
                        <span>Metros & Hubs ({POPULAR_INDIAN_CITIES.length})</span>
                      </button>
                    </div>
                  </div>

                  {/* Tab Contents Container */}
                  <div className="bg-sky-50/40 p-4 sm:p-5 rounded-2xl border border-sky-100">
                    {activeDirTab === "software" && (
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {SOFTWARE_IT_SERVICES.map((service) => (
                          <button
                            key={service}
                            onClick={() => navigate(`/vendors?search=${encodeURIComponent(service)}`)}
                            className="text-[11px] font-semibold bg-white hover:bg-sky-100 text-slate-700 hover:text-sky-900 px-3 py-1.5 rounded-lg border border-sky-200/80 transition-all cursor-pointer shadow-2xs hover:shadow-xs flex items-center gap-1.5"
                          >
                            <Code size={13} className="text-sky-600 shrink-0" />
                            <span>{service}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeDirTab === "hardware" && (
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {HARDWARE_TECH_EQUIPMENT.map((item) => (
                          <button
                            key={item}
                            onClick={() => navigate(`/vendors?search=${encodeURIComponent(item)}`)}
                            className="text-[11px] font-semibold bg-amber-50 hover:bg-amber-100 text-amber-950 px-3 py-1.5 rounded-lg border border-amber-200/80 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <HardDrive size={13} className="text-amber-600 shrink-0" />
                            <span>{item}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeDirTab === "industrial" && (
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {INDUSTRIAL_MANUFACTURING_SERVICES.map((ind) => (
                          <button
                            key={ind}
                            onClick={() => navigate(`/vendors?search=${encodeURIComponent(ind)}`)}
                            className="text-[11px] font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-950 px-3 py-1.5 rounded-lg border border-indigo-200/80 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Wrench size={13} className="text-indigo-600 shrink-0" />
                            <span>{ind}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeDirTab === "professional" && (
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {PROFESSIONAL_CORPORATE_SERVICES.map((prof) => (
                          <button
                            key={prof}
                            onClick={() => navigate(`/vendors?search=${encodeURIComponent(prof)}`)}
                            className="text-[11px] font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-200/80 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Briefcase size={13} className="text-emerald-600 shrink-0" />
                            <span>{prof}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeDirTab === "consumer" && (
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {CONSUMER_LIFESTYLE_SERVICES.map((cons) => (
                          <button
                            key={cons}
                            onClick={() => navigate(`/vendors?search=${encodeURIComponent(cons)}`)}
                            className="text-[11px] font-semibold bg-purple-50 hover:bg-purple-100 text-purple-950 px-3 py-1.5 rounded-lg border border-purple-200/80 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <Store size={13} className="text-purple-600 shrink-0" />
                            <span>{cons}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    {activeDirTab === "cities" && (
                      <div className="flex flex-wrap gap-2 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                        {POPULAR_INDIAN_CITIES.map((city) => (
                          <button
                            key={city}
                            onClick={() => navigate(`/vendors?location=${encodeURIComponent(city)}`)}
                            className="text-[11px] font-semibold bg-sky-100/70 hover:bg-sky-200 text-sky-900 px-3.5 py-1.5 rounded-lg border border-sky-300/80 transition-all cursor-pointer shadow-2xs flex items-center gap-1.5"
                          >
                            <MapPin size={13} className="text-sky-600 shrink-0" />
                            <span>{city} Suppliers</span>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </ScrollReveal>

          </div>
        </div>
      </Section3DLayer>

      {/* 3D Layer Transition: 10 About -> 11 Compliance & Trust */}
      <Layer3DTransition currentTag="10" nextTag="11" nextTitle="Enterprise Trust & Compliance" />

      {/* ========================================================================= */}
      {/* 11. ENTERPRISE COMPLIANCE & TRUST PARTNER BAR */}
      {/* ========================================================================= */}
      <Section3DLayer id="compliance" depthIntensity="subtle" orbTheme="gold" layerTag="11" layerTitle="Enterprise Trust & Compliance">
        <div className="py-10 bg-white/80 backdrop-blur-md border-b border-sky-100 w-full">
          <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-slate-600 text-xs sm:text-sm font-bold uppercase tracking-wider" staggerDelay={0.08}>
              <StaggerItem>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50/50 border border-sky-100/60">
                  <ShieldCheck size={18} className="text-sky-600 shrink-0" /> <span className="truncate">GSTN Direct API</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-sky-50/50 border border-sky-100/60">
                  <Lock size={18} className="text-sky-600 shrink-0" /> <span className="truncate">ISO 27001 Certified</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-emerald-50/50 border border-emerald-100/60">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" /> <span className="truncate">RBI Digital Escrow</span>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-amber-50/50 border border-amber-100/60">
                  <Award size={18} className="text-amber-500 shrink-0" /> <span className="truncate">CRISIL Rated Suppliers</span>
                </div>
              </StaggerItem>
            </StaggerContainer>
          </div>
        </div>
      </Section3DLayer>

      {/* ========================================================================= */}
      {/* 9. MODALS & POPUPS (CEO Direct Concierge & Bulk RFQ Modal) */}
      {/* ========================================================================= */}

      {/* CEO-to-Vendor Concierge Modal */}
      <AnimatePresence>
        {showCeoModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-sky-200 shadow-2xl relative gold-border-glow"
            >
              <button
                onClick={() => setShowCeoModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-sky-100 text-sky-700 rounded-2xl shadow-inner">
                  <Mail size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 font-heading">CEO Direct Concierge Line</h3>
                  <p className="text-xs text-sky-800 font-bold">To: Raghav Singhania (CEO, Bussinest)</p>
                </div>
              </div>

              {ceoSent ? (
                <div className="p-8 text-center bg-sky-50 rounded-2xl border border-sky-200 my-4">
                  <CheckCircle2 size={48} className="text-emerald-500 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-lg">Message Dispatched Directly</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Our CEO office has received your inquiry. Expected SLA response: within 60 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleSendCeoEmail} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Your Vendor ID / Business Name</label>
                    <input
                      type="text"
                      defaultValue="Apex Precision Forgings (Top 500)"
                      className="w-full bg-slate-50 border border-sky-200 rounded-xl p-3 text-xs font-bold text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 uppercase tracking-wider">Priority Matter / Message</label>
                    <textarea
                      rows={4}
                      placeholder="Describe your bulk requirement, partnership inquiry, or escalation..."
                      value={ceoMessage}
                      onChange={(e) => setCeoMessage(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-sky-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowCeoModal(false)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-200 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Send size={14} /> Send to CEO
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick Bulk RFQ Modal */}
      <AnimatePresence>
        {selectedRfqCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-md w-full border border-sky-200 shadow-2xl relative gold-border-glow"
            >
              <button
                onClick={() => setSelectedRfqCategory(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>

              <div className="mb-4">
                <span className="text-xs font-bold text-sky-800 uppercase tracking-wider">Fast 1-Minute RFQ</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5 font-heading">Post Your Requirements</h3>
                <p className="text-xs text-slate-600 font-medium">Category: <strong>{selectedRfqCategory}</strong></p>
              </div>

              {rfqSuccess ? (
                <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 my-4">
                  <CheckCircle2 size={44} className="text-emerald-600 mx-auto mb-3" />
                  <h4 className="font-bold text-slate-900 text-base">RFQ Dispatched to Verified Suppliers</h4>
                  <p className="text-xs text-slate-500 mt-1 font-medium">Top verified vendors will respond with direct quotes within 15 minutes.</p>
                </div>
              ) : (
                <form onSubmit={handleRfqSubmit} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Estimated Quantity / Spec</label>
                    <input
                      type="text"
                      placeholder="e.g. 5,000 units / 10 Tons monthly"
                      value={rfqQuantity}
                      onChange={(e) => setRfqQuantity(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-sky-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Company Contact / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="e.g. +91 98765 43210 or procurement@company.com"
                      value={rfqContact}
                      onChange={(e) => setRfqContact(e.target.value)}
                      required
                      className="w-full bg-slate-50 border border-sky-200 rounded-xl p-3 text-xs text-slate-800 outline-none focus:border-sky-500 font-medium"
                    />
                  </div>

                  <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 text-[11px] text-sky-900 font-semibold">
                    🔒 Covered under 50/50 Escrow Protection & NDA.
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-600/20 cursor-pointer"
                  >
                    Submit RFQ to Verified Suppliers
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Verified Case Study Full Detail Modal */}
      <AnimatePresence>
        {selectedCaseStudy && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/40 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white/95 backdrop-blur-2xl rounded-3xl p-6 sm:p-8 max-w-2xl w-full border border-sky-200 shadow-2xl relative gold-border-glow overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

              <button
                onClick={() => setSelectedCaseStudy(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 font-bold p-1.5 cursor-pointer rounded-full hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <div className={`p-3 rounded-2xl ${selectedCaseStudy.brandBadgeBg} shadow-md`}>
                  <selectedCaseStudy.brandIcon size={24} />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 mb-1">
                    <ShieldCheck size={13} /> Verified Milestone Case Study
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                    {selectedCaseStudy.brandName} &times; Bussinest
                  </h3>
                </div>
              </div>

              <div className="overflow-y-auto pr-1 space-y-5 text-xs sm:text-sm">

                {/* Executive Summary */}
                <div className="p-4 rounded-2xl bg-sky-50/70 border border-sky-100 text-slate-700 leading-relaxed font-medium">
                  {selectedCaseStudy.fullDetails.summary}
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Total PO Volume</span>
                    <span className="font-black text-slate-900 text-xs sm:text-sm">{selectedCaseStudy.fullDetails.dealVolume}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">Escrow Savings</span>
                    <span className="font-black text-emerald-700 text-xs sm:text-sm">{selectedCaseStudy.fullDetails.savings}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                    <span className="block text-[10px] uppercase font-bold text-slate-400">SLA Speed</span>
                    <span className="font-black text-sky-700 text-xs sm:text-sm">{selectedCaseStudy.fullDetails.turnaround}</span>
                  </div>
                </div>

                {/* Milestone Architecture */}
                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                  <h4 className="font-bold text-amber-950 text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Lock size={14} className="text-amber-700" /> Milestone Escrow Protection Plan
                  </h4>
                  <p className="text-amber-900 text-xs font-medium">
                    {selectedCaseStudy.fullDetails.milestonePlan}
                  </p>
                </div>

                {/* Verified Executive Statement */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <p className="text-slate-800 italic font-medium mb-3">
                    "{selectedCaseStudy.quote}"
                  </p>
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCaseStudy.authorImage}
                      alt={selectedCaseStudy.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h5 className="font-bold text-slate-900 text-xs">{selectedCaseStudy.authorName}</h5>
                      <p className="text-[11px] text-slate-500 font-medium">{selectedCaseStudy.authorRole}, {selectedCaseStudy.brandName}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Modal Actions */}
              <div className="mt-5 pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSelectedCaseStudy(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setSelectedCaseStudy(null);
                    navigate("/vendors");
                  }}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md shadow-sky-600/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Source Matching Wholesale Materials</span>
                  <ArrowRight size={14} />
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ScrollCraft Architectural Highway HUD & Master Index Controller */}
      <ScrollCraftHUD />

    </div>
  );
}
