import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';

export function AdminTransactions() {
  const api = useAdminApi();
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    const loadData = () => {
      api.getTransactions()
         .then((res: any) => setTxs(res.items || []))
         .catch(console.error);
    };

    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  const columns = [
    { key: 'id', header: 'Transaction ID' },
    { key: 'amount', header: 'Amount', render: (t: any) => `$${t.amount}` },
    { key: 'currency', header: 'Currency' },
    { key: 'status', header: 'Status', render: (t: any) => <StatusBadge status={t.status} /> },
    { key: 'createdAt', header: 'Date', render: (t: any) => new Date(t.createdAt).toLocaleString() },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Transactions</h1>
      <DataTable data={txs} columns={columns} searchPlaceholder="Search transactions..." />
    </div>
  );
}
