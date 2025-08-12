import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import DeliveryTable from './components/DeliveryTable';
import DeliveryMap from './components/DeliveryMap';
import DeliveryDetails from './components/DeliveryDetails';
import DeliveryFilters from './components/DeliveryFilters';
import DeliveryStats from './components/DeliveryStats';

const DeliveryManagement = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [selectedDelivery, setSelectedDelivery] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for deliveries
  const mockDeliveries = [
    {
      id: 1,
      orderId: 'WH-2025-001',
      customerName: 'Karachi Traders',
      customerPhone: '+92-300-1234567',
      customerEmail: 'info@karachitrade.com',
      address: 'Shop 15, Saddar Bazaar, Karachi',
      city: 'Karachi',
      coordinates: { lat: 24.8607, lng: 67.0011 },
      scheduledDate: '2025-01-12T10:00:00',
      timeWindow: '10:00 AM - 12:00 PM',
      status: 'pending',
      priority: 'high',
      driverId: 'driver-1',
      driverName: 'Ahmed Ali',
      driverPhone: '+92-301-9876543',
      weight: 25.5,
      orderValue: 45000,
      specialInstructions: 'Handle with care - fragile items included'
    },
    {
      id: 2,
      orderId: 'WH-2025-002',
      customerName: 'Lahore Wholesale Co.',
      customerPhone: '+92-300-2345678',
      customerEmail: 'orders@lahorewholesale.com',
      address: 'Block A, Johar Town, Lahore',
      city: 'Lahore',
      coordinates: { lat: 31.5204, lng: 74.3587 },
      scheduledDate: '2025-01-12T14:00:00',
      timeWindow: '2:00 PM - 4:00 PM',
      status: 'in-transit',
      priority: 'medium',
      driverId: 'driver-2',
      driverName: 'Muhammad Hassan',
      driverPhone: '+92-302-8765432',
      weight: 18.2,
      orderValue: 32000,
      specialInstructions: null
    },
    {
      id: 3,
      orderId: 'WH-2025-003',
      customerName: 'Islamabad Supplies',
      customerPhone: '+92-300-3456789',
      customerEmail: 'contact@islamabadsupplies.com',
      address: 'F-8 Markaz, Islamabad',
      city: 'Islamabad',
      coordinates: { lat: 33.6844, lng: 73.0479 },
      scheduledDate: '2025-01-11T16:00:00',
      timeWindow: '4:00 PM - 6:00 PM',
      status: 'delivered',
      priority: 'low',
      driverId: 'driver-3',
      driverName: 'Usman Khan',
      driverPhone: '+92-303-7654321',
      weight: 12.8,
      orderValue: 28500,
      actualDeliveryDate: '2025-01-11T17:30:00',
      specialInstructions: null
    },
    {
      id: 4,
      orderId: 'WH-2025-004',
      customerName: 'Faisalabad Mart',
      customerPhone: '+92-300-4567890',
      customerEmail: 'info@faisalabadmart.com',
      address: 'D-Ground, Faisalabad',
      city: 'Faisalabad',
      coordinates: { lat: 31.4504, lng: 73.1350 },
      scheduledDate: '2025-01-12T11:00:00',
      timeWindow: '11:00 AM - 1:00 PM',
      status: 'failed',
      priority: 'high',
      driverId: 'driver-1',
      driverName: 'Ahmed Ali',
      driverPhone: '+92-301-9876543',
      weight: 35.0,
      orderValue: 52000,
      specialInstructions: 'Customer not available - reschedule required'
    },
    {
      id: 5,
      orderId: 'WH-2025-005',
      customerName: 'Multan Trading House',
      customerPhone: '+92-300-5678901',
      customerEmail: 'orders@multantrading.com',
      address: 'Cantt Area, Multan',
      city: 'Multan',
      coordinates: { lat: 30.1575, lng: 71.5249 },
      scheduledDate: '2025-01-13T09:00:00',
      timeWindow: '9:00 AM - 11:00 AM',
      status: 'pending',
      priority: 'medium',
      driverId: 'driver-4',
      driverName: 'Ali Raza',
      driverPhone: '+92-304-6543210',
      weight: 22.3,
      orderValue: 38000,
      specialInstructions: 'Call before delivery'
    },
    {
      id: 6,
      orderId: 'WH-2025-006',
      customerName: 'Peshawar Distributors',
      customerPhone: '+92-300-6789012',
      customerEmail: 'info@peshawardist.com',
      address: 'University Road, Peshawar',
      city: 'Peshawar',
      coordinates: { lat: 34.0151, lng: 71.5249 },
      scheduledDate: '2025-01-12T15:00:00',
      timeWindow: '3:00 PM - 5:00 PM',
      status: 'in-transit',
      priority: 'high',
      driverId: 'driver-2',
      driverName: 'Muhammad Hassan',
      driverPhone: '+92-302-8765432',
      weight: 28.7,
      orderValue: 41500,
      specialInstructions: 'Delivery to back entrance'
    }
  ];

  // Mock drivers data
  const drivers = [
    { value: 'driver-1', label: 'Ahmed Ali' },
    { value: 'driver-2', label: 'Muhammad Hassan' },
    { value: 'driver-3', label: 'Usman Khan' },
    { value: 'driver-4', label: 'Ali Raza' },
    { value: 'driver-5', label: 'Tariq Mahmood' }
  ];

  // Mock optimized route data
  const optimizedRoute = {
    totalDistance: 145.2,
    estimatedTime: '4h 30m',
    fuelCost: 2850
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDeliveries(mockDeliveries);
      setFilteredDeliveries(mockDeliveries);
      setLoading(false);
    }, 1000);
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = [...deliveries];

    // Apply search filter
    if (filters?.search) {
      filtered = filtered?.filter(delivery =>
        delivery?.orderId?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        delivery?.customerName?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
        delivery?.address?.toLowerCase()?.includes(filters?.search?.toLowerCase())
      );
    }

    // Apply status filter
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(delivery => delivery?.status === filters?.status);
    }

    // Apply driver filter
    if (filters?.driver !== 'all') {
      filtered = filtered?.filter(delivery => delivery?.driverId === filters?.driver);
    }

    // Apply priority filter
    if (filters?.priority !== 'all') {
      filtered = filtered?.filter(delivery => delivery?.priority === filters?.priority);
    }

    // Apply date range filter
    if (filters?.dateRange === 'today') {
      const today = new Date()?.toDateString();
      filtered = filtered?.filter(delivery => 
        new Date(delivery.scheduledDate)?.toDateString() === today
      );
    } else if (filters?.dateRange === 'tomorrow') {
      const tomorrow = new Date();
      tomorrow?.setDate(tomorrow?.getDate() + 1);
      filtered = filtered?.filter(delivery => 
        new Date(delivery.scheduledDate)?.toDateString() === tomorrow?.toDateString()
      );
    }

    setFilteredDeliveries(filtered);
  };

  const handleDeliverySelect = (delivery) => {
    setSelectedDelivery(delivery);
  };

  const handleStatusUpdate = (deliveryId, newStatus) => {
    const updatedDeliveries = deliveries?.map(delivery => {
      if (delivery?.id === deliveryId) {
        const updated = { ...delivery, status: newStatus };
        if (newStatus === 'delivered') {
          updated.actualDeliveryDate = new Date()?.toISOString();
        }
        return updated;
      }
      return delivery;
    });

    setDeliveries(updatedDeliveries);
    setFilteredDeliveries(updatedDeliveries);

    // Update selected delivery if it's the one being updated
    if (selectedDelivery && selectedDelivery?.id === deliveryId) {
      const updatedSelected = updatedDeliveries?.find(d => d?.id === deliveryId);
      setSelectedDelivery(updatedSelected);
    }
  };

  const handleDriverAssign = (deliveryId, driver) => {
    const updatedDeliveries = deliveries?.map(delivery => {
      if (delivery?.id === deliveryId) {
        return {
          ...delivery,
          driverId: driver?.value,
          driverName: driver?.label,
          driverPhone: '+92-300-0000000' // Mock phone number
        };
      }
      return delivery;
    });

    setDeliveries(updatedDeliveries);
    setFilteredDeliveries(updatedDeliveries);

    if (selectedDelivery && selectedDelivery?.id === deliveryId) {
      const updatedSelected = updatedDeliveries?.find(d => d?.id === deliveryId);
      setSelectedDelivery(updatedSelected);
    }
  };

  const handleRouteOptimize = () => {
    // Simulate route optimization
    console.log('Optimizing delivery routes...');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading delivery management...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumb />
          
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Delivery Management</h1>
            <p className="text-muted-foreground mt-2">
              Coordinate logistics operations with route optimization and real-time tracking
            </p>
          </div>

          {/* Delivery Statistics */}
          <DeliveryStats deliveries={filteredDeliveries} />

          {/* Filters */}
          <DeliveryFilters
            onFilterChange={handleFilterChange}
            onRouteOptimize={handleRouteOptimize}
            drivers={drivers}
          />

          {/* Main Content - Three Panel Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Delivery Table - Left Panel (5 columns) */}
            <div className="lg:col-span-5">
              <DeliveryTable
                deliveries={filteredDeliveries}
                onDeliverySelect={handleDeliverySelect}
                selectedDelivery={selectedDelivery}
                onStatusUpdate={handleStatusUpdate}
              />
            </div>

            {/* Map View - Center Panel (4 columns) */}
            <div className="lg:col-span-4 h-96 lg:h-auto">
              <DeliveryMap
                deliveries={filteredDeliveries}
                selectedDelivery={selectedDelivery}
                onDeliverySelect={handleDeliverySelect}
                optimizedRoute={optimizedRoute}
              />
            </div>

            {/* Delivery Details - Right Panel (3 columns) */}
            <div className="lg:col-span-3 h-96 lg:h-auto">
              <DeliveryDetails
                delivery={selectedDelivery}
                onStatusUpdate={handleStatusUpdate}
                onDriverAssign={handleDriverAssign}
                drivers={drivers}
              />
            </div>
          </div>
        </div>
      </div>
      <QuickActionButton />
    </div>
  );
};

export default DeliveryManagement;