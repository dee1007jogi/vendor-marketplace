import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Sparkles, Search, ShieldCheck, Zap, Star, LayoutGrid, Layers, ArrowRight, CheckCircle2,
  Lock, ArrowUpRight, Compass, Flame, Package, Factory, Cpu, RefreshCw
} from "lucide-react";

import OriginAnimatedInput from "../components/originkit/OriginAnimatedInput";
import OriginGlowingCard from "../components/originkit/OriginGlowingCard";
import OriginSegmentedTabs, { OriginTabItem } from "../components/originkit/OriginSegmentedTabs";
import OriginSparkleButton from "../components/originkit/OriginSparkleButton";
import OriginStatusBadge from "../components/originkit/OriginStatusBadge";
import OriginAccordion from "../components/originkit/OriginAccordion";

export const OriginKitShowcase: React.FC = () => {
  const [activeSegmentTab, setActiveSegmentTab] = useState("overview");
  const [searchValue, setSearchValue] = useState("");

  const sampleTabs: OriginTabItem[] = [
    { id: "overview", label: "Overview", icon: LayoutGrid },
    { id: "vendors", label: "Wholesale Vendors", icon: Factory, badge: 142 },
    { id: "analytics", label: "Market Analytics", icon: Zap, badge: "LIVE" },
    { id: "security", label: "Escrow Security", icon: Lock },
  ];

  const accordionItems = [
    {
      id: "escrow",
      title: "How does the 1–3% Tiered Escrow Protection work?",
      badge: "Security Standard",
      icon: <Lock size={16} />,
      content:
        "Funds are safely held in insured escrow bank accounts until buyer inspects and approves incoming goods. 0% upfront risk for buyers, guaranteed payment release for suppliers upon digital sign-off.",
    },
    {
      id: "matching",
      title: "AI-Powered Verified Supplier Matching Engine",
      badge: "Real-time AI",
      icon: <Sparkles size={16} />,
      content:
        "Bussinest algorithms evaluate ISO certifications, GST validation, capacity, and historical fulfillment velocity to route requirement leads directly to pre-audited manufacturers.",
    },
    {
      id: "discounts",
      title: "50% Renewal Vouchers & Partner Incentives",
      badge: "Wholesale Perk",
      icon: <Star size={16} />,
      content:
        "Active buyers and vendors unlock 50% commission vouchers on recurring quarterly cycles plus up to ₹15,000 for qualifying trade referrals.",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-6 sm:px-10 lg:px-16 xl:px-20 max-w-[1440px] mx-auto space-y-12">
      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full sparkle-badge text-amber-900 dark:text-amber-200 text-xs font-black uppercase tracking-wider shadow-sm">
          <Sparkles size={14} className="text-amber-500 fill-amber-400 animate-sparkle-pulse" />
          <span>OriginKit Reference Component Library</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
          Next-Gen <span className="gold-gradient-text">OriginKit Animated UI</span> Suite
        </h1>

        <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 font-medium">
          Inspired by OriginUI / OriginKit — Copy-paste animated micro-interactions, spring-animated segmented tabs, glowing border-beam cards, and interactive sparkle inputs.
        </p>
      </div>

      {/* 1. Animated Search Inputs & Status Badges */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Search className="text-sky-600" />
          <span>1. Animated Inputs & Status Badges</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-200/80 dark:border-sky-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-slate-700 dark:text-sky-200 uppercase tracking-wider">
              Interactive Search Input with Shortcut & Clear
            </h3>
            <OriginAnimatedInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Search 10,000+ verified Indian manufacturers..."
            />
            {searchValue && (
              <p className="text-xs font-semibold text-sky-700 dark:text-sky-300">
                Searching for: <span className="font-bold">"{searchValue}"</span>
              </p>
            )}
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-200/80 dark:border-sky-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-slate-700 dark:text-sky-200 uppercase tracking-wider">
              Live Animated Status Chips
            </h3>
            <div className="flex flex-wrap gap-3 items-center">
              <OriginStatusBadge status="verified" />
              <OriginStatusBadge status="live" />
              <OriginStatusBadge status="premium" />
              <OriginStatusBadge status="warning" />
              <OriginStatusBadge status="active" />
            </div>
          </div>
        </div>
      </section>

      {/* 2. Fluid Spring Segmented Tabs */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Layers className="text-sky-600" />
          <span>2. Fluid Spring Segmented Controls</span>
        </h2>

        <div className="p-8 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-200/80 dark:border-sky-800 shadow-md space-y-6">
          <div className="flex justify-center">
            <OriginSegmentedTabs
              tabs={sampleTabs}
              activeTab={activeSegmentTab}
              onChange={setActiveSegmentTab}
              size="lg"
            />
          </div>

          <div className="p-6 rounded-2xl bg-sky-50/70 dark:bg-sky-950/60 border border-sky-200/60 text-center">
            <p className="text-sm font-bold text-sky-900 dark:text-sky-200">
              Active Segment View: <span className="text-sky-600 dark:text-sky-400 uppercase">{activeSegmentTab}</span>
            </p>
          </div>
        </div>
      </section>

      {/* 3. Glowing Radial Glass Cards */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Sparkles className="text-amber-500" />
          <span>3. Border Beam Glowing Cards</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <OriginGlowingCard glowColor="sky" badgeText="Verified">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-sky-100 dark:bg-sky-950 text-sky-600 dark:text-sky-300 flex items-center justify-center font-bold">
                <Factory size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Precision CNC Machining</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                High-volume aluminum & steel component forging with ISO 9001 quality compliance.
              </p>
            </div>
          </OriginGlowingCard>

          <OriginGlowingCard glowColor="amber" badgeText="Featured">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-300 flex items-center justify-center font-bold">
                <Flame size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Industrial Polymer Resins</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                HDPE & polypropylene granules supplied directly from certified refinery hubs.
              </p>
            </div>
          </OriginGlowingCard>

          <OriginGlowingCard glowColor="emerald" badgeText="Live Match">
            <div className="space-y-3">
              <div className="p-3 w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-300 flex items-center justify-center font-bold">
                <Cpu size={24} />
              </div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Semiconductor Assembly</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 font-medium leading-relaxed">
                Automated SMT PCB surface mounting with automated optical inspection.
              </p>
            </div>
          </OriginGlowingCard>
        </div>
      </section>

      {/* 4. Micro-interactive Sparkle Buttons & Spring Accordion */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
          <Zap className="text-amber-500" />
          <span>4. Sparkle Buttons & Spring Accordions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-200/80 dark:border-sky-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-slate-700 dark:text-sky-200 uppercase tracking-wider">
              Ripple Sparkle Action Buttons
            </h3>
            <div className="flex flex-wrap gap-3">
              <OriginSparkleButton variant="primary">Primary Sparkle</OriginSparkleButton>
              <OriginSparkleButton variant="gold">Gold Premium</OriginSparkleButton>
              <OriginSparkleButton variant="secondary">Glass Secondary</OriginSparkleButton>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-sky-200/80 dark:border-sky-800 shadow-md space-y-4">
            <h3 className="font-extrabold text-sm text-slate-700 dark:text-sky-200 uppercase tracking-wider">
              Smooth Spring Accordions
            </h3>
            <OriginAccordion items={accordionItems} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default OriginKitShowcase;
