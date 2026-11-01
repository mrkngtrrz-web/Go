export enum MenuCategory {
  RiceTopper = 'Rice Topper',
  Drink = 'Drink',
  Dessert = 'Dessert',
}

export enum AppTab {
  Planner = 'planner',
  MenuSetup = 'menu',
  Batches = 'batches',
  Manual = 'manual',
}

export interface MenuItem {
  id: string;
  slotLabel: string; // e.g., "Rice Topper 1", "Rice Topper 2", "Signature Drink", "Dessert (Tentative)"
  name: string;
  category: MenuCategory;
  unitCost: number; // Ingredient + packaging cost per 1 serving
  sellingPrice: number; // Customer price per 1 serving
  quantity: number; // Planned or sold quantity
  isTentative: boolean;
  isIncluded: boolean; // Allows toggling tentative items (like Dessert) ON or OFF
}

export interface ItemProfitBreakdown {
  item: MenuItem;
  unitProfit: number;
  marginPercent: number;
  activeQuantity: number;
  totalCost: number;
  grossRevenue: number;
  netProfit: number;
}

export interface PlannerTotals {
  items: ItemProfitBreakdown[];
  activeUnitCount: number;
  totalProductionCost: number;
  grossRevenue: number;
  netProfit: number;
  overallMarginPercent: number;
  returnOnCapitalPercent: number;
  remainingCapital: number;
  isWithinCapital: boolean;
  breakEvenUnitsApprox: number;
  // Envelope allocations from this planned quantity run:
  inventoryReplenishmentAmount: number; // 100% of production cost recovered from revenue
  savingsAllocationAmount: number; // % of net profit saved
  ownerProfitAllocationAmount: number; // Remaining pure profit for team
  // Tentative Dessert comparison:
  withoutTentativeCost: number;
  withoutTentativeProfit: number;
  withTentativeCost: number;
  withTentativeProfit: number;
  tentativeExtraCost: number;
  tentativeExtraProfit: number;
}

export interface SalesBatchRecord {
  id: string;
  dateTime: string;
  label: string;
  itemsSummary: string;
  totalUnits: number;
  totalCost: number;
  grossRevenue: number;
  netProfit: number;
  inventoryReplenishment: number;
  savingsAllocated: number;
  ownerProfitAllocated: number;
}

export interface BusinessConfig {
  businessName: string;
  currencySymbol: '₱' | '$';
  startingCapital: number;
  profitSavingsPercent: number; // e.g. 30% of Net Profit -> Savings, 70% -> Owner's Profit
}
