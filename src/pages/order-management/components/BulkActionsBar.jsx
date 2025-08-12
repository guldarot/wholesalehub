import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedOrders, onBulkAction, onClearSelection }) => {
  const [bulkAction, setBulkAction] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const bulkActionOptions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'update-status', label: 'Update Status' },
    { value: 'export', label: 'Export Selected' },
    { value: 'print-invoices', label: 'Print Invoices' },
    { value: 'send-notifications', label: 'Send Notifications' },
    { value: 'delete', label: 'Delete Orders' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Mark as Pending' },
    { value: 'processing', label: 'Mark as Processing' },
    { value: 'shipped', label: 'Mark as Shipped' },
    { value: 'delivered', label: 'Mark as Delivered' },
    { value: 'cancelled', label: 'Mark as Cancelled' }
  ];

  if (selectedOrders?.length === 0) {
    return null;
  }

  const handleBulkAction = (action, value = null) => {
    onBulkAction(action, selectedOrders, value);
    setBulkAction('');
    setShowConfirmation(false);
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'update-status':
        return 'RefreshCw';
      case 'export':
        return 'Download';
      case 'print-invoices':
        return 'Printer';
      case 'send-notifications':
        return 'Mail';
      case 'delete':
        return 'Trash2';
      default:
        return 'Settings';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'delete':
        return 'text-error hover:bg-error/10';
      case 'update-status':
        return 'text-primary hover:bg-primary/10';
      case 'export':
        return 'text-accent hover:bg-accent/10';
      default:
        return 'text-foreground hover:bg-muted';
    }
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="font-medium text-foreground">
              {selectedOrders?.length} order{selectedOrders?.length !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Select
              placeholder="Choose action..."
              options={bulkActionOptions}
              value={bulkAction}
              onChange={setBulkAction}
              className="min-w-48"
            />

            {bulkAction && (
              <Button
                onClick={() => {
                  if (bulkAction === 'delete') {
                    setShowConfirmation(true);
                  } else if (bulkAction === 'update-status') {
                    // Show status selection
                    return;
                  } else {
                    handleBulkAction(bulkAction);
                  }
                }}
                iconName={getActionIcon(bulkAction)}
                iconPosition="left"
                className={getActionColor(bulkAction)}
                size="sm"
              >
                Apply
              </Button>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          onClick={onClearSelection}
          iconName="X"
          size="sm"
        >
          Clear Selection
        </Button>
      </div>
      {/* Status Update Options */}
      {bulkAction === 'update-status' && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Update status to:</span>
            <div className="flex items-center space-x-2">
              {statusOptions?.map((status) => (
                <Button
                  key={status?.value}
                  variant="outline"
                  size="sm"
                  onClick={() => handleBulkAction('update-status', status?.value)}
                  className="text-xs"
                >
                  {status?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="mt-4 pt-4 border-t border-primary/20">
          <div className="flex items-center justify-between p-3 bg-error/10 border border-error/20 rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="AlertTriangle" size={20} className="text-error" />
              <span className="text-sm text-error font-medium">
                Are you sure you want to delete {selectedOrders?.length} order{selectedOrders?.length !== 1 ? 's' : ''}?
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleBulkAction('delete')}
                iconName="Trash2"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {/* Quick Actions */}
      <div className="mt-4 pt-4 border-t border-primary/20">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Quick actions:</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction('export')}
            iconName="Download"
            className="text-xs"
          >
            Export to CSV
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction('print-invoices')}
            iconName="Printer"
            className="text-xs"
          >
            Print All Invoices
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleBulkAction('send-notifications')}
            iconName="Mail"
            className="text-xs"
          >
            Notify Customers
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;