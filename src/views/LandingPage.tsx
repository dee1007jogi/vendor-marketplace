import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, useAnimation } from "framer-motion";
import { 
  Search, ShieldCheck, Zap, Star, 
  ArrowRight, Users, CheckCircle2, ChevronRight,
  Laptop, Smartphone, Building2, PaintRoller, Truck, Bot, Share2,
  Lock, MessageSquare, Award
} from "lucide-react";

// Helper component for animating numbers
const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const duration = 2000; // 2 seconds
      const increment = value / (duration / 16); // 60fps
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= value) {
          setCount(value);
          clearInterval(timer);
        } else {
          setCount(Math.floor(start));
        }
      }, 16);
      return () => clearInterval(timer);
    }
  }, [isInView, value]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
};

// Reusable scroll reveal wrapper
const ScrollReveal = ({ children, delay = 0, className = "" }: any) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default function LandingPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredVendors, setFeaturedVendors] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    // Fetch Homepage Data
    fetch("/api/public/stats").then(r => r.json()).then(setStats).catch(console.error);
    fetch("/api/public/categories?withCounts=true").then(r => r.json()).then(d => setCategories(d.items || [])).catch(console.error);
    fetch("/api/public/vendors/featured?limit=3").then(r => r.json()).then(d => setFeaturedVendors(d.items || [])).catch(console.error);
    fetch("/api/public/testimonials").then(r => r.json()).then(d => setTestimonials(d.items || [])).catch(console.error);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/vendors?search=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate('/vendors');
    }
  };

  const getIcon = (iconName: string) => {
    const props = { size: 32, className: "text-indigo-600 mb-4 transition-transform group-hover:scale-110 duration-300" };
    switch (iconName) {
      case "Laptop": return <Laptop {...props} />;
      case "Smartphone": return <Smartphone {...props} />;
      case "Search": return <Search {...props} />;
      case "Share2": return <Share2 {...props} />;
      case "Building2": return <Building2 {...props} />;
      case "PaintRoller": return <PaintRoller {...props} />;
      case "Truck": return <Truck {...props} />;
      case "Bot": return <Bot {...props} />;
      default: return <Star {...props} />;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-24 pb-32">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40"></div>
        
        {/* Animated Background Orbs */}
        <motion.div animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 8, repeat: Infinity }} className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[120px] mix-blend-screen"></motion.div>
        <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 10, repeat: Infinity, delay: 1 }} className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-cyan-600/20 rounded-full blur-[100px] mix-blend-screen"></motion.div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium text-sm mb-8 backdrop-blur-sm">
            <Zap size={14} className="text-amber-400 fill-amber-400" /> India's #1 AI-Powered B2B Marketplace
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tight mb-4 md:mb-6 leading-[1.1]"
          >
            Find Trusted Vendors <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-300 to-emerald-300">in Minutes, Not Weeks</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-300 max-w-2xl mx-auto mb-10 font-medium"
          >
            Stop directory diving. Our AI instantly matches your exact business requirements with strictly verified service providers.
          </motion.p>

          <motion.form 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            onSubmit={handleSearch} 
            className="max-w-3xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-2 mb-8 group"
          >
            <div className="flex-1 flex items-center px-4 bg-slate-50 hover:bg-slate-100 transition-colors rounded-xl border border-transparent focus-within:border-indigo-200 focus-within:bg-white">
              <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={22} />
              <input 
                type="text" 
                placeholder="What service are you looking for?"
                className="w-full bg-transparent border-none outline-none px-4 py-3 md:py-5 text-slate-900 text-base md:text-lg placeholder:text-slate-400 font-medium"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 md:px-8 md:py-5 rounded-xl font-bold transition-all text-base md:text-lg shadow-lg hover:shadow-indigo-500/40 flex items-center justify-center gap-2 shrink-0 w-full md:w-auto">
              Find Vendors <ArrowRight size={20} />
            </motion.button>
          </motion.form>

          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center items-center gap-3 text-sm font-medium"
          >
            <span className="text-slate-400">Popular Searches:</span>
            {categories.slice(0, 4).map(c => (
              <motion.button whileHover={{ scale: 1.05, backgroundColor: "#334155" }} whileTap={{ scale: 0.95 }} key={c.slug} onClick={() => navigate(`/vendors?category=${c.slug}`)} className="px-4 py-1.5 bg-slate-800 text-slate-200 rounded-full transition-colors border border-slate-700">
                {c.name}
              </motion.button>
            ))}
          </motion.div>

          {stats && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="mt-12 md:mt-20 flex flex-wrap justify-center gap-6 sm:gap-10 md:gap-24 text-center border-t border-slate-800/80 pt-8 md:pt-10"
            >
              <div className="w-[40%] sm:w-auto"><p className="text-3xl md:text-4xl font-black text-white"><AnimatedCounter value={stats.vendorCount} suffix="+" /></p><p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Verified Vendors</p></div>
              <div className="w-[40%] sm:w-auto"><p className="text-3xl md:text-4xl font-black text-white"><AnimatedCounter value={stats.projectValueCr} prefix="₹" suffix="Cr+" /></p><p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Project Value</p></div>
              <div className="w-[40%] sm:w-auto"><p className="text-3xl md:text-4xl font-black text-white"><AnimatedCounter value={stats.satisfactionRate} suffix="%" /></p><p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Satisfied Clients</p></div>
              <div className="w-[40%] sm:w-auto"><p className="text-3xl md:text-4xl font-black text-white">{stats.avgResponseTime}</p><p className="text-[10px] md:text-sm text-slate-400 font-bold uppercase tracking-widest mt-2">Avg Response</p></div>
            </motion.div>
          )}
        </div>
      </section>

      {/* 2. HOW IT WORKS */}
      <section className="py-16 md:py-24 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <ScrollReveal>
            <h2 className="text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">The Process</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-10 md:mb-16">How VendorMatch Works</h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-indigo-100 via-indigo-200 to-indigo-100 -z-10 -translate-y-1/2"></div>
            
            <ScrollReveal delay={0.1}>
              <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-6 md:p-8 rounded-3xl border border-slate-200 h-full">
                <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 relative">
                  1
                  <div className="absolute -inset-2 bg-indigo-600/5 rounded-3xl -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Post your requirement</h3>
                <p className="text-slate-500 font-medium">Describe what you need. Our AI helps structure your RFP perfectly for vendors.</p>
              </motion.div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2}>
              <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 h-full relative">
                <div className="absolute -top-4 -right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">AI Powered</div>
                <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 relative">
                  2
                  <div className="absolute -inset-2 bg-indigo-600/5 rounded-3xl -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Get AI-Matched</h3>
                <p className="text-slate-500 font-medium">We instantly notify the top 5 highly-relevant, verified vendors who fit your exact criteria.</p>
              </motion.div>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <motion.div whileHover={{ y: -5 }} className="bg-slate-50 p-8 rounded-3xl border border-slate-200 h-full">
                <div className="w-16 h-16 bg-white shadow-sm border border-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center text-2xl font-black mx-auto mb-6 relative">
                  3
                  <div className="absolute -inset-2 bg-indigo-600/5 rounded-3xl -z-10"></div>
                </div>
                <h3 className="text-xl font-bold mb-3 text-slate-900">Compare & Choose</h3>
                <p className="text-slate-500 font-medium">Review quotes, chat directly, check portfolios, and hire with our Escrow protection.</p>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 3. PLATFORM FEATURES (New Interactive Content) */}
      <section className="py-16 md:py-24 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <ScrollReveal>
              <h2 className="text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Why Choose Us</h2>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 mb-4 md:mb-6 leading-tight">Built for B2B Trust & Speed</h3>
              <p className="text-base md:text-lg text-slate-600 mb-6 md:mb-8">We've engineered the friction out of B2B procurement. No more spam, no more fake reviews, and no more endless negotiations.</p>
              
              <div className="space-y-4 md:space-y-6">
                <motion.div whileHover={{ x: 10 }} className="flex gap-4 p-3 md:p-4 rounded-2xl hover:bg-white transition-colors cursor-default">
                  <div className="mt-1 bg-emerald-100 p-2 rounded-lg text-emerald-600 h-min"><ShieldCheck size={24} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Rigorous Vendor KYC</h4>
                    <p className="text-slate-500 mt-1">Every vendor goes through GST, PAN, and identity verification before they can bid on projects.</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 10 }} className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-colors cursor-default">
                  <div className="mt-1 bg-indigo-100 p-2 rounded-lg text-indigo-600 h-min"><Lock size={24} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Escrow Payment Protection</h4>
                    <p className="text-slate-500 mt-1">Your funds are held securely and only released when milestones are met and approved.</p>
                  </div>
                </motion.div>
                <motion.div whileHover={{ x: 10 }} className="flex gap-4 p-4 rounded-2xl hover:bg-white transition-colors cursor-default">
                  <div className="mt-1 bg-amber-100 p-2 rounded-lg text-amber-600 h-min"><MessageSquare size={24} /></div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-900">Integrated Workspace Chat</h4>
                    <p className="text-slate-500 mt-1">Chat directly with vendors, share files, and finalize contracts within a unified platform.</p>
                  </div>
                </motion.div>
              </div>
            </ScrollReveal>
            
            <ScrollReveal delay={0.2} className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-3xl transform rotate-3 scale-105 opacity-20"></div>
              <img src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80" alt="Platform Dashboard Preview" className="rounded-3xl shadow-2xl relative z-10 border border-slate-200" />
              
              {/* Interactive Floating Badge */}
              <motion.div 
                animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100 z-20 flex items-center gap-4"
              >
                <div className="bg-emerald-100 p-3 rounded-xl text-emerald-600"><CheckCircle2 size={24} className="fill-emerald-600 text-white" /></div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Match Found</p>
                  <p className="text-xs text-slate-500">98% relevance score</p>
                </div>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* 4. TOP CATEGORIES GRID */}
      <section className="py-16 md:py-24 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 md:mb-12 gap-4">
              <div>
                <h2 className="text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Directory</h2>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900">Top Service Categories</h3>
                <p className="text-slate-500 mt-2 text-base md:text-lg">Explore highly-vetted professionals by industry</p>
              </div>
              <Link to="/vendors" className="hidden sm:flex text-indigo-600 font-bold items-center gap-2 hover:text-indigo-700 bg-indigo-50 px-6 py-3 rounded-full transition-colors shrink-0">
                View All Categories <ArrowRight size={18} />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((cat, i) => (
              <ScrollReveal key={cat.slug} delay={i * 0.05}>
                <motion.button 
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate(`/vendors?category=${cat.slug}`)}
                  className="w-full group p-8 bg-slate-50 hover:bg-white rounded-3xl border border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all text-left flex flex-col items-start h-full relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-150 duration-500"></div>
                  <div className="relative z-10">
                    {getIcon(cat.icon)}
                    <h3 className="text-xl font-bold text-slate-900 mt-4 group-hover:text-indigo-600 transition-colors">{cat.name}</h3>
                    <p className="text-slate-500 font-medium mt-2">{cat.vendorCount}+ verified vendors</p>
                  </div>
                </motion.button>
              </ScrollReveal>
            ))}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link to="/vendors" className="text-indigo-600 font-bold inline-flex items-center gap-2 bg-indigo-50 px-6 py-3 rounded-full">
              View All Categories <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. FEATURED VENDORS */}
      <section className="py-16 md:py-24 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-10 md:mb-16">
              <h2 className="text-xs md:text-sm font-bold text-amber-400 uppercase tracking-widest mb-3 flex justify-center items-center gap-2"><Award size={18} /> Elite Network</h2>
              <h3 className="text-2xl sm:text-3xl md:text-5xl font-black mb-4">Trusted by Top Businesses</h3>
              <p className="text-slate-400 text-base md:text-lg max-w-2xl mx-auto">We handpick and highlight vendors who consistently deliver exceptional quality and maintain perfect resolution records.</p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {featuredVendors.map((vendor, i) => (
              <ScrollReveal key={vendor.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -10 }} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 hover:border-indigo-500/50 hover:bg-slate-800 transition-colors group">
                  <div className="flex gap-5 items-center mb-6">
                    <img src={vendor.logo} alt={vendor.businessName} loading="lazy" decoding="async" className="w-20 h-20 rounded-2xl object-cover bg-slate-700 shadow-lg" />
                    <div>
                      <h3 className="font-bold text-xl text-white group-hover:text-indigo-300 transition-colors">{vendor.businessName}</h3>
                      <div className="flex items-center gap-2 mt-2 bg-slate-900/50 w-min px-3 py-1 rounded-lg">
                        <Star size={14} className="text-amber-400" fill="currentColor" /> 
                        <span className="font-bold">{vendor.rating}</span>
                        <span className="text-slate-400 text-sm">({vendor.reviewCount})</span>
                      </div>
                    </div>
                  </div>
                  <ul className="space-y-3 mb-8 text-slate-300 font-medium">
                    <li className="flex items-center gap-3"><Zap size={18} className="text-emerald-400" /> Responds in {vendor.responseTime}</li>
                    <li className="flex items-center gap-3">
                      <ShieldCheck size={18} className={vendor.premium ? "text-indigo-400" : "text-emerald-400"} /> 
                      {vendor.premium ? "Premium Verified" : "Identity Verified"}
                    </li>
                  </ul>
                  <button onClick={() => navigate(`/vendors`)} className="w-full py-3.5 bg-slate-700 hover:bg-indigo-600 text-white rounded-xl font-bold transition-all text-sm group-hover:shadow-lg group-hover:shadow-indigo-500/25">
                    View Full Profile
                  </button>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
          
          <ScrollReveal delay={0.4}>
            <div className="mt-12 text-center">
              <Link to="/vendors" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 hover:border-slate-500 rounded-full font-bold transition-colors shadow-lg">
                Browse All Vendors <ChevronRight size={20} />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 6. TESTIMONIALS (Interactive Hover effects) */}
      <section className="py-16 md:py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4">
          <ScrollReveal>
            <h2 className="text-xs md:text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2 text-center">Success Stories</h2>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-center text-slate-900 mb-10 md:mb-16">What Our Clients Say</h3>
          </ScrollReveal>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.1}>
                <motion.div whileHover={{ scale: 1.03 }} className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-slate-200 relative h-full flex flex-col justify-between">
                  <div>
                    <div className="text-5xl md:text-6xl text-indigo-100 font-serif absolute top-4 left-6 leading-none">"</div>
                    <p className="text-slate-700 text-base md:text-lg font-medium relative z-10 pt-6 mb-6 md:mb-8 leading-relaxed">"{t.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                    <img src={t.avatar} alt={t.name} loading="lazy" decoding="async" className="w-14 h-14 rounded-full object-cover ring-4 ring-indigo-50" />
                    <div>
                      <h4 className="font-black text-slate-900">{t.name}</h4>
                      <p className="text-slate-500 text-sm font-medium">{t.title}</p>
                    </div>
                  </div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="py-16 md:py-20 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10 text-center text-white">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-4 md:mb-6 leading-tight">Ready to find your perfect vendor?</h2>
            <p className="text-base sm:text-lg md:text-xl text-indigo-100 mb-8 md:mb-10 font-medium max-w-2xl mx-auto">Join thousands of businesses who have accelerated their growth with VendiMatch.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/post-requirement')} className="bg-white text-indigo-600 px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg shadow-xl w-full sm:w-auto">
                Post a Requirement
              </motion.button>
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/vendors')} className="bg-indigo-700 hover:bg-indigo-800 border border-indigo-500 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-base md:text-lg transition-colors w-full sm:w-auto">
                Browse Directory
              </motion.button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 8. TRUST BADGES */}
      <section className="py-8 md:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center items-center gap-6 sm:gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="text-2xl font-black tracking-tighter">Razorpay</div>
          <div className="text-2xl font-black tracking-tighter">Stripe</div>
          <div className="flex items-center gap-2 font-black text-xl"><ShieldCheck size={28} /> GST Verified</div>
          <div className="font-mono font-bold text-xl tracking-widest">ISO:27001</div>
        </div>
      </section>

    </div>
  );
}
