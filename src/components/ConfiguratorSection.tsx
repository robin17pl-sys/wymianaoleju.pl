import React, { useState, useRef, useEffect } from 'react';
import { 
  Car, 
  Droplet, 
  Check, 
  AlertTriangle, 
  Calendar, 
  ShieldCheck, 
  Info,
  CheckCircle,
  Flame,
  Fuel,
  Send,
  Phone,
  Mail,
  User,
  Clock,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  X,
  PackageCheck
} from 'lucide-react';
import { EngineOption, OilProductMatch } from '../data/vehicleDatabase';
import { 
  ServicePrices, 
  calculateQuotation, 
  getAdminStore, 
  saveAdminStore, 
  AppointmentBooking,
  isBookingConfirmedForSlot
} from '../data/adminStore';
import { sendAutomatedEmail, triggerFormSubmitActivation } from '../services/emailService';

interface ConfiguratorSectionProps {
  prices: ServicePrices;
  bookings?: AppointmentBooking[];
  onProceedToBooking?: (config: {
    vehicleMake: string;
    vehicleModel: string;
    vehicleYear: string;
    vehicleFuel: 'Benzyna' | 'Benzyna + LPG' | 'Diesel';
    vehicleEngine: string;
    engine: EngineOption;
    selectedBrand: 'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr';
    selectedProduct: OilProductMatch;
    includeFlush: boolean;
    includeMetalGuard: boolean;
    quotation: ReturnType<typeof calculateQuotation>;
  }) => void;
}

