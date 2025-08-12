import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const OrdersTable = ({ orders, selectedOrder, onOrderSelect, onStatusUpdate }) => {
  const [sortField, setSortField] = useState('orderDate');
  const [sortDirection, setSortDirection] = useState('desc');

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

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedOrders = [...orders]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'orderDate' || sortField === 'deliveryDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (sortField === 'totalAmount') {
      aValue = parseFloat(aValue);
      bValue = parseFloat(bValue);
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const getSortIcon = (field) => {
    if (sortField !== field) return 'ArrowUpDown';
    return sortDirection === 'asc' ? 'ArrowUp' : 'ArrowDown';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('orderId')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Order ID</span>
                  <Icon name={getSortIcon('orderId')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('customerName')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Customer</span>
                  <Icon name={getSortIcon('customerName')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('orderDate')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Order Date</span>
                  <Icon name={getSortIcon('orderDate')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('totalAmount')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Total Amount</span>
                  <Icon name={getSortIcon('totalAmount')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('deliveryDate')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Delivery Date</span>
                  <Icon name={getSortIcon('deliveryDate')} size={16} />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedOrders?.map((order) => (
              <tr
                key={order?.id}
                onClick={() => onOrderSelect(order)}
                className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-smooth ${
                  selectedOrder?.id === order?.id ? 'bg-primary/5 border-primary/20' : ''
                }`}
              >
                <td className="p-4">
                  <span className="font-medium text-foreground">{order?.orderId}</span>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{order?.customerName}</p>
                    <p className="text-sm text-muted-foreground">{order?.customerEmail}</p>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  {formatDate(order?.orderDate)}
                </td>
                <td className="p-4">
                  <span className="font-semibold text-foreground">
                    {formatCurrency(order?.totalAmount)}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                    {order?.status}
                  </span>
                </td>
                <td className="p-4 text-muted-foreground">
                  {order?.deliveryDate ? formatDate(order?.deliveryDate) : 'Not scheduled'}
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onOrderSelect(order);
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onStatusUpdate(order?.id, 'processing');
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="Edit" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {sortedOrders?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="ShoppingCart" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default OrdersTable;