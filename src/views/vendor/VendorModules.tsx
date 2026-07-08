import React, { useState, useEffect, useRef } from "react";
import { useOutletContext, Link, useNavigate } from "react-router-dom";
import { User } from "../../types";
import { Star, TrendingUp, Zap, Clock, BarChart2, FileText, CheckCircle, XCircle, Search, Filter, Download, Plus, MapPin, Map, LineChart, PieChart, ShieldCheck, Settings, DollarSign, Briefcase, MessageSquare } from "lucide-react";
import CheckoutModal from "../../components/CheckoutModal";
import InvoiceModal from "../../components/InvoiceModal";
import { SubmitQuoteModal } from "../../components/SubmitQuoteModal";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import { useVirtualizer } from "@tanstack/react-virtual";

export function VendorOverview() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      fetch(`/api/dashboards/vendor/stats?userId=${currentUser.id}`)
        .then(r => r.json())
        .then(setStats)
        .catch(console.error);
    };
    
    loadData();
    
    window.addEventListener("dashboard_refresh", loadData);
    return () => window.removeEventListener("dashboard_refresh", loadData);
  }, [currentUser.id]);

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Performance Summary</h1>
        <div className="flex items-center gap-3 bg-slate-100 rounded-full px-4 py-1.5 text-[10px] md:text-sm font-bold text-slate-600 w-full md:w-auto">
          <span className="whitespace-nowrap">Profile Complete</span>
          <div className="w-full md:w-24 bg-slate-200 rounded-full h-2">
            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '85%' }}></div>
          </div>
          <span className="text-emerald-600">85%</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-4 md:p-6 hover:shadow-md transition-all flex flex-col justify-center">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-emerald-50 text-emerald-600 rounded-xl"><DollarSign size={20} className="md:w-6 md:h-6" /></div>
            <Badge variant="secondary" className="hidden sm:flex text-emerald-600 bg-emerald-50"><TrendingUp size={12} className="mr-1" /> +8%</Badge>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Earnings</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">₹0</p>
          </div>
        </Card>
        <Card onClick={() => navigate("/vendor/projects")} className="p-4 md:p-6 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-center">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-indigo-50 text-indigo-600 rounded-xl"><Briefcase size={20} className="md:w-6 md:h-6" /></div>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Active Projects</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">0</p>
          </div>
        </Card>
        <Card onClick={() => navigate("/vendor/quotes")} className="p-4 md:p-6 hover:border-amber-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-center">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-amber-50 text-amber-600 rounded-xl"><FileText size={20} className="md:w-6 md:h-6" /></div>
            <Badge variant="outline" className="text-amber-600 border-amber-200 bg-amber-50 shrink-0">Action Req.</Badge>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Pending Proposals</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">{stats?.quotesSent || 0}</p>
          </div>
        </Card>
        <Card onClick={() => navigate("/chats")} className="p-4 md:p-6 hover:border-rose-300 hover:shadow-md transition-all cursor-pointer flex flex-col justify-center">
          <div className="flex justify-between items-start mb-3 md:mb-4">
            <div className="p-2 md:p-3 bg-rose-50 text-rose-600 rounded-xl"><MessageSquare size={20} className="md:w-6 md:h-6" /></div>
            <Badge variant="default" className="bg-rose-500 text-white hover:bg-rose-600 shrink-0">New</Badge>
          </div>
          <div>
            <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">New Messages</p>
            <p className="text-2xl md:text-3xl font-black text-slate-900">0</p>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity</h2>
          </div>
          <Card className="p-6">
            <ul className="space-y-4">
              <li className="text-slate-500 text-sm py-4">No recent activity found.</li>
            </ul>
          </Card>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-slate-900 mb-4">AI Tip of the Day</h2>
          <Card className="bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-100 p-6 relative overflow-hidden h-[85%] flex flex-col justify-center shadow-sm">
            <Zap className="absolute top-2 right-2 text-indigo-200 opacity-50" size={64} />
            <h3 className="font-bold text-indigo-900 mb-2 relative z-10">Optimize Your Profile</h3>
            <p className="text-sm text-indigo-700 mb-4 relative z-10">Responding to leads within 1 hour increases your match score by 10%. You have 1 unseen lead right now.</p>
            <Button onClick={() => navigate("/vendor/leads")} className="w-full relative z-10 font-bold">Go to Inbox</Button>
          </Card>
        </div>
      </div>
    </div>
  );
}

