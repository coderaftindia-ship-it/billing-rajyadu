import React from 'react';
import { CheckCircle2, AlertCircle, X, Info } from 'lucide-react';
import { useBilling } from '../context/BillingContext';
import { cn } from '../utils/cn';

export const ToastContainer = () => {
  const { toasts } = useBilling();

  return (
    <div className="fixed bottom-4 left-1/2 z-[9999] flex flex-col gap-3 pointer-events-none transform -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0 w-[calc(100%-2rem)] max-w-md">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 px-4 py-3 rounded-2xl shadow-2xl border w-full animate-in slide-in-from-bottom duration-300 pointer-events-auto",
            toast.type === 'success' ? "bg-white border-emerald-100 text-emerald-900" :
            toast.type === 'error' ? "bg-white border-rose-100 text-rose-900" :
            "bg-white border-blue-100 text-blue-900"
          )}
        >
          <div className={cn(
            "p-2 rounded-full",
            toast.type === 'success' ? "bg-emerald-50 text-emerald-600" :
            toast.type === 'error' ? "bg-rose-50 text-rose-600" :
            "bg-blue-50 text-blue-600"
          )}>
            {toast.type === 'success' ? <CheckCircle2 size={20} /> :
             toast.type === 'error' ? <AlertCircle size={20} /> :
             <Info size={20} />}
          </div>
          <p className="text-sm font-bold flex-1">{toast.message}</p>
        </div>
      ))}
    </div>
  );
};
