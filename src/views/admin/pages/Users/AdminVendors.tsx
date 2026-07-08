import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminApi } from '../../hooks/useAdminApi';
import { Search, Filter, Users, MapPin, Folder, Calendar } from 'lucide-react';

export function AdminVendors() {
  const navigate = useNavigate();
  const api = useAdminApi();
  const [vendors, setVendors] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      api.getVendors()
         .then((res: any) => {
           setVendors(res.items || []);
           setLoading(false);
         })
         .catch((err: any) => {
           console.error(err);
           setLoading(false);
         });
    };

    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  const filteredVendors = useMemo(() => {
    if (!searchQuery) return vendors;
    const lowerQ = searchQuery.toLowerCase();
    return vendors.filter(v => 
      (v.companyName || v.businessName || "").toLowerCase().includes(lowerQ) ||
      (v.user?.email || "").toLowerCase().includes(lowerQ)
    );
  }, [vendors, searchQuery]);

  return (
    <div className="flex flex-col min-h-full bg-slate-50/50 pb-20 md:pb-8">
      
      {/* Sticky Search & Filter Bar */}
      <div className="sticky top-[104px] z-40 bg-slate-50/80 backdrop-blur-md px-4 py-3 md:px-8 border-b border-slate-200 shadow-sm flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input
            type="text"
            inputMode="search"
            placeholder="Search company name, email..."
            className="w-full pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-full text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none shadow-sm transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="flex items-center justify-center h-11 w-11 shrink-0 bg-white border border-slate-200 text-slate-600 rounded-full hover:bg-slate-50 hover:text-indigo-600 focus:ring-2 focus:ring-indigo-500 active:scale-95 transition-all shadow-sm">
          <Filter size={18} />
        </button>
      </div>

      <div className="px-4 py-6 md:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl md:text-2xl font-black text-slate-900">Vendors ({filteredVendors.length})</h1>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="font-medium">Loading vendors...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm">
            <Users className="h-16 w-16 text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-900">No vendors found</h3>
            <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">
              We couldn't find any vendors matching your search. Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors active:scale-95"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          /* Mobile Card Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredVendors.map((vendor, idx) => {
              const name = vendor.companyName || vendor.businessName || "Unknown Vendor";
              const initials = name.substring(0, 2).toUpperCase();
              const isVerified = vendor.verificationStatus?.toLowerCase() === 'approved' || vendor.user?.verified;
              
              return (
                <div key={vendor.id || idx} className="bg-white rounded-xl border border-slate-200 p-4 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow">
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="h-12 w-12 shrink-0 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-black text-lg">
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 text-base truncate">{name}</h3>
                        <p className="text-sm text-slate-500 truncate">{vendor.user?.email || "No email provided"}</p>
                      </div>
                    </div>
                    <span className={`shrink-0 px-2.5 py-1 text-[10px] font-black uppercase rounded-lg border ${
                      isVerified 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isVerified ? "Verified" : vendor.verificationStatus || "Pending"}
                    </span>
                  </div>
                  
                  {/* Card Details */}
                  <div className="flex flex-wrap gap-x-3 gap-y-2 text-xs font-medium text-slate-500 bg-slate-50 p-3 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <MapPin size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{vendor.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <Folder size={14} className="text-slate-400 shrink-0" />
                      <span className="truncate">{vendor.category || "General Services"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 w-full sm:w-auto">
                      <Calendar size={14} className="text-slate-400 shrink-0" />
                      <span>{vendor.joinedAt ? new Date(vendor.joinedAt).toLocaleDateString() : "New"}</span>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 pt-1">
                    <button 
                      onClick={() => navigate(`/vendor/${vendor.businessName ? vendor.businessName.toLowerCase().replace(/\s+/g, '-') : vendor.userId}`)}
                      className="flex-1 h-11 flex items-center justify-center bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold text-sm rounded-lg border border-slate-200 active:scale-[0.98] transition-all">
                      Details
                    </button>
                    <button 
                      onClick={() => navigate('/admin/audit-log')}
                      className="flex-1 h-11 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-lg shadow-sm shadow-indigo-200 active:scale-[0.98] transition-all">
                      Audit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
