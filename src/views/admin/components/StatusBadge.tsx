import React from 'react';

export function StatusBadge({ status }: { status: string }) {
  if (!status) return <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 uppercase text-xs font-bold">UNKNOWN</span>;
  const s = status.toLowerCase();
  
  let color = "bg-gray-100 text-gray-800";
  if (s === "pending" || s === "open") color = "bg-yellow-100 text-yellow-800";
  if (s === "approved" || s === "verified" || s === "success" || s === "resolved") color = "bg-green-100 text-green-800";
  if (s === "rejected" || s === "failed") color = "bg-red-100 text-red-800";

  return <span className={`px-2 py-1 rounded uppercase text-xs font-bold ${color}`}>{status}</span>;
}
