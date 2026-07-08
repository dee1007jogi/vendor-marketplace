/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Zap, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 py-10 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-6 w-6 rounded bg-indigo-600 flex items-center justify-center text-white">
                <Zap size={14} className="fill-teal-300 stroke-teal-300" />
              </div>
              <span className="text-white font-bold text-sm tracking-tight">VendiMatch AI</span>
            </div>
            <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
              Accelerating procurement matches through semantic RFP parsing, real-time weighted scoring models, and automated secure chat workflows.
            </p>
          </div>
          
          <div>
            <span className="block text-slate-200 text-xs font-bold uppercase tracking-wider mb-3">Platform Operations</span>
            <ul className="space-y-1.5 text-xs">
              <li>
                <span className="hover:text-indigo-400 cursor-pointer">Semantic Verification</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 cursor-pointer">B2B Trust Network Scores</span>
              </li>
              <li>
                <span className="hover:text-indigo-400 cursor-pointer">RFP Proposal Analytics</span>
              </li>
            </ul>
          </div>

          <div>
            <span className="block text-slate-200 text-xs font-bold uppercase tracking-wider mb-3">Compliance & Security</span>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400">
                <ShieldCheck size={14} />
                <span className="font-semibold text-[11px]">DPDP & GDPR Audit Verified</span>
              </div>
              <p className="text-[11px] leading-relaxed text-slate-500">
                All buyer documents are hashed and protected with end-to-end sandbox storage. VendiMatch™ is undergoing official regional trademark audits to guarantee full proprietary rights prior to production launch.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 text-center md:flex justify-between items-center text-[11px] text-slate-500">
          <span>&copy; {new Date().getFullYear()} VendiMatch AI Systems, Inc. All rights reserved.</span>
          <div className="flex justify-center gap-4 mt-2 md:mt-0">
            <span className="hover:text-slate-300 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-300 cursor-pointer">Privacy Charter</span>
            <span className="hover:text-slate-300 cursor-pointer">SLA Agreement</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
