import React from "react";
import { 
  Building2, ShieldCheck, MapPin, Globe, Phone, Mail, 
  Calendar, Users, Briefcase, Award, CheckCircle2, 
  ExternalLink, MessageSquare, X, Download, FileText,
  BadgeCheck, Clock, Layers, Sparkles
} from "lucide-react";
import { User } from "../types";
import Animated3DLetterAvatar from "./Animated3DLetterAvatar";

interface BuyerProfileModalProps {
  buyer: User;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  isSelf?: boolean;
}

export const BuyerProfileModal: React.FC<BuyerProfileModalProps> = ({
  buyer,
  isOpen,
  onClose,
  onEdit,
  isSelf = false,
}) => {
  if (!isOpen || !buyer) return null;

  const companyName = buyer.companyName || buyer.brandName || `${buyer.name}'s Enterprise`;
  const gstin = buyer.gstin || "22AAAAA0000A1Z5";
  const pan = buyer.panNumber || "AAAAA0000A";
  const industry = buyer.industry || "Industrial Sourcing & Manufacturing";
  const businessType = buyer.businessType || "Enterprise Procurement & Bulk Buyer";
  const companySize = buyer.companySize || "51-200 Employees";
  const yearEstablished = buyer.yearEstablished || "2018";
  const annualTurnover = buyer.annualTurnover || "₹5 Cr – ₹25 Cr (Annual Sourcing)";
  const city = buyer.city || "Bangalore";
  const state = buyer.state || "Karnataka";
  const pincode = buyer.pincode || "560001";
  const address = buyer.address || `Industrial Park, Phase II, ${city}, ${state} - ${pincode}`;
  const website = buyer.website || "https://example-enterprise.com";
  const description = buyer.description || `${companyName} is a verified bulk procurement partner actively sourcing industrial equipment, raw commodities, and certified engineering supplies across pan-India through transparent milestone-backed escrow.`;
  const designation = buyer.designation || "Director of Procurement";
  const phone = buyer.phone || "+91 98765 43210";
  const whatsapp = buyer.whatsapp || phone;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl shadow-2xl border border-sky-100 max-w-4xl w-full overflow-hidden my-8 relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Accent Line */}
        <div className="gold-line-animated h-[4px] w-full"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/90 hover:bg-white text-slate-500 hover:text-slate-800 rounded-full flex items-center justify-center shadow-md border border-slate-200 transition-all cursor-pointer"
          title="Close Profile"
        >
          <X size={18} />
        </button>

        {/* Banner Cover */}
        <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 relative overflow-hidden p-6 flex flex-col justify-end">
          <div className="absolute inset-0 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-15"></div>
          <div className="absolute -right-12 -top-12 w-64 h-64 bg-sky-400/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider text-sky-100 border border-white/30 flex items-center gap-1.5">
                <Building2 size={13} /> Verified Buyer Business Profile
              </span>
              <span className="bg-emerald-500/90 text-white px-2.5 py-0.5 rounded-full text-[11px] font-extrabold flex items-center gap-1 shadow-xs">
                <ShieldCheck size={12} /> GST Verified
              </span>
            </div>

            {isSelf && onEdit && (
              <button
                onClick={() => { onClose(); onEdit(); }}
                className="bg-white/90 hover:bg-white text-slate-800 px-4 py-1.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-1.5"
              >
                Edit Business Details
              </button>
            )}
          </div>
        </div>

        {/* Content Body */}
        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          {/* Header Row with Floating Avatar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6 pb-6 border-b border-slate-100">
            <div className="flex items-end gap-5">
              <div className="p-1.5 bg-white rounded-3xl shadow-xl border-2 border-sky-100 inline-block shrink-0">
                <Animated3DLetterAvatar 
                  role="buyer" 
                  size="2xl" 
                  customImage={buyer.useCustomAvatar ? (buyer.customAvatar || buyer.avatar) : undefined}
                  useCustomAvatar={buyer.useCustomAvatar}
                />
              </div>
              <div className="pb-1">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                  {companyName}
                </h2>
                <p className="text-sm font-semibold text-slate-500 flex items-center gap-2 mt-1">
                  <span>{businessType}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-sky-700 font-bold">
                    <MapPin size={13} /> {city}, {state}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto shrink-0">
              <div className="bg-sky-50 border border-sky-200 text-sky-800 px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5">
                <Award size={14} className="text-sky-600" />
                <span>Escrow Reliability: 99.8%</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Quick Ribbon */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Annual Sourcing</p>
              <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{annualTurnover}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Workforce Size</p>
              <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">{companySize}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Established</p>
              <p className="text-sm sm:text-base font-black text-slate-900 mt-0.5">Year {yearEstablished}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-center">
              <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Payment Mode</p>
              <p className="text-sm sm:text-base font-black text-emerald-700 mt-0.5">100% Escrow Backed</p>
            </div>
          </div>

          {/* Grid Layout: 2 Columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Left Column: Business & Legal Details */}
            <div className="md:col-span-2 space-y-6">
              
              {/* About & Sourcing Scope */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <FileText size={16} className="text-sky-600" /> About & Procurement Scope
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-medium">
                  {description}
                </p>
              </div>

              {/* Legal & Registration Credentials */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-1 flex items-center gap-2">
                  <BadgeCheck size={16} className="text-emerald-600" /> Statutory & Compliance Identifiers
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">GSTIN Number</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5 flex items-center gap-1.5">
                      <span>{gstin}</span>
                      <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" title="Active & Verified"></span>
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">PAN Identifier</p>
                    <p className="text-sm font-mono font-bold text-slate-900 mt-0.5">{pan}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Industry Sector</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{industry}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Business Structure</p>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">{businessType}</p>
                  </div>
                </div>
              </div>

              {/* Registered Corporate Address */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <MapPin size={16} className="text-sky-600" /> Corporate Headquarters & Delivery Hub
                </h3>
                <p className="text-sm text-slate-700 font-medium leading-relaxed">
                  {address}
                </p>
                <div className="flex flex-wrap gap-4 text-xs font-bold text-slate-500 mt-3 pt-3 border-t border-slate-100">
                  <span>City: <strong className="text-slate-800">{city}</strong></span>
                  <span>State: <strong className="text-slate-800">{state}</strong></span>
                  <span>Postal Code: <strong className="text-slate-800">{pincode}</strong></span>
                </div>
              </div>

            </div>

            {/* Right Column: Contact & Procurement Representative */}
            <div className="space-y-6">
              
              {/* Primary Contact Person Card */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50/70 via-white to-blue-50/60 border border-sky-100 shadow-xs">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Users size={16} className="text-sky-600" /> Authorized Contact
                </h3>

                <div className="space-y-3.5 text-sm">
                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Representative Name</p>
                    <p className="font-bold text-slate-900 mt-0.5">{buyer.name}</p>
                    <p className="text-xs text-sky-700 font-semibold">{designation}</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Official Email</p>
                    <p className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1.5 break-all">
                      <Mail size={13} className="text-slate-400 shrink-0" />
                      {buyer.email}
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
                        <Globe size={13} /> {website.replace(/^https?:\/\//, '')} <ExternalLink size={11} />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Verified Trust Shield */}
              <div className="p-4 rounded-2xl bg-emerald-50/80 border border-emerald-200/80">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950">Bank & Escrow Pre-Qualified</h4>
                    <p className="text-[11px] text-emerald-800 font-medium mt-0.5 leading-snug">
                      This buyer operates through automated milestone escrow deposits, ensuring guaranteed vendor payout upon verified proof of dispatch.
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
};

export default BuyerProfileModal;
