import React from 'react';
import { Clock, ShieldCheck, Award, Gauge, ArrowRight, CheckCircle2, Tag } from 'lucide-react';
import { WorkshopSettings } from '../data/adminStore';
import skodaLiftImg from '../assets/images/skoda_lift_sw_plate_1793804390969.jpg';

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
            {/* Tagline kicker */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-4">
              <span>Wyspecjalizowany Punkt Wymiany Oleju</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">Bez Zostawiania Auta na Cały Dzień</span>
            </div>

            {/* Main Headline Container with Tilted Price Tag Badge */}
            <div className="relative mt-2">
              
              {/* Metka z ceną – pod kątem w stronę napisu, poniżej kickera */}
              <div className="inline-flex sm:absolute top-0 sm:top-0 lg:top-1 right-0 sm:right-2 lg:-right-2 mb-4 sm:mb-0 transform -rotate-3 sm:-rotate-6 hover:-rotate-2 transition-transform duration-300 z-20 group max-w-full">
                <div className="relative flex items-center gap-2 sm:gap-2.5 bg-gradient-to-br from-amber-300 via-amber-400 to-yellow-400 text-slate-950 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl shadow-xl shadow-amber-500/40 border border-yellow-100/90 cursor-default select-none">
                  
                  {/* Oczko metki z sznurkiem w stronę napisu */}
                  <div className="relative flex items-center justify-center shrink-0">
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-amber-700/80 shadow-inner flex items-center justify-center">
                      <div className="w-0.5 h-0.5 rounded-full bg-amber-400/60" />
                    </div>
                    {/* Sznurek metki skierowany w stronę napisu */}
                    <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-0.5 bg-amber-200/90 -rotate-45 hidden sm:block" />
                  </div>

                  <div className="flex flex-col">
                    <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-wider text-amber-950/80 leading-none flex items-center gap-1">
                      <Tag className="w-2.5 h-2.5 text-amber-950 stroke-[2.5]" />
                      Wymiana ekspresowa
                    </span>
                    <span className="text-base sm:text-xl lg:text-2xl font-black font-heading tracking-tight text-slate-950 leading-tight">
                      Już od <span className="text-red-700 underline decoration-red-600 decoration-2 underline-offset-2">69 zł!</span>
                    </span>
                  </div>

                  {/* Odznaka HIT */}
                  <span className="bg-red-600 text-white font-black text-[9px] sm:text-[10px] uppercase px-1.5 py-0.5 rounded shadow-sm ml-0.5 tracking-wider">
                    HIT
                  </span>

                  {/* Pulsujący punkt na rogu metki */}
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border border-white"></span>
                  </span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="font-heading text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-[1.12] sm:leading-[1.08] tracking-tight uppercase max-w-2xl text-balance break-words">
                Wymiana oleju. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Szybko.</span> Profesjonalnie. <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-rose-500">Bez kompromisów.</span>
              </h1>
            </div>

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
                className="px-6 sm:px-8 py-3.5 sm:py-4 text-xs sm:text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-xl shadow-amber-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 whitespace-nowrap cursor-pointer text-center"
              >
                <span>Odbierz ofertę w kilkanaście minut</span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </button>

              <a
                href="#oleje"
                className="px-5 sm:px-6 py-3.5 sm:py-4 text-xs sm:text-sm font-semibold text-slate-200 hover:text-white bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 rounded-xl transition-colors flex items-center justify-center gap-2 whitespace-normal sm:whitespace-nowrap text-center"
              >
                <span>Poznaj 3 marki: Motul · Liqui Moly · Valvoline</span>
              </a>
            </div>

            {/* Unboxed metadata trust markers */}
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-slate-400 pt-6 border-t border-slate-800/60">
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
                src={skodaLiftImg}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes('public/images')) {
                    target.src = '/images/skoda_lift_sw_plate_1793804390969.jpg';
                  }
                }}
                alt="Wymiana oleju na podnośniku – Skoda na śląskich tablicach rejestracyjnych SW w serwisie ZMIANAOLEJU.pl"
                loading="eager"
                referrerPolicy="no-referrer"
                className="w-full h-[290px] xs:h-[340px] sm:h-[440px] lg:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* Subtle measured scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent pointer-events-none" />

              {/* Float badge bottom */}
              <div className="absolute bottom-3 sm:bottom-5 left-3 sm:left-5 right-3 sm:right-5 p-3 sm:p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800/80 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] sm:text-xs uppercase tracking-widest text-amber-400 font-bold">Standard Obsługi</div>
                  <div className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">Stanowisko ekspresowe & klucz Nm</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="font-heading font-black text-xl sm:text-2xl text-amber-400 tabular-nums">do 27 min*</div>
                  <div className="text-[10px] sm:text-[11px] text-slate-400">czas operacyjny</div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Full-width KPI / Value Strip below hero split */}
        <div className="mt-12 sm:mt-14 pt-8 sm:pt-10 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          
          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-white tabular-nums">do 27 min*</div>
                <div className="text-xs text-slate-400 mt-0.5">Ekspresowa wymiana na poczekaniu</div>
                <div className="text-[11px] text-amber-400/80 mt-1 leading-tight">*bez płukania silnika i dodatku Metal Guard</div>
              </div>
            </div>
          </div>

          <div className="p-5 rounded-xl bg-slate-900/40 border border-slate-800/60">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <div className="font-heading font-black text-2xl text-white">Topowe Marki OLEJU</div>
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
