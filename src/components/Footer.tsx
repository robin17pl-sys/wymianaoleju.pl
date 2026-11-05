import React from 'react';
import { WorkshopSettings } from '../data/adminStore';

interface FooterProps {
  settings: WorkshopSettings;
  onOpenAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ settings, onOpenAdmin }) => {
  return (
    <footer className="bg-[#07090e] border-t border-slate-800 text-slate-400 text-xs">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-rose-600 p-[1.5px] shadow-lg shadow-amber-500/20">
                <div className="w-full h-full bg-[#0d121c] rounded-[10px] flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/15 to-rose-600/10 pointer-events-none" />
                  <svg className="w-5 h-5 text-amber-400" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="url(#footer-drop-gradient)" />
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M9.5 10.5h4.5l-4 5h4.5" stroke="#0b0e14" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    <defs>
                      <linearGradient id="footer-drop-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#e11d48" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <div className="flex items-baseline">
                  <span className="font-heading text-xl font-black tracking-tight text-white uppercase leading-none">
                    ZMIANAOLEJU
                  </span>
                  <span className="font-heading text-xl font-black tracking-tight text-amber-400 leading-none">
                    .pl
                  </span>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-400 leading-tight mt-1">
                  Express Oil Service
                </span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Wyspecjalizowany punkt ekspresowej wymiany oleju silnikowego i filtrów. Dedykowany dobór według norm fabrycznych producenta. Tylko 3 elitarne marki: Motul, Liqui Moly i Valvoline.
            </p>

            <div className="text-[11px] text-amber-400 font-semibold italic">
              „Twój silnik zasługuje na najlepszy olej. My zadbamy o resztę!”
            </div>
          </div>

          {/* Szybkie linki */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Nawigacja
            </div>
            <ul className="space-y-2">
              <li>
                <a href="#konfigurator" className="hover:text-amber-400 transition-colors">
                  Dobór oleju i wycena (oferta w 15 min)
                </a>
              </li>
              <li>
                <a href="#dlaczego-my" className="hover:text-amber-400 transition-colors">
                  Dlaczego my (do 27 min)
                </a>
              </li>
              <li>
                <a href="#oleje" className="hover:text-amber-400 transition-colors">
                  Motul · Liqui Moly · Valvoline
                </a>
              </li>
              <li>
                <a href="#ochrona-silnika" className="hover:text-amber-400 transition-colors">
                  Metal Guard & Płukanie
                </a>
              </li>
              <li>
                <a href="#kontakt" className="hover:text-amber-400 transition-colors">
                  Kontakt i dojazd
                </a>
              </li>
            </ul>
          </div>

          {/* Certyfikowane marki */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Topowe Marki OLEJU
            </div>
            <ul className="space-y-2">
              <li className="text-slate-300">
                <strong className="text-white">MOTUL:</strong> 8100 X-clean+, X-cess, Specific
              </li>
              <li className="text-slate-300">
                <strong className="text-white">LIQUI MOLY:</strong> Top Tec 4200, 4600, Special Tec
              </li>
              <li className="text-slate-300">
                <strong className="text-white">VALVOLINE:</strong> SynPower XL-III, MST, Hybrid
              </li>
              <li className="pt-2 text-[11px] text-slate-500">
                Brak tanich zamienników marketowych.
              </li>
            </ul>
          </div>

          {/* Kontakt & Lokalizacja */}
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-200 mb-3">
              Serwis i Kontakt
            </div>
            <div className="space-y-2 text-xs">
              <div>{settings.addressStreet}</div>
              <div>{settings.addressPostalCode} {settings.addressCity}</div>
              <div className="text-amber-400 font-mono font-bold mt-1">{settings.phone}</div>
              <div className="text-slate-400">{settings.email}</div>
              <div className="pt-2 text-[11px] text-slate-500">
                Pn–Pt: {settings.workingHoursWeekday}
              </div>
            </div>
          </div>

        </div>

        {/* SEO Tagline Cluster & Copyright Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} ZMIANAOLEJU.pl Express Oil Service. Wszelkie prawa zastrzeżone.
          </div>

          {/* Natural SEO search phrase anchors */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-slate-500">
            <span>Wymiana oleju silnikowego</span>
            <span>·</span>
            <span>Szybka wymiana oleju</span>
            <span>·</span>
            <span>Wymiana oleju i filtra</span>
            <span>·</span>
            <span>Wymiana oleju Motul</span>
            <span>·</span>
            <span>Wymiana oleju Liqui Moly</span>
            <span>·</span>
            <span>Wymiana oleju Valvoline</span>
            <span>·</span>
            <span>Profesjonalna wymiana oleju</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
