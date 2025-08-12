import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const HeroSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Khan",
      company: "Karachi Traders",
      message: "WholesaleHub transformed our inventory management. We've reduced stock-outs by 80% and improved order processing speed significantly.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 2,
      name: "Fatima Sheikh",
      company: "Lahore Wholesale Co.",
      message: "The delivery tracking system is excellent. Our customers love the real-time updates and we\'ve improved our delivery efficiency by 60%.",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      id: 3,
      name: "Muhammad Ali",
      company: "Islamabad Distributors",
      message: "Managing 500+ products was a nightmare before WholesaleHub. Now everything is organized and we can focus on growing our business.",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    }
  ];

  const features = [
    {
      icon: "Package",
      title: "Inventory Management",
      description: "Track 100+ products with real-time stock levels"
    },
    {
      icon: "ShoppingCart",
      title: "Order Processing",
      description: "Streamlined order workflow from placement to delivery"
    },
    {
      icon: "Truck",
      title: "Delivery Tracking",
      description: "Complete logistics coordination and route optimization"
    },
    {
      icon: "BarChart3",
      title: "Business Analytics",
      description: "Comprehensive reporting and business insights"
    }
  ];

  return (
    <div className="hidden lg:flex lg:flex-1 lg:flex-col lg:justify-center lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Hero Image */}
        <div className="mb-8 overflow-hidden rounded-lg shadow-elevation-2">
          <Image
            src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&h=400&fit=crop"
            alt="Wholesale warehouse operations with organized inventory and modern logistics"
            className="w-full h-64 object-cover"
          />
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          {features?.map((feature) => (
            <div key={feature?.icon} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name={feature?.icon} size={18} className="text-primary" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">{feature?.title}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground mb-4">Trusted by Pakistani Businesses</h3>
          {testimonials?.map((testimonial) => (
            <div key={testimonial?.id} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Image
                  src={testimonial?.avatar}
                  alt={`${testimonial?.name} profile picture`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="text-sm font-semibold text-foreground">{testimonial?.name}</h4>
                    <span className="text-xs text-muted-foreground">•</span>
                    <span className="text-xs text-muted-foreground">{testimonial?.company}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">{testimonial?.message}</p>
                  <div className="flex items-center space-x-1 mt-2">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon key={i} name="Star" size={12} className="text-warning fill-current" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-center space-x-6">
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={16} className="text-success" />
              <span className="text-xs text-muted-foreground">SSL Secured</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Users" size={16} className="text-primary" />
              <span className="text-xs text-muted-foreground">500+ Businesses</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-accent" />
              <span className="text-xs text-muted-foreground">Pakistan Wide</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;