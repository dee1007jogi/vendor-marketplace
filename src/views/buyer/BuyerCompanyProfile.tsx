import React, { useState } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import { 
  Building2, ShieldCheck, MapPin, Globe, Phone, Mail, 
  Calendar, Users, Briefcase, Award, CheckCircle2, Clock,
  ExternalLink, MessageSquare, Edit3, Download, FileText,
  BadgeCheck, Sparkles, PlusCircle, ArrowUpRight
} from "lucide-react";
import { User } from "../../types";
import Animated3DLetterAvatar from "../../components/Animated3DLetterAvatar";

export default function BuyerCompanyProfile() {
  const { currentUser } = useOutletContext<{ currentUser: User }>();
  const navigate = useNavigate();

  if (!currentUser) return null;

  const companyName = currentUser.companyName || currentUser.brandName || `${currentUser.name}'s Enterprise`;
  const gstin = currentUser.gstin || "22AAAAA0000A1Z5";
  const pan = currentUser.panNumber || "AAAAA0000A";
  const industry = currentUser.industry || "Industrial Sourcing & Manufacturing";
  const businessType = currentUser.businessType || "Enterprise Bulk Procurement";
  const companySize = currentUser.companySize || "51-200 Employees";
  const yearEstablished = currentUser.yearEstablished || "2018";
  const annualTurnover = currentUser.annualTurnover || "₹5 Cr – ₹25 Cr (Annual Sourcing)";
  const city = currentUser.city || "Bangalore";
  const state = currentUser.state || "Karnataka";
  const pincode = currentUser.pincode || "560001";
  const address = currentUser.address || `Industrial Zone, Phase II, ${city}, ${state} - ${pincode}`;
  const website = currentUser.website || "https://example-enterprise.com";
  const description = currentUser.description || `${companyName} is a verified bulk procurement partner actively sourcing industrial machinery, raw metals, electronic components, and packaging supplies across pan-India through transparent milestone-backed escrow.`;
  const designation = currentUser.designation || "Director of Procurement";
  const phone = currentUser.phone || "+91 98765 43210";
  const whatsapp = currentUser.whatsapp || phone;

  return (
    <div className="animate-in fade-in zoom-in-95 duration-200 pb-20 max-w-6xl mx-auto">
      
      {/* Top Breadcrumb & Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-sky-700 flex items-center gap-1.5 mb-1">
            <Building2 size={13} /> Corporate Identity & Trust Dossier
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Company Business Page
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">
            This is your live verified B2B public profile visible to matched manufacturers and vendors.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => navigate("/buyer/settings")}
            className="neo-btn px-4 py-2.5 rounded-xl font-bold text-xs text-slate-700 hover:text-sky-800 flex items-center gap-1.5 cursor-pointer"
          >
            <Edit3 size={14} /> Edit Business Profile
          </button>
          <button
            onClick={() => navigate("/post-requirement")}
            className="neo-btn-primary px-4 py-2.5 rounded-xl font-black text-xs flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <PlusCircle size={14} /> Post Requirement
          </button>
        </div>
      </div>

      {/* Main Profile Presentation Container */}
      <div className="neo-card rounded-3xl overflow-hidden shadow-lg border border-sky-100 bg-white">
        
        {/* Cover Hero Banner */}
        <div className="h-48 sm:h-60 w-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 relative overflow-hidden p-6 sm:p-8 flex flex-col justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-20"></div>
          <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
          
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-sky-100 border border-white/30 flex items-center gap-1.5">
                <ShieldCheck size={13} /> Official B2B Buyer
              </span>
              <span className="bg-emerald-500 text-white px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                <CheckCircle2 size={12} /> Active Escrow Depositor
              </span>
            </div>
            <span className="text-white/80 font-mono text-xs font-semibold">ID: {currentUser.id.slice(0, 10)}</span>
          </div>

          <div className="relative z-10 text-white flex flex-wrap items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <Award size={13} className="text-amber-300" /> CRISIL Credit Assessed: AAA (99.4%)
            </span>
            <span className="flex items-center gap-1 bg-black/20 backdrop-blur-sm px-3 py-1 rounded-xl">
              <Clock size={13} className="text-sky-300" /> Avg Quote Response: &lt; 3 Hours
            </span>
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="p-6 sm:p-10 relative">
          
          {/* Header Row with Floating Avatar Token */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 -mt-20 sm:-mt-24 mb-8 pb-8 border-b border-slate-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5">
              <div className="p-1.5 bg-white rounded-3xl shadow-2xl border-2 border-sky-100 shrink-0">
                <Animated3DLetterAvatar 
                  role="buyer" 
                  size="2xl" 
                  customImage={currentUser.useCustomAvatar ? (currentUser.customAvatar || currentUser.avatar) : undefined}
                  useCustomAvatar={currentUser.useCustomAvatar}
                />
              </div>

              <div className="pt-2">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                    {companyName}
                  </h2>
                  <span className="bg-sky-100 text-sky-800 text-xs font-extrabold px-2.5 py-0.5 rounded-full border border-sky-200">
                    Verified Buyer
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-500 flex flex-wrap items-center gap-2">
                  <span>{businessType}</span>
                  <span>•</span>
                  <span>{industry}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-sky-700 font-bold">
                    <MapPin size={13} /> {city}, {state}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/buyer/settings")}
                className="neo-btn px-4 py-2 rounded-xl text-xs font-bold text-slate-700 hover:text-sky-800 flex items-center gap-1.5 cursor-pointer"
              >
                <Edit3 size={13} /> Manage Settings
              </button>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-8">
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Annual Sourcing</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">{annualTurnover}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Team / Employees</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">{companySize}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-sky-50/60 to-white border border-sky-100 text-center">
              <p className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">Established</p>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">Year {yearEstablished}</p>
            </div>
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50/60 to-white border border-emerald-100 text-center">
              <p className="text-[11px] font-extrabold text-emerald-600 uppercase tracking-wider">Escrow Performance</p>
              <p className="text-base sm:text-lg font-black text-emerald-700 mt-1">100% Reliable</p>
            </div>
          </div>

          {/* Two Columns: Left Details, Right Contact */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left 2 Columns */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* About & Sourcing Focus */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileText size={16} className="text-sky-600" /> Enterprise Profile & Procurement Focus
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {description}
                </p>
              </div>

              {/* Statutory & Tax Identifiers */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80 space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <BadgeCheck size={16} className="text-emerald-600" /> Statutory & Compliance Identifiers
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">GSTIN Number</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5 flex items-center gap-2">
                      <span>{gstin}</span>
                      <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">VERIFIED</span>
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Permanent Account No. (PAN)</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{pan}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Industry Sector</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{industry}</p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Business Entity Type</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{businessType}</p>
                  </div>
                </div>
              </div>

              {/* Corporate Headquarters Address */}
              <div className="neo-card p-6 rounded-2xl bg-white border border-slate-200/80">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-sky-600" /> Corporate Headquarters & Receiving Facility
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {address}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>City: <strong className="text-slate-800">{city}</strong></span>
                  <span>State: <strong className="text-slate-800">{state}</strong></span>
                  <span>PIN: <strong className="text-slate-800">{pincode}</strong></span>
                </div>
              </div>

            </div>

            {/* Right Column: Contact Officer & Trust Cards */}
            <div className="space-y-6">
              
              {/* Officer Card */}
              <div className="neo-card p-6 rounded-2xl bg-gradient-to-br from-sky-50/80 via-white to-blue-50/50 border border-sky-100 shadow-sm">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={16} className="text-sky-600" /> Authorized Contact
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Representative</p>
                    <p className="font-bold text-slate-900 mt-0.5">{currentUser.name}</p>
                    <p className="text-xs text-sky-700 font-semibold">{designation}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Official Email</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5 break-all">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      {currentUser.email}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Direct Business Phone</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <Phone size={13} className="text-slate-400 shrink-0" />
                      {phone}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">WhatsApp Line</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5">
                      <MessageSquare size={13} className="text-emerald-600 shrink-0" />
                      {whatsapp}
                    </p>
                  </div>

                  {website && (
                    <div className="pt-2 border-t border-sky-100">
                      <a
                        href={website.startsWith("http") ? website : `https://${website}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-700 hover:text-sky-900 underline"
                      >
                        <Globe size={13} /> {website.replace(/^https?:\/\//, '')} <ArrowUpRight size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Escrow Assurance Pill */}
              <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950">Guaranteed Escrow Sourcing</h4>
                    <p className="text-[11px] text-emerald-800 font-medium mt-1 leading-snug">
                      All purchase orders awarded by this buyer are securely funded in Bussinest Verified Escrow before production commences.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
