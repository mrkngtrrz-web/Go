import {
  BusinessConfig,
  ItemProfitBreakdown,
  MenuItem,
  PlannerTotals,
  SalesBatchRecord,
} from '../types/flowfund';

export function roundMoney(val: number): number {
  return Math.round((val + Number.EPSILON) * 100) / 100;
}

export function calculatePlannerTotals(
  menuItems: MenuItem[],
  config: BusinessConfig
): PlannerTotals {
  const breakdowns: ItemProfitBreakdown[] = menuItems.map((item) => {
    const unitProfit = roundMoney(item.sellingPrice - item.unitCost);
    const marginPercent =
      item.sellingPrice > 0
        ? Math.round((unitProfit / item.sellingPrice) * 1000) / 10
        : 0;
    const activeQuantity = item.isIncluded ? Math.max(0, item.quantity) : 0;
    const totalCost = roundMoney(activeQuantity * item.unitCost);
    const grossRevenue = roundMoney(activeQuantity * item.sellingPrice);
    const netProfit = roundMoney(grossRevenue - totalCost);

    return {
      item,
      unitProfit,
      marginPercent,
      activeQuantity,
      totalCost,
      grossRevenue,
      netProfit,
    };
  });

  const activeUnitCount = breakdowns.reduce(
    (sum, b) => sum + b.activeQuantity,
    0
  );
  const totalProductionCost = roundMoney(
    breakdowns.reduce((sum, b) => sum + b.totalCost, 0)
  );
  const grossRevenue = roundMoney(
    breakdowns.reduce((sum, b) => sum + b.grossRevenue, 0)
  );
  const netProfit = roundMoney(grossRevenue - totalProductionCost);

  const overallMarginPercent =
    grossRevenue > 0 ? Math.round((netProfit / grossRevenue) * 1000) / 10 : 0;

  const returnOnCapitalPercent =
    totalProductionCost > 0
      ? Math.round((netProfit / totalProductionCost) * 1000) / 10
      : 0;

  const remainingCapital = roundMoney(
    config.startingCapital - totalProductionCost
  );
  const isWithinCapital = remainingCapital >= 0;

  // Approximate break-even units across weighted average selling price
  const avgSellingPrice =
    activeUnitCount > 0 ? grossRevenue / activeUnitCount : 0;
  const breakEvenUnitsApprox =
    avgSellingPrice > 0 ? Math.ceil(totalProductionCost / avgSellingPrice) : 0;

  // Virtual Envelope Allocations from Gross Revenue:
  // If grossRevenue covers totalProductionCost, 100% of production cost returns to Inventory Pouch
  const inventoryReplenishmentAmount = Math.min(
    Math.max(0, grossRevenue),
    totalProductionCost
  );
  const positiveProfit = Math.max(0, netProfit);
  const savingsAllocationAmount = roundMoney(
    (positiveProfit * config.profitSavingsPercent) / 100
  );
  const ownerProfitAllocationAmount = roundMoney(
    positiveProfit - savingsAllocationAmount
  );

  // Side-by-side comparison for Tentative items (specifically the 1 tentative Dessert)
  let withoutTentativeCost = 0;
  let withoutTentativeProfit = 0;
  let tentativeExtraCost = 0;
  let tentativeExtraProfit = 0;

  for (const item of menuItems) {
    const qty = Math.max(0, item.quantity);
    const itemCost = roundMoney(qty * item.unitCost);
    const itemProfit = roundMoney(qty * (item.sellingPrice - item.unitCost));

    if (item.isTentative) {
      tentativeExtraCost = roundMoney(tentativeExtraCost + itemCost);
      tentativeExtraProfit = roundMoney(tentativeExtraProfit + itemProfit);
    } else if (item.isIncluded) {
      withoutTentativeCost = roundMoney(withoutTentativeCost + itemCost);
      withoutTentativeProfit = roundMoney(withoutTentativeProfit + itemProfit);
    }
  }

  const withTentativeCost = roundMoney(
    withoutTentativeCost + tentativeExtraCost
  );
  const withTentativeProfit = roundMoney(
    withoutTentativeProfit + tentativeExtraProfit
  );

  return {
    items: breakdowns,
    activeUnitCount,
    totalProductionCost,
    grossRevenue,
    netProfit,
    overallMarginPercent,
    returnOnCapitalPercent,
    remainingCapital,
    isWithinCapital,
    breakEvenUnitsApprox,
    inventoryReplenishmentAmount,
    savingsAllocationAmount,
    ownerProfitAllocationAmount,
    withoutTentativeCost,
    withoutTentativeProfit,
    withTentativeCost,
    withTentativeProfit,
    tentativeExtraCost,
    tentativeExtraProfit,
  };
}

export function calculateCumulativePouches(batches: SalesBatchRecord[]) {
  let inventoryReplenished = 0;
  let businessSavings = 0;
  let ownerProfit = 0;
  let totalGrossSales = 0;
  let totalNetProfit = 0;
  let totalUnitsSold = 0;

  for (const b of batches) {
    inventoryReplenished += b.inventoryReplenishment;
    businessSavings += b.savingsAllocated;
    ownerProfit += b.ownerProfitAllocated;
    totalGrossSales += b.grossRevenue;
    totalNetProfit += b.netProfit;
    totalUnitsSold += b.totalUnits;
  }

  return {
    inventoryReplenished: roundMoney(inventoryReplenished),
    businessSavings: roundMoney(businessSavings),
    ownerProfit: roundMoney(ownerProfit),
    totalGrossSales: roundMoney(totalGrossSales),
    totalNetProfit: roundMoney(totalNetProfit),
    totalUnitsSold,
    batchCount: batches.length,
  };
}

export function formatCurrency(amount: number, symbol = '₱'): string {
  const absFormatted = Math.abs(amount).toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return amount < 0 ? `-${symbol}${absFormatted}` : `${symbol}${absFormatted}`;
}

export function formatShortDateTime(isoString: string): string {
  const d = new Date(isoString);
  if (Number.isNaN(d.getTime())) return isoString;
  return (
    d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }) +
    ' · ' +
    d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  );
}

export function batchesToCsv(batches: SalesBatchRecord[]): string {
  const header = [
    'Batch ID',
    'Date/Time',
    'Batch Label',
    'Items Sold',
    'Total Units',
    'Production Cost',
    'Gross Sales',
    'Net Profit',
    'Inventory Pouch',
    'Savings Pouch',
    'Owner Profit Pouch',
  ];
  const escapeCell = (val: string | number) => {
    const str = String(val);
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const rows = batches.map((b) =>
    [
      b.id,
      b.dateTime,
      b.label,
      b.itemsSummary,
      b.totalUnits,
      b.totalCost.toFixed(2),
      b.grossRevenue.toFixed(2),
      b.netProfit.toFixed(2),
      b.inventoryReplenishment.toFixed(2),
      b.savingsAllocated.toFixed(2),
      b.ownerProfitAllocated.toFixed(2),
    ]
      .map(escapeCell)
      .join(',')
  );

  return [header.join(','), ...rows].join('\n');
}
