import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CustomerCard = ({ customer, onCustomerSelect, isSelected, onSelectCustomer }) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('PKR', 'Rs.');
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-success/10 text-success border-success/20';
      case 'inactive':
        return 'bg-muted text-muted-foreground border-border';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-2 ${
      isSelected ? 'ring-2 ring-primary border-primary' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start space-x-3 flex-1">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon name="Building2" size={20} className="text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{customer?.businessName}</h3>
            <p className="text-sm text-muted-foreground">{customer?.contactPerson}</p>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border mt-2 ${getStatusColor(customer?.status)}`}>
              {customer?.status?.charAt(0)?.toUpperCase() + customer?.status?.slice(1)}
            </span>
          </div>
        </div>
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => onSelectCustomer(customer?.id, e?.target?.checked)}
          className="w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
        />
      </div>
      {/* Contact Information */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Phone" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-foreground truncate">{customer?.phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="Mail" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-foreground truncate">{customer?.email}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm">
          <Icon name="MapPin" size={14} className="text-muted-foreground flex-shrink-0" />
          <span className="text-foreground">{customer?.location}</span>
        </div>
      </div>
      {/* Statistics */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Total Orders</p>
          <p className="text-lg font-bold text-foreground">{customer?.totalOrders}</p>
        </div>
        <div className="bg-muted/30 rounded-lg p-3">
          <p className="text-xs text-muted-foreground">Lifetime Value</p>
          <p className="text-sm font-bold text-foreground">{formatCurrency(customer?.lifetimeValue)}</p>
        </div>
      </div>
      {/* Last Order */}
      <div className="mb-4">
        <p className="text-xs text-muted-foreground">Last Order</p>
        <p className="text-sm text-foreground">{formatDate(customer?.lastOrderDate)}</p>
      </div>
      {/* Actions */}
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onCustomerSelect(customer, 'view')}
          iconName="Eye"
          iconPosition="left"
          className="flex-1"
        >
          View
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCustomerSelect(customer, 'order')}
          className="h-9 w-9"
        >
          <Icon name="ShoppingCart" size={16} />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCustomerSelect(customer, 'message')}
          className="h-9 w-9"
        >
          <Icon name="MessageSquare" size={16} />
        </Button>
      </div>
    </div>
  );
};

export default CustomerCard;