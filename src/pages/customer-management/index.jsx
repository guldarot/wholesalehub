import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import CustomerFilters from './components/CustomerFilters';
import CustomerTable from './components/CustomerTable';
import CustomerProfileModal from './components/CustomerProfileModal';
import CustomerCard from './components/CustomerCard';
import CustomerStats from './components/CustomerStats';

import Button from '../../components/ui/Button';

const CustomerManagement = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [selectedCustomers, setSelectedCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock customer data
  useEffect(() => {
    const mockCustomers = [
      {
        id: 1,
        businessName: "Karachi Traders",
        contactPerson: "Ahmed Hassan",
        phone: "+92-321-1234567",
        email: "ahmed@karachitrade.com",
        location: "Karachi",
        customerType: "retailer",
        totalOrders: 45,
        lifetimeValue: 875000,
        lastOrderDate: "2025-01-10",
        status: "active",
        joinDate: "2023-03-15",
        paymentTerms: "Net 30 days"
      },
      {
        id: 2,
        businessName: "Lahore Wholesale Co.",
        contactPerson: "Fatima Khan",
        phone: "+92-322-2345678",
        email: "fatima@lahorewholesale.com",
        location: "Lahore",
        customerType: "distributor",
        totalOrders: 78,
        lifetimeValue: 1250000,
        lastOrderDate: "2025-01-08",
        status: "active",
        joinDate: "2022-11-20",
        paymentTerms: "Net 15 days"
      },
      {
        id: 3,
        businessName: "Islamabad Supplies",
        contactPerson: "Muhammad Ali",
        phone: "+92-323-3456789",
        email: "ali@islamabadsupplies.com",
        location: "Islamabad",
        customerType: "wholesaler",
        totalOrders: 32,
        lifetimeValue: 650000,
        lastOrderDate: "2025-01-05",
        status: "active",
        joinDate: "2023-07-10",
        paymentTerms: "Net 30 days"
      },
      {
        id: 4,
        businessName: "Faisalabad Mills",
        contactPerson: "Sara Ahmed",
        phone: "+92-324-4567890",
        email: "sara@faisalabadmills.com",
        location: "Faisalabad",
        customerType: "manufacturer",
        totalOrders: 156,
        lifetimeValue: 2100000,
        lastOrderDate: "2025-01-12",
        status: "active",
        joinDate: "2022-05-08",
        paymentTerms: "Net 45 days"
      },
      {
        id: 5,
        businessName: "Rawalpindi Distributors",
        contactPerson: "Omar Sheikh",
        phone: "+92-325-5678901",
        email: "omar@rawalpindidist.com",
        location: "Rawalpindi",
        customerType: "distributor",
        totalOrders: 89,
        lifetimeValue: 1450000,
        lastOrderDate: "2024-12-28",
        status: "inactive",
        joinDate: "2023-01-22",
        paymentTerms: "Net 30 days"
      },
      {
        id: 6,
        businessName: "Multan Trading House",
        contactPerson: "Ayesha Malik",
        phone: "+92-326-6789012",
        email: "ayesha@multantrading.com",
        location: "Multan",
        customerType: "retailer",
        totalOrders: 23,
        lifetimeValue: 380000,
        lastOrderDate: "2025-01-03",
        status: "pending",
        joinDate: "2024-09-15",
        paymentTerms: "Net 30 days"
      },
      {
        id: 7,
        businessName: "Peshawar Goods Co.",
        contactPerson: "Hassan Afridi",
        phone: "+92-327-7890123",
        email: "hassan@peshawargods.com",
        location: "Peshawar",
        customerType: "wholesaler",
        totalOrders: 67,
        lifetimeValue: 890000,
        lastOrderDate: "2025-01-07",
        status: "active",
        joinDate: "2023-04-12",
        paymentTerms: "Net 30 days"
      },
      {
        id: 8,
        businessName: "Quetta Enterprises",
        contactPerson: "Bilal Baloch",
        phone: "+92-328-8901234",
        email: "bilal@quettaent.com",
        location: "Quetta",
        customerType: "retailer",
        totalOrders: 41,
        lifetimeValue: 720000,
        lastOrderDate: "2025-01-01",
        status: "active",
        joinDate: "2023-08-30",
        paymentTerms: "Net 30 days"
      }
    ];

    setCustomers(mockCustomers);
    setFilteredCustomers(mockCustomers);
  }, []);

  const handleFiltersChange = (filters) => {
    let filtered = customers;

    if (filters?.search) {
      filtered = filtered?.filter(customer =>
        customer?.businessName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        customer?.contactPerson?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        customer?.email?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    if (filters?.customerType) {
      filtered = filtered?.filter(customer => customer?.customerType === filters?.customerType);
    }

    if (filters?.location) {
      filtered = filtered?.filter(customer => customer?.location?.toLowerCase() === filters?.location?.toLowerCase());
    }

    if (filters?.orderFrequency) {
      // Mock frequency logic based on total orders
      filtered = filtered?.filter(customer => {
        switch (filters?.orderFrequency) {
          case 'daily':
            return customer?.totalOrders > 100;
          case 'weekly':
            return customer?.totalOrders > 50 && customer?.totalOrders <= 100;
          case 'monthly':
            return customer?.totalOrders > 20 && customer?.totalOrders <= 50;
          case 'quarterly':
            return customer?.totalOrders > 10 && customer?.totalOrders <= 20;
          case 'occasional':
            return customer?.totalOrders <= 10;
          default:
            return true;
        }
      });
    }

    if (filters?.valueSegment) {
      filtered = filtered?.filter(customer => {
        switch (filters?.valueSegment) {
          case 'premium':
            return customer?.lifetimeValue > 500000;
          case 'high':
            return customer?.lifetimeValue > 200000 && customer?.lifetimeValue <= 500000;
          case 'medium':
            return customer?.lifetimeValue > 50000 && customer?.lifetimeValue <= 200000;
          case 'standard':
            return customer?.lifetimeValue <= 50000;
          default:
            return true;
        }
      });
    }

    setFilteredCustomers(filtered);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilteredCustomers(customers);
    setCurrentPage(1);
  };

  const handleCustomerSelect = (customer, action) => {
    setSelectedCustomer(customer);
    
    switch (action) {
      case 'view':
        setIsProfileModalOpen(true);
        break;
      case 'order': navigate('/order-management', { state: { customer } });
        break;
      case 'message':
        setIsProfileModalOpen(true);
        // Could set a specific tab for communication
        break;
      default:
        break;
    }
  };

  const handleSelectCustomer = (customerId, isSelected) => {
    if (isSelected) {
      setSelectedCustomers([...selectedCustomers, customerId]);
    } else {
      setSelectedCustomers(selectedCustomers?.filter(id => id !== customerId));
    }
  };

  const handleSelectAll = (isSelected) => {
    if (isSelected) {
      const currentPageCustomers = getCurrentPageCustomers();
      const currentPageIds = currentPageCustomers?.map(customer => customer?.id);
      const newSelected = [...new Set([...selectedCustomers, ...currentPageIds])];
      setSelectedCustomers(newSelected);
    } else {
      const currentPageCustomers = getCurrentPageCustomers();
      const currentPageIds = currentPageCustomers?.map(customer => customer?.id);
      setSelectedCustomers(selectedCustomers?.filter(id => !currentPageIds?.includes(id)));
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk action: ${action} for customers:`, selectedCustomers);
    // Implement bulk actions here
    setSelectedCustomers([]);
  };

  const handleCreateOrder = (customer) => {
    navigate('/order-management', { state: { customer } });
    setIsProfileModalOpen(false);
  };

  const getCurrentPageCustomers = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCustomers?.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredCustomers?.length / itemsPerPage);
  const currentPageCustomers = getCurrentPageCustomers();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Customer Management</h1>
              <p className="text-muted-foreground mt-2">
                Manage your customer relationships and order history
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2 bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  iconName="Table"
                  className="h-8"
                />
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  iconName="Grid3X3"
                  className="h-8"
                />
              </div>
              <Button
                variant="default"
                iconName="UserPlus"
                iconPosition="left"
              >
                Add Customer
              </Button>
            </div>
          </div>

          {/* Statistics */}
          <CustomerStats customers={customers} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Sidebar Filters */}
            <div className={`lg:col-span-3 ${sidebarCollapsed ? 'hidden lg:block' : ''}`}>
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  iconName="Filter"
                  iconPosition="left"
                  className="w-full"
                >
                  {sidebarCollapsed ? 'Show Filters' : 'Hide Filters'}
                </Button>
              </div>
              <CustomerFilters
                onFiltersChange={handleFiltersChange}
                onClearFilters={handleClearFilters}
              />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {/* Mobile Filter Toggle */}
              <div className="lg:hidden mb-4">
                <Button
                  variant="outline"
                  onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                  iconName="Filter"
                  iconPosition="left"
                  className="w-full"
                >
                  {sidebarCollapsed ? 'Show Filters' : 'Hide Filters'}
                </Button>
              </div>

              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  <p className="text-muted-foreground">
                    Showing {currentPageCustomers?.length} of {filteredCustomers?.length} customers
                  </p>
                  {selectedCustomers?.length > 0 && (
                    <span className="text-sm text-primary">
                      {selectedCustomers?.length} selected
                    </span>
                  )}
                </div>
              </div>

              {/* Customer Display */}
              {viewMode === 'table' ? (
                <CustomerTable
                  customers={currentPageCustomers}
                  onCustomerSelect={handleCustomerSelect}
                  onBulkAction={handleBulkAction}
                  selectedCustomers={selectedCustomers}
                  onSelectCustomer={handleSelectCustomer}
                  onSelectAll={handleSelectAll}
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {currentPageCustomers?.map((customer) => (
                    <CustomerCard
                      key={customer?.id}
                      customer={customer}
                      onCustomerSelect={handleCustomerSelect}
                      isSelected={selectedCustomers?.includes(customer?.id)}
                      onSelectCustomer={handleSelectCustomer}
                    />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-8">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      iconName="ChevronLeft"
                      iconPosition="left"
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Page {currentPage} of {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      iconName="ChevronRight"
                      iconPosition="right"
                    >
                      Next
                    </Button>
                  </div>
                  <div className="hidden sm:flex items-center space-x-2">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? 'default' : 'ghost'}
                          size="sm"
                          onClick={() => setCurrentPage(pageNum)}
                          className="w-10 h-10"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      {/* Customer Profile Modal */}
      <CustomerProfileModal
        customer={selectedCustomer}
        isOpen={isProfileModalOpen}
        onClose={() => {
          setIsProfileModalOpen(false);
          setSelectedCustomer(null);
        }}
        onCreateOrder={handleCreateOrder}
      />
      <QuickActionButton />
    </div>
  );
};

export default CustomerManagement;