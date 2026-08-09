import React, { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { AnimatePresence } from 'framer-motion';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { LuxuryLoader } from '@/features/loader/LuxuryLoader';
import { Navbar } from '@/features/navbar/Navbar';
import { Hero } from '@/features/hero/Hero';
import { About } from '@/features/about/About';
import { Products } from '@/features/products/Products';
import { WhyChooseUs } from '@/features/why-choose-us/WhyChooseUs';
import { Gallery } from '@/features/gallery/Gallery';
import { Testimonials } from '@/features/testimonials/Testimonials';
import { Contact } from '@/features/contact/Contact';
import { Footer } from '@/features/footer/Footer';

// Dashboard Imports
import { DashboardLayout } from '@/features/dashboard/DashboardLayout';
import { DashboardLogin } from '@/features/dashboard/DashboardLogin';
import { DashboardForgotPassword } from '@/features/dashboard/DashboardForgotPassword';
import { DashboardResetPassword } from '@/features/dashboard/DashboardResetPassword';
import { getAuthToken } from '@/services/api';

export const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!getAuthToken());
  const [authMode, setAuthMode] = useState<'login' | 'forgot' | 'reset'>(() => {
    if (window.location.pathname.includes('/reset-password') || window.location.search.includes('token=')) {
      return 'reset';
    }
    if (window.location.pathname.includes('/forgot-password')) {
      return 'forgot';
    }
    return 'login';
  });

  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      setCurrentPath(path);
      setIsAuthenticated(!!getAuthToken());
      if (path.includes('/reset-password') || window.location.search.includes('token=')) {
        setAuthMode('reset');
      } else if (path.includes('/forgot-password')) {
        setAuthMode('forgot');
      } else {
        setAuthMode('login');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const navigateToPath = (path: string) => {
    window.history.pushState({}, '', path);
    setCurrentPath(path.split('?')[0]);
    if (path.includes('reset-password')) {
      setAuthMode('reset');
    } else if (path.includes('forgot-password')) {
      setAuthMode('forgot');
    } else {
      setAuthMode('login');
    }
  };

  // Dashboard View Handler
  if (currentPath.startsWith('/dashboard')) {
    if (isAuthenticated && authMode === 'login') {
      return (
        <div className="min-h-screen selection:bg-black selection:text-white">
          <DashboardLayout onLogout={() => setIsAuthenticated(false)} />
        </div>
      );
    }

    return (
      <div className="min-h-screen selection:bg-black selection:text-white">
        {authMode === 'forgot' ? (
          <DashboardForgotPassword
            onBackToLogin={() => navigateToPath('/dashboard')}
            onNavigateReset={(url) => navigateToPath(url)}
          />
        ) : authMode === 'reset' ? (
          <DashboardResetPassword
            onSuccessRedirect={() => navigateToPath('/dashboard')}
          />
        ) : (
          <DashboardLogin
            onLoginSuccess={() => setIsAuthenticated(true)}
            onForgotPassword={() => navigateToPath('/dashboard/forgot-password')}
          />
        )}
      </div>
    );
  }

  // Public Website View
  return (
    <HelmetProvider>
      <SmoothScrollProvider>
        <Helmet>
          <title>Sri Senthoor Granites | Premium Natural Stone & Architecture Solutions Trichy</title>
          <meta
            name="description"
            content="Sri Senthoor Granites - Founder Arshath. Your choice is our priority. Exclusive quarry granites, vitrified porcelain tiles, Cuddapah kadappa stone, sanitary wares, and luxury bath fittings in Trichy, Tamil Nadu."
          />
          <meta name="keywords" content="Sri Senthoor Granites, Granites Trichy, Vitrified Tiles Trichy, Kadappa Stone, Sanitary Wares, Bath Fittings, Arshath Sri Senthoor" />
          <meta property="og:title" content="Sri Senthoor Granites | Architectural Stone Solutions" />
          <meta property="og:description" content="Your choice is our priority. Discover high-gloss granites, vitrified slabs, and luxury bath fittings." />
          <meta property="og:type" content="website" />
        </Helmet>

        {/* Luxury Cinematic Loader */}
        <AnimatePresence mode="wait">
          {isLoading && <LuxuryLoader key="loader" onComplete={() => setIsLoading(false)} />}
        </AnimatePresence>

        {/* Main Public Website */}
        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-black selection:text-white">
          <Navbar />
          <main className="flex-grow">
            <Hero />
            <Products />
            <About />
            <WhyChooseUs />
            <Gallery />
            <Testimonials />
            <Contact />
          </main>
          <Footer />
        </div>
      </SmoothScrollProvider>
    </HelmetProvider>
  );
};

export default App;
