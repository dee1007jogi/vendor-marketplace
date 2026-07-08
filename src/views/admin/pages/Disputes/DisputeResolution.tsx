import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { StatusBadge } from '../../components/StatusBadge';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

export function DisputeResolution() {
  const api = useAdminApi();
  const [disputes, setDisputes] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      api.getDisputes()
         .then((res: any) => setDisputes(res.items || []))
         .catch(console.error);
    };

    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  const handleResolve = async (disputeId: string, action: 'release' | 'refund') => {
    if (confirm(`Are you sure you want to ${action} funds for this dispute?`)) {
      try {
        await api.resolveDispute(disputeId, action);
        setDisputes(disputes.map(d => d.id === disputeId ? { ...d, status: 'resolved', ruling: action } : d));
      } catch (e) {
        alert("Failed to resolve dispute");
      }
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-100 text-indigo-600 p-2 rounded-xl">
          <ShieldCheck size={24} />
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Escrow Disputes</h1>
      </div>
      
      {disputes.length === 0 ? (
        <div className="bg-white/50 border-2 border-dashed border-slate-200 p-12 rounded-2xl flex flex-col items-center justify-center text-center backdrop-blur-sm">
          <div className="bg-emerald-100 text-emerald-600 p-4 rounded-full mb-4 ring-8 ring-emerald-50">
            <CheckCircle2 size={32} />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">All clear!</h3>
          <p className="text-slate-500 max-w-sm">There are no active disputes requiring your attention. The platform is running smoothly.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {disputes.map((d: any) => (
            <div key={d.id} className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center gap-6 group">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <p className="font-semibold text-lg">Project ID: {d.projectId}</p>
                  <StatusBadge status={d.status} />
                </div>
                <p className="text-sm text-gray-600 mb-1"><span className="font-medium">Filed by:</span> {d.raisedById}</p>
                <p className="text-sm text-gray-800"><span className="font-medium">Reason:</span> {d.reason}</p>
                {d.ruling && <p className="text-sm text-indigo-600 mt-2 font-medium">Ruling: {d.ruling}</p>}
              </div>
              {d.status === 'pending' && (
                <div className="flex gap-3 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleResolve(d.id, 'release')} className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-4 py-2 rounded-xl hover:bg-emerald-600 hover:text-white font-bold transition-all text-sm shadow-sm">Release Funds</button>
                  <button onClick={() => handleResolve(d.id, 'refund')} className="bg-rose-50 text-rose-700 border border-rose-200 px-4 py-2 rounded-xl hover:bg-rose-600 hover:text-white font-bold transition-all text-sm shadow-sm">Refund Buyer</button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
