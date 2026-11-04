import React from 'react';
import { Clock, ShieldCheck, Award, Gauge, ArrowRight, CheckCircle2 } from 'lucide-react';
import { WorkshopSettings } from '../data/adminStore';

interface HeroSectionProps {
  settings: WorkshopSettings;
  onScrollToConfigurator: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, onScrollToConfigurator }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#0b0e14] via-[#0f141f] to-[#0b0e14] pt-8 pb-16 lg:pt-12 lg:pb-20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-red-600/10 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[300px] bg-amber-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main 2-column Hero split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Text & Proposition */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Tagline kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              <span>Wyspecjalizowany Punkt Wymiany Oleju</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Bez Zostawiania Auta na Cały Dzień</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.08] tracking-tight uppercase max-w-2xl text-balance">
              Wymiana oleju. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Szybko.</span> Profesjonalnie. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Bez kompromisów.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl text-slate-300 font-normal leading-relaxed max-w-xl text-balance">
              {settings.subtagline}
            </p>

            {/* Brand marketing slogan box */}
            <div className="mt-6 p-4 rounded-xl bg-slate-900/80 border border-slate-800/80 max-w-xl">
              <p className="text-sm sm:text-base font-semibold text-amber-300 italic flex items-center gap-2">
                <span className="text-amber-400 font-serif text-xl">“</span>
                {settings.tagline}
                <span className="text-amber-400 font-serif text-xl">”</span>
              </p>
              <div className="mt-2 text-xs text-slate-400 flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Wymiana oleju i filtra z inspekcją szczelności do {settings.expressTimeMinutes} minut*</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <button
                onClick={onScrollToConfigurator}
                className="px-8 py-4 text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer"
              >
                <span>Odbierz ofertę w kilkanaście minut</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#oleje"
                className="px-6 py-4 text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Poznaj 3 marki: Motul · Liqui Moly · Valvoline</span>
              </a>
            </div>

            {/* Unboxed metadata trust markers */}
            <div className="mt-8 flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-6 border-t border-slate-800/60">
              <span className="font-semibold text-slate-300">Czas operacyjny: do 27 min*</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>100% zgodności z aprobatami producentów</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Zero ukrytych opłat</span>
            </div>

          </div>

          {/* Right Column: High Quality Workshop Visual */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/skoda_lift_sw_plate_1793804390969.jpg"
                alt="Wymiana oleju na podnośniku – Skoda na śląskich tablicach rejestracyjnych SW w serwisie ZMIANAOLEJU.pl"
                referrerPolicy="no-referrer"
                className="w-full h-[380px] sm:h-[440px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle measured scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />

              {/* Float badge bottom */}
              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-xl bg-slate-950/85 backdrop-blur-md border border-slate-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-amber-400 font-bold">Standard Obsługi</div>
                  <div className="text-sm font-bold text-white mt-0.5">Stanowisko ekspresowe & klucz dynamometryczny</div>
                </div>
                <div className="text-right">
                  <div className="font-heading font-black text-2xl text-amber-400 tabular-nums">do 27 min*</div>
                  <div className="text-[11px] text-slate-400">czas operacyjny</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width KPI / Value Strip below hero split */}
        <div className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-white tabular-nums">do 27 min*</div>
                <div className="text-xs text-slate-400 mt-0.5">Ekspresowa wymiana na poczekaniu</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-white">Tylko 3 marki</div>
                <div className="text-xs text-slate-400 mt-0.5">Motul · Liqui Moly · Valvoline</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-white">100% Normy OEM</div>
                <div className="text-xs text-slate-400 mt-0.5">Dobór zgodny z katalogiem fabrycznym</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Gauge className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-white">Oferta w 15 min</div>
                <div className="text-xs text-slate-400 mt-0.5">Dedykowana wycena w kilkanaście minut</div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
