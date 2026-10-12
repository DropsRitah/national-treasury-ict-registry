import React from 'react';
import { Edit2, Trash2, Laptop, Cpu, Printer, Server, Network, Tablet, Monitor, Disc } from 'lucide-react';
import { Asset } from '../types/inventory';

interface AssetTableProps {
  assets: Asset[];
  onEdit: (asset: Asset) => void;
  onDelete: (id: number) => void;
  onQuickRegister: () => void;
}

export const AssetTable: React.FC<AssetTableProps> = ({
  assets,
  onEdit,
  onDelete,
  onQuickRegister,
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Laptop':
        return <Laptop className="w-3.5 h-3.5 text-blue-600" />;
      case 'CPU':
        return <Cpu className="w-3.5 h-3.5 text-indigo-600" />;
      case 'Printer':
        return <Printer className="w-3.5 h-3.5 text-amber-600" />;
      case 'Server':
        return <Server className="w-3.5 h-3.5 text-purple-600" />;
      case 'Network':
        return <Network className="w-3.5 h-3.5 text-emerald-600" />;
      case 'Tablet':
        return <Tablet className="w-3.5 h-3.5 text-pink-600" />;
      case 'Monitor':
        return <Monitor className="w-3.5 h-3.5 text-cyan-600" />;
      default:
        return <Disc className="w-3.5 h-3.5 text-slate-500" />;
    }
  };

  const getStatusBadge = (status: Asset['status']) => {
    switch (status) {
      case 'In Use':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5"></span>
            In Use
          </span>
        );
      case 'In Store':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-1.5"></span>
            In Store
          </span>
        );
      case 'Maintenance':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5"></span>
            Maintenance
          </span>
        );
      case 'Decommissioned':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-800 border border-red-200">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 mr-1.5"></span>
            Decommissioned
          </span>
        );
    }
  };

  if (assets.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
        <div className="w-14 h-14 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-3">
          🔍
        </div>
        <h4 className="text-base font-bold text-slate-800 mb-1">
          No matching ICT assets found
        </h4>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-4">
          There are currently no items matching your criteria in the registry. Try clearing your search or register a new piece of equipment.
        </p>
        <button
          onClick={onQuickRegister}
          className="px-4 py-2 bg-[#002147] hover:bg-[#001733] text-white text-xs font-bold rounded-xl shadow-sm transition"
        >
          + Register New Asset
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-8">
      {/* Official Government Table Header */}
      <div className="bg-slate-50 px-5 py-3 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
          <h2 className="text-xs sm:text-sm font-bold text-slate-800 tracking-wide uppercase">
            Official Equipment & Asset Ledger
          </h2>
        </div>
        <div className="text-xs font-semibold text-slate-500">
          Total in view: <strong className="text-slate-800">{assets.length}</strong>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm border-collapse">
          <thead>
            <tr className="bg-slate-100/80 border-b-2 border-[#002147] text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              <th className="py-3 px-4">Serial Number</th>
              <th className="py-3 px-4">Model</th>
              <th className="py-3 px-4">Brand</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Assigned Custodian</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200/80">
            {assets.map((asset, index) => (
              <tr
                key={asset.id}
                className={`hover:bg-amber-50/40 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'
                }`}
              >
                {/* 1. Serial Number */}
                <td className="py-3.5 px-4 font-mono font-bold text-xs text-[#002147]">
                  <span className="px-2 py-1 bg-slate-100 hover:bg-amber-100 rounded border border-slate-200 font-mono text-slate-800 select-all">
                    {asset.serial_number}
                  </span>
                </td>

                {/* 2. Model */}
                <td className="py-3.5 px-4 font-semibold text-slate-900">
                  {asset.model}
                </td>

                {/* 3. Brand */}
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-slate-800">
                    {asset.brand}
                  </span>
                </td>

                {/* 4. Category */}
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    {getCategoryIcon(asset.category)}
                    <span>{asset.category}</span>
                  </span>
                </td>

                {/* 5. Status */}
                <td className="py-3.5 px-4">
                  {getStatusBadge(asset.status)}
                </td>

                {/* 6. Assigned To */}
                <td className="py-3.5 px-4">
                  <div className="text-xs font-medium text-slate-800">
                    {asset.assigned_to || 'Unassigned / Store'}
                  </div>
                  {asset.location && (
                    <div className="text-[11px] text-slate-400">
                      {asset.location}
                    </div>
                  )}
                </td>

                {/* 7. Actions */}
                <td className="py-3.5 px-4 text-center">
                  <div className="inline-flex items-center gap-1">
                    <button
                      onClick={() => onEdit(asset)}
                      className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
                      title="Edit asset details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            `Confirm Deletion: Are you sure you want to remove ${asset.brand} ${asset.model} (S/N: ${asset.serial_number}) from the National Treasury register?`
                          )
                        ) {
                          onDelete(asset.id);
                        }
                      }}
                      className="p-1.5 text-slate-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                      title="Delete asset record"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
