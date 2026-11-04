import React from 'react';
import { Car, Droplet, DollarSign, Clock, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onScrollToConfigurator: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onScrollToConfigurator }) => {
  const steps = [
    {
      step: '01',
      title: 'Wybierasz samochód',
      description: 'Wskazujesz markę, model, generację i kod silnika w naszym konfiguratorze. Baza danych pobiera dokładną specyfikację fabryczną.',
      icon: Car
    },
    {
      step: '02',
      title: 'Dobierasz olej',
      description: 'System automatycznie weryfikuje aprobaty OEM i normy fabryczne. Ty wybierasz ulubioną markę: MOTUL, LIQUI MOLY lub VALVOLINE.',
      icon: Droplet
    },
    {
      step: '03',
      title: 'Oferta w kilkanaście minut',
      description: 'Po przesłaniu parametrów pojazdu w ciągu kilkunastu minut otrzymujesz pełną kalkulację doboru oleju, filtra oraz wycenę robocizny.',
      icon: Clock
    },
    {
      step: '04',
      title: 'Przyjeżdżasz na wymianę',
      description: 'Umawiasz wizytę online na konkretną godzinę. Wymiana trwa do 27 minut* – pijesz pyszną kawę i ruszasz w dalszą trasę.',
      icon: Clock
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-[#090c12] relative border-t border-slate-800/80">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Szybki i Przejrzysty Proces</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Bez Telefonów i Zgadywania Kosztów</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase text-balance">
            Jak to działa? Prosty proces w 4 krokach
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Zaprojektowaliśmy nasz serwis tak, aby oszczędzać Twój czas. Zobacz, jak łatwo zadbać o serce Twojego samochodu.
          </p>
        </div>

        {/* 4 Steps Row with Connecting Lines */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {steps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx}
                className="p-7 rounded-2xl bg-slate-900/40 border border-slate-800/70 hover:border-slate-700 transition-all relative flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-heading font-black text-3xl text-slate-700 group-hover:text-amber-400 transition-colors">
                      {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700/80 flex items-center justify-center text-amber-400">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="font-heading text-lg font-bold text-white mb-2">
                    {item.title}
                  </h3>

                  <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 text-[11px] text-slate-500 font-medium">
                  Krok {idx + 1} z 4
                </div>
              </div>
            );
          })}

        </div>

        {/* Bottom CTA trigger */}
        <div className="mt-12 text-center">
          <button
            onClick={onScrollToConfigurator}
            className="inline-flex items-center gap-2 px-8 py-4 text-xs font-bold uppercase tracking-wider text-black bg-amber-400 hover:bg-amber-300 rounded-xl shadow-lg shadow-amber-500/20 transition-all hover:scale-[1.02] cursor-pointer"
          >
            <span>Wypełnij formularz i otrzymaj ofertę w kilkanaście minut</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </section>
  );
};
