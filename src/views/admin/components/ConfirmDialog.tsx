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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-bold mb-4">{title}</h3>
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
        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Cancel</button>
          <button onClick={() => { onConfirm(reason); setReason(""); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">Confirm</button>
        </div>
      </div>
    </div>
  );
}
