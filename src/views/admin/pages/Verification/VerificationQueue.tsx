import React, { useEffect, useState } from 'react';
import { DataTable } from '../../components/DataTable';
import { StatusBadge } from '../../components/StatusBadge';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { useAdminApi } from '../../hooks/useAdminApi';
import { 
  Eye, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  ExternalLink, 
  Download, 
  Building2, 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  ShieldCheck, 
  AlertTriangle,
  X,
  FileCheck
} from 'lucide-react';

interface VerificationItem {
  id: string;
  userId: string;
  businessName?: string;
  registrationNumber?: string;
  submittedAt?: string;
  createdAt?: string;
  status: string;
  rejectionReason?: string;
  adminNotes?: string;
  panFileName?: string;
  panFileUrl?: string;
  panStatus?: string;
  gstFileName?: string;
  gstFileUrl?: string;
  gstStatus?: string;
  aadhaarFileName?: string;
  aadhaarFileUrl?: string;
  aadhaarStatus?: string;
  cosFileName?: string;
  cosFileUrl?: string;
  cosStatus?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    createdAt?: string;
    vendorProfile?: {
      businessName?: string;
      category?: string;
      location?: string;
      gstNumber?: string;
      panNumber?: string;
    };
  };
}

export function VerificationQueue() {
  const api = useAdminApi();
  const [vendors, setVendors] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewingVendor, setReviewingVendor] = useState<VerificationItem | null>(null);
  const [rejectingVendor, setRejectingVendor] = useState<VerificationItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [activePreviewDoc, setActivePreviewDoc] = useState<{
    title: string;
    url: string;
    fileName?: string;
    isPdf?: boolean;
  } | null>(null);

  const loadData = () => {
    setLoading(true);
    api.getVerificationQueue()
      .then((res: any) => {
        setVendors(res.items || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load verification queue:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  const getCompanyName = (item: VerificationItem) => {
    return (
      item.businessName ||
      item.user?.vendorProfile?.businessName ||
      item.user?.name ||
      'Vendor'
    );
  };

  const getSubmissionDate = (item: VerificationItem) => {
    const raw = item.submittedAt || item.createdAt || item.user?.createdAt;
    if (!raw) return 'Recently';
    const d = new Date(raw);
    return isNaN(d.getTime()) ? 'Recently' : d.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDocUrl = (url?: string, fileName?: string) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('blob:')) return url;
    // Normalized relative uploads path
    const cleanPath = url.replace(/\\/g, '/').replace(/^\/?/, '');
    const base = `/${cleanPath}`;
    return fileName ? `${base}?name=${encodeURIComponent(fileName)}` : base;
  };

  const handleApprove = async (vendor: VerificationItem) => {
    const company = getCompanyName(vendor);
    if (confirm(`Approve verification and activate vendor "${company}"?`)) {
      try {
        await api.approveVendor(vendor.id);
        setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, status: 'approved' } : v));
        if (reviewingVendor?.id === vendor.id) {
          setReviewingVendor(null);
        }
      } catch (e: any) {
        alert(e.message || "Approval failed");
      }
    }
  };

  const handleRejectSubmit = async () => {
    if (!rejectingVendor) return;
    try {
      await api.rejectVendor(rejectingVendor.id, rejectionReason || "Document verification failed");
      setVendors(prev => prev.map(v => v.id === rejectingVendor.id ? { ...v, status: 'rejected', rejectionReason } : v));
      setRejectingVendor(null);
      setRejectionReason("");
      if (reviewingVendor?.id === rejectingVendor.id) {
        setReviewingVendor(null);
      }
    } catch (e: any) {
      alert(e.message || "Rejection failed");
    }
  };

  const reasonChips = [
    "Blurry or unreadable document scan",
    "GSTIN does not match legal entity name",
    "Aadhaar name mismatch",
    "Expired business license / registration proof",
    "Incomplete identity documentation"
  ];

  const columns = [
    {
      key: 'vendor',
      header: 'Company & Contact',
      render: (item: VerificationItem) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 text-sm">{getCompanyName(item)}</span>
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
            <User size={12} /> {item.user?.name || 'Contact'} • {item.user?.email || item.user?.phone || ''}
          </span>
        </div>
      )
    },
    {
      key: 'documents',
      header: 'Submitted Docs',
      render: (item: VerificationItem) => {
        const docs = [
          { label: 'PAN', has: !!item.panFileUrl },
          { label: 'GST', has: !!item.gstFileUrl },
          { label: 'Aadhaar', has: !!item.aadhaarFileUrl },
          { label: 'License', has: !!item.cosFileUrl },
        ];
        return (
          <div className="flex flex-wrap gap-1.5">
            {docs.map((d, i) => (
              <span
                key={i}
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-md ${
                  d.has
                    ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-400 border border-slate-200'
                }`}
              >
                {d.label} {d.has ? '✓' : '—'}
              </span>
            ))}
          </div>
        );
      }
    },
    {
      key: 'submittedAt',
      header: 'Submitted Date',
      render: (item: VerificationItem) => (
        <span className="text-xs font-semibold text-slate-600">
          {getSubmissionDate(item)}
        </span>
      )
    },
    {
      key: 'status',
      header: 'Status',
      render: (item: VerificationItem) => <StatusBadge status={item.status} />
    },
    {
      key: 'actions',
      header: 'Actions',
      render: (item: VerificationItem) => (
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => setReviewingVendor(item)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg transition-colors border border-indigo-200 shadow-sm"
            title="Inspect all uploaded documents"
          >
            <Eye size={14} />
            <span>Review Docs</span>
          </button>
          <button
            onClick={() => handleApprove(item)}
            disabled={item.status !== 'pending'}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg disabled:opacity-40 transition-colors shadow-sm"
          >
            Approve
          </button>
          <button
            onClick={() => {
              setRejectingVendor(item);
              setRejectionReason("");
            }}
            disabled={item.status !== 'pending'}
            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-lg disabled:opacity-40 transition-colors border border-rose-200"
          >
            Reject
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Vendor Verification Queue</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">
            Review submitted KYC identity documents and business certificates to grant vendor selling privileges.
          </p>
        </div>
        <button
          onClick={loadData}
          className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors self-start sm:self-auto"
        >
          Refresh Queue
        </button>
      </div>

      <DataTable
        data={vendors}
        columns={columns}
        searchPlaceholder="Search by company, name, email or phone..."
      />

      {/* ========================================================= */}
      {/* FULL DOCUMENT REVIEW & INSPECTION MODAL */}
      {/* ========================================================= */}
      {reviewingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/35 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden relative my-6 border border-sky-100">
            <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
            
            {/* Modal Header */}
            <div className="p-6 border-b border-sky-100 flex items-center justify-between bg-sky-50/50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold">
                  <Building2 size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-slate-900">{getCompanyName(reviewingVendor)}</h2>
                    <StatusBadge status={reviewingVendor.status} />
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Submitted: {getSubmissionDate(reviewingVendor)} • ID: {reviewingVendor.id.slice(0, 8)}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setReviewingVendor(null);
                  setActivePreviewDoc(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-800 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 space-y-6">
              
              {/* Vendor Profile Overview Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Contact Person</span>
                  <span className="font-bold text-slate-800">{reviewingVendor.user?.name || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Email</span>
                  <span className="font-bold text-slate-800 truncate block">{reviewingVendor.user?.email || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Phone</span>
                  <span className="font-bold text-slate-800">{reviewingVendor.user?.phone || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold mb-0.5">Category / Region</span>
                  <span className="font-bold text-slate-800">
                    {reviewingVendor.user?.vendorProfile?.category || 'Services'} • {reviewingVendor.user?.vendorProfile?.location || 'India'}
                  </span>
                </div>
              </div>

              {/* Uploaded Documents Grid */}
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <FileCheck size={16} className="text-indigo-600" />
                  Uploaded Verification Documents
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "pan",
                      title: "PAN Card",
                      fileUrl: reviewingVendor.panFileUrl,
                      fileName: reviewingVendor.panFileName || "pan_card.png",
                      status: reviewingVendor.panStatus || reviewingVendor.status,
                      required: true
                    },
                    {
                      id: "gst",
                      title: "GST Certificate",
                      fileUrl: reviewingVendor.gstFileUrl,
                      fileName: reviewingVendor.gstFileName || "gst_certificate.pdf",
                      status: reviewingVendor.gstStatus || reviewingVendor.status,
                      required: true
                    },
                    {
                      id: "aadhaar",
                      title: "Owner's Aadhaar",
                      fileUrl: reviewingVendor.aadhaarFileUrl,
                      fileName: reviewingVendor.aadhaarFileName || "aadhaar_card.jpg",
                      status: reviewingVendor.aadhaarStatus || reviewingVendor.status,
                      required: true
                    },
                    {
                      id: "cos",
                      title: "Business Registration Proof",
                      fileUrl: reviewingVendor.cosFileUrl,
                      fileName: reviewingVendor.cosFileName || "registration_license.pdf",
                      status: reviewingVendor.cosStatus || reviewingVendor.status,
                      required: false
                    }
                  ].map((doc, idx) => {
                    const formattedUrl = formatDocUrl(doc.fileUrl, doc.fileName);
                    const isUploaded = !!doc.fileUrl;
                    const isPdf = Boolean(
                      (doc.fileUrl && doc.fileUrl.toLowerCase().endsWith('.pdf')) ||
                      (doc.fileName && doc.fileName.toLowerCase().endsWith('.pdf'))
                    );

                    return (
                      <div
                        key={idx}
                        className={`p-4 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                          isUploaded
                            ? "border-emerald-300 bg-emerald-50/40 shadow-sm"
                            : "border-dashed border-slate-200 bg-slate-50 opacity-70"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-3">
                          <div className="flex items-center gap-2.5">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold ${
                                isUploaded
                                  ? "bg-emerald-500 text-white shadow-sm shadow-emerald-600/30"
                                  : "bg-slate-200 text-slate-400"
                              }`}
                            >
                              <FileText size={18} />
                            </div>
                            <div>
                              <span className="font-extrabold text-xs text-slate-900 block">
                                {doc.title} {doc.required && <span className="text-rose-500">*</span>}
                              </span>
                              <span className="text-[11px] text-slate-500 font-medium truncate block max-w-[160px]" title={doc.fileName}>
                                {isUploaded ? doc.fileName : "Not Provided"}
                              </span>
                            </div>
                          </div>

                          {isUploaded ? (
                            <span className="text-[10px] font-extrabold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md">
                              Ready for Review
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-200 text-slate-600 rounded-md">
                              Missing
                            </span>
                          )}
                        </div>

                        {isUploaded && (
                          <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
                            <button
                              type="button"
                              onClick={() => setActivePreviewDoc({ title: doc.title, url: formattedUrl, fileName: doc.fileName, isPdf })}
                              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
                            >
                              <Eye size={13} />
                              <span>View Document</span>
                            </button>
                            <a
                              href={`${formattedUrl}${formattedUrl.includes('?') ? '&' : '?'}download=1`}
                              download={doc.fileName || `${doc.title.replace(/\s+/g, '_')}`}
                              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
                              title="Download File"
                            >
                              <Download size={14} />
                            </a>
                            <a
                              href={formattedUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 transition-colors"
                              title="Open in new tab"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Active Document Inline Viewer */}
              {activePreviewDoc && (
                <div className="border border-sky-200 rounded-3xl p-5 bg-gradient-to-br from-sky-50/90 via-white to-sky-100/60 text-slate-800 shadow-xl animate-in fade-in duration-200">
                  <div className="flex flex-wrap items-center justify-between pb-3 border-b border-sky-200/80 gap-2 mb-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-sky-500/15 text-sky-600 flex items-center justify-center font-bold">
                        <Eye size={16} />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-slate-800 block">
                          Viewing: <strong className="text-sky-900">{activePreviewDoc.title}</strong>
                        </span>
                        {activePreviewDoc.fileName && (
                          <span className="text-[11px] text-slate-500 font-mono">
                            {activePreviewDoc.fileName}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={activePreviewDoc.url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-sky-50 text-sky-800 text-xs font-bold rounded-xl transition-colors border border-sky-200 shadow-2xs"
                        title="Open in new full tab"
                      >
                        <ExternalLink size={13} />
                        <span>Open Full Tab</span>
                      </a>
                      <a
                        href={`${activePreviewDoc.url}${activePreviewDoc.url.includes('?') ? '&' : '?'}download=1`}
                        download={activePreviewDoc.fileName || `${activePreviewDoc.title.replace(/\s+/g, '_')}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                        title="Download file"
                      >
                        <Download size={13} />
                        <span>Download</span>
                      </a>
                      <button
                        onClick={() => setActivePreviewDoc(null)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 bg-white hover:bg-sky-50 rounded-xl transition-colors ml-1 border border-slate-200 shadow-2xs"
                        title="Close Viewer"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-3 flex items-center justify-center min-h-[380px] max-h-[550px] overflow-auto border border-sky-100 shadow-inner">
                    {activePreviewDoc.isPdf || activePreviewDoc.url.toLowerCase().includes('.pdf') ? (
                      <iframe
                        src={activePreviewDoc.url}
                        className="w-full h-[500px] rounded-xl border-0 bg-white"
                        title={activePreviewDoc.title}
                      />
                    ) : (
                      <img
                        src={activePreviewDoc.url}
                        alt={activePreviewDoc.title}
                        className="max-h-[500px] max-w-full object-contain rounded-xl shadow-md transition-transform hover:scale-[1.01]"
                        onError={() => {
                          if (!activePreviewDoc.isPdf) {
                            setActivePreviewDoc(prev => prev ? { ...prev, isPdf: true } : null);
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Modal Actions Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => {
                  setReviewingVendor(null);
                  setActivePreviewDoc(null);
                }}
                className="px-5 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-200 text-xs transition-colors"
              >
                Close
              </button>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setRejectingVendor(reviewingVendor);
                    setRejectionReason("");
                  }}
                  disabled={reviewingVendor.status !== 'pending'}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl border border-rose-200 transition-colors disabled:opacity-40"
                >
                  <XCircle size={16} />
                  <span>Reject / Request Re-upload</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleApprove(reviewingVendor)}
                  disabled={reviewingVendor.status !== 'pending'}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition-all disabled:opacity-40"
                >
                  <CheckCircle2 size={16} />
                  <span>Approve & Verify Vendor</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* REJECTION REASON DIALOG WITH PREDEFINED CHIPS */}
      {/* ========================================================= */}
      {rejectingVendor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-sky-950/35 backdrop-blur-md animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg p-6 relative border border-sky-100 overflow-hidden">
            <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
            <button
              onClick={() => setRejectingVendor(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-800 rounded-full hover:bg-sky-50"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900">Reject Verification</h3>
                <p className="text-xs text-slate-500 font-medium">
                  Provide a specific reason for {getCompanyName(rejectingVendor)}
                </p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <label className="block text-xs font-bold text-slate-600 uppercase">
                Quick Reason Chips
              </label>
              <div className="flex flex-wrap gap-1.5">
                {reasonChips.map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setRejectionReason(chip)}
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border transition-all text-left ${
                      rejectionReason === chip
                        ? "bg-rose-50 text-rose-700 border-rose-300 ring-2 ring-rose-200"
                        : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                    }`}
                  >
                    + {chip}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-xs font-bold text-slate-600 uppercase mb-1">
                Detailed Rejection Note
              </label>
              <textarea
                value={rejectionReason}
                onChange={e => setRejectionReason(e.target.value)}
                placeholder="Explain what the vendor needs to fix or re-upload..."
                rows={3}
                className="w-full bg-slate-50 border border-slate-200 focus:border-rose-500 focus:ring-4 focus:ring-rose-50 rounded-xl p-3 outline-none text-xs font-medium text-slate-900"
              />
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectingVendor(null)}
                className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-lg shadow-rose-600/20 transition-colors"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
