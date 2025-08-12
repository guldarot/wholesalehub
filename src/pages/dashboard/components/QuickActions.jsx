import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/ui/Button';

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      label: 'Create New Order',
      icon: 'Plus',
      variant: 'default',
      action: () => navigate('/order-management'),
      description: 'Start a new wholesale order'
    },
    {
      label: 'Add Inventory',
      icon: 'Package',
      variant: 'outline',
      action: () => navigate('/inventory-management'),
      description: 'Add new products to inventory'
    },
    {
      label: 'View Customers',
      icon: 'Users',
      variant: 'outline',
      action: () => navigate('/customer-management'),
      description: 'Manage customer relationships'
    },
    {
      label: 'Track Deliveries',
      icon: 'Truck',
      variant: 'outline',
      action: () => navigate('/delivery-management'),
      description: 'Monitor delivery status'
    }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">Quick Actions</h3>
        <p className="text-sm text-muted-foreground mt-1">Frequently used operations</p>
      </div>
      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {actions?.map((action, index) => (
            <div key={index} className="group">
              <Button
                variant={action?.variant}
                onClick={action?.action}
                iconName={action?.icon}
                iconPosition="left"
                fullWidth
                className="h-auto p-4 flex-col space-y-2 group-hover:shadow-elevation-2 transition-smooth"
              >
                <span className="font-medium">{action?.label}</span>
                <span className="text-xs text-muted-foreground text-center leading-tight">
                  {action?.description}
                </span>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuickActions;