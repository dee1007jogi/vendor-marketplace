import React, { useState, useEffect, useMemo } from 'react';
import { 
  Megaphone, Plus, Search, Filter, Download, FileSpreadsheet, 
  FileJson, Eye, Play, Pause, CheckCircle2, AlertCircle, 
  TrendingUp, Clock, MapPin, Layers, Percent, DollarSign,
  Sparkles, Zap, RefreshCw, ChevronRight, X
} from 'lucide-react';
import { AdCampaign, AdPlacementType, AdTimeSlot } from '../../../../types';
import { 
  getStoredAdCampaigns, saveStoredAdCampaigns, 
  updateAdCampaignStatus, AD_PLACEMENTS, AD_TIME_SLOTS 
} from '../../../../lib/adEngine';
import AdRunnerModal from '../../../../components/AdRunnerModal';

export default function AdminAdManager() {
  const [campaigns, setCampaigns] = useState<AdCampaign[]>(() => getStoredAdCampaigns());
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPlacement, setSelectedPlacement] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("all");
  const [isAdStudioOpen, setIsAdStudioOpen] = useState(false);
  const [previewAd, setPreviewAd] = useState<AdCampaign | null>(null);

  const reloadData = () => {
    setCampaigns(getStoredAdCampaigns());
  };

  useEffect(() => {
    reloadData();
    const handleUpdate = () => setCampaigns(getStoredAdCampaigns());
    window.addEventListener("bussinest_ads_updated", handleUpdate);
    return () => window.removeEventListener("bussinest_ads_updated", handleUpdate);
  }, []);

  // Filtered Campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(c => {
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          c.title.toLowerCase().includes(q) ||
          c.headline.toLowerCase().includes(q) ||
          c.advertiserName.toLowerCase().includes(q) ||
          c.advertiserEmail.toLowerCase().includes(q) ||
          c.targetCategory.toLowerCase().includes(q) ||
          c.targetLocation.toLowerCase().includes(q);
        if (!matches) return false;
      }

      if (selectedPlacement !== "all" && c.placement !== selectedPlacement) {
        return false;
      }

      if (selectedStatus !== "all" && c.status !== selectedStatus) {
        return false;
      }

      if (selectedTimeSlot !== "all" && c.timeSlot !== selectedTimeSlot) {
        return false;
      }

      return true;
    });
  }, [campaigns, searchQuery, selectedPlacement, selectedStatus, selectedTimeSlot]);

  // Overall KPI Metrics
  const metrics = useMemo(() => {
    const totalRev = campaigns.reduce((acc, c) => acc + (c.pricing?.totalPayable || 0), 0);
    const activeCount = campaigns.filter(c => c.status === "active").length;
    const totalImpressions = campaigns.reduce((acc, c) => acc + (c.stats?.impressions || 0), 0);
    const totalClicks = campaigns.reduce((acc, c) => acc + (c.stats?.clicks || 0), 0);
    const avgCtr = campaigns.length > 0 
      ? Number((campaigns.reduce((acc, c) => acc + (c.stats?.ctr || 0), 0) / campaigns.length).toFixed(2)) 
      : 0;

    return { totalRev, activeCount, totalImpressions, totalClicks, avgCtr };
  }, [campaigns]);

  // Status Toggle
  const handleToggleStatus = (id: string, currentStatus: AdCampaign['status']) => {
    const newStatus = currentStatus === "active" ? "paused" : "active";
    updateAdCampaignStatus(id, newStatus);
    setCampaigns(getStoredAdCampaigns());
  };

  // CSV Exporter
  const exportAdsToCsv = (items: AdCampaign[], filename = "bussinest_ad_campaigns") => {
    const headers = [
      "Campaign ID", "Advertiser Name", "Email", "Phone", "Ad Headline",
      "Placement Type", "Time Slot", "Duration (Days)", "Start Date", "End Date",
      "Target Category", "Target Location", "Base Rate / Day", "Duration Discount",
      "Time Slot Multiplier", "Category Surcharge", "Location Surcharge",
      "Taxable Subtotal", "GST (18%)", "Total Payable (INR)", "Status",
      "Impressions", "Clicks", "CTR (%)", "Created At"
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = [
      headers.join(","),
      ...items.map(c => [
        escapeCsv(c.id),
        escapeCsv(c.advertiserName),
        escapeCsv(c.advertiserEmail),
        escapeCsv(c.advertiserPhone),
        escapeCsv(c.headline),
        escapeCsv(c.placement),
        escapeCsv(c.timeSlot),
        escapeCsv(c.durationDays),
        escapeCsv(c.startDate),
        escapeCsv(c.endDate),
        escapeCsv(c.targetCategory),
        escapeCsv(c.targetLocation),
        escapeCsv(c.pricing?.baseRatePerDay),
        escapeCsv(c.pricing?.durationDiscountAmount),
        escapeCsv(c.pricing?.timeSlotMultiplier),
        escapeCsv(c.pricing?.categoryTargetingFee),
        escapeCsv(c.pricing?.locationTargetingFee),
        escapeCsv(c.pricing?.subtotal),
        escapeCsv(c.pricing?.gstAmount),
        escapeCsv(c.pricing?.totalPayable),
        escapeCsv(c.status),
        escapeCsv(c.stats?.impressions),
        escapeCsv(c.stats?.clicks),
        escapeCsv(c.stats?.ctr),
        escapeCsv(c.createdAt)
      ].join(","))
    ];

    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // JSON Exporter
  const exportAdsToJson = (items: AdCampaign[], filename = "bussinest_ad_campaigns") => {
    const payload = {
      exportTimestamp: new Date().toISOString(),
      totalCampaigns: items.length,
      revenueSummary: metrics,
      campaigns: items
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Hero Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0a275e] to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                Retail Media Network (RMN)
              </span>
              <span className="text-xs text-sky-200 font-mono font-bold flex items-center gap-1">
                <Sparkles size={13} className="text-amber-300" /> High-Margin Advertising Engine
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-heading tracking-tight text-white">
              Ad Runners, Placements & Revenue Management
            </h1>
            <p className="text-xs sm:text-sm text-sky-200/90 mt-1 max-w-2xl">
              Control sitewide ad placements (Popup Modals, Header Sticky Banners, Homepage Hero Spotlight), time-slot dynamic pricing algorithms, and real-time impression telemetry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsAdStudioOpen(true)}
              className="px-5 py-2.5 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-lg shadow-amber-400/30 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
            >
              <Plus size={16} />
              <span>Launch New Campaign Studio</span>
            </button>

            <div className="flex items-center gap-1.5 bg-white/10 p-1 rounded-2xl border border-white/20">
              <button
                onClick={() => exportAdsToCsv(filteredCampaigns)}
                className="px-3 py-1.5 rounded-xl hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Export Filtered Ads to CSV"
              >
                <FileSpreadsheet size={14} className="text-emerald-400" />
                <span>CSV</span>
              </button>

              <button
                onClick={() => exportAdsToJson(filteredCampaigns)}
                className="px-3 py-1.5 rounded-xl hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                title="Export Filtered Ads to JSON"
              >
                <FileJson size={14} className="text-amber-400" />
                <span>JSON</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ad Revenue</span>
            <DollarSign size={16} className="text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            ₹{metrics.totalRev.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">18% GST Compliant</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Active Runners</span>
            <Megaphone size={16} className="text-sky-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.activeCount} <span className="text-xs text-slate-400 font-normal">/ {campaigns.length} Total</span>
          </div>
          <span className="text-[11px] text-sky-600 font-bold">Real-Time Delivery</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Impressions</span>
            <Eye size={16} className="text-indigo-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.totalImpressions.toLocaleString()}
          </div>
          <span className="text-[11px] text-indigo-600 font-bold">Across 6 Placements</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Total Ad Clicks</span>
            <Zap size={16} className="text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.totalClicks.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-700 font-bold">Verified Inquiries</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider">Average CTR</span>
            <TrendingUp size={16} className="text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono">
            {metrics.avgCtr}%
          </div>
          <span className="text-[11px] text-emerald-600 font-bold">+3.2x Industry Standard</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by campaign title, headline, company name, category, or city..."
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
            />
          </div>

          {/* Placement Filter */}
          <select
            value={selectedPlacement}
            onChange={(e) => setSelectedPlacement(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">All Ad Placements</option>
            <option value="popup_modal">Spotlight Popup Modal</option>
            <option value="top_banner">Top Sticky Header Bar</option>
            <option value="hero_spotlight">Hero Spotlight Card</option>
            <option value="category_sponsor">Category Header Banner</option>
            <option value="floating_corner">Floating Corner Pill</option>
            <option value="marketplace_native">Native Promoted Card</option>
          </select>

          {/* Time Slot Filter */}
          <select
            value={selectedTimeSlot}
            onChange={(e) => setSelectedTimeSlot(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">All Time Slots</option>
            <option value="prime_b2b">Prime B2B Hours (09:00 - 19:00)</option>
            <option value="all_day">24/7 Continuous</option>
            <option value="evening_procurement">Evening Procurement</option>
            <option value="weekend_priority">Weekend Priority</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-white"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active Now</option>
            <option value="paused">Paused</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={reloadData}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            title="Refresh Campaigns"
          >
            <RefreshCw size={15} />
          </button>
        </div>
      </div>

      {/* Campaigns Table */}
      <div className="bg-white rounded-2xl border border-sky-100 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4">Ad Creative & Advertiser</th>
                <th className="p-4">Placement</th>
                <th className="p-4">Time Slot & Dates</th>
                <th className="p-4">Targeting</th>
                <th className="p-4">Commercials (INR)</th>
                <th className="p-4">Telemetry (CTR)</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCampaigns.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    No ad campaigns match the selected filters.
                  </td>
                </tr>
              ) : (
                filteredCampaigns.map(c => {
                  const isActive = c.status === "active";
                  const placementConfig = AD_PLACEMENTS[c.placement] || AD_PLACEMENTS.popup_modal;
                  const timeSlotConfig = AD_TIME_SLOTS[c.timeSlot] || AD_TIME_SLOTS.all_day;

                  return (
                    <tr key={c.id} className="hover:bg-sky-50/40 transition-colors group">
                      {/* Ad Creative & Advertiser */}
                      <td className="p-4 min-w-[240px]">
                        <div className="flex items-start gap-3">
                          <img 
                            src={c.bannerImage} 
                            alt={c.headline} 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0" 
                          />
                          <div className="min-w-0">
                            <span className="inline-block text-[9px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase tracking-wider mb-0.5">
                              {c.badgeText || "PROMOTION"}
                            </span>
                            <h4 className="font-bold text-slate-900 text-xs truncate max-w-[200px]" title={c.headline}>
                              {c.headline}
                            </h4>
                            <p className="text-[11px] text-slate-500 truncate max-w-[200px]">
                              {c.advertiserName} • <span className="font-mono">{c.advertiserPhone}</span>
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Placement */}
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">{placementConfig.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono block">₹{placementConfig.baseRatePerDay}/day base</span>
                      </td>

                      {/* Time Slot & Dates */}
                      <td className="p-4">
                        <span className="inline-flex items-center gap-1 font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 text-[11px]">
                          <Clock size={11} /> {timeSlotConfig.name}
                        </span>
                        <p className="text-[10px] text-slate-500 mt-1 font-mono">
                          {c.durationDays}d • {c.startDate.split("T")[0]} to {c.endDate.split("T")[0]}
                        </p>
                      </td>

                      {/* Targeting */}
                      <td className="p-4 text-[11px]">
                        <div className="flex items-center gap-1 text-slate-700 font-medium">
                          <Layers size={11} className="text-sky-600 shrink-0" />
                          <span className="truncate max-w-[130px]">{c.targetCategory}</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500 mt-0.5">
                          <MapPin size={11} className="text-emerald-600 shrink-0" />
                          <span className="truncate max-w-[130px]">{c.targetLocation}</span>
                        </div>
                      </td>

                      {/* Commercials */}
                      <td className="p-4 font-mono">
                        <div className="font-black text-slate-900 text-xs">
                          ₹{c.pricing?.totalPayable?.toLocaleString()}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Net Billed (18% GST)
                        </div>
                      </td>

                      {/* Telemetry */}
                      <td className="p-4 font-mono">
                        <div className="font-bold text-slate-800 text-xs flex items-center gap-2">
                          <span>{c.stats?.impressions.toLocaleString()} views</span>
                          <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">
                            {c.stats?.ctr}% CTR
                          </span>
                        </div>
                        <span className="text-[10px] text-slate-400">{c.stats?.clicks} Clicks recorded</span>
                      </td>

                      {/* Status */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(c.id, c.status)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer inline-flex items-center gap-1 ${
                            isActive 
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200' 
                              : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                          }`}
                          title="Click to toggle status"
                        >
                          {isActive ? <Play size={10} className="fill-emerald-800" /> : <Pause size={10} className="fill-amber-800" />}
                          <span>{c.status}</span>
                        </button>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setPreviewAd(c)}
                            className="p-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 transition-colors"
                            title="Preview Ad Live"
                          >
                            <Eye size={14} />
                          </button>

                          <button
                            onClick={() => exportAdsToCsv([c], `ad_campaign_${c.id}`)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                            title="Download Campaign CSV"
                          >
                            <Download size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Ad Studio Modal Trigger */}
      <AdRunnerModal
        isOpen={isAdStudioOpen}
        onClose={() => {
          setIsAdStudioOpen(false);
          reloadData();
        }}
        currentUser={null}
        onCampaignCreated={() => reloadData()}
      />

      {/* Quick Ad Preview Modal */}
      {previewAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/25 backdrop-blur-sm">
          <div className="bg-white border-2 border-amber-400/80 rounded-3xl p-6 max-w-lg w-full text-slate-900 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setPreviewAd(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X size={16} />
            </button>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase">
                {previewAd.badgeText || "PROMOTED"}
              </span>
              <span className="text-xs text-slate-500 font-mono">{previewAd.placement}</span>
            </div>
            <img src={previewAd.bannerImage} alt={previewAd.headline} className="w-full h-44 rounded-2xl object-cover" />
            <h3 className="text-lg font-black text-slate-900">{previewAd.headline}</h3>
            <p className="text-xs text-slate-600">{previewAd.description}</p>
            <div className="pt-2 flex justify-between items-center border-t border-sky-100">
              <span className="text-xs text-slate-500">Advertiser: {previewAd.advertiserName}</span>
              <button className="px-4 py-2 rounded-xl bg-amber-400 text-slate-950 font-bold text-xs">
                {previewAd.ctaText} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
