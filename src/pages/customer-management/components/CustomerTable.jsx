import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const CustomerTable = ({ customers, onCustomerSelect, onBulkAction, selectedCustomers, onSelectCustomer, onSelectAll }) => {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig?.key === key && sortConfig?.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortIcon = (key) => {
    if (sortConfig?.key !== key) {
      return <Icon name="ArrowUpDown" size={16} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={16} className="text-foreground" />
      : <Icon name="ArrowDown" size={16} className="text-foreground" />;
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

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header with Bulk Actions */}
      {selectedCustomers?.length > 0 && (
        <div className="bg-primary/5 border-b border-border p-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-foreground">
              {selectedCustomers?.length} customer{selectedCustomers?.length > 1 ? 's' : ''} selected
            </span>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('message')}
                iconName="MessageSquare"
                iconPosition="left"
              >
                Send Message
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('export')}
                iconName="Download"
                iconPosition="left"
              >
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onBulkAction('tag')}
                iconName="Tag"
                iconPosition="left"
              >
                Add Tag
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={selectedCustomers?.length === customers?.length && customers?.length > 0}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('businessName')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Business Name</span>
                  {getSortIcon('businessName')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('contactPerson')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Contact Person</span>
                  {getSortIcon('contactPerson')}
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Contact Info</span>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('totalOrders')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Total Orders</span>
                  {getSortIcon('totalOrders')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('lifetimeValue')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Lifetime Value</span>
                  {getSortIcon('lifetimeValue')}
                </button>
              </th>
              <th className="text-left p-4">
                <button
                  onClick={() => handleSort('lastOrderDate')}
                  className="flex items-center space-x-2 text-sm font-medium text-foreground hover:text-primary transition-smooth"
                >
                  <span>Last Order</span>
                  {getSortIcon('lastOrderDate')}
                </button>
              </th>
              <th className="text-left p-4">
                <span className="text-sm font-medium text-foreground">Status</span>
              </th>
              <th className="text-center p-4">
                <span className="text-sm font-medium text-foreground">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {customers?.map((customer) => (
              <tr key={customer?.id} className="border-b border-border hover:bg-muted/30 transition-smooth">
                <td className="p-4">
                  <Checkbox
                    checked={selectedCustomers?.includes(customer?.id)}
                    onChange={(e) => onSelectCustomer(customer?.id, e?.target?.checked)}
                  />
                </td>
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground">{customer?.businessName}</p>
                    <p className="text-sm text-muted-foreground">{customer?.customerType}</p>
                  </div>
                </td>
                <td className="p-4">
                  <p className="text-foreground">{customer?.contactPerson}</p>
                </td>
                <td className="p-4">
                  <div className="space-y-1">
                    <p className="text-sm text-foreground flex items-center">
                      <Icon name="Phone" size={14} className="mr-2 text-muted-foreground" />
                      {customer?.phone}
                    </p>
                    <p className="text-sm text-foreground flex items-center">
                      <Icon name="Mail" size={14} className="mr-2 text-muted-foreground" />
                      {customer?.email}
                    </p>
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-medium">{customer?.totalOrders}</span>
                </td>
                <td className="p-4">
                  <span className="text-foreground font-medium">{formatCurrency(customer?.lifetimeValue)}</span>
                </td>
                <td className="p-4">
                  <span className="text-muted-foreground">{formatDate(customer?.lastOrderDate)}</span>
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(customer?.status)}`}>
                    {customer?.status?.charAt(0)?.toUpperCase() + customer?.status?.slice(1)}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCustomerSelect(customer, 'view')}
                      className="h-8 w-8"
                    >
                      <Icon name="Eye" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCustomerSelect(customer, 'order')}
                      className="h-8 w-8"
                    >
                      <Icon name="ShoppingCart" size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onCustomerSelect(customer, 'message')}
                      className="h-8 w-8"
                    >
                      <Icon name="MessageSquare" size={16} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {customers?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Users" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No customers found</h3>
          <p className="text-muted-foreground">Try adjusting your filters or add new customers to get started.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerTable;