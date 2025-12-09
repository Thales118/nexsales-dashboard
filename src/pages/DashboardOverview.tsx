import React from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectInventoryStats } from '@/store/slices/inventorySlice';
import { BarChart3, Package, TrendingUp, AlertTriangle, DollarSign, Clock } from 'lucide-react';

const DashboardOverview: React.FC = () => {
  const stats = useAppSelector(selectInventoryStats);

  const recentActivity = [
    { id: 1, action: 'Product Updated', item: 'Widget Pro 245', time: '2 minutes ago', type: 'update' },
    { id: 2, action: 'Low Stock Alert', item: 'Super Device 89', time: '15 minutes ago', type: 'warning' },
    { id: 3, action: 'New Product Added', item: 'Premium Item 512', time: '1 hour ago', type: 'success' },
    { id: 4, action: 'Stock Replenished', item: 'Basic Model 33', time: '2 hours ago', type: 'success' },
    { id: 5, action: 'Product Deleted', item: 'Deluxe Edition 67', time: '3 hours ago', type: 'delete' },
  ];

  const topCategories = [
    { name: 'Electronics', products: 625, value: 845200 },
    { name: 'Clothing', products: 625, value: 312400 },
    { name: 'Home & Garden', products: 625, value: 567800 },
    { name: 'Sports', products: 625, value: 423100 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center gap-4 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    activity.type === 'success'
                      ? 'bg-success'
                      : activity.type === 'warning'
                      ? 'bg-warning'
                      : activity.type === 'delete'
                      ? 'bg-destructive'
                      : 'bg-info'
                  }`}
                />
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.item}</p>
                </div>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Categories */}
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" />
              Top Categories
            </h2>
          </div>
          <div className="space-y-4">
            {topCategories.map((category, index) => (
              <div key={category.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{category.name}</span>
                  <span className="text-muted-foreground">{category.products} items</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${(category.value / 1000000) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  ${(category.value / 1000).toFixed(0)}K value
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-success/20">
              <Package className="w-6 h-6 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">In Stock</p>
              <p className="text-2xl font-bold">
                {(stats.totalProducts - stats.lowStock - stats.outOfStock).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-warning/20">
              <AlertTriangle className="w-6 h-6 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold">{stats.lowStock.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border p-6">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-destructive/20">
              <Package className="w-6 h-6 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Out of Stock</p>
              <p className="text-2xl font-bold">{stats.outOfStock.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
