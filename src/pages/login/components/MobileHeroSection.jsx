import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const MobileHeroSection = () => {
  return (
    <div className="lg:hidden mb-8">
      {/* Mobile Hero Image */}
      <div className="relative overflow-hidden rounded-lg shadow-elevation-2 mb-6">
        <Image
          src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&h=300&fit=crop"
          alt="Modern wholesale warehouse with organized inventory management"
          className="w-full h-48 sm:h-56 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <h2 className="text-white text-xl font-bold mb-2">Streamline Your Wholesale Business</h2>
          <p className="text-white/90 text-sm">Complete inventory, order, and delivery management solution</p>
        </div>
      </div>

      {/* Key Features */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Package" size={18} className="text-primary" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">100+ Products</h3>
          <p className="text-xs text-muted-foreground">Inventory Tracking</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="ShoppingCart" size={18} className="text-success" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Order Management</h3>
          <p className="text-xs text-muted-foreground">End-to-End Processing</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="Truck" size={18} className="text-accent" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Delivery Tracking</h3>
          <p className="text-xs text-muted-foreground">Real-time Updates</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-3 text-center">
          <div className="w-8 h-8 bg-warning/10 rounded-lg flex items-center justify-center mx-auto mb-2">
            <Icon name="BarChart3" size={18} className="text-warning" />
          </div>
          <h3 className="text-sm font-semibold text-foreground">Analytics</h3>
          <p className="text-xs text-muted-foreground">Business Insights</p>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between text-center">
          <div className="flex-1">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-xs font-medium text-foreground">Secure</span>
            </div>
            <p className="text-xs text-muted-foreground">SSL Protected</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-xs font-medium text-foreground">500+</span>
            </div>
            <p className="text-xs text-muted-foreground">Businesses</p>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-center space-x-1 mb-1">
              <Icon name="MapPin" size={16} className="text-accent" />
              <span className="text-xs font-medium text-foreground">Pakistan</span>
            </div>
            <p className="text-xs text-muted-foreground">Nationwide</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileHeroSection;