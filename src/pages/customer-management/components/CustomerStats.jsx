import React from 'react';
import Icon from '../../../components/AppIcon';

const CustomerStats = ({ customers }) => {
  const totalCustomers = customers?.length;
  const activeCustomers = customers?.filter(c => c?.status === 'active')?.length;
  const totalLifetimeValue = customers?.reduce((sum, c) => sum + c?.lifetimeValue, 0);
  const averageOrderValue = totalLifetimeValue / customers?.reduce((sum, c) => sum + c?.totalOrders, 0) || 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('PKR', 'Rs.');
  };

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers?.toLocaleString(),
      icon: 'Users',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Active Customers',
      value: activeCustomers?.toLocaleString(),
      icon: 'UserCheck',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Total Lifetime Value',
      value: formatCurrency(totalLifetimeValue),
      icon: 'DollarSign',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'Average Order Value',
      value: formatCurrency(averageOrderValue),
      icon: 'TrendingUp',
      color: 'text-accent',
      bgColor: 'bg-accent/10'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats?.map((stat, index) => (
        <div key={index} className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{stat?.title}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat?.value}</p>
            </div>
            <div className={`w-12 h-12 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={24} className={stat?.color} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerStats;