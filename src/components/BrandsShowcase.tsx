import React, { useState } from 'react';
import { ShieldCheck, Award, Flag, Check, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface BrandsShowcaseProps {
  onSelectBrandForConfigurator?: (brand: 'Motul' | 'Liqui Moly' | 'Valvoline') => void;
}

export const BrandsShowcase: React.FC<BrandsShowcaseProps> = ({ onSelectBrandForConfigurator }) => {
  const [activeTab, setActiveTab] = useState<'Motul' | 'Liqui Moly' | 'Valvoline'>('Motul');

  const brandData = {
    Motul: {
      name: 'MOTUL',
      country: 'Francja',
      founded: '1853 r.',
      flag: '🇫🇷',
      tagline: 'Pionier syntetyków estrowych i motorsportowych',
      image: '/src/assets/images/oil_showcase_motul_1793544075473.jpg',
      accentColor: 'from-red-600 to-rose-700',
      borderAccent: 'border-red-500/50',
      badgeBg: 'bg-red-500/10 text-red-400 border-red-500/20',
      description: 'Francuski gigant technologiczny z ponad 170-letnią tradycją. Motul jako pierwszy na świecie stworzył w 100% syntetyczny olej silnikowy oparty na estrach roślinnych. Oficjalny partner techniczny wyścigu 24h Le Mans, Rajdu Dakar i setek zespołów GT.',
      highlights: [
        'Technologia 8100 & Ester Core® gwarantująca zerowe zrywanie filmu olejowego przy ekstremalnych temperaturach',
        'Oficjalne aprobaty OEM: Porsche, BMW Longlife, Mercedes-Benz, VAG, Renault, Ford',
        'Znakomita czystość pierścieni tłokowych i turbosprężarki w silnikach wysilonych'
      ],
      flagshipSeries: 'Seria 8100 X-clean+, 8100 X-cess Gen2, Specific OEM',
      idealFor: 'Kierowcy ceniący maksymalne osiągi, dynamiczną jazdę autostradową i bezkompromisową czystość silnika.'
    },
    'Liqui Moly': {
      name: 'LIQUI MOLY',
      country: 'Niemcy',
      founded: '1957 r.',
      flag: '🇩🇪',
      tagline: 'Bezkompromisowa niemiecka inżynieria i pakiety dodatków',
      image: '/src/assets/images/oil_showcase_liquimoly_1793544075543.jpg',
      accentColor: 'from-blue-600 to-indigo-700',
      borderAccent: 'border-blue-500/50',
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      description: 'Niemiecka marka numer 1 według corocznych rankingów zaufania kierowców. Produkcja odbywa się wyłącznie w Niemczech (Ulm i Saarlouis). Słynie z bezkonkurencyjnych baz olejowych i najbardziej zaawansowanych technologicznie pakietów uszlachetniających.',
      highlights: [
        'Certyfikat Made in Germany – 100% produkcji w fabrykach w Ulm i Saarlouis',
        'Wiodąca ochrona przed zjawiskiem LSPI (Low Speed Pre-Ignition) w silnikach z bezpośrednim wtryskiem paliwa',
        'Pakiety przeciwzużyciowe redukujące tarcie i odczuwalnie wyciszające pracę jednostki'
      ],
      flagshipSeries: 'Seria Top Tec (4200, 4600, 6200), Special Tec, Molygen New Generation',
      idealFor: 'Właściciele aut marek premium (Audi, BMW, Mercedes, Porsche) oraz silników wymagających absolutnie cichej pracy.'
    },
    Valvoline: {
      name: 'VALVOLINE',
      country: 'USA / Europa',
      founded: '1866 r.',
      flag: '🇺🇸',
      tagline: 'Najstarsza marka olejowa świata – ponad 150 lat innowacji',
      image: '/src/assets/images/oil_showcase_valvoline_1793544076223.jpg',
      accentColor: 'from-blue-700 to-red-600',
      borderAccent: 'border-amber-500/50',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      description: 'Historia nowoczesnego oleju silnikowego zaczęła się od Dr. Johna Ellisa w 1866 roku. Valvoline to ponad półtora wieku niezrównanego doświadczenia w smarowaniu silników spalinowych, legendarny partner amerykańskiego NASCAR i europejskich serii wyścigowych.',
      highlights: [
        'Wyjątkowa odporność formulacji SynPower na degradację termiczną i ścinanie lepkościowe',
        'Zaawansowane detergenty neutralizujące szkodliwe kwasy spalania w nowoczesnych dieslach i hybrydach',
        'Pewna ochrona łańcucha rozrządu i panewek w zmiennych cyklach miejsko-autostradowych'
      ],
      flagshipSeries: 'Seria SynPower (XL-III, MST, FE) oraz zaawansowana linia Valvoline Hybrid',
      idealFor: 'Kierowcy poszukujący sprawdzonej, legendarnej ochrony silnika na dalekie trasy i bezawaryjnej eksploatacji.'
    }
  };

  const current = brandData[activeTab];

  return (
    <section id="oleje" className="py-16 lg:py-24 bg-[#090c12] relative border-t border-slate-800/80 scroll-mt-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Zasada Świadomego Wyboru</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Bez Kompromisów i Taniego Masowego Towaru</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase text-balance">
            Tylko trzy renomowane marki olejów
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Świadomie odrzucamy masowe oleje marketowe oraz niezweryfikowane rozlewnie. W naszym punkcie stosujemy wyłącznie certyfikowane, oryginalne produkty trzech elitych producentów: <strong className="text-white">MOTUL</strong>, <strong className="text-white">LIQUI MOLY</strong> oraz <strong className="text-white">VALVOLINE</strong>.
          </p>
        </div>

        {/* 3-Brand Selector Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex p-1.5 bg-slate-900 border border-slate-800 rounded-2xl gap-2 shadow-xl">
            {(['Motul', 'Liqui Moly', 'Valvoline'] as const).map((brand) => (
              <button
                key={brand}
                onClick={() => setActiveTab(brand)}
                className={`px-6 py-3 rounded-xl text-sm font-bold tracking-wider uppercase transition-all cursor-pointer ${
                  activeTab === brand
                    ? 'bg-gradient-to-r from-slate-800 to-slate-700 text-amber-400 shadow-md border border-slate-700'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {brand}
              </button>
            ))}
          </div>
        </div>

        {/* Brand Detail Interactive Showcase Card */}
        <div className="rounded-3xl bg-slate-900/50 border border-slate-800/80 overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            
            {/* Left Col: Studio Product Photography */}
            <div className="lg:col-span-5 relative min-h-[350px] lg:min-h-full bg-slate-950 flex items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-slate-800">
              <img
                src={current.image}
                alt={`Dedykowany olej silnikowy ${current.name}`}
                referrerPolicy="no-referrer"
                className="w-full h-full max-h-[420px] object-cover rounded-2xl shadow-xl transition-all duration-500 hover:scale-105"
              />
              <div className="absolute top-8 left-8 px-3.5 py-1.5 rounded-lg bg-black/80 backdrop-blur-md border border-slate-700 text-xs font-bold text-white flex items-center gap-2">
                <span>{current.flag}</span>
                <span>{current.country}</span>
                <span className="text-slate-500">·</span>
                <span className="text-amber-400">od {current.founded}</span>
              </div>
            </div>

            {/* Right Col: Deep Technical Story & Advantages */}
            <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-between">
              <div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-md text-xs font-bold border ${current.badgeBg}`}>
                    Gwarancja 100% Oryginalności
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    Bezpośredni dystrybutor
                  </span>
                </div>

                <h3 className="font-heading text-3xl sm:text-4xl font-black text-white mt-4 uppercase">
                  {current.name}
                </h3>
                
                <p className="text-sm sm:text-base font-semibold text-amber-400 mt-1">
                  {current.tagline}
                </p>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mt-4">
                  {current.description}
                </p>

                {/* Highlights */}
                <div className="mt-6 space-y-3">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Dlaczego wybraliśmy {current.name}:
                  </div>
                  {current.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 text-xs sm:text-sm text-slate-200">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>

                {/* Series Info */}
                <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs">
                  <div className="text-slate-400">Główne linie stosowane w serwisie:</div>
                  <div className="text-slate-100 font-bold mt-1">{current.flagshipSeries}</div>
                  <div className="text-amber-300 mt-2 italic">Dla kogo: {current.idealFor}</div>
                </div>

              </div>

              {/* Action Button */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Dostępny w inteligentnym konfiguratorze wyceny
                </div>
                <a
                  href="#konfigurator"
                  onClick={() => onSelectBrandForConfigurator?.(activeTab)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  <span>Wybierz {current.name} w konfiguratorze</span>
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

          </div>
        </div>

        {/* Why NO OTHER BRANDS notice */}
        <div className="mt-8 p-4 rounded-xl bg-slate-900/40 border border-slate-800/60 text-center text-xs text-slate-400">
          <p>
            <strong className="text-slate-200">Polityka Jakościowa ZMIANAOLEJU.pl:</strong> Nie posiadamy w ofercie marek Castrol, Shell, Mobil 1, K2 ani zamienników marketowych. Koncentracja na trzech zdefiniowanych producentach daje nam 100% pewności co do źródła pochodzenia partii olejowych i powtarzalnej jakości serwisowej.
          </p>
        </div>

      </div>
    </section>
  );
};
