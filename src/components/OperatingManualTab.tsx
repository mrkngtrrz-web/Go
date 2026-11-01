import React from 'react';
import {
  ArrowRight,
  BookOpen,
  Calculator,
  CheckCircle2,
  Layers,
  Presentation,
  Scale,
} from 'lucide-react';
import { AppTab, BusinessConfig } from '../types/flowfund';
import { formatCurrency } from '../utils/calculations';

interface OperatingManualTabProps {
  config: BusinessConfig;
  onNavigateTab: (tab: AppTab) => void;
}

export const OperatingManualTab: React.FC<OperatingManualTabProps> = ({
  config,
  onNavigateTab,
}) => {
  const sym = config.currencySymbol;

  return (
    <div className="space-y-8">
      {/* Header */}
      <header className="pb-6 border-b border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
          <BookOpen className="w-3.5 h-3.5 text-blue-600 shrink-0" />
          <span>Complete Team Operating Manual</span>
          <span aria-hidden="true">·</span>
          <span>2 Rice Toppers, 1 Drink &amp; 1 Tentative Dessert</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 text-balance">
          How to Operate FlowFund (Step-by-Step Guide)
        </h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          You do <strong className="font-semibold text-slate-900">not</strong>{' '}
          need to log messy grocery or ingredient receipts one by one. Instead,
          FlowFund uses a clean{' '}
          <strong className="font-semibold text-slate-900">
            Quantity-to-Profit model
          </strong>
          : enter your cost and selling price per 1 order once, choose how many
          quantities you plan to make, and immediately see your required capital
          and exact profit.
        </p>
      </header>

      {/* Step-by-Step Operating Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Step 1 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center shrink-0">
                <Calculator className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                01. Set Your Menu Costs &amp; Selling Prices
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Open the <strong className="text-slate-900">Menu &amp; Costs</strong>{' '}
              tab first. Your lineup is pre-built for your{' '}
              <strong className="text-slate-900">2 Rice Toppers</strong>,{' '}
              <strong className="text-slate-900">1 Drink</strong>, and{' '}
              <strong className="text-slate-900">1 Tentative Dessert</strong>.
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">
                    How to get Cost per 1 Order:
                  </strong>{' '}
                  Add up the recipe ingredients + bowl/cup for one batch, then
                  divide by how many servings it makes. Click{' '}
                  <em>&ldquo;Compute from Bulk Batch&rdquo;</em> on any card to
                  let the app divide it for you (for example,{' '}
                  <span className="font-mono tabular-nums">
                    {formatCurrency(1050, sym)} ÷ 25 bowls ={' '}
                    {formatCurrency(42, sym)}/order
                  </span>
                  ).
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Enter Selling Price:</strong>{' '}
                  Type what a customer pays for 1 order (e.g.,{' '}
                  <span className="font-mono tabular-nums">
                    {formatCurrency(75, sym)}
                  </span>
                  ). The app instantly shows your exact profit per single order
                  (<span className="font-mono tabular-nums">+{formatCurrency(33, sym)}</span>).
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab(AppTab.MenuSetup)}
              className="min-h-[40px] text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Go to Menu &amp; Costs Setup</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Step 2 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                02. Enter Quantities to See Total Profit &amp; Capital Fit
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Go to the <strong className="text-slate-900">Profit Planner</strong>{' '}
              tab. Enter your team&apos;s{' '}
              <strong className="text-slate-900">Starting Capital</strong> at
              the top right (for example,{' '}
              <span className="font-mono tabular-nums">
                {formatCurrency(config.startingCapital, sym)}
              </span>
              ), then adjust the quantities for each item using{' '}
              <span className="font-mono">-5 / -1 / +1 / +5</span> or typing
              directly.
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Projected Profit:</strong>{' '}
                  Shows your exact total take-home profit once those quantities
                  sell.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">Capital Budget Fit:</strong>{' '}
                  Compares total production cost against your Starting Capital
                  so you immediately know if you have spare budget left or if
                  your planned quantity is too big for your wallet.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab(AppTab.Planner)}
              className="min-h-[40px] text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Open Profit Planner Calculator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Step 3 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <Scale className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                03. Test Your Tentative 1 Dessert (Include vs. Skip)
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              Because your team is not yet final about the{' '}
              <strong className="text-slate-900">1 Dessert</strong>, the Dessert
              card has a built-in{' '}
              <strong className="text-slate-900">
                Include Dessert / Skip for Now
              </strong>{' '}
              switch.
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Look at the{' '}
                  <strong className="text-slate-900">
                    Tentative Dessert Decision Comparison
                  </strong>{' '}
                  box on the right side of the Profit Planner.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  It compares{' '}
                  <strong className="text-slate-900">Without Dessert</strong> vs.{' '}
                  <strong className="text-slate-900">With Dessert</strong> side
                  by side—showing the exact extra capital needed and the exact
                  extra profit gained—so your group can decide with real numbers.
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab(AppTab.Planner)}
              className="min-h-[40px] text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>Compare With vs. Without Dessert</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>

        {/* Step 4 */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 flex items-center justify-center shrink-0">
                <Presentation className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-semibold text-slate-900">
                04. Record Selling Days &amp; Use the 3 Pouches
              </h2>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed">
              At the end of a selling day, enter the actual quantities sold in
              the Profit Planner and click{' '}
              <strong className="text-slate-900">
                &ldquo;Record Sold Quantities to Sales Log.&rdquo;
              </strong>{' '}
              FlowFund splits your cash into three virtual envelopes:
            </p>

            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">
                    Blue — Inventory Cost Recovery:
                  </strong>{' '}
                  Locks away 100% of your production cost so you always have
                  money to cook tomorrow&apos;s batch without touching your
                  profit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">
                    Green — Business Savings ({config.profitSavingsPercent}%):
                  </strong>{' '}
                  Builds an emergency safety fund from your net profit.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-900">
                    Gold — Owner&apos;s Profit (
                    {100 - config.profitSavingsPercent}%):
                  </strong>{' '}
                  Pure take-home profit your team can safely divide!
                </span>
              </li>
            </ul>
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => onNavigateTab(AppTab.Batches)}
              className="min-h-[40px] text-xs font-semibold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <span>View Recorded Sales Batches &amp; Pouches</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </section>
      </div>

      {/* Formula Reference & Classroom Pitch Cheat Sheet */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6 space-y-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Quick Math Formulas &amp; Classroom Pitch Cheat Sheet
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Use these exact formulas and talking points when explaining your
            system to your groupmates or instructor
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
            <p className="font-semibold text-slate-900">
              Profit per Item Formula
            </p>
            <p className="font-mono text-slate-700">
              Item Profit = Quantity × (Selling Price - Cost per Order)
            </p>
            <p className="text-slate-500">
              Example: 25 bowls × ({formatCurrency(75, sym)} -{' '}
              {formatCurrency(42, sym)}) = +{formatCurrency(825, sym)} profit.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
            <p className="font-semibold text-slate-900">
              Capital Fit Check Formula
            </p>
            <p className="font-mono text-slate-700">
              Spare Capital = Starting Capital - Sum(Quantity × Cost per Order)
            </p>
            <p className="text-slate-500">
              Ensures your planned quantities never exceed the cash your team
              actually brought.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 space-y-1.5">
            <p className="font-semibold text-slate-900">
              Instructor Demo Tip (30 Seconds)
            </p>
            <p className="text-slate-600 leading-relaxed">
              Open <strong className="text-slate-900">Profit Planner</strong>,
              increase Rice Topper quantities by +5, and toggle the{' '}
              <strong className="text-slate-900">Dessert</strong> off and on.
              Show how FlowFund instantly reveals whether your capital covers
              the dessert and separates Cost Recovery from Pure Profit.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
