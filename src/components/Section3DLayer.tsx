/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * High-Performance Architectural Scroll Engine for Bussinest
 * Inspired by ScrollCraft Studio — 48 Architectural Scroll Paradigms
 * Daylight Luxury Aesthetic: Pearl White, Ocean Sky Cyan, Warm Amber Gold
 */

import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronUp, ChevronDown, Layers, X, Sparkles, Compass } from "lucide-react";

export interface SectionMeta {
  id: string;
  tag: string;
  title: string;
  category: string;
}

export const SECTIONS_CATALOG: SectionMeta[] = [
  { id: "hero", tag: "01", title: "Search & Hero Console", category: "Spatial 3D & Depth" },
  { id: "spotlight", tag: "02", title: "Featured Wholesale Sectors", category: "Kinematic Ribbon" },
  { id: "categories", tag: "03", title: "Top Wholesale Categories", category: "Grid Matrix" },
  { id: "calculator", tag: "04", title: "1–3% Tiered Fee & Escrow", category: "Physics & Calculation" },
  { id: "voucher", tag: "05", title: "50% Executive Renewal Pass", category: "Sticky Deck Compaction" },
  { id: "nearby", tag: "06", title: "Live GPS Sourcing Radar", category: "LiDAR & Spatial Map" },
  { id: "vendors", tag: "07", title: "Preferred Wholesale Vendors", category: "Multi-Tier Parallax" },
  { id: "referral", tag: "08", title: "Partner Incentive Program", category: "Geometric Mask & Split" },
  { id: "testimonials", tag: "09", title: "Enterprise Testimonials", category: "Scrollytelling Stream" },
  { id: "about", tag: "10", title: "One-Stop Sourcing Hub", category: "Structural Reveal" },
  { id: "compliance", tag: "11", title: "Enterprise Trust & Compliance", category: "Cryptographic Security" },
];

/* ========================================================================= */
/* 1. SECTION 3D LAYER CONTAINER WITH BLUEPRINT & TELEMETRY */
/* ========================================================================= */
interface Section3DLayerProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  depthIntensity?: "subtle" | "medium" | "dramatic";
  enableParallaxOrbs?: boolean;
  orbTheme?: "cyan" | "gold" | "blue" | "emerald" | "purple";
  layerTag?: string;
  layerTitle?: string;
  showBlueprintGrid?: boolean;
}

export const Section3DLayer: React.FC<Section3DLayerProps> = ({
  id,
  children,
  className = "",
  enableParallaxOrbs = true,
  orbTheme = "cyan",
  layerTag,
  layerTitle,
  showBlueprintGrid = false
}) => {
  const getOrbGradient = () => {
    switch (orbTheme) {
      case "gold":
        return "radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, rgba(245, 158, 11, 0.02) 50%, transparent 70%)";
      case "emerald":
        return "radial-gradient(circle, rgba(52, 211, 153, 0.08) 0%, rgba(16, 185, 129, 0.02) 50%, transparent 70%)";
      case "purple":
        return "radial-gradient(circle, rgba(168, 85, 247, 0.08) 0%, rgba(147, 51, 234, 0.02) 50%, transparent 70%)";
      case "blue":
        return "radial-gradient(circle, rgba(59, 130, 246, 0.09) 0%, rgba(37, 99, 235, 0.02) 50%, transparent 70%)";
      default:
        return "radial-gradient(circle, rgba(56, 189, 248, 0.09) 0%, rgba(2, 132, 199, 0.02) 50%, transparent 70%)";
    }
  };

  return (
    <section
      id={id}
      data-section-tag={layerTag}
      data-section-title={layerTitle}
      className={`relative w-full scroll-mt-24 ${showBlueprintGrid ? 'blueprint-grid' : ''} ${className}`}
    >
      {/* Lightweight Ambient Background Layer */}
      {enableParallaxOrbs && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10" style={{ transform: "translateZ(0)" }}>
          <div
            style={{ background: getOrbGradient() }}
            className="absolute -top-24 -left-24 w-96 h-96 rounded-full opacity-60 pointer-events-none"
          />
          <div
            style={{ background: getOrbGradient() }}
            className="absolute -bottom-24 -right-24 w-[400px] h-[400px] rounded-full opacity-50 pointer-events-none"
          />
        </div>
      )}

      {/* Main Section Content Container */}
      <div className="w-full relative">
        {children}
      </div>
    </section>
  );
};