export const ConfiguratorSection: React.FC<ConfiguratorSectionProps> = ({ prices, bookings, onProceedToBooking }) => {
  const effectiveBookings = bookings ?? getAdminStore().bookings;
  // KROK 1: Obowiązkowe pola formularza
  const [vehicleMake, setVehicleMake] = useState<string>('Volkswagen');
  const [vehicleModel, setVehicleModel] = useState<string>('Golf VII');
  const [vehicleYear, setVehicleYear] = useState<string>('2018');
  const [vehicleEngine, setVehicleEngine] = useState<string>('2.0 TDI 150 KM');
  const [fuelType, setFuelType] = useState<'Benzyna' | 'Benzyna + LPG' | 'Diesel'>('Diesel');

  // KROK 2: Wybór producenta oleju i filtra lub własnych materiałów
  const [selectedBrand, setSelectedBrand] = useState<'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr'>('Motul');
  const [selectedFilterBrand, setSelectedFilterBrand] = useState<'Filtron' | 'Bosch' | 'Hengst' | 'Własny filtr'>('Filtron');

  // KROK 3: Opcjonalna ochrona silnika – BEZ CEN
  const [includeFlush, setIncludeFlush] = useState<boolean>(true);
  const [includeMetalGuard, setIncludeMetalGuard] = useState<boolean>(true);

  // Dane kontaktowe do przesłania oferty
  const [clientName, setClientName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [registrationPlate, setRegistrationPlate] = useState<string>('');
  const [preferredDate, setPreferredDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Sekcja wyboru terminu wizyty: data (14 dni do przodu + inna data) oraz godzina (8:00 - 18:00 co 30 min)
  const [selectedDateIso, setSelectedDateIso] = useState<string>('');
  const [customDateValue, setCustomDateValue] = useState<string>('');
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>('');

  interface DayOption {
    date: Date;
    iso: string;
    dayName: string;
    formattedDate: string;
    fullLabel: string;
    isSunday: boolean;
  }

  // Generowanie 14 dni do przodu (zaczynając od dziś)
  const available14Days: DayOption[] = React.useMemo(() => {
    const days: DayOption[] = [];
    const now = new Date();
    const shortMonths = ['sty', 'lut', 'mar', 'kwi', 'maj', 'cze', 'lip', 'sie', 'wrz', 'paź', 'lis', 'gru'];
    const fullMonths = [
      'stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca',
      'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'
    ];
    const weekDayShort = ['Nd', 'Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So'];
    const weekDayFull = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];

    for (let i = 0; i < 14; i++) {
      const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
      const dayOfWeek = d.getDay();
      const isSunday = dayOfWeek === 0;

      let dayName = weekDayShort[dayOfWeek];
      if (i === 0) dayName = 'Dziś';
      else if (i === 1) dayName = 'Jutro';

      const formattedDate = `${d.getDate()} ${shortMonths[d.getMonth()]}`;
      const fullLabel = `${weekDayFull[dayOfWeek]}, ${d.getDate()} ${fullMonths[d.getMonth()]}`;
      const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

      days.push({
        date: d,
        iso,
        dayName,
        formattedDate,
        fullLabel,
        isSunday
      });
    }
    return days;
  }, []);

  const todayIso = React.useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);

  // Lista godzin do wyboru co 30 min (8:00 - 18:00)
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
    '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
    '17:00', '17:30', '18:00'
  ];

  const updatePreferredDate = (dateIso: string, time: string, customVal?: string) => {
    let dateText = '';
    if (dateIso === 'custom') {
      if (customVal) {
        try {
          const [y, m, d] = customVal.split('-').map(Number);
          const parsed = new Date(y, m - 1, d);
          dateText = parsed.toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
        } catch {
          dateText = customVal;
        }
      } else {
        dateText = 'Inna data (do ustalenia)';
      }
    } else if (dateIso) {
      const matched = available14Days.find((d) => d.iso === dateIso);
      if (matched) {
        dateText = matched.fullLabel;
      }
    }

    if (dateText && time) {
      setPreferredDate(`${dateText}, godz. ${time}`);
    } else if (dateText) {
      setPreferredDate(dateText);
    } else if (time) {
      setPreferredDate(`Godz. ${time}`);
    } else {
      setPreferredDate('');
    }
  };

  const handleSelectDay = (day: DayOption) => {
    if (day.isSunday) return;
    if (selectedDateIso === day.iso) {
      setSelectedDateIso('');
      updatePreferredDate('', selectedTimeSlot);
    } else {
      setSelectedDateIso(day.iso);
      // Jeśli obecna godzina jest zajęta w wybranym nowym dniu, czyścimy wybór godziny
      const isOccupiedOnNewDay = isBookingConfirmedForSlot(effectiveBookings, day.iso, selectedTimeSlot);
      const effectiveTime = isOccupiedOnNewDay ? '' : selectedTimeSlot;
      if (isOccupiedOnNewDay) {
        setSelectedTimeSlot('');
      }
      updatePreferredDate(day.iso, effectiveTime);
    }
  };

  const handleSelectCustomDate = () => {
    if (selectedDateIso === 'custom') {
      setSelectedDateIso('');
      updatePreferredDate('', selectedTimeSlot);
    } else {
      setSelectedDateIso('custom');
      const isOccupiedOnNewDay = isBookingConfirmedForSlot(effectiveBookings, customDateValue, selectedTimeSlot);
      const effectiveTime = isOccupiedOnNewDay ? '' : selectedTimeSlot;
      if (isOccupiedOnNewDay) {
        setSelectedTimeSlot('');
      }
      updatePreferredDate('custom', effectiveTime, customDateValue);
    }
  };

  const handleCustomDateChange = (val: string) => {
    setCustomDateValue(val);
    setSelectedDateIso('custom');
    const isOccupiedOnNewDay = isBookingConfirmedForSlot(effectiveBookings, val, selectedTimeSlot);
    const effectiveTime = isOccupiedOnNewDay ? '' : selectedTimeSlot;
    if (isOccupiedOnNewDay) {
      setSelectedTimeSlot('');
    }
    updatePreferredDate('custom', effectiveTime, val);
  };

  const handleSelectTime = (slot: string) => {
    const targetDate = selectedDateIso === 'custom' ? customDateValue : (selectedDateIso || todayIso);
    if (isBookingConfirmedForSlot(effectiveBookings, targetDate, slot)) {
      return; // Nie pozwól wybrać zablokowanego slotu
    }
    const newSlot = selectedTimeSlot === slot ? '' : slot;
    setSelectedTimeSlot(newSlot);
    updatePreferredDate(selectedDateIso, newSlot, customDateValue);
  };

  const handleClearDateTime = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedDateIso('');
    setSelectedTimeSlot('');
    setCustomDateValue('');
    setPreferredDate('');
  };

  // Walidacja i stan wysyłki
  const [attemptedSubmit, setAttemptedSubmit] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submittedInquiry, setSubmittedInquiry] = useState<{
    referenceNumber: string;
    clientName: string;
    phone: string;
    email: string;
    carSummary: string;
    brand: string;
    filterBrand: string;
  } | null>(null);

  // Sprawdzenie kompletności pól pojazdu
  const isMakeValid = vehicleMake.trim().length > 0;
  const isModelValid = vehicleModel.trim().length > 0;
  const isYearValid = vehicleYear.trim().length > 0;
  const isEngineValid = vehicleEngine.trim().length > 0;
  const isStep1Complete = isMakeValid && isModelValid && isYearValid && isEngineValid;

  // Sprawdzenie kompletności danych kontaktowych
  const isNameValid = clientName.trim().length > 0;
  const isPhoneValid = phone.trim().length >= 7;
  const isEmailValid = email.trim().length > 0 && email.includes('@');
  const isContactComplete = isNameValid && isPhoneValid && isEmailValid;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    setAttemptedSubmit(true);

    if (!isStep1Complete) {
      const el = document.getElementById('step1-container');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    if (!isContactComplete) {
      const el = document.getElementById('contact-form-container');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `OFERTA-${new Date().getFullYear()}-${randomSuffix}`;
    const effectiveFilterBrand = selectedBrand === 'Własny olej i filtr' ? 'Własny filtr' : selectedFilterBrand;

    // Zapisanie zapytania w bazie serwisu
    const store = getAdminStore();
    const newBooking: AppointmentBooking = {
      id: `inq-${Date.now()}`,
      referenceNumber: refNum,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      date: selectedDateIso === 'custom' ? (customDateValue || todayIso) : (selectedDateIso || todayIso),
      timeSlot: selectedTimeSlot || 'Do ustalenia',
      clientName: clientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      registrationPlate: registrationPlate ? registrationPlate.trim().toUpperCase() : 'DO USTALENIA',
      vehicleMake: vehicleMake.trim(),
      vehicleModel: `${vehicleModel.trim()} (${vehicleYear.trim()})`,
      vehicleEngine: `${vehicleEngine.trim()} [${fuelType}]`,
      selectedOilBrand: selectedBrand,
      selectedFilterBrand: effectiveFilterBrand,
      oilProductName: selectedBrand === 'Własny olej i filtr' 
        ? 'Własny olej i filtr klienta (usługa samej wymiany do 27 min*)' 
        : `Dedykowany ${selectedBrand} wg katalogu + filtr ${effectiveFilterBrand}`,
      oilQuantityLiters: selectedBrand === 'Własny olej i filtr' ? 0 : 4.5,
      includeEngineFlush: includeFlush,
      includeMetalGuard: includeMetalGuard,
      totalNetto: 0,
      totalBrutto: 0,
      status: 'Oczekująca',
      notes: notes.trim()
    };

    store.bookings.unshift(newBooking);
    saveAdminStore(store);

    // Automatyczna wysyłka wiadomości na adres dreamstudiopl@gmail.com w tle
    sendAutomatedEmail({
      referenceNumber: refNum,
      clientName: clientName.trim(),
      phone: phone.trim(),
      email: email.trim(),
      registrationPlate: registrationPlate.trim().toUpperCase(),
      vehicleMake: vehicleMake.trim(),
      vehicleModel: vehicleModel.trim(),
      vehicleYear: vehicleYear.trim(),
      vehicleEngine: vehicleEngine.trim(),
      fuelType: fuelType,
      selectedOilBrand: selectedBrand,
      selectedFilterBrand: effectiveFilterBrand,
      includeFlush: includeFlush,
      includeMetalGuard: includeMetalGuard,
      preferredDate: preferredDate || 'Do ustalenia w ofercie',
      notes: notes.trim(),
      source: 'Konfigurator Wyceny'
    });

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmittedInquiry({
        referenceNumber: refNum,
        clientName: clientName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        carSummary: `${vehicleMake.trim()} ${vehicleModel.trim()} (${vehicleYear.trim()}) · ${vehicleEngine.trim()} (${fuelType})`,
        brand: selectedBrand,
        filterBrand: effectiveFilterBrand
      });
    }, 600);
  };

  return (
    <section id="konfigurator" className="py-16 lg:py-24 bg-[#0b0e14] relative scroll-mt-16">
      
      {/* Decorative ambient backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] bg-red-600/5 blur-[160px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-3">
            <span>Formularz Doboru Oleju i Wyceny</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-300">Oficjalny Katalog MOTUL</span>
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight uppercase text-balance">
            Wypełnij dane i otrzymaj ofertę w kilkanaście minut
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-300 font-normal leading-relaxed text-balance">
            Podaj parametry swojego auta i wybierz markę oleju. <strong className="text-amber-400">Po uzupełnieniu formularza w ciągu kilkunastu minut prześlemy oficjalną, spersonalizowaną ofertę</strong> z certyfikowanym doborem oleju i filtrem.
          </p>
        </div>

        {/* Dynamic State: If Inquiry Submitted, Show Confirmation Screen */}
        {submittedInquiry ? (
          <div className="max-w-3xl mx-auto p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/40 text-emerald-400 mx-auto flex items-center justify-center">
              <CheckCircle className="w-10 h-10" />
            </div>

            <div>
              <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
                Zapytanie wysłane pomyślnie
              </span>
              <h3 className="font-heading text-2xl sm:text-3xl font-black text-white mt-2">
                Dziękujemy! Ofertę otrzymasz w ciągu kilkunastu minut
              </h3>
              <p className="text-slate-300 text-sm max-w-xl mx-auto mt-3 leading-relaxed">
                Nasz doradca techniczny weryfikuje specyfikację w oficjalnym katalogu producenta dla Twojego pojazdu. Dokładna oferta cenowa zostanie przesłana na Twój numer telefonu <strong className="text-white">{submittedInquiry.phone}</strong> oraz adres e-mail <strong className="text-white">{submittedInquiry.email}</strong>.
              </p>
            </div>

            <div className="max-w-md mx-auto p-5 rounded-2xl bg-slate-950 border border-slate-800 text-left space-y-3 text-xs">
              <div className="flex justify-between pb-2 border-b border-slate-800">
                <span className="text-slate-400">Numer zapytania:</span>
                <span className="font-mono font-bold text-amber-400">{submittedInquiry.referenceNumber}</span>
              </div>
              <div>
                <span className="text-slate-500">Pojazd:</span>
                <div className="font-bold text-white mt-0.5">{submittedInquiry.carSummary}</div>
              </div>
              <div>
                <span className="text-slate-500">Materiały / Dobór:</span>
                <div className="font-bold text-amber-400 mt-0.5">
                  {submittedInquiry.brand === 'Własny olej i filtr' 
                    ? 'Własny olej i filtr klienta (usługa samej wymiany do 27 min*)' 
                    : `Olej: ${submittedInquiry.brand} · Filtr: ${submittedInquiry.filterBrand}`}
                </div>
              </div>
              <div className="flex justify-between pt-1 border-t border-slate-800/60">
                <span className="text-slate-500">Kopia powiadomienia:</span>
                <span className="text-slate-300 font-mono text-[11px]">dreamstudiopl@gmail.com</span>
              </div>
              <div>
                <span className="text-slate-500">Czas odpowiedzi:</span>
                <div className="font-medium text-emerald-400 mt-0.5">Zwykle do 15 minut (w godzinach pracy serwisu)</div>
              </div>
            </div>

            <div className="pt-4 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={() => setSubmittedInquiry(null)}
                className="px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
              >
                Wyślij kolejne zapytanie
              </button>
              
              <button
                type="button"
                onClick={triggerFormSubmitActivation}
                className="text-[11px] text-slate-500 hover:text-amber-400 transition-colors underline cursor-pointer"
              >
                Właściciel: Brak wiadomości na dreamstudiopl@gmail.com? Kliknij, aby wymusić link aktywacyjny FormSubmit
              </button>
            </div>
          </div>
        ) : (
          /* Main 2-Column Interactive Form */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Block (Cols 1-7): Step 1 (Vehicle), Step 2 (Brand), Step 3 (Protection) */}
            <div className="lg:col-span-7 space-y-8">
              
              {/* Krok 1: Wpisanie danych pojazdu (Pola obowiązkowe) */}
              <div 
                id="step1-container"
                className={`p-6 sm:p-7 rounded-2xl bg-slate-900/60 border transition-all shadow-xl ${
                  attemptedSubmit && !isStep1Complete ? 'border-rose-500 ring-2 ring-rose-500/30' : 'border-slate-800/80'
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">
                        Krok 1: Dane Twojego samochodu
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Pola obowiązkowe do przygotowania dedykowanej wyceny
                      </p>
                    </div>
                  </div>

                  {isStep1Complete ? (
                    <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4" />
                      Pola uzupełnione
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-amber-400">
                      * Pola wymagane
                    </span>
                  )}
                </div>

                {attemptedSubmit && !isStep1Complete && (
                  <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>Proszę wypełnić wszystkie 4 pola obowiązkowe (Marka, Model, Rok, Silnik).</span>
                  </div>
                )}

                {/* 4 Obowiązkowe Pola Tekstowe */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* 1. MARKA */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Marka samochodu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleMake}
                      onChange={(e) => setVehicleMake(e.target.value)}
                      placeholder="np. Volkswagen, Audi, BMW, Toyota..."
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all ${
                        attemptedSubmit && !isMakeValid
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                  </div>

                  {/* 2. MODEL */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Model samochodu <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleModel}
                      onChange={(e) => setVehicleModel(e.target.value)}
                      placeholder="np. Golf VII, A4 B9, 320d, Corolla..."
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all ${
                        attemptedSubmit && !isModelValid
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                  </div>

                  {/* 3. ROK */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Rok produkcji <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleYear}
                      onChange={(e) => setVehicleYear(e.target.value)}
                      placeholder="np. 2018, 2021..."
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all ${
                        attemptedSubmit && !isYearValid
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                  </div>

                  {/* 4. SILNIK */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                      Silnik (Pojemność i moc) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleEngine}
                      onChange={(e) => setVehicleEngine(e.target.value)}
                      placeholder="np. 2.0 TDI 150 KM, 1.4 TSI 125 KM..."
                      className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm font-semibold text-white placeholder-slate-500 focus:outline-none transition-all ${
                        attemptedSubmit && !isEngineValid
                          ? 'border-rose-500 focus:border-rose-400 focus:ring-1 focus:ring-rose-400'
                          : 'border-slate-800 focus:border-amber-400 focus:ring-1 focus:ring-amber-400'
                      }`}
                    />
                  </div>

                </div>

                {/* 5. RODZAJ PALIWA */}
                <div className="mt-6 pt-5 border-t border-slate-800/80">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                    Wybierz rodzaj paliwa <span className="text-rose-500">*</span>
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    
                    <button
                      type="button"
                      onClick={() => setFuelType('Benzyna')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        fuelType === 'Benzyna'
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          fuelType === 'Benzyna' ? 'bg-black text-amber-400' : 'bg-slate-900 text-slate-400'
                        }`}>
                          <Fuel className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Benzyna</div>
                          <div className={`text-[10px] ${fuelType === 'Benzyna' ? 'text-black/80' : 'text-slate-400'}`}>
                            TSI / VTEC / EcoBoost
                          </div>
                        </div>
                      </div>
                      {fuelType === 'Benzyna' && <Check className="w-4 h-4 text-black shrink-0" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFuelType('Benzyna + LPG')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        fuelType === 'Benzyna + LPG'
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          fuelType === 'Benzyna + LPG' ? 'bg-black text-amber-400' : 'bg-slate-900 text-slate-400'
                        }`}>
                          <Flame className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Benzyna + LPG</div>
                          <div className={`text-[10px] ${fuelType === 'Benzyna + LPG' ? 'text-black/80' : 'text-slate-400'}`}>
                            Odporność termiczna
                          </div>
                        </div>
                      </div>
                      {fuelType === 'Benzyna + LPG' && <Check className="w-4 h-4 text-black shrink-0" />}
                    </button>

                    <button
                      type="button"
                      onClick={() => setFuelType('Diesel')}
                      className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                        fuelType === 'Diesel'
                          ? 'bg-amber-400 text-black border-amber-400 shadow-md font-bold'
                          : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          fuelType === 'Diesel' ? 'bg-black text-amber-400' : 'bg-slate-900 text-slate-400'
                        }`}>
                          <Droplet className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-bold">Diesel</div>
                          <div className={`text-[10px] ${fuelType === 'Diesel' ? 'text-black/80' : 'text-slate-400'}`}>
                            TDI / dCi / HDi (DPF/SCR)
                          </div>
                        </div>
                      </div>
                      {fuelType === 'Diesel' && <Check className="w-4 h-4 text-black shrink-0" />}
                    </button>

                  </div>
                </div>



              </div>

              {/* Krok 2: Wybór producenta oleju i filtra lub własnych materiałów */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl space-y-7">
                
                {/* Header Kroku 2 */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">
                        Krok 2: Wybierz producenta oleju i filtra
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Wybierz certyfikowaną markę oleju oraz producenta filtra lub zaznacz, że masz własne materiały
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400 font-medium hidden sm:inline-block">Gwarancja jakości OE</span>
                </div>

                {/* CZĘŚĆ A: Wybór producenta oleju */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        A. Wybierz producenta oleju silnikowego:
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {selectedBrand === 'Własny olej i filtr' ? 'Wybrano: Własny olej' : `Wybrano: ${selectedBrand}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* 1. MOTUL */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand('Motul');
                        if (selectedFilterBrand === 'Własny filtr') {
                          setSelectedFilterBrand('Filtron');
                        }
                      }}
                      className={`py-7 px-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[135px] group ${
                        selectedBrand === 'Motul'
                          ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/40 shadow-xl shadow-red-950/40 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {selectedBrand === 'Motul' && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-md">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                      
                      {/* Logo MOTUL */}
                      <div className="w-full max-w-[170px] flex items-center justify-center py-2 transition-transform group-hover:scale-105 duration-200">
                        <svg viewBox="0 0 180 52" className="w-full h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="52" rx="7" fill="#E30613" />
                          <g transform="skewX(-10) translate(14, 0)">
                            <text x="76" y="37" fill="#FFFFFF" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontSize="32" letterSpacing="1.8" textAnchor="middle">
                              MOTUL
                            </text>
                          </g>
                        </svg>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                        selectedBrand === 'Motul' ? 'text-red-400 font-extrabold' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {selectedBrand === 'Motul' ? 'Wybrany olej' : 'Wybierz Motul'}
                      </span>
                    </button>

                    {/* 2. LIQUI MOLY */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand('Liqui Moly');
                        if (selectedFilterBrand === 'Własny filtr') {
                          setSelectedFilterBrand('Filtron');
                        }
                      }}
                      className={`py-7 px-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[135px] group ${
                        selectedBrand === 'Liqui Moly'
                          ? 'bg-blue-950/40 border-blue-500 ring-2 ring-blue-500/40 shadow-xl shadow-blue-950/40 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {selectedBrand === 'Liqui Moly' && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs shadow-md">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}

                      {/* Logo LIQUI MOLY */}
                      <div className="w-full max-w-[170px] flex items-center justify-center py-2 transition-transform group-hover:scale-105 duration-200">
                        <svg viewBox="0 0 180 54" className="w-full h-11 shadow-sm" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="54" rx="7" fill="#00478F" />
                          <path d="M0 7C0 3.13401 3.13401 0 7 0H173C176.866 0 180 3.13401 180 7V27H0V7Z" fill="#004B93" />
                          <path d="M0 27H180V47C180 50.866 176.866 54 173 54H7C3.13401 54 0 50.866 0 47V27Z" fill="#D81B27" />
                          <line x1="0" y1="27" x2="180" y2="27" stroke="#FFFFFF" strokeWidth="1" opacity="0.3" />
                          <text x="90" y="20" fill="#FFFFFF" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontSize="18" letterSpacing="2.5" textAnchor="middle">
                            LIQUI
                          </text>
                          <text x="90" y="46" fill="#FFFFFF" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontSize="18" letterSpacing="2.5" textAnchor="middle">
                            MOLY
                          </text>
                        </svg>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                        selectedBrand === 'Liqui Moly' ? 'text-blue-400 font-extrabold' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {selectedBrand === 'Liqui Moly' ? 'Wybrany olej' : 'Wybierz Liqui Moly'}
                      </span>
                    </button>

                    {/* 3. VALVOLINE */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedBrand('Valvoline');
                        if (selectedFilterBrand === 'Własny filtr') {
                          setSelectedFilterBrand('Filtron');
                        }
                      }}
                      className={`py-7 px-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[135px] group ${
                        selectedBrand === 'Valvoline'
                          ? 'bg-amber-950/30 border-amber-500 ring-2 ring-amber-500/40 shadow-xl shadow-amber-950/40 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {selectedBrand === 'Valvoline' && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500 text-black flex items-center justify-center text-xs shadow-md font-bold">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}

                      {/* Logo VALVOLINE */}
                      <div className="w-full max-w-[170px] flex items-center justify-center py-2 transition-transform group-hover:scale-105 duration-200">
                        <svg viewBox="0 0 180 50" className="w-full h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <g transform="translate(6, 7)">
                            <path d="M0 0L14 34L22 17L11 0H0Z" fill="#00529C" />
                            <path d="M30 0L14 34L22 17L33 0H30Z" fill="#E31B23" />
                            <path d="M22 17L14 34L17.5 34L25.5 17H22Z" fill="#FFFFFF" opacity="0.9" />
                          </g>
                          <text x="48" y="32" fill="#FFFFFF" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontStyle="italic" fontSize="22" letterSpacing="0.2">
                            Valvoline
                          </text>
                          <text x="162" y="20" fill="#E31B23" fontFamily="sans-serif" fontWeight="bold" fontSize="9">
                            ®
                          </text>
                        </svg>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                        selectedBrand === 'Valvoline' ? 'text-amber-400 font-extrabold' : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {selectedBrand === 'Valvoline' ? 'Wybrany olej' : 'Wybierz Valvoline'}
                      </span>
                    </button>

                  </div>
                </div>

                {/* CZĘŚĆ B: Wybór producenta filtra oleju (Filtron, Bosch, Hengst) */}
                <div className="pt-5 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-200">
                        B. Wybierz producenta filtra oleju:
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {selectedBrand === 'Własny olej i filtr' || selectedFilterBrand === 'Własny filtr' 
                        ? 'Wybrano: Własny filtr' 
                        : `Wybrano: ${selectedFilterBrand}`}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    
                    {/* 1. FILTRON */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilterBrand('Filtron');
                        if (selectedBrand === 'Własny olej i filtr') {
                          setSelectedBrand('Motul');
                        }
                      }}
                      className={`py-7 px-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[135px] group ${
                        selectedFilterBrand === 'Filtron' && selectedBrand !== 'Własny olej i filtr'
                          ? 'bg-red-950/40 border-red-500 ring-2 ring-red-500/40 shadow-xl shadow-red-950/40 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {selectedFilterBrand === 'Filtron' && selectedBrand !== 'Własny olej i filtr' && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-600 text-white flex items-center justify-center text-xs shadow-md">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}
                      
                      {/* Logo FILTRON */}
                      <div className="w-full max-w-[170px] flex items-center justify-center py-2 transition-transform group-hover:scale-105 duration-200">
                        <svg viewBox="0 0 180 52" className="w-full h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="52" rx="7" fill="#E2001A" />
                          <text x="90" y="36" fill="#FFFFFF" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontSize="27" letterSpacing="2.2" textAnchor="middle">
                            FILTRON
                          </text>
                          <rect x="25" y="42" width="130" height="2" fill="#FFFFFF" opacity="0.65" rx="1" />
                        </svg>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                        selectedFilterBrand === 'Filtron' && selectedBrand !== 'Własny olej i filtr' 
                          ? 'text-red-400 font-extrabold' 
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {selectedFilterBrand === 'Filtron' && selectedBrand !== 'Własny olej i filtr' ? 'Wybrany filtr' : 'Wybierz Filtron'}
                      </span>
                    </button>

                    {/* 2. BOSCH */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilterBrand('Bosch');
                        if (selectedBrand === 'Własny olej i filtr') {
                          setSelectedBrand('Motul');
                        }
                      }}
                      className={`py-7 px-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[135px] group ${
                        selectedFilterBrand === 'Bosch' && selectedBrand !== 'Własny olej i filtr'
                          ? 'bg-rose-950/30 border-rose-500 ring-2 ring-rose-500/40 shadow-xl shadow-rose-950/30 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {selectedFilterBrand === 'Bosch' && selectedBrand !== 'Własny olej i filtr' && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs shadow-md">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}

                      {/* Logo BOSCH */}
                      <div className="w-full max-w-[170px] flex items-center justify-center py-2 transition-transform group-hover:scale-105 duration-200">
                        <svg viewBox="0 0 180 52" className="w-full h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="52" rx="7" fill="#141822" stroke="#283344" strokeWidth="1" />
                          {/* Magneto armature iconic circle symbol */}
                          <g transform="translate(18, 10)">
                            <circle cx="16" cy="16" r="14" stroke="#EA1D24" strokeWidth="2.8" fill="none" />
                            <rect x="7.5" y="11" width="17" height="10" stroke="#EA1D24" strokeWidth="2.2" fill="none" rx="1.5" />
                            <line x1="16" y1="2" x2="16" y2="11" stroke="#EA1D24" strokeWidth="2.2" />
                            <line x1="16" y1="21" x2="16" y2="30" stroke="#EA1D24" strokeWidth="2.2" />
                          </g>
                          {/* BOSCH bold wordmark */}
                          <text x="64" y="36" fill="#EA1D24" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontSize="28" letterSpacing="2.5">
                            BOSCH
                          </text>
                        </svg>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                        selectedFilterBrand === 'Bosch' && selectedBrand !== 'Własny olej i filtr' 
                          ? 'text-rose-400 font-extrabold' 
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {selectedFilterBrand === 'Bosch' && selectedBrand !== 'Własny olej i filtr' ? 'Wybrany filtr' : 'Wybierz Bosch'}
                      </span>
                    </button>

                    {/* 3. HENGST */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedFilterBrand('Hengst');
                        if (selectedBrand === 'Własny olej i filtr') {
                          setSelectedBrand('Motul');
                        }
                      }}
                      className={`py-7 px-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col items-center justify-center min-h-[135px] group ${
                        selectedFilterBrand === 'Hengst' && selectedBrand !== 'Własny olej i filtr'
                          ? 'bg-sky-950/40 border-sky-500 ring-2 ring-sky-500/40 shadow-xl shadow-sky-950/40 scale-[1.02]'
                          : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                      }`}
                    >
                      {selectedFilterBrand === 'Hengst' && selectedBrand !== 'Własny olej i filtr' && (
                        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-sky-500 text-black flex items-center justify-center text-xs shadow-md font-bold">
                          <Check className="w-4 h-4 stroke-[2.5]" />
                        </div>
                      )}

                      {/* Logo HENGST */}
                      <div className="w-full max-w-[170px] flex items-center justify-center py-2 transition-transform group-hover:scale-105 duration-200">
                        <svg viewBox="0 0 180 52" className="w-full h-11" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect width="180" height="52" rx="7" fill="#002D62" />
                          <g transform="translate(6, 0)">
                            {/* Hengst logo chevron filter symbol */}
                            <g transform="translate(10, 14)">
                              <path d="M0 0L8 12L0 24H6L14 12L6 0H0Z" fill="#FFFFFF" />
                              <path d="M8 0L16 12L8 24H14L22 12L14 0H8Z" fill="#00A3E0" />
                            </g>
                            <text x="96" y="31" fill="#FFFFFF" fontFamily="'Outfit', Arial Black, sans-serif" fontWeight="900" fontSize="23" letterSpacing="0.8" textAnchor="middle">
                              Hengst
                            </text>
                            <text x="96" y="43" fill="#00A3E0" fontFamily="sans-serif" fontWeight="800" fontSize="7.5" letterSpacing="2.5" textAnchor="middle">
                              FILTRATION
                            </text>
                          </g>
                        </svg>
                      </div>

                      <span className={`text-[11px] font-bold uppercase tracking-wider mt-2 transition-colors ${
                        selectedFilterBrand === 'Hengst' && selectedBrand !== 'Własny olej i filtr' 
                          ? 'text-sky-400 font-extrabold' 
                          : 'text-slate-400 group-hover:text-slate-200'
                      }`}>
                        {selectedFilterBrand === 'Hengst' && selectedBrand !== 'Własny olej i filtr' ? 'Wybrany filtr' : 'Wybierz Hengst'}
                      </span>
                    </button>

                  </div>
                </div>

                {/* CZĘŚĆ C: MAM WŁASNY OLEJ I FILTR */}
                <div className="pt-5 border-t border-slate-800/80">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedBrand('Własny olej i filtr');
                      setSelectedFilterBrand('Własny filtr');
                    }}
                    className={`w-full p-4 sm:p-4.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 text-left group ${
                      selectedBrand === 'Własny olej i filtr'
                        ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/40 shadow-xl'
                        : 'bg-slate-950/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        selectedBrand === 'Własny olej i filtr'
                          ? 'bg-amber-400 text-black shadow-md shadow-amber-400/20'
                          : 'bg-slate-900 border border-slate-700 text-slate-300 group-hover:text-amber-400 group-hover:border-slate-600'
                      }`}>
                        <PackageCheck className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-heading font-black text-sm sm:text-base text-white">
                            Mam własny olej i filtr
                          </span>
                          <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-400/10 border border-amber-400/20 text-amber-300">
                            Usługa samej wymiany
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          Przywieź ze sobą zakupiony olej oraz filtr. W ramach usługi wykonujemy ekspresową wymianę do 27 minut*, montujemy nową podkładkę korka i darmowo utylizujemy zużyty olej.
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 pl-2">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                        selectedBrand === 'Własny olej i filtr'
                          ? 'bg-amber-400 border-amber-400 text-black font-bold'
                          : 'border-slate-700 bg-slate-900 group-hover:border-slate-600'
                      }`}>
                        {selectedBrand === 'Własny olej i filtr' && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Krok 3: Dodatkowa ochrona silnika – BEZ CEN */}
              <div className="p-6 sm:p-7 rounded-2xl bg-slate-900/60 border border-slate-800/80 shadow-xl">
                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight">
                        Krok 3: Opcjonalna ochrona silnika
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Możesz uwzględnić dodatkowe procedury w przygotowywanej ofercie
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">Maksymalizacja żywotności</span>
                </div>

                <div className="space-y-4">
                  
                  {/* Opcja 1: Płukanie silnika */}
                  <label className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    includeFlush 
                      ? 'bg-amber-500/5 border-amber-500/50' 
                      : 'bg-slate-950/70 border-slate-800 opacity-80 hover:opacity-100'
                  }`}>
                    <input
                      type="checkbox"
                      checked={includeFlush}
                      onChange={(e) => setIncludeFlush(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 bg-slate-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          Płukanie silnika profesjonalną chemią serwisową (Engine Flush)
                          {includeFlush && <span className="text-[11px] text-amber-400 font-medium">(Wybrano)</span>}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold whitespace-nowrap">
                          +49 zł
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Usuwa nagary, zapieczone osady węglowe i pozostałości po starym oleju z rowków pierścieni tłokowych. Nowy olej wlewa się do sterylnie czystego silnika.
                      </p>
                    </div>
                  </label>

                  {/* Opcja 2: Metal Guard */}
                  <label className={`flex items-start gap-4 p-4 rounded-xl border transition-all cursor-pointer ${
                    includeMetalGuard 
                      ? 'bg-amber-500/5 border-amber-500/50' 
                      : 'bg-slate-950/70 border-slate-800 opacity-80 hover:opacity-100'
                  }`}>
                    <input
                      type="checkbox"
                      checked={includeMetalGuard}
                      onChange={(e) => setIncludeMetalGuard(e.target.checked)}
                      className="mt-1 w-5 h-5 rounded border-slate-700 text-amber-500 focus:ring-amber-500/20 bg-slate-900 cursor-pointer"
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white flex items-center gap-2">
                          Metal Guard – Nanotechnologiczna ochrona silnika
                          {includeMetalGuard && <span className="text-[11px] text-amber-400 font-medium">(Wybrano)</span>}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/30 text-amber-300 font-extrabold whitespace-nowrap">
                          +69 zł
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                        Tworzy mikroskopijną warstwę ochronną na panewkach i gładziach cylindrów. Zmniejsza opory tarcia granicznego i chroni silnik przy zimnym rozruchu oraz w systemach Start-Stop.
                      </p>
                    </div>
                  </label>

                </div>
              </div>

            </div>

            {/* Right Block (Cols 8-12): Podsumowanie & Formularz kontaktowy do wysłania oferty */}
            <div className="lg:col-span-5 sticky top-24">
              
              <div 
                id="contact-form-container"
                className="p-6 sm:p-7 rounded-2xl bg-gradient-to-b from-[#121622] to-[#0c0f17] border border-slate-800 shadow-2xl relative overflow-hidden"
              >
                
                {/* Subtle top indicator bar */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-rose-500 to-red-600" />

                <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-5">
                  <div>
                    <div className="text-xs uppercase font-bold text-amber-400 tracking-wider">Podsumowanie & Oferta</div>
                    <h3 className="font-heading text-lg font-bold text-white mt-0.5">
                      Zamów wycenę w kilkanaście minut
                    </h3>
                  </div>
                  <div className="text-right">
                    <div className="text-[11px] text-slate-400">Czas odpowiedzi</div>
                    <div className="text-xs font-bold text-amber-400">do 15 minut</div>
                  </div>
                </div>

                {/* Komunikat o przesłaniu oferty */}
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs mb-5 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white block mb-0.5">Szybka oferta bezpośrednio od technika:</strong>
                    Po uzupełnieniu formularza w ciągu kilkunastu minut prześlemy oficjalną, spersonalizowaną ofertę cenową na podany numer telefonu lub e-mail.
                  </div>
                </div>

                {/* Wybrane dane pojazdu i konfiguracji */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 mb-5 space-y-2 text-xs">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Wybrana konfiguracja:</div>
                  <div className="font-bold text-white text-sm">
                    {vehicleMake || 'Marka'} {vehicleModel || 'Model'} ({vehicleYear || 'Rok'})
                  </div>
                  <div className="text-slate-300">
                    Silnik: <strong className="text-white">{vehicleEngine || 'Silnik'}</strong> · Paliwo: <span className="text-amber-400 font-semibold">{fuelType}</span>
                  </div>
                  <div className="pt-2 border-t border-slate-800/60 flex flex-wrap gap-2 text-[11px]">
                    {selectedBrand === 'Własny olej i filtr' ? (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-semibold">
                        Materiały: Własny olej i filtr
                      </span>
                    ) : (
                      <>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-amber-300 font-semibold">
                          Olej: {selectedBrand}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-cyan-300 font-semibold">
                          Filtr: {selectedFilterBrand}
                        </span>
                      </>
                    )}
                    {includeFlush && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 font-medium">
                        + Płukanie silnika (+49 zł)
                      </span>
                    )}
                    {includeMetalGuard && (
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-amber-500/30 text-amber-300 font-medium">
                        + Metal Guard (+69 zł)
                      </span>
                    )}
                  </div>
                </div>

                {/* Formularz kontaktowy do przesłania oferty */}
                <form onSubmit={handleSubmitInquiry} className="space-y-3.5">
                  
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Imię i nazwisko <span className="text-rose-500">*</span>
                    </label>
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

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Numer telefonu (do SMS z ofertą) <span className="text-rose-500">*</span>
                    </label>
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

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-1">
                      Adres e-mail (do oferty na pocztę) <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="np. jan.kowalski@gmail.com"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  {/* SEKCJA TERMINU WIZYTY: 2 OSOBNE LINIJKI */}
                  <div className="pt-2 pb-1 space-y-4">
                    
                    {/* LINIJKA 1: WYBÓR DATY (14 DNI DO PRZODU + INNA DATA NA KOŃCU) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>1. Data wizyty (14 dni do przodu):</span>
                        </label>
                        <span className="text-[10px] text-slate-400 hidden sm:inline">
                          Pn–Pt 7:30–19:00 · Sob 8:00–15:00
                        </span>
                      </div>

                      {/* Horyzontalny przewijalny pasek 14 dni + przycisk "Inna data" na końcu */}
                      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin select-none">
                        {available14Days.map((d) => {
                          const isSelected = selectedDateIso === d.iso;
                          return (
                            <button
                              type="button"
                              key={d.iso}
                              disabled={d.isSunday}
                              onClick={() => handleSelectDay(d)}
                              title={d.isSunday ? 'Niedziela – serwis zamknięty' : d.fullLabel}
                              className={`px-3 py-2 rounded-xl border text-center min-w-[70px] sm:min-w-[74px] shrink-0 transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20 scale-[1.02] ring-2 ring-amber-400/40'
                                  : d.isSunday
                                  ? 'bg-slate-950/40 text-slate-600 border-slate-900 cursor-not-allowed opacity-40'
                                  : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                              }`}
                            >
                              <div className={`text-[10px] uppercase font-bold ${
                                isSelected ? 'text-black' : d.isSunday ? 'text-slate-600' : 'text-amber-400'
                              }`}>
                                {d.dayName}
                              </div>
                              <div className="text-xs font-black mt-0.5 whitespace-nowrap">
                                {d.formattedDate}
                              </div>
                              {d.isSunday && (
                                <div className="text-[9px] text-rose-400/80 mt-0.5">zamknięte</div>
                              )}
                            </button>
                          );
                        })}

                        {/* Kafelek na końcu: "Inna data" */}
                        <button
                          type="button"
                          onClick={handleSelectCustomDate}
                          className={`px-3 py-2 rounded-xl border text-center min-w-[85px] shrink-0 transition-all cursor-pointer flex flex-col items-center justify-center ${
                            selectedDateIso === 'custom'
                              ? 'bg-amber-400 text-black border-amber-400 font-bold shadow-lg shadow-amber-500/20 ring-2 ring-amber-400/40 scale-[1.02]'
                              : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-amber-400/50 hover:text-white'
                          }`}
                        >
                          <Calendar className={`w-3.5 h-3.5 ${selectedDateIso === 'custom' ? 'text-black' : 'text-amber-400'}`} />
                          <span className="text-[11px] font-bold mt-1 whitespace-nowrap">Inna data</span>
                        </button>
                      </div>

                      {/* Pole wpisania własnej daty po kliknięciu "Inna data" */}
                      {selectedDateIso === 'custom' && (
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-950 border border-amber-500/40 flex flex-wrap items-center gap-3">
                          <span className="text-xs text-amber-300 font-semibold flex items-center gap-1.5">
                            <Calendar className="w-4 h-4 text-amber-400" />
                            <span>Wybierz własną datę:</span>
                          </span>
                          <input
                            type="date"
                            min={todayIso}
                            value={customDateValue}
                            onChange={(e) => handleCustomDateChange(e.target.value)}
                            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-amber-400 font-mono"
                          />
                          {customDateValue && (
                            <span className="text-[11px] text-slate-400">
                              Wybrano: <strong className="text-white">{customDateValue}</strong>
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* LINIJKA 2: WYBÓR GODZINY (8:00 DO 18:00 CO 30 MIN) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>2. Godzina wizyty (od 8:00 do 18:00 co 30 min):</span>
                        </label>
                        <span className="text-[10px] text-amber-400 font-semibold">
                          Wymiana do 27 min
                        </span>
                      </div>

                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 sm:gap-2 select-none">
                        {timeSlots.map((slot) => {
                          const isSelected = selectedTimeSlot === slot;
                          const targetDate = selectedDateIso === 'custom' ? customDateValue : (selectedDateIso || todayIso);
                          const isConfirmed = isBookingConfirmedForSlot(effectiveBookings, targetDate, slot);

                          return (
                            <button
                              type="button"
                              key={slot}
                              disabled={isConfirmed}
                              onClick={() => !isConfirmed && handleSelectTime(slot)}
                              title={
                                isConfirmed
                                  ? `Godzina ${slot} jest zarezerwowana (termin potwierdzony w warsztacie)`
                                  : `Wybierz godzinę ${slot}`
                              }
                              className={`py-2 px-1 text-center rounded-lg text-xs font-mono font-bold transition-all ${
                                isConfirmed
                                  ? 'bg-slate-900/40 text-slate-600 border border-slate-800/50 cursor-not-allowed opacity-50 line-through select-none'
                                  : isSelected
                                  ? 'bg-amber-400 text-black shadow-md ring-2 ring-amber-400/40 font-black scale-[1.02] cursor-pointer'
                                  : 'bg-slate-950 text-slate-300 border border-slate-800 hover:border-slate-700 hover:text-white cursor-pointer'
                              }`}
                            >
                              <span>{slot}</span>
                              {isConfirmed && (
                                <span className="block text-[8px] font-sans font-normal text-rose-500/80 no-underline leading-none mt-0.5">
                                  zajęte
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Podsumowanie wybranego terminu (jeśli wybrano) */}
                    {preferredDate && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-amber-400 shrink-0" />
                          <div>
                            <span className="text-slate-400 text-[11px]">Wybrany termin wizyty: </span>
                            <strong className="text-amber-300 font-semibold">{preferredDate}</strong>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleClearDateTime}
                          className="text-[11px] text-slate-400 hover:text-white underline cursor-pointer shrink-0 ml-2"
                        >
                          Wyczyść
                        </button>
                      </div>
                    )}

                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">
                      Dodatkowe uwagi dla technika (opcjonalnie)
                    </label>
                    <textarea
                      rows={2}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="np. silnik bierze olej, auto jeździ głównie po mieście..."
                      className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 resize-none"
                    />
                  </div>

                  {attemptedSubmit && !isContactComplete && (
                    <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                      Proszę uzupełnić wymagane pola kontaktowe (imię i nazwisko, numer telefonu, adres e-mail).
                    </div>
                  )}

                  {/* Action Button: Submit Inquiry */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-4 w-full py-4 px-6 text-sm font-bold uppercase tracking-wider text-black bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400 hover:from-amber-300 hover:to-amber-400 rounded-xl shadow-xl shadow-amber-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <span>Przesyłanie zapytania...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4 text-black" />
                        <span>Prześlij formularz – Otrzymaj ofertę w kilkanaście minut</span>
                      </>
                    )}
                  </button>

                  <div className="mt-3 text-[11px] text-center text-slate-400 flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Bezpłatna wycena bez żadnych zobowiązań</span>
                  </div>

                </form>

              </div>

            </div>

          </div>
        )}

      </div>
    </section>
  );
};
