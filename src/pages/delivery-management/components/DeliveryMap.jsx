import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DeliveryMap = ({ deliveries, selectedDelivery, onDeliverySelect, optimizedRoute }) => {
  const [mapView, setMapView] = useState('satellite');
  const [showRoute, setShowRoute] = useState(true);
  const [routeOptimized, setRouteOptimized] = useState(false);

  // Mock coordinates for Karachi, Pakistan
  const defaultCenter = { lat: 24.8607, lng: 67.0011 };

  const getStatusMarkerColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#F59E0B'; // warning
      case 'in-transit':
        return '#2563EB'; // primary
      case 'delivered':
        return '#10B981'; // success
      case 'failed':
        return '#EF4444'; // error
      default:
        return '#64748B'; // muted
    }
  };

  const handleOptimizeRoute = () => {
    setRouteOptimized(true);
    // Simulate route optimization
    setTimeout(() => {
      setRouteOptimized(false);
    }, 2000);
  };

  const generateMapUrl = () => {
    const baseUrl = "https://www.google.com/maps/embed/v1/view";
    const apiKey = "YOUR_API_KEY"; // This would be from environment variables
    const center = selectedDelivery 
      ? `${selectedDelivery?.coordinates?.lat},${selectedDelivery?.coordinates?.lng}`
      : `${defaultCenter?.lat},${defaultCenter?.lng}`;
    
    return `https://www.google.com/maps?q=${center}&z=12&output=embed`;
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Delivery Map</h3>
            <p className="text-sm text-muted-foreground">
              {deliveries?.length} locations • Route optimization available
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={showRoute ? "default" : "outline"}
              size="sm"
              onClick={() => setShowRoute(!showRoute)}
              iconName="Route"
              iconPosition="left"
            >
              Route
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleOptimizeRoute}
              loading={routeOptimized}
              iconName="Zap"
              iconPosition="left"
            >
              Optimize
            </Button>
          </div>
        </div>
      </div>
      <div className="flex-1 relative">
        {/* Map Container */}
        <div className="absolute inset-0">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Delivery Locations Map"
            referrerPolicy="no-referrer-when-downgrade"
            src={generateMapUrl()}
            className="rounded-b-lg"
          />
        </div>

        {/* Map Overlay Controls */}
        <div className="absolute top-4 right-4 flex flex-col space-y-2">
          <div className="bg-card border border-border rounded-lg shadow-elevation-2 p-2">
            <div className="flex flex-col space-y-1">
              <Button
                variant={mapView === 'roadmap' ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapView('roadmap')}
                className="justify-start"
              >
                <Icon name="Map" size={16} className="mr-2" />
                Road
              </Button>
              <Button
                variant={mapView === 'satellite' ? "default" : "ghost"}
                size="sm"
                onClick={() => setMapView('satellite')}
                className="justify-start"
              >
                <Icon name="Satellite" size={16} className="mr-2" />
                Satellite
              </Button>
            </div>
          </div>
        </div>

        {/* Delivery Markers Legend */}
        <div className="absolute bottom-4 left-4 bg-card border border-border rounded-lg shadow-elevation-2 p-3">
          <h4 className="text-sm font-medium text-foreground mb-2">Delivery Status</h4>
          <div className="space-y-2">
            {[
              { status: 'Pending', color: '#F59E0B', count: deliveries?.filter(d => d?.status === 'pending')?.length },
              { status: 'In Transit', color: '#2563EB', count: deliveries?.filter(d => d?.status === 'in-transit')?.length },
              { status: 'Delivered', color: '#10B981', count: deliveries?.filter(d => d?.status === 'delivered')?.length },
              { status: 'Failed', color: '#EF4444', count: deliveries?.filter(d => d?.status === 'failed')?.length }
            ]?.map((item) => (
              <div key={item?.status} className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item?.color }}
                />
                <span className="text-xs text-foreground">{item?.status}</span>
                <span className="text-xs text-muted-foreground">({item?.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Route Information */}
        {showRoute && optimizedRoute && (
          <div className="absolute top-4 left-4 bg-card border border-border rounded-lg shadow-elevation-2 p-3 max-w-64">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Route" size={16} className="text-primary" />
              <h4 className="text-sm font-medium text-foreground">Optimized Route</h4>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Distance:</span>
                <span className="text-foreground font-medium">{optimizedRoute?.totalDistance} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Time:</span>
                <span className="text-foreground font-medium">{optimizedRoute?.estimatedTime}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Fuel Cost:</span>
                <span className="text-foreground font-medium">Rs. {optimizedRoute?.fuelCost?.toLocaleString()}</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected Delivery Info */}
        {selectedDelivery && (
          <div className="absolute bottom-4 right-4 bg-card border border-border rounded-lg shadow-elevation-2 p-3 max-w-72">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-foreground">Selected Delivery</h4>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDeliverySelect(null)}
                className="h-6 w-6"
              >
                <Icon name="X" size={14} />
              </Button>
            </div>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Order:</span>
                <span className="text-foreground font-medium">{selectedDelivery?.orderId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Customer:</span>
                <span className="text-foreground font-medium">{selectedDelivery?.customerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Driver:</span>
                <span className="text-foreground font-medium">{selectedDelivery?.driverName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status:</span>
                <span className={`font-medium ${
                  selectedDelivery?.status === 'delivered' ? 'text-success' :
                  selectedDelivery?.status === 'in-transit' ? 'text-primary' :
                  selectedDelivery?.status === 'failed' ? 'text-error' : 'text-warning'
                }`}>
                  {selectedDelivery?.status}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryMap;