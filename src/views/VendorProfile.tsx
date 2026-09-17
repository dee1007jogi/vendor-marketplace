import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Star, MapPin, Calendar, Users, ShieldCheck, Zap,
  CheckCircle2, MessageSquare, Bookmark, Share2,
  ChevronLeft, LayoutDashboard, Globe, Phone, Clock
} from "lucide-react";
import SimilarVendorsWidget from "../components/SimilarVendorsWidget";
import Animated3DLetterAvatar from "../components/Animated3DLetterAvatar";
import PastelVendorAvatar from "../components/PastelVendorAvatar";
import AppointmentModal from "../components/AppointmentModal";

export default function VendorProfile() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    const targetSlug = slug === "profile" ? "user-vendor-1" : slug;
    
    fetch(`/api/vendors/${targetSlug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) throw new Error(data.error);
        setVendor(data);
      })
      .catch(() => {
        // Fallback to first available vendor in directory search
        fetch("/api/vendors/search?limit=1")
          .then(r => r.json())
          .then(searchData => {
            if (searchData.items && searchData.items.length > 0) {
              const item = searchData.items[0];
              setVendor({
                id: item.id,
                businessName: item.businessName,
                location: item.location,
                foundedYear: 2018,
                teamSize: "50-100",
                description: `${item.businessName} is a verified B2B wholesale manufacturer and supplier specializing in ${item.category}.`,
                ratings: { avg: item.rating || 4.8, count: item.reviewCount || 120, quality: 4.8, timeliness: 4.7, communication: 4.9 },
                verified: true,
                premium: true,
                services: item.services || ["Bulk Supply", "Custom OEM Manufacturing"],
                logo: item.logo
              });
            }
          })
          .catch(console.error);
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
    <div className="min-h-screen bg-gradient-to-b from-sky-50/70 via-white to-sky-50/50 pb-24">
      
      {/* 1. HERO COVER (Bright Daylight Industrial Facility) */}
      <div className="h-64 md:h-80 w-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-sky-900/60 via-transparent to-transparent"></div>
        <div className="gold-line-animated absolute bottom-0 left-0 right-0 h-[3px]"></div>
        
        <div className="absolute top-6 left-6 z-10">
          <button aria-label="Go back" onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-slate-800 bg-white/90 hover:bg-white backdrop-blur-md px-4 py-2 rounded-xl font-bold transition-all shadow-md cursor-pointer border border-sky-100">
            <ChevronLeft aria-hidden="true" size={18} /> Back to Directory
          </button>
        </div>
      </div>

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 -mt-24 relative z-10 animate-entrance-up">
        
        {/* Profile Card Header */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-sky-200/80 p-6 md:p-10 mb-8 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between relative overflow-hidden">
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
            <PastelVendorAvatar 
              src={vendor.logo} 
              name={vendor.businessName} 
              size="2xl" 
              roundness="rounded-3xl"
              showStatusDot={true}
              className="shrink-0 shadow-lg border-4 border-white ring-2 ring-sky-100" 
            />
            
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-black text-slate-900">{vendor.businessName}</h1>
                
                {/* CRISIL/ICRA AAA Credit Rating Badge */}
                <div className="badge-credit-rating">
                  <ShieldCheck size={14} className="text-amber-500 shrink-0 animate-pulse" />
                  <span>CRISIL/ICRA AAA (99.4%)</span>
                </div>

                {vendor.verified && (
                  <div className={`flex items-center gap-1 ${vendor.premium ? "bg-sky-100 text-sky-800 border border-sky-200" : "bg-emerald-100 text-emerald-800 border border-emerald-200"} px-3 py-1 rounded-full text-xs font-bold`}>
                    <ShieldCheck size={14} /> {vendor.premium ? "Premium Supplier" : "Verified Manufacturer"}
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-600 mb-3">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-sky-600" /> {vendor.location}</span>
                <span className="flex items-center gap-1.5"><Calendar size={16} className="text-sky-600" /> Founded {vendor.foundedYear}</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-sky-600" /> Team: {vendor.teamSize}</span>
                <span className="flex items-center gap-1.5"><Clock size={16} className="text-emerald-600" /> Open: 9:00 AM - 8:00 PM</span>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex">
                    {Array.from({length: 5}).map((_, i) => (
                      <Star key={i} size={18} className={i < Math.floor(vendor.ratings.avg) ? "text-amber-400 fill-amber-400" : "text-slate-200 fill-slate-200"} />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900">{vendor.ratings.avg}</span>
                  <span className="text-slate-500 underline cursor-pointer hover:text-sky-600">({vendor.ratings.count} Verified Reviews)</span>
                </div>
                
                <div className="flex items-center gap-1.5 text-sm font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  <Zap size={15} className="fill-emerald-600" /> Responds in {vendor.responseTime}
                </div>

                <div className="flex items-center gap-3 text-xs font-extrabold bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200 text-sky-900">
                  <span>Consultation Fee: ₹500</span>
                  <span className="text-slate-300">•</span>
                  <span className="text-emerald-700">Booking Fee: ₹250</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 w-full md:w-auto">
            <button 
              onClick={() => setShowAppointmentModal(true)}
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-sky-600 hover:from-purple-700 hover:to-sky-700 text-white px-6 py-4 rounded-xl font-black shadow-lg shadow-purple-600/20 transition-all text-sm cursor-pointer"
            >
              <Calendar size={18} /> Schedule Appointment
            </button>
            
            <a
              href="tel:+919876543210"
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-5 py-4 rounded-xl font-bold transition-all cursor-pointer text-xs"
            >
              <Phone size={16} className="text-sky-600" /> Call
            </a>

            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 lg:flex-none flex justify-center items-center gap-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 px-5 py-4 rounded-xl font-bold transition-all cursor-pointer text-xs"
            >
              <MessageSquare size={16} className="text-emerald-600 fill-emerald-600" /> WhatsApp
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* ABOUT */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-sky-100 p-6 md:p-8">
              <h3 className="text-xl font-black text-slate-900 mb-4">About the Supplier</h3>
              <p className="text-slate-600 leading-relaxed mb-6 font-medium">{vendor.description}</p>
              
              <h4 className="font-extrabold text-slate-900 mb-3 text-xs uppercase tracking-wider">Manufacturing & Production Capacities</h4>
              <div className="flex flex-wrap gap-2">
                {vendor.services.length > 0 ? vendor.services.map((s: any, i: number) => (
                  <span key={i} className="px-3.5 py-2 bg-sky-50 border border-sky-100 text-sky-900 rounded-xl text-xs font-bold">{typeof s === 'string' ? s : s.title}</span>
                )) : (
                  ["Bulk Production", "OEM / Private Label", "ISO Certified", "Fast Dispatch", "Custom Moulding"].map(s => (
                    <span key={s} className="px-3.5 py-2 bg-sky-50 border border-sky-100 text-sky-900 rounded-xl text-xs font-bold">{s}</span>
                  ))
                )}
              </div>
            </div>

            {/* PORTFOLIO */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-sky-100 p-6 md:p-8">
              <div className="flex justify-between items-end mb-6">
                <h3 className="text-xl font-black text-slate-900">Facility & Factory Showcase</h3>
                <button className="text-sky-600 font-bold hover:underline text-sm cursor-pointer">View All Plant Photos</button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl overflow-hidden group cursor-pointer relative h-48 bg-sky-50 border border-sky-100">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80" alt="Plant 1" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-sky-950/0 group-hover:bg-sky-950/40 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">CNC Production Line</span>
                  </div>
                </div>
                <div className="rounded-2xl overflow-hidden group cursor-pointer relative h-48 bg-sky-50 border border-sky-100">
                  <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=600&q=80" alt="Plant 2" loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-sky-950/0 group-hover:bg-sky-950/40 transition-colors flex items-center justify-center">
                    <span className="text-white font-bold opacity-0 group-hover:opacity-100 transition-opacity">Quality Inspection Bay</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SERVICES & PRICING */}
            <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-sm border border-sky-100 p-6 md:p-8">
              <h3 className="text-xl font-black text-slate-900 mb-6">Wholesale MOQ & Volume Pricing</h3>
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
                    <p className="text-xs text-indigo-700 mt-1">Payments to this vendor are secured by Bussinest Escrow.</p>
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
      
      {/* Appointment Booking Modal */}
      {showAppointmentModal && (
        <AppointmentModal 
          isOpen={showAppointmentModal} 
          onClose={() => setShowAppointmentModal(false)} 
          vendorName={vendor.businessName} 
        />
      )}

    </div>
  );
}

const Lock = ({size, className}:any) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
)
