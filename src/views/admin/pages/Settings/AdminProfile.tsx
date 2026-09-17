import React, { useState, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { User } from '../../../../types';
import Animated3DLetterAvatar from '../../../../components/Animated3DLetterAvatar';
import { ShieldCheck, Upload, Check, Sparkles, Building2, Lock, Phone, Mail, Award, Eye, Key } from 'lucide-react';

export function AdminProfile() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  if (!currentUser) return null;

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Saved admin details
  const savedDataStr = localStorage.getItem(`vendorMatchUserData_${currentUser.id}`);
  const savedData = savedDataStr ? JSON.parse(savedDataStr) : {};

  const [useCustomAvatar, setUseCustomAvatar] = useState<boolean>(
    savedData.useCustomAvatar !== undefined ? savedData.useCustomAvatar : (currentUser.useCustomAvatar || false)
  );
  const [customAvatar, setCustomAvatar] = useState<string>(
    savedData.customAvatar || currentUser.customAvatar || currentUser.avatar || ""
  );

  const [name, setName] = useState(savedData.name || currentUser.name || "Operations Lead");
  const [designation, setDesignation] = useState(savedData.designation || currentUser.designation || "Executive Platform Director");
  const [department, setDepartment] = useState(savedData.department || currentUser.department || "Platform Governance & Trust");
  const [clearance, setClearance] = useState(savedData.adminClearance || "Tier 5 (Super Administrator)");
  const [phone, setPhone] = useState(savedData.phone || currentUser.phone || "+91 80 4000 8899");
  const [jurisdiction, setJurisdiction] = useState(savedData.city || "Pan-India Operations HQ, Bangalore");
  const [description, setDescription] = useState(savedData.description || "Authorized platform authority with full jurisdiction over KYC verifications, escrow authorizations, dispute resolutions, and vendor compliance standards.");

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setCustomAvatar(dataUrl);
          setUseCustomAvatar(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedData: any = {
      name,
      designation,
      department,
      adminClearance: clearance,
      phone,
      city: jurisdiction,
      description,
      customAvatar,
      useCustomAvatar,
    };

    localStorage.setItem(`vendorMatchUserData_${currentUser.id}`, JSON.stringify(updatedData));
    Object.assign(currentUser, updatedData);

    fetch("/api/auth/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, ...updatedData }),
    }).catch(() => {});

    window.dispatchEvent(new Event("user_updated"));
    window.dispatchEvent(new Event("storage"));

    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }, 400);
  };

  return (
    <div className="p-6 max-w-4xl bg-white rounded-3xl border border-sky-100 shadow-sm mt-6 mx-auto animate-in fade-in duration-200">
      <div className="gold-line-animated h-[3px] rounded-t-full mb-6"></div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-widest text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md flex items-center gap-1.5 w-max mb-1">
            <Lock size={11} /> High Security Administrative Credential
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900">Administrator Authority Profile</h1>
          <p className="text-slate-500 font-medium text-sm mt-0.5">Manage administrative credentials, official authorization seal, and governance contacts.</p>
        </div>

        <div className="bg-amber-50 border border-amber-200 text-amber-900 px-3.5 py-1.5 rounded-xl text-xs font-black flex items-center gap-2">
          <ShieldCheck size={16} className="text-amber-600" />
          <span>Security Level: Tier 5</span>
        </div>
      </div>

      {saveSuccess && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center gap-3 animate-in fade-in duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <Check size={18} />
          </div>
          <div>
            <h4 className="font-black text-sm">Admin Credentials Saved!</h4>
            <p className="text-xs text-emerald-700 font-medium">Your administrator avatar seal and authority profile have been updated.</p>
          </div>
        </div>
      )}

      {/* Admin Seal / Avatar Switcher */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 border border-amber-200/80 mb-8">
        <h3 className="text-xs font-black uppercase tracking-widest text-amber-900 mb-4 flex items-center gap-2">
          <Sparkles size={14} className="text-amber-600" /> Admin Seal & Biometric Visual
        </h3>

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="relative shrink-0 p-1 bg-white rounded-full shadow-md border-2 border-amber-300">
            <Animated3DLetterAvatar 
              role="admin" 
              size="2xl" 
              customImage={useCustomAvatar ? customAvatar : undefined}
              useCustomAvatar={useCustomAvatar}
            />
          </div>

          <div className="flex-1 text-center sm:text-left space-y-3">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageFileChange}
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden" 
              />
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="neo-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-800 hover:text-amber-800 flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Upload size={14} className="text-amber-600" /> Upload Official Seal / Photo
              </button>

              <button
                type="button"
                onClick={() => setUseCustomAvatar(false)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !useCustomAvatar 
                    ? "bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20" 
                    : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                Default 3D Avatar (A)
              </button>

              {customAvatar && (
                <button
                  type="button"
                  onClick={() => setUseCustomAvatar(true)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    useCustomAvatar 
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" 
                      : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  Use Uploaded Seal
                </button>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              {useCustomAvatar && customAvatar 
                ? "Using your custom administrative security seal." 
                : "Using hardware-accelerated 3D rotating gold token (A)."}
            </p>
          </div>
        </div>
      </div>

      {/* Admin Details Form */}
      <form onSubmit={handleSaveProfile} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Full Name *</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Administrative Email</label>
            <input 
              type="email" 
              defaultValue={currentUser.email} 
              disabled 
              className="w-full rounded-xl border border-slate-200 bg-slate-100 text-slate-500 p-3 text-sm font-semibold cursor-not-allowed" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Official Title & Role</label>
            <input 
              type="text" 
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              placeholder="Executive Platform Director"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Governance Department</label>
            <select 
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option>Platform Governance & Trust</option>
              <option>Escrow Settlements & Financial Controls</option>
              <option>KYC Compliance & Regulatory Audit</option>
              <option>Dispute Resolution Tribunal</option>
              <option>Infrastructure Operations & Security</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Security Clearance</label>
            <select 
              value={clearance}
              onChange={(e) => setClearance(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
            >
              <option>Tier 5 (Super Administrator)</option>
              <option>Tier 4 (Executive Compliance Auditor)</option>
              <option>Tier 3 (Escrow & Settlement Officer)</option>
              <option>Tier 2 (Trust & Safety Moderator)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Direct Dispatch Phone</label>
            <input 
              type="text" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Regional Operational Jurisdiction</label>
            <input 
              type="text" 
              value={jurisdiction}
              onChange={(e) => setJurisdiction(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500" 
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Authority Charter & Governance Scope</label>
            <textarea 
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-semibold outline-none focus:ring-2 focus:ring-amber-500" 
            />
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex items-center justify-end gap-3">
          <button 
            type="submit"
            disabled={isSaving}
            className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-8 py-3 rounded-xl transition-colors shadow-md cursor-pointer disabled:opacity-50"
          >
            {isSaving ? "Saving..." : "Save Admin Credentials"}
          </button>
        </div>
      </form>
    </div>
  );
}
export default AdminProfile;
