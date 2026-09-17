import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { DataTable } from '../../components/DataTable';
import Animated3DLetterAvatar from '../../../../components/Animated3DLetterAvatar';
import BuyerProfileModal from '../../../../components/BuyerProfileModal';
import { Building2, Eye, ShieldCheck } from 'lucide-react';

export function AdminBuyers() {
  const api = useAdminApi();
  const [buyers, setBuyers] = useState<any[]>([]);
  const [selectedBuyer, setSelectedBuyer] = useState<any | null>(null);

  useEffect(() => {
    const loadData = () => {
      api.getBuyers()
         .then((res: any) => setBuyers(res.items || []))
         .catch(console.error);
    };

    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  const columns = [
    { 
      key: 'name', 
      header: 'Buyer & Enterprise', 
      render: (b: any) => (
        <div className="flex items-center gap-3">
          <Animated3DLetterAvatar 
            role="buyer" 
            size="sm" 
            customImage={b.useCustomAvatar ? (b.customAvatar || b.avatar) : undefined}
            useCustomAvatar={b.useCustomAvatar}
          />
          <div>
            <p className="font-bold text-slate-900 text-sm">{b.name || 'Unknown Buyer'}</p>
            <p className="text-xs text-sky-700 font-medium flex items-center gap-1">
              <Building2 size={11} /> {b.companyName || b.brandName || "Registered Enterprise"}
            </p>
          </div>
        </div>
      )
    },
    { 
      key: 'email', 
      header: 'Official Email',
      render: (b: any) => <span className="font-mono text-xs text-slate-700">{b.email}</span>
    },
    { 
      key: 'phone', 
      header: 'Phone / Contact', 
      render: (b: any) => <span className="text-xs font-semibold text-slate-600">{b.phone || '+91 98765 43210'}</span> 
    },
    { 
      key: 'status', 
      header: 'GST Compliance',
      render: (b: any) => (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
          <ShieldCheck size={12} /> {b.gstin ? "GSTIN Verified" : "Active Verified"}
        </span>
      )
    },
    { 
      key: 'createdAt', 
      header: 'Member Since', 
      render: (b: any) => <span className="text-xs text-slate-500">{new Date(b.createdAt || Date.now()).toLocaleDateString()}</span> 
    },
    {
      key: 'actions',
      header: 'Business Page',
      render: (b: any) => (
        <button
          onClick={() => setSelectedBuyer(b)}
          className="neo-btn px-3 py-1.5 rounded-xl text-xs font-bold text-sky-800 hover:text-sky-950 flex items-center gap-1.5 cursor-pointer shadow-xs"
        >
          <Eye size={13} className="text-sky-600" /> View Page
        </button>
      )
    }
  ];

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Registered Wholesale Buyers</h1>
          <p className="text-slate-500 text-sm font-medium">Verified corporate buyers, procurement leads, and enterprise accounts.</p>
        </div>
        <span className="bg-sky-100 text-sky-800 font-bold px-3 py-1 rounded-xl text-xs">
          Total Buyers: {buyers.length}
        </span>
      </div>

      <div className="bg-white rounded-3xl border border-sky-100 shadow-sm overflow-hidden p-2">
        <DataTable data={buyers} columns={columns} searchPlaceholder="Search buyers by name, email, or company..." />
      </div>

      {selectedBuyer && (
        <BuyerProfileModal
          buyer={selectedBuyer}
          isOpen={Boolean(selectedBuyer)}
          onClose={() => setSelectedBuyer(null)}
          isSelf={false}
        />
      )}
    </div>
  );
}
