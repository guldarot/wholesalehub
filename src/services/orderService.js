import { supabase } from '../lib/supabase';

export const orderService = {
  async getOrders(userId, filters = {}) {
    try {
      let query = supabase?.from('orders')?.select(`
          *,
          customers (
            id,
            name,
            email,
            phone
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
        `)?.eq('user_id', userId);

      // Apply filters
      if (filters?.search) {
        query = query?.or(`order_id.ilike.%${filters?.search}%,customers.name.ilike.%${filters?.search}%,customers.email.ilike.%${filters?.search}%`);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.customer) {
        query = query?.ilike('customers.name', `%${filters?.customer}%`);
      }

      if (filters?.dateFrom) {
        query = query?.gte('order_date', filters?.dateFrom);
      }

      if (filters?.dateTo) {
        query = query?.lte('order_date', `${filters?.dateTo}T23:59:59`);
      }

      if (filters?.amountMin) {
        query = query?.gte('total_amount', parseFloat(filters?.amountMin));
      }

      if (filters?.amountMax) {
        query = query?.lte('total_amount', parseFloat(filters?.amountMax));
      }

      const { data, error } = await query?.order('order_date', { ascending: false });

      if (error) throw error;

      return data?.map(order => ({
        id: order?.id,
        orderId: order?.order_id,
        customerName: order?.customers?.name || 'Unknown Customer',
        customerEmail: order?.customers?.email || '',
        customerPhone: order?.customers?.phone || '',
        orderDate: order?.order_date,
        deliveryDate: order?.delivery_date,
        totalAmount: parseFloat(order?.total_amount || 0),
        subtotal: parseFloat(order?.subtotal || 0),
        tax: parseFloat(order?.tax_amount || 0),
        deliveryCharges: parseFloat(order?.delivery_charges || 0),
        status: order?.status,
        paymentStatus: order?.payment_status,
        deliveryAddress: order?.delivery_address,
        notes: order?.notes,
        items: order?.order_items?.map(item => ({
          name: item?.products?.name || 'Unknown Product',
          sku: item?.products?.sku || '',
          quantity: item?.quantity,
          price: parseFloat(item?.unit_price || 0),
          total: parseFloat(item?.total_price || 0)
        })) || []
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getOrder(orderId, userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          *,
          customers (
            id,
            name,
            email,
            phone,
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
              sku,
              description
            )
          ),
          deliveries (
            id,
            tracking_id,
            status,
            driver_name,
            driver_phone,
            estimated_delivery_time,
            actual_delivery_time
          )
        `)?.eq('id', orderId)?.eq('user_id', userId)?.single();

      if (error) throw error;

      // Add null checks for all data properties
      const orderData = {
        id: data?.id,
        orderId: data?.order_id,
        customer: {
          id: data?.customers?.id,
          name: data?.customers?.name || 'Unknown Customer',
          email: data?.customers?.email || '',
          phone: data?.customers?.phone || '',
          address: data?.customers?.address || '',
          city: data?.customers?.city || '',
          businessName: data?.customers?.business_name || ''
        },
        orderDate: data?.order_date,
        deliveryDate: data?.delivery_date,
        subtotal: parseFloat(data?.subtotal || 0),
        taxAmount: parseFloat(data?.tax_amount || 0),
        deliveryCharges: parseFloat(data?.delivery_charges || 0),
        totalAmount: parseFloat(data?.total_amount || 0),
        status: data?.status,
        paymentStatus: data?.payment_status,
        deliveryAddress: data?.delivery_address,
        notes: data?.notes,
        items: data?.order_items?.map(item => ({
          id: item?.id,
          productId: item?.products?.id,
          name: item?.products?.name || 'Unknown Product',
          sku: item?.products?.sku || '',
          description: item?.products?.description || '',
          quantity: item?.quantity,
          unitPrice: parseFloat(item?.unit_price || 0),
          totalPrice: parseFloat(item?.total_price || 0)
        })) || [],
        delivery: data?.deliveries?.[0] ? {
          id: data?.deliveries?.[0]?.id,
          trackingId: data?.deliveries?.[0]?.tracking_id,
          status: data?.deliveries?.[0]?.status,
          driverName: data?.deliveries?.[0]?.driver_name,
          driverPhone: data?.deliveries?.[0]?.driver_phone,
          estimatedDeliveryTime: data?.deliveries?.[0]?.estimated_delivery_time,
          actualDeliveryTime: data?.deliveries?.[0]?.actual_delivery_time
        } : null
      };
      
      return orderData;
    } catch (error) {
      throw error;
    }
  },

  async createOrder(orderData, userId) {
    try {
      // Generate order ID
      const orderIdNum = Date.now()?.toString()?.slice(-6);
      const orderId = `WH-${new Date()?.getFullYear()}-${orderIdNum}`;

      // Calculate totals
      const subtotal = orderData?.items?.reduce((sum, item) => 
        sum + (item?.quantity * item?.unitPrice), 0
      ) || 0;
      const taxAmount = subtotal * 0.1; // 10% tax
      const totalAmount = subtotal + taxAmount + (orderData?.deliveryCharges || 0);

      // Create order
      const { data: order, error: orderError } = await supabase?.from('orders')?.insert([{
          user_id: userId,
          order_id: orderId,
          customer_id: orderData?.customerId,
          delivery_date: orderData?.deliveryDate,
          subtotal,
          tax_amount: taxAmount,
          delivery_charges: orderData?.deliveryCharges || 0,
          total_amount: totalAmount,
          status: 'pending',
          payment_status: orderData?.paymentStatus || 'pending',
          delivery_address: orderData?.deliveryAddress,
          notes: orderData?.notes
        }])?.select()?.single();

      if (orderError) throw orderError;

      // Create order items
      if (orderData?.items?.length > 0) {
        const orderItems = orderData?.items?.map(item => ({
          order_id: order?.id,
          product_id: item?.productId,
          quantity: item?.quantity,
          unit_price: item?.unitPrice,
          total_price: item?.quantity * item?.unitPrice
        }));

        const { error: itemsError } = await supabase?.from('order_items')?.insert(orderItems);

        if (itemsError) throw itemsError;

        // Update product stock
        for (const item of orderData?.items) {
          await supabase?.rpc('update_product_stock', {
            product_id: item?.productId,
            quantity_change: -item?.quantity
          });
        }
      }

      return order;
    } catch (error) {
      throw error;
    }
  },

  async updateOrder(orderId, updates, userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.eq('id', orderId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateOrderStatus(orderId, status, userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.update({
          status,
          updated_at: new Date()?.toISOString()
        })?.eq('id', orderId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteOrder(orderId, userId) {
    try {
      // First delete order items
      const { error: itemsError } = await supabase?.from('order_items')?.delete()?.eq('order_id', orderId);

      if (itemsError) throw itemsError;

      // Then delete the order
      const { error } = await supabase?.from('orders')?.delete()?.eq('id', orderId)?.eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw error;
    }
  },

  async getCustomers(userId) {
    try {
      const { data, error } = await supabase?.from('customers')?.select('*')?.eq('user_id', userId)?.eq('is_active', true)?.order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getProducts(userId) {
    try {
      const { data, error } = await supabase?.from('products')?.select('id, name, sku, unit_price, current_stock')?.eq('user_id', userId)?.eq('status', 'active')?.gt('current_stock', 0)?.order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async bulkUpdateOrderStatus(orderIds, status, userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.update({
          status,
          updated_at: new Date()?.toISOString()
        })?.in('id', orderIds)?.eq('user_id', userId)?.select();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  }
};