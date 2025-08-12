import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const ProductTable = ({ 
  products, 
  selectedProducts, 
  onSelectProduct, 
  onSelectAll, 
  sortConfig, 
  onSort, 
  onEdit, 
  onDuplicate, 
  onStockAdjustment 
}) => {
  const [hoveredRow, setHoveredRow] = useState(null);

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
      return { status: 'out-of-stock', color: 'text-error', bg: 'bg-error/10', label: 'Out of Stock' };
    } else if (currentStock <= reorderLevel) {
      return { status: 'low-stock', color: 'text-warning', bg: 'bg-warning/10', label: 'Low Stock' };
    } else if (currentStock > reorderLevel * 3) {
      return { status: 'overstock', color: 'text-primary', bg: 'bg-primary/10', label: 'Overstock' };
    } else {
      return { status: 'in-stock', color: 'text-success', bg: 'bg-success/10', label: 'In Stock' };
    }
  };

  const getSortIcon = (column) => {
    if (sortConfig?.key !== column) {
      return <Icon name="ArrowUpDown" size={14} className="text-muted-foreground" />;
    }
    return sortConfig?.direction === 'asc' 
      ? <Icon name="ArrowUp" size={14} className="text-foreground" />
      : <Icon name="ArrowDown" size={14} className="text-foreground" />;
  };

  const handleSort = (column) => {
    onSort(column);
  };

  const isAllSelected = products?.length > 0 && selectedProducts?.length === products?.length;
  const isIndeterminate = selectedProducts?.length > 0 && selectedProducts?.length < products?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50 border-b border-border">
            <tr>
              <th className="w-12 p-4">
                <Checkbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                />
              </th>
              <th className="text-left p-4 font-medium text-foreground min-w-[200px]">
                <button
                  onClick={() => handleSort('name')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Product Name</span>
                  {getSortIcon('name')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground min-w-[120px]">
                <button
                  onClick={() => handleSort('sku')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>SKU</span>
                  {getSortIcon('sku')}
                </button>
              </th>
              <th className="text-left p-4 font-medium text-foreground min-w-[140px]">
                <button
                  onClick={() => handleSort('category')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Category</span>
                  {getSortIcon('category')}
                </button>
              </th>
              <th className="text-center p-4 font-medium text-foreground min-w-[100px]">
                <button
                  onClick={() => handleSort('currentStock')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Stock</span>
                  {getSortIcon('currentStock')}
                </button>
              </th>
              <th className="text-center p-4 font-medium text-foreground min-w-[120px]">
                <button
                  onClick={() => handleSort('reorderLevel')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Reorder Level</span>
                  {getSortIcon('reorderLevel')}
                </button>
              </th>
              <th className="text-right p-4 font-medium text-foreground min-w-[120px]">
                <button
                  onClick={() => handleSort('unitPrice')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Unit Price</span>
                  {getSortIcon('unitPrice')}
                </button>
              </th>
              <th className="text-center p-4 font-medium text-foreground min-w-[120px]">
                <button
                  onClick={() => handleSort('lastUpdated')}
                  className="flex items-center space-x-2 hover:text-primary transition-smooth"
                >
                  <span>Last Updated</span>
                  {getSortIcon('lastUpdated')}
                </button>
              </th>
              <th className="text-center p-4 font-medium text-foreground w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product) => {
              const stockStatus = getStockStatus(product?.currentStock, product?.reorderLevel);
              const isSelected = selectedProducts?.includes(product?.id);
              
              return (
                <tr
                  key={product?.id}
                  className={`border-b border-border hover:bg-muted/30 transition-smooth ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                  onMouseEnter={() => setHoveredRow(product?.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  <td className="p-4">
                    <Checkbox
                      checked={isSelected}
                      onChange={(e) => onSelectProduct(product?.id, e?.target?.checked)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
                        <Icon name="Package" size={20} className="text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{product?.name}</p>
                        <p className="text-sm text-muted-foreground">{product?.description}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-sm text-foreground">{product?.sku}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-foreground">{product?.category}</span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center space-y-1">
                      <span className={`font-semibold ${stockStatus?.color}`}>
                        {product?.currentStock?.toLocaleString()}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${stockStatus?.bg} ${stockStatus?.color}`}>
                        {stockStatus?.label}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm text-muted-foreground">
                      {product?.reorderLevel?.toLocaleString()}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <span className="font-semibold text-foreground">
                      {formatCurrency(product?.unitPrice)}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <span className="text-sm text-muted-foreground">
                      {formatDate(product?.lastUpdated)}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className={`flex items-center justify-center space-x-1 transition-opacity ${
                      hoveredRow === product?.id ? 'opacity-100' : 'opacity-0'
                    }`}>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(product)}
                        className="h-8 w-8"
                      >
                        <Icon name="Edit" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDuplicate(product)}
                        className="h-8 w-8"
                      >
                        <Icon name="Copy" size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onStockAdjustment(product)}
                        className="h-8 w-8"
                      >
                        <Icon name="Package" size={14} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Empty State */}
      {products?.length === 0 && (
        <div className="p-12 text-center">
          <Icon name="Package" size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No products found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your filters or add your first product to get started.
          </p>
          <Button variant="default">
            Add Product
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductTable;