import React from 'react';
import Icon from '../../../components/AppIcon';

const InventoryStats = ({ products }) => {
  const calculateStats = () => {
    const totalProducts = products?.length;
    const inStock = products?.filter(p => p?.currentStock > p?.reorderLevel)?.length;
    const lowStock = products?.filter(p => p?.currentStock <= p?.reorderLevel && p?.currentStock > 0)?.length;
    const outOfStock = products?.filter(p => p?.currentStock === 0)?.length;
    const totalValue = products?.reduce((sum, p) => sum + (p?.currentStock * p?.unitPrice), 0);
    const totalItems = products?.reduce((sum, p) => sum + p?.currentStock, 0);

    return {
      totalProducts,
      inStock,
      lowStock,
      outOfStock,
      totalValue,
      totalItems
    };
  };

  const stats = calculateStats();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  const statCards = [
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString(),
      icon: 'Package',
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
    {
      title: 'In Stock',
      value: stats?.inStock?.toLocaleString(),
      icon: 'CheckCircle',
      color: 'text-success',
      bg: 'bg-success/10'
    },
    {
      title: 'Low Stock',
      value: stats?.lowStock?.toLocaleString(),
      icon: 'AlertTriangle',
      color: 'text-warning',
      bg: 'bg-warning/10'
    },
    {
      title: 'Out of Stock',
      value: stats?.outOfStock?.toLocaleString(),
      icon: 'XCircle',
      color: 'text-error',
      bg: 'bg-error/10'
    },
    {
      title: 'Total Items',
      value: stats?.totalItems?.toLocaleString(),
      icon: 'Boxes',
      color: 'text-secondary',
      bg: 'bg-secondary/10'
    },
    {
      title: 'Inventory Value',
      value: formatCurrency(stats?.totalValue),
      icon: 'DollarSign',
      color: 'text-accent',
      bg: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg ${stat?.bg} flex items-center justify-center`}>
              <Icon name={stat?.icon} size={20} className={stat?.color} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground">{stat?.title}</p>
              <p className="text-lg font-semibold text-foreground truncate">{stat?.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventoryStats;