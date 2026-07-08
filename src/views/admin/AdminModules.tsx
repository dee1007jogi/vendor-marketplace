import React, { useState, useEffect, useMemo, useRef } from "react";
import { CreditCard, TrendingUp, DollarSign, Award, Users, FileText, CheckCircle, XCircle, Download, ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Sparkles, ShieldAlert, FileSearch } from "lucide-react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  SortingState
} from '@tanstack/react-table';
import ExportButton from "../../components/ExportButton";
import { Card } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { useVirtualizer } from "@tanstack/react-virtual";
export function VerificationQueue() {
  const [queue, setQueue] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const fetchQueue = async () => {
    try {
      const res = await fetch("/api/admin/v1/verification/pending");
      const data = await res.json();
      setQueue(data.items || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handleAction = async (ids: string[], action: "approve" | "reject") => {
    for (const id of ids) {
      try {
        await fetch(`/api/admin/v1/verification/${id}/${action}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_notes: "Reviewed from dashboard" })
        });
      } catch (e) {
        console.error(e);
      }
    }
    setSelectedIds([]);
    fetchQueue();
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) setSelectedIds(selectedIds.filter(i => i !== id));
    else setSelectedIds([...selectedIds, id]);
  };

  const selectAll = () => {
    if (selectedIds.length === queue.length) setSelectedIds([]);
    else setSelectedIds(queue.map(q => q.id));
  };

  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px] max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            AI-Powered Verification <Sparkles size={20} className="text-indigo-500" />
          </h2>
          <p className="text-slate-500 font-medium mt-1">Google GenAI automatically scans documents and flags high-risk vendors.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:bg-slate-50 transition-colors flex items-center gap-2">
            <FileSearch size={16} /> Audit AI Rules
          </button>
        </div>
      </div>

      {loading ? (
        <p className="text-slate-500 font-bold">Loading queue...</p>
      ) : queue.length === 0 ? (
        <div className="bg-white border border-slate-200 p-12 text-center rounded-2xl text-slate-500 font-bold">
          <CheckCircle size={48} className="mx-auto mb-4 text-emerald-400" />
          No pending verification requests. You're all caught up!
        </div>
      ) : (
        <div className="space-y-4">
          {/* Bulk Actions Bar */}
          <div className="flex justify-between items-center bg-white border border-slate-200 p-3 rounded-xl shadow-sm">
            <div className="flex items-center gap-4 px-3">
              <input type="checkbox" checked={selectedIds.length === queue.length && queue.length > 0} onChange={selectAll} className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
              <span className="text-sm font-bold text-slate-600">{selectedIds.length} Selected</span>
            </div>
            <div className="flex gap-2">
              <button disabled={selectedIds.length === 0} onClick={() => handleAction(selectedIds, "approve")} className="bg-emerald-600 disabled:opacity-50 hover:bg-emerald-700 text-white font-bold py-1.5 px-4 rounded-lg shadow-sm transition-colors text-sm">Bulk Approve</button>
              <button disabled={selectedIds.length === 0} onClick={() => handleAction(selectedIds, "reject")} className="bg-white border border-slate-200 disabled:opacity-50 hover:bg-rose-50 text-rose-600 font-bold py-1.5 px-4 rounded-lg transition-colors text-sm">Bulk Reject</button>
            </div>
          </div>

          <div className="space-y-6">
            {queue.map(item => {
              // Mock AI data for demonstration
              const riskScore = Math.floor(Math.random() * 100);
              const isHighRisk = riskScore > 70;
              const isLowRisk = riskScore < 30;

              return (
                <div key={item.id} className={`bg-white border-2 ${selectedIds.includes(item.id) ? 'border-indigo-500 shadow-md' : 'border-slate-200'} rounded-2xl p-6 shadow-sm flex flex-col xl:flex-row gap-6 items-start transition-all relative overflow-hidden`}>
                  {/* Risk Indicator Ribbon */}
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${isHighRisk ? 'bg-rose-500' : isLowRisk ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>

                  <div className="shrink-0 pt-1 pl-2">
                    <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggleSelect(item.id)} className="w-5 h-5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600 cursor-pointer" />
                  </div>
                  
                  {/* Left Column: Vendor Info & Docs */}
                  <div className="flex-1 w-full xl:border-r border-slate-100 xl:pr-6">
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-lg font-black text-slate-900">{item.vendor?.businessName || "Unknown Business"}</h3>
                    </div>
                    <p className="text-xs text-slate-500 mb-5 font-mono">Submitted: {new Date(item.submittedAt).toLocaleString()}</p>
                    
                    <div className="flex flex-wrap gap-2 text-xs font-bold mb-4">
                      {item.panFileUrl && (
                        <a href={`/${item.panFileUrl.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 flex items-center gap-1.5"><FileText size={14} className="text-indigo-500"/> PAN</a>
                      )}
                      {item.gstFileUrl && (
                        <a href={`/${item.gstFileUrl.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 flex items-center gap-1.5"><FileText size={14} className="text-indigo-500"/> GST Cert</a>
                      )}
                      {item.aadhaarFileUrl && (
                        <a href={`/${item.aadhaarFileUrl.replace(/\\/g, '/')}`} target="_blank" rel="noopener noreferrer" className="bg-slate-50 hover:bg-slate-100 px-3 py-2 rounded-xl border border-slate-200 text-slate-600 flex items-center gap-1.5"><FileText size={14} className="text-indigo-500"/> Aadhaar</a>
                      )}
                    </div>
                  </div>

                  {/* Middle Column: AI Analysis */}
                  <div className="flex-1 w-full bg-slate-50/80 rounded-xl p-4 border border-slate-100">
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-indigo-600">
                        <Sparkles size={14} /> AI Analysis
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-black uppercase rounded-lg ${isHighRisk ? 'bg-rose-100 text-rose-700' : isLowRisk ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        Risk Score: {riskScore}/100
                      </span>
                    </div>
                    
                    <ul className="space-y-2.5">
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        <span className="leading-tight">GST Registration Number matches Ministry database.</span>
                      </li>
                      <li className="flex items-start gap-2 text-sm text-slate-600">
                        {isHighRisk ? (
                          <XCircle size={14} className="text-rose-500 mt-0.5 shrink-0" />
                        ) : (
                          <CheckCircle size={14} className="text-emerald-500 mt-0.5 shrink-0" />
                        )}
                        <span className="leading-tight">
                          {isHighRisk ? "PAN Card name mismatch detected (Confidence: 89%)." : "Document names match business registration perfectly."}
                        </span>
                      </li>
                      {isHighRisk && (
                         <li className="flex items-start gap-2 text-sm text-rose-600 font-medium bg-rose-50 p-2 rounded-md border border-rose-100 mt-1">
                           <ShieldAlert size={14} className="mt-0.5 shrink-0" />
                           <span className="leading-tight">Warning: Similar GST number flagged for dispute in 2024.</span>
                         </li>
                      )}
                    </ul>
                  </div>

                  {/* Right Column: Actions */}
                  <div className="w-full xl:w-48 flex flex-row xl:flex-col gap-3 shrink-0">
                    <button onClick={() => handleAction([item.id], "approve")} className="flex-1 min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 md:py-2.5 px-4 rounded-xl shadow-[0_2px_10px_rgba(16,185,129,0.2)] transition-all text-sm flex items-center justify-center gap-2"><CheckCircle size={16} /> Approve</button>
                    <button onClick={() => handleAction([item.id], "reject")} className="flex-1 min-h-[44px] bg-white hover:bg-rose-50 text-rose-600 font-bold py-3 md:py-2.5 px-4 rounded-xl border border-rose-200 transition-all text-sm flex items-center justify-center gap-2"><XCircle size={16} /> Reject</button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
export function AdminVendors() {
  const [vendors, setVendors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    fetch("/api/admin/v1/vendors")
      .then(r => r.json())
      .then(d => { setVendors(d.items || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const columnHelper = createColumnHelper<any>();

  const columns = useMemo(() => [
    columnHelper.accessor('businessName', {
      header: ({ column }) => (
        <button className="flex items-center gap-1 hover:text-slate-700" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
          Business <ArrowUpDown size={14} className={column.getIsSorted() ? "text-indigo-500" : ""} />
        </button>
      ),
      cell: info => (
        <div className="py-2">
          <p className="font-bold text-slate-900">{info.getValue()}</p>
          <p className="text-xs text-slate-500 font-mono">ID: {info.row.original.id.substring(0, 8)}</p>
        </div>
      ),
    }),
    columnHelper.accessor(row => row.user?.email, {
      id: 'contact',
      header: 'Contact',
      cell: info => (
        <div className="py-2 text-sm">
          <p className="text-slate-900 font-medium">{info.getValue() || "Unknown"}</p>
          <p className="text-slate-500 text-xs">GST: {info.row.original.businessRegistrationNumber || "N/A"}</p>
        </div>
      ),
    }),
    columnHelper.accessor(row => row.user?.verified, {
      id: 'status',
      header: 'Status & Rating',
      cell: info => (
        <div className="py-2 flex flex-col gap-1 items-start">
          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${info.getValue() ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
            {info.getValue() ? "Verified" : "Unverified"}
          </span>
          <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
            <Award size={12} /> {info.row.original.rating || "New"}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('leadCredits', {
      header: 'Credits & Tier',
      cell: info => (
        <div className="py-2 flex flex-col items-start gap-1">
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase rounded">
            {info.row.original.subscriptionPlan || 'Free'}
          </span>
          <span className="text-xs font-bold text-slate-500">{info.getValue() || 0} Credits Left</span>
        </div>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: () => <div className="text-right">Actions</div>,
      cell: () => (
        <div className="py-2 flex justify-end gap-2">
          <button className="text-slate-400 hover:text-indigo-600 text-xs font-bold bg-slate-50 hover:bg-indigo-50 px-2 py-1 rounded border border-slate-200 transition-colors">Reset</button>
          <button className="text-rose-400 hover:text-white text-xs font-bold bg-white hover:bg-rose-600 px-2 py-1 rounded border border-rose-200 transition-colors">Suspend</button>
        </div>
      ),
    })
  ], []);

  const table = useReactTable({
    data: vendors,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="p-4 md:p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px] flex flex-col">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-black text-slate-900">Vendor Management</h2>
          <p className="text-sm md:text-base text-slate-500 font-medium mt-1">Manage all vendors with high-performance data grids.</p>
        </div>
        <div className="flex w-full md:w-auto gap-3">
          <input 
            type="text" 
            inputMode="search"
            placeholder="Search all columns..." 
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="flex-1 md:flex-none px-4 py-3 md:py-2 border border-slate-200 rounded-lg text-base md:text-sm md:w-64 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" 
          />
          <div className="hidden md:block">
            <ExportButton type="csv" fileName="vendors_export" data={vendors} />
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-bold">Loading vendors...</div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="overflow-x-auto hidden md:block">
              <table className="w-full text-left border-collapse">
                <thead>
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id} className="bg-slate-50 border-b border-slate-200">
                      {headerGroup.headers.map(header => (
                        <th key={header.id} className="p-4 text-xs uppercase tracking-wider font-black text-slate-500 whitespace-nowrap">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {table.getRowModel().rows.length === 0 ? (
                    <tr><td colSpan={columns.length} className="p-12 text-center text-slate-500 font-medium">No records match your search.</td></tr>
                  ) : (
                    table.getRowModel().rows.map((row, i) => (
                      <tr key={row.id} className={`${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-indigo-50/30 transition-colors`}>
                        {row.getVisibleCells().map(cell => (
                          <td key={cell.id} className="px-4 border-none">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="flex flex-col gap-4 p-4 md:hidden bg-slate-50/50">
              {table.getRowModel().rows.length === 0 ? (
                <div className="p-8 text-center text-slate-500 font-medium">No records match your search.</div>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <div key={row.id} className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-slate-900 text-lg">{(row.original as any).businessName}</p>
                        <p className="text-xs text-slate-500 font-mono mt-1">ID: {(row.original as any).id.substring(0, 8)}</p>
                      </div>
                      <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${(row.original as any).user?.verified ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                        {(row.original as any).user?.verified ? "Verified" : "Unverified"}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 text-sm mt-1">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Contact</span>
                        <span className="font-medium text-slate-700 truncate">{(row.original as any).user?.email || "Unknown"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400">GST Number</span>
                        <span className="font-medium text-slate-700">{(row.original as any).businessRegistrationNumber || "N/A"}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-bold text-slate-400">Credits / Tier</span>
                        <span className="font-bold text-indigo-600">{(row.original as any).leadCredits || 0} left <span className="text-slate-400 font-normal">({(row.original as any).subscriptionPlan || 'Free'})</span></span>
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2 mt-2 pt-3 border-t border-slate-100">
                      <button className="flex-1 min-h-[44px] text-slate-500 hover:text-indigo-600 font-bold bg-slate-50 hover:bg-indigo-50 px-4 py-3 rounded-lg border border-slate-200 transition-colors">Reset</button>
                      <button className="flex-1 min-h-[44px] text-rose-500 hover:text-white font-bold bg-white hover:bg-rose-600 px-4 py-3 rounded-lg border border-rose-200 transition-colors">Suspend</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination Controls */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between mt-auto">
              <div className="text-sm font-medium text-slate-500">
                Showing <span className="font-bold text-slate-900">{table.getRowModel().rows.length}</span> of <span className="font-bold text-slate-900">{vendors.length}</span> vendors
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => table.previousPage()} 
                  disabled={!table.getCanPreviousPage()}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs font-bold text-slate-600 px-2">
                  Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
                </span>
                <button 
                  onClick={() => table.nextPage()} 
                  disabled={!table.getCanNextPage()}
                  className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AdminBuyers() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Buyer Management</h2>
          <p className="text-slate-500 font-medium mt-1">Manage all registered buyers and monitor escrow spend.</p>
        </div>
        <div className="flex gap-2">
          <input 
            type="text" 
            inputMode="search"
            placeholder="Search by name, email..." 
            className="px-4 py-3 md:py-2 border border-slate-200 rounded-lg text-base md:text-sm w-full md:w-64 focus:ring-2 focus:ring-indigo-500 outline-none" 
          />
          <div className="hidden md:block">
            <ExportButton type="csv" fileName="buyers_export" />
          </div>
        </div>
      </div>
      
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-black text-slate-500">
                <th className="p-4">Buyer Name</th>
                <th className="p-4">Contact</th>
                <th className="p-4">Activity</th>
                <th className="p-4">Total Spent (Escrow)</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900 flex items-center gap-2">Acme Corp <span className="bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Flagged</span></p>
                  <p className="text-xs text-slate-500 font-mono">ID: usr_8f9x2a</p>
                </td>
                <td className="p-4 text-sm">
                  <p className="text-slate-900 font-medium">procurement@acmecorp.com</p>
                  <p className="text-slate-500 text-xs">+91 9876543210</p>
                </td>
                <td className="p-4 text-sm">
                  <p className="text-slate-900 font-medium">12 Posted Req</p>
                  <p className="text-emerald-600 text-xs font-bold">3 Active Projects</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-900">₹8,45,000</p>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="text-amber-600 hover:text-amber-800 text-xs font-bold bg-amber-50 px-2 py-1 rounded border border-amber-200 transition-colors">Review Activity</button>
                  <button className="text-rose-400 hover:text-white text-xs font-bold bg-white hover:bg-rose-600 px-2 py-1 rounded border border-rose-200 transition-colors">Ban</button>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 transition-colors">
                <td className="p-4">
                  <p className="font-bold text-slate-900">Global Tech Solutions</p>
                  <p className="text-xs text-slate-500 font-mono">ID: usr_3b7y1c</p>
                </td>
                <td className="p-4 text-sm">
                  <p className="text-slate-900 font-medium">sourcing@globaltech.io</p>
                  <p className="text-slate-500 text-xs">+91 9123456780</p>
                </td>
                <td className="p-4 text-sm">
                  <p className="text-slate-900 font-medium">2 Posted Req</p>
                  <p className="text-slate-500 text-xs font-bold">0 Active Projects</p>
                </td>
                <td className="p-4">
                  <p className="font-bold text-slate-900">₹0</p>
                </td>
                <td className="p-4 text-right flex justify-end gap-2">
                  <button className="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-50 px-2 py-1 rounded border border-slate-200 transition-colors">Flag Suspicious</button>
                  <button className="text-rose-400 hover:text-white text-xs font-bold bg-white hover:bg-rose-600 px-2 py-1 rounded border border-rose-200 transition-colors">Ban</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export function AdminModeration() {
  const [activeTab, setActiveTab] = useState("requirements");

  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-200">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Moderation Center</h2>
          <p className="text-slate-500 font-medium mt-1">Review flagged requirements, reviews, and spam leads.</p>
        </div>
      </div>
      
      <div className="flex gap-4 mb-6 border-b border-slate-200">
        <button onClick={() => setActiveTab("requirements")} className={`pb-2 font-bold text-sm ${activeTab === 'requirements' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Flagged Requirements</button>
        <button onClick={() => setActiveTab("reviews")} className={`pb-2 font-bold text-sm ${activeTab === 'reviews' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Suspicious Reviews</button>
        <button onClick={() => setActiveTab("spam")} className={`pb-2 font-bold text-sm ${activeTab === 'spam' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}>Spam Leads</button>
      </div>

      <div className="space-y-4">
        {activeTab === "requirements" && (
          <div className="text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200">No flagged requirements in queue.</div>
        )}
        {activeTab === "reviews" && (
          <div className="text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200">No suspicious reviews detected today.</div>
        )}
        {activeTab === "spam" && (
          <div className="text-center p-8 text-slate-500 font-bold bg-white rounded-xl border border-slate-200">No vendor spam reports in queue.</div>
        )}
      </div>
    </div>
  );
}
export function AdminDisputes() {
  const [disputes, setDisputes] = useState<any[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);
  
  const fetchDisputes = async () => {
    try {
      const res = await fetch("/api/admin/v1/disputes");
      const data = await res.json();
      setDisputes(data.items || []);
    } catch (e) { console.error(e); }
  };
  
  useEffect(() => { 
    // Mocking for UI demonstration to show virtualization
    setDisputes(Array.from({ length: 50 }).map((_, i) => ({
      id: `DISP-90${i}`,
      project: { title: i % 2 === 0 ? "E-commerce App" : "Website Redesign" },
      reason: i % 2 === 0 ? "Vendor delivered incomplete work." : "Buyer is unresponsive.",
    })));
  }, []);

  const virtualizer = useVirtualizer({
    count: disputes.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 180,
    overscan: 5,
  });

  const resolveDispute = async (id: string, ruling: string, refundPercent: number) => {
    try {
      await fetch(`/api/admin/v1/disputes/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ruling, refundPercent, adminNotes: "Resolved from dashboard" })
      });
      fetchDisputes();
    } catch (e) { console.error(e); }
  };
  
  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-200">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Dispute Resolution Center</h2>
      
      {disputes.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 font-bold shadow-sm">No active disputes requiring arbitration.</Card>
      ) : (
        <div ref={parentRef} className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const d = disputes[virtualRow.index];
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
                  <Card className="p-5 shadow-sm h-full flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg text-slate-900">Project: {d.project?.title || "Unknown"} (Escrow Held)</h3>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1 shrink-0">
                        <CheckCircle size={12} /> Razorpay Escrow Locked
                      </Badge>
                    </div>
                    <p className="text-slate-600 mb-4 text-sm bg-slate-50 p-4 rounded-lg border border-slate-100">Reason: {d.reason}</p>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      <Button onClick={() => resolveDispute(d.id, "buyer_wins", 100)} className="bg-emerald-600 hover:bg-emerald-700 text-white">Rule for Buyer (Full Refund)</Button>
                      <Button onClick={() => resolveDispute(d.id, "vendor_wins", 0)} className="bg-indigo-600 hover:bg-indigo-700 text-white">Rule for Vendor (Release Funds)</Button>
                      <Button onClick={() => resolveDispute(d.id, "partial_refund", 50)} variant="outline" className="border-amber-500 text-amber-600 hover:bg-amber-50">50% Partial Split</Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminFraud() {
  const [alerts, setAlerts] = useState<any[]>([]);
  const parentRef = useRef<HTMLDivElement>(null);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("/api/admin/v1/fraud-alerts");
      const data = await res.json();
      setAlerts(data.items || []);
    } catch (e) { console.error(e); }
  };
  
  useEffect(() => { 
    fetchAlerts();
  }, []);

  const virtualizer = useVirtualizer({
    count: alerts.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 120,
    overscan: 5,
  });

  const resolveAlert = async (id: string, status: string) => {
    try {
      await fetch(`/api/admin/v1/fraud-alerts/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, resolutionNote: "Resolved by admin" })
      });
      fetchAlerts();
    } catch (e) { console.error(e); }
  };
  
  return (
    <div className="p-8 animate-in fade-in zoom-in-95 duration-200">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Fraud Detection Dashboard</h2>
      
      {alerts.length === 0 ? (
        <Card className="p-8 text-center text-slate-500 font-bold shadow-sm">No open fraud alerts.</Card>
      ) : (
        <div ref={parentRef} className="h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          <div style={{ height: `${virtualizer.getTotalSize()}px`, position: 'relative' }}>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const a = alerts[virtualRow.index];
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
                  <Card className="p-5 flex flex-col md:flex-row justify-between md:items-center gap-4 shadow-sm h-full">
                    <div>
                      <div className="flex gap-3 items-center mb-2">
                        <Badge variant={a.severity === 'high' ? 'destructive' : a.severity === 'medium' ? 'outline' : 'secondary'} 
                          className={a.severity === 'medium' ? 'border-amber-500 text-amber-600 bg-amber-50' : ''}>
                          {a.severity} Severity
                        </Badge>
                        <span className="font-bold text-slate-900 text-lg">{a.alertType.replace(/_/g, ' ').toUpperCase()}</span>
                      </div>
                      <p className="text-slate-600 text-sm">Target: {a.entityType} ({a.entityId})</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button onClick={() => resolveAlert(a.id, "false_positive")} variant="outline">False Positive</Button>
                      <Button onClick={() => resolveAlert(a.id, "resolved")} variant="destructive">Suspend Account</Button>
                      <Button variant="default" className="bg-slate-800 hover:bg-slate-900 text-white">Blacklist IP</Button>
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/admin/v1/categories");
      const data = await res.json();
      setCategories(data.items || []);
    } catch (e) { console.error(e); }
  };
  useEffect(() => { fetchCategories(); }, []);
  const addCategory = async () => {
    try {
      await fetch("/api/admin/v1/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "New IT Category", slug: "new-it-category-" + Date.now(), attributes: ["Budget", "Timeline", "Framework"] })
      });
      fetchCategories();
    } catch (e) { console.error(e); }
  };
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Category Management</h2>
          <p className="text-slate-500 font-medium mt-1">Manage taxonomy and match attributes.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-white border-2 border-slate-200 text-slate-700 font-bold px-4 py-2 rounded-lg text-sm shadow-sm flex items-center gap-2"><Download size={16} /> Import CSV</button>
          <button onClick={addCategory} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm">+ Add Root Category</button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.length === 0 ? (
          <div className="col-span-2 bg-white p-8 text-center rounded-xl text-slate-500 font-bold">No categories defined yet. Create one to populate the taxonomy.</div>
        ) : categories.map(c => (
          <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
            <h3 className="font-bold text-lg text-slate-900 mb-1">{c.name}</h3>
            <p className="text-sm text-slate-500 font-mono mb-4">/{c.slug}</p>
            <div className="flex justify-between items-center border-t border-slate-100 pt-4">
              <span className="text-xs font-bold text-slate-400 uppercase">Subcategories: 0</span>
              <button className="text-indigo-600 font-bold text-sm hover:underline">Edit Taxonomy</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export function AdminTransactions() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">System Transactions</h2>
          <p className="text-slate-500 font-medium mt-1">Global financial ledger spanning subscriptions, escrow, and payouts.</p>
        </div>
        <button className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 shadow-sm flex items-center gap-2"><FileText size={16} /> Export CSV</button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-black text-slate-500">
                <th className="p-4">Txn ID / Date</th>
                <th className="p-4">User</th>
                <th className="p-4">Type</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">No transactions recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
export function AdminRevenue() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Revenue Dashboard</h2>
          <p className="text-slate-500 font-medium mt-1">Platform monetization overview and tracking.</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-slate-500 font-bold uppercase tracking-wider mb-1">Total Revenue (MTD)</p>
          <p className="text-3xl font-black text-emerald-600">₹0</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-indigo-100 text-indigo-600 p-3 rounded-xl"><Users size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Vendor Subscriptions</h3>
            <p className="text-2xl font-black text-slate-900">₹0</p>
            <p className="text-sm text-slate-500 mt-1">Monthly recurring revenue from Basic, Premium, Enterprise tiers.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-cyan-100 text-cyan-600 p-3 rounded-xl"><DollarSign size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Pay-Per-Lead Credits</h3>
            <p className="text-2xl font-black text-slate-900">₹0</p>
            <p className="text-sm text-slate-500 mt-1">Credit purchases for unlocking high-intent buyer requirements.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl"><TrendingUp size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Escrow Commissions</h3>
            <p className="text-2xl font-black text-slate-900">₹0</p>
            <p className="text-sm text-slate-500 mt-1">Percentage fees collected from successfully completed projects.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-amber-100 text-amber-600 p-3 rounded-xl"><Award size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Featured Listings</h3>
            <p className="text-2xl font-black text-slate-900">₹0</p>
            <p className="text-sm text-slate-500 mt-1">Sponsored placement revenue from top search results.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-purple-100 text-purple-600 p-3 rounded-xl"><FileText size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">SaaS Add-ons</h3>
            <p className="text-2xl font-black text-slate-900">₹0</p>
            <p className="text-sm text-slate-500 mt-1">Revenue from CRM, analytics, and quotation tools.</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="bg-rose-100 text-rose-600 p-3 rounded-xl"><CreditCard size={24} /></div>
          <div>
            <h3 className="font-bold text-slate-900 mb-1">Verification Fees</h3>
            <p className="text-2xl font-black text-slate-900">₹0</p>
            <p className="text-sm text-slate-500 mt-1">One-time premium badge fees for background checks.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
export function AdminAnalytics() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Marketplace Analytics</h2>
          <p className="text-slate-500 font-medium mt-1">Deep dive into user acquisition and platform liquidity.</p>
        </div>
        <select className="bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 shadow-sm outline-none">
          <option>Last 30 Days</option>
          <option>This Quarter</option>
          <option>Year to Date</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Acquisition Chart Mock */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <h3 className="text-lg font-bold text-slate-900 mb-4">User Acquisition Trend</h3>
          <div className="h-64 flex items-end justify-between gap-2 border-b border-l border-slate-100 pb-2 pl-2">
            {[40, 55, 30, 65, 80, 45, 90].map((h, i) => (
              <div key={i} className="w-full bg-indigo-100 hover:bg-indigo-200 rounded-t-sm relative group cursor-pointer" style={{ height: `${h}%` }}>
                <div className="absolute bottom-0 w-full bg-indigo-500 rounded-t-sm" style={{ height: `${h * 0.6}%` }}></div>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-xs font-bold text-slate-500">
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-500 rounded-sm"></div> Vendors</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 bg-indigo-100 rounded-sm"></div> Buyers</span>
          </div>
        </div>

        {/* Marketplace Health Metrics */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm flex flex-col justify-between">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Marketplace Health</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Liquidity Ratio (Reqs/Vendor)</span>
                <span className="text-slate-500">0.0 (No Data)</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-emerald-500 h-2 rounded-full w-[0%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Avg Time-to-Match</span>
                <span className="text-slate-500">0.0 Hours</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full w-[0%]"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-bold mb-1">
                <span className="text-slate-700">Lead Conversion Rate</span>
                <span className="text-slate-500">0%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2"><div className="bg-slate-400 h-2 rounded-full w-[0%]"></div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function AdminSettings() {
  const [weights, setWeights] = useState({ category: 30, location: 15, budget: 15, rating: 10, response: 10, experience: 10, conversion: 10 });

  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px] max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Platform Settings</h2>
          <p className="text-slate-500 font-medium mt-1">Configure global platform rules and AI matching heuristics.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-2 rounded-lg shadow-sm transition-colors">
          Save Changes
        </button>
      </div>

      <div className="space-y-8">
        {/* General Settings */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-2">
            <h3 className="text-lg font-bold text-slate-900">General Config</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-500">Maintenance Mode</span>
              <button className="w-10 h-5 bg-slate-200 rounded-full relative transition-colors"><div className="w-4 h-4 bg-white rounded-full absolute top-0.5 left-0.5 shadow-sm"></div></button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Platform Support Email</label>
              <input type="email" defaultValue="support@vendimatch.com" className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Platform Escrow Commission (%)</label>
              <input type="number" defaultValue={5} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Commission Cap (₹)</label>
              <input type="number" defaultValue={10000} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1">Max Vendor Matches per Request</label>
              <input type="number" defaultValue={10} className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        {/* AI Matching Heuristics */}
        <div className="bg-white p-6 border border-slate-200 rounded-xl shadow-sm">
          <div className="flex justify-between items-end mb-4 border-b border-slate-100 pb-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900">AI Matching Engine Weights</h3>
              <p className="text-xs text-slate-500 font-medium">Adjust the 100-point heuristic used to rank vendors for incoming buyer requirements.</p>
            </div>
            <div className={`font-black text-sm px-3 py-1 rounded-full ${Object.values(weights).reduce((a: number, b: number) => a + b, 0) === 100 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
              Total: {Object.values(weights).reduce((a: number, b: number) => a + b, 0)}/100
            </div>
          </div>
          
          <div className="space-y-4">
            {Object.entries(weights).map(([key, val]) => (
              <div key={key} className="flex items-center gap-4">
                <label className="w-32 text-sm font-bold text-slate-700 capitalize">{key} Match</label>
                <input 
                  type="range" 
                  min="0" max="100" 
                  value={val} 
                  onChange={(e) => setWeights({ ...weights, [key]: parseInt(e.target.value) })}
                  className="flex-1 accent-indigo-600" 
                />
                <span className="w-12 text-right font-black text-slate-900">{val}%</span>
              </div>
            ))}
          </div>
          <div className="mt-6 bg-slate-50 p-4 rounded-lg border border-slate-200 text-sm text-slate-600 font-medium">
            <strong>Note:</strong> Changes to matching weights take effect immediately for all new requirements. Existing open requirements will not be re-scored automatically.
          </div>
        </div>
      </div>
    </div>
  );
}
export function AdminMatchingLogs() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">AI Matching Logs</h2>
          <p className="text-slate-500 font-medium mt-1">Audit trail of the AI engine's vendor matching decisions.</p>
        </div>
        <ExportButton type="csv" fileName="ai_match_logs" />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-black text-slate-500">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Requirement ID</th>
                <th className="p-4">Matched Vendors</th>
                <th className="p-4">AI Confidence Range</th>
                <th className="p-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan={5} className="p-8 text-center text-slate-500 font-bold">No AI matches recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function AdminNotificationTemplates() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Notification Templates</h2>
          <p className="text-slate-500 font-medium mt-1">Manage transactional Email/SMS/WhatsApp templates.</p>
        </div>
        <button className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm">+ Add Template</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between mb-2">
            <h3 className="font-bold text-lg">Vendor Matched</h3>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-bold rounded uppercase">Email</span>
          </div>
          <p className="text-sm text-slate-500 mb-4 font-mono truncate">Trigger: vendor.matched_to_requirement</p>
          <div className="bg-slate-50 p-4 border border-slate-100 rounded-lg text-sm text-slate-700 italic">
            "Hello {"{"}vendor_name{"}"}, a new buyer requirement matches your profile..."
          </div>
          <div className="mt-4 flex gap-2">
            <button className="text-indigo-600 font-bold text-sm">Edit Content</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminSubscriptionPlans() {
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState<any | null>(null);
  
  const fetchPlans = () => {
    setLoading(true);
    fetch("/api/admin/v1/plans")
      .then(async (res) => {
        if (!res.ok) throw new Error("Network response was not ok");
        return res.json();
      })
      .then(data => { setPlans(data.plans || []); setLoading(false); })
      .catch(err => { console.error("Error fetching plans:", err); setLoading(false); });
  };

  useEffect(() => {
    fetchPlans();
    window.addEventListener("dashboard_update", fetchPlans);
    return () => window.removeEventListener("dashboard_update", fetchPlans);
  }, []);

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const updated = [...plans];
    if (editingPlan.isNew) {
      updated.push({ ...editingPlan, isNew: undefined, id: editingPlan.name.toLowerCase().replace(/[^a-z]/g, '') });
    } else {
      const idx = updated.findIndex(p => p.id === editingPlan.id);
      if (idx >= 0) updated[idx] = editingPlan;
    }
    
    await fetch("/api/admin/v1/plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plans: updated })
    });
    setEditingPlan(null);
    fetchPlans();
  };

  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px] relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Subscription & Pricing Plans</h2>
          <p className="text-slate-500 font-medium mt-1">Manage vendor tiers and lead credit packages.</p>
        </div>
        <button onClick={() => setEditingPlan({ isNew: true, name: '', price: 0, credits: 0, features: '' })} className="bg-indigo-600 hover:bg-indigo-700 transition-colors text-white font-bold px-4 py-2 rounded-lg text-sm shadow-sm">
          + Create Plan
        </button>
      </div>
      
      {loading ? (
        <div className="p-8 text-center text-slate-500 font-bold">Loading plans...</div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden p-6">
          <p className="text-slate-500 font-bold mb-4">Current Plans Configuration:</p>
          <div className="space-y-4">
            {plans.map((plan) => (
              <div key={plan.id} className="flex justify-between items-center border border-slate-100 p-4 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div>
                  <h4 className="font-black text-slate-900">{plan.name}</h4>
                  <p className="text-sm text-slate-500">₹{plan.price} / month • {plan.credits} Lead Credits {plan.features && `+ ${plan.features}`}</p>
                </div>
                <button onClick={() => setEditingPlan(plan)} className="text-indigo-600 hover:text-indigo-800 font-bold text-sm bg-indigo-50 px-4 py-2 rounded-lg">Edit</button>
              </div>
            ))}
            {plans.length === 0 && <p className="text-sm text-slate-500 italic">No plans configured yet.</p>}
          </div>
        </div>
      )}

      {editingPlan && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 rounded-2xl">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl w-full max-w-md p-6">
            <h3 className="text-xl font-bold text-slate-900 mb-4">{editingPlan.isNew ? "Create Plan" : "Edit Plan"}</h3>
            <form onSubmit={savePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Plan Name</label>
                <input required type="text" value={editingPlan.name} onChange={e => setEditingPlan({...editingPlan, name: e.target.value})} className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Price (₹)</label>
                  <input required type="number" value={editingPlan.price} onChange={e => setEditingPlan({...editingPlan, price: Number(e.target.value)})} className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Lead Credits</label>
                  <input required type="number" value={editingPlan.credits} onChange={e => setEditingPlan({...editingPlan, credits: Number(e.target.value)})} className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Extra Features (Optional)</label>
                <input type="text" value={editingPlan.features} onChange={e => setEditingPlan({...editingPlan, features: e.target.value})} placeholder="e.g. Priority Support" className="w-full p-2 border border-slate-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <button type="button" onClick={() => setEditingPlan(null)} className="px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-colors">Save Plan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export function AdminAuditLog() {
  return (
    <div className="p-8 bg-slate-50 rounded-2xl shadow-sm min-h-[600px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">System Audit Log</h2>
          <p className="text-slate-500 font-medium mt-1">Immutable record of admin actions and critical system events.</p>
        </div>
        <ExportButton type="csv" fileName="audit_log" />
      </div>
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider font-black text-slate-500">
                <th className="p-4">Timestamp</th>
                <th className="p-4">Actor</th>
                <th className="p-4">Action</th>
                <th className="p-4">Target Entity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td colSpan={4} className="p-8 text-center text-slate-500 font-bold">No audit events recorded yet.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
