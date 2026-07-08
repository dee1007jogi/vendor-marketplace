import React, { useState } from "react";
import { CheckCircle2, Zap, Star, ShieldCheck, Crown } from "lucide-react";
import CheckoutModal from "../components/CheckoutModal";

export default function PricingPage({ globalPlans = [] }: { globalPlans?: any[] }) {
  const [checkoutConfig, setCheckoutConfig] = useState<{ isOpen: boolean; title: string; amount: number; type: string } | null>(null);

  const getIcon = (name: string) => {
    if (name.toLowerCase().includes("premium")) return <ShieldCheck size={24} className="text-indigo-500" />;
    if (name.toLowerCase().includes("enterprise")) return <Crown size={24} className="text-amber-500" />;
    if (name.toLowerCase().includes("basic")) return <Zap size={24} className="text-emerald-500" />;
    return <Star size={24} className="text-slate-400" />;
  };

  const getColor = (name: string) => {
    if (name.toLowerCase().includes("premium")) return "indigo";
    if (name.toLowerCase().includes("enterprise")) return "amber";
    if (name.toLowerCase().includes("basic")) return "emerald";
    return "slate";
  };

  const dynamicTiers = globalPlans.length > 0 ? globalPlans.map((plan: any) => ({
    name: plan.name,
    price: plan.price,
    leads: `${plan.credits} Leads ${plan.features ? `+ ${plan.features}` : ''}`,
    features: ["View buyer requirements", "Submit quotes", "Real-time chat", plan.features].filter(Boolean),
    buttonText: "Subscribe",
    icon: getIcon(plan.name),
    color: getColor(plan.name),
    popular: plan.price > 2000 && plan.price < 5000
  })) : [];

  const subscriptionTiers = dynamicTiers;

  const creditPacks = [
    { name: "Starter Pack", credits: 10, price: 499, description: "Perfect for testing the waters." },
    { name: "Growth Pack", credits: 50, price: 1999, description: "Best value. Just ₹40 per lead." },
    { name: "Scale Pack", credits: 200, price: 6999, description: "High volume. Just ₹35 per lead." }
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
    <div className="flex-1 w-full bg-slate-50 flex flex-col py-12">
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">Simple, Transparent Pricing</h1>
          <p className="text-lg text-slate-500">
            Choose the plan that fits your growth strategy. Unlock high-intent B2B leads and scale your agency.
          </p>
        </div>

        {/* Subscriptions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-24">
          {subscriptionTiers.map((tier) => (
            <div key={tier.name} className={`bg-white rounded-3xl p-8 border ${tier.popular ? 'border-indigo-500 shadow-xl shadow-indigo-100 relative scale-105 z-10' : 'border-slate-200 shadow-sm'} flex flex-col`}>
              {tier.popular && <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Most Popular</div>}
              
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-3 rounded-xl bg-${tier.color}-50`}>
                  {tier.icon}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{tier.name}</h3>
                </div>
              </div>
              
              <div className="mb-6">
                <span className="text-4xl font-black text-slate-900">₹{tier.price.toLocaleString()}</span>
                <span className="text-slate-500 font-medium text-sm">/month</span>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-3 mb-6 text-center border border-slate-100">
                <span className="font-bold text-slate-900">{tier.leads}</span>
              </div>
              
              <ul className="space-y-4 mb-8 flex-1">
                {tier.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-600 font-medium">
                    <CheckCircle2 size={18} className={`text-${tier.color}-500 shrink-0`} />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              
              <button 
                onClick={() => handlePurchase(`${tier.name} Plan Subscription`, tier.price, "subscription_upgrade")}
                disabled={tier.price === 0}
                className={`w-full py-3 rounded-xl font-bold transition-all ${
                  tier.price === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' :
                  tier.popular ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200' :
                  'bg-slate-900 text-white hover:bg-slate-800'
                }`}
              >
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        {/* Pay-as-you-go Packs */}
        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 text-white relative overflow-hidden shadow-2xl">
          <div className="absolute -right-20 -top-20 opacity-5">
            <Zap size={400} />
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black mb-4">Pay-As-You-Go Lead Credits</h2>
              <p className="text-slate-400">Not ready for a subscription? Buy credits on demand to unlock specific high-value leads.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {creditPacks.map((pack) => (
                <div key={pack.name} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-3xl p-8 hover:bg-slate-800 transition-colors">
                  <h3 className="font-bold text-indigo-400 mb-2">{pack.name}</h3>
                  <div className="text-3xl font-black mb-2">{pack.credits} <span className="text-lg text-slate-400 font-medium">Credits</span></div>
                  <p className="text-slate-400 text-sm mb-6">{pack.description}</p>
                  <button 
                    onClick={() => handlePurchase(`${pack.credits} Lead Credits`, pack.price, "lead_purchase")}
                    className="w-full bg-white text-slate-900 hover:bg-slate-100 font-bold py-3 rounded-xl transition-colors"
                  >
                    Buy for ₹{pack.price.toLocaleString()}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Commission & Featured Addons */}
        <div className="mt-24 mb-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Escrow Commission</h3>
            <p className="text-slate-600 mb-6 font-medium">We only succeed when you succeed. We charge a flat success fee on projects won through our platform.</p>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="text-4xl font-black text-indigo-600">5%</span>
              <p className="text-slate-900 font-bold mt-2">of project value</p>
              <p className="text-slate-500 text-sm mt-1">Capped at ₹10,000 per project. Automatically deducted from payout.</p>
            </div>
          </div>
          
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center shadow-sm">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Featured Listing (CPC)</h3>
            <p className="text-slate-600 mb-6 font-medium">Drive immediate targeted traffic to your profile with our pay-per-click sponsored slots.</p>
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <span className="text-4xl font-black text-amber-500">₹50</span>
              <p className="text-slate-900 font-bold mt-2">per click</p>
              <p className="text-slate-500 text-sm mt-1">Pay only when a buyer clicks your sponsored profile card.</p>
            </div>
          </div>
        </div>
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
