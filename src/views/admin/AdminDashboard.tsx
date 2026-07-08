import { useState, useEffect } from "react";
import { 
  TrendingUp, Users, ShieldAlert, FileText, 
  AlertTriangle, DollarSign, Loader2, Activity, ArrowUpRight, ArrowDownRight, CreditCard, Clock
} from "lucide-react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

// Mock Data for Charts
const revenueData: any[] = [];

const categoryData: any[] = [];

export default function AdminDashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/v1/analytics/dashboard").then(r => r.json()),
      fetch("/api/admin/v1/dashboard/recent-users").then(r => r.json())
    ])
      .then(([metricsData, recentUsersData]) => {
        setMetrics(metricsData.metrics);
        setRecentUsers(recentUsersData);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch admin data", err);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">


      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Platform Overview</h1>
          <p className="text-sm text-slate-500">Real-time KPIs and system health metrics.</p>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign size={20} />
            </div>
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> 12.5%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">MTD Revenue</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">₹0</p>
            <p className="text-xs text-slate-400 font-medium mb-1">vs last month</p>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md">
              <ArrowUpRight size={14} /> 8.2%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Active Vendors</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{metrics?.totalVendors || 0}</p>
          </div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ShieldAlert size={20} />
            </div>
            {metrics?.pendingVerifications > 0 && (
              <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md animate-pulse">
                Action Req
              </span>
            )}
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Verification Queue</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{metrics?.pendingVerifications || 0}</p>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-[0_2px_10px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.04)]">
          <div className="flex justify-between items-start mb-4">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle size={20} />
            </div>
            <span className="text-xs font-bold text-rose-600 flex items-center gap-1 bg-rose-50 px-2 py-1 rounded-md">
              <ArrowDownRight size={14} /> 2.1%
            </span>
          </div>
          <h3 className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-1">Open Disputes</h3>
          <div className="flex items-end gap-2">
            <p className="text-3xl font-black text-slate-900 tracking-tight">{metrics?.openDisputes || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-slate-900">Revenue & Growth Trend</h3>
            <select className="text-xs font-bold bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-1.5 outline-none">
              <option>Last 6 Months</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(value) => `₹${value/1000}k`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366f1" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-6">Vendor Distribution</h3>
          <div className="h-[280px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} layout="vertical" margin={{ top: 0, right: 0, left: 10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#475569', fontWeight: 600 }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                />
                <Bar dataKey="vendors" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Secondary Metrics & Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3">Recent Fraud Alerts</h3>
            <div className="text-center py-8 text-slate-400 text-sm">
              <ShieldAlert size={32} className="mx-auto mb-2 text-slate-200" />
              <p>No active fraud alerts.</p>
            </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <h3 className="text-base font-bold text-slate-900 mb-4 pb-3">System Health & Traffic</h3>
          <div className="space-y-5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-slate-600"><FileText size={16} className="text-slate-400"/> Active RFPs</div>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{metrics?.openRequirements || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-slate-600"><Users size={16} className="text-slate-400"/> Total Buyers</div>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">{metrics?.totalUsers - metrics?.totalVendors || 0}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-slate-600"><Activity size={16} className="text-slate-400"/> API Uptime (30d)</div>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md">99.98%</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-3 text-slate-600"><Clock size={16} className="text-slate-400"/> Matching Queue</div>
              <span className="font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">14 items</span>
            </div>
            <div className="flex justify-between items-center text-sm pt-4 border-t border-slate-100">
              <span className="text-slate-500 font-medium">System Status</span>
              <span className="font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-xs flex items-center gap-1.5 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Operational
              </span>
            </div>
          </div>
        </div>

        {/* Recent Registrations Widget */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h3 className="text-base font-bold text-slate-900 mb-4 border-b border-slate-100 pb-3 flex justify-between items-center">
            <span>Recent Registrations</span>
            <button className="text-xs text-indigo-600 hover:text-indigo-800">View All</button>
          </h3>
          <div className="space-y-4">
            {recentUsers.map((user, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${user.role === 'vendor' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-900">{user.name}</p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-right">
                  <div className="text-xs text-slate-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                  <div className="w-24 flex justify-end">
                    {user.role === 'vendor' && user.verificationStatus === 'pending' && (
                      <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Pending
                      </span>
                    )}
                    {user.role === 'vendor' && user.verificationStatus !== 'pending' && (
                      <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        Verified
                      </span>
                    )}
                    {user.role === 'buyer' && user.isNew && (
                      <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                        New Buyer
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {recentUsers.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">No recent registrations.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
