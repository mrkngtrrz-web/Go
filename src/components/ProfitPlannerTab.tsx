import React, { useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Check,
  CheckCircle2,
  Minus,
  Package,
  Pencil,
  Plus,
  ShieldCheck,
} from 'lucide-react';
import {
  BusinessConfig,
  MenuItem,
  PlannerTotals,
} from '../types/flowfund';
import { formatCurrency } from '../utils/calculations';

interface ProfitPlannerTabProps {
  config: BusinessConfig;
  menuItems: MenuItem[];
  totals: PlannerTotals;
  onUpdateConfig: (next: BusinessConfig) => void;
  onUpdateQuantity: (id: string, nextQty: number) => void;
  onToggleIncluded: (id: string) => void;
  onRecordBatch: (batchLabel: string) => void;
  onOpenManual: () => void;
  onOpenMenuSetup: () => void;
}

export const ProfitPlannerTab: React.FC<ProfitPlannerTabProps> = ({
  config,
  menuItems,
  totals,
  onUpdateConfig,
  onUpdateQuantity,
  onToggleIncluded,
  onRecordBatch,
  onOpenManual,
  onOpenMenuSetup,
}) => {
  const [batchLabel, setBatchLabel] = useState('');
  const [capitalInput, setCapitalInput] = useState(
    String(config.startingCapital)
  );

  React.useEffect(() => {
    setCapitalInput(String(config.startingCapital));
  }, [config.startingCapital]);

  const handleCapitalBlur = () => {
    const parsed = Number.parseFloat(capitalInput);
    if (!Number.isNaN(parsed) && parsed >= 0) {
      onUpdateConfig({ ...config, startingCapital: parsed });
    } else {
      setCapitalInput(String(config.startingCapital));
    }
  };

  const tentativeItems = menuItems.filter((m) => m.isTentative);
  const hasTentativeItem = tentativeItems.length > 0;

  const capitalUsagePercent =
    config.startingCapital > 0
      ? Math.min(
          100,
          Math.max(0, (totals.totalProductionCost / config.startingCapital) * 100)
        )
      : 100;

  const handleSaveBatchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (totals.activeUnitCount <= 0) return;
    const cleanLabel =
      batchLabel.trim() ||
      `Sales Batch (${totals.activeUnitCount} orders sold)`;
    onRecordBatch(cleanLabel);
    setBatchLabel('');
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Operating Guide Banner */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500">
            <span>{config.businessName}</span>
            <span aria-hidden="true">·</span>
            <span>Quantity-to-Profit Calculator</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={onOpenManual}
              className="text-blue-700 hover:text-blue-800 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 shrink-0" />
              <span>How to Operate This App (Step-by-Step Guide)</span>
            </button>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
            Menu Quantity &amp; Profit Planner
          </h1>
          <p className="text-sm text-slate-600 max-w-2xl">
            Enter how many servings of your 2 Rice Toppers, 1 Drink, and
            optional 1 Dessert you plan to make or sell. Your required capital
            and exact net profit calculate automatically.
          </p>
        </div>

        {/* Inline Starting Capital & Currency Controls */}
        <div className="flex flex-wrap sm:flex-nowrap items-end gap-3 shrink-0">
          <div>
            <label
              htmlFor="starting-capital-input"
              className="block text-xs font-medium text-slate-600 mb-1"
            >
              Starting Team Capital
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-mono text-slate-400 pointer-events-none">
                {config.currencySymbol}
              </span>
              <input
                id="starting-capital-input"
                type="number"
                min={0}
                step="50"
                value={capitalInput}
                onChange={(e) => {
                  setCapitalInput(e.target.value);
                  const val = Number.parseFloat(e.target.value);
                  if (!Number.isNaN(val) && val >= 0) {
                    onUpdateConfig({ ...config, startingCapital: val });
                  }
                }}
                onBlur={handleCapitalBlur}
                className="w-36 min-h-[42px] pl-7 pr-3 py-1.5 text-sm font-mono tabular-nums font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <span className="block text-xs font-medium text-slate-600 mb-1">
              Currency
            </span>
            <div
              role="group"
              aria-label="Currency selector"
              className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl min-h-[42px]"
            >
              {(['₱', '$'] as const).map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() =>
                    onUpdateConfig({ ...config, currencySymbol: sym })
                  }
                  className={`min-h-[34px] px-3 py-1 text-xs font-mono font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    config.currencySymbol === sym
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {sym}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols): Menu Item Quantity Cards */}
        <section
          aria-labelledby="menu-quantities-heading"
          className="lg:col-span-7 space-y-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2
                id="menu-quantities-heading"
                className="text-lg font-semibold text-slate-900"
              >
                1. Set Quantities per Menu Item
              </h2>
              <p className="text-xs text-slate-500">
                Adjust servings below or edit unit costs &amp; prices anytime
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenMenuSetup}
              className="min-h-[38px] px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl inline-flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Pencil className="w-3.5 h-3.5 shrink-0" />
              <span>Edit Costs &amp; Prices</span>
            </button>
          </div>

          <div className="space-y-4">
            {totals.items.map((entry) => {
              const { item, unitProfit, marginPercent, totalCost, grossRevenue, netProfit } =
                entry;
              const isExcluded = !item.isIncluded;

              return (
                <article
                  key={item.id}
                  className={`bg-white border rounded-2xl p-5 transition-colors ${
                    isExcluded
                      ? 'border-slate-200/80 opacity-65'
                      : item.isTentative
                        ? 'border-amber-300'
                        : 'border-slate-200'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {item.slotLabel}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{item.category}</span>
                        {item.isTentative && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span className="text-amber-700 font-medium">
                              Tentative Menu Option
                            </span>
                          </>
                        )}
                      </div>

                      <h3 className="text-base sm:text-lg font-semibold text-slate-900 truncate">
                        {item.name}
                      </h3>

                      {/* Clean Unboxed Unit Economics Metadata */}
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs font-mono tabular-nums text-slate-600">
                        <span>
                          Cost:{' '}
                          {formatCurrency(item.unitCost, config.currencySymbol)}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>
                          Price:{' '}
                          {formatCurrency(
                            item.sellingPrice,
                            config.currencySymbol
                          )}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span
                          className={
                            unitProfit >= 0
                              ? 'text-emerald-700 font-medium'
                              : 'text-rose-700 font-medium'
                          }
                        >
                          Profit/Order: {unitProfit >= 0 ? '+' : ''}
                          {formatCurrency(unitProfit, config.currencySymbol)} (
                          {marginPercent}%)
                        </span>
                      </div>
                    </div>

                    {/* Optional Include / Skip Toggle (Highlighted for Tentative Dessert) */}
                    {item.isTentative && (
                      <div
                        role="group"
                        aria-label={`Include or exclude ${item.name}`}
                        className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl shrink-0 self-start"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (!item.isIncluded) onToggleIncluded(item.id);
                          }}
                          className={`min-h-[34px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            item.isIncluded
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Include Dessert
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (item.isIncluded) onToggleIncluded(item.id);
                          }}
                          className={`min-h-[34px] px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                            !item.isIncluded
                              ? 'bg-white text-slate-900 shadow-xs'
                              : 'text-slate-600 hover:text-slate-900'
                          }`}
                        >
                          Skip for Now
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Quantity Controls & Item Profit Subtotal */}
                  <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={isExcluded || item.quantity <= 0}
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(0, item.quantity - 5)
                          )
                        }
                        className="min-h-[44px] px-2.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
                      >
                        -5
                      </button>
                      <button
                        type="button"
                        disabled={isExcluded || item.quantity <= 0}
                        aria-label={`Decrease ${item.name} quantity by 1`}
                        onClick={() =>
                          onUpdateQuantity(
                            item.id,
                            Math.max(0, item.quantity - 1)
                          )
                        }
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <input
                          type="number"
                          min={0}
                          max={9999}
                          disabled={isExcluded}
                          aria-label={`${item.name} quantity`}
                          value={item.quantity}
                          onChange={(e) => {
                            const val = Number.parseInt(e.target.value, 10);
                            onUpdateQuantity(
                              item.id,
                              Number.isNaN(val) ? 0 : Math.max(0, val)
                            );
                          }}
                          className="w-20 min-h-[44px] px-2 text-center text-base font-mono tabular-nums font-semibold text-slate-900 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:bg-slate-50"
                        />
                      </div>

                      <button
                        type="button"
                        disabled={isExcluded}
                        aria-label={`Increase ${item.name} quantity by 1`}
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 1)
                        }
                        className="min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-700 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isExcluded}
                        onClick={() =>
                          onUpdateQuantity(item.id, item.quantity + 5)
                        }
                        className="min-h-[44px] px-2.5 text-xs font-mono font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded-xl transition-colors cursor-pointer"
                      >
                        +5
                      </button>
                    </div>

                    {/* Item Totals */}
                    <div className="flex items-center justify-between sm:justify-end gap-5 text-right font-mono tabular-nums">
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Batch Cost
                        </div>
                        <div className="text-xs font-medium text-slate-700">
                          {formatCurrency(totalCost, config.currencySymbol)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Gross Sales
                        </div>
                        <div className="text-xs font-medium text-slate-700">
                          {formatCurrency(grossRevenue, config.currencySymbol)}
                        </div>
                      </div>
                      <div>
                        <div className="text-[11px] font-sans text-slate-500">
                          Item Profit
                        </div>
                        <div
                          className={`text-sm font-semibold ${
                            isExcluded
                              ? 'text-slate-400'
                              : netProfit >= 0
                                ? 'text-emerald-700'
                                : 'text-rose-700'
                          }`}
                        >
                          {isExcluded
                            ? 'Skipped'
                            : `${netProfit >= 0 ? '+' : ''}${formatCurrency(netProfit, config.currencySymbol)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right Column (5 cols): Profit Result, Capital Fit, Dessert Comparison & Pouch Split */}
        <section
          aria-labelledby="profit-results-heading"
          className="lg:col-span-5 space-y-5"
        >
          {/* Main Profit & Capital Summary Card */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
            <div>
              <p
                id="profit-results-heading"
                className="text-xs font-medium text-slate-500"
              >
                2. Projected Profit for {totals.activeUnitCount} Total Servings
              </p>
              <div className="mt-1 flex items-baseline justify-between gap-2 flex-wrap">
                <span
                  className={`text-4xl font-mono tabular-nums font-semibold tracking-tight ${
                    totals.netProfit >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {totals.netProfit >= 0 ? '+' : ''}
                  {formatCurrency(totals.netProfit, config.currencySymbol)}
                </span>
                <span className="text-xs font-mono tabular-nums text-slate-600">
                  {totals.overallMarginPercent}% profit margin
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Pure profit after recovering{' '}
                {formatCurrency(
                  totals.totalProductionCost,
                  config.currencySymbol
                )}{' '}
                in production costs from{' '}
                {formatCurrency(totals.grossRevenue, config.currencySymbol)} in
                gross sales.
              </p>
            </div>

            {/* Key Breakdown Metrics */}
            <div className="pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 font-mono tabular-nums">
              <div>
                <div className="text-xs font-sans text-slate-500">
                  Gross Sales Revenue
                </div>
                <div className="text-base font-semibold text-slate-900 mt-0.5">
                  {formatCurrency(totals.grossRevenue, config.currencySymbol)}
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-slate-500">
                  Production Cost Needed
                </div>
                <div className="text-base font-semibold text-slate-900 mt-0.5">
                  {formatCurrency(
                    totals.totalProductionCost,
                    config.currencySymbol
                  )}
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-slate-500">
                  Return on Cost (ROI)
                </div>
                <div className="text-sm font-semibold text-emerald-700 mt-0.5">
                  +{totals.returnOnCapitalPercent}%
                </div>
              </div>
              <div>
                <div className="text-xs font-sans text-slate-500">
                  Break-Even Sales
                </div>
                <div className="text-sm font-semibold text-slate-900 mt-0.5">
                  ~{totals.breakEvenUnitsApprox} orders
                </div>
              </div>
            </div>

            {/* Starting Capital Fit Bar */}
            <div className="pt-4 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between gap-2 text-xs">
                <span className="font-medium text-slate-700">
                  Capital Budget Fit
                </span>
                {totals.isWithinCapital ? (
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      {formatCurrency(
                        totals.remainingCapital,
                        config.currencySymbol
                      )}{' '}
                      capital spare
                    </span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 font-semibold text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      Short by{' '}
                      {formatCurrency(
                        Math.abs(totals.remainingCapital),
                        config.currencySymbol
                      )}
                    </span>
                  </span>
                )}
              </div>

              <svg
                viewBox="0 0 100 4"
                preserveAspectRatio="none"
                className="w-full h-2 rounded-full overflow-hidden bg-slate-100"
                aria-hidden="true"
              >
                <rect
                  x={0}
                  y={0}
                  width={capitalUsagePercent}
                  height={4}
                  className={
                    totals.isWithinCapital
                      ? 'fill-blue-600 transition-all duration-200'
                      : 'fill-rose-600 transition-all duration-200'
                  }
                />
              </svg>

              <p className="text-xs text-slate-500 font-mono tabular-nums">
                Uses{' '}
                {formatCurrency(
                  totals.totalProductionCost,
                  config.currencySymbol
                )}{' '}
                of{' '}
                {formatCurrency(config.startingCapital, config.currencySymbol)}{' '}
                starting capital
              </p>
            </div>

            {/* Tentative Dessert Decision Comparison */}
            {hasTentativeItem && (
              <div className="pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-slate-900">
                    Tentative Dessert Decision Comparison
                  </h3>
                  <span className="text-xs text-slate-500">
                    With vs. Without
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-50 space-y-1">
                    <div className="font-medium text-slate-700">
                      Without Dessert
                    </div>
                    <div className="font-mono tabular-nums text-slate-500">
                      Cost:{' '}
                      {formatCurrency(
                        totals.withoutTentativeCost,
                        config.currencySymbol
                      )}
                    </div>
                    <div className="font-mono tabular-nums font-semibold text-slate-900">
                      Profit: +
                      {formatCurrency(
                        totals.withoutTentativeProfit,
                        config.currencySymbol
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-50/60 space-y-1">
                    <div className="font-medium text-slate-900">
                      With Dessert
                    </div>
                    <div className="font-mono tabular-nums text-slate-600">
                      Cost:{' '}
                      {formatCurrency(
                        totals.withTentativeCost,
                        config.currencySymbol
                      )}
                    </div>
                    <div className="font-mono tabular-nums font-semibold text-emerald-700">
                      Profit: +
                      {formatCurrency(
                        totals.withTentativeProfit,
                        config.currencySymbol
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-xs text-slate-600">
                  Adding the dessert requires{' '}
                  <span className="font-mono tabular-nums font-medium text-slate-900">
                    +{formatCurrency(totals.tentativeExtraCost, config.currencySymbol)}
                  </span>{' '}
                  more capital and adds{' '}
                  <span className="font-mono tabular-nums font-semibold text-emerald-700">
                    +{formatCurrency(totals.tentativeExtraProfit, config.currencySymbol)}
                  </span>{' '}
                  extra profit.
                </p>
              </div>
            )}
          </div>

          {/* Automatic 3-Pouch Cash Split Preview */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                3. Automatic Envelope Split of Sales
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                How your{' '}
                {formatCurrency(totals.grossRevenue, config.currencySymbol)}{' '}
                gross revenue divides so you never spend next batch&apos;s
                capital
              </p>
            </div>

            <ul className="divide-y divide-slate-100 text-sm">
              <li className="py-2.5 first:pt-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Package className="w-4 h-4 text-blue-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      Inventory Cost Recovery
                    </p>
                    <p className="text-xs text-slate-500">
                      100% of production cost set aside for next batch
                    </p>
                  </div>
                </div>
                <span className="font-mono tabular-nums font-semibold text-blue-700 shrink-0">
                  {formatCurrency(
                    totals.inventoryReplenishmentAmount,
                    config.currencySymbol
                  )}
                </span>
              </li>

              <li className="py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      Business Savings ({config.profitSavingsPercent}% of Profit)
                    </p>
                    <p className="text-xs text-slate-500">
                      Emergency &amp; stall reserve buffer
                    </p>
                  </div>
                </div>
                <span className="font-mono tabular-nums font-semibold text-emerald-700 shrink-0">
                  {formatCurrency(
                    totals.savingsAllocationAmount,
                    config.currencySymbol
                  )}
                </span>
              </li>

              <li className="py-2.5 last:pb-0 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Award className="w-4 h-4 text-amber-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900 truncate">
                      Owner&apos;s Profit ({100 - config.profitSavingsPercent}%
                      of Profit)
                    </p>
                    <p className="text-xs text-slate-500">
                      Pure student team take-home earnings
                    </p>
                  </div>
                </div>
                <span className="font-mono tabular-nums font-semibold text-amber-700 shrink-0">
                  {formatCurrency(
                    totals.ownerProfitAllocationAmount,
                    config.currencySymbol
                  )}
                </span>
              </li>
            </ul>

            {/* Record Batch Action */}
            <form
              onSubmit={handleSaveBatchSubmit}
              className="pt-4 border-t border-slate-100 space-y-3"
            >
              <input
                type="text"
                maxLength={80}
                placeholder="Optional label (e.g., Booth Day 1 Actual Sales)"
                value={batchLabel}
                onChange={(e) => setBatchLabel(e.target.value)}
                className="w-full min-h-[42px] px-3.5 py-2 text-xs text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white"
              />
              <button
                type="submit"
                disabled={totals.activeUnitCount <= 0}
                className="w-full min-h-[46px] px-4 py-2.5 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-40 rounded-xl flex items-center justify-center gap-2 transition-colors whitespace-nowrap cursor-pointer"
              >
                <Check className="w-4 h-4 shrink-0" />
                <span>Record Sold Quantities to Sales Log</span>
              </button>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};
