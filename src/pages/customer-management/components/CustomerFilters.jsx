import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';

const CustomerFilters = ({ onFiltersChange, onClearFilters }) => {
  const [filters, setFilters] = useState({
    search: '',
    customerType: '',
    location: '',
    orderFrequency: '',
    valueSegment: ''
  });

  const customerTypeOptions = [
    { value: '', label: 'All Types' },
    { value: 'retailer', label: 'Retailer' },
    { value: 'distributor', label: 'Distributor' },
    { value: 'manufacturer', label: 'Manufacturer' },
    { value: 'wholesaler', label: 'Wholesaler' }
  ];

  const locationOptions = [
    { value: '', label: 'All Locations' },
    { value: 'karachi', label: 'Karachi' },
    { value: 'lahore', label: 'Lahore' },
    { value: 'islamabad', label: 'Islamabad' },
    { value: 'faisalabad', label: 'Faisalabad' },
    { value: 'rawalpindi', label: 'Rawalpindi' },
    { value: 'multan', label: 'Multan' },
    { value: 'peshawar', label: 'Peshawar' },
    { value: 'quetta', label: 'Quetta' }
  ];

  const orderFrequencyOptions = [
    { value: '', label: 'All Frequencies' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
    { value: 'occasional', label: 'Occasional' }
  ];

  const valueSegmentOptions = [
    { value: '', label: 'All Segments' },
    { value: 'premium', label: 'Premium (>Rs. 500K)' },
    { value: 'high', label: 'High Value (Rs. 200K-500K)' },
    { value: 'medium', label: 'Medium Value (Rs. 50K-200K)' },
    { value: 'standard', label: 'Standard (<Rs. 50K)' }
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters = {
      search: '',
      customerType: '',
      location: '',
      orderFrequency: '',
      valueSegment: ''
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card border border-border rounded-lg p-6 h-fit">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-foreground flex items-center">
          <Icon name="Filter" size={20} className="mr-2" />
          Filters
        </h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            Clear All
          </Button>
        )}
      </div>
      <div className="space-y-6">
        {/* Search */}
        <div>
          <Input
            type="search"
            placeholder="Search customers..."
            value={filters?.search}
            onChange={(e) => handleFilterChange('search', e?.target?.value)}
            className="w-full"
          />
        </div>

        {/* Customer Type */}
        <div>
          <Select
            label="Customer Type"
            options={customerTypeOptions}
            value={filters?.customerType}
            onChange={(value) => handleFilterChange('customerType', value)}
          />
        </div>

        {/* Location */}
        <div>
          <Select
            label="Location"
            options={locationOptions}
            value={filters?.location}
            onChange={(value) => handleFilterChange('location', value)}
            searchable
          />
        </div>

        {/* Order Frequency */}
        <div>
          <Select
            label="Order Frequency"
            options={orderFrequencyOptions}
            value={filters?.orderFrequency}
            onChange={(value) => handleFilterChange('orderFrequency', value)}
          />
        </div>

        {/* Value Segment */}
        <div>
          <Select
            label="Value Segment"
            options={valueSegmentOptions}
            value={filters?.valueSegment}
            onChange={(value) => handleFilterChange('valueSegment', value)}
          />
        </div>

        {/* Quick Filters */}
        <div className="pt-4 border-t border-border">
          <h4 className="text-sm font-medium text-foreground mb-3">Quick Filters</h4>
          <div className="space-y-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('valueSegment', 'premium')}
              className="w-full justify-start text-left"
            >
              <Icon name="Star" size={16} className="mr-2" />
              Premium Customers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('orderFrequency', 'weekly')}
              className="w-full justify-start text-left"
            >
              <Icon name="Repeat" size={16} className="mr-2" />
              Regular Buyers
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleFilterChange('customerType', 'retailer')}
              className="w-full justify-start text-left"
            >
              <Icon name="Store" size={16} className="mr-2" />
              Retailers Only
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerFilters;