import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Sparkles, MapPin, ShieldCheck } from "lucide-react";

interface SimilarVendor {
  id: string;
  businessName: string;
  category: string;
  location: string;
  avatar: string;
  verified: boolean;
  affinityScore: number;
}

export default function SimilarVendorsWidget({ vendorId }: { vendorId: string }) {
  const [vendors, setVendors] = useState<SimilarVendor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/vendors/${vendorId}/similar`)
      .then(r => r.json())
      .then(d => {
        setVendors(d.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [vendorId]);

  if (loading) {
    return (
      <div className="py-12 border-t border-slate-200 mt-12 text-center text-slate-500 font-bold">
        Loading recommendations...
      </div>
    );
  }

  if (vendors.length === 0) return null;

  return (
    <div className="py-12 border-t border-slate-200 mt-12">
      <div className="flex items-center gap-2 mb-6">
        <Sparkles className="text-indigo-600" size={24} />
        <h2 className="text-2xl font-black text-slate-900">Similar Vendors You Might Like</h2>
      </div>
      <p className="text-slate-500 mb-8 max-w-2xl text-sm">
        Our AI matching engine found these vendors based on their service offerings, location, and past performance.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {vendors.map((vendor) => (
          <Link 
            key={vendor.id} 
            to={`/vendors/${vendor.id}`}
            className="group bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all flex flex-col items-center text-center relative overflow-hidden"
          >
            <div className="absolute top-4 right-4 bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
              {vendor.affinityScore}% Match
            </div>
            
            <img 
              src={vendor.avatar} 
              alt={vendor.businessName} 
              className="w-20 h-20 rounded-full object-cover shadow-md mb-4 group-hover:scale-105 transition-transform" 
            />
            
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <h3 className="font-bold text-lg text-slate-900">{vendor.businessName}</h3>
              {vendor.verified && <ShieldCheck size={16} className="text-emerald-500" />}
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-2 text-xs font-medium text-slate-500 mt-2">
              <span className="bg-slate-100 px-2 py-1 rounded-md">{vendor.category}</span>
              <span className="flex items-center gap-1 bg-slate-100 px-2 py-1 rounded-md">
                <MapPin size={12} /> {vendor.location}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
