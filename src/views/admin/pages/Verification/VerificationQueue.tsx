import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useAdminApi } from '../../hooks/useAdminApi';

export function VerificationQueue() {
  const api = useAdminApi();
  const [vendors, setVendors] = useState<any[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<any>(null);

  useEffect(() => {
    const loadData = () => {
      api.getVerificationQueue()
         .then((res: any) => setVendors(res.items || []))
         .catch(console.error);
    };

    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  const columns = [
    { key: 'vendor', header: 'Company', render: (item: any) => item.vendor?.companyName || item.vendor?.businessName || 'Unknown' },
    { key: 'createdAt', header: 'Date', render: (item: any) => new Date(item.createdAt).toLocaleDateString() },
    { 
      key: 'status', 
      header: 'Status',
      render: (item: any) => <StatusBadge status={item.status} />
    },
    { 
      key: 'actions', 
      header: 'Actions',
      render: (item: any) => (
        <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full justify-end">
          <button 
            onClick={(e) => { e.stopPropagation(); handleApprove(item); }} 
            disabled={item.status !== 'pending'} 
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg font-bold disabled:opacity-50 transition-colors"
          >
            Approve
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); setSelectedVendor(item); }} 
            disabled={item.status !== 'pending'} 
            className="flex-1 sm:flex-none min-h-[44px] px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg font-bold disabled:opacity-50 transition-colors"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  const handleApprove = async (vendor: any) => {
    if (confirm(`Approve verification for ${vendor.vendor?.companyName || 'this vendor'}?`)) {
      try {
        await api.approveVendor(vendor.id);
        setVendors(vendors.map(v => v.id === vendor.id ? { ...v, status: 'approved' } : v));
      } catch (e) {
        alert("Approval failed");
      }
    }
  };

  const handleReject = async (reason: string) => {
    if (selectedVendor) {
      try {
        await api.rejectVendor(selectedVendor.id, reason);
        setVendors(vendors.map(v => v.id === selectedVendor.id ? { ...v, status: 'rejected' } : v));
        setSelectedVendor(null);
      } catch (e) {
        alert("Rejection failed");
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Vendor Verification Queue</h1>
      <DataTable data={vendors} columns={columns} searchPlaceholder="Search verification requests..." />
      <ConfirmDialog 
        open={!!selectedVendor} 
        onClose={() => setSelectedVendor(null)} 
        onConfirm={handleReject}
        title={`Reject Verification`}
      >
        <p className="mb-2 text-sm text-gray-600">Please provide a reason for rejecting this vendor's verification request:</p>
        <textarea placeholder="Reason for rejection..." className="w-full border p-2 rounded focus:ring-2 focus:ring-indigo-500 outline-none" rows={3} />
      </ConfirmDialog>
    </div>
  );
}
