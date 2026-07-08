import React, { useState, useEffect } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, CheckCircle2, Star, Plus, ShieldCheck } from "lucide-react";

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
      <div className="min-h-screen bg-slate-50 py-20 px-4">
        <div className="max-w-xl mx-auto text-center bg-white p-6 md:p-12 rounded-3xl border border-slate-200 shadow-sm">
          <ShieldCheck size={48} className="mx-auto text-slate-300 mb-6" />
          <h2 className="text-2xl font-black text-slate-900 mb-2">Select vendors to compare</h2>
          <p className="text-slate-500 mb-8">You need at least two vendors to view the comparison table.</p>
          <button onClick={() => navigate("/vendors")} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">
            Go back to Search
          </button>
        </div>
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
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate("/vendors")} className="p-2 bg-white rounded-full shadow-sm hover:bg-slate-100"><ChevronLeft size={20} /></button>
          <div>
            <h1 className="text-2xl font-black text-slate-900">Compare Vendors</h1>
            <p className="text-slate-500 font-medium">Side-by-side comparison of {vendors.length} vendors.</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden overflow-x-auto">
          <table className="w-full text-left table-fixed min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="w-48 bg-slate-50 p-6 text-slate-500 font-bold uppercase tracking-wider text-xs">Features</th>
                {vendors.map(v => (
                  <th key={v.userId} className="p-6 relative bg-white border-l border-slate-100 w-1/3">
                    <button onClick={() => removeVendor(v.userId)} className="absolute top-4 right-4 w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors text-xs font-bold">×</button>
                    <div className="flex flex-col items-center text-center mt-2">
                      <div className="w-16 h-16 rounded-full bg-slate-100 overflow-hidden mb-3 border border-slate-200">
                        <img src={v.user?.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${v.businessName}`} alt={v.businessName} />
                      </div>
                      <h3 className="font-black text-lg text-slate-900 line-clamp-1">{v.businessName}</h3>
                      <div className="flex items-center gap-1 text-sm font-bold mt-1">
                        <Star size={14} className="text-amber-400 fill-amber-400" />
                        <span className="text-slate-700">{v.ratings?.avg || "4.8"}</span>
                        <span className="text-slate-400">({v.ratings?.count || 0})</span>
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Verification</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100 font-medium text-slate-600">
                    {v.user?.verified ? (
                      <span className="flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 size={16} /> Verified</span>
                    ) : (
                      <span className="text-slate-400">Unverified</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Category</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100 font-bold text-slate-900">{v.category}</td>
                ))}
              </tr>
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Location</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100 font-medium text-slate-600">{v.location}</td>
                ))}
              </tr>
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Starting Price</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100 font-black text-slate-900 text-lg">₹{v.pricingMin?.toLocaleString() || "0"}</td>
                ))}
              </tr>
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Response Time</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100 font-medium text-slate-600">{v.responseTime}</td>
                ))}
              </tr>
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Specialties</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100">
                    <div className="flex flex-wrap gap-2">
                      {v.services?.slice(0,3).map((s: any, i: number) => (
                        <span key={i} className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-bold whitespace-nowrap">{s.name || s}</span>
                      ))}
                      {(!v.services || v.services.length === 0) && <span className="text-slate-400">—</span>}
                    </div>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="bg-slate-50 p-6 font-bold text-slate-700">Action</td>
                {vendors.map(v => (
                  <td key={v.userId} className="p-6 border-l border-slate-100">
                    <div className="flex flex-col gap-2">
                      <button onClick={() => navigate(`/vendor/${v.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)} className="w-full bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold py-2 rounded-lg transition-colors">View Profile</button>
                      <button onClick={() => navigate("/post-requirement")} className="w-full bg-indigo-600 text-white hover:bg-indigo-700 font-bold py-2 rounded-lg shadow-sm transition-colors">Get Quote</button>
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
