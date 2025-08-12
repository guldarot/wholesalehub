import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const DeliveryDetails = ({ delivery, onStatusUpdate, onDriverAssign, drivers }) => {
  const [notes, setNotes] = useState('');
  const [proofFile, setProofFile] = useState(null);
  const [showProofUpload, setShowProofUpload] = useState(false);

  if (!delivery) {
    return (
      <div className="bg-card border border-border rounded-lg shadow-elevation-1 h-full flex items-center justify-center">
        <div className="text-center">
          <Icon name="Truck" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a delivery to view details</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'in-transit':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'delivered':
        return 'bg-success/10 text-success border-success/20';
      case 'failed':
        return 'bg-error/10 text-error border-error/20';
      case 'cancelled':
        return 'bg-muted text-muted-foreground border-border';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleStatusUpdate = (newStatus) => {
    onStatusUpdate(delivery?.id, newStatus);
    if (newStatus === 'delivered') {
      setShowProofUpload(true);
    }
  };

  const handleDriverChange = (driverId) => {
    const selectedDriver = drivers?.find(d => d?.value === driverId);
    onDriverAssign(delivery?.id, selectedDriver);
  };

  const handleProofUpload = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      setProofFile(file);
    }
  };

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in-transit', label: 'In Transit' },
    { value: 'delivered', label: 'Delivered' },
    { value: 'failed', label: 'Failed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1 h-full flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Delivery Details</h3>
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(delivery?.status)}`}>
            {delivery?.status}
          </span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Order Information */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Package" size={16} className="mr-2" />
            Order Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Order ID:</span>
              <span className="text-foreground font-medium">{delivery?.orderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Priority:</span>
              <span className={`font-medium ${
                delivery?.priority === 'high' ? 'text-error' :
                delivery?.priority === 'medium' ? 'text-warning' : 'text-success'
              }`}>
                {delivery?.priority}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Weight:</span>
              <span className="text-foreground font-medium">{delivery?.weight} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Value:</span>
              <span className="text-foreground font-medium">Rs. {delivery?.orderValue?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="User" size={16} className="mr-2" />
            Customer Information
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Name:</span>
              <span className="text-foreground font-medium">{delivery?.customerName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Phone:</span>
              <span className="text-foreground font-medium">{delivery?.customerPhone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="text-foreground font-medium">{delivery?.customerEmail}</span>
            </div>
          </div>
        </div>

        {/* Delivery Address */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="MapPin" size={16} className="mr-2" />
            Delivery Address
          </h4>
          <div className="bg-muted/30 p-3 rounded-lg">
            <p className="text-sm text-foreground">{delivery?.address}</p>
            <p className="text-sm text-muted-foreground">{delivery?.city}, Pakistan</p>
            <div className="flex items-center mt-2 space-x-2">
              <Button
                variant="outline"
                size="sm"
                iconName="Navigation"
                iconPosition="left"
                onClick={() => window.open(`https://maps.google.com?q=${delivery?.coordinates?.lat},${delivery?.coordinates?.lng}`, '_blank')}
              >
                Directions
              </Button>
              <Button
                variant="outline"
                size="sm"
                iconName="Phone"
                iconPosition="left"
                onClick={() => window.open(`tel:${delivery?.customerPhone}`)}
              >
                Call
              </Button>
            </div>
          </div>
        </div>

        {/* Schedule Information */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="Calendar" size={16} className="mr-2" />
            Schedule
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Scheduled:</span>
              <span className="text-foreground font-medium">{formatDate(delivery?.scheduledDate)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Time Window:</span>
              <span className="text-foreground font-medium">{delivery?.timeWindow}</span>
            </div>
            {delivery?.actualDeliveryDate && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivered:</span>
                <span className="text-foreground font-medium">{formatDate(delivery?.actualDeliveryDate)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Driver Assignment */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="UserCheck" size={16} className="mr-2" />
            Driver Assignment
          </h4>
          <Select
            options={drivers}
            value={delivery?.driverId}
            onChange={handleDriverChange}
            placeholder="Select driver"
            className="mb-3"
          />
          {delivery?.driverName && (
            <div className="bg-muted/30 p-3 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={18} color="white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{delivery?.driverName}</p>
                  <p className="text-xs text-muted-foreground">{delivery?.driverPhone}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Update */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="RefreshCw" size={16} className="mr-2" />
            Update Status
          </h4>
          <Select
            options={statusOptions}
            value={delivery?.status}
            onChange={handleStatusUpdate}
            placeholder="Update status"
            className="mb-3"
          />
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleStatusUpdate('in-transit')}
              iconName="Truck"
              iconPosition="left"
              disabled={delivery?.status === 'delivered'}
            >
              Start Delivery
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => handleStatusUpdate('delivered')}
              iconName="CheckCircle"
              iconPosition="left"
              disabled={delivery?.status === 'delivered'}
            >
              Mark Delivered
            </Button>
          </div>
        </div>

        {/* Special Instructions */}
        {delivery?.specialInstructions && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Icon name="AlertCircle" size={16} className="mr-2" />
              Special Instructions
            </h4>
            <div className="bg-warning/10 border border-warning/20 p-3 rounded-lg">
              <p className="text-sm text-foreground">{delivery?.specialInstructions}</p>
            </div>
          </div>
        )}

        {/* Proof of Delivery */}
        {(showProofUpload || delivery?.status === 'delivered') && (
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
              <Icon name="Camera" size={16} className="mr-2" />
              Proof of Delivery
            </h4>
            <div className="space-y-3">
              <Input
                type="file"
                accept="image/*"
                onChange={handleProofUpload}
                label="Upload proof photo"
                description="Take a photo of the delivered package"
              />
              {proofFile && (
                <div className="bg-success/10 border border-success/20 p-3 rounded-lg">
                  <p className="text-sm text-success">✓ Proof uploaded: {proofFile?.name}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Delivery Notes */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
            <Icon name="FileText" size={16} className="mr-2" />
            Delivery Notes
          </h4>
          <Input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e?.target?.value)}
            placeholder="Add delivery notes..."
            description="Optional notes about the delivery"
          />
        </div>
      </div>
      {/* Action Buttons */}
      <div className="p-4 border-t border-border">
        <div className="grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            iconName="MessageSquare"
            iconPosition="left"
            onClick={() => window.open(`sms:${delivery?.customerPhone}?body=Your order ${delivery?.orderId} is on the way!`)}
          >
            SMS Customer
          </Button>
          <Button
            variant="outline"
            iconName="Phone"
            iconPosition="left"
            onClick={() => window.open(`tel:${delivery?.customerPhone}`)}
          >
            Call Customer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetails;