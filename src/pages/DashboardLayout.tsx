import React, { useEffect, useMemo, useCallback, useState, lazy, Suspense } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchInventory, selectInventoryStats } from '@/store/slices/inventorySlice';
import Sidebar from '@/components/Sidebar';
import NotificationToast from '@/components/NotificationToast';
import MetricCard from '@/components/MetricCard';
import { Package, DollarSign, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';

const DashboardLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const isLoading = useAppSelector((state) => state.inventory.isLoading);
  const stats = useAppSelector(selectInventoryStats);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  const showOverview = location.pathname === '/dashboard';

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <NotificationToast />
      
      <main className="ml-64 p-8">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold">
            {location.pathname === '/dashboard' && 'Dashboard Overview'}
            {location.pathname === '/dashboard/inventory' && 'Inventory Management'}
            {location.pathname === '/dashboard/analytics' && 'Analytics'}
          </h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here's what's happening with your inventory.
          </p>
        </header>

        {/* Stats Cards - Show only on overview */}
        {showOverview && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Products"
              value={isLoading ? '...' : stats.totalProducts.toLocaleString()}
              icon={<Package className="w-6 h-6" />}
              trend={{ value: 12, label: 'vs last month' }}
            />
            <MetricCard
              title="Total Inventory Value"
              value={isLoading ? '...' : `$${(stats.totalValue / 1000000).toFixed(2)}M`}
              icon={<DollarSign className="w-6 h-6" />}
              trend={{ value: 8.2, label: 'vs last month' }}
            />
            <MetricCard
              title="Low Stock Items"
              value={isLoading ? '...' : stats.lowStock.toLocaleString()}
              icon={<AlertTriangle className="w-6 h-6" />}
              trend={{ value: -5, label: 'vs last week' }}
            />
            <MetricCard
              title="Total Units"
              value={isLoading ? '...' : (stats.totalItems / 1000).toFixed(1) + 'K'}
              icon={<TrendingUp className="w-6 h-6" />}
              trend={{ value: 3.4, label: 'vs last month' }}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && showOverview && (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">Loading inventory data...</p>
              <p className="text-sm text-muted-foreground/70 mt-1">Fetching 5,000+ products</p>
            </div>
          </div>
        )}

        {/* Content */}
        {!isLoading && <Outlet />}
      </main>
    </div>
  );
};

export default DashboardLayout;
