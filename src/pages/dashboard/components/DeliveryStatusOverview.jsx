import React from 'react';
import Icon from '../../../components/AppIcon';

const DeliveryStatusOverview = ({ deliveries }) => {
  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'CheckCircle';
      case 'in_transit':
        return 'Truck';
      case 'pending':
        return 'Clock';
      case 'delayed':
        return 'AlertTriangle';
      default:
        return 'Package';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'text-success';
      case 'in_transit':
        return 'text-primary';
      case 'pending':
        return 'text-warning';
      case 'delayed':
        return 'text-error';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusBgColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-success/10';
      case 'in_transit':
        return 'bg-primary/10';
      case 'pending':
        return 'bg-warning/10';
      case 'delayed':
        return 'bg-error/10';
      default:
        return 'bg-muted/50';
    }
  };

  const statusCounts = deliveries?.reduce((acc, delivery) => {
    const status = delivery?.status?.toLowerCase();
    acc[status] = (acc?.[status] || 0) + 1;
    return acc;
  }, {});

  const statusItems = [
    { key: 'delivered', label: 'Delivered', count: statusCounts?.delivered || 0 },
    { key: 'in_transit', label: 'In Transit', count: statusCounts?.in_transit || 0 },
    { key: 'pending', label: 'Pending', count: statusCounts?.pending || 0 },
    { key: 'delayed', label: 'Delayed', count: statusCounts?.delayed || 0 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Delivery Status</h3>
      </div>
      <div className="p-6">
        {/* Status Summary */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {statusItems?.map((item) => (
            <div key={item?.key} className={`p-4 rounded-lg ${getStatusBgColor(item?.key)}`}>
              <div className="flex items-center space-x-3">
                <div className={getStatusColor(item?.key)}>
                  <Icon name={getStatusIcon(item?.key)} size={20} />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item?.label}</p>
                  <p className="text-xl font-bold text-foreground">{item?.count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Deliveries */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground mb-3">Recent Updates</h4>
          {deliveries?.slice(0, 5)?.map((delivery) => (
            <div key={delivery?.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
              <div className={getStatusColor(delivery?.status)}>
                <Icon name={getStatusIcon(delivery?.status)} size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {delivery?.trackingId}
                </p>
                <p className="text-xs text-muted-foreground">
                  {delivery?.destination} • {delivery?.estimatedTime}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusBgColor(delivery?.status)} ${getStatusColor(delivery?.status)}`}>
                {delivery?.status?.replace('_', ' ')}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeliveryStatusOverview;