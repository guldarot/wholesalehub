import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const CustomerProfileModal = ({ customer, isOpen, onClose, onCreateOrder }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [messageText, setMessageText] = useState('');

  if (!isOpen || !customer) return null;

  const orderHistory = [
    {
      id: 'WH-2025-001',
      date: '2025-01-10',
      amount: 125000,
      status: 'delivered',
      items: 15,
      paymentStatus: 'paid'
    },
    {
      id: 'WH-2025-002',
      date: '2025-01-05',
      amount: 89500,
      status: 'processing',
      items: 12,
      paymentStatus: 'pending'
    },
    {
      id: 'WH-2024-156',
      date: '2024-12-28',
      amount: 156000,
      status: 'delivered',
      items: 20,
      paymentStatus: 'paid'
    },
    {
      id: 'WH-2024-145',
      date: '2024-12-15',
      amount: 78000,
      status: 'delivered',
      items: 8,
      paymentStatus: 'paid'
    }
  ];

  const communicationLog = [
    {
      id: 1,
      type: 'email',
      subject: 'Order Confirmation - WH-2025-001',
      date: '2025-01-10',
      status: 'sent'
    },
    {
      id: 2,
      type: 'sms',
      subject: 'Delivery notification for order WH-2025-001',
      date: '2025-01-09',
      status: 'delivered'
    },
    {
      id: 3,
      type: 'call',
      subject: 'Follow-up on payment terms discussion',
      date: '2025-01-08',
      status: 'completed'
    }
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount)?.replace('PKR', 'Rs.');
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'processing':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'cancelled':
        return 'bg-error/10 text-error border-error/20';
      case 'paid':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getCommunicationIcon = (type) => {
    switch (type) {
      case 'email':
        return 'Mail';
      case 'sms':
        return 'MessageSquare';
      case 'call':
        return 'Phone';
      default:
        return 'MessageCircle';
    }
  };

  const handleSendMessage = () => {
    if (messageText?.trim()) {
      console.log('Sending message:', messageText);
      setMessageText('');
      // Add to communication log logic here
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card border border-border rounded-lg shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Building2" size={24} className="text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">{customer?.businessName}</h2>
              <p className="text-muted-foreground">{customer?.contactPerson}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={() => onCreateOrder(customer)}
              iconName="ShoppingCart"
              iconPosition="left"
            >
              Create Order
            </Button>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {[
              { key: 'profile', label: 'Profile', icon: 'User' },
              { key: 'orders', label: 'Order History', icon: 'ShoppingCart' },
              { key: 'communication', label: 'Communication', icon: 'MessageSquare' }
            ]?.map((tab) => (
              <button
                key={tab?.key}
                onClick={() => setActiveTab(tab?.key)}
                className={`flex items-center space-x-2 py-4 border-b-2 transition-smooth ${
                  activeTab === tab?.key
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={18} />
                <span className="font-medium">{tab?.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {activeTab === 'profile' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Building2" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Business Name</p>
                        <p className="text-foreground">{customer?.businessName}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="User" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Contact Person</p>
                        <p className="text-foreground">{customer?.contactPerson}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Phone" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Phone</p>
                        <p className="text-foreground">{customer?.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Mail" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-foreground">{customer?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="MapPin" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Location</p>
                        <p className="text-foreground">{customer?.location}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Business Details</h3>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <Icon name="Tag" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Type</p>
                        <p className="text-foreground capitalize">{customer?.customerType}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="Calendar" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Customer Since</p>
                        <p className="text-foreground">{formatDate(customer?.joinDate || '2023-01-15')}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Icon name="CreditCard" size={18} className="text-muted-foreground" />
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Terms</p>
                        <p className="text-foreground">{customer?.paymentTerms || 'Net 30 days'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics & Addresses */}
              <div className="space-y-6">
                {/* Statistics */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Statistics</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Total Orders</p>
                      <p className="text-2xl font-bold text-foreground">{customer?.totalOrders}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Lifetime Value</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(customer?.lifetimeValue)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Average Order</p>
                      <p className="text-2xl font-bold text-foreground">{formatCurrency(customer?.lifetimeValue / customer?.totalOrders)}</p>
                    </div>
                    <div className="bg-muted/50 rounded-lg p-4">
                      <p className="text-sm text-muted-foreground">Last Order</p>
                      <p className="text-lg font-bold text-foreground">{formatDate(customer?.lastOrderDate)}</p>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-4">Addresses</h3>
                  <div className="space-y-4">
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="MapPin" size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Billing Address</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Shop # 45, Main Market\nGulberg III, Lahore\nPunjab, Pakistan
                      </p>
                    </div>
                    <div className="border border-border rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <Icon name="Truck" size={16} className="text-muted-foreground" />
                        <span className="text-sm font-medium text-foreground">Shipping Address</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Warehouse B-12, Industrial Area\nGulberg III, Lahore\nPunjab, Pakistan
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Order History</h3>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Download"
                  iconPosition="left"
                >
                  Export Orders
                </Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted/50 border-b border-border">
                    <tr>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Order ID</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Date</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Items</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Amount</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Status</th>
                      <th className="text-left p-4 text-sm font-medium text-foreground">Payment</th>
                      <th className="text-center p-4 text-sm font-medium text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orderHistory?.map((order) => (
                      <tr key={order?.id} className="border-b border-border hover:bg-muted/30">
                        <td className="p-4">
                          <span className="font-medium text-foreground">{order?.id}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-muted-foreground">{formatDate(order?.date)}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-foreground">{order?.items} items</span>
                        </td>
                        <td className="p-4">
                          <span className="font-medium text-foreground">{formatCurrency(order?.amount)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order?.status)}`}>
                            {order?.status?.charAt(0)?.toUpperCase() + order?.status?.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order?.paymentStatus)}`}>
                            {order?.paymentStatus?.charAt(0)?.toUpperCase() + order?.paymentStatus?.slice(1)}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Icon name="Eye" size={16} />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Icon name="Download" size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'communication' && (
            <div className="space-y-6">
              {/* Send Message */}
              <div className="bg-muted/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-foreground mb-4">Send Message</h3>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Message content..."
                    value={messageText}
                    onChange={(e) => setMessageText(e?.target?.value)}
                  />
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="default"
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!messageText?.trim()}
                      iconName="Send"
                      iconPosition="left"
                    >
                      Send Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!messageText?.trim()}
                      iconName="MessageSquare"
                      iconPosition="left"
                    >
                      Send SMS
                    </Button>
                  </div>
                </div>
              </div>

              {/* Communication History */}
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">Communication History</h3>
                <div className="space-y-3">
                  {communicationLog?.map((comm) => (
                    <div key={comm?.id} className="flex items-start space-x-4 p-4 border border-border rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name={getCommunicationIcon(comm?.type)} size={18} className="text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-medium text-foreground">{comm?.subject}</p>
                          <span className="text-sm text-muted-foreground">{formatDate(comm?.date)}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-muted-foreground capitalize">{comm?.type}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className={`text-sm ${comm?.status === 'sent' || comm?.status === 'delivered' || comm?.status === 'completed' ? 'text-success' : 'text-warning'}`}>
                            {comm?.status?.charAt(0)?.toUpperCase() + comm?.status?.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerProfileModal;