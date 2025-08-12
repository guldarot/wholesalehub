import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const CreateOrderModal = ({ isOpen, onClose, onCreateOrder }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [orderData, setOrderData] = useState({
    customerId: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    items: [],
    deliveryDate: '',
    notes: ''
  });

  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);

  const customers = [
    { value: '1', label: 'Karachi Traders', email: 'info@karachitrade.com', phone: '+92 300 1234567' },
    { value: '2', label: 'Lahore Wholesale Co.', email: 'orders@lahorewholesale.com', phone: '+92 301 2345678' },
    { value: '3', label: 'Islamabad Distributors', email: 'sales@islamabaddist.com', phone: '+92 302 3456789' },
    { value: '4', label: 'Peshawar Trading House', email: 'contact@peshawartrade.com', phone: '+92 303 4567890' }
  ];

  const products = [
    { value: '1', label: 'Premium Rice Basmati', price: 120, sku: 'RICE-001', stock: 500 },
    { value: '2', label: 'Wheat Flour Premium', price: 85, sku: 'FLOUR-001', stock: 300 },
    { value: '3', label: 'Sugar Refined', price: 95, sku: 'SUGAR-001', stock: 200 },
    { value: '4', label: 'Cooking Oil 5L', price: 450, sku: 'OIL-001', stock: 150 },
    { value: '5', label: 'Red Lentils', price: 180, sku: 'LENTIL-001', stock: 100 }
  ];

  if (!isOpen) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })?.format(amount)?.replace('PKR', 'Rs.');
  };

  const handleCustomerSelect = (customerId) => {
    const customer = customers?.find(c => c?.value === customerId);
    if (customer) {
      setOrderData({
        ...orderData,
        customerId,
        customerName: customer?.label,
        customerEmail: customer?.email,
        customerPhone: customer?.phone
      });
    }
  };

  const addProduct = () => {
    const product = products?.find(p => p?.value === selectedProduct);
    if (product && quantity > 0) {
      const existingItemIndex = orderData?.items?.findIndex(item => item?.productId === selectedProduct);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...orderData?.items];
        updatedItems[existingItemIndex].quantity += quantity;
        updatedItems[existingItemIndex].total = updatedItems?.[existingItemIndex]?.quantity * product?.price;
        setOrderData({ ...orderData, items: updatedItems });
      } else {
        const newItem = {
          productId: selectedProduct,
          name: product?.label,
          sku: product?.sku,
          price: product?.price,
          quantity: quantity,
          total: product?.price * quantity
        };
        setOrderData({ ...orderData, items: [...orderData?.items, newItem] });
      }
      
      setSelectedProduct('');
      setQuantity(1);
    }
  };

  const removeProduct = (index) => {
    const updatedItems = orderData?.items?.filter((_, i) => i !== index);
    setOrderData({ ...orderData, items: updatedItems });
  };

  const calculateTotal = () => {
    return orderData?.items?.reduce((sum, item) => sum + item?.total, 0);
  };

  const handleSubmit = () => {
    const newOrder = {
      id: Date.now(),
      orderId: `WH-${new Date()?.getFullYear()}-${String(Date.now())?.slice(-3)}`,
      customerName: orderData?.customerName,
      customerEmail: orderData?.customerEmail,
      customerPhone: orderData?.customerPhone,
      deliveryAddress: orderData?.deliveryAddress,
      orderDate: new Date()?.toISOString(),
      deliveryDate: orderData?.deliveryDate,
      items: orderData?.items,
      totalAmount: calculateTotal(),
      status: 'pending',
      paymentStatus: 'pending',
      notes: orderData?.notes
    };
    
    onCreateOrder(newOrder);
    onClose();
    
    // Reset form
    setCurrentStep(1);
    setOrderData({
      customerId: '',
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      deliveryAddress: '',
      items: [],
      deliveryDate: '',
      notes: ''
    });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToStep2 = orderData?.customerId && orderData?.customerName && orderData?.deliveryAddress;
  const canProceedToStep3 = orderData?.items?.length > 0;
  const canSubmit = canProceedToStep2 && canProceedToStep3;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card rounded-lg border border-border shadow-elevation-3 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Create New Order</h2>
            <p className="text-sm text-muted-foreground">Step {currentStep} of 3</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center space-x-4">
            {[1, 2, 3]?.map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step <= currentStep 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 text-sm ${
                  step <= currentStep ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step === 1 ? 'Customer Info' : step === 2 ? 'Add Products' : 'Review & Submit'}
                </span>
                {step < 3 && <Icon name="ChevronRight" size={16} className="ml-4 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-96">
          {/* Step 1: Customer Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Customer Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Select
                      label="Select Customer"
                      placeholder="Choose existing customer or create new"
                      options={[
                        { value: 'new', label: '+ Create New Customer' },
                        ...customers
                      ]}
                      value={orderData?.customerId}
                      onChange={(value) => {
                        if (value === 'new') {
                          setOrderData({
                            ...orderData,
                            customerId: 'new',
                            customerName: '',
                            customerEmail: '',
                            customerPhone: ''
                          });
                        } else {
                          handleCustomerSelect(value);
                        }
                      }}
                      required
                    />
                  </div>

                  <Input
                    label="Customer Name"
                    value={orderData?.customerName}
                    onChange={(e) => setOrderData({...orderData, customerName: e?.target?.value})}
                    required
                    disabled={orderData?.customerId !== 'new' && orderData?.customerId !== ''}
                  />

                  <Input
                    label="Email Address"
                    type="email"
                    value={orderData?.customerEmail}
                    onChange={(e) => setOrderData({...orderData, customerEmail: e?.target?.value})}
                    required
                    disabled={orderData?.customerId !== 'new' && orderData?.customerId !== ''}
                  />

                  <Input
                    label="Phone Number"
                    type="tel"
                    value={orderData?.customerPhone}
                    onChange={(e) => setOrderData({...orderData, customerPhone: e?.target?.value})}
                    required
                    disabled={orderData?.customerId !== 'new' && orderData?.customerId !== ''}
                  />

                  <Input
                    label="Delivery Date"
                    type="date"
                    value={orderData?.deliveryDate}
                    onChange={(e) => setOrderData({...orderData, deliveryDate: e?.target?.value})}
                    min={new Date()?.toISOString()?.split('T')?.[0]}
                  />

                  <div className="md:col-span-2">
                    <Input
                      label="Delivery Address"
                      value={orderData?.deliveryAddress}
                      onChange={(e) => setOrderData({...orderData, deliveryAddress: e?.target?.value})}
                      placeholder="Enter complete delivery address"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Add Products */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Add Products</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Select
                    label="Select Product"
                    placeholder="Choose product"
                    options={products?.map(p => ({
                      value: p?.value,
                      label: `${p?.label} - ${formatCurrency(p?.price)} (Stock: ${p?.stock})`
                    }))}
                    value={selectedProduct}
                    onChange={setSelectedProduct}
                    searchable
                  />

                  <Input
                    label="Quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e?.target?.value) || 1)}
                  />

                  <div className="flex items-end">
                    <Button
                      onClick={addProduct}
                      disabled={!selectedProduct}
                      iconName="Plus"
                      className="w-full"
                    >
                      Add Product
                    </Button>
                  </div>
                </div>

                {/* Added Products */}
                {orderData?.items?.length > 0 && (
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Added Products</h4>
                    <div className="space-y-3">
                      {orderData?.items?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{item?.name}</p>
                            <p className="text-sm text-muted-foreground">SKU: {item?.sku}</p>
                          </div>
                          <div className="flex items-center space-x-4">
                            <div className="text-right">
                              <p className="font-medium text-foreground">
                                {item?.quantity} × {formatCurrency(item?.price)}
                              </p>
                              <p className="text-sm font-semibold text-foreground">
                                {formatCurrency(item?.total)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeProduct(index)}
                              className="text-error hover:bg-error/10"
                            >
                              <Icon name="Trash2" size={16} />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-4 bg-primary/5 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-foreground">Total Amount:</span>
                        <span className="text-xl font-bold text-primary">
                          {formatCurrency(calculateTotal())}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Review & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-foreground mb-4">Review Order</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Customer Details</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Name:</span> {orderData?.customerName}</p>
                      <p><span className="text-muted-foreground">Email:</span> {orderData?.customerEmail}</p>
                      <p><span className="text-muted-foreground">Phone:</span> {orderData?.customerPhone}</p>
                      <p><span className="text-muted-foreground">Address:</span> {orderData?.deliveryAddress}</p>
                      {orderData?.deliveryDate && (
                        <p><span className="text-muted-foreground">Delivery Date:</span> {new Date(orderData.deliveryDate)?.toLocaleDateString('en-GB')}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Order Summary</h4>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Total Items:</span> {orderData?.items?.length}</p>
                      <p><span className="text-muted-foreground">Total Quantity:</span> {orderData?.items?.reduce((sum, item) => sum + item?.quantity, 0)}</p>
                      <p><span className="text-muted-foreground">Total Amount:</span> <span className="font-semibold">{formatCurrency(calculateTotal())}</span></p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Input
                    label="Order Notes (Optional)"
                    value={orderData?.notes}
                    onChange={(e) => setOrderData({...orderData, notes: e?.target?.value})}
                    placeholder="Any special instructions or notes for this order"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            iconName="ChevronLeft"
            iconPosition="left"
          >
            Previous
          </Button>

          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={onClose}
            >
              Cancel
            </Button>
            
            {currentStep < 3 ? (
              <Button
                onClick={nextStep}
                disabled={
                  (currentStep === 1 && !canProceedToStep2) ||
                  (currentStep === 2 && !canProceedToStep3)
                }
                iconName="ChevronRight"
                iconPosition="right"
              >
                Next
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit}
                iconName="Check"
                iconPosition="left"
              >
                Create Order
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateOrderModal;