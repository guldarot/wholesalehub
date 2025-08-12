import { supabase } from '../lib/supabase';

export const deliveryService = {
  async getDeliveries(userId, filters = {}) {
    try {
      let query = supabase?.from('deliveries')?.select(`
          *,
          orders (
            id,
            order_id,
            total_amount,
            customers (
              id,
              name,
              phone,
              city
            )
          )
        `)?.eq('user_id', userId);

      // Apply filters
      if (filters?.search) {
        query = query?.or(`tracking_id.ilike.%${filters?.search}%,driver_name.ilike.%${filters?.search}%,orders.customers.name.ilike.%${filters?.search}%`);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.city) {
        query = query?.eq('orders.customers.city', filters?.city);
      }

      if (filters?.dateFrom) {
        query = query?.gte('created_at', filters?.dateFrom);
      }

      if (filters?.dateTo) {
        query = query?.lte('created_at', `${filters?.dateTo}T23:59:59`);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(delivery => ({
        id: delivery?.id,
        trackingId: delivery?.tracking_id,
        orderId: delivery?.orders?.order_id || '',
        orderAmount: parseFloat(delivery?.orders?.total_amount || 0),
        customerName: delivery?.orders?.customers?.name || 'Unknown Customer',
        customerPhone: delivery?.orders?.customers?.phone || '',
        destination: delivery?.orders?.customers?.city || 'Unknown',
        deliveryAddress: delivery?.delivery_address,
        driverName: delivery?.driver_name,
        driverPhone: delivery?.driver_phone,
        vehicleNumber: delivery?.vehicle_number,
        status: delivery?.status,
        estimatedDeliveryTime: delivery?.estimated_delivery_time,
        actualDeliveryTime: delivery?.actual_delivery_time,
        deliveryNotes: delivery?.delivery_notes,
        createdAt: delivery?.created_at,
        updatedAt: delivery?.updated_at
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getDelivery(deliveryId, userId) {
    try {
      const { data, error } = await supabase?.from('deliveries')?.select(`
          *,
          orders (
            id,
            order_id,
            total_amount,
            delivery_address,
            customers (
              id,
              name,
              phone,
              email,
              address,
              city,
              business_name
            ),
            order_items (
              id,
              quantity,
              unit_price,
              total_price,
              products (
                id,
                name,
                sku
              )
            )
          )
        `)?.eq('id', deliveryId)?.eq('user_id', userId)?.single();

      if (error) throw error;

      return {
        id: data?.id,
        trackingId: data?.tracking_id,
        order: {
          id: data?.orders?.id,
          orderId: data?.orders?.order_id,
          totalAmount: parseFloat(data?.orders?.total_amount || 0),
          deliveryAddress: data?.orders?.delivery_address,
          customer: {
            id: data?.orders?.customers?.id,
            name: data?.orders?.customers?.name || 'Unknown Customer',
            phone: data?.orders?.customers?.phone || '',
            email: data?.orders?.customers?.email || '',
            address: data?.orders?.customers?.address || '',
            city: data?.orders?.customers?.city || '',
            businessName: data?.orders?.customers?.business_name || ''
          },
          items: data?.orders?.order_items?.map(item => ({
            id: item?.id,
            name: item?.products?.name || 'Unknown Product',
            sku: item?.products?.sku || '',
            quantity: item?.quantity,
            unitPrice: parseFloat(item?.unit_price || 0),
            totalPrice: parseFloat(item?.total_price || 0)
          })) || []
        },
        deliveryAddress: data?.delivery_address,
        driverName: data?.driver_name,
        driverPhone: data?.driver_phone,
        vehicleNumber: data?.vehicle_number,
        status: data?.status,
        estimatedDeliveryTime: data?.estimated_delivery_time,
        actualDeliveryTime: data?.actual_delivery_time,
        deliveryNotes: data?.delivery_notes,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      throw error;
    }
  },

  async createDelivery(deliveryData, userId) {
    try {
      // Generate tracking ID
      const trackingNum = Date.now()?.toString()?.slice(-6);
      const trackingId = `TRK-${new Date()?.getFullYear()}-${trackingNum}`;

      const { data, error } = await supabase?.from('deliveries')?.insert([{
          ...deliveryData,
          user_id: userId,
          tracking_id: trackingId,
          status: 'pending',
          created_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        }])?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateDelivery(deliveryId, deliveryData, userId) {
    try {
      const { data, error } = await supabase?.from('deliveries')?.update({
          ...deliveryData,
          updated_at: new Date()?.toISOString()
        })?.eq('id', deliveryId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateDeliveryStatus(deliveryId, status, userId, deliveryTime = null) {
    try {
      const updateData = {
        status,
        updated_at: new Date()?.toISOString()
      };

      if (status === 'delivered' && deliveryTime) {
        updateData.actual_delivery_time = deliveryTime;
      }

      const { data, error } = await supabase?.from('deliveries')?.update(updateData)?.eq('id', deliveryId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      // Update order status if delivery is completed
      if (status === 'delivered') {
        await supabase?.from('orders')?.update({ status: 'delivered' })?.eq('id', data?.order_id);
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteDelivery(deliveryId, userId) {
    try {
      const { error } = await supabase?.from('deliveries')?.delete()?.eq('id', deliveryId)?.eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw error;
    }
  },

  async getDeliveryStats(userId) {
    try {
      const { data, error } = await supabase?.from('deliveries')?.select('status, created_at, estimated_delivery_time, actual_delivery_time')?.eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalDeliveries: data?.length || 0,
        pendingDeliveries: 0,
        inTransitDeliveries: 0,
        deliveredDeliveries: 0,
        delayedDeliveries: 0,
        failedDeliveries: 0,
        onTimeDeliveryRate: 0
      };

      let onTimeDeliveries = 0;
      let completedDeliveries = 0;

      data?.forEach(delivery => {
        switch (delivery?.status) {
          case 'pending':
            stats.pendingDeliveries++;
            break;
          case 'in_transit':
            stats.inTransitDeliveries++;
            break;
          case 'delivered':
            stats.deliveredDeliveries++;
            completedDeliveries++;
            
            // Check if delivered on time
            if (delivery?.estimated_delivery_time && delivery?.actual_delivery_time) {
              const estimated = new Date(delivery.estimated_delivery_time);
              const actual = new Date(delivery.actual_delivery_time);
              if (actual <= estimated) {
                onTimeDeliveries++;
              }
            }
            break;
          case 'delayed':
            stats.delayedDeliveries++;
            break;
          case 'failed':
            stats.failedDeliveries++;
            break;
        }
      });

      stats.onTimeDeliveryRate = completedDeliveries > 0 
        ? Math.round((onTimeDeliveries / completedDeliveries) * 100) 
        : 0;

      return stats;
    } catch (error) {
      throw error;
    }
  },

  async getAvailableOrders(userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          id,
          order_id,
          total_amount,
          delivery_address,
          customers (
            name,
            city
          )
        `)?.eq('user_id', userId)?.in('status', ['processing', 'shipped'])?.is('id', 'not.in.(SELECT order_id FROM deliveries)'); // Orders without deliveries

      if (error) throw error;

      return data?.map(order => ({
        id: order?.id,
        orderId: order?.order_id,
        customerName: order?.customers?.name || 'Unknown Customer',
        destination: order?.customers?.city || 'Unknown',
        totalAmount: parseFloat(order?.total_amount || 0),
        deliveryAddress: order?.delivery_address
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async bulkUpdateDeliveryStatus(deliveryIds, status, userId) {
    try {
      const { data, error } = await supabase?.from('deliveries')?.update({
          status,
          updated_at: new Date()?.toISOString()
        })?.in('id', deliveryIds)?.eq('user_id', userId)?.select();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }
};