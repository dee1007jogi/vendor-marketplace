import axios from 'axios';

const API_BASE = '/api/admin/v1';

export const useAdminApi = () => {
  const fetchWithAuth = async (endpoint: string, options?: RequestInit) => {
    const token = localStorage.getItem('accessToken') || '';
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options?.headers,
      },
    });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  return {
    // Verification
    getVerificationQueue: () => fetchWithAuth('/verification/pending'),
    approveVendor: (vendorId: string) => fetchWithAuth(`/verification/${vendorId}/approve`, { method: 'POST', body: JSON.stringify({ admin_notes: 'Approved via new portal' }) }),
    rejectVendor: (vendorId: string, reason: string) => 
      fetchWithAuth(`/verification/${vendorId}/reject`, { method: 'POST', body: JSON.stringify({ reason }) }),

    // Disputes
    getDisputes: () => fetchWithAuth('/disputes'),
    resolveDispute: (disputeId: string, action: 'release' | 'refund') => 
      fetchWithAuth(`/disputes/${disputeId}/resolve`, { method: 'POST', body: JSON.stringify({ ruling: action }) }),

    // Settings (AI Weights)
    getSettings: () => fetchWithAuth('/settings'),
    updateSettings: (payload: any) => fetchWithAuth('/settings', { method: 'PUT', body: JSON.stringify(payload) }),

    // Analytics
    getAnalytics: (period: 'daily' | 'monthly') => fetchWithAuth(`/analytics?period=${period}`),

    // CRUD
    getVendors: () => fetchWithAuth('/vendors'),
    getBuyers: () => fetchWithAuth('/buyers'),
    getCategories: () => fetchWithAuth('/categories'),
    getTransactions: () => fetchWithAuth('/transactions'),
  };
};
