import React, { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Zap, Star, ShieldCheck, Crown, Sparkles, Gift, ArrowRight, TrendingUp, Percent, Award, Users, FileText, Layers, Tag } from "lucide-react";
import CheckoutModal from "../components/CheckoutModal";
import NeumorphicToggle from "../components/ui/NeumorphicToggle";
import PurpleCyberButton from "../components/ui/PurpleCyberButton";

export default function PricingPage({ globalPlans = [] }: { globalPlans?: any[] }) {
  const [checkoutConfig, setCheckoutConfig] = useState<{ isOpen: boolean; title: string; amount: number; type: string } | null>(null);
  const [calcDealValue, setCalcDealValue] = useState<number>(1200000);
  const [claimedVoucher, setClaimedVoucher] = useState(false);
  const [isAnnual, setIsAnnual] = useState(true);

  const getTierRate = (val: number) => {
    if (val < 500000) return 3;
    if (val <= 2500000) return 2;
    return 1;
  };

  const currentRate = getTierRate(calcDealValue);
  const feeAmount = (calcDealValue * currentRate) / 100;
  const upfrontEscrow = calcDealValue * 0.5;
  const finalEscrow = calcDealValue * 0.5 - feeAmount;

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("premium")) return <ShieldCheck size={24} className="text-sky-600" />;
    if (name.toLowerCase().includes("enterprise")) return <Crown size={24} className="text-amber-500" />;
    if (name.toLowerCase().includes("basic")) return <Zap size={24} className="text-emerald-500" />;
    return <Star size={24} className="text-sky-500" />;
  };

  const getColor = (name: string) => {
    if (name.toLowerCase().includes("premium")) return "sky";
    if (name.toLowerCase().includes("enterprise")) return "amber";
    if (name.toLowerCase().includes("basic")) return "emerald";
    return "sky";
  };

  const defaultSubscriptionTiers = [
    {
      name: "Starter Wholesale",
      price: 999,
      leads: "15 Verified B2B Leads / mo",
      features: ["Access all RFQs in 1 category", "CRISIL Verified Supplier Badge", "Direct buyer messaging", "Standard Escrow Protection"],
      buttonText: "Get Started",
      icon: <Zap size={24} className="text-emerald-600" />,
      color: "emerald",
      popular: false
    },
    {
      name: "Growth Partner",
      price: 2999,
      leads: "60 Verified B2B Leads / mo",
      features: ["Unlimited category unlocks", "AAA Trust Rating Priority Placement", "Direct CEO Concierge hotline", "1.5% Escrow commission rate rebate", "Automated renewal alerts"],
      buttonText: "Upgrade to Growth",
      icon: <ShieldCheck size={24} className="text-sky-600" />,
      color: "sky",
      popular: true
    },
    {
      name: "Enterprise Wholesale",
      price: 7999,
      leads: "200 Verified B2B Leads / mo",
      features: ["Top 500 Vendor Preferred listing", "Dedicated Account Executive", "1% Flat platform fee on all GMV", "50% Renewal voucher eligible", "Instant WhatsApp RFQ routing"],
      buttonText: "Scale Enterprise",
      icon: <Crown size={24} className="text-amber-500" />,
      color: "amber",
      popular: false
    }
  ];

  const dynamicTiers = globalPlans.length > 0 ? globalPlans.map((plan: any) => ({
    name: plan.name,
    price: plan.price,
    leads: `${plan.credits} Leads ${plan.features ? `+ ${plan.features}` : ''}`,
    features: ["View buyer requirements", "Submit quotes", "Real-time chat", plan.features].filter(Boolean),
    buttonText: "Subscribe",
    icon: getIcon(plan.name),
    color: getColor(plan.name),
    popular: plan.price > 2000 && plan.price < 5000
  })) : defaultSubscriptionTiers;

  const subscriptionTiers = dynamicTiers;

  const creditPacks = [
    { name: "Starter Pack", credits: 10, price: 499, description: "Perfect for testing high-intent wholesale RFPs." },
    { name: "Growth Pack", credits: 50, price: 1999, description: "Best value. Just ₹40 per verified wholesale buyer lead." },
    { name: "Scale Pack", credits: 200, price: 6999, description: "Bulk volume. Just ₹35 per lead with VIP routing." }
  ];

  const handlePurchase = (title: string, amount: number, type: string) => {
    const userId = localStorage.getItem("vendorMatchUserId") || "guest";
    if (userId === "guest") {
      alert("Please log in as a Vendor to purchase.");
      return;
    }
    setCheckoutConfig({ isOpen: true, title, amount, type });
  };

  return (
    <div className="flex-1 w-full bg-gradient-to-b from-sky-50/70 via-white to-sky-50/50 flex flex-col py-8 sm:py-12">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1400px] mx-auto w-full">
        
        {/* Hero Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-100/80 border border-sky-200/80 text-sky-800 text-xs font-black tracking-wide uppercase mb-4 shadow-xs">
            <Sparkles size={14} className="text-sky-600 animate-pulse" />
            Transparent B2B Wholesale Pricing & Escrow
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight font-heading">
            Simple, Transparent & <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-blue-600">Value-Driven</span>
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed font-medium mb-8">
            Unlock high-intent B2B wholesale buyers, protect your revenue with 50/50 split escrow, and scale your manufacturing with tiered platform fees starting at just 1%.
          </p>

          {/* 3D Neumorphic Billing Cycle Toggle */}
          <div className="flex flex-col items-center justify-center gap-3">
            <NeumorphicToggle
              checked={isAnnual}
              onChange={setIsAnnual}
              labelLeft="Monthly Billing"
              labelRight="Annual Billing (Save 20%)"
              size="md"
            />
          </div>
        </motion.div>

        {/* 50% Renewal Pass Minimal Card */}
        <motion.div 
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 relative overflow-hidden rounded-3xl bg-white p-6 sm:p-10 text-center shadow-xl shadow-slate-900/5 border border-slate-200/80 flex flex-col items-center justify-center max-w-3xl mx-auto"
        >
          {/* Top Badge */}
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-sky-50 text-sky-700 text-xs font-bold border border-sky-200/80 mb-4">
            <Tag size={13} className="text-sky-600" /> 50% Renewal Voucher
          </span>

          {/* Main Title */}
          <h3 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight font-heading mb-2">
            Renewal Pass
          </h3>

          {/* Body Text */}
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto leading-relaxed mb-6 font-medium">
            Save flat 50% on all quarterly & annual subscription renewals with code <strong className="text-sky-700 bg-sky-50 px-2 py-0.5 rounded font-mono border border-sky-200/60">CEO50RENEW</strong>.
          </p>

          {/* Claim Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText("CEO50RENEW");
              setClaimedVoucher(true);
              setTimeout(() => setClaimedVoucher(false), 3000);
            }}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-sky-400 to-sky-600 hover:from-sky-500 hover:to-sky-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition-all active:scale-95 cursor-pointer mb-6"
          >
            {claimedVoucher ? "Voucher Copied! (CEO50RENEW)" : "Claim 50% Discount"}
          </button>

          {/* Specs Bar */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-100 text-xs text-slate-500 font-medium w-full">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-600" /> 100% Escrow Protection
            </span>
            <span className="text-slate-300">•</span>
            <span className="flex items-center gap-1.5">
              <Sparkles size={14} className="text-amber-500" /> Instant Renewal Lock
            </span>
          </div>
        </motion.div>

        {/* Subscriptions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
          {subscriptionTiers.map((tier, idx) => (
            <motion.div 
              key={tier.name} 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.15 + idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -8 }}
              className={`bg-white/90 backdrop-blur-xl rounded-3xl p-8 border card-lift-hover ${
                tier.popular 
                  ? 'border-sky-400 shadow-2xl shadow-sky-500/15 relative md:-translate-y-2 z-10 gold-border-glow' 
                  : 'border-sky-100 shadow-lg shadow-slate-100'
              } flex flex-col`}
            >
              {tier.popular && (
                <>
                  <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-sky-600 to-blue-600 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-md shadow-sky-500/25">
                    Most Popular Choice
                  </div>
                </>
              )}
              
              <div className="flex items-center gap-3 mb-4 mt-2">
                <div className="p-3 rounded-2xl bg-sky-50 border border-sky-100">
                  {tier.icon}
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-xl font-heading">{tier.name}</h3>
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl md:text-5xl font-black text-slate-900">₹{tier.price.toLocaleString()}</span>
                <span className="text-slate-500 font-semibold text-sm"> /month</span>
              </div>
              
              <div className="bg-sky-50/70 rounded-2xl p-3.5 mb-6 text-center border border-sky-100/80">
                <span className="font-extrabold text-sky-900 text-sm">{tier.leads}</span>
              </div>
              
              <ul className="space-y-3.5 mb-8 flex-1">
                {tier.features.map((feature: string, i: number) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-700 font-medium">
                    <CheckCircle2 size={18} className="text-sky-600 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handlePurchase(`${tier.name} Plan Subscription`, tier.price, "subscription_upgrade")}
                disabled={tier.price === 0}
                className={`w-full py-4 rounded-xl font-black transition-all cursor-pointer button-luxury-glow ${
                  tier.price === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                  tier.popular ? 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white shadow-lg shadow-sky-500/25' :
                  'bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200'
                }`}
              >
                {tier.buttonText}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Interactive 1-3% Tiered Platform Fee & 50/50 Split Escrow Breakdown */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/95 backdrop-blur-xl border border-sky-200/90 rounded-[2.5rem] p-8 md:p-12 shadow-xl shadow-sky-500/5 mb-24 relative overflow-hidden card-lift-hover"
        >
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-extrabold uppercase mb-2 shadow-xs">
                <Percent size={14} /> Tiered wholesale economics
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-heading">1% – 3% Tiered Platform Fee Calculator</h2>
              <p className="text-slate-600 text-sm mt-2 max-w-xl mx-auto font-medium">
                No hidden charges. Platform fees drop automatically as your order volume expands, secured by our dual-milestone 50/50 split escrow protection.
              </p>
            </div>

            {/* Slider */}
            <div className="bg-sky-50/80 rounded-3xl p-6 md:p-8 border border-sky-100 mb-8 shadow-inner">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700">Simulate Order Value (GMV)</label>
                <span className="text-2xl md:text-3xl font-black text-sky-900 font-mono">₹{calcDealValue.toLocaleString()}</span>
              </div>
              
              <input
                type="range"
                min="50000"
                max="5000000"
                step="25000"
                value={calcDealValue}
                onChange={(e) => setCalcDealValue(Number(e.target.value))}
                className="w-full h-3 bg-sky-200 rounded-lg appearance-none cursor-pointer accent-sky-600 transition-all hover:bg-sky-300"
              />
              
              <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2 font-mono">
                <span>₹50,000 (3% Tier)</span>
                <span>₹5,00,000 (2% Tier)</span>
                <span>₹25,00,000+ (1% Tier)</span>
              </div>
            </div>

            {/* Escrow 50/50 Breakdown Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <motion.div whileHover={{ scale: 1.03 }} className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Effective Platform Fee</span>
                <span className="text-3xl font-black text-sky-600 font-mono">{currentRate}%</span>
                <span className="text-xs text-slate-600 font-medium block mt-1">₹{feeAmount.toLocaleString()} total</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Upfront Milestone (50%)</span>
                <span className="text-3xl font-black text-emerald-600 font-mono">₹{upfrontEscrow.toLocaleString()}</span>
                <span className="text-xs text-slate-600 font-medium block mt-1">Disbursed on PO acceptance</span>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} className="p-5 rounded-2xl bg-white border border-sky-100 shadow-sm transition-shadow hover:shadow-md">
                <span className="text-xs font-bold text-slate-500 uppercase block mb-1">Final Payout (50% - Fee)</span>
                <span className="text-3xl font-black text-blue-600 font-mono">₹{finalEscrow.toLocaleString()}</span>
                <span className="text-xs text-slate-600 font-medium block mt-1">On buyer delivery confirmation</span>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Pay-as-you-go Packs */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-[3rem] p-8 md:p-14 bg-gradient-to-br from-sky-600 via-blue-600 to-indigo-700 text-white relative overflow-hidden shadow-2xl shadow-sky-500/20 border border-sky-300/30 mb-24 glass-specular"
        >
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur text-xs font-extrabold uppercase tracking-wider mb-3">
                No Fixed Commitments
              </span>
              <h2 className="text-3xl md:text-4xl font-black mb-3 font-heading">Pay-As-You-Go Wholesale Lead Packs</h2>
              <p className="text-sky-100 text-base max-w-xl mx-auto font-medium">
                Not ready for a monthly subscription? Purchase on-demand verified leads to pitch exclusive buyer RFPs directly.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditPacks.map((pack, i) => (
                <motion.div 
                  key={pack.name} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  whileHover={{ y: -6, scale: 1.01 }}
                  className="bg-white/15 backdrop-blur-md border border-white/25 rounded-3xl p-8 hover:bg-white/20 transition-all flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <h3 className="font-black text-amber-300 text-lg mb-2 font-heading">{pack.name}</h3>
                    <div className="text-3xl font-black mb-2 font-mono">{pack.credits} <span className="text-base text-sky-200 font-medium">Leads</span></div>
                    <p className="text-sky-100 text-xs mb-6 leading-relaxed">{pack.description}</p>
                  </div>
                  <button 
                    onClick={() => handlePurchase(`${pack.credits} Lead Credits`, pack.price, "lead_purchase")}
                    className="w-full bg-white hover:bg-sky-50 text-slate-900 font-black py-3.5 rounded-xl transition-all shadow-md cursor-pointer button-luxury-glow"
                  >
                    Buy for ₹{pack.price.toLocaleString()}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Referral Bonus Program Callout */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ duration: 0.5 }}
          className="bg-white/90 backdrop-blur-xl border border-sky-200 rounded-3xl p-8 md:p-12 shadow-lg mb-12 flex flex-col md:flex-row items-center justify-between gap-8 card-lift-hover"
        >
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0 shadow-sm">
              <Users size={32} className="text-amber-600" />
            </div>
            <div>
              <span className="text-xs font-black uppercase text-amber-700 tracking-wider">Wholesale Growth Affiliate</span>
              <h3 className="text-2xl font-black text-slate-900 font-heading">Earn ₹15,000 / $500 per Verified Supplier Referral</h3>
              <p className="text-slate-600 text-sm mt-1 max-w-xl font-medium">
                Invite manufacturers and wholesale distributors to join Bussinest. Earn instant cash credits and commission sharing on every closed escrow deal.
              </p>
            </div>
          </div>
          <button 
            onClick={() => alert("Your referral link: https://bussinest.com/ref/" + (localStorage.getItem("vendorMatchUserId") || "partner100"))}
            className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md transition-all shrink-0 cursor-pointer button-luxury-glow"
          >
            Get Referral Link
          </button>
        </motion.div>

      </main>

      {checkoutConfig && (
        <CheckoutModal
          isOpen={checkoutConfig.isOpen}
          onClose={() => setCheckoutConfig(null)}
          title={checkoutConfig.title}
          amount={checkoutConfig.amount}
          transactionType={checkoutConfig.type}
          userId={localStorage.getItem("vendorMatchUserId") || ""}
          role="vendor"
          onSuccess={() => {
            alert("Payment Successful!");
          }}
        />
      )}
    </div>
  );
}
