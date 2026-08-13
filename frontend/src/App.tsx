import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
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

// Public Landing Page Component
const PublicWebsite: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);

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
          {isLoading && (
            <LuxuryLoader
              key="loader"
              onComplete={() => {
                setIsLoading(false);
                window.scrollTo(0, 0);
              }}
            />
          )}
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

// Separate Dedicated Login Route Component (/login)
const LoginRoute: React.FC = () => {
  const navigate = useNavigate();
  const token = getAuthToken();

  if (token) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen selection:bg-black selection:text-white">
      <DashboardLogin
        onLoginSuccess={() => navigate('/dashboard')}
        onForgotPassword={() => navigate('/dashboard/forgot-password')}
      />
    </div>
  );
};

// Protected Dashboard Layout Route Component (/dashboard & /dashboard/*)
const DashboardRoute: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const token = getAuthToken();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Handle forgot/reset password sub-routes if explicitly navigated to under /dashboard
  if (location.pathname.includes('/forgot-password')) {
    return (
      <div className="min-h-screen selection:bg-black selection:text-white">
        <DashboardForgotPassword
          onBackToLogin={() => navigate('/login')}
          onNavigateReset={(url) => navigate(url)}
        />
      </div>
    );
  }

  if (location.pathname.includes('/reset-password')) {
    return (
      <div className="min-h-screen selection:bg-black selection:text-white">
        <DashboardResetPassword onSuccessRedirect={() => navigate('/login')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-black selection:text-white">
      <DashboardLayout
        onLogout={() => {
          navigate('/login');
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PublicWebsite />} />
        <Route path="/login" element={<LoginRoute />} />
        <Route path="/dashboard" element={<DashboardRoute />} />
        <Route path="/dashboard/*" element={<DashboardRoute />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
