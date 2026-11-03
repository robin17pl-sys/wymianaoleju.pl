import React from 'react';
import { Target, Clock, ShieldCheck, Cpu, DollarSign, Recycle, CheckCircle } from 'lucide-react';

export const WhyUsSection: React.FC = () => {
  const advantages = [
    {
      icon: Target,
      title: 'Wyłączna wąska specjalizacja',
      description: 'Nie jesteśmy typowym warsztatem. Nie naprawiamy zawieszeń, nie robimy blacharki ani remontów. Skupiamy się w 100% na wymianie oleju i filtrów, doprowadzając tę czynność do absolutnej perfekcji.',
      highlight: '100% focus na olejach'
    },
    {
      icon: Clock,
      title: 'Ekspresowa obsługa w 27 minut',
      description: 'Koniec z zostawianiem samochodu w warsztacie od rana do wieczora. Wjeżdżasz o umówionej godzinie, a po około 27 minutach wyjeżdżasz z nowym olejem, zresetowaną inspekcją i wpisem do książki.',
      highlight: 'Nawet 27 minut'
    },
    {
      icon: ShieldCheck,
      title: 'Tylko 3 elitarne marki olejowe',
      description: 'Żadnych tanich zamienników marketowych ani nieznanych rozlewni. Stosujemy wyłącznie certyfikowane produkty marek MOTUL, LIQUI MOLY i VALVOLINE bezpośrednio z oficjalnych kanałów dystrybucji.',
      highlight: 'Motul · Liqui Moly · Valvoline'
    },
    {
      icon: Cpu,
      title: 'Dobór według ścisłych norm OEM',
      description: 'Nie dobieramy oleju "na oko" ani wyłącznie po lepkości 5W30. Weryfikujemy normy fabryczne producenta Twojego silnika (np. VW 507.00, BMW LL-04, MB 229.52, Ford 948-B) według katalogu MOTUL.',
      highlight: 'Aprobaty fabryczne'
    },
    {
      icon: Clock,
      title: 'Dedykowana oferta w kilkanaście minut',
      description: 'Po podaniu parametrów samochodu w ciągu kilkunastu minut otrzymujesz pełną, spersonalizowaną kalkulację doboru oleju i filtrów. Żadnych niespodzianek na miejscu.',
      highlight: 'Oferta w kilkanaście min'
    },
    {
      icon: Recycle,
      title: 'Darmowa utylizacja zużytego oleju',
      description: 'U nas nie płacisz dodatkowo za utylizację oleju ani zużytego filtra. Całość odbierana jest w cenie usługi i przekazywana do certyfikowanego recyklingu w 100% legalnie i ekologicznie.',
      highlight: '0 zł za utylizację'
    }
  ];

  return (
    <section id="dlaczego-my" className="py-16 lg:py-24 bg-[#0b0e14] relative scroll-mt-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Dlaczego Warto Wybrać ZMIANAOLEJU.pl</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Specjalista Zamiast Przypadkowego Warsztatu</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase text-balance">
            Dlaczego jesteśmy lepsi od tradycyjnego mechanika?
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Wymiana oleju to najważniejsza czynność serwisowa dla żywotności silnika. Nie powinna być robiona przy okazji w brudnym garażu, lecz w sterylnym, wyspecjalizowanym punkcie szybkiej obsługi.
          </p>
        </div>

        {/* 6 Advantages Asymmetric Bento / Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {advantages.map((adv, index) => {
            const Icon = adv.icon;
            return (
              <div
                key={index}
                className="p-7 rounded-2xl bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-amber-400 tracking-wider">
                      {adv.highlight}
                    </span>
                  </div>

                  <h3 className="font-heading text-xl font-bold text-white mb-2.5">
                    {adv.title}
                  </h3>

                  <p className="text-slate-400 text-sm leading-relaxed">
                    {adv.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-500">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Standard jakości ZMIANAOLEJU.pl Express</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
