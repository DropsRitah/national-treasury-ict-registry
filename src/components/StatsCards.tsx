import React from 'react';
import { Laptop, HardDrive, CheckCircle2, AlertTriangle, Archive, Layers } from 'lucide-react';
import { Asset } from '../types/inventory';

interface StatsCardsProps {
  assets: Asset[];
  onFilterByCategory: (category: string) => void;
  onFilterByStatus: (status: string) => void;
}

export const StatsCards: React.FC<StatsCardsProps> = ({
  assets,
  onFilterByCategory,
  onFilterByStatus,
}) => {
  const total = assets.length;
  const inUse = assets.filter((a) => a.status === 'In Use').length;
  const inStore = assets.filter((a) => a.status === 'In Store').length;
  const maintenance = assets.filter((a) => a.status === 'Maintenance').length;

  const laptops = assets.filter((a) => a.category === 'Laptop').length;
  const cpus = assets.filter((a) => a.category === 'CPU').length;
  const printers = assets.filter((a) => a.category === 'Printer').length;
  const servers = assets.filter((a) => a.category === 'Server').length;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
      {/* Total Assets */}
      <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center shrink-0">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Assets
          </div>
          <div className="text-xl font-black text-slate-900">{total}</div>
        </div>
      </div>

      {/* In Use */}
      <button
        onClick={() => onFilterByStatus('In Use')}
        className="bg-white hover:bg-emerald-50/50 text-left rounded-xl p-3.5 border border-slate-200 hover:border-emerald-300 shadow-sm flex items-center gap-3 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            In Service
          </div>
          <div className="text-xl font-black text-emerald-700">{inUse}</div>
        </div>
      </button>

      {/* In Store */}
      <button
        onClick={() => onFilterByStatus('In Store')}
        className="bg-white hover:bg-blue-50/50 text-left rounded-xl p-3.5 border border-slate-200 hover:border-blue-300 shadow-sm flex items-center gap-3 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0">
          <Archive className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            In Store Pool
          </div>
          <div className="text-xl font-black text-indigo-700">{inStore}</div>
        </div>
      </button>

      {/* Maintenance */}
      <button
        onClick={() => onFilterByStatus('Maintenance')}
        className="bg-white hover:bg-amber-50/50 text-left rounded-xl p-3.5 border border-slate-200 hover:border-amber-300 shadow-sm flex items-center gap-3 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Repairs
          </div>
          <div className="text-xl font-black text-amber-700">{maintenance}</div>
        </div>
      </button>

      {/* Laptops */}
      <button
        onClick={() => onFilterByCategory('Laptop')}
        className="bg-white hover:bg-slate-50 text-left rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <Laptop className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Laptops
          </div>
          <div className="text-xl font-black text-slate-800">{laptops}</div>
        </div>
      </button>

      {/* CPUs / Desktops */}
      <button
        onClick={() => onFilterByCategory('CPU')}
        className="bg-white hover:bg-slate-50 text-left rounded-xl p-3.5 border border-slate-200 shadow-sm flex items-center gap-3 transition cursor-pointer"
      >
        <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
          <HardDrive className="w-5 h-5" />
        </div>
        <div>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            CPUs & Units
          </div>
          <div className="text-xl font-black text-slate-800">{cpus}</div>
        </div>
      </button>
    </div>
  );
};
