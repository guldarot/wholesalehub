import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeliveryFilters = ({ onFilterChange, onRouteOptimize, drivers }) => {
  const [filters, setFilters] = useState({
    dateRange: 'today',
    status: 'all',
    driver: 'all',
    priority: 'all',
    search: ''
  });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const dateRangeOptions = [
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'this-week', label: 'This Week' },
    { value: 'next-week', label: 'Next Week' },
    { value: 'custom', label: 'Custom Range' }
  ];

  const statusOptions = [
    { value: 'all', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  const driverOptions = [
    { value: 'all', label: 'All Drivers' },
    ...drivers
  ];

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: 'today',
      status: 'all',
      driver: 'all',
      priority: 'all',
      search: ''
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters?.status !== 'all') count++;
    if (filters?.driver !== 'all') count++;
    if (filters?.priority !== 'all') count++;
    if (filters?.search) count++;
    if (filters?.dateRange !== 'today') count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Icon name="Filter" size={20} className="text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Delivery Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAdvanced(!showAdvanced)}
            iconName={showAdvanced ? "ChevronUp" : "ChevronDown"}
            iconPosition="right"
          >
            Advanced
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onRouteOptimize}
            iconName="Zap"
            iconPosition="left"
          >
            Optimize Route
          </Button>
        </div>
      </div>
      {/* Basic Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Input
          type="search"
          placeholder="Search orders, customers..."
          value={filters?.search}
          onChange={(e) => handleFilterChange('search', e?.target?.value)}
          label="Search"
        />

        <Select
          options={dateRangeOptions}
          value={filters?.dateRange}
          onChange={(value) => handleFilterChange('dateRange', value)}
          label="Date Range"
        />

        <Select
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => handleFilterChange('status', value)}
          label="Status"
        />

        <Select
          options={driverOptions}
          value={filters?.driver}
          onChange={(value) => handleFilterChange('driver', value)}
          label="Driver"
        />
      </div>
      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="border-t border-border pt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Select
              options={priorityOptions}
              value={filters?.priority}
              onChange={(value) => handleFilterChange('priority', value)}
              label="Priority"
            />

            <Input
              type="date"
              label="From Date"
              disabled={filters?.dateRange !== 'custom'}
            />

            <Input
              type="date"
              label="To Date"
              disabled={filters?.dateRange !== 'custom'}
            />
          </div>

          {/* Quick Filter Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('status', 'pending')}
              className={filters?.status === 'pending' ? 'bg-warning/10 border-warning text-warning' : ''}
            >
              Pending Only
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('status', 'in-transit')}
              className={filters?.status === 'in-transit' ? 'bg-primary/10 border-primary text-primary' : ''}
            >
              In Transit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('priority', 'high')}
              className={filters?.priority === 'high' ? 'bg-error/10 border-error text-error' : ''}
            >
              High Priority
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleFilterChange('dateRange', 'today')}
              className={filters?.dateRange === 'today' ? 'bg-success/10 border-success text-success' : ''}
            >
              Today's Deliveries
            </Button>
          </div>
        </div>
      )}
      {/* Filter Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div className="text-sm text-muted-foreground">
          {activeFilterCount > 0 ? `${activeFilterCount} filter${activeFilterCount > 1 ? 's' : ''} applied` : 'No filters applied'}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            disabled={activeFilterCount === 0}
          >
            Reset All
          </Button>
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryFilters;