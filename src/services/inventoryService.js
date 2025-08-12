import { supabase } from '../lib/supabase';

export const inventoryService = {
  async getProducts(userId, filters = {}) {
    try {
      let query = supabase?.from('products')?.select(`
          *,
          product_categories (
            id,
            name
          ),
          suppliers (
            id,
            name
          )
        `)?.eq('user_id', userId);

      // Apply filters
      if (filters?.search) {
        query = query?.or(`name.ilike.%${filters?.search}%,sku.ilike.%${filters?.search}%`);
      }

      if (filters?.category) {
        query = query?.eq('product_categories.name', filters?.category);
      }

      if (filters?.supplier) {
        query = query?.eq('suppliers.name', filters?.supplier);
      }

      if (filters?.status) {
        query = query?.eq('status', filters?.status);
      }

      if (filters?.minPrice) {
        query = query?.gte('unit_price', parseFloat(filters?.minPrice));
      }

      if (filters?.maxPrice) {
        query = query?.lte('unit_price', parseFloat(filters?.maxPrice));
      }

      if (filters?.minStock) {
        query = query?.gte('current_stock', parseInt(filters?.minStock));
      }

      if (filters?.maxStock) {
        query = query?.lte('current_stock', parseInt(filters?.maxStock));
      }

      // Apply stock status filter
      if (filters?.stockStatus) {
        switch (filters?.stockStatus) {
          case 'out-of-stock':
            query = query?.eq('current_stock', 0);
            break;
          case 'low-stock':
            query = query?.gt('current_stock', 0)?.lte('current_stock', 'reorder_level');
            break;
          case 'overstock':
            // Assuming overstock is 3x the reorder level
            query = query?.gt('current_stock', 'reorder_level * 3');
            break;
          case 'in-stock':
            query = query?.gt('current_stock', 0);
            break;
        }
      }

      const { data, error } = await query?.order('created_at', { ascending: false });

      if (error) throw error;

      return data?.map(product => ({
        id: product?.id,
        name: product?.name,
        sku: product?.sku,
        description: product?.description,
        category: product?.product_categories?.name || 'Uncategorized',
        supplier: product?.suppliers?.name || 'Unknown Supplier',
        currentStock: product?.current_stock || 0,
        reorderLevel: product?.reorder_level || 0,
        unitPrice: parseFloat(product?.unit_price || 0),
        status: product?.status,
        lastUpdated: product?.updated_at,
        weight: product?.weight,
        dimensions: product?.dimensions,
        barcode: product?.barcode
      })) || [];
    } catch (error) {
      throw error;
    }
  },

  async getProduct(productId, userId) {
    try {
      const { data, error } = await supabase?.from('products')?.select(`
          *,
          product_categories (
            id,
            name
          ),
          suppliers (
            id,
            name
          )
        `)?.eq('id', productId)?.eq('user_id', userId)?.single();

      if (error) throw error;

      return {
        id: data?.id,
        name: data?.name,
        sku: data?.sku,
        description: data?.description,
        category: data?.product_categories?.name || 'Uncategorized',
        categoryId: data?.category_id,
        supplier: data?.suppliers?.name || 'Unknown Supplier',
        supplierId: data?.supplier_id,
        currentStock: data?.current_stock || 0,
        reorderLevel: data?.reorder_level || 0,
        maxStockLevel: data?.max_stock_level,
        unitPrice: parseFloat(data?.unit_price || 0),
        status: data?.status,
        weight: data?.weight,
        dimensions: data?.dimensions,
        barcode: data?.barcode,
        createdAt: data?.created_at,
        updatedAt: data?.updated_at
      };
    } catch (error) {
      throw error;
    }
  },

  async createProduct(productData, userId) {
    try {
      const { data, error } = await supabase?.from('products')?.insert([{
          ...productData,
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

  async updateProduct(productId, productData, userId) {
    try {
      const { data, error } = await supabase?.from('products')?.update({
          ...productData,
          updated_at: new Date()?.toISOString()
        })?.eq('id', productId)?.eq('user_id', userId)?.select()?.single();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async deleteProduct(productId, userId) {
    try {
      const { error } = await supabase?.from('products')?.delete()?.eq('id', productId)?.eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw error;
    }
  },

  async adjustStock(productId, adjustmentData, userId) {
    try {
      // Get current product stock
      const { data: product, error: productError } = await supabase?.from('products')?.select('current_stock')?.eq('id', productId)?.eq('user_id', userId)?.single();

      if (productError) throw productError;

      const previousStock = product?.current_stock || 0;
      const newStock = previousStock + adjustmentData?.quantityChange;

      // Update product stock
      const { error: updateError } = await supabase?.from('products')?.update({
          current_stock: newStock,
          updated_at: new Date()?.toISOString()
        })?.eq('id', productId)?.eq('user_id', userId);

      if (updateError) throw updateError;

      // Record stock adjustment
      const { data: adjustment, error: adjustmentError } = await supabase?.from('stock_adjustments')?.insert([{
          user_id: userId,
          product_id: productId,
          adjustment_type: adjustmentData?.type,
          quantity_change: adjustmentData?.quantityChange,
          previous_stock: previousStock,
          new_stock: newStock,
          reason: adjustmentData?.reason,
          reference_id: adjustmentData?.referenceId
        }])?.select()?.single();

      if (adjustmentError) throw adjustmentError;

      return {
        previousStock,
        newStock,
        adjustment
      };
    } catch (error) {
      throw error;
    }
  },

  async getCategories(userId) {
    try {
      const { data, error } = await supabase?.from('product_categories')?.select('*')?.eq('user_id', userId)?.eq('is_active', true)?.order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getSuppliers(userId) {
    try {
      const { data, error } = await supabase?.from('suppliers')?.select('*')?.eq('user_id', userId)?.eq('is_active', true)?.order('name');

      if (error) throw error;

      return data || [];
    } catch (error) {
      throw error;
    }
  },

  async getInventoryStats(userId) {
    try {
      const { data, error } = await supabase?.from('products')?.select('current_stock, reorder_level, unit_price, status')?.eq('user_id', userId);

      if (error) throw error;

      const stats = {
        totalProducts: data?.length || 0,
        totalValue: 0,
        lowStockItems: 0,
        outOfStockItems: 0,
        activeProducts: 0
      };

      data?.forEach(product => {
        const currentStock = product?.current_stock || 0;
        const reorderLevel = product?.reorder_level || 0;
        const unitPrice = parseFloat(product?.unit_price || 0);

        stats.totalValue += currentStock * unitPrice;

        if (currentStock === 0) {
          stats.outOfStockItems++;
        } else if (currentStock <= reorderLevel) {
          stats.lowStockItems++;
        }

        if (product?.status === 'active') {
          stats.activeProducts++;
        }
      });

      return stats;
    } catch (error) {
      throw error;
    }
  },

  async bulkUpdateProducts(productIds, updates, userId) {
    try {
      const { data, error } = await supabase?.from('products')?.update({
          ...updates,
          updated_at: new Date()?.toISOString()
        })?.in('id', productIds)?.eq('user_id', userId)?.select();

      if (error) throw error;

      return data;
    } catch (error) {
      throw error;
    }
  },

  async bulkDeleteProducts(productIds, userId) {
    try {
      const { error } = await supabase?.from('products')?.delete()?.in('id', productIds)?.eq('user_id', userId);

      if (error) throw error;

      return true;
    } catch (error) {
      throw error;
    }
  }
};