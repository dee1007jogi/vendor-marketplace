import React, { useState } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  children?: React.ReactNode;
}

export function ConfirmDialog({ open, onClose, onConfirm, title, children }: ConfirmDialogProps) {
  const [reason, setReason] = useState("");

  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-sky-950/35 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-6 md:p-8 max-w-md w-full border border-sky-100 relative overflow-hidden">
        <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]"></div>
        <h3 className="text-xl font-black text-slate-900 mb-4">{title}</h3>
        {children && (
           <div className="mb-4">
             {/* We clone the child to pass value/onChange if it's a textarea, or just render it */}
             {React.isValidElement(children) && children.type === 'textarea' 
               ? React.cloneElement(children as any, { 
                   value: reason, 
                   onChange: (e: any) => setReason(e.target.value) 
                 })
               : children}
           </div>
        )}
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onClose} className="px-5 py-2.5 bg-sky-50 text-sky-800 border border-sky-200 font-bold rounded-xl hover:bg-sky-100 transition-colors cursor-pointer">Cancel</button>
          <button onClick={() => { onConfirm(reason); setReason(""); }} className="px-5 py-2.5 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 transition-colors shadow-md shadow-rose-600/20 cursor-pointer">Confirm</button>
        </div>
      </div>
    </div>
  );
}
