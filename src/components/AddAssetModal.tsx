import React, { useState, useEffect } from 'react';
import { X, Plus, AlertCircle } from 'lucide-react';
import { Asset, AssetCategory, AssetStatus } from '../types/inventory';

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (asset: Omit<Asset, 'id' | 'date_added'>) => boolean;
  prefillQuery?: string;
  existingSerialNumbers: string[];
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

export const AddAssetModal: React.FC<AddAssetModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  prefillQuery,
  existingSerialNumbers,
}) => {
  const [serialNumber, setSerialNumber] = useState('');
  const [model, setModel] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState<AssetCategory>('Laptop');
  const [status, setStatus] = useState<AssetStatus>('In Store');
  const [assignedTo, setAssignedTo] = useState('');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Handle prefill
  useEffect(() => {
    if (prefillQuery) {
      // Determine if looks like a serial number (e.g. contains numbers/dashes) or brand/model
      if (/[0-9]/.test(prefillQuery) || prefillQuery.includes('-')) {
        setSerialNumber(prefillQuery.toUpperCase());
      } else {
        setModel(prefillQuery);
      }
    }
  }, [prefillQuery, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const cleanSN = serialNumber.trim().toUpperCase();
    if (!cleanSN || !model.trim() || !brand.trim() || !category) {
      setErrorMessage('Please fill in all required fields (Serial Number, Model, Brand, Category).');
      return;
    }

    // Check duplicate serial number
    if (existingSerialNumbers.some((sn) => sn.toUpperCase() === cleanSN)) {
      setErrorMessage(`⚠️ Serial Number "${cleanSN}" is already registered in the Treasury system!`);
      return;
    }

    const success = onAdd({
      serial_number: cleanSN,
      model: model.trim(),
      brand: brand.trim(),
      category,
      status,
      assigned_to: assignedTo.trim() || 'Unassigned / Store Pool',
      location: location.trim() || 'Central Store',
      notes: notes.trim(),
    });

    if (success) {
      // Reset form
      setSerialNumber('');
      setModel('');
      setBrand('');
      setAssignedTo('');
      setLocation('');
      setNotes('');
      setErrorMessage('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#002147] text-white p-5 flex items-center justify-between border-b-4 border-[#f1c40f]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-400 text-[#002147] font-black flex items-center justify-center text-lg">
              +
            </div>
            <div>
              <h3 className="font-bold text-lg">Register New ICT Asset</h3>
              <p className="text-xs text-slate-300">
                Official registration for National Treasury equipment ledger
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-300 rounded-xl text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Serial Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Serial Number *
              </label>
              <input
                type="text"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="e.g. NT-LAP-015"
                className="w-full px-3.5 py-2 text-sm font-mono font-bold border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
                required
                autoFocus
              />
              <span className="text-[10px] text-slate-400">Unique hardware identifier</span>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Category *
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as AssetCategory)}
                className="w-full px-3.5 py-2 text-sm font-medium border border-slate-300 focus:border-[#002147] rounded-xl outline-none bg-white"
                required
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <span className="text-[10px] text-slate-400">Used for primary grouping</span>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Brand / Manufacturer *
              </label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g. HP, Dell, Apple, Cisco, Epson"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
                required
              />
              <span className="text-[10px] text-slate-400">Used for sub-grouping</span>
            </div>

            {/* Model */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Model Description *
              </label>
              <input
                type="text"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g. EliteBook 840 G9"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
                required
              />
              <span className="text-[10px] text-slate-400">Specific device model number</span>
            </div>

            {/* Status */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Asset Status
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

            {/* Assigned Custodian */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Assigned Custodian / Officer
              </label>
              <input
                type="text"
                value={assignedTo}
                onChange={(e) => setAssignedTo(e.target.value)}
                placeholder="e.g. Deputy Director of Internal Audit"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Location & Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Physical Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Treasury Building 4th Floor, Rm 412"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Registry Notes / Purpose
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Configured with IFMIS / GHRIS client"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 focus:border-[#002147] rounded-xl outline-none"
              />
            </div>
          </div>

          {/* Action buttons */}
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
              <Plus className="w-4 h-4 text-amber-400" />
              <span>Register Asset</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
