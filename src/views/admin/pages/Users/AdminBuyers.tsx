import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { DataTable } from '../../components/DataTable';

export function AdminBuyers() {
  const api = useAdminApi();
  const [buyers, setBuyers] = useState<any[]>([]);

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
    { key: 'name', header: 'Name', render: (b: any) => b.name || b.fullName || 'Unknown' },
    { key: 'email', header: 'Email' },
    { key: 'phone', header: 'Phone', render: (b: any) => b.phone || 'N/A' },
    { key: 'createdAt', header: 'Joined', render: (b: any) => new Date(b.createdAt).toLocaleDateString() },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Buyers</h1>
      <DataTable data={buyers} columns={columns} searchPlaceholder="Search buyers..." />
    </div>
  );
}
