import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';

const BulkActionsBar = ({ selectedCount, onClearSelection, onBulkAction }) => {
  const [selectedAction, setSelectedAction] = useState('');

  const bulkActions = [
    { value: '', label: 'Select bulk action...' },
    { value: 'export', label: 'Export Selected' },
    { value: 'duplicate', label: 'Duplicate Products' },
    { value: 'update-category', label: 'Update Category' },
    { value: 'update-supplier', label: 'Update Supplier' },
    { value: 'adjust-prices', label: 'Adjust Prices' },
    { value: 'set-reorder-level', label: 'Set Reorder Level' },
    { value: 'mark-discontinued', label: 'Mark as Discontinued' },
    { value: 'delete', label: 'Delete Products' }
  ];

  const handleActionExecute = () => {
    if (selectedAction) {
      onBulkAction(selectedAction);
      setSelectedAction('');
    }
  };

  if (selectedCount === 0) return null;

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckSquare" size={20} className="text-primary" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} {selectedCount === 1 ? 'product' : 'products'} selected
            </span>
          </div>
          
          <div className="flex items-center space-x-3">
            <Select
              options={bulkActions}
              value={selectedAction}
              onChange={setSelectedAction}
              placeholder="Select action..."
              className="min-w-48"
            />
            
            <Button
              variant="default"
              size="sm"
              onClick={handleActionExecute}
              disabled={!selectedAction}
              iconName="Play"
              iconPosition="left"
              iconSize={16}
            >
              Apply
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Quick Actions */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('export')}
            iconName="Download"
            iconPosition="left"
            iconSize={16}
          >
            Export
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onBulkAction('duplicate')}
            iconName="Copy"
            iconPosition="left"
            iconSize={16}
          >
            Duplicate
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            iconName="X"
            iconPosition="left"
            iconSize={16}
          >
            Clear Selection
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-3 pt-3 border-t border-primary/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Selected Items:</span>
            <span className="ml-2 font-medium text-foreground">{selectedCount}</span>
          </div>
          <div>
            <span className="text-muted-foreground">Total Value:</span>
            <span className="ml-2 font-medium text-foreground">Rs. 0</span>
          </div>
          <div>
            <span className="text-muted-foreground">Low Stock:</span>
            <span className="ml-2 font-medium text-warning">0</span>
          </div>
          <div>
            <span className="text-muted-foreground">Out of Stock:</span>
            <span className="ml-2 font-medium text-error">0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActionsBar;