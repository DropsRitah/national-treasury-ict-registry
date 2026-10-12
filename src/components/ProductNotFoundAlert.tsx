import React from 'react';
import { AlertCircle, PlusCircle, X } from 'lucide-react';

interface ProductNotFoundAlertProps {
  searchQuery: string;
  onClearSearch: () => void;
  onQuickRegister: (prefillTerm: string) => void;
}

export const ProductNotFoundAlert: React.FC<ProductNotFoundAlertProps> = ({
  searchQuery,
  onClearSearch,
  onQuickRegister,
}) => {
  if (!searchQuery.trim()) return null;

  return (
    <div className="bg-amber-50 border-2 border-amber-400 rounded-xl p-4 mb-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-400/30 text-amber-800 flex items-center justify-center shrink-0 border border-amber-400">
            <AlertCircle className="w-5 h-5 text-amber-700" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded bg-amber-500 text-white">
                Alert
              </span>
              <h3 className="text-sm sm:text-base font-bold text-slate-900">
                Product Not Available
              </h3>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 mt-1">
              The product or item matching <strong className="font-mono bg-amber-200/80 px-1.5 py-0.5 rounded text-slate-900">&quot;{searchQuery}&quot;</strong> is not available in the system.
            </p>

            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={() => onQuickRegister(searchQuery)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-[#002147] hover:bg-[#001733] text-white shadow-sm transition"
              >
                <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
                <span>Register &quot;{searchQuery}&quot; into System</span>
              </button>
              <button
                onClick={onClearSearch}
                className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 transition"
              >
                Clear Search
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={onClearSearch}
          className="text-slate-400 hover:text-slate-600 p-1"
          title="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
