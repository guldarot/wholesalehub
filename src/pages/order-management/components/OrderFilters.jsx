import React, { useState } from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const OrderFilters = ({ onFiltersChange, onCreateOrder }) => {
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    dateFrom: '',
    dateTo: '',
    amountMin: '',
    amountMax: '',
    customer: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'shipped', label: 'Shipped' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: '',
      status: '',
      dateFrom: '',
      dateTo: '',
      amountMin: '',
      amountMax: '',
      customer: ''
    };
    setFilters(clearedFilters);
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border shadow-elevation-1 p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-foreground">Order Management</h2>
          {hasActiveFilters && (
            <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
              Filters Active
            </span>
          )}
        </div>
        <Button
          onClick={onCreateOrder}
          iconName="Plus"
          iconPosition="left"
          className="bg-primary hover:bg-primary/90"
        >
          Create New Order
        </Button>
      </div>
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search orders..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          className="w-full"
        />
        
        <Select
          placeholder="Filter by status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
        />

        <Input
          type="text"
          placeholder="Customer name"
          value={filters?.customer}
          onChange={(e) => handleFilterChange('customer', e?.target?.value)}
        />

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
            size="sm"
          >
            Advanced
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              onClick={clearFilters}
              iconName="X"
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date From</label>
              <Input
                type="date"
                value={filters?.dateFrom}
                onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Date To</label>
              <Input
                type="date"
                value={filters?.dateTo}
                onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Min Amount (PKR)</label>
              <Input
                type="number"
                placeholder="0"
                value={filters?.amountMin}
                onChange={(e) => handleFilterChange('amountMin', e?.target?.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Max Amount (PKR)</label>
              <Input
                type="number"
                placeholder="1000000"
                value={filters?.amountMax}
                onChange={(e) => handleFilterChange('amountMax', e?.target?.value)}
              />
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Quick filters:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('status', 'pending')}
            className="text-warning hover:bg-warning/10"
          >
            Pending Orders
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleFilterChange('status', 'processing')}
            className="text-primary hover:bg-primary/10"
          >
            Processing
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const today = new Date()?.toISOString()?.split('T')?.[0];
              handleFilterChange('dateFrom', today);
            }}
            className="text-accent hover:bg-accent/10"
          >
            Today's Orders
          </Button>
        </div>

        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" iconName="Download">
            Export
          </Button>
          <Button variant="outline" size="sm" iconName="Upload">
            Import
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderFilters;