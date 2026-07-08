import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, SlidersHorizontal, MapPin, Star, Zap, ShieldCheck, 
  Grid, List as ListIcon, ChevronDown, Check, Building2, PaintRoller, Laptop, Heart
} from "lucide-react";

// Mock debounce
const useDebounce = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

// Memoized Vendor Card Component to prevent unnecessary re-renders when compare array or other state changes
const VendorCard = React.memo(({ 
  vendor, 
  i, 
  viewMode, 
  querySort, 
  isCompared, 
  onToggleCompare 
}: { 
  vendor: any; 
  i: number; 
  viewMode: string; 
  querySort: string; 
  isCompared: boolean; 
  onToggleCompare: (id: string) => void 
}) => (
  <motion.div 
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.05 }}
    className={`bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all overflow-hidden flex ${viewMode === "list" ? "flex-col sm:flex-row" : "flex-col"}`}
  >
    {/* Header/Cover */}
    <div className={`${viewMode === "list" ? "w-full sm:w-48 shrink-0 border-r border-slate-100" : "w-full border-b border-slate-100"} p-6 bg-slate-50 flex flex-col justify-center items-center relative`}>
      <button className="absolute top-4 right-4 text-slate-400 hover:text-rose-500 transition-colors">
        <Heart size={20} />
      </button>
      <label className="absolute top-4 left-4 flex items-center gap-2 cursor-pointer group bg-white/80 backdrop-blur-sm p-1.5 rounded-lg border border-slate-200 shadow-sm hover:border-indigo-400 transition-all">
        <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded border-slate-300 group-hover:border-indigo-500 bg-white">
          <input 
            type="checkbox" 
            checked={isCompared}
            onChange={() => onToggleCompare(vendor.id)}
            className="peer opacity-0 absolute inset-0 cursor-pointer"
          />
          <Check size={14} className="text-white bg-indigo-600 rounded-sm absolute inset-0 hidden peer-checked:block pointer-events-none" />
        </div>
        <span className="text-xs font-bold text-slate-600">Compare</span>
      </label>

      <img src={vendor.logo} alt={vendor.businessName} loading="lazy" decoding="async" className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-white mt-4" />
      {querySort === "best_match" && vendor.matchScore && (
        <div className="mt-4 px-3 py-1 bg-gradient-to-r from-orange-400 to-amber-500 text-white text-xs font-black rounded-full shadow-sm">
          🔥 {vendor.matchScore}% Match
        </div>
      )}
    </div>
    
    {/* Body */}
    <div className="p-6 flex-1 flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{vendor.businessName}</h3>
          <div className="flex items-center gap-1.5 text-sm font-medium mt-1">
            <Star size={14} className="text-amber-400 fill-amber-400" />
            <span className="text-slate-900">{vendor.rating}</span>
            <span className="text-slate-400">({vendor.reviewCount} reviews)</span>
          </div>
        </div>
      </div>
      
      <div className="flex flex-wrap items-center gap-3 mb-4 text-xs font-semibold">
        {vendor.verified && (
          <span className={`flex items-center gap-1 ${vendor.premium ? "text-indigo-600 bg-indigo-50" : "text-emerald-600 bg-emerald-50"} px-2 py-1 rounded-md`}>
            <ShieldCheck size={14} /> {vendor.premium ? "Premium Verified" : "Verified"}
          </span>
        )}
        <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
          <MapPin size={14} /> {vendor.location}
        </span>
      </div>

      {viewMode === "list" && (
        <p className="text-slate-500 text-sm mb-4 line-clamp-2">
          Specialized in {vendor.category} providing highly professional services. With an excellent track record of client satisfaction and timely delivery.
        </p>
      )}

      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
        <div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Starting From</span>
          <span className="text-lg font-black text-slate-900">₹{vendor.startingPrice.toLocaleString()}</span>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">Responds In</span>
          <span className="text-sm font-bold text-slate-700 flex items-center justify-end gap-1">
            <Zap size={14} className="text-amber-400" /> {vendor.responseTime || "2 hours"}
          </span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 mt-6">
        <Link to={`/vendor/${vendor.slug}`} className="flex-1 text-center py-3 sm:py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl transition-colors">
          View Profile
        </Link>
        <Link to="/post-requirement" className="flex-1 text-center flex items-center justify-center py-3 sm:py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/25 transition-colors">
          Get Quote
        </Link>
      </div>
    </div>
  </motion.div>
));

