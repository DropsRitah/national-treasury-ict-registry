import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Asset, AssetCategory, AssetStatus } from '../types/inventory';

interface EditAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onUpdate: (updatedAsset: Asset) => void;
}

const CATEGORIES: AssetCategory[] = [
  'Laptop',
  'CPU',
  'Printer',
  'Server',
  'Network',
  'Monitor',
  'Tablet',
  'Scanner',
];

const STATUSES: AssetStatus[] = ['In Store', 'In Use', 'Maintenance', 'Decommissioned'];

export const EditAssetModal: React.FC<EditAssetModalProps> = ({
  isOpen,
  onClose,
  asset,
  onUpdate,
}) => {
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Laptop');
  const [status, setStatus] = useState<AssetStatus>('In Store');
  const [assignedTo, setAssignedTo] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (asset) {
      setModel(asset.model);
      setBrand(asset.brand);
      setCategory(asset.category);
      setStatus(asset.status);
      setAssignedTo(asset.assigned_to || '');
      setLocation(asset.location || '');
      setNotes(asset.notes || '');
    }
  }, [asset]);

  if (!isOpen || !asset) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({
      ...asset,
      model: model.trim(),
      brand: brand.trim(),
      category,
      status,
      assigned_to: assignedTo.trim() || 'Unassigned / Store Pool',
      location: location.trim(),
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#002147] text-white p-5 flex items-center justify-between border-b-4 border-[#f1c40f]">
          <div>
            <h3 className="font-bold text-lg">Update Asset Record</h3>
            <p className="text-xs text-slate-300 font-mono">
              Serial Number: <strong>{asset.serial_number}</strong>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Brand
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none bg-white"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssetStatus)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none bg-white"
              >
                {STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Custodian / Officer
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Location & Notes
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Office room, floor, desk"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#002147] hover:bg-[#001733] text-white text-sm font-bold rounded-xl shadow-md transition flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
