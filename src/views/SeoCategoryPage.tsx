import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Star, ShieldCheck, MapPin, Zap } from "lucide-react";

export default function SeoCategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  // e.g., "web-developers-in-bangalore"
  // We need to parse category and city. The pattern is `/:category-in-:city`.
  // Wait, React Router matching might just give us `slug` if we set the path as `/:slug`.
  // Let's parse it safely:
  
  const [category, setCategory] = useState("Professionals");
  const [city, setCity] = useState("your city");
  const [stats, setStats] = useState<any>(null);
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    
    // Parse slug: e.g., "software-development-in-bangalore"
    const match = slug.match(/^(.*)-in-(.*)$/);
    let parsedCat = "Professionals";
    let parsedCity = "your area";

    if (match) {
      parsedCat = match[1].split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      parsedCity = match[2].split("-").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
      setCategory(parsedCat);
      setCity(parsedCity);
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [statsRes, vendorsRes] = await Promise.all([
          fetch(`/api/public/seo-stats?category=${match ? match[1] : ""}&city=${match ? match[2] : ""}`),
          fetch(`/api/vendors/search?category=${match ? match[1].replace(/-/g, ' ') : ""}&location=${match ? match[2] : ""}&limit=20`)
        ]);

        const statsData = await statsRes.json();
        const vendorsData = await vendorsRes.json();

        setStats(statsData);
        setVendors(vendorsData.items || []);
      } catch (e) {
        console.error("Failed to fetch SEO data", e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center font-bold text-slate-500">Loading {category} in {city}...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Helmet>
        <title>Top {category} in {city} – Verified List | VendorMatch</title>
        <meta name="description" content={`Find the best ${category} in ${city}. Compare ratings, portfolios, and response times. Post your requirement for free.`} />
      </Helmet>

      {/* Hero Section */}
      <div className="bg-slate-900 text-white pt-20 pb-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            Top {category} in {city}
          </h1>
          <p className="text-xl text-slate-300 font-medium mb-10 max-w-2xl mx-auto">
            Find trusted, verified {category.toLowerCase()} companies in {city}.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link to="/post-requirement" className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors w-full sm:w-auto shadow-lg shadow-indigo-500/30">
              Post a Requirement
            </Link>
            <Link to="/vendors" className="bg-white/10 hover:bg-white/20 text-white font-bold py-4 px-8 rounded-xl text-lg transition-colors w-full sm:w-auto backdrop-blur-sm">
              Browse all categories
            </Link>
          </div>
        </div>
      </div>

      {/* SEO Rich Content Bar */}
      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-100 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Why choose our verified vendors?</h2>
            <p className="text-slate-500 mt-1">There are {stats?.vendorCount || 0} {category.toLowerCase()} available in {city}. The average rating is {stats?.avgRating || 4.8}. The typical project cost ranges from {stats?.priceRange || "₹50k to ₹2L"}.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-4 border-r border-slate-200">
              <span className="block text-2xl font-black text-indigo-600">{stats?.vendorCount || 0}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Providers</span>
            </div>
            <div className="text-center px-4">
              <span className="block text-2xl font-black text-indigo-600">{stats?.avgRating || "4.8"}/5</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      {/* Vendors List */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-slate-900 mb-8">Verified Providers</h2>
        
        {vendors.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
             <h3 className="text-xl font-bold text-slate-900 mb-2">No vendors found in this category/city combination yet.</h3>
             <Link to="/vendors" className="text-indigo-600 font-bold hover:underline">Explore all vendors globally.</Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {vendors.map(vendor => (
              <Link to={`/vendor/${vendor.slug || vendor.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`} key={vendor.id} className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all overflow-hidden flex flex-col group">
                <div className="p-6 bg-slate-50 border-b border-slate-100 flex flex-col items-center">
                  <img src={vendor.logo} alt={vendor.businessName} className="w-20 h-20 rounded-2xl object-cover shadow-sm bg-white" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-center mb-1">{vendor.businessName}</h3>
                  <div className="flex items-center justify-center gap-1.5 text-sm font-medium mb-4">
                    <Star size={14} className="text-amber-400 fill-amber-400" />
                    <span className="text-slate-900">{vendor.rating}</span>
                    <span className="text-slate-400">({vendor.reviewCount} reviews)</span>
                  </div>
                  
                  <div className="flex flex-wrap items-center justify-center gap-2 mb-4 text-xs font-semibold">
                    {vendor.verified && (
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                        <ShieldCheck size={14} /> Verified
                      </span>
                    )}
                    <span className="flex items-center gap-1 text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                      <MapPin size={14} /> {vendor.location}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                    <span className="font-black text-slate-900">₹{vendor.startingPrice?.toLocaleString()}</span>
                    <span className="text-sm font-bold text-slate-500 flex items-center gap-1">
                      <Zap size={14} className="text-amber-400" /> {vendor.responseTime || "2 hours"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Internal Linking / Related Categories */}
      <div className="bg-white border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-8">Related Searches in {city}</h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to={`/software-development-in-${city.toLowerCase()}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full transition-colors">Software Development in {city}</Link>
            <Link to={`/digital-marketing-in-${city.toLowerCase()}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full transition-colors">Digital Marketing in {city}</Link>
            <Link to={`/seo-services-in-${city.toLowerCase()}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full transition-colors">SEO Services in {city}</Link>
            <Link to={`/interior-design-in-${city.toLowerCase()}`} className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-6 py-3 rounded-full transition-colors">Interior Design in {city}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
