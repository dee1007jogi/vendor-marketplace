import React, { useEffect, useState } from 'react';
import { useAdminApi } from '../../hooks/useAdminApi';
import { DataTable } from '../../components/DataTable';

export function AdminCategories() {
  const api = useAdminApi();
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    api.getCategories()
       .then((res: any) => setCategories(res.items || []))
       .catch(console.error);
  }, []);

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'slug', header: 'Slug' },
    { key: 'icon', header: 'Icon', render: (c: any) => <span className="font-mono bg-gray-100 px-2 py-1 rounded">{c.icon || 'none'}</span> },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
        <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Add Category</button>
      </div>
      <DataTable data={categories} columns={columns} searchPlaceholder="Search categories..." />
    </div>
  );
}
