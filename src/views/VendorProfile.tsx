import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Calendar, Users, ShieldCheck, Zap,
  CheckCircle2, MessageSquare, Bookmark, Share2,
  ChevronLeft, LayoutDashboard, Globe
} from "lucide-react";
import SimilarVendorsWidget from "../components/SimilarVendorsWidget";

export default function VendorProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/vendors/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setVendor(data);
      })
      .catch(e => {
        console.error(e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex justify-center items-center">
        <div className="h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center text-center p-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Vendor Not Found</h2>
        <p className="text-slate-500 mb-6">The vendor profile you're looking for does not exist or has been removed.</p>
        <button onClick={() => navigate('/vendors')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">
          Back to Directory
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      
      {/* 1. HERO COVER */}
      <div className="h-64 md:h-80 w-full bg-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
        
        <div className="absolute top-6 left-6 z-10">
          <button aria-label="Go back" onClick={() => navigate(-1)} className="flex items-center gap-1 text-white bg-slate-900/50 hover:bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-lg font-medium transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500">
            <ChevronLeft aria-hidden="true" size={18} /> Back
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        
        {/* Profile Card Header */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <div className="w-32 h-32 bg-white rounded-2xl shadow-lg border-4 border-white overflow-hidden shrink-0">
              <img src={vendor.logo} alt={vendor.businessName} loading="lazy" decoding="async" className="w-full h-full object-cover" />
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900">{vendor.businessName}</h1>
                {vendor.verified && (
                  <div className={`flex items-center gap-1 ${vendor.premium ? "bg-indigo-100 text-indigo-700" : "bg-emerald-100 text-emerald-700"} px-3 py-1 rounded-full text-xs font-bold`}>
                    <ShieldCheck size={14} /> {vendor.premium ? "Premium" : "Verified"}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 mb-4">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-slate-400" /> {vendor.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> Founded {vendor.foundedYear}</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-slate-400" /> Team: {vendor.teamSize}</span>
                <span className="flex items-center gap-1.5"><LayoutDashboard size={16} className="text-slate-400" /> 120+ Projects</span>
              </div>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star key={i} size={18} className={i < Math.floor(vendor.ratings.avg) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{vendor.ratings.avg}</span>
                  <span className="text-slate-500 underline cursor-pointer hover:text-indigo-600">({vendor.ratings.count} Reviews)</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-600">
                  <Zap size={16} className="fill-emerald-600" /> Responds in {vendor.responseTime}
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto">
            <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all text-lg">
              <MessageSquare size={20} /> Contact Vendor
            </button>
            <div className="flex gap-3">
              <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-4 rounded-xl font-bold transition-all" title="Save to Shortlist">
                <Bookmark size={20} /> <span className="sm:hidden">Save</span>
              </button>
              <button className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-4 rounded-xl font-bold transition-all" title="Share Profile">
                <Share2 size={20} /> <span className="sm:hidden">Share</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ABOUT */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">About Us</h3>
              <p className="text-slate-600 leading-relaxed mb-6">{vendor.description}</p>
              
              <h4 className="font-bold text-slate-900 mb-3 text-sm uppercase tracking-wider">Specialties & Tech Stack</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.services.length > 0 ? vendor.services.map((s: any, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{typeof s === 'string' ? s : s.title}</span>
                )) : (
                  ["React", "Node.js", "UI/UX", "SEO", "E-commerce"].map(s => (
                    <span key={s} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium">{s}</span>
                  ))
                )}
              </div>
            </div>

            {/* PORTFOLIO */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-bold text-slate-900">Portfolio</h3>
                <button className="text-indigo-600 font-bold hover:underline text-sm">View All Projects</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl overflow-hidden group cursor-pointer relative h-48 bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80" alt="Project 1" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Fintech App UI</span>
                  </div>
                </div>
                <div className="rounded-xl overflow-hidden group cursor-pointer relative h-48 bg-slate-100">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80" alt="Project 2" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Data Dashboard</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICES & PRICING */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6 md:p-8">
              <h3 className="text-xl font-bold text-slate-900 mb-6">Services & Pricing</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[600px]">
                  <thead>
                    <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500">
                      <th className="pb-3 font-semibold">Service</th>
                      <th className="pb-3 font-semibold">Starting Price</th>
                      <th className="pb-3 font-semibold">Typical Timeline</th>
                    </tr>
                  </thead>
                  <tbody>
                    {vendor.services.length > 0 && typeof vendor.services[0] === 'object' ? vendor.services.map((s: any, idx: number) => (
                      <tr key={idx} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                        <td className="py-4 font-bold text-slate-900">{s.title}</td>
                        <td className="py-4 text-slate-700 font-medium">{s.priceRange}</td>
                        <td className="py-4 text-slate-500">{s.timeline}</td>
                      </tr>
                    )) : (
                      <>
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-slate-900">Custom Website Dev</td>
                          <td className="py-4 text-slate-700 font-medium">₹50,000 / project</td>
                          <td className="py-4 text-slate-500">4-6 weeks</td>
                        </tr>
                        <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-slate-900">Mobile App MVP</td>
                          <td className="py-4 text-slate-700 font-medium">₹1,50,000 / project</td>
                          <td className="py-4 text-slate-500">8-12 weeks</td>
                        </tr>
                        <tr className="hover:bg-slate-50 transition-colors">
                          <td className="py-4 font-bold text-slate-900">Retainer (Tech Support)</td>
                          <td className="py-4 text-slate-700 font-medium">₹30,000 / month</td>
                          <td className="py-4 text-slate-500">Ongoing</td>
                        </tr>
                      </>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-6">
                <button className="w-full py-3 bg-slate-100 hover:bg-indigo-50 text-indigo-700 font-bold rounded-xl border border-slate-200 hover:border-indigo-200 transition-colors">
                  Request a Custom Quote
                </button>
              </div>
            </div>

            {/* REVIEWS */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-xl font-bold text-slate-900">Client Reviews ({vendor.ratings.count})</h3>
                <button className="text-indigo-600 font-bold hover:underline text-sm">Write a Review</button>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 mb-10 pb-8 border-b border-slate-100">
                <div className="flex flex-col items-center justify-center md:w-1/3 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                  <span className="text-5xl font-black text-slate-900">{vendor.ratings.avg}</span>
                  <div className="flex items-center gap-1 mt-2 mb-1">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star key={i} size={18} className={i < Math.floor(vendor.ratings.avg) ? "text-amber-400 fill-amber-400" : "text-slate-300"} />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 font-medium">Based on {vendor.ratings.count} reviews</span>
                </div>
                
                <div className="flex-1 space-y-3">
                  {[
                    { label: "Quality", val: vendor.ratings.quality || 4.8 },
                    { label: "Timeliness", val: vendor.ratings.timeliness || 4.5 },
                    { label: "Communication", val: vendor.ratings.communication || 4.9 },
                    { label: "Value for money", val: 4.6 }
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center text-sm font-medium">
                      <span className="w-32 text-slate-600">{stat.label}</span>
                      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden mr-4">
                        <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(stat.val / 5) * 100}%` }}></div>
                      </div>
                      <span className="w-8 text-right font-bold text-slate-900">{stat.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sample Review */}
              <div className="space-y-6">
                <div className="border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-1 mb-2">
                    {Array.from({length: 5}).map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                    <span className="text-slate-400 text-xs ml-2">June 2025</span>
                  </div>
                  <p className="text-slate-800 font-medium mb-3">"Amazing work, delivered ahead of schedule! The communication was flawless and the final product exceeded our expectations."</p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 flex justify-center items-center font-bold text-xs">P</div>
                    <div>
                      <h5 className="text-sm font-bold text-slate-900">Priya M.</h5>
                      <span className="text-xs text-slate-500">Startup Founder (Web Development)</span>
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                      <CheckCircle2 size={12} /> Verified Client
                    </div>
                  </div>
                </div>
                <button className="w-full text-center text-indigo-600 font-bold hover:underline">Load More Reviews</button>
              </div>
            </div>
            
            <SimilarVendorsWidget vendorId={vendor.id} />
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Trust & Certifications */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Trust & Certifications</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group cursor-pointer hover:border-emerald-300 transition-colors">
                  <ShieldCheck size={28} className="text-emerald-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700">GST Verified</span>
                </div>
                <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-xl border border-slate-100 text-center group cursor-pointer hover:border-indigo-300 transition-colors">
                  <Globe size={28} className="text-indigo-500 mb-2" />
                  <span className="text-xs font-bold text-slate-700">ISO 9001</span>
                </div>
              </div>
              
              <div className="mt-4 p-4 bg-indigo-50 rounded-xl border border-indigo-100">
                <div className="flex items-start gap-3">
                  <Lock size={20} className="text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-bold text-indigo-900">Escrow Protected</h4>
                    <p className="text-xs text-indigo-700 mt-1">Payments to this vendor are secured by VendiMatch Escrow.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Vendors */}
            <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-6">
              <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Similar Vendors</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3 items-center p-3 hover:bg-slate-50 rounded-xl cursor-pointer transition-colors border border-transparent hover:border-slate-100">
                    <div className="w-12 h-12 rounded-lg bg-slate-200 shrink-0 overflow-hidden">
                      <img src={`https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=100&q=80&sig=${i}`} alt={`Competitor ${i}`} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 line-clamp-1">Competitor Agency {i}</h4>
                      <div className="flex items-center gap-1 text-xs mt-0.5">
                        <Star size={12} className="text-amber-400 fill-amber-400" />
                        <span className="font-bold text-slate-700">4.8</span>
                        <span className="text-slate-400 ml-1">Bangalore</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>
      
      {/* Sticky Mobile CTA */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 flex gap-2">
        <button className="flex-1 bg-indigo-600 text-white font-bold py-3 rounded-xl">Contact Vendor</button>
        <button aria-label="Bookmark Vendor" className="bg-slate-100 text-slate-700 p-3 rounded-xl border border-slate-200 focus-visible:ring-2 focus-visible:ring-indigo-500"><Bookmark aria-hidden="true" size={20} /></button>
      </div>

    </div>
  );
}

const Lock = ({size, className}:any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
)
