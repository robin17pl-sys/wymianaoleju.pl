/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { getAdminStore, AdminStoreData, AppointmentBooking, calculateQuotation } from './data/adminStore';
import { EngineOption, OilProductMatch } from './data/vehicleDatabase';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ConfiguratorSection } from './components/ConfiguratorSection';
import { BrandsShowcase } from './components/BrandsShowcase';
import { WhyUsSection } from './components/WhyUsSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AddonsSection } from './components/AddonsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  const [storeData, setStoreData] = useState<AdminStoreData>(getAdminStore);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);

  // Selected vehicle & quotation state passed from configurator to booking modal
  const [selectedBookingConfig, setSelectedBookingConfig] = useState<{
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleFuel: 'Benzyna' | 'Benzyna + LPG' | 'Diesel';
    vehicleEngine: string;
    engine: EngineOption;
    selectedBrand: 'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr';
    selectedProduct: OilProductMatch;
    includeFlush: boolean;
    includeMetalGuard: boolean;
    quotation: ReturnType<typeof calculateQuotation>;
  } | null>(null);

  // Synchronize store updates across app
  useEffect(() => {
    const handleStoreChange = () => {
      setStoreData(getAdminStore());
    };
    window.addEventListener('oilexx-store-updated', handleStoreChange);
    return () => {
      window.removeEventListener('oilexx-store-updated', handleStoreChange);
    };
  }, []);

  // Check if current URL is the CMS route (/CMS, /cms, ?cms, #cms)
  useEffect(() => {
    const checkCmsRoute = () => {
      const path = window.location.pathname.toLowerCase();
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (path.includes('/cms') || search.includes('cms') || hash === '#cms') {
        setIsAdminModalOpen(true);
      }
    };

    checkCmsRoute();
    window.addEventListener('popstate', checkCmsRoute);
    window.addEventListener('hashchange', checkCmsRoute);
    return () => {
      window.removeEventListener('popstate', checkCmsRoute);
      window.removeEventListener('hashchange', checkCmsRoute);
    };
  }, []);

  // Discrete owner shortcut (Ctrl+Shift+L) to open CMS directly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        window.history.pushState({}, '', '/CMS');
        setIsAdminModalOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCloseAdmin = () => {
    setIsAdminModalOpen(false);
    const path = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const hash = window.location.hash.toLowerCase();
    if (path.includes('/cms') || search.includes('cms') || hash === '#cms') {
      window.history.pushState({}, '', '/');
    }
  };

  const scrollToConfigurator = useCallback(() => {
    const el = document.getElementById('konfigurator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleProceedToBooking = (config: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleFuel: 'Benzyna' | 'Benzyna + LPG' | 'Diesel';
    vehicleEngine: string;
    engine: EngineOption;
    selectedBrand: 'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr';
    selectedProduct: OilProductMatch;
    includeFlush: boolean;
    includeMetalGuard: boolean;
    quotation: ReturnType<typeof calculateQuotation>;
  }) => {
    setSelectedBookingConfig(config);
    setIsBookingModalOpen(true);
  };

  const handleBookingSuccess = (newBooking: AppointmentBooking) => {
    // Refresh local store view
    setStoreData(getAdminStore());
  };

  return (
    <div className="min-h-screen bg-[#0b0e14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      
      {/* Top 3-Zone Sticky Navbar (Clean customer view) */}
      <Navbar
        settings={storeData.settings}
        onOpenBooking={() => setIsBookingModalOpen(true)}
      />

      {/* Main Content Container */}
      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          settings={storeData.settings}
          onScrollToConfigurator={scrollToConfigurator}
        />

        {/* Intelligent Price Configurator (Crown Jewel) */}
        <ConfiguratorSection
          prices={storeData.prices}
          bookings={storeData.bookings}
          onProceedToBooking={handleProceedToBooking}
        />

        {/* 3 Oil Brands Showcase (Motul, Liqui Moly, Valvoline) */}
        <BrandsShowcase
          onSelectBrandForConfigurator={(brand) => {
            scrollToConfigurator();
          }}
        />

        {/* Why Us Section */}
        <WhyUsSection />

        {/* How It Works (4 Steps) */}
        <HowItWorksSection
          onScrollToConfigurator={scrollToConfigurator}
        />

        {/* Engine Addons & Metal Guard */}
        <AddonsSection
          prices={storeData.prices}
          onScrollToConfigurator={scrollToConfigurator}
        />

        {/* Contact, Working Hours & Google Map */}
        <ContactSection
          settings={storeData.settings}
        />

      </main>

      {/* Footer (Clean customer view) */}
      <Footer
        settings={storeData.settings}
      />

      {/* Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialConfig={selectedBookingConfig}
        prices={storeData.prices}
        bookings={storeData.bookings}
        onBookingSuccess={handleBookingSuccess}
      />

      {/* CMS Admin Panel Modal (wymianaoleju.pl/CMS) */}
      <AdminPanelModal
        isOpen={isAdminModalOpen}
        onClose={handleCloseAdmin}
        initialData={storeData}
        onDataUpdated={(updated) => setStoreData(updated)}
      />

    </div>
  );
}
