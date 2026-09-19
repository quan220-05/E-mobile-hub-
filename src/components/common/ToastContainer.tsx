import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-3">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isWarning = toast.type === 'warning';
        const isError = toast.type === 'error';

        let icon = <Info className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />;
        let border = 'border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 shadow-blue-500/10';

        if (isSuccess) {
          icon = <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />;
          border = 'border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 shadow-emerald-500/10';
        } else if (isWarning) {
          icon = <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />;
          border = 'border-amber-200 dark:border-amber-900 bg-white dark:bg-slate-900 shadow-amber-500/10';
        } else if (isError) {
          icon = <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />;
          border = 'border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 shadow-rose-500/10';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-lg transition-all animate-in slide-in-from-bottom-2 ${border}`}
          >
            {icon}
            <div className="flex-1 text-sm">
              <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs tracking-tight">
                {toast.title}
              </h4>
              <p className="text-slate-600 dark:text-slate-300 text-xs mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
