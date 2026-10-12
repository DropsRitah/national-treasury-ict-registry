import React, { useRef } from 'react';
import { Search, X, Plus, Download, Upload, Filter } from 'lucide-react';
import { AssetCategory } from '../types/inventory';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  onOpenAddModal: () => void;
  onExportCsv: () => void;
  onImportCsv: (e: React.ChangeEvent<HTMLInputElement>) => void;
  totalFiltered: number;
  totalAll: number;
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

export const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  onOpenAddModal,
  onExportCsv,
  onImportCsv,
  totalFiltered,
  totalAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isFiltered = searchQuery || selectedCategory !== 'All';

  return (
    <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-5">
      <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
        {/* The single Search bar to check products in system */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by Serial Number, Brand (e.g. HP), Model, or Category to check product..."
            className="block w-full pl-10 pr-9 py-2 text-sm rounded-lg border border-slate-300 focus:border-[#002147] focus:ring-2 focus:ring-[#002147]/10 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              title="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Filter Dropdown */}
        <div className="flex flex-wrap sm:flex-nowrap gap-2 items-center">
          <div className="relative min-w-[160px] flex-grow sm:flex-grow-0">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full appearance-none bg-slate-50 border border-slate-300 text-slate-800 text-xs sm:text-sm font-medium rounded-lg px-3.5 py-2 pr-8 focus:outline-none focus:border-[#002147] cursor-pointer"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}s Only
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <Filter className="w-3.5 h-3.5" />
            </div>
          </div>

          {isFiltered && (
            <button
              onClick={() => {
                onSearchChange('');
                onCategoryChange('All');
              }}
              className="px-3 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition"
            >
              Reset
            </button>
          )}
        </div>

        {/* Clean Action Buttons: Add, Import CSV, Export CSV */}
        <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-200">
          {/* Add Asset */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#002147] hover:bg-[#001733] text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>Add Asset</span>
          </button>

          {/* Hidden File Input for CSV Import */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportCsv}
            accept=".csv,text/csv"
            className="hidden"
          />

          {/* Import CSV Button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
            title="Import assets from a CSV file"
          >
            <Upload className="w-4 h-4 text-white" />
            <span>Import CSV</span>
          </button>

          {/* Export CSV Button */}
          <button
            onClick={onExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition"
            title="Export all inventory assets to CSV"
          >
            <Download className="w-4 h-4 text-white" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Showing count indicator */}
      <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
        <div>
          Showing <strong className="text-slate-800">{totalFiltered}</strong> of{' '}
          <span>{totalAll} registered assets</span>
        </div>
        <div className="text-slate-400 text-[11px]">
          Order: Category → Brand → Model
        </div>
      </div>
    </div>
  );
};