export default function VendorDiscovery() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // State for facets and results
  const [facets, setFacets] = useState({ categories: [], locations: [] });
  const [vendors, setVendors] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // State for Filters
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Read URL params
  const queryQ = searchParams.get("search") || "";
  const queryCat = searchParams.get("category") || "";
  const queryLoc = searchParams.get("location") || "";
  const querySort = searchParams.get("sort") || "best_match";
  const queryMinRating = searchParams.get("minRating") || "";
  const queryResponseTime = searchParams.get("responseTime") || "";
  const queryVerified = searchParams.get("verifiedOnly") === "true";

  const [localQ, setLocalQ] = useState(queryQ);
  const debouncedQ = useDebounce(localQ, 500);

  // Fetch Facets once
  useEffect(() => {
    fetch("/api/vendors/facets").then(r => r.json()).then(setFacets).catch(console.error);
  }, []);

  // Fetch Vendors
  const fetchVendors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (debouncedQ) params.append("q", debouncedQ);
    if (queryCat) params.append("category", queryCat);
    if (queryLoc) params.append("location", queryLoc);
    if (querySort) params.append("sort", querySort);
    if (queryMinRating) params.append("minRating", queryMinRating);
    if (queryResponseTime) params.append("responseTime", queryResponseTime);
    if (queryVerified) params.append("verifiedOnly", "true");
    
    try {
      const res = await fetch(`/api/vendors/search?${params.toString()}`);
      const data = await res.json();
      setVendors(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [debouncedQ, queryCat, queryLoc, querySort, queryMinRating, queryResponseTime, queryVerified]);

  useEffect(() => {
    fetchVendors();
  }, [fetchVendors]);

  // Update URL helpers
  const updateFilter = (key: string, value: string | boolean | null) => {
    const next = new URLSearchParams(searchParams);
    if (value === null || value === false || value === "") {
      next.delete(key);
    } else {
      next.set(key, String(value));
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setLocalQ("");
    setSearchParams(new URLSearchParams());
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilter("search", localQ);
  };

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= 3) {
        alert("You can only compare up to 3 vendors at a time.");
        return prev;
      }
      return [...prev, id];
    });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      
      {/* HEADER / SEARCH BAR (Sticky) */}
      <div className="sticky top-16 z-40 bg-white border-b border-slate-200 shadow-sm py-4">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="What service do you need?"
              value={localQ}
              onChange={(e) => setLocalQ(e.target.value)}
              className="w-full bg-slate-100 border border-transparent focus:border-indigo-300 focus:bg-white rounded-xl py-3 pl-12 pr-4 outline-none font-medium text-slate-900 transition-all"
            />
          </form>
          
          <div className="flex w-full md:w-auto items-center gap-3">
            <select 
              className="bg-slate-100 border-none rounded-xl py-3 px-4 outline-none font-medium text-slate-700 cursor-pointer flex-1 md:w-48 appearance-none"
              value={queryLoc}
              onChange={(e) => updateFilter("location", e.target.value)}
            >
              <option value="">All Locations</option>
              {facets.locations.map((l: any) => (
                <option key={l.name} value={l.name}>{l.name}</option>
              ))}
            </select>
            
            <button 
              className="md:hidden p-3 bg-slate-100 rounded-xl text-slate-700 hover:bg-slate-200 transition-colors"
              onClick={() => setShowMobileFilters(true)}
            >
              <SlidersHorizontal size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8 w-full">
        
        {/* SIDEBAR FILTERS (Desktop) */}
        <div className={`fixed inset-0 z-50 bg-white md:bg-transparent md:static md:w-64 md:block flex-shrink-0 ${showMobileFilters ? "block" : "hidden"}`}>
          <div className="p-4 border-b border-slate-200 md:hidden flex justify-between items-center">
            <h2 className="font-bold text-lg">Filters</h2>
            <button onClick={() => setShowMobileFilters(false)} className="text-slate-500 hover:text-slate-900 font-bold">Close</button>
          </div>
          
          <div className="p-4 md:p-0 space-y-8 overflow-y-auto h-full md:h-auto pb-24">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-slate-900">Filters</h3>
              {(queryCat || queryMinRating || queryResponseTime || queryVerified || localQ) && (
                <button onClick={clearFilters} className="text-sm text-indigo-600 font-bold hover:underline">Reset All</button>
              )}
            </div>

            {/* Category */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Category</h4>
              <div className="space-y-2">
                {facets.categories.map((c: any) => (
                  <label key={c.name} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded border-slate-300 group-hover:border-indigo-500 bg-white">
                      <input 
                        type="checkbox" 
                        checked={queryCat === c.name}
                        onChange={() => updateFilter("category", queryCat === c.name ? null : c.name)}
                        className="peer opacity-0 absolute inset-0 cursor-pointer"
                      />
                      <Check size={14} className="text-white bg-indigo-600 rounded-sm absolute inset-0 hidden peer-checked:block pointer-events-none" />
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 font-medium text-sm flex-1">{c.name}</span>
                    <span className="text-xs text-slate-400">({c.count})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Rating</h4>
              <div className="space-y-2">
                {[4, 3].map((r) => (
                  <label key={r} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded border-slate-300 group-hover:border-indigo-500 bg-white">
                      <input 
                        type="checkbox" 
                        checked={queryMinRating === String(r)}
                        onChange={() => updateFilter("minRating", queryMinRating === String(r) ? null : String(r))}
                        className="peer opacity-0 absolute inset-0 cursor-pointer"
                      />
                      <Check size={14} className="text-white bg-indigo-600 rounded-sm absolute inset-0 hidden peer-checked:block pointer-events-none" />
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 font-medium text-sm flex items-center gap-1">
                      {Array.from({length: r}).map((_, i) => <Star key={i} size={14} className="text-amber-400 fill-amber-400" />)}
                      {Array.from({length: 5-r}).map((_, i) => <Star key={i} size={14} className="text-slate-300" />)}
                      & Up
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Response Time */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Response Time</h4>
              <div className="space-y-2">
                {["1 hour", "4 hours", "24 hours"].map((t) => (
                  <label key={t} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded border-slate-300 group-hover:border-indigo-500 bg-white">
                      <input 
                        type="checkbox" 
                        checked={queryResponseTime === t}
                        onChange={() => updateFilter("responseTime", queryResponseTime === t ? null : t)}
                        className="peer opacity-0 absolute inset-0 cursor-pointer"
                      />
                      <Check size={14} className="text-white bg-indigo-600 rounded-sm absolute inset-0 hidden peer-checked:block pointer-events-none" />
                    </div>
                    <span className="text-slate-600 group-hover:text-slate-900 font-medium text-sm">&lt; {t}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Verification */}
            <div>
              <h4 className="font-semibold text-slate-800 mb-3 text-sm uppercase tracking-wide">Trust & Verification</h4>
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center justify-center w-5 h-5 border-2 rounded border-slate-300 group-hover:border-indigo-500 bg-white">
                  <input 
                    type="checkbox" 
                    checked={queryVerified}
                    onChange={(e) => updateFilter("verifiedOnly", e.target.checked)}
                    className="peer opacity-0 absolute inset-0 cursor-pointer"
                  />
                  <Check size={14} className="text-white bg-indigo-600 rounded-sm absolute inset-0 hidden peer-checked:block pointer-events-none" />
                </div>
                <span className="text-slate-600 group-hover:text-slate-900 font-medium text-sm">Verified Providers Only</span>
              </label>
            </div>

          </div>
        </div>

        {/* RESULTS AREA */}
        <div className="flex-1 min-w-0">
          
          {/* Results Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-lg text-slate-700 font-medium">
              Showing <span className="font-bold text-slate-900">{total}</span> vendors
              {queryQ && <span> for "<span className="text-slate-900 font-bold">{queryQ}</span>"</span>}
              {queryCat && <span> in <span className="text-slate-900 font-bold">{queryCat}</span></span>}
              {queryLoc && <span> located in <span className="text-slate-900 font-bold">{queryLoc}</span></span>}
            </h1>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-slate-500">Sort:</span>
                <select 
                  className="bg-transparent border-none text-slate-900 font-bold outline-none cursor-pointer"
                  value={querySort}
                  onChange={(e) => updateFilter("sort", e.target.value)}
                >
                  <option value="best_match">Best Match</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price_asc">Lowest Price</option>
                </select>
              </div>
              
              <div className="hidden sm:flex items-center bg-slate-200 p-1 rounded-lg">
                <button 
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <Grid size={18} />
                </button>
                <button 
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-500 hover:text-slate-700"}`}
                >
                  <ListIcon size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Vendors Loading / Empty State */}
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="h-8 w-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : vendors.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">No vendors found</h3>
              <p className="text-slate-500 mb-6">Try adjusting your filters or search terms to find more results.</p>
              <button onClick={clearFilters} className="bg-indigo-50 text-indigo-700 font-bold px-6 py-2 rounded-lg hover:bg-indigo-100">
                Clear Filters
              </button>
            </div>
          ) : (
            /* Vendors Grid / List */
            <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
              <AnimatePresence>
                {vendors.map((vendor, i) => (
                  <VendorCard 
                    key={vendor.id}
                    vendor={vendor}
                    i={i}
                    viewMode={viewMode}
                    querySort={querySort}
                    isCompared={compareIds.includes(vendor.id)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}

          {/* Pagination Dummy */}
          {!loading && vendors.length > 0 && (
            <div className="mt-12 flex justify-center gap-2">
              <button className="px-4 py-2 border border-slate-200 bg-white text-slate-500 rounded-lg hover:bg-slate-50 font-medium cursor-not-allowed">Prev</button>
              <button className="px-4 py-2 border border-indigo-600 bg-indigo-600 text-white rounded-lg font-bold shadow-sm">1</button>
              <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 font-medium">2</button>
              <button className="px-4 py-2 border border-slate-200 bg-white text-slate-700 rounded-lg hover:bg-slate-50 font-medium">3</button>
              <span className="px-4 py-2 text-slate-400">...</span>
              <button className="px-4 py-2 border border-slate-200 bg-white text-slate-500 rounded-lg hover:bg-slate-50 font-medium">Next</button>
            </div>
          )}

        </div>
      </div>

      {/* Floating Compare Button */}
      <AnimatePresence>
        {compareIds.length > 0 && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 z-50 bg-white rounded-full shadow-2xl border border-slate-200 p-2 flex items-center gap-4 pr-6 w-[90%] md:w-auto overflow-hidden"
          >
            <div className="flex -space-x-3 ml-2">
              {compareIds.map(id => {
                const v = vendors.find(vend => vend.id === id);
                return v ? (
                  <img key={id} src={v.logo} alt={v.businessName} loading="lazy" decoding="async" className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover bg-slate-100" />
                ) : <div key={id} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200" />;
              })}
            </div>
            <div className="font-bold text-slate-700">{compareIds.length} Selected</div>
            <button 
              disabled={compareIds.length < 2}
              onClick={() => navigate(`/compare?vendorIds=${compareIds.join(",")}`)} 
              className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-full font-bold shadow-md transition-colors"
            >
              Compare
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
