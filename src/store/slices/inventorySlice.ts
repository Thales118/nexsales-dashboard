import { createSlice, createAsyncThunk, createEntityAdapter, createSelector, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../index';

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: string;
  price: number;
  quantity: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  lastUpdated: string;
  supplier: string;
  location: string;
}

interface InventoryState {
  ids: string[];
  entities: Record<string, Product>;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    category: string;
    status: string;
  };
  sorting: {
    field: keyof Product;
    direction: 'asc' | 'desc';
  };
}

const inventoryAdapter = createEntityAdapter<Product>();

const initialState: InventoryState = {
  ...inventoryAdapter.getInitialState(),
  isLoading: false,
  error: null,
  filters: {
    search: '',
    category: 'all',
    status: 'all',
  },
  sorting: {
    field: 'name',
    direction: 'asc',
  },
};

// Generate 5000 mock products
const generateMockProducts = (): Product[] => {
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Automotive', 'Books', 'Toys', 'Food & Beverage'];
  const suppliers = ['TechCorp', 'GlobalSupply', 'FastShip', 'QualityFirst', 'BulkMart', 'PremiumGoods'];
  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Distribution Center 1', 'Distribution Center 2'];
  const productNames = [
    'Widget Pro', 'Super Device', 'Premium Item', 'Basic Model', 'Deluxe Edition',
    'Standard Pack', 'Value Bundle', 'Elite Series', 'Compact Unit', 'Advanced System'
  ];

  return Array.from({ length: 5000 }, (_, i) => {
    const quantity = Math.floor(Math.random() * 500);
    const status: Product['status'] = quantity === 0 ? 'out_of_stock' : quantity < 50 ? 'low_stock' : 'in_stock';
    
    return {
      id: `prod-${i + 1}`,
      sku: `SKU-${String(i + 1).padStart(6, '0')}`,
      name: `${productNames[i % productNames.length]} ${Math.floor(i / 10) + 1}`,
      category: categories[i % categories.length],
      price: parseFloat((Math.random() * 999 + 1).toFixed(2)),
      quantity,
      status,
      lastUpdated: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      supplier: suppliers[i % suppliers.length],
      location: locations[i % locations.length],
    };
  });
};

export const fetchInventory = createAsyncThunk('inventory/fetch', async () => {
  await new Promise((resolve) => setTimeout(resolve, 2000));
  return generateMockProducts();
});

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setFilter: (state, action: PayloadAction<{ key: keyof InventoryState['filters']; value: string }>) => {
      state.filters[action.payload.key] = action.payload.value;
    },
    setSorting: (state, action: PayloadAction<{ field: keyof Product; direction: 'asc' | 'desc' }>) => {
      state.sorting = action.payload;
    },
    updateProduct: (state, action: PayloadAction<Product>) => {
      const { id, ...changes } = action.payload;
      if (state.entities[id]) {
        state.entities[id] = { ...state.entities[id], ...changes, lastUpdated: new Date().toISOString() };
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      inventoryAdapter.removeOne(state, action.payload);
    },
    addProduct: (state, action: PayloadAction<Product>) => {
      inventoryAdapter.addOne(state, action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.isLoading = false;
        inventoryAdapter.setAll(state, action.payload);
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch inventory';
      });
  },
});

export const { setFilter, setSorting, updateProduct, deleteProduct, addProduct } = inventorySlice.actions;

// Selectors
const selectInventoryState = (state: RootState) => state.inventory;
const { selectAll, selectById, selectTotal } = inventoryAdapter.getSelectors<RootState>(
  (state) => state.inventory
);

export const selectAllProducts = selectAll;
export const selectProductById = selectById;
export const selectTotalProducts = selectTotal;

export const selectFilters = (state: RootState) => state.inventory.filters;
export const selectSorting = (state: RootState) => state.inventory.sorting;
export const selectIsLoading = (state: RootState) => state.inventory.isLoading;

// Memoized selector for filtered and sorted products
export const selectFilteredProducts = createSelector(
  [selectAll, selectFilters, selectSorting],
  (products, filters, sorting) => {
    let filtered = products;

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.supplier.toLowerCase().includes(searchLower)
      );
    }

    // Apply category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter((p) => p.category === filters.category);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter((p) => p.status === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const aVal = a[sorting.field];
      const bVal = b[sorting.field];
      const modifier = sorting.direction === 'asc' ? 1 : -1;

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return aVal.localeCompare(bVal) * modifier;
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return (aVal - bVal) * modifier;
      }
      return 0;
    });

    return filtered;
  }
);

// Memoized selector for inventory statistics
export const selectInventoryStats = createSelector([selectAll], (products) => {
  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const totalItems = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter((p) => p.status === 'low_stock').length;
  const outOfStock = products.filter((p) => p.status === 'out_of_stock').length;

  return {
    totalProducts: products.length,
    totalValue,
    totalItems,
    lowStock,
    outOfStock,
  };
});

export default inventorySlice.reducer;
