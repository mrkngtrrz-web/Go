/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  BookOpen,
  Calculator,
  CheckCircle2,
  ReceiptText,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { MenuSetupTab } from './components/MenuSetupTab';
import { OperatingManualTab } from './components/OperatingManualTab';
import { ProfitPlannerTab } from './components/ProfitPlannerTab';
import { SalesBatchesTab } from './components/SalesBatchesTab';
import {
  DEFAULT_BUSINESS_CONFIG,
  INITIAL_MENU_ITEMS,
  INITIAL_SALES_BATCHES,
} from './data/seedData';
import {
  AppTab,
  BusinessConfig,
  MenuCategory,
  MenuItem,
  SalesBatchRecord,
} from './types/flowfund';
import {
  calculatePlannerTotals,
  formatCurrency,
} from './utils/calculations';

const STORAGE_KEYS = {
  config: 'flowfund_config_v2',
  menuItems: 'flowfund_menu_items_v2',
  batches: 'flowfund_sales_batches_v2',
};

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Planner);

  const [config, setConfig] = useState<BusinessConfig>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.config);
      if (saved) return JSON.parse(saved) as BusinessConfig;
    } catch {
      // Fallback to default config
    }
    return DEFAULT_BUSINESS_CONFIG;
  });

  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.menuItems);
      if (saved) return JSON.parse(saved) as MenuItem[];
    } catch {
      // Fallback to initial menu items
    }
    return INITIAL_MENU_ITEMS;
  });

  const [batches, setBatches] = useState<SalesBatchRecord[]>(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEYS.batches);
      if (saved) return JSON.parse(saved) as SalesBatchRecord[];
    } catch {
      // Fallback to initial batches
    }
    return INITIAL_SALES_BATCHES;
  });

  const [feedbackBanner, setFeedbackBanner] = useState<string | null>(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEYS.config, JSON.stringify(config));
    } catch {
      // Ignore storage errors
    }
  }, [config]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.menuItems,
        JSON.stringify(menuItems)
      );
    } catch {
      // Ignore storage errors
    }
  }, [menuItems]);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEYS.batches,
        JSON.stringify(batches)
      );
    } catch {
      // Ignore storage errors
    }
  }, [batches]);

  useEffect(() => {
    if (!feedbackBanner) return;
    const timer = window.setTimeout(() => setFeedbackBanner(null), 3500);
    return () => window.clearTimeout(timer);
  }, [feedbackBanner]);

  const plannerTotals = useMemo(
    () => calculatePlannerTotals(menuItems, config),
    [menuItems, config]
  );

  const handleUpdateQuantity = (id: string, nextQty: number) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, nextQty) } : item
      )
    );
  };

  const handleToggleIncluded = (id: string) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isIncluded: !item.isIncluded } : item
      )
    );
  };

  const handleUpdateMenuItem = (updated: MenuItem) => {
    setMenuItems((prev) =>
      prev.map((item) => (item.id === updated.id ? updated : item))
    );
  };

  const handleAddMenuItem = (category: MenuCategory, isTentative: boolean) => {
    const countInCat =
      menuItems.filter((m) => m.category === category).length + 1;
    const newItem: MenuItem = {
      id: `ITEM-${Date.now().toString(36).toUpperCase()}`,
      slotLabel: isTentative
        ? `${category} ${countInCat} (Not Final)`
        : `${category} ${countInCat}`,
      name: `New ${category} Option`,
      category,
      unitCost: category === MenuCategory.Drink ? 15 : 30,
      sellingPrice: category === MenuCategory.Drink ? 35 : 65,
      quantity: 15,
      isTentative,
      isIncluded: true,
    };
    setMenuItems((prev) => [...prev, newItem]);
    setFeedbackBanner(`Added ${newItem.slotLabel} to your menu lineup.`);
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== id));
    setFeedbackBanner('Removed item from menu lineup.');
  };

  const handleRecordBatch = (batchLabel: string) => {
    if (plannerTotals.activeUnitCount <= 0) return;

    const maxBatchNum = batches.reduce((max, b) => {
      const m = b.id.match(/BATCH-(\d+)/);
      return m ? Math.max(max, Number.parseInt(m[1], 10)) : max;
    }, 100);

    const activeDescriptions = plannerTotals.items
      .filter((entry) => entry.activeQuantity > 0)
      .map((entry) => `${entry.activeQuantity}× ${entry.item.name}`)
      .join(', ');

    const newRecord: SalesBatchRecord = {
      id: `BATCH-${maxBatchNum + 1}`,
      dateTime: new Date().toISOString(),
      label: batchLabel,
      itemsSummary: activeDescriptions,
      totalUnits: plannerTotals.activeUnitCount,
      totalCost: plannerTotals.totalProductionCost,
      grossRevenue: plannerTotals.grossRevenue,
      netProfit: plannerTotals.netProfit,
      inventoryReplenishment: plannerTotals.inventoryReplenishmentAmount,
      savingsAllocated: plannerTotals.savingsAllocationAmount,
      ownerProfitAllocated: plannerTotals.ownerProfitAllocationAmount,
    };

    setBatches((prev) => [newRecord, ...prev]);
    setFeedbackBanner(
      `Recorded ${newRecord.id}: +${formatCurrency(newRecord.netProfit, config.currencySymbol)} net profit added to pouches.`
    );
  };

  const handleDeleteBatch = (id: string) => {
    setBatches((prev) => prev.filter((b) => b.id !== id));
    setFeedbackBanner(`Removed ${id} from sales log.`);
  };

  const handleResetDemo = () => {
    setConfig(DEFAULT_BUSINESS_CONFIG);
    setMenuItems(INITIAL_MENU_ITEMS);
    setBatches(INITIAL_SALES_BATCHES);
    setFeedbackBanner(
      'Restored default 2 Rice Toppers, 1 Drink & 1 Tentative Dessert setup.'
    );
  };

  const navItems: {
    id: AppTab;
    label: string;
    mobileLabel: string;
    icon: React.FC<{ className?: string }>;
  }[] = [
    {
      id: AppTab.Planner,
      label: 'Profit Planner',
      mobileLabel: 'Planner',
      icon: Calculator,
    },
    {
      id: AppTab.MenuSetup,
      label: 'Menu & Costs',
      mobileLabel: 'Menu',
      icon: SlidersHorizontal,
    },
    {
      id: AppTab.Batches,
      label: 'Sales Batches',
      mobileLabel: 'Batches',
      icon: ReceiptText,
    },
    {
      id: AppTab.Manual,
      label: 'Operating Guide',
      mobileLabel: 'Guide',
      icon: BookOpen,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Top Bar Contract: 3 Zones (Wordmark — 4 Nav Links — 1 Primary Action) */}
      <header className="relative md:sticky md:top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-8 px-4 sm:px-6 h-14 sm:h-16">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#planner"
            onClick={(e) => {
              e.preventDefault();
              setActiveTab(AppTab.Planner);
            }}
            className="font-display text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            FlowFund
          </a>

          {/* Zone 2: 4 clean single-line text navigation links */}
          <nav
            aria-label="Primary Navigation"
            className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600"
          >
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-5 border-b-2 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    isActive
                      ? 'border-slate-900 text-slate-900 font-semibold'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() =>
                setActiveTab(
                  activeTab === AppTab.Manual ? AppTab.Planner : AppTab.Manual
                )
              }
              className="min-h-[40px] px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              {activeTab === AppTab.Manual
                ? 'Open Profit Planner'
                : 'Operating Manual'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 pb-24 md:pb-12">
        {feedbackBanner && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 px-4 py-3 rounded-xl bg-slate-900 text-white text-sm flex items-center justify-between gap-3"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="truncate">{feedbackBanner}</span>
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setFeedbackBanner(null)}
              className="w-7 h-7 flex items-center justify-center text-slate-400 hover:text-white rounded-lg shrink-0 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {activeTab === AppTab.Planner && (
          <ProfitPlannerTab
            config={config}
            menuItems={menuItems}
            totals={plannerTotals}
            onUpdateConfig={setConfig}
            onUpdateQuantity={handleUpdateQuantity}
            onToggleIncluded={handleToggleIncluded}
            onRecordBatch={handleRecordBatch}
            onOpenManual={() => setActiveTab(AppTab.Manual)}
            onOpenMenuSetup={() => setActiveTab(AppTab.MenuSetup)}
          />
        )}

        {activeTab === AppTab.MenuSetup && (
          <MenuSetupTab
            config={config}
            menuItems={menuItems}
            onUpdateConfig={setConfig}
            onUpdateMenuItem={handleUpdateMenuItem}
            onAddMenuItem={handleAddMenuItem}
            onRemoveMenuItem={handleRemoveMenuItem}
          />
        )}

        {activeTab === AppTab.Batches && (
          <SalesBatchesTab
            config={config}
            batches={batches}
            onDeleteBatch={handleDeleteBatch}
            onResetDemo={handleResetDemo}
            onGoToPlanner={() => setActiveTab(AppTab.Planner)}
          />
        )}

        {activeTab === AppTab.Manual && (
          <OperatingManualTab
            config={config}
            onNavigateTab={(tab) => setActiveTab(tab)}
          />
        )}
      </main>

      {/* Quiet Desktop Footer */}
      <footer className="hidden md:block border-t border-slate-200 bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between text-xs text-slate-500">
          <span>
            FlowFund · Quantity-to-Profit Planner ({config.businessName})
          </span>
          <button
            type="button"
            onClick={() => setActiveTab(AppTab.Manual)}
            className="hover:text-slate-900 transition-colors cursor-pointer"
          >
            Read Step-by-Step Operating Guide
          </button>
        </div>
      </footer>

      {/* Mobile Fixed Bottom Tab Bar (56px height, <15% viewport sticky cap) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200"
      >
        <div className="grid grid-cols-4 items-center h-14">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`min-h-[44px] h-full flex flex-col items-center justify-center transition-colors cursor-pointer ${
                  isActive
                    ? 'text-blue-700 font-semibold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="text-[11px] tracking-tight mt-0.5 whitespace-nowrap">
                  {item.mobileLabel}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
