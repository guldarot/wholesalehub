import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductCard = ({ 
  product, 
  isSelected, 
  onSelect, 
  onEdit, 
  onDuplicate, 
  onStockAdjustment 
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStockStatus = (currentStock, reorderLevel) => {
    if (currentStock === 0) {
      return { status: 'out-of-stock', color: 'text-error', bg: 'bg-error/10', label: 'Out of Stock', icon: 'XCircle' };
    } else if (currentStock <= reorderLevel) {
      return { status: 'low-stock', color: 'text-warning', bg: 'bg-warning/10', label: 'Low Stock', icon: 'AlertTriangle' };
    } else if (currentStock > reorderLevel * 3) {
      return { status: 'overstock', color: 'text-primary', bg: 'bg-primary/10', label: 'Overstock', icon: 'TrendingUp' };
    } else {
      return { status: 'in-stock', color: 'text-success', bg: 'bg-success/10', label: 'In Stock', icon: 'CheckCircle' };
    }
  };

  const stockStatus = getStockStatus(product?.currentStock, product?.reorderLevel);

  return (
    <div className={`bg-card border border-border rounded-lg p-4 hover:shadow-elevation-2 transition-smooth ${
      isSelected ? 'ring-2 ring-primary ring-offset-2' : ''
    }`}>
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3 flex-1">
          <Checkbox
            checked={isSelected}
            onChange={(e) => onSelect(product?.id, e?.target?.checked)}
          />
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
            <Icon name="Package" size={24} className="text-muted-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-foreground truncate">{product?.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">{product?.sku}</p>
          </div>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(product)}
            className="h-8 w-8"
          >
            <Icon name="Edit" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDuplicate(product)}
            className="h-8 w-8"
          >
            <Icon name="Copy" size={16} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onStockAdjustment(product)}
            className="h-8 w-8"
          >
            <Icon name="Package" size={16} />
          </Button>
        </div>
      </div>
      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {product?.description}
      </p>
      {/* Stock Status */}
      <div className="flex items-center justify-between mb-4">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-full ${stockStatus?.bg}`}>
          <Icon name={stockStatus?.icon} size={16} className={stockStatus?.color} />
          <span className={`text-sm font-medium ${stockStatus?.color}`}>
            {stockStatus?.label}
          </span>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-foreground">
            {product?.currentStock?.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground">
            Reorder: {product?.reorderLevel?.toLocaleString()}
          </p>
        </div>
      </div>
      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-muted-foreground mb-1">Category</p>
          <p className="text-sm font-medium text-foreground">{product?.category}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Unit Price</p>
          <p className="text-sm font-bold text-foreground">{formatCurrency(product?.unitPrice)}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Supplier</p>
          <p className="text-sm font-medium text-foreground">{product?.supplier}</p>
        </div>
        <div>
          <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
          <p className="text-sm font-medium text-foreground">{formatDate(product?.lastUpdated)}</p>
        </div>
      </div>
      {/* Stock Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">Stock Level</span>
          <span className="text-xs text-muted-foreground">
            {Math.round((product?.currentStock / (product?.reorderLevel * 4)) * 100)}%
          </span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all ${
              stockStatus?.status === 'out-of-stock' ? 'bg-error' :
              stockStatus?.status === 'low-stock' ? 'bg-warning' :
              stockStatus?.status === 'overstock' ? 'bg-primary' : 'bg-success'
            }`}
            style={{
              width: `${Math.min(Math.max((product?.currentStock / (product?.reorderLevel * 4)) * 100, 0), 100)}%`
            }}
          />
        </div>
      </div>
      {/* Quick Actions */}
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onStockAdjustment(product)}
          className="flex-1"
          iconName="Package"
          iconPosition="left"
          iconSize={16}
        >
          Adjust Stock
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onEdit(product)}
          iconName="Edit"
          iconSize={16}
        >
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;