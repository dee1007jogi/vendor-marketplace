import React from "react";
import { motion } from "motion/react";
import { 
  Sparkles, Zap, ShieldCheck, ArrowRight, Layers, 
  Compass, MousePointer, Activity, Cpu, Wand2
} from "lucide-react";
import MagneticButton from "../components/animations/MagneticButton";
import SpotlightCard from "../components/animations/SpotlightCard";
import ShinyText from "../components/animations/ShinyText";
import TiltCard from "../components/animations/TiltCard";
import InteractiveWallet from "../components/payment/InteractiveWallet";
import NeumorphicToggle from "../components/ui/NeumorphicToggle";
import PurpleCyberButton from "../components/ui/PurpleCyberButton";
import NeumorphicCard from "../components/ui/NeumorphicCard";

export default function AnimationsShowcase() {
  const [toggleState, setToggleState] = React.useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50/70 text-slate-900 pb-24 font-sans">
      
      {/* Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white py-16 px-6 sm:px-12 text-center shadow-xl">
        <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-amber-300 text-xs font-black uppercase tracking-widest">
            <Sparkles size={14} className="animate-pulse" /> Neumorphism • Cyber 3D Skew • 3D Wallet (Uiverse)
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight">
            Uiverse 3D Design & Motion Suite
          </h1>
          <p className="text-sky-100 text-sm sm:text-base font-medium max-w-2xl mx-auto leading-relaxed">
            Interactive neumorphic 3D inset toggles, soft-shadow elevated cards, animated purple cyber 3D buttons, and 3D wallet card physics.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">

        {/* New Section: Uiverse 3D Theme Controls & Components */}
        <div className="neo-card p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xl space-y-8">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-purple-600">Uiverse.io Theme Engine</span>
              <h2 className="text-2xl font-black text-slate-900 mt-1">Neumorphic & Cyber 3D Components</h2>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-700 font-extrabold text-xs">3 New Components</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
            {/* Component 1: Neumorphic Inset Toggle Switch (csemszepp) */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-100 rounded-3xl space-y-4 border border-slate-200/60 shadow-inner">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">3D Inset Toggle (csemszepp)</span>
              <NeumorphicToggle
                checked={toggleState}
                onChange={setToggleState}
                labelLeft="Monthly"
                labelRight="Annual (-20%)"
              />
              <span className="text-xs font-mono font-bold text-slate-600">State: {toggleState ? "Annual Active" : "Monthly Active"}</span>
            </div>

            {/* Component 2: Cyber Purple 3D Angled Button (marcelodolza) */}
            <div className="flex flex-col items-center justify-center p-6 bg-slate-900 rounded-3xl space-y-4 border border-slate-800 shadow-xl min-h-[160px]">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">Cyber 3D Button (marcelodolza)</span>
              <PurpleCyberButton
                textState1="Join Today"
                textState2="Join Now"
                onClick={() => alert("Cyber 3D Button Clicked!")}
              />
            </div>

            {/* Component 3: Soft Neumorphic Card (Codewithvinay) */}
            <NeumorphicCard className="p-6 flex flex-col justify-between min-h-[160px] cursor-pointer">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-slate-500">Soft 3D Card (Codewithvinay)</span>
                <h3 className="text-lg font-black text-slate-800 mt-1">Neumorphic Inset & Soft Elevation</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium">Soft 15px shadow displacement with smooth hover elevation.</p>
            </NeumorphicCard>
          </div>
        </div>
        
        {/* Section 0: Uiverse 3D Payment Wallet */}
        <div className="neo-card p-8 rounded-3xl bg-slate-950 text-white border border-slate-800 shadow-2xl relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[2px]"></div>
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                <Sparkles size={14} /> Interactive 3D Payment Cards (Uiverse.io)
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-white">
                3D Leather Wallet & Payment Cards
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                Hover over the wallet to slide out Stripe, Wise, and PayPal cards. Hover on individual cards to reveal full details and elevate z-index. Hover or click the eye icon to reveal the balance!
              </p>
              <div className="flex flex-wrap gap-2 text-xs font-mono text-emerald-400">
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">• CSS 3D Perspective</span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">• Card Shift & Rotation</span>
                <span className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">• Privacy Eye Toggle</span>
              </div>
            </div>

            <div className="shrink-0">
              <InteractiveWallet balance="$12,450.00" balanceLabel="Total Balance" />
            </div>
          </div>
        </div>
        
        {/* Section 1: GSAP Elastic Magnetic Physics Buttons */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MousePointer className="text-sky-600" size={20} />
            <h2 className="text-xl font-black text-slate-900">GSAP Magnetic Physics (React Bits)</h2>
          </div>
          <p className="text-slate-600 text-sm font-medium">
            Hover and move your cursor near the buttons below to feel GSAP elastic magnetic attraction physics.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <MagneticButton className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-sky-500/25 flex items-center gap-2 text-sm cursor-pointer">
              <Zap size={16} className="fill-white" /> GSAP Magnetic CTA
            </MagneticButton>

            <MagneticButton strength={0.5} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-500/25 flex items-center gap-2 text-sm cursor-pointer">
              <Sparkles size={16} /> High Magnetism (0.5x)
            </MagneticButton>

            <MagneticButton className="neo-btn bg-white text-slate-800 border border-slate-200 font-bold px-6 py-3.5 rounded-2xl shadow-sm text-sm cursor-pointer">
              Subtle Pull Button
            </MagneticButton>
          </div>
        </div>

        {/* Section 2: Spotlight Cursor Glow Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Wand2 className="text-sky-600" size={20} />
            <h2 className="text-xl font-black text-slate-900">Spotlight Radial Cursor Glow</h2>
          </div>
          <p className="text-slate-600 text-sm font-medium">
            Move your cursor inside the cards to trigger real-time radial spotlight tracking.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <SpotlightCard className="p-6">
              <div className="w-10 h-10 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold mb-3">
                <Cpu size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Sky Spotlight Card</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Smooth radial lighting calculations following cursor coordinates.
              </p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(245, 158, 11, 0.2)" className="p-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold mb-3">
                <Sparkles size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Amber Glow Spotlight</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Customizable color gradient opacity with zero layout shift.
              </p>
            </SpotlightCard>

            <SpotlightCard spotlightColor="rgba(16, 185, 129, 0.2)" className="p-6">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold mb-3">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Emerald Escrow Spotlight</h3>
              <p className="text-slate-500 text-xs font-medium leading-relaxed">
                Hardware-accelerated CSS radial mask tracking.
              </p>
            </SpotlightCard>
          </div>
        </div>

        {/* Section 3: 3D Mouse Perspective Tilt Cards */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Layers className="text-sky-600" size={20} />
            <h2 className="text-xl font-black text-slate-900">3D Gyroscope Perspective Tilt</h2>
          </div>
          <p className="text-slate-600 text-sm font-medium">
            Hover over the card to experience interactive 3D perspective rotation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TiltCard className="neo-card p-8 rounded-3xl bg-gradient-to-br from-white via-sky-50/50 to-white border border-sky-100 shadow-xl">
              <span className="text-xs font-black uppercase tracking-wider text-sky-600">3D Perspective Token</span>
              <h3 className="text-2xl font-black text-slate-900 mt-2 mb-3">Interactive 3D Perspective Card</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-medium">
                Uses Framer Motion spring physics to calculate mouse displacement off component center.
              </p>
              <div className="mt-6 flex items-center gap-2 text-sky-700 font-bold text-xs">
                <span>Hover anywhere on card</span> <ArrowRight size={14} />
              </div>
            </TiltCard>

            <TiltCard maxRotate={25} className="neo-card p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-sky-950 to-blue-950 text-white border border-sky-500/30 shadow-2xl">
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Extreme Tilt (25deg)</span>
              <h3 className="text-2xl font-black text-white mt-2 mb-3">Dark Mode 3D Vault</h3>
              <p className="text-slate-300 text-sm leading-relaxed font-medium">
                Deep parallax perspective depth effect with smooth spring physics reset on mouse leave.
              </p>
              <div className="mt-6 flex items-center gap-2 text-amber-400 font-bold text-xs">
                <span>Move cursor over card</span> <ArrowRight size={14} />
              </div>
            </TiltCard>
          </div>
        </div>

        {/* Section 4: Metallic Text Shimmer Effect */}
        <div className="neo-card p-8 rounded-3xl bg-white border border-slate-200/80 space-y-3">
          <span className="text-xs font-black uppercase tracking-wider text-amber-600">Shimmer Typography</span>
          <h2 className="text-2xl sm:text-3xl font-black">
            <ShinyText text="Metallic Shimmer Animation with Gradient Sweep" />
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            Smooth continuous background gradient animation sweep effect across typography.
          </p>
        </div>

      </div>

    </div>
  );
}
