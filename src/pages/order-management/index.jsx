import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { orderService } from '../../services/orderService';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import OrderFilters from './components/OrderFilters';
import OrdersTable from './components/OrdersTable';
import OrderDetailsPanel from './components/OrderDetailsPanel';
import CreateOrderModal from './components/CreateOrderModal';
import BulkActionsBar from './components/BulkActionsBar';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const OrderManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailsPanel, setShowDetailsPanel] = useState(false);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load orders data
  useEffect(() => {
    if (!user?.id || authLoading) return;

    const loadOrders = async () => {
      try {
        setLoading(true);
        setError('');
        
        const ordersData = await orderService?.getOrders(user?.id, filters);
        setOrders(ordersData);
        setFilteredOrders(ordersData);
      } catch (err) {
        console.error('Orders loading failed:', err);
        setError(err?.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [user?.id, authLoading, filters]);

  // Filter orders based on search and filter criteria
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (filters?.search) {
      const searchTerm = filters?.search?.toLowerCase();
      filtered = filtered?.filter(order =>
        order?.orderId?.toLowerCase()?.includes(searchTerm) ||
        order?.customerName?.toLowerCase()?.includes(searchTerm) ||
        order?.customerEmail?.toLowerCase()?.includes(searchTerm)
      );
    }

    // Status filter
    if (filters?.status) {
      filtered = filtered?.filter(order => order?.status === filters?.status);
    }

    // Customer filter
    if (filters?.customer) {
      const customerTerm = filters?.customer?.toLowerCase();
      filtered = filtered?.filter(order =>
        order?.customerName?.toLowerCase()?.includes(customerTerm)
      );
    }

    // Date range filter
    if (filters?.dateFrom) {
      filtered = filtered?.filter(order =>
        new Date(order.orderDate) >= new Date(filters.dateFrom)
      );
    }

    if (filters?.dateTo) {
      filtered = filtered?.filter(order =>
        new Date(order.orderDate) <= new Date(filters.dateTo + 'T23:59:59')
      );
    }

    // Amount range filter
    if (filters?.amountMin) {
      filtered = filtered?.filter(order =>
        order?.totalAmount >= parseFloat(filters?.amountMin)
      );
    }

    if (filters?.amountMax) {
      filtered = filtered?.filter(order =>
        order?.totalAmount <= parseFloat(filters?.amountMax)
      );
    }

    setFilteredOrders(filtered);
  }, [filters, orders]);

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleOrderSelect = async (order) => {
    try {
      // Load full order details
      const orderDetails = await orderService?.getOrder(order?.id, user?.id);
      setSelectedOrder(orderDetails);
      setShowDetailsPanel(true);
    } catch (err) {
      console.error('Failed to load order details:', err);
      setError(err?.message || 'Failed to load order details');
    }
  };

  const handleCreateOrder = () => {
    setShowCreateModal(true);
  };

  const handleOrderCreated = (newOrder) => {
    setOrders([newOrder, ...orders]);
    setShowCreateModal(false);
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await orderService?.updateOrderStatus(orderId, newStatus, user?.id);
      
      // Update orders in state
      setOrders(orders?.map(order =>
        order?.id === orderId
          ? { ...order, status: newStatus }
          : order
      ));

      if (selectedOrder && selectedOrder?.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (err) {
      console.error('Status update failed:', err);
      setError(err?.message || 'Failed to update order status');
    }
  };

  const handleOrderUpdate = async (updatedOrderData) => {
    try {
      const updatedOrder = await orderService?.updateOrder(
        selectedOrder?.id, 
        updatedOrderData, 
        user?.id
      );
      
      setOrders(orders?.map(order =>
        order?.id === updatedOrder?.id ? { ...order, ...updatedOrderData } : order
      ));
      
      setSelectedOrder({ ...selectedOrder, ...updatedOrderData });
    } catch (err) {
      console.error('Order update failed:', err);
      setError(err?.message || 'Failed to update order');
    }
  };

  const handleBulkAction = async (action, selectedOrderIds, value = null) => {
    try {
      switch (action) {
        case 'update-status':
          if (value) {
            await orderService?.bulkUpdateOrderStatus(selectedOrderIds, value, user?.id);
            setOrders(orders?.map(order =>
              selectedOrderIds?.includes(order?.id)
                ? { ...order, status: value }
                : order
            ));
          }
          break;
        case 'export':
          console.log('Exporting orders:', selectedOrderIds);
          break;
        case 'print-invoices': console.log('Printing invoices for orders:', selectedOrderIds);
          break;
        case 'send-notifications':
          console.log('Sending notifications for orders:', selectedOrderIds);
          break;
        case 'delete':
          // Delete selected orders
          for (const orderId of selectedOrderIds) {
            await orderService?.deleteOrder(orderId, user?.id);
          }
          
          setOrders(orders?.filter(order => !selectedOrderIds?.includes(order?.id)));
          if (selectedOrder && selectedOrderIds?.includes(selectedOrder?.id)) {
            setSelectedOrder(null);
            setShowDetailsPanel(false);
          }
          break;
        default:
          break;
      }
      setSelectedOrders([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
      setError(err?.message || 'Bulk action failed');
    }
  };

  const handleCloseDetailsPanel = () => {
    setShowDetailsPanel(false);
    setSelectedOrder(null);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-16">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-muted rounded w-64 mb-4"></div>
              <div className="h-64 bg-muted rounded mb-6"></div>
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
        <main className="pt-16">
          <div className="container mx-auto px-4 lg:px-6 py-6">
            <div className="text-center py-12">
              <h3 className="text-lg font-semibold">Please sign in to manage orders</h3>
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
      <main className="pt-16">
        <div className="container mx-auto px-4 lg:px-6 py-6">
          <Breadcrumb />
          
          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
              <button
                onClick={() => setError('')}
                className="mt-2 text-sm text-red-500 underline"
              >
                Dismiss
              </button>
            </div>
          )}
          
          {/* Filters */}
          <OrderFilters
            onFiltersChange={handleFiltersChange}
            onCreateOrder={handleCreateOrder}
          />

          {/* Bulk Actions */}
          <BulkActionsBar
            selectedOrders={selectedOrders}
            onBulkAction={handleBulkAction}
            onClearSelection={() => setSelectedOrders([])}
          />

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading orders...</p>
            </div>
          )}

          {/* Main Content */}
          {!loading && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
              {/* Orders Table */}
              <div className={`${showDetailsPanel ? 'xl:col-span-8' : 'xl:col-span-12'} transition-all duration-300`}>
                <OrdersTable
                  orders={filteredOrders}
                  selectedOrder={selectedOrder}
                  onOrderSelect={handleOrderSelect}
                  onStatusUpdate={handleStatusUpdate}
                />

                {/* Mobile Details Panel Overlay */}
                {showDetailsPanel && (
                  <div className="fixed inset-0 z-40 xl:hidden">
                    <div className="absolute inset-0 bg-black/50" onClick={handleCloseDetailsPanel} />
                    <div className="absolute inset-y-0 right-0 w-full max-w-md bg-background">
                      <OrderDetailsPanel
                        order={selectedOrder}
                        onClose={handleCloseDetailsPanel}
                        onUpdateOrder={handleOrderUpdate}
                        onStatusUpdate={handleStatusUpdate}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Order Details Panel - Desktop */}
              {showDetailsPanel && (
                <div className="hidden xl:block xl:col-span-4">
                  <OrderDetailsPanel
                    order={selectedOrder}
                    onClose={handleCloseDetailsPanel}
                    onUpdateOrder={handleOrderUpdate}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </div>
              )}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredOrders?.length === 0 && (
            <div className="text-center py-12">
              <Icon name="ShoppingCart" size={64} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Orders Found</h3>
              <p className="text-muted-foreground mb-6">
                {Object.values(filters)?.some(f => f) 
                  ? 'Try adjusting your search or filter criteria' :'Get started by creating your first order'
                }
              </p>
              <Button
                onClick={handleCreateOrder}
                iconName="Plus"
                iconPosition="left"
              >
                Create New Order
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* Create Order Modal */}
      <CreateOrderModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateOrder={handleOrderCreated}
      />

      {/* Quick Action Button */}
      <QuickActionButton />
    </div>
  );
};

export default OrderManagement;