import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChevronLeft, CheckCircle2, Star, Plus, ShieldCheck, Sparkles } from "lucide-react";
import Animated3DLetterAvatar from "../components/Animated3DLetterAvatar";

export default function CompareVendors() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const vendorIds = searchParams.get("vendorIds")?.split(",") || [];
  
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (vendorIds.length === 0) {
      setLoading(false);
      return;
    }

    fetch(`/api/vendors/compare?ids=${vendorIds.join(",")}`)
      .then(r => r.json())
      .then(data => {
        setVendors(data);
        setLoading(false);
      })
      .catch(console.error);
  }, [searchParams]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading comparison...</div>;
  }

  if (vendorIds.length < 2) {
    return (
      <div className="min-h-screen bg-slate-50/70 py-20 px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl mx-auto text-center bg-white/95 backdrop-blur-xl p-8 md:p-14 rounded-[2.5rem] border border-sky-200/80 shadow-2xl relative overflow-hidden"
        >
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          <ShieldCheck size={56} className="mx-auto text-sky-400 mb-6 animate-pulse" />
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2 font-heading">Select Suppliers to Compare</h2>
          <p className="text-slate-500 mb-8 font-medium">Select at least two wholesale vendors to view a side-by-side technical and pricing audit.</p>
          <button onClick={() => navigate("/vendors")} className="bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-black px-8 py-3.5 rounded-xl shadow-lg shadow-sky-600/25 transition-all cursor-pointer button-luxury-glow">
            Explore Wholesale Suppliers
          </button>
        </motion.div>
      </div>
    );
  }

  const removeVendor = (id: string) => {
    const newIds = vendorIds.filter(v => v !== id);
    if (newIds.length > 0) {
      navigate(`/compare?vendorIds=${newIds.join(",")}`);
    } else {
      navigate("/compare");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/70 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex items-center gap-4 mb-8"
        >
          <button onClick={() => navigate("/vendors")} className="p-2.5 bg-white rounded-2xl shadow-sm hover:bg-sky-50 border border-sky-100 transition-colors cursor-pointer"><ChevronLeft size={20} className="text-slate-700" /></button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">Compare Wholesale Vendors</h1>
            <p className="text-slate-500 font-medium text-sm">Side-by-side audit of {vendors.length} preferred suppliers.</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="bg-white/95 backdrop-blur-2xl rounded-[2.5rem] shadow-xl shadow-sky-950/5 border border-sky-200/80 overflow-hidden overflow-x-auto relative"
        >
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          <table className="w-full text-left table-fixed min-w-[800px]">
            <thead>
              <tr className="border-b border-sky-100">
                <th className="w-48 bg-sky-50/70 p-6 text-sky-900 font-black uppercase tracking-wider text-xs">Features & Metrics</th>
                {vendors.map(v => (
                  <th key={v.userId} className="p-6 relative bg-white border-l border-sky-100 w-1/3">
                    <button onClick={() => removeVendor(v.userId)} className="absolute top-4 right-4 w-7 h-7 rounded-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors text-sm font-bold flex items-center justify-center cursor-pointer" title="Remove from comparison">×</button>
                    <div className="flex flex-col items-center text-center mt-2">
                      <div className="w-20 h-20 rounded-2xl bg-sky-50/80 overflow-hidden mb-3 border-2 border-sky-200 shadow-sm p-2 flex items-center justify-center">
                        <Animated3DLetterAvatar role="vendor" size="xl" title={v.businessName} />
                      </div>
                      <h3 className="font-black text-lg text-slate-900 line-clamp-1 font-heading">{v.businessName}</h3>
                      <div className="flex items-center gap-1.5 text-sm font-bold mt-1">
                        <Star size={15} className="text-amber-400 fill-amber-400" />
                        <span className="text-slate-800">{v.ratings?.avg || "4.8"}</span>
                        <span className="text-slate-400 font-medium">({v.ratings?.count || 0})</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-sky-100 text-sm">
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Verification Status</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100 font-medium">
                    {v.user?.verified ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-black text-xs border border-emerald-200">
                        <CheckCircle2 size={15} /> CRISIL Verified
                      </span>
                    ) : (
                      <span className="text-slate-400 text-xs font-semibold">Standard Listing</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Category</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100 font-bold text-slate-900">{v.category}</td>
                ))}
              </tr>
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Industrial Cluster</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100 font-medium text-slate-600">📍 {v.location}</td>
                ))}
              </tr>
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Starting MoQ Price</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100 font-black text-sky-900 text-xl font-mono">₹{v.pricingMin?.toLocaleString() || "0"}</td>
                ))}
              </tr>
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Response SLA</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100 font-semibold text-emerald-700">⚡ {v.responseTime || "< 2 hours"}</td>
                ))}
              </tr>
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Specialties</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100">
                    <div className="flex flex-wrap gap-1.5">
                      {v.services?.slice(0,3).map((s: any, i: number) => (
                        <span key={i} className="bg-sky-50 text-sky-800 border border-sky-200/80 px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap">{s.name || s}</span>
                      ))}
                      {(!v.services || v.services.length === 0) && <span className="text-slate-400">—</span>}
                    </div>
                  </td>
                ))}
              </tr>
              <tr className="hover:bg-sky-50/40 transition-colors">
                <td className="bg-sky-50/50 p-6 font-bold text-slate-700">Direct Actions</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-sky-100">
                    <div className="flex flex-col gap-2.5">
                      <button onClick={() => navigate(`/vendor/${v.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="w-full bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold py-2.5 rounded-xl border border-sky-200 transition-colors cursor-pointer text-xs">View Full Profile</button>
                      <button onClick={() => navigate("/post-requirement")} className="w-full bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 text-white font-bold py-2.5 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer text-xs button-luxury-glow">Request RFQ</button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
    </div>
  );
}