/* ========================================================================= */
/* 2. ARCHITECTURAL LAYER 3D TRANSITION WITH DUAL-AXIS SHEEN */
/* ========================================================================= */
interface Layer3DTransitionProps {
  currentTag?: string;
  nextTag?: string;
  nextTitle?: string;
  showBadge?: boolean;
}

export const Layer3DTransition: React.FC<Layer3DTransitionProps> = ({
  currentTag,
  nextTag,
  nextTitle,
  showBadge = true
}) => {
  return (
    <div className="relative w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-4 sm:py-6 overflow-hidden pointer-events-none select-none">
      <div className="relative flex items-center justify-center">
        {/* Layer Hairline Divider with Golden Sweep */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-sky-300/50 to-transparent" />
        <div className="absolute inset-x-12 h-[1.5px] bg-gradient-to-r from-transparent via-amber-400/70 to-transparent gold-line-subtle" />

        {/* Floating 3D Depth Badge */}
        {showBadge && nextTag && nextTitle && (
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-sky-200/90 shadow-sm text-[11px] font-bold text-slate-700 tracking-wide">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-ping" />
              {currentTag && (
                <>
                  <span className="text-[10px] font-mono text-slate-400">{currentTag}</span>
                  <span className="text-slate-300">→</span>
                </>
              )}
              <span className="text-[10px] font-mono text-sky-700 uppercase font-black">{nextTag}</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-semibold">{nextTitle}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* ========================================================================= */
/* 3. INTERACTIVE CARD 3D TILT WITH SPRING RELAXATION (SCROLLCRAFT PARADIGM 16) */
/* ========================================================================= */
interface Card3DTiltProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export const Card3DTilt: React.FC<Card3DTiltProps> = ({
  children,
  className = "",
  maxTilt = 8
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [transformStyle, setTransformStyle] = useState("");

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -maxTilt;
    const rotateY = ((x - centerX) / centerX) * maxTilt;

    setTransformStyle(`perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-4px)`);
  };

  const handleMouseLeave = () => {
    setTransformStyle("perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)");
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: transformStyle,
        transition: transformStyle ? "transform 0.1s ease-out" : "transform 0.4s ease-out"
      }}
      className={`preserve-3d ${className}`}
    >
      {children}
    </div>
  );
};

/* ========================================================================= */
/* 4. READING HIGHLIGHT PEN DRAW-IN (SCROLLCRAFT PARADIGM 29) */
/* ========================================================================= */
interface ScrollHighlightTextProps {
  children: React.ReactNode;
  className?: string;
}

export const ScrollHighlightText: React.FC<ScrollHighlightTextProps> = ({
  children,
  className = ""
}) => {
  return (
    <span className={`reading-highlight-brush ${className}`}>
      {children}
    </span>
  );
};

/* ========================================================================= */
/* 5. SCROLLCRAFT MASTER HUD & ARCHITECTURAL HIGHWAY CONTROLLER */
/* ========================================================================= */
export const ScrollCraftHUD: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SectionMeta>(SECTIONS_CATALOG[0]);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isIndexTrayOpen, setIsIndexTrayOpen] = useState(false);

  // Jump to specific section by id
  const jumpToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setIsIndexTrayOpen(false);
    }
  }, []);

  // Step to Next or Previous Section
  const stepSection = useCallback((direction: -1 | 1) => {
    const currentIndex = SECTIONS_CATALOG.findIndex(s => s.id === activeSection.id);
    const nextIndex = Math.max(0, Math.min(SECTIONS_CATALOG.length - 1, currentIndex + direction));
    jumpToSection(SECTIONS_CATALOG[nextIndex].id);
  }, [activeSection, jumpToSection]);

  // Track page scroll progress and active section
  useEffect(() => {
    const handleScroll = () => {
      const winHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight - winHeight;
      const currentScroll = window.scrollY;

      if (docHeight > 0) {
        const progress = Math.min(100, Math.max(0, (currentScroll / docHeight) * 100));
        setScrollProgress(progress);
      }

      // Determine active section by viewport middle
      const viewportCenter = currentScroll + winHeight * 0.4;
      let currentMatch = SECTIONS_CATALOG[0];

      for (const meta of SECTIONS_CATALOG) {
        const el = document.getElementById(meta.id);
        if (el) {
          const top = el.offsetTop;
          if (top <= viewportCenter) {
            currentMatch = meta;
          }
        }
      }

      setActiveSection(currentMatch);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return null;
};
