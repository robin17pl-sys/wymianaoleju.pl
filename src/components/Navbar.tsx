import React, { useState } from 'react';
import { Shield, Settings, Menu, X, Clock, Phone } from 'lucide-react';
import { WorkshopSettings } from '../data/adminStore';

interface NavbarProps {
  settings: WorkshopSettings;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ settings, onOpenBooking, onOpenAdmin }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#0b0e14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          
          {/* Zone 1: Brand title & logo, 2-line wordmark */}
          <a href="#" className="flex items-center gap-3.5 whitespace-nowrap shrink-0 group">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-600 p-[1.5px] shadow-lg shadow-amber-500/20 group-hover:shadow-amber-500/40 transition-all">
              <div className="w-full h-full bg-[#0d121c] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 to-rose-600/10 pointer-events-none" />
                <svg className="w-6 h-6 text-amber-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="url(#nav-drop-gradient)" />
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M9.5 10.5h4.5l-4 5h4.5" stroke="#0b0e14" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  <defs>
                    <linearGradient id="nav-drop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#f59e0b" />
                      <stop offset="100%" stopColor="#e11d48" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline">
                <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors uppercase leading-none">
                  ZMIANAOLEJU
                </span>
                <span className="font-heading text-xl sm:text-2xl font-black tracking-tight text-amber-400 leading-none">
                  .pl
                </span>
              </div>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.16em] text-slate-400 leading-tight mt-1">
                Express Oil Service
              </span>
            </div>
          </a>

          {/* Zone 2: 4-5 concise single-line nav links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <a href="#konfigurator" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Dobór oleju i wycena
            </a>
            <a href="#dlaczego-my" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Dlaczego my
            </a>
            <a href="#oleje" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Motul · Liqui Moly · Valvoline
            </a>
            <a href="#ochrona-silnika" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Metal Guard & Płukanie
            </a>
            <a href="#kontakt" className="hover:text-amber-400 transition-colors whitespace-nowrap shrink-0">
              Kontakt
            </a>
          </nav>

          {/* Zone 3: 1 primary action + Admin shortcut */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenAdmin}
              title="Panel zarządzania dla właściciela"
              className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-800/80 rounded-lg border border-slate-800 transition-colors text-xs flex items-center gap-1.5"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden xl:inline text-xs font-medium">Panel</span>
            </button>

            <a
              href={`tel:${settings.phone.replace(/\s+/g, '')}`}
              className="hidden md:flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{settings.phone}</span>
            </a>

            <button
              onClick={onOpenBooking}
              className="px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 rounded-lg shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap shrink-0"
            >
              Umów wizytę do 27 min
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-400 hover:text-white rounded-lg focus:outline-none"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile nav dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-[#0f141c] px-4 pt-3 pb-6 space-y-3">
          <a
            href="#konfigurator"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Dobór oleju i wycena
          </a>
          <a
            href="#dlaczego-my"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Dlaczego my
          </a>
          <a
            href="#oleje"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Motul · Liqui Moly · Valvoline
          </a>
          <a
            href="#ochrona-silnika"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Metal Guard & Płukanie silnika
          </a>
          <a
            href="#kontakt"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-slate-200 hover:text-amber-400"
          >
            Kontakt i lokalizacja
          </a>
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-400">Telefon: {settings.phone}</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdmin();
              }}
              className="text-xs text-amber-400 underline"
            >
              Panel Właściciela
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