export function VendorServiceOfferings() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const [isAdding, setIsAdding] = useState(false);
  const [services, setServices] = useState<any[]>(() => {
    try { return JSON.parse(currentUser.vendorProfile?.servicesJson || "[]") } catch { return [] }
  });

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Web Development");
  const [pricing, setPricing] = useState("Fixed Price");
  const [timeline, setTimeline] = useState("");
  const [description, setDescription] = useState("");

  const loadData = () => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user?.vendorProfile?.servicesJson) {
          try {
            setServices(JSON.parse(data.user.vendorProfile.servicesJson));
          } catch(e) {}
        }
      })
      .catch(console.error);
  };

  useEffect(() => {
    window.addEventListener("dashboard_refresh", loadData);
    return () => window.removeEventListener("dashboard_refresh", loadData);
  }, []);

  const handlePublish = async () => {
    if (!title) return;
    const newService = {
      id: Math.random().toString(36).substring(7),
      title,
      category,
      priceRange: pricing,
      timeline,
      description,
      status: "Active",
      metrics: "0 views"
    };

    const updatedServices = [...services, newService];
    try {
      await fetch(`/api/vendors/${currentUser.id}/services`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ services: updatedServices })
      });
      setServices(updatedServices);
      setIsAdding(false);
      setTitle("");
      setTimeline("");
      setDescription("");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Service Offerings</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="w-full sm:w-auto justify-center bg-indigo-600 text-white px-4 py-3 sm:py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700">
          <Plus size={16} /> Add New Offering
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Create New Offering</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Service Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} type="text" placeholder="e.g. Full Stack Web Development" className="w-full border border-slate-200 rounded-lg p-3 md:p-2 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 md:p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                <option>Web Development</option>
                <option>Mobile Apps</option>
                <option>Design</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pricing Model</label>
              <select value={pricing} onChange={(e) => setPricing(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 md:p-2 text-sm focus:ring-2 focus:ring-indigo-500 bg-white">
                <option>Fixed Price</option>
                <option>Hourly</option>
                <option>Project Based</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Estimated Timeline</label>
              <input value={timeline} onChange={(e) => setTimeline(e.target.value)} type="text" placeholder="e.g. 2-4 weeks" className="w-full border border-slate-200 rounded-lg p-3 md:p-2 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border border-slate-200 rounded-lg p-3 md:p-2 text-sm h-24 focus:ring-2 focus:ring-indigo-500"></textarea>
          </div>
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="w-full sm:w-auto px-4 py-3 sm:py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={handlePublish} className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 sm:py-2 rounded-lg font-bold">Publish Offering</button>
          </div>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-2xl overflow-x-auto shadow-sm">
        <table className="w-full text-left min-w-[600px]">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-bold">Service Title</th>
              <th className="p-4 font-bold">Category</th>
              <th className="p-4 font-bold">Price Range</th>
              <th className="p-4 font-bold text-center">Status</th>
              <th className="p-4 font-bold text-right">Metrics</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {services.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">No service offerings added yet.</td>
              </tr>
            ) : (
              services.map((svc: any) => (
                <tr key={svc.id} className="hover:bg-slate-50/50">
                  <td className="p-4 font-bold text-slate-900">{svc.title}</td>
                  <td className="p-4 text-slate-600">{svc.category}</td>
                  <td className="p-4 text-slate-600">{svc.priceRange}</td>
                  <td className="p-4 text-center">
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                      {svc.status || 'Active'}
                    </span>
                  </td>
                  <td className="p-4 text-right text-slate-500 font-medium">{svc.metrics || '0 views'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function VendorLeads() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const [activeTab, setActiveTab] = useState("new");
  const [activeQuoteReq, setActiveQuoteReq] = useState<{id: string, title: string, leadId: string} | null>(null);
  const [leads, setLeads] = useState<any[]>([]);
  
  const parentRef = useRef<HTMLDivElement>(null);

  const loadData = () => {
    fetch(`/api/vendors/${currentUser.id}/leads`)
      .then(res => res.json())
      .then(data => setLeads(data.items || []))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("dashboard_refresh", loadData);
    return () => window.removeEventListener("dashboard_refresh", loadData);
  }, [currentUser.id]);

  const filteredLeads = leads.filter(l => activeTab === 'quoted' ? (l.status === 'quoted' || l.status === 'proposal_submitted') : l.status === activeTab);
  const newLeadsCount = leads.filter(l => l.status === "new").length;

  const virtualizer = useVirtualizer({
    count: filteredLeads.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 160,
    overscan: 5,
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Leads Inbox</h1>
        <div className="flex w-full md:w-auto gap-2">
          <Button variant="outline" className="flex items-center gap-2"><Filter size={16}/> Filter</Button>
          <div className="relative w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input type="text" placeholder="Search leads..." className="pl-9 w-full md:w-64" />
          </div>
        </div>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 mb-6 border-b border-slate-200">
        {["new", "viewed", "quoted", "archived"].map(tab => {
          const count = tab === "new" ? newLeadsCount : leads.filter(l => tab === 'quoted' ? (l.status === 'quoted' || l.status === 'proposal_submitted') : l.status === tab).length;
          return (
            <button 
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-bold capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
            >
              {tab} {count > 0 && <span className={`ml-1 text-white text-[10px] px-1.5 py-0.5 rounded-full ${tab === "new" ? "bg-rose-500" : "bg-slate-400"}`}>{count}</span>}
            </button>
          )
        })}
      </div>

      <div ref={parentRef} className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredLeads.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200">
            No {activeTab} leads available right now.
          </div>
        ) : (
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const lead = filteredLeads[virtualRow.index];
              return (
                <div 
                  key={virtualRow.key} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: `${virtualRow.size}px`, 
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: '16px'
                  }}
                >
                  <Card className="p-4 md:p-5 hover:border-indigo-300 transition-colors shadow-sm h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm md:text-base hover:text-indigo-600 cursor-pointer transition-colors">#{lead.id} • {lead.requirement?.title}</p>
                        <p className="text-xs text-slate-500 mt-1 line-clamp-2 md:line-clamp-1">Buyer: <span className="font-semibold text-slate-700">{lead.requirement?.buyerName}</span> - {lead.requirement?.description}</p>
                      </div>
                      <Badge variant={lead.matchingScore > 80 ? 'secondary' : 'outline'} className={lead.matchingScore > 80 ? 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 shrink-0' : 'text-amber-700 border-amber-200 bg-amber-50 shrink-0'}>
                        {lead.matchingScore}% Match
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between mt-auto pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-600">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">${lead.requirement?.budgetMin} - ${lead.requirement?.budgetMax}</span>
                        <span className="text-rose-600 font-bold flex items-center bg-rose-50 px-2 py-0.5 rounded-md"><Clock size={14} className="mr-1"/> {lead.requirement?.timelineWeeks} Weeks</span>
                      </div>
                      <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                        <Button variant="outline" size="sm" className="hidden sm:flex">Decline</Button>
                        <Button size="sm" onClick={() => setActiveQuoteReq({id: lead.requirementId, title: lead.requirement?.title, leadId: lead.id})}>
                          {lead.matchingScore > 80 ? 'Submit Quote' : <><Zap size={14} className="mr-1"/> Auto-Quote</>}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
      {activeQuoteReq && (
        <SubmitQuoteModal 
          requirementId={activeQuoteReq.id}
          requirementTitle={activeQuoteReq.title}
          leadId={activeQuoteReq.leadId}
          onClose={() => setActiveQuoteReq(null)}
        />
      )}
    </div>
  );
}

export function VendorQuotes() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const parentRef = useRef<HTMLDivElement>(null);
  const [quotes, setQuotes] = useState<any[]>([]);

  const loadData = () => {
    fetch(`/api/proposals?vendorId=${currentUser.id}`)
      .then(r => r.json())
      .then(d => setQuotes(d.items || []))
      .catch(console.error);
  };

  useEffect(() => {
    loadData();
    window.addEventListener("dashboard_refresh", loadData);
    return () => window.removeEventListener("dashboard_refresh", loadData);
  }, [currentUser.id]);

  const virtualizer = useVirtualizer({
    count: quotes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Quotes</h1>
        <Button variant="outline" className="w-full md:w-auto flex items-center gap-2 text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100">
          <Zap size={16} /> AI Proposal Generator
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 mb-8">
        <Card className="p-4 md:p-6 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Win Rate</p>
          <p className="text-2xl md:text-3xl font-black text-slate-900">0%</p>
        </Card>
        <Card className="p-4 md:p-6 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Pending Value</p>
          <p className="text-2xl md:text-3xl font-black text-slate-900">₹0</p>
        </Card>
        <Card className="col-span-2 md:col-span-1 p-4 md:p-6 shadow-sm flex flex-col justify-center">
          <p className="text-slate-500 font-bold uppercase tracking-wider text-[10px] md:text-xs mb-1">Avg Response</p>
          <p className="text-2xl md:text-3xl font-black text-slate-900">-</p>
        </Card>
      </div>

      <div ref={parentRef} className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {quotes.length === 0 ? (
          <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200">
            No quotes sent yet.
          </div>
        ) : (
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const quote = quotes[virtualRow.index];
              return (
                <div 
                  key={virtualRow.key} 
                  style={{ 
                    position: 'absolute', 
                    top: 0, 
                    left: 0, 
                    width: '100%', 
                    height: `${virtualRow.size}px`, 
                    transform: `translateY(${virtualRow.start}px)`,
                    paddingBottom: '16px'
                  }}
                >
                  <Card className="p-4 md:p-5 hover:border-indigo-300 transition-colors shadow-sm h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div>
                        <p className="font-bold text-slate-900 text-sm md:text-base">Quote #{quote.id.substring(0,8)}</p>
                        <p className="text-xs text-slate-500 mt-1">Requirement: <span className="font-semibold text-slate-700">{quote.requirement?.title}</span></p>
                      </div>
                      <Badge variant={quote.status === 'Accepted' ? 'secondary' : quote.status === 'Rejected' ? 'outline' : 'default'} className={
                        quote.status === 'Accepted' ? 'bg-emerald-100 text-emerald-700' : 
                        quote.status === 'Rejected' ? 'bg-slate-100 text-slate-600 border-slate-200' : 
                        'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }>
                        {quote.status}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center justify-between mt-auto pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2 md:gap-4 text-xs md:text-sm text-slate-600">
                        <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">₹{quote.bidAmount}</span>
                        <span className="text-slate-500 font-bold flex items-center bg-slate-50 px-2 py-0.5 rounded-md"><Clock size={14} className="mr-1"/> {quote.timelineWeeks} Weeks</span>
                      </div>
                      <div className="flex flex-row gap-2 mt-2 sm:mt-0">
                        {quote.status === 'Sent' && <Button variant="ghost" size="sm" className="text-rose-600 hover:text-rose-700 hover:bg-rose-50">Withdraw</Button>}
                        <Button variant="outline" size="sm">View PDF</Button>
                      </div>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export function VendorProjects() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const [activeTab, setActiveTab] = useState("active");
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    fetch(`/api/proposals?vendorId=${currentUser.id}`)
      .then(r => r.json())
      .then(d => setProjects((d.items || []).filter((p: any) => p.status === 'accepted' || p.status === 'completed')))
      .catch(console.error);
  }, [currentUser.id]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-slate-900">Projects</h1>
      </div>

      <div className="flex overflow-x-auto no-scrollbar gap-4 mb-6 border-b border-slate-200">
        {["active", "completed", "disputed"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold capitalize transition-colors whitespace-nowrap ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <div className="p-8 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200">
          No projects assigned yet.
        </div>
      </div>
    </div>
  );
}

export function VendorPortfolio() {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">My Portfolio</h1>
        <button onClick={() => setIsAdding(!isAdding)} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-indigo-700">
          <Plus size={16} /> Upload Project
        </button>
      </div>

      {isAdding && (
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Add Portfolio Item</h2>
          
          <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center mb-6 hover:bg-slate-50 transition-colors cursor-pointer">
            <div className="mx-auto w-12 h-12 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-3">
              <Download size={24} />
            </div>
            <p className="font-bold text-slate-700 mb-1">Click to upload or drag and drop</p>
            <p className="text-sm text-slate-500">SVG, PNG, JPG, PDF or MP4 (max. 20MB)</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Title</label>
              <input type="text" placeholder="e.g. Acme Corp Rebranding" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
              <textarea className="w-full border border-slate-200 rounded-lg p-2 text-sm h-24 focus:ring-2 focus:ring-indigo-500" placeholder="Describe the problem, your solution, and the results..."></textarea>
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Tags (Comma separated)</label>
              <input type="text" placeholder="e.g. Web Design, Branding, React" className="w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>
          
          <div className="flex justify-end gap-3">
            <button onClick={() => setIsAdding(false)} className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg">Cancel</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-900 text-white px-6 py-2 rounded-lg font-bold">Save Item</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div className="col-span-full p-8 text-center text-slate-500 font-bold bg-white rounded-xl border border-slate-200">
          No portfolio items uploaded yet.
        </div>
      </div>
    </div>
  );
}

export function VendorAnalytics() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Analytics</h1>
        <button className="bg-slate-100 text-slate-700 px-4 py-2 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-slate-200">
          <Download size={16} /> Export PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Lead Performance Chart */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><LineChart size={20} className="text-indigo-600"/> Lead Performance Over Time</h2>
          <div className="h-64 flex items-end justify-between gap-2 px-2">
            {[0, 0, 0, 0, 0, 0, 0].map((h, i) => (
              <div key={i} className="w-full relative group">
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-10">0 Leads</div>
                <div className="bg-indigo-100 rounded-t-sm w-full hover:bg-indigo-200 transition-colors" style={{ height: `0%` }}>
                  <div className="bg-indigo-500 w-full rounded-t-sm" style={{ height: `0%` }}></div>
                </div>
                <div className="text-center text-[10px] text-slate-400 mt-2 font-bold uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-6 border-t border-slate-100 pt-4">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-indigo-100"></div> Total Leads</div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500"><div className="w-3 h-3 rounded-full bg-indigo-500"></div> Quotes Sent</div>
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2"><BarChart2 size={20} className="text-emerald-600"/> Conversion Funnel</h2>
          <div className="flex flex-col items-center justify-center h-64 gap-2 w-full max-w-sm mx-auto">
            <div className="w-full bg-slate-100 h-10 rounded-lg flex items-center justify-between px-4">
              <span className="text-xs font-bold text-slate-600 uppercase">Profile Views</span>
              <span className="font-black text-slate-900">0</span>
            </div>
            <div className="w-full bg-indigo-50 h-10 rounded-lg flex items-center justify-between px-4 border border-indigo-100">
              <span className="text-xs font-bold text-indigo-700 uppercase">Leads Received</span>
              <span className="font-black text-indigo-900">0</span>
            </div>
            <div className="w-full bg-amber-50 h-10 rounded-lg flex items-center justify-between px-4 border border-amber-100">
              <span className="text-xs font-bold text-amber-700 uppercase">Quotes Sent</span>
              <span className="font-black text-amber-900">0</span>
            </div>
            <div className="w-full bg-emerald-50 h-10 rounded-lg flex items-center justify-between px-4 border border-emerald-100">
              <span className="text-xs font-bold text-emerald-700 uppercase">Won Projects</span>
              <span className="font-black text-emerald-900">0</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><PieChart size={20} className="text-rose-500"/> Top Categories</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Web Development</span>
                <span className="text-slate-900">0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-rose-500 h-full" style={{width: '0%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">UI/UX Design</span>
                <span className="text-slate-900">0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-amber-500 h-full" style={{width: '0%'}}></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Mobile Apps</span>
                <span className="text-slate-900">0%</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden"><div className="bg-indigo-500 h-full" style={{width: '0%'}}></div></div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Map size={20} className="text-blue-500"/> Geo Distribution</h2>
          <div className="flex items-center justify-center h-40 bg-slate-50 rounded-xl border border-slate-100">
            <div className="text-center">
              <MapPin className="text-slate-300 mx-auto mb-2" size={32} />
              <p className="text-sm font-bold text-slate-500">No data available</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2"><Clock size={20} className="text-slate-500"/> Response Time</h2>
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-5xl font-black text-slate-900 mb-2">-</div>
            <p className="text-sm font-bold text-slate-400 bg-slate-50 px-3 py-1 rounded-full">Not enough data</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function VendorWallet() {
  const { currentUser, globalPlans = [] } = useOutletContext<{ currentUser: User, globalPlans: any[] }>();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutConfig, setCheckoutConfig] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);

  const fetchTransactions = () => {
    fetch(`/api/payments/transactions/${currentUser.id}`)
      .then(r => r.json())
      .then(d => {
        setTransactions(d.items || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentUser.id]);

  if (loading) return <div className="p-8 text-center text-slate-500 font-bold">Loading Wallet...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-black text-slate-900">Wallet & Billing</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Credits Card */}
        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-slate-900/10">
          <div className="absolute right-0 top-0 opacity-10">
            <svg width="200" height="200" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-400 font-bold mb-2 uppercase tracking-wider text-sm">Available Leads</h3>
            <div className="text-5xl font-black mb-4">{currentUser.vendorProfile?.leadCredits || 0}</div>
            
            {(currentUser.vendorProfile?.leadCredits || 0) < 5 ? (
              <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl p-4 mb-6">
                <p className="text-rose-400 text-sm font-bold mb-2 flex items-center gap-2"><Zap size={16}/> Low Balance</p>
                <p className="text-slate-300 text-xs mb-3">You are running out of leads! Top up now to keep pitching high-value buyers.</p>
                {globalPlans.length > 0 && (
                  <button 
                    onClick={() => { setCheckoutConfig({ amount: globalPlans[0].price, credits: globalPlans[0].credits, title: globalPlans[0].name, type: "lead_purchase" }); setIsCheckoutOpen(true); }}
                    className="bg-rose-600 hover:bg-rose-500 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm w-full"
                  >
                    Buy {globalPlans[0].credits} Leads (₹{globalPlans[0].price.toLocaleString()})
                  </button>
                )}
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-slate-300 text-sm mb-4">You have a healthy balance. Pitch new requirements today.</p>
                <button 
                  onClick={() => { 
                    const p = globalPlans.length > 1 ? globalPlans[1] : globalPlans[0];
                    if (p) {
                      setCheckoutConfig({ amount: p.price, credits: p.credits, title: p.name, type: "lead_purchase" }); 
                      setIsCheckoutOpen(true);
                    }
                  }}
                  className="bg-indigo-500 hover:bg-indigo-400 text-white font-bold py-2 px-4 rounded-lg transition-colors text-sm w-full"
                >
                  Top Up Balance
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Earnings Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-slate-500 font-bold mb-2 uppercase tracking-wider text-sm">Total Earnings</h3>
            <div className="text-4xl font-black text-slate-900 mb-2">₹0</div>
            <p className="text-slate-500 text-sm font-bold bg-slate-50 inline-block px-2 py-1 rounded-md mb-6">
              -
            </p>
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">Next Payout</h4>
            <p className="text-slate-500 text-sm">None scheduled</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-900">Recent Transactions</h2>
          <button className="text-indigo-600 text-sm font-bold hover:underline">Download CSV</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Description</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500 font-medium">No transactions found</td></tr>
              ) : transactions.map(txn => (
                <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{txn.id.split("-")[0]}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-900">{new Date(txn.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700 capitalize">{txn.transactionType.replace("_", " ")}</span>
                  </td>
                  <td className="px-6 py-4 font-black text-slate-900">
                    {txn.transactionType.includes('deposit') || txn.transactionType.includes('purchase') ? '-' : '+'}₹{txn.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-md text-xs font-bold ${
                      txn.status === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {txn.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    {txn.status === 'success' && (
                      <button 
                        onClick={() => setSelectedInvoice(txn)}
                        className="text-indigo-600 font-bold text-sm hover:underline flex items-center justify-end gap-1 w-full"
                      >
                        <FileText size={14} /> Invoice
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <CheckoutModal 
        isOpen={isCheckoutOpen} 
        onClose={() => setIsCheckoutOpen(false)} 
        title={checkoutConfig?.title}
        amount={checkoutConfig?.amount}
        transactionType={checkoutConfig?.type}
        credits={checkoutConfig?.credits}
        userId={currentUser.id}
        role="vendor"
        onSuccess={() => {
          fetchTransactions();
        }}
      />

      <InvoiceModal 
        isOpen={!!selectedInvoice}
        onClose={() => setSelectedInvoice(null)}
        transaction={selectedInvoice}
        user={currentUser}
      />
    </div>
  );
}

export function VendorSettings() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const [kycStatus, setKycStatus] = useState("idle");
  const [activeTab, setActiveTab] = useState("profile");

  const submitKYC = async () => {
    setKycStatus("submitting");
    try {
      const res = await fetch("/api/vendors/kyc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          panUrl: "uploaded_pan.jpg",
          gstUrl: "uploaded_gst.jpg",
          aadhaarUrl: "uploaded_aadhaar.jpg",
          videoUrl: "uploaded_video.mp4"
        })
      });
      if (res.ok) setKycStatus("submitted");
      else setKycStatus("error");
    } catch (e) {
      setKycStatus("error");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>
      
      <div className="flex gap-4 mb-6 border-b border-slate-200 overflow-x-auto pb-1 hide-scrollbar">
        {["profile", "pricing_availability", "notifications", "subscription", "team", "api"].map(tab => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-bold capitalize whitespace-nowrap transition-colors ${activeTab === tab ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-900'}`}
          >
            {tab.replace("_", " & ")}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Profile Settings</h2>
            <div className="flex items-center gap-6 mb-8">
              <img src={currentUser.avatar} alt="Avatar" loading="lazy" decoding="async" className="w-24 h-24 rounded-2xl object-cover ring-4 ring-slate-50" />
              <div>
                <button className="bg-slate-100 text-slate-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-slate-200 mb-2">Change Logo</button>
                <p className="text-xs text-slate-500">JPG, PNG or GIF. Max 5MB.</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Business Name</label>
                <input type="text" defaultValue={currentUser.vendorProfile?.businessName || ""} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Contact Email</label>
                <input type="email" defaultValue={currentUser.email} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 bg-slate-50" disabled />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Service Areas (Cities)</label>
                <input type="text" defaultValue="Bangalore, Mumbai, Delhi NCR" className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700">Save Changes</button>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2"><ShieldCheck className="text-emerald-500"/> Trust & Verification Center</h2>
            <p className="text-slate-600 mb-6">Upload your KYC documents and a video portfolio to earn the Verified badge and increase buyer trust.</p>
            
            {kycStatus === "submitted" ? (
              <div className="bg-emerald-50 text-emerald-700 p-6 rounded-xl font-bold border border-emerald-100 flex items-center gap-3">
                <span className="text-2xl">✓</span> Your verification documents have been submitted and are under review.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">PAN Card</label>
                    <input type="file" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">GST Certificate</label>
                    <input type="file" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Aadhaar Proof</label>
                    <input type="file" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Video Portfolio Intro</label>
                    <input type="file" accept="video/*" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
                  </div>
                </div>
                <button onClick={submitKYC} disabled={kycStatus === "submitting"} className="mt-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-400 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                  {kycStatus === "submitting" ? "Uploading..." : "Submit for Verification"}
                </button>
                {kycStatus === "error" && <p className="text-red-500 text-sm font-bold mt-2">Failed to submit KYC. Please try again.</p>}
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "pricing_availability" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Pricing & Availability</h2>
          <div className="space-y-6 max-w-2xl">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Default Pricing Model</label>
              <select className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500">
                <option>Project Based (Fixed)</option>
                <option>Hourly Rate</option>
                <option>Retainer</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Minimum Project Size (₹)</label>
                <input type="number" defaultValue={50000} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Maximum Project Size (₹)</label>
                <input type="number" defaultValue={5000000} className="w-full border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500" />
              </div>
            </div>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-indigo-700 mt-4">Save Pricing Preferences</button>
          </div>
        </div>
      )}

      {activeTab === "subscription" && (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Current Subscription: Free Tier</h2>
              <p className="text-slate-600">You are currently on the Free Tier, which provides a public profile but 0 lead unlocks. Upgrade to pitch clients.</p>
            </div>
            <span className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold uppercase">Active</span>
          </div>
          
          <div className="flex gap-4 mb-8">
            <button className="bg-indigo-600 text-white font-bold py-2 px-6 rounded-xl shadow-lg hover:bg-indigo-700 transition-transform hover:-translate-y-0.5">Upgrade to Premium</button>
            <Link to="/pricing" className="bg-slate-100 text-slate-700 font-bold py-2 px-6 rounded-xl hover:bg-slate-200">View Plans</Link>
          </div>

          <div className="border-t border-slate-100 pt-8">
            <h3 className="font-bold text-slate-900 mb-4">Billing Details</h3>
            <p className="text-sm text-slate-500 mb-4">To view your transaction history or download invoices, please visit your <Link to="/vendor/wallet" className="text-indigo-600 font-bold hover:underline">Wallet</Link>.</p>
          </div>
        </div>
      )}

      {/* Placeholders for remaining tabs to show they exist in the UI structure */}
      {["notifications", "team", "api"].includes(activeTab) && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center shadow-sm">
          <Settings className="mx-auto mb-4 text-slate-300" size={48} />
          <h2 className="text-xl font-bold text-slate-900 mb-2 capitalize">{activeTab} Settings</h2>
          <p className="text-slate-500">This module is available on Premium & Enterprise plans.</p>
          <button className="mt-6 bg-slate-900 text-white px-6 py-2 rounded-xl font-bold text-sm">Upgrade Plan</button>
        </div>
      )}

    </div>
  );
}
