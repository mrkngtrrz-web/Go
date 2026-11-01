import {
  BusinessConfig,
  MenuCategory,
  MenuItem,
  SalesBatchRecord,
} from '../types/flowfund';

export const DEFAULT_BUSINESS_CONFIG: BusinessConfig = {
  businessName: 'Campus Rice Bowl & Drink Stall',
  currencySymbol: '₱',
  startingCapital: 3000,
  profitSavingsPercent: 30,
};

export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: 'ITEM-RT1',
    slotLabel: 'Rice Topper 1',
    name: 'Garlic Pepper Beef Rice Topper',
    category: MenuCategory.RiceTopper,
    unitCost: 42,
    sellingPrice: 75,
    quantity: 25,
    isTentative: false,
    isIncluded: true,
  },
  {
    id: 'ITEM-RT2',
    slotLabel: 'Rice Topper 2',
    name: 'Crispy Chicken Ala King Rice Topper',
    category: MenuCategory.RiceTopper,
    unitCost: 38,
    sellingPrice: 70,
    quantity: 25,
    isTentative: false,
    isIncluded: true,
  },
  {
    id: 'ITEM-DR1',
    slotLabel: 'Drink 1',
    name: 'House Citrus Iced Tea (16oz)',
    category: MenuCategory.Drink,
    unitCost: 12,
    sellingPrice: 30,
    quantity: 40,
    isTentative: false,
    isIncluded: true,
  },
  {
    id: 'ITEM-DS1',
    slotLabel: 'Dessert 1 (Not Final)',
    name: 'Creamy Mango Graham Cup',
    category: MenuCategory.Dessert,
    unitCost: 22,
    sellingPrice: 45,
    quantity: 20,
    isTentative: true,
    isIncluded: true,
  },
];

export const INITIAL_SALES_BATCHES: SalesBatchRecord[] = [
  {
    id: 'BATCH-101',
    dateTime: '2026-10-30T16:30:00',
    label: 'Dry Run Booth Day (Without Dessert)',
    itemsSummary:
      '20× Garlic Pepper Beef, 20× Crispy Chicken Ala King, 35× Citrus Iced Tea',
    totalUnits: 75,
    totalCost: 2020,
    grossRevenue: 3950,
    netProfit: 1930,
    inventoryReplenishment: 2020,
    savingsAllocated: 579,
    ownerProfitAllocated: 1351,
  },
  {
    id: 'BATCH-102',
    dateTime: '2026-11-01T15:15:00',
    label: 'Campus Fair Day 1 (Full Menu Trial)',
    itemsSummary:
      '25× Garlic Pepper Beef, 25× Crispy Chicken Ala King, 40× Citrus Iced Tea, 15× Mango Graham Cup',
    totalUnits: 105,
    totalCost: 2810,
    grossRevenue: 5425,
    netProfit: 2615,
    inventoryReplenishment: 2810,
    savingsAllocated: 784.5,
    ownerProfitAllocated: 1830.5,
  },
];
