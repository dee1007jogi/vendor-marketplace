import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useAdminApi } from '../../../hooks/useAdminApi';

export function RevenueChart() {
  const api = useAdminApi();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      api.getAnalytics('monthly').then((res) => {
        setData(res.revenueTrend || []);
        setLoading(false);
      }).catch((e) => {
        console.error(e);
        setLoading(false);
      });
    };
    
    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  if (loading) return <div className="bg-white p-6 rounded-xl shadow h-[300px] flex items-center justify-center">Loading chart...</div>;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Month-to-Date (MTD) Revenue</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
          <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#6B7280" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `$${val}`} />
          <Tooltip formatter={(value) => `$${value}`} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
          <Legend iconType="circle" />
          <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
          <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
