import React, { useState } from 'react';
import { Calculator, Plus, Trash2 } from 'lucide-react';
import {
  BusinessConfig,
  MenuCategory,
  MenuItem,
} from '../types/flowfund';
import { formatCurrency, roundMoney } from '../utils/calculations';

interface MenuSetupTabProps {
  config: BusinessConfig;
  menuItems: MenuItem[];
  onUpdateConfig: (next: BusinessConfig) => void;
  onUpdateMenuItem: (updated: MenuItem) => void;
  onAddMenuItem: (category: MenuCategory, isTentative: boolean) => void;
  onRemoveMenuItem: (id: string) => void;
}

export const MenuSetupTab: React.FC<MenuSetupTabProps> = ({
  config,
  menuItems,
  onUpdateConfig,
  onUpdateMenuItem,
  onAddMenuItem,
  onRemoveMenuItem,
}) => {
  // Optional Bulk Batch Cost -> Per-Serving Unit Cost helper state
  const [helperOpenId, setHelperOpenId] = useState<string | null>(null);
  const [batchTotalCost, setBatchTotalCost] = useState<string>('');
  const [batchYieldServings, setBatchYieldServings] = useState<string>('25');

  const applyBatchCostToItem = (item: MenuItem) => {
    const cost = Number.parseFloat(batchTotalCost);
    const servings = Number.parseFloat(batchYieldServings);
    if (!Number.isNaN(cost) && !Number.isNaN(servings) && servings > 0) {
      const unitCost = roundMoney(cost / servings);
      onUpdateMenuItem({ ...item, unitCost });
      setHelperOpenId(null);
      setBatchTotalCost('');
    }
  };

  return (
    <div className="space-y-8">
      <header className="pb-5 border-b border-slate-200">
        <p className="text-xs font-medium text-slate-500">
          Menu &amp; Unit Economics Configuration
        </p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1 text-balance">
          Menu Items, Unit Costs &amp; Capital Settings
        </h1>
        <p className="text-sm text-slate-600 mt-1 max-w-2xl">
          Set each product&apos;s production cost per 1 order and selling price
          per 1 order. Need help converting bulk grocery ingredients into a
          per-order cost? Use the built-in Batch Cost Calculator on any card.
        </p>
      </header>

      {/* General Business & Capital Settings */}
      <section className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 space-y-4">
        <h2 className="text-base font-semibold text-slate-900">
          Business &amp; Profit Split Preferences
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-5">
            <label
              htmlFor="setup-biz-name"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Stall / Business Name
            </label>
            <input
              id="setup-biz-name"
              type="text"
              maxLength={60}
              value={config.businessName}
              onChange={(e) =>
                onUpdateConfig({ ...config, businessName: e.target.value })
              }
              className="w-full min-h-[42px] px-3.5 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-3">
            <label
              htmlFor="setup-capital"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Starting Capital ({config.currencySymbol})
            </label>
            <input
              id="setup-capital"
              type="number"
              min={0}
              step="50"
              value={config.startingCapital}
              onChange={(e) => {
                const v = Number.parseFloat(e.target.value);
                onUpdateConfig({
                  ...config,
                  startingCapital: Number.isNaN(v) ? 0 : Math.max(0, v),
                });
              }}
              className="w-full min-h-[42px] px-3.5 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div className="sm:col-span-4">
            <label
              htmlFor="setup-savings-pct"
              className="block text-xs font-medium text-slate-700 mb-1"
            >
              Savings Buffer (% of Net Profit)
            </label>
            <div className="flex items-center gap-3">
              <input
                id="setup-savings-pct"
                type="number"
                min={0}
                max={100}
                value={config.profitSavingsPercent}
                onChange={(e) => {
                  const v = Number.parseInt(e.target.value, 10);
                  const clamped = Number.isNaN(v)
                    ? 0
                    : Math.min(100, Math.max(0, v));
                  onUpdateConfig({
                    ...config,
                    profitSavingsPercent: clamped,
                  });
                }}
                className="w-24 min-h-[42px] px-3 py-2 text-sm font-mono tabular-nums text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
              <span className="text-xs text-slate-500">
                {100 - config.profitSavingsPercent}% goes to Owner&apos;s Profit
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Items Editor */}
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Menu Lineup ({menuItems.length} Items)
            </h2>
            <p className="text-xs text-slate-500">
              Pre-configured for 2 Rice Toppers, 1 Drink, and 1 Tentative
              Dessert
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onAddMenuItem(MenuCategory.Dessert, true)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Add Tentative Option</span>
            </button>
            <button
              type="button"
              onClick={() => onAddMenuItem(MenuCategory.RiceTopper, false)}
              className="min-h-[40px] px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              <span>Add Menu Item</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {menuItems.map((item) => {
            const unitProfit = roundMoney(item.sellingPrice - item.unitCost);
            const margin =
              item.sellingPrice > 0
                ? Math.round((unitProfit / item.sellingPrice) * 1000) / 10
                : 0;
            const isHelperOpen = helperOpenId === item.id;

            return (
              <article
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-600">
                      {item.slotLabel}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateMenuItem({
                            ...item,
                            isTentative: !item.isTentative,
                          })
                        }
                        className={`min-h-[32px] px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                          item.isTentative
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {item.isTentative
                          ? 'Status: Tentative (Not Final)'
                          : 'Status: Final Menu'}
                      </button>

                      {menuItems.length > 1 && (
                        <button
                          type="button"
                          aria-label={`Remove ${item.name}`}
                          onClick={() => onRemoveMenuItem(item.id)}
                          className="min-h-[34px] min-w-[34px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Item Name & Category */}
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-8">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Menu Item Name
                      </label>
                      <input
                        type="text"
                        maxLength={60}
                        value={item.name}
                        onChange={(e) =>
                          onUpdateMenuItem({ ...item, name: e.target.value })
                        }
                        className="w-full min-h-[42px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div className="sm:col-span-4">
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Category
                      </label>
                      <select
                        value={item.category}
                        onChange={(e) =>
                          onUpdateMenuItem({
                            ...item,
                            category: e.target.value as MenuCategory,
                          })
                        }
                        className="w-full min-h-[42px] px-3 py-2 text-sm text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      >
                        <option value={MenuCategory.RiceTopper}>
                          Rice Topper
                        </option>
                        <option value={MenuCategory.Drink}>Drink</option>
                        <option value={MenuCategory.Dessert}>Dessert</option>
                      </select>
                    </div>
                  </div>

                  {/* Unit Cost & Selling Price */}
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Cost per 1 Order ({config.currencySymbol})
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={item.unitCost}
                        onChange={(e) => {
                          const v = Number.parseFloat(e.target.value);
                          onUpdateMenuItem({
                            ...item,
                            unitCost: Number.isNaN(v) ? 0 : Math.max(0, v),
                          });
                        }}
                        className="w-full min-h-[42px] px-3 py-2 text-sm font-mono tabular-nums font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-700 mb-1">
                        Selling Price ({config.currencySymbol})
                      </label>
                      <input
                        type="number"
                        min={0}
                        step="0.5"
                        value={item.sellingPrice}
                        onChange={(e) => {
                          const v = Number.parseFloat(e.target.value);
                          onUpdateMenuItem({
                            ...item,
                            sellingPrice: Number.isNaN(v) ? 0 : Math.max(0, v),
                          });
                        }}
                        className="w-full min-h-[42px] px-3 py-2 text-sm font-mono tabular-nums font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
                      />
                    </div>
                  </div>

                  {/* Optional Batch Ingredient Cost Helper */}
                  {isHelperOpen && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-3">
                      <p className="text-xs font-medium text-slate-800">
                        Convert Bulk Batch Cost → Cost per 1 Order
                      </p>
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">
                            Total Batch Ingredients + Cups/Bowls (
                            {config.currencySymbol})
                          </label>
                          <input
                            type="number"
                            min={0}
                            placeholder="e.g. 1050"
                            value={batchTotalCost}
                            onChange={(e) => setBatchTotalCost(e.target.value)}
                            className="w-full min-h-[38px] px-2.5 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-600 mb-1">
                            How Many Orders It Makes
                          </label>
                          <input
                            type="number"
                            min={1}
                            placeholder="e.g. 25"
                            value={batchYieldServings}
                            onChange={(e) =>
                              setBatchYieldServings(e.target.value)
                            }
                            className="w-full min-h-[38px] px-2.5 py-1.5 text-xs font-mono tabular-nums bg-white border border-slate-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setHelperOpenId(null)}
                          className="min-h-[34px] px-3 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={() => applyBatchCostToItem(item)}
                          className="min-h-[34px] px-3 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg cursor-pointer"
                        >
                          Apply Unit Cost
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Summary & Helper Toggle */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span
                    className={`font-mono tabular-nums font-semibold ${
                      unitProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    Profit per Order: {unitProfit >= 0 ? '+' : ''}
                    {formatCurrency(unitProfit, config.currencySymbol)} ({margin}
                    % margin)
                  </span>

                  <button
                    type="button"
                    onClick={() =>
                      setHelperOpenId(isHelperOpen ? null : item.id)
                    }
                    className="min-h-[34px] text-blue-700 hover:text-blue-800 font-medium inline-flex items-center gap-1 whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    <Calculator className="w-3.5 h-3.5 shrink-0" />
                    <span>Compute from Bulk Batch</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};
