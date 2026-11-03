import React, { useState } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Car, 
  Droplet, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  Mail, 
  User, 
  FileText,
  Sparkles,
  ArrowRight,
  Download,
  AlertCircle
} from 'lucide-react';
import { AppointmentBooking, ServicePrices, calculateQuotation, saveAdminStore, getAdminStore } from '../data/adminStore';
import { EngineOption, OilProductMatch } from '../data/vehicleDatabase';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialConfig?: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear?: string;
    vehicleFuel?: 'Benzyna' | 'Benzyna + LPG' | 'Diesel';
    vehicleEngine?: string;
    engine: EngineOption;
    selectedBrand: 'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr';
    selectedFilterBrand?: 'Filtron' | 'Bosch' | 'Hengst' | 'Własny filtr' | 'Własny olej i filtr';
    selectedProduct: OilProductMatch;
    includeFlush: boolean;
    includeMetalGuard: boolean;
    quotation: ReturnType<typeof calculateQuotation>;
  } | null;
  prices: ServicePrices;
  onBookingSuccess: (booking: AppointmentBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  initialConfig,
  prices,
  onBookingSuccess
}) => {
  if (!isOpen) return null;

  // Selected date & timeslot
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    // Tomorrow as default
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });

  const [selectedTime, setSelectedTime] = useState<string>('10:00');

  // Customer credentials
  const [clientName, setClientName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registrationPlate, setRegistrationPlate] = useState('');
  const [notes, setNotes] = useState('');

  // Confirmation state
  const [confirmedBooking, setConfirmedBooking] = useState<AppointmentBooking | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Available dates for the next 14 days
  const availableDates = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // starting tomorrow
    const iso = d.toISOString().split('T')[0];
    const dayName = d.toLocaleDateString('pl-PL', { weekday: 'short' });
    const formattedDate = d.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
    const isSunday = d.getDay() === 0;
    return { iso, dayName, formattedDate, isSunday };
  }).filter(d => !d.isSunday); // exclude sundays

  // Available daily hours
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  // Resolve config or fallback
  const config = initialConfig ?? {
    vehicleMake: 'Volkswagen',
    vehicleModel: 'Golf VII',
    vehicleYear: '2018',
    vehicleFuel: 'Diesel' as const,
    vehicleEngine: '2.0 TDI 150 KM',
    engine: {
      id: 'default',
      name: '2.0 TDI CR (150 KM)',
      fuel: 'Diesel' as const,
      displacement: '1968 cm³',
      powerHp: 150,
      oilCapacityLiters: 4.7,
      recommendedViscosity: '5W-30',
      oemStandards: ['VW 504.00 / 507.00'],
      serviceIntervalKm: '15 000 km',
      filterTier: 'Standard' as const,
      motulCatalogReference: 'Motul Catalog',
      products: {
        motul: {
          brand: 'Motul' as const,
          productName: '8100 X-clean+ 5W-30',
          series: '8100 Synthese-Technologie',
          viscosity: '5W-30',
          specs: ['VW 504.00 / 507.00'],
          description: 'Syntetyczny olej OEM.'
        },
        liquiMoly: {
          brand: 'Liqui Moly' as const,
          productName: 'Top Tec 4200 5W-30',
          series: 'Top Tec Formula',
          viscosity: '5W-30',
          specs: ['VW 504.00 / 507.00'],
          description: 'Niemiecka formulacja.'
        },
        valvoline: {
          brand: 'Valvoline' as const,
          productName: 'SynPower XL-III 5W-30',
          series: 'SynPower Synthetic',
          viscosity: '5W-30',
          specs: ['VW 504.00 / 507.00'],
          description: 'Dedykowana ochrona silnika.'
        }
      }
    },
    selectedBrand: 'Motul' as const,
    selectedProduct: {
      brand: 'Motul' as const,
      productName: 'Motul 8100 X-clean+ 5W-30',
      series: '8100 Synthese-Technologie',
      viscosity: '5W-30',
      specs: ['VW 504.00 / 507.00'],
      description: 'Zalecany olej fabryczny.'
    },
    includeFlush: true,
    includeMetalGuard: true,
    quotation: calculateQuotation(4.7, 'Standard', 'Motul', true, true, prices)
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !phone.trim()) return;

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const newBooking: AppointmentBooking = {
      id: `bk-${Date.now()}`,
      referenceNumber: `OIL-${new Date().getFullYear()}-${randomSuffix}`,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      date: selectedDate,
      timeSlot: selectedTime,
      clientName: clientName.trim(),
      phone: phone.trim(),
      email: email.trim() || 'brak-email@oilexx.pl',
      registrationPlate: registrationPlate.trim().toUpperCase() || 'DO USTALENIA',
      vehicleMake: config.vehicleMake,
      vehicleModel: config.vehicleYear ? `${config.vehicleModel} (${config.vehicleYear})` : config.vehicleModel,
      vehicleEngine: config.vehicleFuel ? `${config.vehicleEngine || config.engine.name} [${config.vehicleFuel}]` : config.engine.name,
      selectedOilBrand: config.selectedBrand,
      selectedFilterBrand: config.selectedBrand === 'Własny olej i filtr' ? 'Własny filtr' : (config.selectedFilterBrand || 'Filtron'),
      oilProductName: config.selectedProduct.productName,
      oilQuantityLiters: config.engine.oilCapacityLiters,
      includeEngineFlush: config.includeFlush,
      includeMetalGuard: config.includeMetalGuard,
      totalNetto: config.quotation.totalNetto,
      totalBrutto: config.quotation.totalBrutto,
      status: 'Potwierdzona',
      notes: notes.trim()
    };

    // Save into AdminStore persistence
    const store = getAdminStore();
    store.bookings.unshift(newBooking);
    saveAdminStore(store);

    setTimeout(() => {
      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      onBookingSuccess(newBooking);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-3xl my-8 bg-[#0f141f] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-5 bg-[#141a29] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-black font-extrabold flex items-center justify-center text-sm">
              <CalendarIcon className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight">
                {confirmedBooking ? 'Potwierdzenie Rezerwacji' : 'Rezerwacja Stanowiska Ekspresowego'}
              </h3>
              <p className="text-xs text-slate-400">
                {confirmedBooking ? 'Wizyta została pomyślnie zarejestrowana w systemie' : 'Czas wykonania: ok. 27 minut'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content body */}
        <div className="p-6 sm:p-8">
          
          {confirmedBooking ? (
            /* Confirmation Screen */
            <div className="text-center py-4 space-y-6">
              
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                  Rezerwacja Potwierdzona
                </span>
                <h4 className="font-heading text-2xl sm:text-3xl font-black text-white mt-1">
                  Do zobaczenia na stanowisku!
                </h4>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md mx-auto">
                  Twój termin został zablokowany. Wysłano automatyczne powiadomienie SMS oraz e-mail z podsumowaniem i linkiem do nawigacji.
                </p>
              </div>

              {/* Booking Pass / Voucher */}
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3.5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 text-xs">
                  <span className="text-slate-400">Numer zlecenia:</span>
                  <span className="font-mono font-bold text-amber-400 text-sm">
                    {confirmedBooking.referenceNumber}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <div className="text-slate-500">Data wizyty:</div>
                    <div className="font-bold text-white mt-0.5">{confirmedBooking.date}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Godzina:</div>
                    <div className="font-bold text-amber-400 mt-0.5 text-base tabular-nums">
                      {confirmedBooking.timeSlot}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-slate-800/60">
                  <div>
                    <div className="text-slate-500">Pojazd:</div>
                    <div className="font-medium text-white">{confirmedBooking.vehicleMake} {confirmedBooking.vehicleModel}</div>
                  </div>
                  <div>
                    <div className="text-slate-500">Nr rejestracyjny:</div>
                    <div className="font-mono font-bold text-white">{confirmedBooking.registrationPlate}</div>
                  </div>
                </div>

                <div className="text-xs pt-2 border-t border-slate-800/60">
                  <div className="text-slate-500">Materiały / Dobór:</div>
                  <div className="font-semibold text-slate-200">
                    {confirmedBooking.selectedOilBrand === 'Własny olej i filtr'
                      ? 'Własny olej i filtr klienta (usługa samej wymiany)'
                      : `${confirmedBooking.oilProductName} (${confirmedBooking.oilQuantityLiters} L) + filtr ${confirmedBooking.selectedFilterBrand || 'Filtron'}`}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-800 text-xs">
                  <span className="font-semibold text-slate-400">Status wyceny:</span>
                  <span className="font-bold text-emerald-400">
                    Dedykowana oferta przesyłana w kilkanaście minut
                  </span>
                </div>
              </div>

              {/* Automatic notification alert confirmation */}
              <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 max-w-md mx-auto flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Płatność realizowana jest na miejscu po zakończeniu usługi (karta / BLIK / gotówka).</span>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  onClick={onClose}
                  className="px-8 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Zamknij okno
                </button>
              </div>

            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmitBooking} className="space-y-6">
              
              {/* Pre-filled Config Summary strip */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
                <div>
                  <div className="text-slate-400 uppercase font-medium text-[10px]">Wybrana konfiguracja:</div>
                  <div className="font-bold text-white text-sm">
                    {config.vehicleMake} {config.vehicleModel} {config.vehicleYear ? `(${config.vehicleYear})` : ''} · {config.vehicleEngine || config.engine.name} {config.vehicleFuel ? `[${config.vehicleFuel}]` : ''}
                  </div>
                  <div className="text-amber-400 mt-0.5">
                    {config.selectedBrand === 'Własny olej i filtr' 
                      ? 'Materiały: Własny olej i filtr klienta (usługa samej wymiany)' 
                      : `Olej: ${config.selectedBrand} (${config.selectedProduct.productName})`}
                    {config.includeFlush && ' · +Płukanie (+49 zł)'}
                    {config.includeMetalGuard && ' · +Metal Guard (+69 zł)'}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-slate-400 text-[11px]">Wycena usługi:</div>
                  <div className="font-heading font-bold text-sm text-amber-400">
                    Oferta w kilkanaście minut
                  </div>
                </div>
              </div>

              {/* Step A: Pick Date */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  1. Wybierz dzień wizyty:
                </label>
                <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
                  {availableDates.slice(0, 7).map((d) => (
                    <button
                      type="button"
                      key={d.iso}
                      onClick={() => setSelectedDate(d.iso)}
                      className={`px-3.5 py-3 rounded-xl border text-center min-w-[76px] transition-all cursor-pointer ${
                        selectedDate === d.iso
                          ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-md'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-[10px] uppercase font-semibold">{d.dayName}</div>
                      <div className="text-sm font-bold mt-0.5">{d.formattedDate}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Step B: Pick Time Slot */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5">
                  2. Wybierz godzinę (interwał 30 min / wymiana w 27 min):
                </label>
                <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                  {timeSlots.map((time) => (
                    <button
                      type="button"
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`py-2 px-2 rounded-lg text-xs font-bold tabular-nums transition-all cursor-pointer ${
                        selectedTime === time
                          ? 'bg-amber-400 text-black shadow-sm ring-2 ring-amber-400/40'
                          : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Step C: Customer & Car registration plate */}
              <div className="pt-4 border-t border-slate-800">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                  3. Twoje dane kontaktowe i numer rejestracyjny:
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Imię i nazwisko */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Imię i nazwisko *</label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="np. Jan Kowalski"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* Numer rejestracyjny */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Numer rejestracyjny samochodu (opcjonalnie)</label>
                    <div className="relative">
                      <Car className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={registrationPlate}
                        onChange={(e) => setRegistrationPlate(e.target.value.toUpperCase())}
                        placeholder="np. WI 4920A"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono font-bold text-amber-300 placeholder-slate-500 focus:outline-none focus:border-amber-400 uppercase"
                      />
                    </div>
                  </div>

                  {/* Telefon */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Numer telefonu (do potwierdzenia SMS) *</label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="np. +48 600 000 000"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Adres e-mail (potwierdzenie i faktura)</label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="np. jan.kowalski@gmail.com"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                </div>

                {/* Additional notes */}
                <div className="mt-4">
                  <label className="block text-[11px] text-slate-400 mb-1">Dodatkowe uwagi dla mechanika (opcjonalnie)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="np. silnik po chip tuningu, proszę o fakturę na firmę..."
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                  />
                </div>

              </div>

              {/* Submit CTA */}
              <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs text-slate-400">
                  Automatyczne potwierdzenie SMS i e-mail po kliknięciu
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Rezerwowanie terminu...</span>
                  ) : (
                    <>
                      <span>Potwierdź rezerwację na {selectedDate} {selectedTime}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
