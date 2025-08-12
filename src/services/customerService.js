import { supabase } from '../lib/supabase';

export const customerService = {
  async getCustomers(userId, filters = {}) {
    try {
      let query = supabase?.from('customers')?.select('*')?.eq('user_id', userId);

      // Apply filters
      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,email.ilike.%${filters?.search}%,business_name.ilike.%${filters?.search}%`);
      }

      if (filters?.city) {
        query = query?.eq('city', filters?.city);
      }

      if (filters?.status !== undefined) {
        query = query?.eq('is_active', filters?.status);
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(customer => ({
        id: customer?.id,
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        address: customer?.address,
        city: customer?.city,
        businessName: customer?.business_name,
        taxId: customer?.tax_id,
        creditLimit: parseFloat(customer?.credit_limit || 0),
        currentBalance: parseFloat(customer?.current_balance || 0),
        isActive: customer?.is_active,
        createdAt: customer?.created_at,
        updatedAt: customer?.updated_at
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getCustomer(customerId, userId) {
    try {
      const { data, error } = await supabase?.from('customers')?.select('*')?.eq('id', customerId)?.eq('user_id', userId)?.single();

      if (error) throw error;

      return {
        id: data?.id,
        name: data?.name,
        email: data?.email,
        phone: data?.phone,
        address: data?.address,
        city: data?.city,
        businessName: data?.business_name,
        taxId: data?.tax_id,
        creditLimit: parseFloat(data?.credit_limit || 0),
        currentBalance: parseFloat(data?.current_balance || 0),
        isActive: data?.is_active,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      throw error;
    }
  },

  async createCustomer(customerData, userId) {
    try {
      const { data, error } = await supabase?.from('customers')?.insert([{
          ...customerData,
          user_id: userId,
          created_at: new Date()?.toISOString(),
          updated_at: new Date()?.toISOString()
        }])?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async updateCustomer(customerId, customerData, userId) {
    try {
      const { data, error } = await supabase?.from('customers')?.update({
          ...customerData,
          updated_at: new Date()?.toISOString()
        })?.eq('id', customerId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteCustomer(customerId, userId) {
    try {
      const { error } = await supabase?.from('customers')?.delete()?.eq('id', customerId)?.eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw error;
    }
  },

  async getCustomerOrders(customerId, userId) {
    try {
      const { data, error } = await supabase?.from('orders')?.select(`
          id,
          order_id,
          order_date,
          total_amount,
          status,
          payment_status
        `)?.eq('customer_id', customerId)?.eq('user_id', userId)?.order('order_date', { ascending: false });

      if (error) throw error;

      return data?.map(order => ({
        id: order?.id,
        orderId: order?.order_id,
        orderDate: order?.order_date,
        totalAmount: parseFloat(order?.total_amount || 0),
        status: order?.status,
        paymentStatus: order?.payment_status
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getCustomerStats(userId) {
    try {
      const { data: customers, error } = await supabase?.from('customers')?.select('is_active, credit_limit, current_balance')?.eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalCustomers: customers?.length || 0,
        activeCustomers: 0,
        inactiveCustomers: 0,
        totalCreditLimit: 0,
        totalOutstanding: 0
      };

      customers?.forEach(customer => {
        if (customer?.is_active) {
          stats.activeCustomers++;
        } else {
          stats.inactiveCustomers++;
        }
        
        stats.totalCreditLimit += parseFloat(customer?.credit_limit || 0);
        stats.totalOutstanding += parseFloat(customer?.current_balance || 0);
      });

      return stats;
    } catch (error) {
      throw error;
    }
  },

  async updateCustomerBalance(customerId, balanceChange, userId) {
    try {
      // Get current balance
      const { data: customer, error: fetchError } = await supabase?.from('customers')?.select('current_balance')?.eq('id', customerId)?.eq('user_id', userId)?.single();

      if (fetchError) throw fetchError;

      const newBalance = parseFloat(customer?.current_balance || 0) + parseFloat(balanceChange);

      // Update balance
      const { data, error } = await supabase?.from('customers')?.update({
          current_balance: newBalance,
          updated_at: new Date()?.toISOString()
        })?.eq('id', customerId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async getCities(userId) {
    try {
      const { data, error } = await supabase?.from('customers')?.select('city')?.eq('user_id', userId)?.not('city', 'is', null);

      if (error) throw error;

      // Get unique cities
      const cities = [...new Set(data?.map(item => item?.city)?.filter(Boolean))];
      return cities?.sort() || [];
    } catch (error) {
      throw error;
    }
  }
};