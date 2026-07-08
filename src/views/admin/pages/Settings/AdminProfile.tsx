import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../../../types';

export function AdminProfile() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();

  if (!currentUser) return null;

  return (
    <div className="p-6 max-w-2xl bg-white rounded-lg shadow mt-6 mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Profile</h1>
      <div className="flex items-center gap-6 mb-8">
        <img src={currentUser.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover shadow-sm" />
        <div>
          <h2 className="text-2xl font-bold text-slate-900">{currentUser.name}</h2>
          <p className="text-slate-500">{currentUser.email}</p>
          <span className="inline-block mt-2 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">{currentUser.role}</span>
        </div>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Full Name</label>
          <input type="text" defaultValue={currentUser.name} readOnly className="block w-full rounded-lg border-slate-200 bg-slate-50 p-3 border outline-none" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-1">Email Address</label>
          <input type="email" defaultValue={currentUser.email} readOnly className="block w-full rounded-lg border-slate-200 bg-slate-50 p-3 border outline-none" />
        </div>
        <div className="pt-4">
          <button className="bg-indigo-600 font-bold text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm" onClick={() => alert("Profile updates are currently disabled in the admin demo.")}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
