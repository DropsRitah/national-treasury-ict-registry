import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_ASSETS } from './data/initialAssets';
import { Asset } from './types/inventory';
import { Navbar } from './components/Navbar';
import { StatsCards } from './components/StatsCards';
import { SearchBar } from './components/SearchBar';
import { ProductNotFoundAlert } from './components/ProductNotFoundAlert';
import { AssetTable } from './components/AssetTable';
import { AddAssetModal } from './components/AddAssetModal';
import { EditAssetModal } from './components/EditAssetModal';
import { LoginModal } from './components/LoginModal';

const STORAGE_KEY_ASSETS = 'treasury_ict_assets_mysql';

export default function App() {
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_ASSETS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_ASSETS;
      }
    }
    return INITIAL_ASSETS;
  });

  const [adminUsername] = useState('admin');
  const [adminPassword] = useState('Treasury@2026');
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  // Search & Category filter
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [prefillRegisterTerm, setPrefillRegisterTerm] = useState('');
  const [importNotification, setImportNotification] = useState<string | null>(null);

  // Save changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  }, [assets]);

  // Filter & Group: Category ASC -> Brand ASC -> Model ASC
  const filteredAssets = useMemo(() => {
    let result = [...assets];

    if (selectedCategory !== 'All') {
      result = result.filter((a) => a.category === selectedCategory);
    }

    if (selectedStatus !== 'All') {
      result = result.filter((a) => a.status === selectedStatus);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (a) =>
          a.serial_number.toLowerCase().includes(q) ||
          a.model.toLowerCase().includes(q) ||
          a.brand.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.assigned_to && a.assigned_to.toLowerCase().includes(q))
      );
    }

    // Default sorting: Category -> Brand -> Model
    result.sort((a, b) => {
      const catCompare = a.category.localeCompare(b.category);
      if (catCompare !== 0) return catCompare;

      const brandCompare = a.brand.localeCompare(b.brand);
      if (brandCompare !== 0) return brandCompare;

      return a.model.localeCompare(b.model);
    });

    return result;
  }, [assets, selectedCategory, selectedStatus, searchQuery]);

  // Trigger "Product Not Available" alert when search produces 0 items
  const isSearchActive = searchQuery.trim().length > 0;
  const isSearchNotFound = isSearchActive && filteredAssets.length === 0;

  // Add Asset
  const handleAddAsset = (newAssetData: Omit<Asset, 'id' | 'date_added'>) => {
    const newId = assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
    const newAsset: Asset = {
      ...newAssetData,
      id: newId,
      date_added: new Date().toISOString().split('T')[0],
    };

    setAssets((prev) => [newAsset, ...prev]);
    return true;
  };

  // Edit Asset
  const handleUpdateAsset = (updatedAsset: Asset) => {
    setAssets((prev) => prev.map((a) => (a.id === updatedAsset.id ? updatedAsset : a)));
  };

  // Delete Asset
  const handleDeleteAsset = (id: number) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
  };

  // Quick Register trigger
  const handleQuickRegisterPrefill = (term: string) => {
    setPrefillRegisterTerm(term);
    setIsAddModalOpen(true);
  };

  // CSV Export
  const handleExportCsv = () => {
    const headers = ['Serial Number', 'Model', 'Brand', 'Category', 'Status', 'Assigned To'];
    const rows = filteredAssets.map((a) => [
      `"${a.serial_number}"`,
      `"${a.model}"`,
      `"${a.brand}"`,
      `"${a.category}"`,
      `"${a.status}"`,
      `"${a.assigned_to || ''}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'treasury_inventory.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // CSV Import
  const handleImportCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text) return;

        const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
        if (lines.length < 2) {
          alert('CSV file appears empty or has only a header row.');
          return;
        }

        let importedCount = 0;
        let startId = assets.length > 0 ? Math.max(...assets.map((a) => a.id)) + 1 : 1;
        const newItems: Asset[] = [];

        // Parse lines (skipping header)
        for (let i = 1; i < lines.length; i++) {
          const row = lines[i];
          // Handle quoted commas
          const cols = row.split(',').map((c) => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 4) {
            const sn = cols[0];
            const model = cols[1];
            const brand = cols[2];
            const category = cols[3] as Asset['category'];
            const status = (cols[4] as Asset['status']) || 'In Store';
            const assigned_to = cols[5] || 'Unassigned';

            // Check if already in system by Serial Number
            const exists = assets.some((a) => a.serial_number.toLowerCase() === sn.toLowerCase()) ||
              newItems.some((a) => a.serial_number.toLowerCase() === sn.toLowerCase());

            if (!exists && sn && model && brand) {
              newItems.push({
                id: startId++,
                serial_number: sn,
                model,
                brand,
                category: category || 'Laptop',
                status: status || 'In Store',
                assigned_to,
                date_added: new Date().toISOString().split('T')[0],
              });
              importedCount++;
            }
          }
        }

        if (newItems.length > 0) {
          setAssets((prev) => [...newItems, ...prev]);
          setImportNotification(`Successfully imported ${importedCount} asset(s) from CSV.`);
          setTimeout(() => setImportNotification(null), 4000);
        } else {
          alert('No new assets were imported (all entries already exist or had invalid format).');
        }
      } catch (err) {
        alert('Failed to parse CSV file. Ensure it has columns: Serial Number, Model, Brand, Category, Status, Assigned To');
      }
    };
    reader.readAsText(file);
    // Reset input
    e.target.value = '';
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        isLoggedIn={isLoggedIn}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsLoginModalOpen(true);
        }}
        onLoginClick={() => setIsLoginModalOpen(true)}
        adminUsername={adminUsername}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-grow w-full">
        {/* Import notification banner */}
        {importNotification && (
          <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-800 flex justify-between items-center">
            <span>✓ {importNotification}</span>
            <button onClick={() => setImportNotification(null)} className="text-emerald-700 font-bold">×</button>
          </div>
        )}

        {/* Overview Stats */}
        <StatsCards
          assets={assets}
          onFilterByCategory={(cat) => setSelectedCategory(cat)}
          onFilterByStatus={(st) => setSelectedStatus(st)}
        />

        {/* Single search bar to check products in the system + Import/Export buttons */}
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          onOpenAddModal={() => {
            setPrefillRegisterTerm('');
            setIsAddModalOpen(true);
          }}
          onExportCsv={handleExportCsv}
          onImportCsv={handleImportCsv}
          totalFiltered={filteredAssets.length}
          totalAll={assets.length}
        />

        {/* Notification when keyed-in item is not available in system */}
        {isSearchNotFound && (
          <ProductNotFoundAlert
            searchQuery={searchQuery}
            onClearSearch={() => setSearchQuery('')}
            onQuickRegister={handleQuickRegisterPrefill}
          />
        )}

        {/* Asset Table */}
        <AssetTable
          assets={filteredAssets}
          onEdit={(asset) => {
            setEditingAsset(asset);
            setIsEditModalOpen(true);
          }}
          onDelete={handleDeleteAsset}
          onQuickRegister={() => {
            setPrefillRegisterTerm('');
            setIsAddModalOpen(true);
          }}
        />
      </main>

      {/* Modals */}
      <AddAssetModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setPrefillRegisterTerm('');
        }}
        onAdd={handleAddAsset}
        prefillQuery={prefillRegisterTerm}
        existingSerialNumbers={assets.map((a) => a.serial_number)}
      />

      <EditAssetModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAsset(null);
        }}
        asset={editingAsset}
        onUpdate={handleUpdateAsset}
      />

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccessLogin={() => setIsLoggedIn(true)}
        adminUsername={adminUsername}
        adminPasswordHash={adminPassword}
      />
    </div>
  );
}
