export interface StockValueReport {
  totalProducts: number;
  totalValue: number;
  byCategory: {
    category: string;
    count: number;
    value: number;
  }[];
  data: {
    code: string;
    name: string;
    category: string;
    currentStock: number;
    unitPrice: number;
    totalValue: number;
  }[];
}

export interface LowStockReport {
  code: string;
  name: string;
  category: string;
  currentStock: number;
  minimalStock: number;
  shortage: number;
}

export interface MovementSummary {
  totalMovements: number;
  totalEntries: number;
  totalExits: number;
  totalQuantityIn: number;
  totalQuantityOut: number;
  byProduct: {
    productName: string;
    entries: number;
    exits: number;
  }[];
}
