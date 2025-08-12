import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const InventoryAlertsPanel = ({ alerts, onViewAll }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'low_stock':
        return 'AlertTriangle';
      case 'out_of_stock':
        return 'XCircle';
      case 'reorder':
        return 'RefreshCw';
      default:
        return 'Info';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'low_stock':
        return 'text-warning';
      case 'out_of_stock':
        return 'text-error';
      case 'reorder':
        return 'text-primary';
      default:
        return 'text-muted-foreground';
    }
  };

  const getAlertBgColor = (type) => {
    switch (type) {
      case 'low_stock':
        return 'bg-warning/10';
      case 'out_of_stock':
        return 'bg-error/10';
      case 'reorder':
        return 'bg-primary/10';
      default:
        return 'bg-muted/50';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-elevation-1">
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Inventory Alerts</h3>
          <Button variant="outline" size="sm" onClick={onViewAll}>
            View All
          </Button>
        </div>
      </div>
      <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
        {alerts?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="CheckCircle" size={48} className="mx-auto text-success mb-4" />
            <p className="text-muted-foreground">All inventory levels are healthy</p>
          </div>
        ) : (
          alerts?.map((alert) => (
            <div key={alert?.id} className={`p-4 rounded-lg border ${getAlertBgColor(alert?.type)} border-border`}>
              <div className="flex items-start space-x-3">
                <div className={`mt-1 ${getAlertColor(alert?.type)}`}>
                  <Icon name={getAlertIcon(alert?.type)} size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-foreground">{alert?.product}</h4>
                    <span className="text-xs text-muted-foreground">{alert?.sku}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{alert?.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">
                      Current Stock: <span className="font-medium">{alert?.currentStock}</span>
                    </span>
                    {alert?.suggestedAction && (
                      <Button variant="ghost" size="sm" className="text-xs h-6">
                        {alert?.suggestedAction}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryAlertsPanel;