import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const QuickActionButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const getContextualActions = () => {
    switch (location?.pathname) {
      case '/dashboard':
        return [
          { label: 'Add Product', icon: 'Plus', action: () => navigate('/inventory-management') },
          { label: 'New Order', icon: 'ShoppingCart', action: () => navigate('/order-management') },
          { label: 'Add Customer', icon: 'UserPlus', action: () => navigate('/customer-management') },
        ];
      case '/inventory-management':
        return [
          { label: 'Add Product', icon: 'Plus', action: () => console.log('Add Product') },
          { label: 'Import Inventory', icon: 'Upload', action: () => console.log('Import Inventory') },
          { label: 'Stock Alert', icon: 'AlertTriangle', action: () => console.log('Stock Alert') },
        ];
      case '/order-management':
        return [
          { label: 'New Order', icon: 'Plus', action: () => console.log('New Order') },
          { label: 'Bulk Import', icon: 'Upload', action: () => console.log('Bulk Import') },
          { label: 'Export Orders', icon: 'Download', action: () => console.log('Export Orders') },
        ];
      case '/customer-management':
        return [
          { label: 'Add Customer', icon: 'UserPlus', action: () => console.log('Add Customer') },
          { label: 'Import Customers', icon: 'Upload', action: () => console.log('Import Customers') },
          { label: 'Send Message', icon: 'MessageSquare', action: () => console.log('Send Message') },
        ];
      case '/delivery-management':
        return [
          { label: 'Schedule Delivery', icon: 'Plus', action: () => console.log('Schedule Delivery') },
          { label: 'Track Shipment', icon: 'MapPin', action: () => console.log('Track Shipment') },
          { label: 'Update Status', icon: 'RefreshCw', action: () => console.log('Update Status') },
        ];
      default:
        return [
          { label: 'Quick Action', icon: 'Plus', action: () => console.log('Quick Action') },
        ];
    }
  };

  const actions = getContextualActions();
  const primaryAction = actions?.[0];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleActionClick = (action) => {
    action?.action();
    setIsOpen(false);
  };

  // Don't show on login page or desktop
  if (location?.pathname === '/login') {
    return null;
  }

  return (
    <>
      {/* Mobile and Tablet Only */}
      <div className="fixed bottom-6 right-6 z-40 md:hidden">
        {/* Action Menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 mb-2 bg-popover border border-border rounded-lg shadow-elevation-3 min-w-48">
            <div className="py-2">
              {actions?.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleActionClick(action)}
                  className="w-full px-4 py-3 text-left text-sm text-foreground hover:bg-muted flex items-center space-x-3 transition-smooth"
                >
                  <Icon name={action?.icon} size={18} />
                  <span>{action?.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main FAB */}
        <Button
          onClick={actions?.length === 1 ? () => handleActionClick(primaryAction) : toggleMenu}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-elevation-3 transition-smooth"
          size="icon"
        >
          <Icon 
            name={actions?.length === 1 ? primaryAction?.icon : (isOpen ? "X" : "Plus")} 
            size={24} 
          />
        </Button>
      </div>
      {/* Overlay for mobile menu */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default QuickActionButton;