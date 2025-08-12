import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const Breadcrumb = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathMap = {
    '/dashboard': 'Dashboard',
    '/inventory-management': 'Inventory Management',
    '/order-management': 'Order Management',
    '/customer-management': 'Customer Management',
    '/delivery-management': 'Delivery Management',
  };

  const generateBreadcrumbs = () => {
    const pathSegments = location?.pathname?.split('/')?.filter(segment => segment);
    const breadcrumbs = [{ label: 'Dashboard', path: '/dashboard' }];

    if (location?.pathname !== '/dashboard') {
      const currentPath = location?.pathname;
      const currentLabel = pathMap?.[currentPath];
      
      if (currentLabel) {
        breadcrumbs?.push({ label: currentLabel, path: currentPath });
      }
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  const handleBreadcrumbClick = (path) => {
    navigate(path);
  };

  if (location?.pathname === '/login') {
    return null;
  }

  return (
    <nav className="flex items-center space-x-2 text-sm text-muted-foreground py-3">
      {breadcrumbs?.map((breadcrumb, index) => (
        <div key={breadcrumb?.path} className="flex items-center space-x-2">
          {index > 0 && (
            <Icon name="ChevronRight" size={16} className="text-muted-foreground" />
          )}
          {index === breadcrumbs?.length - 1 ? (
            <span className="text-foreground font-medium">{breadcrumb?.label}</span>
          ) : (
            <button
              onClick={() => handleBreadcrumbClick(breadcrumb?.path)}
              className="hover:text-foreground transition-smooth"
            >
              {breadcrumb?.label}
            </button>
          )}
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;