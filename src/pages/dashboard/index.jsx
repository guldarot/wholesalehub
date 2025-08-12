import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { dashboardService } from '../../services/dashboardService';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import MetricCard from './components/MetricCard';
import RecentOrdersTable from './components/RecentOrdersTable';
import InventoryAlertsPanel from './components/InventoryAlertsPanel';
import DeliveryStatusOverview from './components/DeliveryStatusOverview';
import SalesChart from './components/SalesChart';
import TopProductsChart from './components/TopProductsChart';
import QuickActions from './components/QuickActions';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, userProfile, loading: authLoading } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Dashboard data state
  const [metrics, setMetrics] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [inventoryAlerts, setInventoryAlerts] = useState([]);
  const [deliveries, setDeliveries] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Load dashboard data
  useEffect(() => {
    if (!user?.id || authLoading) return;

    const loadDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Load all dashboard data
        const [
          metricsData,
          ordersData,
          alertsData,
          deliveriesData,
          chartData,
          productsData
        ] = await Promise.all([
          dashboardService?.getDashboardMetrics(user?.id),
          dashboardService?.getRecentOrders(user?.id, 5),
          dashboardService?.getInventoryAlerts(user?.id, 4),
          dashboardService?.getDeliveryOverview(user?.id),
          dashboardService?.getSalesChartData(user?.id, 7),
          dashboardService?.getTopProductsData(user?.id, 5)
        ]);

        // Format metrics for display
        const formattedMetrics = [
          {
            title: 'Total Revenue',
            value: `Rs. ${metricsData?.totalRevenue?.toLocaleString('en-PK') || '0'}`,
            change: `+${metricsData?.todayOrdersCount || 0} new today`,
            changeType: 'positive',
            icon: 'DollarSign',
            color: 'success'
          },
          {
            title: 'Active Orders',
            value: metricsData?.activeOrdersCount?.toString() || '0',
            change: `+${metricsData?.todayOrdersCount || 0} new today`,
            changeType: 'positive',
            icon: 'ShoppingCart',
            color: 'primary'
          },
          {
            title: 'Low Stock Alerts',
            value: metricsData?.lowStockCount?.toString() || '0',
            change: `${metricsData?.criticalStockCount || 0} critical items`,
            changeType: metricsData?.criticalStockCount > 0 ? 'negative' : 'neutral',
            icon: 'AlertTriangle',
            color: 'warning'
          },
          {
            title: 'Pending Deliveries',
            value: metricsData?.pendingDeliveriesCount?.toString() || '0',
            change: 'Tracked in real-time',
            changeType: 'neutral',
            icon: 'Truck',
            color: 'primary'
          }
        ];

        setMetrics(formattedMetrics);
        setRecentOrders(ordersData);
        setInventoryAlerts(alertsData);
        setDeliveries(deliveriesData);
        setSalesData(chartData);
        setTopProductsData(productsData);

      } catch (err) {
        console.error('Dashboard data loading failed:', err);
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [user?.id, authLoading]);

  const handleViewAllOrders = () => {
    navigate('/order-management');
  };

  const handleViewAllAlerts = () => {
    navigate('/inventory-management');
  };

  const formatTime = (date) => {
    return date?.toLocaleTimeString('en-PK', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const formatDate = (date) => {
    return date?.toLocaleDateString('en-PK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <QuickActionButton />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-4"></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4]?.map((i) => (
                  <div key={i} className="h-32 bg-muted rounded-lg"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <QuickActionButton />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Breadcrumb />
            <div className="text-center py-12">
              <div className="text-red-500 mb-4">
                <h3 className="text-lg font-semibold">Error Loading Dashboard</h3>
                <p className="text-sm mt-2">{error}</p>
              </div>
              <button
                onClick={() => window.location?.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Reload Dashboard
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Show auth required message
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <QuickActionButton />
        <main className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">Please sign in to view the dashboard</h3>
              <button
                onClick={() => navigate('/login')}
                className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
              >
                Sign In
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <QuickActionButton />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          {/* Welcome Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Welcome back, {userProfile?.full_name || user?.email?.split('@')?.[0] || 'User'}
                </h1>
                <p className="text-muted-foreground mt-2">
                  {formatDate(currentTime)} • {formatTime(currentTime)}
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <p className="text-sm text-muted-foreground">
                  Last updated: {formatTime(currentTime)}
                </p>
              </div>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics?.map((metric, index) => (
              <MetricCard
                key={index}
                title={metric?.title}
                value={metric?.value}
                change={metric?.change}
                changeType={metric?.changeType}
                icon={metric?.icon}
                color={metric?.color}
              />
            ))}
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <QuickActions />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
            {/* Recent Orders Table - 8 columns on desktop */}
            <div className="lg:col-span-8">
              <RecentOrdersTable 
                orders={recentOrders} 
                onViewAll={handleViewAllOrders}
              />
            </div>

            {/* Inventory Alerts Panel - 4 columns on desktop */}
            <div className="lg:col-span-4">
              <InventoryAlertsPanel 
                alerts={inventoryAlerts}
                onViewAll={handleViewAllAlerts}
              />
            </div>
          </div>

          {/* Charts and Delivery Status */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Chart */}
            <div className="lg:col-span-2">
              <SalesChart data={salesData} title="Monthly Sales Trends" />
            </div>

            {/* Delivery Status */}
            <div className="lg:col-span-1">
              <DeliveryStatusOverview deliveries={deliveries} />
            </div>
          </div>

          {/* Top Products Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopProductsChart data={topProductsData} />
            
            {/* Business Insights */}
            <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Business Insights</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Average Order Value</p>
                    <p className="text-xs text-muted-foreground">This month</p>
                  </div>
                  <p className="text-lg font-bold text-foreground">
                    Rs. {recentOrders?.length > 0 
                      ? Math.round(recentOrders?.reduce((sum, order) => sum + order?.amount, 0) / recentOrders?.length)?.toLocaleString('en-PK')
                      : '0'
                    }
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Active Products</p>
                    <p className="text-xs text-muted-foreground">In inventory</p>
                  </div>
                  <p className="text-lg font-bold text-success">
                    {topProductsData?.length || 0}
                  </p>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">Delivery Success Rate</p>
                    <p className="text-xs text-muted-foreground">This week</p>
                  </div>
                  <p className="text-lg font-bold text-success">
                    {deliveries?.filter(d => d?.status === 'delivered')?.length > 0
                      ? Math.round((deliveries?.filter(d => d?.status === 'delivered')?.length / deliveries?.length) * 100)
                      : 0
                    }%
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;