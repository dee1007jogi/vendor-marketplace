import { Zap, ShieldCheck, Award, Lock, Mail, Percent, Gift, ArrowUp } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-b from-sky-50/95 via-white to-sky-100/60 text-slate-700 mt-auto border-t border-sky-200/60 backdrop-blur-xl shadow-lg shadow-sky-950/5 animate-entrance-up">
      {/* Luxury Animated Gold Line across the top of footer */}
      <div className="gold-line-animated" />

      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 pt-12 pb-24 md:pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-sky-200/60">
          
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="h-8 w-8 rounded-2xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-600/20">
                <Zap size={16} className="fill-amber-300 stroke-amber-300" />
              </div>
              <span className="text-slate-900 font-black text-lg tracking-tight font-heading">Bussinest B2B</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed mb-4 font-medium">
              India's premier AI-powered B2B wholesale marketplace connecting verified manufacturers, bulk suppliers, and industrial buyers with 50/50 Milestone Escrow.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full badge-credit-rating text-amber-900 text-xs font-bold shadow-sm">
              <Award size={14} className="text-amber-600" /> CRISIL & ICRA Certified AAA Network
            </div>
          </div>
          
          <div>
            <span className="block text-sky-900 text-xs font-bold uppercase tracking-wider mb-3.5">Wholesale Sectors</span>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Industrial Machinery & CNC</span></li>
              <li><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Raw Materials, Steel & Metals</span></li>
              <li><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Packaging & Corrugated Boxes</span></li>
              <li><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Electricals, Solar & Power</span></li>
              <li><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Bulk Chemicals & Pharma</span></li>
            </ul>
          </div>

          <div>
            <span className="block text-sky-900 text-xs font-bold uppercase tracking-wider mb-3.5">Vendor Club & Perks</span>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li className="flex items-center gap-1.5"><Percent size={13} className="text-sky-600" /><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">1–3% Tiered Platform Fee</span></li>
              <li className="flex items-center gap-1.5"><Gift size={13} className="text-amber-600" /><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">50% Renewal Gift Voucher</span></li>
              <li className="flex items-center gap-1.5"><Mail size={13} className="text-sky-600" /><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Top 500 CEO Personal Line</span></li>
              <li className="flex items-center gap-1.5"><ShieldCheck size={13} className="text-emerald-600" /><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">50/50 Milestone Escrow</span></li>
              <li><span className="hover:text-sky-700 hover:underline transition-colors cursor-pointer">Referral Bonus Program (₹15,000)</span></li>
            </ul>
          </div>

          <div>
            <span className="block text-sky-900 text-xs font-bold uppercase tracking-wider mb-3.5">Security & Compliance</span>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-emerald-700 font-bold text-[11px] bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
                <ShieldCheck size={15} />
                <span>GSTN Direct API & ISO 27001 Certified</span>
              </div>
              <div className="flex items-center gap-2 text-sky-800 font-bold text-[11px] bg-sky-50 px-3 py-1.5 rounded-xl border border-sky-200">
                <Lock size={15} />
                <span>RBI Digital Escrow Safe Custody</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500 font-medium">
                All buyer-supplier contracts are backed by digital milestone escrow and automated e-way bill reconciliation.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center md:flex justify-between items-center text-[11px] text-slate-500 font-medium">
          <span>&copy; {new Date().getFullYear()} Bussinest B2B Wholesale Marketplace Technologies, Inc.</span>
          <div className="flex flex-wrap items-center justify-center gap-5 mt-2 md:mt-0">
            <span className="hover:text-sky-700 cursor-pointer">Wholesale SLA</span>
            <span className="hover:text-sky-700 cursor-pointer">Escrow Terms</span>
            <span className="hover:text-sky-700 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-sky-700 cursor-pointer">Vendor Code of Conduct</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-100/80 hover:bg-sky-200/90 text-sky-800 font-bold text-[11px] transition-all cursor-pointer shadow-xs border border-sky-200 ml-2 group"
            >
              <span>Back to top</span>
              <ArrowUp size={12} className="stroke-[2.5] text-sky-700 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
