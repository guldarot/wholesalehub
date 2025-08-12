import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationCenter = ({ isOpen, onClose, notifications: externalNotifications }) => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Low Stock Alert',
      message: 'Product ABC123 is running low (5 units remaining)',
      time: '5 min ago',
      type: 'warning',
      unread: true,
      category: 'inventory',
      actionUrl: '/inventory-management'
    },
    {
      id: 2,
      title: 'New Order Received',
      message: 'Order #WH-2025-001 from Karachi Traders',
      time: '15 min ago',
      type: 'success',
      unread: true,
      category: 'orders',
      actionUrl: '/order-management'
    },
    {
      id: 3,
      title: 'Delivery Completed',
      message: 'Shipment DEL-456 delivered successfully',
      time: '1 hour ago',
      type: 'info',
      unread: false,
      category: 'delivery',
      actionUrl: '/delivery-management'
    },
    {
      id: 4,
      title: 'Payment Received',
      message: 'Payment of PKR 45,000 received from ABC Corp',
      time: '2 hours ago',
      type: 'success',
      unread: false,
      category: 'orders',
      actionUrl: '/order-management'
    },
    {
      id: 5,
      title: 'Customer Inquiry',
      message: 'New message from Lahore Wholesale Co.',
      time: '3 hours ago',
      type: 'info',
      unread: true,
      category: 'customers',
      actionUrl: '/customer-management'
    }
  ]);

  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (externalNotifications) {
      setNotifications(externalNotifications);
    }
  }, [externalNotifications]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev?.map(notification =>
        notification?.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev?.map(notification => ({ ...notification, unread: false }))
    );
  };

  const deleteNotification = (notificationId) => {
    setNotifications(prev =>
      prev?.filter(notification => notification?.id !== notificationId)
    );
  };

  const getFilteredNotifications = () => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications?.filter(n => n?.unread);
    return notifications?.filter(n => n?.category === filter);
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'warning':
        return 'AlertTriangle';
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      default:
        return 'Info';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'warning':
        return 'text-warning';
      case 'success':
        return 'text-success';
      case 'error':
        return 'text-error';
      default:
        return 'text-primary';
    }
  };

  const filteredNotifications = getFilteredNotifications();
  const unreadCount = notifications?.filter(n => n?.unread)?.length;

  if (!isOpen) return null;

  return (
    <div className="absolute right-0 mt-2 w-96 bg-popover border border-border rounded-lg shadow-elevation-3 z-50 max-h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>
      </div>
      {/* Filter Tabs */}
      <div className="p-4 border-b border-border">
        <div className="flex space-x-1 bg-muted rounded-lg p-1">
          {[
            { key: 'all', label: 'All' },
            { key: 'unread', label: 'Unread' },
            { key: 'inventory', label: 'Inventory' },
            { key: 'orders', label: 'Orders' },
            { key: 'delivery', label: 'Delivery' }
          ]?.map((tab) => (
            <button
              key={tab?.key}
              onClick={() => setFilter(tab?.key)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-smooth ${
                filter === tab?.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab?.label}
            </button>
          ))}
        </div>
      </div>
      {/* Notifications List */}
      <div className="flex-1 overflow-y-auto">
        {filteredNotifications?.length === 0 ? (
          <div className="p-8 text-center">
            <Icon name="Bell" size={48} className="mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications found</p>
          </div>
        ) : (
          filteredNotifications?.map((notification) => (
            <div
              key={notification?.id}
              className={`p-4 border-b border-border hover:bg-muted/50 cursor-pointer transition-smooth ${
                notification?.unread ? 'bg-muted/30' : ''
              }`}
              onClick={() => markAsRead(notification?.id)}
            >
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${getNotificationColor(notification?.type)}`}>
                  <Icon name={getNotificationIcon(notification?.type)} size={18} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${
                        notification?.unread ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {notification?.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification?.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-2">
                        {notification?.time}
                      </p>
                    </div>
                    <div className="flex items-center space-x-1 ml-2">
                      {notification?.unread && (
                        <div className="w-2 h-2 bg-primary rounded-full" />
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e?.stopPropagation();
                          deleteNotification(notification?.id);
                        }}
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground"
                      >
                        <Icon name="Trash2" size={12} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Footer */}
      {filteredNotifications?.length > 0 && (
        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full">
            View All Notifications
          </Button>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;