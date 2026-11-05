import React from 'react';
import { ShieldAlert, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { ServicePrices } from '../data/adminStore';
import metalGuardImg from '../assets/images/engine_metal_guard_1793544075865.jpg';

interface AddonsSectionProps {
  prices: ServicePrices;
  onScrollToConfigurator: () => void;
}

export const AddonsSection: React.FC<AddonsSectionProps> = ({ prices, onScrollToConfigurator }) => {
  return (
    <section id="ochrona-silnika" className="py-16 lg:py-24 bg-[#0b0e14] relative border-t border-slate-800/80 scroll-mt-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Usługi Dodatkowe i Profilaktyka</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Rzetelna Inżynieria Bez Magicznych Obietnic</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase text-balance">
            Dodatkowa ochrona silnika: Płukanie & Metal Guard
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Nawet najlepszy olej nie rozwinie 100% swoich właściwości, jeśli zostanie wlany do silnika zanieczyszczonego nagarem. Sprawdź dwie profesjonalne procedury, które wydłużają bezawaryjną pracę jednostki napędowej.
          </p>
        </div>

        {/* 2 Big Feature Cards with Hero Visual in between / grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Card 1: Płukanie silnika (Col 1-6) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Profilaktyka układu smarowania
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black text-amber-300">
                  +49 zł
                </span>
              </div>

              <h3 className="font-heading text-2xl font-bold text-white mt-5">
                Profesjonalne płukanie silnika (Engine Flush)
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mt-3">
                W trakcie eksploatacji w oleju gromadzą się produkty utleniania, sadza i nagary, które oblepiają pierścienie tłokowe oraz kanały hydraulicznych popychaczy i zmiennych faz rozrządu (np. VANOS, VVT-i).
              </p>

              <div className="mt-6 space-y-3">
                <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Rzeczywiste korzyści techniczne:
                </div>
                
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Uwolnienie zapieczonych pierścieni:</strong> Przywraca prawidłową kompresję cylindrów i ogranicza niepożądane spalanie oleju.</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>Czysta baza pod nowy olej:</strong> Świeży olej MOTUL, LIQUI MOLY lub VALVOLINE nie musi natychmiast neutralizować starych kwasów i szlamu.</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span><strong>100% bezpieczeństwa dla uszczelnień:</strong> Stosujemy wyłącznie atestowaną chemię warsztatową neutralną dla elastomerów i gumowych uszczelek.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Procedura: Preparat wlewany jest do starego oleju na ok. 10 minut pracy jałowej tuż przed spuszczeniem.
            </div>
          </div>

          {/* Card 2: Metal Guard (Col 7-12) */}
          <div className="lg:col-span-6 p-8 rounded-3xl bg-slate-900/50 border border-slate-800/80 flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                  Nanotechnologiczny modyfikator tarcia
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-black text-amber-300">
                  +69 zł
                </span>
              </div>

              <h3 className="font-heading text-2xl font-bold text-white mt-5">
                Metal Guard – Zaawansowana ochrona silnika
              </h3>
              
              <p className="text-slate-300 text-sm leading-relaxed mt-3">
                Do 75% zużycia silnika następuje podczas fazy rozruchu na zimno oraz w trakcie pracy systemu Start-Stop, zanim pompa oleju wytworzy pełne ciśnienie hydrodynamiczne. Metal Guard zapobiega tarciu suchemu.
              </p>

              <div className="mt-6 space-y-3">
                <div className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                  Działanie potwierdzone tribologicznie:
                </div>
                
                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Nanoceramiczna warstwa poślizgowa:</strong> Wypełnia mikroskopijne nierówności na panewkach wału korbowego i krzywkach wałków rozrządu.</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Bezpieczny rozruch w mrozach:</strong> Zabezpiecza węzły tarcia w pierwszych sekundach po uruchomieniu silnika przy niskich temperaturach.</span>
                </div>

                <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span><strong>Pełna neutralność DPF/GPF:</strong> Związek nie zawiera popiołów siarczanowych (SAPS) ani cząstek stałych zatykających filtry spalin.</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-800 text-xs text-slate-400">
              Aplikacja: Dodawany do świeżego oleju silnikowego podczas napełniania układu smarowania.
            </div>
          </div>

        </div>

        {/* Visual Showcase Card with Generated Camshaft Image */}
        <div className="mt-10 rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
            <div className="lg:col-span-5 relative h-64 lg:h-80">
              <img
                src={metalGuardImg}
                onError={(e) => {
                  e.currentTarget.src = '/images/engine_metal_guard_1793544075865.jpg';
                }}
                alt="Ochrona elementów silnika powłoką Metal Guard"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0f141f] hidden lg:block" />
            </div>

            <div className="lg:col-span-7 p-6 sm:p-8">
              <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">
                Inżynierskie podejście ZMIANAOLEJU.pl
              </div>
              <h4 className="font-heading text-xl sm:text-2xl font-black text-white mt-1">
                Zero fałszywych obietnic, 100% fizyki i chemii
              </h4>
              <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mt-3">
                Nie obiecujemy cudownego "odbudowania zużytego silnika" ani "spadku spalania o 30%". Dbamy o rzetelną ochronę przed przyspieszonym zużyciem mechanicznym. Obie usługi możesz zaznaczyć jednym kliknięciem w naszym konfiguratorze.
              </p>

              <div className="mt-5">
                <button
                  onClick={onScrollToConfigurator}
                  className="px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider inline-flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>Dodaj ochronę w konfiguratorze</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
