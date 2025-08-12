import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderDetailsPanel = ({ order, onClose, onUpdateOrder, onStatusUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedOrder, setEditedOrder] = useState(order || {});

  if (!order) {
    return (
      <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Select an Order</h3>
          <p className="text-muted-foreground">Click on an order from the table to view details</p>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(amount)?.replace('PKR', 'Rs.');
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'processing':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'shipped':
        return 'bg-accent/10 text-accent border-accent/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleSave = () => {
    onUpdateOrder(editedOrder);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedOrder(order);
    setIsEditing(false);
  };

  const getNextStatus = (currentStatus) => {
    const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusFlow?.indexOf(currentStatus?.toLowerCase());
    return currentIndex < statusFlow?.length - 1 ? statusFlow?.[currentIndex + 1] : null;
  };

  const nextStatus = getNextStatus(order?.status);

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-foreground">Order Details</h3>
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
            {order?.status}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {!isEditing ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(true)}
              iconName="Edit"
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleSave}
                iconName="Save"
              >
                Save
              </Button>
            </>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 lg:hidden"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* Order Information */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Order Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Order ID</label>
              <p className="font-medium text-foreground">{order?.orderId}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Order Date</label>
              <p className="text-foreground">{formatDate(order?.orderDate)}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Total Amount</label>
              <p className="font-semibold text-foreground">{formatCurrency(order?.totalAmount)}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Payment Status</label>
              <p className="text-foreground">{order?.paymentStatus || 'Pending'}</p>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Customer Information</h4>
          <div className="space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Name</label>
              <p className="font-medium text-foreground">{order?.customerName}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <p className="text-foreground">{order?.customerEmail}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Phone</label>
              <p className="text-foreground">{order?.customerPhone || '+92 300 1234567'}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Delivery Address</label>
              {isEditing ? (
                <Input
                  value={editedOrder?.deliveryAddress || order?.deliveryAddress || 'Shop 15, Main Market, Karachi'}
                  onChange={(e) => setEditedOrder({...editedOrder, deliveryAddress: e?.target?.value})}
                  className="mt-1"
                />
              ) : (
                <p className="text-foreground">{order?.deliveryAddress || 'Shop 15, Main Market, Karachi'}</p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Order Items</h4>
          <div className="space-y-3">
            {order?.items?.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item?.name}</p>
                  <p className="text-sm text-muted-foreground">SKU: {item?.sku}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">
                    {item?.quantity} × {formatCurrency(item?.price)}
                  </p>
                  <p className="text-sm font-semibold text-foreground">
                    {formatCurrency(item?.quantity * item?.price)}
                  </p>
                </div>
              </div>
            )) || (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Premium Rice Basmati</p>
                    <p className="text-sm text-muted-foreground">SKU: RICE-001</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">50 × Rs. 120</p>
                    <p className="text-sm font-semibold text-foreground">Rs. 6,000</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pricing Breakdown */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Pricing Breakdown</h4>
          <div className="space-y-2 p-4 bg-muted/30 rounded-lg">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span className="text-foreground">{formatCurrency(order?.subtotal || order?.totalAmount * 0.9)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax (10%)</span>
              <span className="text-foreground">{formatCurrency(order?.tax || order?.totalAmount * 0.1)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Delivery Charges</span>
              <span className="text-foreground">{formatCurrency(order?.deliveryCharges || 0)}</span>
            </div>
            <hr className="border-border" />
            <div className="flex justify-between font-semibold">
              <span className="text-foreground">Total</span>
              <span className="text-foreground">{formatCurrency(order?.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Information */}
        <div>
          <h4 className="text-sm font-medium text-foreground mb-3">Delivery Information</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground">Delivery Date</label>
              {isEditing ? (
                <Input
                  type="date"
                  value={editedOrder?.deliveryDate?.split('T')?.[0] || order?.deliveryDate?.split('T')?.[0] || ''}
                  onChange={(e) => setEditedOrder({...editedOrder, deliveryDate: e?.target?.value})}
                  className="mt-1"
                />
              ) : (
                <p className="text-foreground">
                  {order?.deliveryDate ? formatDate(order?.deliveryDate) : 'Not scheduled'}
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Delivery Time</label>
              <p className="text-foreground">{order?.deliveryTime || '10:00 AM - 2:00 PM'}</p>
            </div>
          </div>
        </div>

        {/* Status Management */}
        {isEditing && (
          <div>
            <h4 className="text-sm font-medium text-foreground mb-3">Status Management</h4>
            <Select
              options={statusOptions}
              value={editedOrder?.status || order?.status}
              onChange={(value) => setEditedOrder({...editedOrder, status: value})}
            />
          </div>
        )}
      </div>
      {/* Footer Actions */}
      <div className="p-6 border-t border-border">
        <div className="flex flex-col space-y-3">
          {nextStatus && !isEditing && (
            <Button
              onClick={() => onStatusUpdate(order?.id, nextStatus)}
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full"
            >
              Mark as {nextStatus?.charAt(0)?.toUpperCase() + nextStatus?.slice(1)}
            </Button>
          )}
          
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              iconName="Printer"
              size="sm"
            >
              Print Invoice
            </Button>
            <Button
              variant="outline"
              iconName="MessageSquare"
              size="sm"
            >
              Contact Customer
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsPanel;