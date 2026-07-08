import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';

export function PlatformSettings() {
  const api = useAdminApi();
  const [weights, setWeights] = useState({ category: 30, location: 15, rating: 25, budget: 30 });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getSettings().then((data) => {
      if (data && data.category !== undefined) setWeights(data);
    }).catch(console.error);
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      await api.updateSettings(weights);
      alert('Settings saved successfully!');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: number) => {
    const newWeights = { ...weights, [key]: value };
    setWeights(newWeights as any);
  };

  const total = Object.values(weights).reduce((a, b) => Number(a) + Number(b), 0);

  return (
    <div className="p-6 max-w-2xl bg-white rounded-lg shadow mt-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">AI Matching Engine Weights</h1>
      <div className="space-y-6">
        {Object.entries(weights).map(([key, val]) => (
          <div key={key} className="flex items-center gap-4">
            <label className="w-32 capitalize font-medium text-gray-700">{key}</label>
            <input
              type="range"
              min="0"
              max="100"
              value={val}
              onChange={(e) => handleChange(key, parseInt(e.target.value))}
              className="flex-1 accent-indigo-600"
            />
            <span className="w-12 text-center text-gray-600">{val}%</span>
          </div>
        ))}
        <div className={`text-sm font-bold ${total === 100 ? 'text-green-600' : 'text-red-600'}`}>
          Total: {total}% {total !== 100 && "(Must equal 100%)"}
        </div>
        <button
          onClick={handleSave}
          disabled={loading || total !== 100}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition"
        >
          {loading ? 'Saving...' : 'Save Weights'}
        </button>
      </div>
    </div>
  );
}
