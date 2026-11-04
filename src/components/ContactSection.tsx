import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Navigation, Send, CheckCircle2 } from 'lucide-react';
import { WorkshopSettings } from '../data/adminStore';

interface ContactSectionProps {
  settings: WorkshopSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [formSent, setFormSent] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) return;
    setFormSent(true);
    
    // Mailto dispatch directed to dreamstudiopl@gmail.com
    try {
      const subject = encodeURIComponent(`[ZMIANAOLEJU.pl] Zapytanie techniczne: ${formData.name} (${formData.phone})`);
      const body = encodeURIComponent(
        `Imię: ${formData.name}\nNumer telefonu: ${formData.phone}\nAdres e-mail: ${formData.email || 'Nie podano'}\n\nTreść zapytania / dane auta:\n${formData.message || 'Prośba o szybki kontakt i konsultację techniczną.'}`
      );
      const mailtoUrl = `mailto:dreamstudiopl@gmail.com?subject=${subject}&body=${body}`;
      window.location.href = mailtoUrl;
    } catch {
      // safe fallback
    }
  };

  const fullAddress = `${settings.addressStreet}, ${settings.addressPostalCode} ${settings.addressCity}`;
  const navigationUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="kontakt" className="py-16 lg:py-24 bg-[#090c12] relative border-t border-slate-800/80 scroll-mt-16">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Punkt Obsługi i Dojazd</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Wygodna Lokalizacja z Własnym Parkingiem</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase text-balance">
            Kontakt i lokalizacja serwisu
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed text-balance">
            Odwiedź nas osobiście lub skontaktuj się telefonicznie. Obsługujemy pojazdy bez zbędnego czekania.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Workshop Details & Working Hours */}
          <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
            
            <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-6">
              
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Adres warsztatu
                  </div>
                  <div className="font-heading font-bold text-lg text-white mt-1">
                    {settings.addressStreet}
                  </div>
                  <div className="text-sm text-slate-300">
                    {settings.addressPostalCode} {settings.addressCity}
                  </div>
                  <a
                    href={navigationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Nawiguj do serwisu (Google Maps)</span>
                  </a>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Infolinia i rezerwacje
                  </div>
                  <a
                    href={`tel:${settings.phone.replace(/\s+/g, '')}`}
                    className="font-heading font-black text-xl text-white hover:text-amber-400 transition-colors mt-1 block tabular-nums"
                  >
                    {settings.phone}
                  </a>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Możliwość rezerwacji telefonicznej lub przez formularz online
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                    Adres e-mail
                  </div>
                  <a
                    href="mailto:dreamstudiopl@gmail.com"
                    className="font-bold text-sm text-amber-400 hover:text-amber-300 transition-colors mt-1 block"
                  >
                    dreamstudiopl@gmail.com
                  </a>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-slate-800/80">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div className="w-full">
                  <div className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
                    Godziny otwarcia
                  </div>
                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Poniedziałek – Piątek:</span>
                      <span className="font-semibold text-white">07:30 – 19:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sobota:</span>
                      <span className="font-semibold text-white">08:00 – 15:00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Niedziela:</span>
                      <span className="text-rose-400">Zamknięte</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Quick Contact Form */}
            <div className="p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
              <h3 className="font-heading text-lg font-bold text-white mb-2">
                Masz nietypowe auto lub pytanie?
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Napisz do naszego zespołu technicznego (dreamstudiopl@gmail.com) – odpowiadamy w ciągu kilkunastu minut.
              </p>

              {formSent ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs space-y-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span>Dziękujemy! Wiadomość skierowana na adres dreamstudiopl@gmail.com</span>
                  </div>
                  <p className="text-[11px] text-slate-400 pl-6">
                    Nasz doradca skontaktuje się z Tobą telefonicznie lub mailowo najszybciej jak to możliwe.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Twoje imię"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Numer telefonu"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <input
                    type="email"
                    placeholder="Adres e-mail (opcjonalnie)"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                  />
                  <textarea
                    rows={2}
                    placeholder="Model samochodu, rocznik lub pytanie o normę oleju..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Wyślij zapytanie techniczne</span>
                  </button>
                </form>
              )}
            </div>

          </div>

          {/* Right Column: Interactive Map Display & Facility Visual */}
          <div className="lg:col-span-7 flex flex-col justify-between">
            <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl h-full min-h-[460px] relative flex flex-col">
              
              {/* Map iframe embed */}
              <div className="flex-1 w-full h-full relative">
                <iframe
                  title="Lokalizacja serwisu ZMIANAOLEJU.pl"
                  src={settings.googleMapsEmbedUrl}
                  className="w-full h-full border-0 filter grayscale contrast-125 opacity-85"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

                {/* Pin callout banner on map */}
                <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-sm p-4 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 shadow-xl">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-amber-400 animate-pulse" />
                    <span className="font-heading font-black text-sm text-white tracking-wider uppercase">
                      {settings.companyName}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 mt-1">
                    {fullAddress} · Wjazd bezpośrednio z głównej arterii
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <a
                      href={navigationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-amber-400 text-black text-[11px] font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                    >
                      <Navigation className="w-3 h-3" />
                      <span>Uruchom nawigację</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Bottom bar */}
              <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Wygodny podjazd dla aut o niskim prześwicie i SUV-ów
                </span>
                <span className="text-slate-300 font-medium">
                  Czas oczekiwania na wolne stanowisko: 0 min (po rezerwacji)
                </span>
              </div>

            </div>

            {/* Disclaimer under map as requested */}
            <p className="mt-3 text-xs text-slate-400 italic text-center sm:text-left flex items-start gap-1.5 px-1">
              <span className="text-amber-400 font-bold text-sm leading-none shrink-0">*</span>
              <span>Wymiana oleju do 27 min nie obejmuje płukania silnika i zastosowania Metal Guard.</span>
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
