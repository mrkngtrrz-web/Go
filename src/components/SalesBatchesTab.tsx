import React, { useState } from 'react';
import {
  Award,
  Download,
  Package,
  Plus,
  RotateCcw,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import {
  BusinessConfig,
  SalesBatchRecord,
} from '../types/flowfund';
import {
  batchesToCsv,
  calculateCumulativePouches,
  formatCurrency,
  formatShortDateTime,
} from '../utils/calculations';

interface SalesBatchesTabProps {
  config: BusinessConfig;
  batches: SalesBatchRecord[];
  onDeleteBatch: (id: string) => void;
  onResetDemo: () => void;
  onGoToPlanner: () => void;
}

export const SalesBatchesTab: React.FC<SalesBatchesTabProps> = ({
  config,
  batches,
  onDeleteBatch,
  onResetDemo,
  onGoToPlanner,
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const summary = calculateCumulativePouches(batches);
  const sortedBatches = [...batches].sort(
    (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
  );

  const handleDownloadCsv = () => {
    const csv = batchesToCsv(sortedBatches);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'flowfund-sales-batches.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const pouchCards = [
    {
      title: 'Inventory Cost Recovery',
      subtitle: 'Blue Pouch · Reserved to cook next batches',
      amount: summary.inventoryReplenished,
      icon: Package,
      borderTone: 'border-blue-200/90',
      iconTone: 'bg-blue-50 text-blue-700',
      barFill: 'fill-blue-600',
      share:
        summary.totalGrossSales > 0
          ? Math.round(
              (summary.inventoryReplenished / summary.totalGrossSales) * 100
            )
          : 0,
    },
    {
      title: 'Business Savings',
      subtitle: `Green Pouch · ${config.profitSavingsPercent}% of net profit saved`,
      amount: summary.businessSavings,
      icon: ShieldCheck,
      borderTone: 'border-emerald-200/90',
      iconTone: 'bg-emerald-50 text-emerald-700',
      barFill: 'fill-emerald-600',
      share:
        summary.totalGrossSales > 0
          ? Math.round(
              (summary.businessSavings / summary.totalGrossSales) * 100
            )
          : 0,
    },
    {
      title: "Owner's Profit",
      subtitle: `Gold Pouch · ${100 - config.profitSavingsPercent}% pure team earnings`,
      amount: summary.ownerProfit,
      icon: Award,
      borderTone: 'border-amber-200/90',
      iconTone: 'bg-amber-50 text-amber-700',
      barFill: 'fill-amber-500',
      share:
        summary.totalGrossSales > 0
          ? Math.round((summary.ownerProfit / summary.totalGrossSales) * 100)
          : 0,
    },
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-5 border-b border-slate-200">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Cumulative Pouches &amp; Selling Day History
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 mt-1">
            Recorded Sales Batches
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Tracks completed selling batches by quantity sold—automatically
            separating production cost recovery from your team&apos;s true net
            profit.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={handleDownloadCsv}
            disabled={batches.length === 0}
            className="min-h-[42px] px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 disabled:opacity-50 rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 shrink-0" />
            <span>Export CSV</span>
          </button>

          {confirmReset ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  onResetDemo();
                  setConfirmReset(false);
                }}
                className="min-h-[42px] px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Confirm Reset
              </button>
              <button
                type="button"
                onClick={() => setConfirmReset(false)}
                className="min-h-[42px] px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setConfirmReset(true)}
              className="min-h-[42px] px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 shrink-0" />
              <span>Reset Demo</span>
            </button>
          )}
        </div>
      </header>

      {/* Three Cumulative Pouch Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {pouchCards.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className={`bg-white border ${card.borderTone} rounded-2xl p-5 flex flex-col justify-between`}
            >
              <div>
                <svg
                  viewBox="0 0 100 4"
                  preserveAspectRatio="none"
                  className="w-full h-1.5 rounded-full overflow-hidden mb-4 bg-slate-100"
                  aria-hidden="true"
                >
                  <rect
                    x={0}
                    y={0}
                    width={Math.min(100, Math.max(0, card.share))}
                    height={4}
                    className={card.barFill}
                  />
                </svg>

                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-500">
                      {card.subtitle}
                    </p>
                    <h2 className="text-lg font-semibold text-slate-900 mt-0.5 truncate">
                      {card.title}
                    </h2>
                  </div>
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${card.iconTone}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-100 flex items-baseline justify-between gap-2">
                <span className="text-2xl sm:text-3xl font-mono tabular-nums font-semibold text-slate-900">
                  {formatCurrency(card.amount, config.currencySymbol)}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-500">
                  {card.share}% of gross sales
                </span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Recorded Batches Feed */}
      <section className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Batch Sales History ({batches.length} Batches ·{' '}
              {summary.totalUnitsSold} Total Orders Sold)
            </h2>
            <p className="text-xs text-slate-500">
              Combined Net Profit Earned:{' '}
              <span className="font-mono tabular-nums font-semibold text-emerald-700">
                +{formatCurrency(summary.totalNetProfit, config.currencySymbol)}
              </span>
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToPlanner}
            className="min-h-[38px] px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 shrink-0" />
            <span>Plan New Batch</span>
          </button>
        </div>

        {sortedBatches.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <p className="text-base font-medium text-slate-900">
              No sales batches recorded yet
            </p>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Use the Profit Planner tab to set quantities for your Rice
              Toppers, Drink, and Dessert, then click &ldquo;Record Sold
              Quantities to Sales Log.&rdquo;
            </p>
            <button
              type="button"
              onClick={onGoToPlanner}
              className="min-h-[44px] px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
            >
              Open Profit Planner
            </button>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {sortedBatches.map((batch) => {
              const isConfirming = confirmDeleteId === batch.id;
              return (
                <li
                  key={batch.id}
                  className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                      <span className="font-mono tabular-nums">{batch.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formatShortDateTime(batch.dateTime)}</span>
                      <span aria-hidden="true">·</span>
                      <span>{batch.totalUnits} total servings</span>
                    </div>
                    <h3 className="text-base font-semibold text-slate-900">
                      {batch.label}
                    </h3>
                    <p className="text-xs text-slate-600">
                      {batch.itemsSummary}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-5 shrink-0">
                    <div className="text-right font-mono tabular-nums space-y-0.5">
                      <div className="text-xs text-slate-500">
                        Sales:{' '}
                        {formatCurrency(
                          batch.grossRevenue,
                          config.currencySymbol
                        )}{' '}
                        · Cost:{' '}
                        {formatCurrency(batch.totalCost, config.currencySymbol)}
                      </div>
                      <div className="text-base font-semibold text-emerald-700">
                        Profit: +
                        {formatCurrency(batch.netProfit, config.currencySymbol)}
                      </div>
                    </div>

                    {isConfirming ? (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            onDeleteBatch(batch.id);
                            setConfirmDeleteId(null);
                          }}
                          className="min-h-[36px] px-2.5 py-1 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId(null)}
                          className="min-h-[36px] px-2 py-1 text-xs text-slate-600 hover:text-slate-900 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        aria-label={`Delete batch ${batch.id}`}
                        onClick={() => setConfirmDeleteId(batch.id)}
                        className="min-h-[40px] min-w-[40px] flex items-center justify-center text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
};
