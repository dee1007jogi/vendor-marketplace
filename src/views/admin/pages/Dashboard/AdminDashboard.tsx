import React from 'react';
import { RevenueChart } from './components/RevenueChart';

export function AdminDashboard() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500">Welcome back. Here is your marketplace overview.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <RevenueChart />
        <div className="bg-white p-6 rounded-xl shadow flex flex-col justify-center items-center text-gray-500 text-center">
          <p className="font-semibold text-lg mb-2">Metrics Grid</p>
          <p className="text-sm">Additional dashboard widgets can be added here.</p>
        </div>
      </div>
    </div>
  );
}
