import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterSidebar = ({ isOpen, onClose, filters, onFiltersChange, onClearFilters }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'clothing', label: 'Clothing & Textiles' },
    { value: 'food', label: 'Food & Beverages' },
    { value: 'home', label: 'Home & Garden' },
    { value: 'automotive', label: 'Automotive' },
    { value: 'health', label: 'Health & Beauty' },
    { value: 'sports', label: 'Sports & Recreation' },
    { value: 'books', label: 'Books & Media' }
  ];

  const stockStatusOptions = [
    { value: '', label: 'All Stock Levels' },
    { value: 'in-stock', label: 'In Stock' },
    { value: 'low-stock', label: 'Low Stock' },
    { value: 'out-of-stock', label: 'Out of Stock' },
    { value: 'overstock', label: 'Overstock' }
  ];

  const supplierOptions = [
    { value: '', label: 'All Suppliers' },
    { value: 'karachi-traders', label: 'Karachi Traders' },
    { value: 'lahore-wholesale', label: 'Lahore Wholesale Co.' },
    { value: 'islamabad-imports', label: 'Islamabad Imports' },
    { value: 'faisalabad-textiles', label: 'Faisalabad Textiles' },
    { value: 'multan-foods', label: 'Multan Foods Ltd.' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleClearAll = () => {
    const clearedFilters = {
      search: '',
      category: '',
      stockStatus: '',
      supplier: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: ''
    };
    setLocalFilters(clearedFilters);
    onFiltersChange(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = Object.values(localFilters)?.some(value => value !== '');

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-0
        w-80 lg:w-full bg-card border-r border-border
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        flex flex-col h-full lg:h-auto
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:border-b-0">
          <h3 className="text-lg font-semibold text-foreground">Filters</h3>
          <div className="flex items-center space-x-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearAll}
                className="text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden h-8 w-8"
            >
              <Icon name="X" size={16} />
            </Button>
          </div>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Search */}
          <div>
            <Input
              label="Search Products"
              type="search"
              placeholder="Search by name or SKU..."
              value={localFilters?.search}
              onChange={(e) => handleFilterChange('search', e?.target?.value)}
              className="w-full"
            />
          </div>

          {/* Category Filter */}
          <div>
            <Select
              label="Category"
              options={categoryOptions}
              value={localFilters?.category}
              onChange={(value) => handleFilterChange('category', value)}
              placeholder="Select category"
            />
          </div>

          {/* Stock Status Filter */}
          <div>
            <Select
              label="Stock Status"
              options={stockStatusOptions}
              value={localFilters?.stockStatus}
              onChange={(value) => handleFilterChange('stockStatus', value)}
              placeholder="Select stock status"
            />
          </div>

          {/* Supplier Filter */}
          <div>
            <Select
              label="Supplier"
              options={supplierOptions}
              value={localFilters?.supplier}
              onChange={(value) => handleFilterChange('supplier', value)}
              placeholder="Select supplier"
            />
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Price Range (PKR)
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min"
                value={localFilters?.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e?.target?.value)}
              />
              <Input
                type="number"
                placeholder="Max"
                value={localFilters?.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e?.target?.value)}
              />
            </div>
          </div>

          {/* Stock Range */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Stock Quantity
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Input
                type="number"
                placeholder="Min qty"
                value={localFilters?.minStock}
                onChange={(e) => handleFilterChange('minStock', e?.target?.value)}
              />
              <Input
                type="number"
                placeholder="Max qty"
                value={localFilters?.maxStock}
                onChange={(e) => handleFilterChange('maxStock', e?.target?.value)}
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Quick Filters
            </label>
            <div className="space-y-2">
              <Button
                variant={localFilters?.stockStatus === 'low-stock' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('stockStatus', 
                  localFilters?.stockStatus === 'low-stock' ? '' : 'low-stock'
                )}
                className="w-full justify-start"
                iconName="AlertTriangle"
                iconPosition="left"
                iconSize={16}
              >
                Low Stock Items
              </Button>
              <Button
                variant={localFilters?.stockStatus === 'out-of-stock' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleFilterChange('stockStatus', 
                  localFilters?.stockStatus === 'out-of-stock' ? '' : 'out-of-stock'
                )}
                className="w-full justify-start"
                iconName="XCircle"
                iconPosition="left"
                iconSize={16}
              >
                Out of Stock
              </Button>
            </div>
          </div>
        </div>

        {/* Footer - Apply Button for Mobile */}
        <div className="p-4 border-t border-border lg:hidden">
          <Button
            variant="default"
            onClick={onClose}
            className="w-full"
          >
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;