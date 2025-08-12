import { supabase } from '../lib/supabase';

export const dashboardService = {
  async getDashboardMetrics(userId) {
    try {
      // Get total revenue from completed orders
      const { data: revenueData, error: revenueError } = await supabase?.from('orders')?.select('total_amount')?.eq('user_id', userId)?.eq('payment_status', 'paid');
      
      if (revenueError) throw revenueError;

      // Get active orders count
      const { data: activeOrdersData, error: activeOrdersError } = await supabase?.from('orders')?.select('id')?.eq('user_id', userId)?.in('status', ['pending', 'processing', 'shipped']);
      
      if (activeOrdersError) throw activeOrdersError;

      // Get low stock products
      const { data: lowStockData, error: lowStockError } = await supabase?.from('products')?.select('id, name, current_stock, reorder_level')?.eq('user_id', userId)?.eq('status', 'active');
      
      if (lowStockError) throw lowStockError;

      // Get pending deliveries
      const { data: deliveriesData, error: deliveriesError } = await supabase?.from('deliveries')?.select('id, status')?.eq('user_id', userId)?.in('status', ['pending', 'in_transit']);
      
      if (deliveriesError) throw deliveriesError;

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order?.total_amount || 0), 0) || 0;
      const lowStockItems = lowStockData?.filter(product =>
        (product?.current_stock || 0) <= (product?.reorder_level || 0)
      ) || [];
      const criticalStockItems = lowStockItems?.filter(product =>
        (product?.current_stock || 0) === 0
      ) || [];

      return {
        totalRevenue,
        activeOrdersCount: activeOrdersData?.length || 0,
        lowStockCount: lowStockItems?.length || 0,
        criticalStockCount: criticalStockItems?.length || 0,
        pendingDeliveriesCount: deliveriesData?.length || 0,
        todayOrdersCount: activeOrdersData?.filter(order => {
          const today = new Date()?.toDateString();
          return new Date(order?.created_at)?.toDateString() === today;
        })?.length || 0
      };
    } catch (error) {
      throw error;
    }
  },

  async getRecentOrders(userId, limit = 5) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          id,
          order_id,
          total_amount,
          status,
          order_date,
          customers (
            id,
            name
          )
        `)?.eq('user_id', userId)?.order('order_date', { ascending: false })?.limit(limit);
      
      if (error) throw error;
      
      return data?.map(order => ({
        id: order?.id,
        orderId: order?.order_id,
        customerName: order?.customers?.name || 'Unknown Customer',
        amount: parseFloat(order?.total_amount || 0),
        status: order?.status,
        date: new Date(order?.order_date)?.toLocaleDateString('en-PK')
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getInventoryAlerts(userId, limit = 5) {
    try {
      const { data, error } = await supabase?.from('products')?.select('id, name, sku, current_stock, reorder_level')?.eq('user_id', userId)?.eq('status', 'active');
      
      if (error) throw error;
      
      const alerts = data?.map(product => {
        const currentStock = product?.current_stock || 0;
        const reorderLevel = product?.reorder_level || 0;
        
        let type = 'reorder';
        let message = 'Scheduled reorder due this week';
        let suggestedAction = 'Schedule';
        
        if (currentStock === 0) {
          type = 'out_of_stock';
          message = 'Out of stock, immediate reorder required';
          suggestedAction = 'Order Now';
        } else if (currentStock <= reorderLevel) {
          type = 'low_stock';
          message = `Stock running low, only ${currentStock} units remaining`;
          suggestedAction = 'Reorder';
        }
        
        return {
          id: product?.id,
          product: product?.name,
          sku: product?.sku,
          type,
          message,
          currentStock,
          suggestedAction
        };
      })?.filter(alert => alert?.type !== 'reorder')?.slice(0, limit) || [];
      
      return alerts;
    } catch (error) {
      throw error;
    }
  },

  async getDeliveryOverview(userId) {
    try {
      const { data, error } = await supabase?.from('deliveries')?.select(`
          id,
          tracking_id,
          status,
          estimated_delivery_time,
          orders (
            id,
            customers (
              city
            )
          )
        `)?.eq('user_id', userId)?.order('created_at', { ascending: false })?.limit(5);
      
      if (error) throw error;
      
      return data?.map(delivery => ({
        id: delivery?.id,
        trackingId: delivery?.tracking_id,
        status: delivery?.status,
        destination: delivery?.orders?.customers?.city || 'Unknown',
        estimatedTime: delivery?.estimated_delivery_time
          ? new Date(delivery?.estimated_delivery_time)?.toLocaleString('en-PK')
          : 'Not set'
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getSalesChartData(userId, months = 6) {
    try {
      const endDate = new Date();
      const startDate = new Date();
      startDate?.setMonth(endDate?.getMonth() - months);
      
      const { data, error } = await supabase?.from('orders')?.select('total_amount, order_date')?.eq('user_id', userId)?.eq('payment_status', 'paid')?.gte('order_date', startDate?.toISOString())?.lte('order_date', endDate?.toISOString());
      
      if (error) throw error;
      
      // Group by month
      const monthlyData = {};
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      
      data?.forEach(order => {
        const date = new Date(order?.order_date);
        const monthKey = `${monthNames?.[date?.getMonth()]} ${date?.getFullYear()}`;
        
        if (!monthlyData?.[monthKey]) {
          monthlyData[monthKey] = 0;
        }
        monthlyData[monthKey] += parseFloat(order?.total_amount || 0);
      });
      
      return Object.entries(monthlyData)?.map(([month, sales]) => ({
        month: month?.split(' ')?.[0], // Just month name
        sales: Math.round(sales)
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getTopProductsData(userId, limit = 5) {
    try {
      const { data, error } = await supabase?.from('order_items')?.select(`
          quantity,
          products (
            id,
            name,
            product_categories (
              name
            )
          ),
          orders!inner (
            user_id
          )
        `)?.eq('orders.user_id', userId);
      
      if (error) throw error;
      
      // Group by product and sum quantities
      const productSales = {};
      
      data?.forEach(item => {
        const productName = item?.products?.name || 'Unknown Product';
        if (!productSales?.[productName]) {
          productSales[productName] = 0;
        }
        productSales[productName] += item?.quantity || 0;
      });
      
      // Sort by quantity and take top products
      return Object.entries(productSales)
        ?.sort(([,a], [,b]) => b - a)
        ?.slice(0, limit)
        ?.map(([name, value]) => ({ name, value })) || [];
    } catch (error) {
      throw error;
    }
  }
};