import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { inventoryService } from '../../services/inventoryService';

import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import QuickActionButton from '../../components/ui/QuickActionButton';
import FilterSidebar from './components/FilterSidebar';
import ProductTable from './components/ProductTable';
import ProductCard from './components/ProductCard';
import StockAdjustmentModal from './components/StockAdjustmentModal';
import BulkActionsBar from './components/BulkActionsBar';
import InventoryStats from './components/InventoryStats';

const InventoryManagement = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [stockAdjustmentModal, setStockAdjustmentModal] = useState({ isOpen: false, product: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    stockStatus: '',
    supplier: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: ''
  });

  // Data state
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load products data
  useEffect(() => {
    if (!user?.id || authLoading) return;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        const productsData = await inventoryService?.getProducts(user?.id, filters);
        setProducts(productsData);
      } catch (err) {
        console.error('Products loading failed:', err);
        setError(err?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [user?.id, authLoading, filters]);

  // Filter and sort products
  const filteredAndSortedProducts = useMemo(() => {
    let filtered = [...products];

    // Sort products
    filtered?.sort((a, b) => {
      let aValue = a?.[sortConfig?.key];
      let bValue = b?.[sortConfig?.key];

      if (sortConfig?.key === 'lastUpdated') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) {
        return sortConfig?.direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig?.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [products, sortConfig]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedProducts?.length / itemsPerPage);
  const paginatedProducts = filteredAndSortedProducts?.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStockStatus = (currentStock, reorderLevel) => {
    if (currentStock === 0) {
      return { status: 'out-of-stock' };
    } else if (currentStock <= reorderLevel) {
      return { status: 'low-stock' };
    } else if (currentStock > reorderLevel * 3) {
      return { status: 'overstock' };
    } else {
      return { status: 'in-stock' };
    }
  };

  const handleSort = (key) => {
    setSortConfig(prevConfig => ({
      key,
      direction: prevConfig?.key === key && prevConfig?.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      category: '',
      stockStatus: '',
      supplier: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: ''
    });
    setCurrentPage(1);
  };

  const handleSelectProduct = (productId, isSelected) => {
    setSelectedProducts(prev => 
      isSelected 
        ? [...prev, productId]
        : prev?.filter(id => id !== productId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedProducts(isSelected ? paginatedProducts?.map(p => p?.id) : []);
  };

  const handleEdit = (product) => {
    console.log('Edit product:', product);
    // Navigate to edit form or open modal
  };

  const handleDuplicate = (product) => {
    console.log('Duplicate product:', product);
    // Create duplicate product logic
  };

  const handleStockAdjustment = (product) => {
    setStockAdjustmentModal({ isOpen: true, product });
  };

  const handleStockAdjustmentSave = async (adjustmentData) => {
    try {
      await inventoryService?.adjustStock(
        stockAdjustmentModal?.product?.id, 
        adjustmentData, 
        user?.id
      );
      
      // Reload products to get updated stock
      const productsData = await inventoryService?.getProducts(user?.id, filters);
      setProducts(productsData);
      
      setStockAdjustmentModal({ isOpen: false, product: null });
    } catch (err) {
      console.error('Stock adjustment failed:', err);
      setError(err?.message || 'Stock adjustment failed');
    }
  };

  const handleBulkAction = async (action, additionalData = null) => {
    try {
      switch (action) {
        case 'update-status':
          if (additionalData?.status) {
            await inventoryService?.bulkUpdateProducts(
              selectedProducts,
              { status: additionalData?.status },
              user?.id
            );
          }
          break;
        case 'delete':
          await inventoryService?.bulkDeleteProducts(selectedProducts, user?.id);
          break;
        default:
          console.log('Bulk action:', action, 'for products:', selectedProducts);
          break;
      }

      // Reload products after bulk action
      const productsData = await inventoryService?.getProducts(user?.id, filters);
      setProducts(productsData);
      setSelectedProducts([]);
    } catch (err) {
      console.error('Bulk action failed:', err);
      setError(err?.message || 'Bulk action failed');
    }
  };

  const handleClearSelection = () => {
    setSelectedProducts([]);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Show loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded w-64 mb-4"></div>
            <div className="h-32 bg-muted rounded mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6]?.map((i) => (
                <div key={i} className="h-48 bg-muted rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show auth required message
  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16 p-6">
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold">Please sign in to manage inventory</h3>
            <button
              onClick={() => navigate('/login')}
              className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="flex">
          {/* Filter Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              isOpen={true}
              onClose={() => {}}
              filters={filters}
              onFiltersChange={handleFiltersChange}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Mobile Filter Sidebar */}
          <FilterSidebar
            isOpen={filterSidebarOpen}
            onClose={() => setFilterSidebarOpen(false)}
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClearFilters={handleClearFilters}
          />

          {/* Main Content */}
          <div className="flex-1 p-6">
            <Breadcrumb />
            
            {/* Page Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground">Inventory Management</h1>
                <p className="text-muted-foreground mt-1">
                  Manage your wholesale inventory and track stock levels
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  onClick={() => setFilterSidebarOpen(true)}
                  className="lg:hidden"
                  iconName="Filter"
                  iconPosition="left"
                  iconSize={16}
                >
                  Filters
                </Button>
                
                <Button
                  variant="outline"
                  iconName="Upload"
                  iconPosition="left"
                  iconSize={16}
                >
                  Bulk Import
                </Button>
                
                <Button
                  variant="outline"
                  iconName="Download"
                  iconPosition="left"
                  iconSize={16}
                >
                  Export Data
                </Button>
                
                <Button
                  variant="default"
                  iconName="Plus"
                  iconPosition="left"
                  iconSize={16}
                >
                  Add Product
                </Button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => setError('')}
                  className="mt-2 text-sm text-red-500 underline"
                >
                  Dismiss
                </button>
              </div>
            )}

            {/* Inventory Stats */}
            <InventoryStats products={filteredAndSortedProducts} />

            {/* Bulk Actions Bar */}
            <BulkActionsBar
              selectedCount={selectedProducts?.length}
              onClearSelection={handleClearSelection}
              onBulkAction={handleBulkAction}
            />

            {/* Results Info */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                Showing {paginatedProducts?.length} of {filteredAndSortedProducts?.length} products
              </p>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">View:</span>
                <Button
                  variant={!isMobile ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsMobile(false)}
                  iconName="Table"
                  iconSize={16}
                >
                </Button>
                <Button
                  variant={isMobile ? "default" : "outline"}
                  size="sm"
                  onClick={() => setIsMobile(true)}
                  iconName="Grid3x3"
                  iconSize={16}
                >
                </Button>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            )}

            {/* Products Display */}
            {!loading && (
              <>
                {isMobile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paginatedProducts?.map(product => (
                      <ProductCard
                        key={product?.id}
                        product={product}
                        isSelected={selectedProducts?.includes(product?.id)}
                        onSelect={handleSelectProduct}
                        onEdit={handleEdit}
                        onDuplicate={handleDuplicate}
                        onStockAdjustment={handleStockAdjustment}
                      />
                    ))}
                  </div>
                ) : (
                  <ProductTable
                    products={paginatedProducts}
                    selectedProducts={selectedProducts}
                    onSelectProduct={handleSelectProduct}
                    onSelectAll={handleSelectAll}
                    sortConfig={sortConfig}
                    onSort={handleSort}
                    onEdit={handleEdit}
                    onDuplicate={handleDuplicate}
                    onStockAdjustment={handleStockAdjustment}
                  />
                )}
              </>
            )}

            {/* Empty State */}
            {!loading && filteredAndSortedProducts?.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground">
                  📦
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">No Products Found</h3>
                <p className="text-muted-foreground mb-6">
                  {Object.values(filters)?.some(f => f) 
                    ? 'Try adjusting your search or filter criteria' :'Get started by adding your first product'
                  }
                </p>
                <Button
                  iconName="Plus"
                  iconPosition="left"
                >
                  Add Product
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </p>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                    iconSize={16}
                  >
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = i + 1;
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                    iconSize={16}
                  >
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        isOpen={stockAdjustmentModal?.isOpen}
        onClose={() => setStockAdjustmentModal({ isOpen: false, product: null })}
        product={stockAdjustmentModal?.product}
        onSave={handleStockAdjustmentSave}
      />

      {/* Quick Action Button */}
      <QuickActionButton />
    </div>
  );
};

export default InventoryManagement;