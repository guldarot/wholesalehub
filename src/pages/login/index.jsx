import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import HeroSection from './components/HeroSection';
import MobileHeroSection from './components/MobileHeroSection';
import LoginForm from './components/LoginForm';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signIn, signUp, loading: authLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Redirect if user is already authenticated
  useEffect(() => {
    if (user && !authLoading) {
      const from = location?.state?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, authLoading, navigate, location]);

  const handleSubmit = async (formData) => {
    const { email, password, fullName } = formData;
    
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      if (isSignup) {
        await signUp(email, password, { full_name: fullName });
        setSuccess('Account created successfully! Please check your email to confirm your account.');
        setIsSignup(false);
      } else {
        await signIn(email, password);
        // Navigation will be handled by useEffect above
      }
    } catch (err) {
      setError(err?.message || `${isSignup ? 'Sign up' : 'Sign in'} failed`);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setError('');
    setSuccess('');
  };

  // Demo account info for testing
  const demoAccounts = [
    { email: 'admin@wholesalehub.com', password: 'admin123', role: 'Admin' },
    { email: 'manager@wholesalehub.com', password: 'manager123', role: 'Manager' },
    { email: 'staff@wholesalehub.com', password: 'staff123', role: 'Staff' }
  ];

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex min-h-screen">
        {/* Left Side - Hero Section (Desktop) */}
        <div className="hidden lg:flex lg:w-1/2">
          <HeroSection />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex flex-col">
          {/* Mobile Hero Section */}
          <div className="lg:hidden">
            <MobileHeroSection />
          </div>

          {/* Login Form Container */}
          <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
              {/* Header */}
              <div className="text-center">
                <h2 className="text-3xl font-bold text-foreground">
                  {isSignup ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="mt-2 text-muted-foreground">
                  {isSignup 
                    ? 'Join WholesaleHub to manage your business' :'Sign in to your WholesaleHub account'
                  }
                </p>
              </div>

              {/* Demo Accounts Section */}
              {!isSignup && (
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-foreground mb-2">Demo Accounts:</h4>
                  <div className="space-y-1">
                    {demoAccounts?.map((account, index) => (
                      <div key={index} className="text-xs text-muted-foreground">
                        <span className="font-medium">{account?.role}:</span> {account?.email} / {account?.password}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Success Message */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">{success}</p>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Login Form */}
              <LoginForm
                isSignup={isSignup}
                loading={loading}
                onSubmit={handleSubmit}
              />

              {/* Toggle Mode */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
                  <button
                    type="button"
                    onClick={toggleMode}
                    className="font-medium text-primary hover:text-primary/80 focus:outline-none focus:underline transition-colors"
                  >
                    {isSignup ? 'Sign in' : 'Sign up'}
                  </button>
                </p>
              </div>

              {/* Preview Mode Notice */}
              <div className="text-center pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  🎯 Preview Mode: All features are accessible for demonstration. 
                  In production, authentication would be required for protected routes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;