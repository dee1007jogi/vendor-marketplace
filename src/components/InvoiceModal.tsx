import React, { useRef } from "react";
import { X, Printer, ShieldCheck } from "lucide-react";

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any; // The transaction object
  user: any; // The currentUser object
}

export default function InvoiceModal({ isOpen, onClose, transaction, user }: InvoiceModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  const invoiceNumber = `INV-${transaction.id.split("-")[0].toUpperCase()}`;
  const invoiceDate = new Date(transaction.createdAt).toLocaleDateString();
  const amount = transaction.amount;
  const subtotal = Math.round(amount / 1.18); // Assuming 18% GST for display purposes
  const gst = amount - subtotal;

  const typeMap: any = {
    subscription_payment: "Platform Subscription Plan",
    lead_purchase: "Lead Credits Pack Purchase",
    featured_listing_fee: "Featured Listing (CPC) Payment",
    commission_fee: "Escrow Project Commission",
    verification_fee: "Trust & Verification Fee"
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-sm print:bg-white print:p-0">
      
      {/* Modal Container */}
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] print:max-h-none print:shadow-none print:rounded-none">
        
        {/* Header Actions - Hidden when printing */}
        <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50 print:hidden">
          <h3 className="font-bold text-slate-900">Tax Invoice</h3>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors">
              <Printer size={16} /> Print / Save PDF
            </button>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Printable Area */}
        <div ref={printRef} className="p-8 md:p-12 overflow-y-auto print:overflow-visible">
          
          <div className="flex justify-between items-start mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center transform rotate-3">
                  <span className="text-white font-black text-xl tracking-tighter">VM</span>
                </div>
                <span className="text-2xl font-black text-slate-900 tracking-tight">VendiMatch</span>
              </div>
              <div className="text-sm text-slate-500 font-medium">
                <p>VendiMatch Technologies Pvt. Ltd.</p>
                <p>123 Startup Hub, Koramangala</p>
                <p>Bengaluru, Karnataka 560034</p>
                <p>GSTIN: 29AABCU9603R1ZX</p>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-black text-slate-900 uppercase tracking-widest mb-2 text-slate-200">INVOICE</h1>
              <p className="font-mono text-slate-900 font-bold mb-1">{invoiceNumber}</p>
              <p className="text-sm text-slate-500 font-medium">Date: {invoiceDate}</p>
            </div>
          </div>

          <div className="mb-12 grid grid-cols-2 gap-8">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 print:bg-transparent print:border-none print:p-0">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Billed To</h3>
              <p className="font-bold text-slate-900 text-lg mb-1">{user.vendorProfile?.businessName || user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
              {user.vendorProfile?.gstNumber && (
                <p className="text-sm text-slate-500 mt-2 font-mono">GSTIN: {user.vendorProfile.gstNumber}</p>
              )}
            </div>
            
            <div className="flex flex-col justify-center items-end">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Amount Due</p>
                <p className="text-4xl font-black text-indigo-600 print:text-slate-900">₹{amount.toLocaleString()}</p>
                <div className="mt-2 inline-flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded text-xs font-bold print:border print:border-emerald-200">
                  <ShieldCheck size={14} /> PAID IN FULL
                </div>
              </div>
            </div>
          </div>

          <table className="w-full text-left mb-12">
            <thead>
              <tr className="border-b-2 border-slate-900 text-slate-900 font-black text-xs uppercase tracking-wider">
                <th className="py-3">Description</th>
                <th className="py-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-6">
                  <p className="font-bold text-slate-900 text-lg mb-1">{typeMap[transaction.transactionType] || "Platform Service Fee"}</p>
                  <p className="text-sm text-slate-500">Ref: {transaction.id}</p>
                </td>
                <td className="py-6 text-right font-bold text-slate-900 text-lg">
                  ₹{subtotal.toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end mb-16">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-slate-500 text-sm font-medium">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-500 text-sm font-medium">
                <span>IGST (18%)</span>
                <span>₹{gst.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-900 text-xl font-black pt-3 border-t-2 border-slate-900">
                <span>Total</span>
                <span>₹{amount.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-8 flex justify-between items-center text-xs text-slate-500 font-medium">
            <p>Thank you for doing business with VendiMatch.</p>
            <p>support@vendimatch.com</p>
          </div>
          
        </div>
      </div>

      {/* Print Styles injected locally to fix print layout */}
      <style>{`
        @media print {
          body * { visibility: hidden; }
          .fixed.inset-0 { position: absolute; left: 0; top: 0; right: 0; bottom: 0; }
          .fixed.inset-0 > div { width: 100%; max-w: none; box-shadow: none; }
          .fixed.inset-0 > div > div:last-child, .fixed.inset-0 > div > div:last-child * {
            visibility: visible;
          }
          .fixed.inset-0 > div > div:last-child {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}
