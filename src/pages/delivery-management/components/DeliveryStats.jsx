import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryStats = ({ deliveries }) => {
  const calculateStats = () => {
    const total = deliveries?.length;
    const pending = deliveries?.filter(d => d?.status === 'pending')?.length;
    const inTransit = deliveries?.filter(d => d?.status === 'in-transit')?.length;
    const delivered = deliveries?.filter(d => d?.status === 'delivered')?.length;
    const failed = deliveries?.filter(d => d?.status === 'failed')?.length;

    const deliveryRate = total > 0 ? ((delivered / total) * 100)?.toFixed(1) : 0;
    const totalValue = deliveries?.reduce((sum, d) => sum + d?.orderValue, 0);
    const avgDeliveryTime = deliveries?.filter(d => d?.status === 'delivered' && d?.actualDeliveryDate)?.reduce((sum, d, _, arr) => {
        const scheduled = new Date(d.scheduledDate);
        const actual = new Date(d.actualDeliveryDate);
        const diff = (actual - scheduled) / (1000 * 60 * 60); // hours
        return sum + diff / arr?.length;
      }, 0);

    return {
      total,
      pending,
      inTransit,
      delivered,
      failed,
      deliveryRate,
      totalValue,
      avgDeliveryTime: Math.round(avgDeliveryTime * 10) / 10
    };
  };

  const stats = calculateStats();

  const statCards = [
    {
      title: 'Total Deliveries',
      value: stats?.total,
      icon: 'Package',
      color: 'text-foreground',
      bgColor: 'bg-muted/30'
    },
    {
      title: 'Pending',
      value: stats?.pending,
      icon: 'Clock',
      color: 'text-warning',
      bgColor: 'bg-warning/10'
    },
    {
      title: 'In Transit',
      value: stats?.inTransit,
      icon: 'Truck',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    },
    {
      title: 'Delivered',
      value: stats?.delivered,
      icon: 'CheckCircle',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Failed',
      value: stats?.failed,
      icon: 'XCircle',
      color: 'text-error',
      bgColor: 'bg-error/10'
    },
    {
      title: 'Delivery Rate',
      value: `${stats?.deliveryRate}%`,
      icon: 'TrendingUp',
      color: stats?.deliveryRate >= 90 ? 'text-success' : stats?.deliveryRate >= 70 ? 'text-warning' : 'text-error',
      bgColor: stats?.deliveryRate >= 90 ? 'bg-success/10' : stats?.deliveryRate >= 70 ? 'bg-warning/10' : 'bg-error/10'
    },
    {
      title: 'Total Value',
      value: `Rs. ${stats?.totalValue?.toLocaleString()}`,
      icon: 'DollarSign',
      color: 'text-success',
      bgColor: 'bg-success/10'
    },
    {
      title: 'Avg. Delivery Time',
      value: `${stats?.avgDeliveryTime}h`,
      icon: 'Timer',
      color: 'text-primary',
      bgColor: 'bg-primary/10'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
      {statCards?.map((stat, index) => (
        <div
          key={index}
          className={`${stat?.bgColor} border border-border rounded-lg p-4 transition-smooth hover:shadow-elevation-1`}
        >
          <div className="flex items-center justify-between mb-2">
            <div className={`w-8 h-8 ${stat?.bgColor} rounded-lg flex items-center justify-center`}>
              <Icon name={stat?.icon} size={18} className={stat?.color} />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground mb-1">{stat?.value}</p>
            <p className="text-xs text-muted-foreground">{stat?.title}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DeliveryStats;