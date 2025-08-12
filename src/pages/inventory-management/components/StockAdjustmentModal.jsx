import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const StockAdjustmentModal = ({ isOpen, onClose, product, onSave }) => {
  const [adjustmentData, setAdjustmentData] = useState({
    type: 'add',
    quantity: '',
    reason: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  const adjustmentReasons = [
    { value: 'received', label: 'Stock Received' },
    { value: 'sold', label: 'Stock Sold' },
    { value: 'damaged', label: 'Damaged/Defective' },
    { value: 'expired', label: 'Expired' },
    { value: 'returned', label: 'Customer Return' },
    { value: 'theft', label: 'Theft/Loss' },
    { value: 'correction', label: 'Inventory Correction' },
    { value: 'transfer', label: 'Transfer' },
    { value: 'other', label: 'Other' }
  ];

  useEffect(() => {
    if (isOpen && product) {
      setAdjustmentData({
        type: 'add',
        quantity: '',
        reason: '',
        notes: ''
      });
      setErrors({});
    }
  }, [isOpen, product]);

  const handleInputChange = (field, value) => {
    setAdjustmentData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!adjustmentData?.quantity || adjustmentData?.quantity <= 0) {
      newErrors.quantity = 'Please enter a valid quantity';
    }

    if (!adjustmentData?.reason) {
      newErrors.reason = 'Please select a reason';
    }

    if (adjustmentData?.type === 'subtract') {
      const newStock = product?.currentStock - parseInt(adjustmentData?.quantity);
      if (newStock < 0) {
        newErrors.quantity = 'Cannot reduce stock below zero';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const adjustmentQuantity = parseInt(adjustmentData?.quantity);
    const newStock = adjustmentData?.type === 'add' 
      ? product?.currentStock + adjustmentQuantity
      : product?.currentStock - adjustmentQuantity;

    const adjustmentRecord = {
      productId: product?.id,
      type: adjustmentData?.type,
      quantity: adjustmentQuantity,
      previousStock: product?.currentStock,
      newStock: newStock,
      reason: adjustmentData?.reason,
      notes: adjustmentData?.notes,
      timestamp: new Date()?.toISOString(),
      user: 'Admin User'
    };

    onSave(adjustmentRecord);
    onClose();
  };

  const calculateNewStock = () => {
    if (!adjustmentData?.quantity || !product) return product?.currentStock || 0;
    
    const quantity = parseInt(adjustmentData?.quantity) || 0;
    return adjustmentData?.type === 'add' 
      ? product?.currentStock + quantity
      : Math.max(0, product?.currentStock - quantity);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    })?.format(amount);
  };

  if (!isOpen || !product) return null;

  const newStock = calculateNewStock();
  const stockValue = newStock * product?.unitPrice;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card border border-border rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Stock Adjustment</h2>
            <p className="text-sm text-muted-foreground mt-1">{product?.name}</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <Icon name="X" size={16} />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Current Stock Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Current Stock</p>
                <p className="text-lg font-semibold text-foreground">
                  {product?.currentStock?.toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Unit Price</p>
                <p className="text-lg font-semibold text-foreground">
                  {formatCurrency(product?.unitPrice)}
                </p>
              </div>
            </div>
          </div>

          {/* Adjustment Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Adjustment Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={adjustmentData?.type === 'add' ? 'default' : 'outline'}
                onClick={() => handleInputChange('type', 'add')}
                className="justify-start"
                iconName="Plus"
                iconPosition="left"
                iconSize={16}
              >
                Add Stock
              </Button>
              <Button
                variant={adjustmentData?.type === 'subtract' ? 'default' : 'outline'}
                onClick={() => handleInputChange('type', 'subtract')}
                className="justify-start"
                iconName="Minus"
                iconPosition="left"
                iconSize={16}
              >
                Remove Stock
              </Button>
            </div>
          </div>

          {/* Quantity */}
          <div>
            <Input
              label="Quantity"
              type="number"
              placeholder="Enter quantity"
              value={adjustmentData?.quantity}
              onChange={(e) => handleInputChange('quantity', e?.target?.value)}
              error={errors?.quantity}
              required
            />
          </div>

          {/* Reason */}
          <div>
            <Select
              label="Reason"
              options={adjustmentReasons}
              value={adjustmentData?.reason}
              onChange={(value) => handleInputChange('reason', value)}
              placeholder="Select reason for adjustment"
              error={errors?.reason}
              required
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Notes (Optional)
            </label>
            <textarea
              className="w-full px-3 py-2 text-sm border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows="3"
              placeholder="Additional notes..."
              value={adjustmentData?.notes}
              onChange={(e) => handleInputChange('notes', e?.target?.value)}
            />
          </div>

          {/* Preview */}
          {adjustmentData?.quantity && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3">Preview</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Current Stock:</span>
                  <span className="text-sm font-medium text-foreground">
                    {product?.currentStock?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {adjustmentData?.type === 'add' ? 'Adding:' : 'Removing:'}
                  </span>
                  <span className={`text-sm font-medium ${
                    adjustmentData?.type === 'add' ? 'text-success' : 'text-error'
                  }`}>
                    {adjustmentData?.type === 'add' ? '+' : '-'}{parseInt(adjustmentData?.quantity || 0)?.toLocaleString()}
                  </span>
                </div>
                <hr className="border-border" />
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-foreground">New Stock:</span>
                  <span className="text-lg font-bold text-foreground">
                    {newStock?.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Stock Value:</span>
                  <span className="text-sm font-medium text-foreground">
                    {formatCurrency(stockValue)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleSave}
            iconName="Save"
            iconPosition="left"
            iconSize={16}
          >
            Save Adjustment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StockAdjustmentModal;