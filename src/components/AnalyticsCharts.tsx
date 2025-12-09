import React, { useEffect } from 'react';
import { useAppSelector } from '@/store/hooks';
import { selectInventoryStats, selectAllProducts } from '@/store/slices/inventorySlice';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface AnalyticsChartsProps {
  shouldCrash?: boolean;
}

const AnalyticsCharts: React.FC<AnalyticsChartsProps> = ({ shouldCrash }) => {
  const stats = useAppSelector(selectInventoryStats);
  const products = useAppSelector(selectAllProducts);

  // Simulate crash for Error Boundary demo
  useEffect(() => {
    if (shouldCrash) {
      throw new Error('Simulated crash in Analytics Widget');
    }
  }, [shouldCrash]);

  // Generate chart data
  const categoryData = React.useMemo(() => {
    const categoryMap = new Map<string, { count: number; value: number }>();
    products.forEach((p) => {
      const existing = categoryMap.get(p.category) || { count: 0, value: 0 };
      categoryMap.set(p.category, {
        count: existing.count + 1,
        value: existing.value + p.price * p.quantity,
      });
    });
    return Array.from(categoryMap.entries()).map(([name, data]) => ({
      name,
      products: data.count,
      value: Math.round(data.value / 1000),
    }));
  }, [products]);

  const statusData = React.useMemo(() => [
    { name: 'In Stock', value: stats.totalProducts - stats.lowStock - stats.outOfStock, color: 'hsl(142, 71%, 45%)' },
    { name: 'Low Stock', value: stats.lowStock, color: 'hsl(38, 92%, 50%)' },
    { name: 'Out of Stock', value: stats.outOfStock, color: 'hsl(0, 84%, 60%)' },
  ], [stats]);

  const trendData = React.useMemo(() => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    return months.map((month, i) => ({
      month,
      revenue: Math.round(80000 + Math.random() * 40000),
      orders: Math.round(400 + Math.random() * 200),
    }));
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Revenue Trend */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(199, 89%, 48%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
            <XAxis dataKey="month" stroke="hsl(215, 20%, 55%)" />
            <YAxis stroke="hsl(215, 20%, 55%)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(217, 33%, 17%)',
                borderRadius: '8px',
              }}
            />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(199, 89%, 48%)"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Stock Status */}
      <div className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-lg font-semibold mb-4">Stock Status Distribution</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(217, 33%, 17%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance */}
      <div className="bg-card rounded-xl border border-border p-6 lg:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Category Performance</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={categoryData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 17%)" />
            <XAxis type="number" stroke="hsl(215, 20%, 55%)" />
            <YAxis dataKey="name" type="category" stroke="hsl(215, 20%, 55%)" width={120} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222, 47%, 10%)',
                border: '1px solid hsl(217, 33%, 17%)',
                borderRadius: '8px',
              }}
            />
            <Legend />
            <Bar dataKey="products" name="Products" fill="hsl(199, 89%, 48%)" radius={[0, 4, 4, 0]} />
            <Bar dataKey="value" name="Value ($K)" fill="hsl(142, 71%, 45%)" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsCharts;
