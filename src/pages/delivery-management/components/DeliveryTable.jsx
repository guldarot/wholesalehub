import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeliveryTable = ({ deliveries, onDeliverySelect, selectedDelivery, onStatusUpdate }) => {
  const [sortField, setSortField] = useState('scheduledDate');
  const [sortDirection, setSortDirection] = useState('asc');

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-transit':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'failed':
        return 'bg-error/10 text-error border-error/20';
      case 'cancelled':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-muted-foreground';
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedDeliveries = [...deliveries]?.sort((a, b) => {
    let aValue = a?.[sortField];
    let bValue = b?.[sortField];

    if (sortField === 'scheduledDate') {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-4 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Delivery Schedule</h3>
        <p className="text-sm text-muted-foreground mt-1">
          {deliveries?.length} deliveries scheduled
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('orderId')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Order ID</span>
                  <Icon 
                    name={sortField === 'orderId' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('customerName')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Customer</span>
                  <Icon 
                    name={sortField === 'customerName' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Address</th>
              <th className="text-left p-4 font-medium text-foreground">
                <button
                  onClick={() => handleSort('scheduledDate')}
                  className="flex items-center space-x-1 hover:text-primary transition-smooth"
                >
                  <span>Scheduled</span>
                  <Icon 
                    name={sortField === 'scheduledDate' ? (sortDirection === 'asc' ? 'ChevronUp' : 'ChevronDown') : 'ChevronsUpDown'} 
                    size={16} 
                  />
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground">Driver</th>
              <th className="text-left p-4 font-medium text-foreground">Status</th>
              <th className="text-left p-4 font-medium text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedDeliveries?.map((delivery) => (
              <tr
                key={delivery?.id}
                onClick={() => onDeliverySelect(delivery)}
                className={`border-b border-border hover:bg-muted/30 cursor-pointer transition-smooth ${
                  selectedDelivery?.id === delivery?.id ? 'bg-primary/5' : ''
                }`}
              >
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <Icon 
                      name="Circle" 
                      size={8} 
                      className={getPriorityColor(delivery?.priority)} 
                    />
                    <span className="font-medium text-foreground">{delivery?.orderId}</span>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{delivery?.customerName}</p>
                    <p className="text-sm text-muted-foreground">{delivery?.customerPhone}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="max-w-48">
                    <p className="text-sm text-foreground truncate">{delivery?.address}</p>
                    <p className="text-xs text-muted-foreground">{delivery?.city}</p>
                  </div>
                </td>
                <td className="p-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDate(delivery?.scheduledDate)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(delivery?.scheduledDate)}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                      <Icon name="User" size={12} color="white" />
                    </div>
                    <span className="text-sm text-foreground">{delivery?.driverName}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(delivery?.status)}`}>
                    {delivery?.status}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onStatusUpdate(delivery?.id, 'in-transit');
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="Truck" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e?.stopPropagation();
                        onDeliverySelect(delivery);
                      }}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {deliveries?.length === 0 && (
        <div className="p-8 text-center">
          <Icon name="Truck" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No deliveries scheduled</p>
        </div>
      )}
    </div>
  );
};

export default DeliveryTable;