import React, { useState, useEffect, useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { User } from "../../types";
import CheckoutModal from "../../components/CheckoutModal";
import { Download, ShieldCheck, FileText, Star, TrendingUp, Clock, CheckCircle, Search, Filter, Plus, ArrowRight, Activity, MapPin, XCircle, ChevronRight, User as UserIcon, Bell, Lock, HelpCircle, LogOut, FileCheck, DollarSign, Wallet, Briefcase, Bookmark, MessageSquare, CreditCard } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";

export function BuyerOverview() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      fetch(`/api/dashboards/buyer/stats?userId=${currentUser.id}`)
        .then(r => r.json())
        .then(setStats)
        .catch(console.error);
    };

    loadData();

    window.addEventListener("dashboard_refresh", loadData);
    return () => window.removeEventListener("dashboard_refresh", loadData);
  }, [currentUser.id]);

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-900 flex items-center gap-2">
            Hello, {currentUser.name.split(' ')[0]} 👋
          </h1>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Here's your marketplace summary.</p>
        </div>
        <div className="grid grid-cols-2 md:flex gap-3 w-full md:w-auto mt-4 md:mt-0">
          <Button onClick={() => navigate("/vendors")} variant="outline" className="w-full md:w-auto h-12 gap-2 text-sm shadow-sm rounded-xl">
            <Search size={18} /> Browse
          </Button>
          <Button onClick={() => navigate("/post-requirement")} className="w-full md:w-auto h-12 gap-2 text-sm shadow-sm rounded-xl">
            <Plus size={18} /> Post Req
          </Button>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
        <Card onClick={() => navigate("/buyer/projects")} className="p-4 md:p-6 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-indigo-50 text-indigo-600 rounded-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors"><Briefcase size={20} className="md:w-6 md:h-6" /></div>
            <Badge variant="secondary" className="hidden sm:flex text-emerald-600 bg-emerald-50 hover:bg-emerald-50"><TrendingUp size={12} className="mr-1" /> +2 this month</Badge>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Active Projects</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">{stats?.activeProjects || 0}</p>
          </div>
        </Card>
        
        <Card onClick={() => navigate("/buyer/requirements")} className="p-4 md:p-6 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-500 group-hover:text-white transition-colors"><FileCheck size={20} className="md:w-6 md:h-6" /></div>
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 shrink-0">Action Req.</Badge>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Pending Quotes</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">{stats?.pendingQuotes || 0}</p>
          </div>
        </Card>
        
        <Card onClick={() => navigate("/buyer/shortlist")} className="col-span-2 lg:col-span-1 p-4 md:p-6 hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-emerald-50 text-emerald-600 rounded-xl group-hover:bg-emerald-500 group-hover:text-white transition-colors"><Bookmark size={20} className="md:w-6 md:h-6" /></div>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Saved Vendors</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">{stats?.savedVendors || 0}</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Column */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Recent Requirements */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base md:text-lg font-bold text-slate-900">Recent Requirements</h2>
              <button onClick={() => navigate("/buyer/requirements")} className="text-indigo-600 font-bold text-xs md:text-sm hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">View All <ArrowRight size={14} /></button>
            </div>
            
            <div className="space-y-3">
              <div className="text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200 shadow-sm">No recent requirements posted.</div>
            </div>
          </div>

          {/* Recommended Vendors */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-amber-500 fill-amber-500" size={20} />
              <h2 className="text-lg font-bold text-slate-900">AI Recommended Vendors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2 text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200 shadow-sm">No vendors recommended yet.</div>
            </div>
          </div>
          
        </div>

        {/* Sidebar Column */}
        <div className="space-y-8">
          <Card className="p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><Activity size={20} className="text-indigo-600" /> Recent Activity</h2>
            
            <div className="text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200">No recent activity.</div>
            
            <Button variant="secondary" className="w-full mt-6">View All Activity</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function BuyerRequirements() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const navigate = useNavigate();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedReqs, setSelectedReqs] = useState<string[]>([]);
  const [viewReq, setViewReq] = useState<any | null>(null);

  useEffect(() => {
    fetch(`/api/buyer/requirements?userId=${currentUser.id}`)
      .then(r => r.json())
      .then(d => setRequirements(d || []))
      .catch(console.error);
  }, [currentUser.id]);

  const filteredReqs = requirements.filter(r => {
    const matchSearch = r.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "all" || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const toggleSelect = (id: string) => {
    setSelectedReqs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedReqs.length === filteredReqs.length) setSelectedReqs([]);
    else setSelectedReqs(filteredReqs.map(r => r.id));
  };

  const parentRef = useRef<HTMLDivElement>(null);
  const rowVirtualizer = useVirtualizer({
    count: filteredReqs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 140, // estimated card height + gap
    overscan: 5,
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Requirements</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your RFPs and evaluate incoming quotes.</p>
        </div>
        <Button onClick={() => navigate("/post-requirement")} className="w-full md:w-auto px-4 py-2 rounded-xl">
          <Plus size={18} className="mr-2" /> Post New Requirement
        </Button>
      </div>

      {/* Filters and Actions Bar */}
      <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm mb-6 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search requirements..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 appearance-none focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="awarded">Awarded</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {selectedReqs.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 animate-in slide-in-from-right-4 w-full lg:w-auto">
            <span className="text-sm font-bold text-indigo-600">{selectedReqs.length} selected</span>
            <button className="px-3 py-1.5 bg-rose-50 text-rose-600 text-sm font-bold rounded-lg border border-rose-200 hover:bg-rose-100 transition-colors">Cancel</button>
            <button className="px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-bold rounded-lg border border-indigo-200 hover:bg-indigo-100 transition-colors">Repost</button>
            <button className="px-3 py-1.5 bg-slate-50 text-slate-600 text-sm font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">Archive</button>
          </div>
        )}
      </div>
      
      {/* Virtualized Cards List */}
      <div 
        ref={parentRef} 
        className="w-full h-[600px] overflow-y-auto pr-2 custom-scrollbar"
      >
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: '100%',
            position: 'relative',
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => {
            const req = filteredReqs[virtualRow.index];
            return (
              <div
                key={req.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                  paddingBottom: '16px' // Gap between cards
                }}
              >
                <Card className="p-5 hover:border-indigo-300 transition-colors shadow-sm h-full flex flex-col justify-between">
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-3 w-full">
                      <div className="mt-1">
                        <input type="checkbox" className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4 cursor-pointer"
                          checked={selectedReqs.includes(req.id)}
                          onChange={() => toggleSelect(req.id)}
                        />
                      </div>
                      <div className="flex-1 cursor-pointer" onClick={() => setViewReq(req)}>
                        <h3 className="font-bold text-lg text-slate-900 hover:text-indigo-600 transition-colors line-clamp-1">{req.title}</h3>
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <Badge variant="secondary" className="font-medium text-xs">
                            {req.category || 'General'}
                          </Badge>
                          <span className="text-slate-300">•</span>
                          <span className="text-xs text-slate-500 font-medium flex items-center gap-1">
                            <Clock size={12} /> Posted {new Date(req.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end shrink-0 gap-2 w-full md:w-auto border-t border-slate-100 md:border-t-0 pt-4 md:pt-0">
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-slate-700 text-sm bg-slate-50 px-2 py-1 rounded-md">
                          ₹{req.budgetMin.toLocaleString()} - ₹{req.budgetMax.toLocaleString()}
                        </span>
                        <Badge 
                          variant="outline" 
                          className={`uppercase tracking-wider ${
                            req.status === 'open' ? 'text-amber-600 border-amber-200 bg-amber-50' : 
                            req.status === 'awarded' ? 'text-emerald-600 border-emerald-200 bg-emerald-50' : 'text-slate-500 border-slate-200 bg-slate-50'
                          }`}
                        >
                          {req.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs">
                        {req._count?.proposals || 0}
                      </span>
                      <span className="text-xs font-bold text-slate-500">Quotes Received</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => setViewReq(req)}>
                        Details
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => navigate(`/${currentUser.role.toLowerCase() === 'vendor' ? 'vendor' : 'buyer'}/requirements/${req.id}/quotes`)}>
                        Compare
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            );
          })}
          {filteredReqs.length === 0 && (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <FileText size={32} className="text-slate-300" />
              </div>
              <p className="text-slate-500 font-bold mb-2">No requirements found</p>
              <p className="text-slate-400 text-sm mb-4">Try adjusting your filters or post a new one.</p>
            </div>
          )}
        </div>
      </div>

      {/* Requirement Detail Modal */}
      {viewReq && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setViewReq(null)}
        >
          <div
            className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 border border-slate-100 dark:border-slate-800"
            role="dialog"
            aria-modal="true"
            aria-labelledby="requirement-title"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={() => setViewReq(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500"
              aria-label="Close details"
            >
              <XCircle size={24} aria-hidden="true" />
            </button>

            {/* Header */}
            <div className="mb-6 pr-8">
              <Badge 
                variant="outline" 
                className={`uppercase tracking-wider mb-3 ${
                  viewReq.status === 'open' ? 'text-amber-600 border-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:border-amber-800/50 dark:text-amber-400' : 
                  viewReq.status === 'awarded' ? 'text-emerald-600 border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800/50 dark:text-emerald-400' : 
                  'text-slate-500 border-slate-200 bg-slate-50 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
                }`}
              >
                {viewReq.status}
              </Badge>
              <h2 id="requirement-title" className="text-2xl font-black text-slate-900 dark:text-white">
                {viewReq.title}
              </h2>
            </div>

            {/* Meta Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Budget Range</p>
                <p className="font-bold text-slate-900 dark:text-slate-100">₹{viewReq.budgetMin.toLocaleString()} - ₹{viewReq.budgetMax.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Timeline</p>
                <p className="font-bold text-slate-900 dark:text-slate-100">{viewReq.timelineWeeks} Weeks</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Location Preference</p>
                <p className="font-bold text-slate-900 dark:text-slate-100">{viewReq.locationPreference || "Remote"}</p>
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-1">Category</p>
                <p className="font-bold text-slate-900 dark:text-slate-100">{viewReq.category}</p>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase mb-2">Description</p>
              <div className="prose prose-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                {viewReq.description || "No description provided."}
              </div>
            </div>

            {/* AI Analysis */}
            {viewReq.aiMetadata && (
              <Card className="mb-8 border-indigo-100 dark:border-indigo-900/50 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-none">
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Star size={16} className="text-indigo-600 dark:text-indigo-400 fill-indigo-600 dark:fill-indigo-400" />
                    <span className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">AI Analysis Overview</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {viewReq.aiMetadata.skillsRequired?.map((skill: string, i: number) => (
                      <span key={i}>
                        <Badge variant="outline" className="bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
                          {skill}
                        </Badge>
                      </span>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
              <Button variant="ghost" onClick={() => setViewReq(null)} className="w-full sm:w-auto text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100">
                Close
              </Button>
              <Button 
                onClick={() => {
                  setViewReq(null);
                  navigate(`/${currentUser.role.toLowerCase() === 'vendor' ? 'vendor' : 'buyer'}/requirements/${viewReq.id}/quotes`);
                }} 
                className="w-full sm:w-auto group"
              >
                Review Quotes ({viewReq._count?.proposals || 0}) 
                <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function BuyerShortlist() {
  const navigate = useNavigate();
  const [selectedVendors, setSelectedVendors] = useState<string[]>([]);
  
  // Real Shortlist Data will be fetched here
  const shortlist: any[] = [];

  const toggleSelect = (id: string) => {
    setSelectedVendors(prev => prev.includes(id) ? prev.filter(v => v !== id) : [...prev, id]);
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-20">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Shortlisted Vendors</h1>
          <p className="text-slate-500 font-medium mt-1">Review, compare, and reach out to your saved vendors.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Download size={18} /> Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shortlist.map(vendor => (
          <div key={vendor.id} className={`bg-white border-2 rounded-2xl p-6 shadow-sm transition-all ${selectedVendors.includes(vendor.id) ? 'border-indigo-600 shadow-md' : 'border-slate-200 hover:border-indigo-300'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 text-indigo-700 rounded-xl flex items-center justify-center font-black text-xl">{vendor.name.charAt(0)}</div>
                <div>
                  <h3 className="font-bold text-slate-900">{vendor.name}</h3>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{vendor.category}</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" 
                checked={selectedVendors.includes(vendor.id)}
                onChange={() => toggleSelect(vendor.id)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase mb-1">Rating</p>
                <p className="font-bold text-slate-900 flex items-center gap-1"><Star size={14} className="text-amber-500 fill-amber-500" /> {vendor.rating}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase mb-1">Starting Price</p>
                <p className="font-bold text-slate-900">{vendor.price}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase mb-1">Response Time</p>
                <p className="font-medium text-slate-700">{vendor.responseTime}</p>
              </div>
              <div>
                <p className="text-slate-400 font-bold text-xs uppercase mb-1">Location</p>
                <p className="font-medium text-slate-700">{vendor.location}</p>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-slate-400 font-bold text-xs uppercase mb-1">Private Notes</p>
              <textarea 
                defaultValue={vendor.notes}
                placeholder="Add a private note..."
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                rows={2}
              ></textarea>
            </div>

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium">Last Contacted: <span className="text-slate-700 font-bold">{vendor.lastContacted}</span></p>
              <div className="flex gap-2">
                <button className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Bookmark size={18} className="fill-current text-rose-600" /></button>
                <button className="p-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors font-bold"><MessageSquare size={18} /></button>
              </div>
            </div>
          </div>
        ))}

        {/* Add more vendors card */}
        <div onClick={() => navigate("/vendors")} className="bg-slate-50 border-2 border-dashed border-slate-300 rounded-2xl p-6 flex flex-col items-center justify-center text-slate-500 hover:bg-indigo-50 hover:border-indigo-300 hover:text-indigo-600 transition-colors cursor-pointer min-h-[300px]">
          <Plus size={48} className="mb-4" />
          <p className="font-bold text-lg mb-1">Browse Vendors</p>
          <p className="text-sm font-medium text-center">Find more top-rated vendors to add to your shortlist.</p>
        </div>
      </div>

      {/* Sticky Action Bar */}
      {selectedVendors.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-4 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-8">
          <span className="font-bold">{selectedVendors.length} vendor{selectedVendors.length > 1 ? 's' : ''} selected</span>
          <div className="flex gap-2">
            <button 
              onClick={() => navigate("/compare")}
              className="bg-indigo-500 hover:bg-indigo-400 text-white px-6 py-2 rounded-full font-bold shadow-sm transition-colors"
            >
              Compare Selected
            </button>
            <button onClick={() => setSelectedVendors([])} className="bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full font-bold transition-colors">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 4. Buyer Projects (Active & Completed)
// ----------------------------------------------------
export function BuyerProjects() {
  const [activeTab, setActiveTab] = useState('active');
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processingRelease, setProcessingRelease] = useState<string | null>(null);
  const [disputeModalOpen, setDisputeModalOpen] = useState<string | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [reviewModalOpen, setReviewModalOpen] = useState<string | null>(null);
  const [reviewScore, setReviewScore] = useState(0);

  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const navigate = useNavigate();

  const fetchData = () => {
    fetch(`/api/buyer/projects?userId=${currentUser.id}`)
      .then(r => r.json())
      .then(d => {
        setData({ projects: d.map((p: any) => ({
          id: p.id,
          title: p.title,
          vendorName: p.proposals?.[0]?.vendorProfile?.businessName || "Assigned Vendor",
          milestones: p.ProjectMilestone || [],
          status: p.status === 'awarded' ? 'active' : p.status,
          totalAmount: p.proposals?.[0]?.bidAmount || 0,
          startDate: p.createdAt
        }))});
        setLoading(false);
      })
      .catch(() => {
        setData({ projects: [] });
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleReleaseEscrow = async (milestoneId: string) => {
    if (!window.confirm("Are you sure you want to release funds to the vendor? This action cannot be undone.")) return;
    setProcessingRelease(milestoneId);
    try {
      const buyerId = localStorage.getItem("vendorMatchUserId");
      const res = await fetch("/api/payments/escrow/release", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId, buyerId })
      });
      if (res.ok) fetchData();
      else alert("Failed to release funds");
    } catch(e) {
      alert("Error releasing funds");
    } finally {
      setProcessingRelease(null);
    }
  };

  const submitDispute = async () => {
    if (!disputeReason.trim() || !disputeModalOpen) return;
    try {
      const buyerId = localStorage.getItem("vendorMatchUserId");
      const res = await fetch("/api/admin/v1/disputes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId: disputeModalOpen, reason: disputeReason, raisedById: buyerId })
      });
      if (res.ok) {
        setDisputeModalOpen(null);
        setDisputeReason("");
        alert("Dispute raised successfully. An admin will review it shortly.");
      } else {
        alert("Failed to raise dispute");
      }
    } catch(e) {
      alert("Error raising dispute");
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold">Loading Projects...</p>
    </div>
  );

  const activeProjects = data?.projects.filter((p: any) => p.status === 'active') || [];
  const completedProjects = data?.projects.filter((p: any) => p.status === 'completed') || [];
  const disputedProjects = data?.projects.filter((p: any) => p.status === 'disputed') || [];

  const displayProjects = activeTab === 'active' ? activeProjects : activeTab === 'completed' ? completedProjects : disputedProjects;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Projects & Escrow</h1>
          <p className="text-slate-500 font-medium mt-1">Manage ongoing work, approve milestones, and release payments.</p>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-200 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <button onClick={() => setActiveTab('active')} className={`pb-3 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'active' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
          Active ({activeProjects.length})
        </button>
        <button onClick={() => setActiveTab('completed')} className={`pb-3 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'completed' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
          Completed ({completedProjects.length})
        </button>
        <button onClick={() => setActiveTab('disputed')} className={`pb-3 px-2 font-bold text-sm border-b-2 transition-colors ${activeTab === 'disputed' ? 'text-indigo-600 border-indigo-600' : 'text-slate-500 border-transparent hover:text-slate-700'}`}>
          Disputed ({disputedProjects.length})
        </button>
      </div>
      
      {displayProjects.length === 0 ? (
        <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-16 text-center flex flex-col items-center justify-center">
          <Briefcase size={48} className="text-slate-300 mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">No {activeTab} projects</h3>
          <p className="text-slate-500 max-w-md">You don't have any projects in this status right now. Check your requirements to award quotes.</p>
        </div>
      ) : displayProjects.map((p: any) => (
        <div key={p.id} className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-6 overflow-hidden">
          <div className="bg-slate-50 p-6 border-b border-slate-200 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-black text-slate-900">{p.title}</h2>
                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${activeTab === 'completed' ? 'bg-emerald-100 text-emerald-700' : activeTab === 'disputed' ? 'bg-rose-100 text-rose-700' : 'bg-indigo-100 text-indigo-700'}`}>{p.status}</span>
              </div>
              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                <UserIcon size={14} /> Vendor: <span className="font-bold text-slate-700">{p.vendorName}</span> • Started: {new Date(p.startDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Escrow</p>
              <p className="text-xl font-black text-slate-900">₹{p.totalAmount.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
            {/* Milestones Column */}
            <div className="p-6 lg:col-span-2">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2"><CreditCard size={14} className="text-slate-400" /> Payment Milestones</h3>
              <div className="space-y-4">
                {p.milestones?.length === 0 && <p className="text-sm text-slate-500 italic">No milestones configured for this project.</p>}
                {p.milestones?.map((ms: any) => (
                  <div key={ms.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 gap-4">
                    <div>
                      <h4 className="font-bold text-slate-900 flex items-center gap-2">
                        {ms.status === 'released' ? <CheckCircle size={16} className="text-emerald-500" /> : <Clock size={16} className="text-amber-500" />}
                        {ms.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium">Amount: ₹{ms.amount.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-bold px-3 py-1.5 rounded-lg ${
                        ms.status === 'released' ? 'bg-emerald-100 text-emerald-700' :
                        ms.status === 'active' ? 'bg-indigo-100 text-indigo-700' :
                        'bg-slate-200 text-slate-600'
                      }`}>
                        {ms.status.toUpperCase()}
                      </span>
                      {ms.status === 'active' && activeTab === 'active' && (
                        <button 
                          onClick={() => handleReleaseEscrow(ms.id)}
                          disabled={processingRelease === ms.id}
                          className="text-xs bg-emerald-600 text-white font-bold px-4 py-1.5 rounded-lg shadow-sm hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                          {processingRelease === ms.id ? 'Releasing...' : 'Approve & Pay'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="pt-4 mt-6 border-t border-slate-100 flex flex-wrap gap-3">
                <button onClick={() => navigate("/chats")} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl shadow-sm hover:bg-slate-50 transition-colors flex justify-center items-center gap-2"><MessageSquare size={16} /> Open Chat</button>
                {activeTab === 'active' && <button onClick={() => setDisputeModalOpen(p.id)} className="flex-1 bg-white border border-rose-200 text-rose-600 font-bold py-2.5 rounded-xl shadow-sm hover:bg-rose-50 transition-colors flex justify-center items-center gap-2"><HelpCircle size={16} /> Raise Dispute</button>}
                {activeTab === 'completed' && <button onClick={() => setReviewModalOpen(p.id)} className="flex-1 bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold py-2.5 rounded-xl hover:bg-indigo-100 transition-colors flex justify-center items-center gap-2"><Star size={16} className="fill-indigo-700" /> Leave Review</button>}
              </div>
            </div>

            {/* Delivery Files & Logs Preview Column */}
            <div className="p-6 bg-slate-50/50">
              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2"><FileText size={14} className="text-slate-400" /> Delivery Files</h3>
              <div className="space-y-2 mb-8">
                {/* Mock files */}
                <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded flex items-center justify-center font-bold text-xs">PDF</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Project_Spec_V2.pdf</p>
                      <p className="text-[10px] text-slate-500">2.4 MB • 2 days ago</p>
                    </div>
                  </div>
                  <Download size={14} className="text-slate-400" />
                </div>
                <div className="flex items-center justify-between p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-colors cursor-pointer">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded flex items-center justify-center font-bold text-xs">ZIP</div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Assets_Final.zip</p>
                      <p className="text-[10px] text-slate-500">14.8 MB • Yesterday</p>
                    </div>
                  </div>
                  <Download size={14} className="text-slate-400" />
                </div>
              </div>

              <h3 className="font-bold text-slate-900 mb-4 uppercase tracking-wider text-xs flex items-center gap-2"><Activity size={14} className="text-slate-400" /> Recent Log</h3>
              <div className="text-xs space-y-3 relative border-l-2 border-slate-200 ml-2 pl-4">
                <div className="relative">
                  <div className="absolute -left-[21px] w-2.5 h-2.5 bg-slate-400 rounded-full border-2 border-slate-50"></div>
                  <p className="font-medium text-slate-700">Vendor uploaded Assets_Final.zip</p>
                  <p className="text-slate-400">Yesterday, 14:30</p>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] w-2.5 h-2.5 bg-indigo-500 rounded-full border-2 border-slate-50"></div>
                  <p className="font-medium text-slate-700">You released Midpoint Milestone</p>
                  <p className="text-slate-400">3 days ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Dispute Modal */}
      {disputeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100">
              <h3 className="text-xl font-black text-slate-900 flex items-center gap-2"><HelpCircle className="text-rose-600" /> Raise Dispute</h3>
            </div>
            <div className="p-6 bg-slate-50">
              <label className="block text-sm font-bold text-slate-700 mb-2">Reason for Dispute</label>
              <textarea 
                value={disputeReason}
                onChange={(e) => setDisputeReason(e.target.value)}
                placeholder="Explain the issue (e.g. vendor unresponsive, milestones not met)..."
                className="w-full h-32 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-rose-500 outline-none resize-none bg-white shadow-sm"
              ></textarea>
              <p className="text-xs text-slate-500 mt-3 font-medium bg-rose-50 p-3 rounded-lg border border-rose-100">
                <span className="font-bold text-rose-700">Note:</span> This alerts platform admins who will review your case and halt escrow payments.
              </p>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-white">
              <button onClick={() => { setDisputeModalOpen(null); setDisputeReason(""); }} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors">Cancel</button>
              <button 
                onClick={submitDispute} 
                disabled={!disputeReason.trim()}
                className="bg-rose-600 text-white font-bold px-6 py-2 rounded-xl shadow-sm hover:bg-rose-700 disabled:opacity-50 transition-colors"
              >
                Submit Dispute
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal Mock */}
      {reviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 text-center">
              <h3 className="text-xl font-black text-slate-900">Rate Vendor Performance</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">Your feedback helps maintain platform quality.</p>
            </div>
            <div className="p-8 flex flex-col items-center">
              <div className="flex gap-2 mb-6">
                {[1,2,3,4,5].map(star => (
                  <Star 
                    key={star} 
                    size={36} 
                    onClick={() => setReviewScore(star)}
                    className={`cursor-pointer transition-colors ${reviewScore >= star ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
                  />
                ))}
              </div>
              <textarea placeholder="Write your review here..." className="w-full h-24 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none resize-none bg-slate-50"></textarea>
            </div>
            <div className="p-5 border-t border-slate-100 flex justify-end gap-3 bg-slate-50">
              <button onClick={() => { setReviewModalOpen(null); setReviewScore(0); }} className="px-4 py-2 text-slate-600 font-bold hover:bg-slate-200 rounded-xl transition-colors">Cancel</button>
              <button onClick={() => { setReviewModalOpen(null); alert("Review submitted!"); }} className="bg-indigo-600 text-white font-bold px-6 py-2 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">Submit Review</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ----------------------------------------------------
// 5. Buyer Payments & Escrow
// ----------------------------------------------------
export function BuyerPayments() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('transactions');
  const [topUpAmount, setTopUpAmount] = useState("");
  const [viewReceipt, setViewReceipt] = useState<any | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem("vendorMatchUserId");
    if(!userId) return;
    fetch(`/api/payments/transactions/${userId}`)
      .then(r => r.json())
      .then(d => {
        const txns = d.items || [];
        setTransactions(txns);
        setLoading(false);
      })
      .catch(() => {
        setTransactions([]);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-12 text-slate-500">
      <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="font-bold">Loading Payments Data...</p>
    </div>
  );

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Payments & Escrow</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your wallet, transactions, and secure escrow deposits.</p>
        </div>
        <button className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
          <Download size={18} /> Download Statements
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
          <div className="absolute right-0 bottom-0 opacity-10 translate-x-1/4 translate-y-1/4"><Wallet size={160} /></div>
          <div className="relative z-10">
            <h3 className="text-indigo-200 font-bold mb-2 uppercase tracking-wider text-xs">Wallet Balance</h3>
            <div className="text-4xl font-black mb-1">₹0</div>
            <p className="text-indigo-200 text-sm font-medium mb-4">Available for instant payments</p>
            <div className="flex gap-2">
              <input 
                type="number" 
                placeholder="Amount" 
                value={topUpAmount}
                onChange={e => setTopUpAmount(e.target.value)}
                className="w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-1.5 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button className="bg-white text-indigo-900 px-4 py-1.5 rounded-lg text-sm font-bold hover:bg-indigo-50 transition-colors">Top Up</button>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center relative overflow-hidden group">
          <div className="absolute -right-6 -top-6 text-emerald-50 opacity-50 group-hover:scale-110 transition-transform duration-500"><ShieldCheck size={120} /></div>
          <div className="relative z-10">
            <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-xs">Total Escrow Protected</h3>
            <div className="text-3xl font-black text-slate-900 mb-1">₹0</div>
            <p className="text-emerald-500 text-sm font-bold flex items-center gap-1">Across 0 active projects</p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-center">
          <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-xs">Total Released</h3>
          <div className="text-3xl font-black text-slate-900 mb-1">₹0</div>
          <p className="text-slate-500 text-sm font-medium">Lifetime payments to vendors</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="flex border-b border-slate-100 overflow-x-auto whitespace-nowrap hide-scrollbar">
          <button onClick={() => setActiveTab('transactions')} className={`flex-1 py-4 font-bold text-sm text-center transition-colors ${activeTab === 'transactions' ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>Transaction History</button>
          <button onClick={() => setActiveTab('methods')} className={`flex-1 py-4 font-bold text-sm text-center transition-colors ${activeTab === 'methods' ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>Payment Methods</button>
          <button onClick={() => setActiveTab('invoices')} className={`flex-1 py-4 font-bold text-sm text-center transition-colors ${activeTab === 'invoices' ? 'bg-slate-50 text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}>GST Invoices</button>
        </div>

        {activeTab === 'transactions' && (
          <div>
            <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input type="text" placeholder="Search by ID or type..." className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none bg-white" />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                <select className="flex-1 md:w-auto pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none bg-white">
                  <option>All Types</option>
                  <option>Escrow Deposit</option>
                  <option>Escrow Release</option>
                  <option>Wallet Top-up</option>
                </select>
                <select className="flex-1 md:w-auto pl-3 pr-8 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-700 outline-none bg-white">
                  <option>Last 30 Days</option>
                  <option>Last 3 Months</option>
                  <option>This Year</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-400 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4">Transaction ID</th>
                    <th className="px-6 py-4">Date & Time</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.length === 0 ? (
                    <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">No transactions found</td></tr>
                  ) : transactions.map(txn => (
                    <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs text-slate-500 font-medium">{txn.id.split("-")[0]}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{new Date(txn.createdAt).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-1 rounded capitalize tracking-wide">{txn.transactionType.replace("_", " ")}</span>
                      </td>
                      <td className="px-6 py-4 font-black text-slate-900">₹{txn.amount.toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          txn.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                          txn.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {txn.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button onClick={() => setViewReceipt(txn)} className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors flex items-center gap-1">
                          <FileText size={16} /> Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'methods' && (
          <div className="p-8">
            <h3 className="font-bold text-slate-900 mb-4">Saved Payment Methods</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border border-indigo-200 bg-indigo-50/50 p-4 rounded-xl flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center font-black text-slate-900 text-xs italic">VISA</div>
                  <div>
                    <p className="font-bold text-slate-900">•••• •••• •••• 4242</p>
                    <p className="text-xs text-slate-500">Expires 12/28</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-indigo-600 bg-indigo-100 px-2 py-1 rounded">Primary</span>
              </div>
              <div className="border border-slate-200 bg-white p-4 rounded-xl flex justify-between items-center hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-8 bg-white border border-slate-200 rounded flex items-center justify-center font-black text-indigo-600 text-xs italic">UPI</div>
                  <div>
                    <p className="font-bold text-slate-900">user@okbank</p>
                    <p className="text-xs text-slate-500">Google Pay</p>
                  </div>
                </div>
                <button className="text-xs font-bold text-slate-400 hover:text-rose-600">Remove</button>
              </div>
            </div>
            <button className="border-2 border-dashed border-slate-300 text-slate-500 hover:text-indigo-600 hover:border-indigo-300 font-bold px-4 py-3 rounded-xl transition-colors flex items-center justify-center gap-2 w-full md:w-auto">
              <Plus size={18} /> Add New Payment Method
            </button>
          </div>
        )}

        {activeTab === 'invoices' && (
          <div className="p-0">
            <div className="p-8 text-center border-b border-slate-100">
              <FileText size={48} className="text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">Tax & GST Invoices</h3>
              <p className="text-slate-500">Download your monthly platform fee invoices for tax purposes.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-900">May 2026</td>
                  <td className="px-8 py-4 text-slate-500">INV-2026-05</td>
                  <td className="px-8 py-4 font-black text-slate-900">₹2,450</td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center justify-end gap-1 w-full">
                      <Download size={14} /> Download PDF
                    </button>
                  </td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="px-8 py-4 font-bold text-slate-900">April 2026</td>
                  <td className="px-8 py-4 text-slate-500">INV-2026-04</td>
                  <td className="px-8 py-4 font-black text-slate-900">₹1,200</td>
                  <td className="px-8 py-4 text-right">
                    <button className="text-indigo-600 font-bold text-sm hover:underline flex items-center justify-end gap-1 w-full">
                      <Download size={14} /> Download PDF
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
            </div>
          </div>
        )}

      </div>

      {viewReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded bg-indigo-600 text-white flex items-center justify-center font-bold">
                  <span className="sr-only">VendiMatch Logo</span>V
                </div>
                <h3 className="font-black text-slate-900">Transaction Receipt</h3>
              </div>
              <button onClick={() => setViewReceipt(null)} className="text-slate-400 hover:text-slate-600 transition-colors"><XCircle size={20}/></button>
            </div>
            <div className="p-8">
              <div className="text-center mb-6">
                <p className="text-slate-500 font-bold uppercase tracking-wider text-xs mb-1">Amount</p>
                <p className="text-4xl font-black text-slate-900">₹{viewReceipt.amount.toLocaleString()}</p>
                <div className="inline-flex mt-2">
                  <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    viewReceipt.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 
                    viewReceipt.status === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                  }`}>
                    {viewReceipt.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-sm bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 font-medium">Transaction ID</span>
                  <span className="font-bold text-slate-900">{viewReceipt.id}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 font-medium">Date & Time</span>
                  <span className="font-bold text-slate-900">{new Date(viewReceipt.createdAt).toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-b border-slate-200 pb-3">
                  <span className="text-slate-500 font-medium">Type</span>
                  <span className="font-bold text-slate-900 capitalize">{viewReceipt.transactionType.replace("_", " ")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Payment Method</span>
                  <span className="font-bold text-slate-900">Wallet / Escrow</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex gap-3 bg-slate-50">
              <button onClick={() => setViewReceipt(null)} className="flex-1 bg-white border border-slate-200 text-slate-700 font-bold py-2.5 rounded-xl hover:bg-slate-100 transition-colors">Close</button>
              <button onClick={() => { alert("Receipt downloaded!"); setViewReceipt(null); }} className="flex-1 bg-indigo-600 text-white font-bold py-2.5 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2">
                <Download size={16} /> Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export function BuyerSettings() {
  const [activeTab, setActiveTab] = useState('profile');
  const { currentUser } = useOutletContext<{ currentUser: User }>();

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-20">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-slate-900">Account Settings</h1>
        <p className="text-slate-500 font-medium mt-1">Manage your profile, preferences, and security settings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Settings Sidebar */}
        <div className="md:col-span-1 space-y-1">
          <button 
            onClick={() => setActiveTab('profile')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <UserIcon size={18} /> Profile Information
          </button>
          <button 
            onClick={() => setActiveTab('notifications')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'notifications' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Bell size={18} /> Notifications
          </button>
          <button 
            onClick={() => setActiveTab('security')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'security' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <Lock size={18} /> Security & Password
          </button>
          <button 
            onClick={() => setActiveTab('privacy')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'privacy' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <ShieldCheck size={18} /> Privacy & Data
          </button>
          <button 
            onClick={() => setActiveTab('api')} 
            className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-colors flex items-center gap-3 ${activeTab === 'api' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:bg-slate-50'}`}
          >
            <FileText size={18} /> API Access
          </button>
        </div>

        {/* Settings Content Area */}
        <div className="md:col-span-3">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            
            {activeTab === 'profile' && (
              <div className="animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Information</h2>
                <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
                  <div className="w-20 h-20 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-2xl font-black">
                    {currentUser.name.charAt(0)}
                  </div>
                  <div>
                    <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm shadow-sm hover:bg-slate-50 transition-colors mb-2">Upload New Avatar</button>
                    <p className="text-xs text-slate-500 font-medium">JPG, GIF or PNG. Max size of 800K</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
                    <input type="text" defaultValue={currentUser.name} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <input type="email" defaultValue={currentUser.email} disabled className="w-full p-3 bg-slate-100 text-slate-500 border border-slate-200 rounded-xl cursor-not-allowed" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Name (Optional)</label>
                    <input type="text" placeholder="e.g. Acme Corp" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">GSTIN (Optional)</label>
                    <input type="text" placeholder="22AAAAA0000A1Z5" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex justify-end">
                  <button className="bg-indigo-600 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-indigo-700 transition-colors">Save Profile</button>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Notification Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900">New Quotes Received</h4>
                      <p className="text-sm text-slate-500 mt-1">Get notified when vendors bid on your requirements.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900">Direct Messages</h4>
                      <p className="text-sm text-slate-500 mt-1">Get notified when a vendor sends you a message.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div>
                      <h4 className="font-bold text-slate-900">WhatsApp Alerts</h4>
                      <p className="text-sm text-slate-500 mt-1">Receive critical escrow and milestone alerts via WhatsApp.</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Security & Password</h2>
                <div className="space-y-6 mb-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
                    <input type="password" placeholder="••••••••" className="w-full max-w-md p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none" />
                  </div>
                  <div>
                    <button className="bg-slate-900 text-white font-bold px-6 py-2.5 rounded-xl shadow-sm hover:bg-slate-800 transition-colors">Update Password</button>
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 mb-2">Two-Factor Authentication (2FA)</h3>
                  <p className="text-sm text-slate-500 mb-4">Add an extra layer of security to your account by enabling 2FA.</p>
                  <button className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors">Enable 2FA</button>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">Privacy & Data</h2>
                
                <div className="space-y-6">
                  <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h3 className="font-bold text-slate-900 mb-2">Export Account Data</h3>
                    <p className="text-sm text-slate-500 mb-4">Download a copy of all your requirements, chats, and transaction history.</p>
                    <button className="bg-white border-2 border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2"><Download size={16} /> Request Data Export</button>
                  </div>

                  <div className="bg-rose-50 p-6 rounded-2xl border border-rose-100">
                    <h3 className="font-bold text-rose-900 mb-2">Delete Account</h3>
                    <p className="text-sm text-rose-700/80 mb-4">Permanently delete your account and all associated data. This action cannot be undone.</p>
                    <button className="bg-rose-600 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-rose-700 transition-colors">Delete Account</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'api' && (
              <div className="animate-in fade-in duration-200">
                <h2 className="text-xl font-bold text-slate-900 mb-6">API Access</h2>
                <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100 mb-6">
                  <h3 className="font-bold text-indigo-900 mb-2 flex items-center gap-2"><Lock size={16} /> Developer API</h3>
                  <p className="text-sm text-indigo-800 mb-4">Generate API keys to integrate VendorMatch with your internal CRM or ERP systems.</p>
                  <button className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"><Plus size={16} /> Generate API Key</button>
                </div>
                <p className="text-sm text-slate-500 italic">No API keys generated yet.</p>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
export function BuyerReviews() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Reviews Given</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
        <p className="text-slate-500 font-bold mb-4">You have not reviewed any vendors yet.</p>
      </div>
    </div>
  );
}

export function BuyerDisputes() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Disputes Raised</h2>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider font-bold">
            <tr>
              <th className="p-4">Project</th>
              <th className="p-4">Vendor</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">No disputes raised.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function BuyerSavedSearches() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Saved Searches</h2>
      <div className="text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200 shadow-sm">No saved searches yet.</div>
    </div>
  );
}
