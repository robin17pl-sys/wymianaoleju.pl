/**
 * Zarządzanie cenami, konfiguracją i rezerwacjami serwisu wymiany oleju OILEXX.
 * Dane zapisywane są w localStorage z możliwością edycji w Panelu Administracyjnym.
 */

export interface ServicePrices {
  laborCostNetto: number; // Robocizna standardowa (netto)
  filterPricesNetto: {
    Standard: number;
    Premium: number;
    Performance: number;
  };
  oilPricesPerLiterNetto: {
    Motul: number;
    'Liqui Moly': number;
    Valvoline: number;
  };
  addonsNetto: {
    engineFlush: number; // Płukanie silnika
    metalGuard: number; // Dodatkowa ochrona silnika Metal Guard (min. 49 zł)
  };
  vatRate: number; // np. 0.23 (23%)
}

export interface WorkshopSettings {
  companyName: string;
  tagline: string;
  subtagline: string;
  expressTimeMinutes: number; // 27 minut
  addressStreet: string;
  addressCity: string;
  addressPostalCode: string;
  phone: string;
  email: string;
  googleMapsEmbedUrl: string;
  workingHoursWeekday: string;
  workingHoursSaturday: string;
  workingHoursSunday: string;
  availableSlotIntervalMinutes: number;
}

export interface AppointmentBooking {
  id: string;
  referenceNumber: string;
  createdAt: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  clientName: string;
  phone: string;
  email: string;
  registrationPlate: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleEngine: string;
  selectedOilBrand: 'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr';
  selectedFilterBrand?: 'Filtron' | 'Bosch' | 'Hengst' | 'Własny filtr' | 'Własny olej i filtr';
  oilProductName: string;
  oilQuantityLiters: number;
  includeEngineFlush: boolean;
  includeMetalGuard: boolean;
  totalNetto: number;
  totalBrutto: number;
  status: 'Oczekująca' | 'Potwierdzona' | 'Zrealizowana' | 'Odwołana';
  notes?: string;
}

export interface AdminStoreData {
  prices: ServicePrices;
  settings: WorkshopSettings;
  bookings: AppointmentBooking[];
}

const STORAGE_KEY = 'zmianaoleju_admin_store_v4';

export const DEFAULT_PRICES: ServicePrices = {
  laborCostNetto: 119, // 119 zł netto za robociznę (wymiana oleju + filtra + przegląd punktowy)
  filterPricesNetto: {
    Standard: 45,
    Premium: 65,
    Performance: 95
  },
  oilPricesPerLiterNetto: {
    Motul: 54, // zł netto za 1 litr
    'Liqui Moly': 58,
    Valvoline: 48
  },
  addonsNetto: {
    engineFlush: 49, // Płukanie silnika +49 zł
    metalGuard: 69   // Metal Guard +69 zł
  },
  vatRate: 0.23
};

export const DEFAULT_SETTINGS: WorkshopSettings = {
  companyName: 'ZMIANAOLEJU.pl Express Oil Service',
  tagline: 'Twój silnik zasługuje na najlepszy olej. My zadbamy o resztę!',
  subtagline: 'Specjalizujemy się wyłącznie w wymianie oleju silnikowego i filtrów. Wybierasz producenta, poznajesz cenę i umawiasz wizytę. Bez niespodzianek.',
  expressTimeMinutes: 27,
  addressStreet: 'ul. Górna 7',
  addressCity: 'Świętochłowice',
  addressPostalCode: '41-608',
  phone: '+48 500 184 999',
  email: 'dreamstudiopl@gmail.com',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=%C5%9Awi%C4%99toch%C5%82owice%2C%20G%C3%B3rna%207%2C%2041-608&t=&z=16&ie=UTF8&iwloc=&output=embed',
  workingHoursWeekday: 'Poniedziałek – Piątek: 07:30 – 19:00',
  workingHoursSaturday: 'Sobota: 08:00 – 15:00',
  workingHoursSunday: 'Niedziela: Zamknięte',
  availableSlotIntervalMinutes: 30
};

export const INITIAL_SAMPLE_BOOKINGS: AppointmentBooking[] = [
  {
    id: 'bk-1001',
    referenceNumber: 'OIL-2026-9421',
    createdAt: '2026-10-31 14:20',
    date: '2026-11-02',
    timeSlot: '09:00',
    clientName: 'Marek Kamiński',
    phone: '+48 601 234 567',
    email: 'm.kaminski@example.com',
    registrationPlate: 'WI 9420A',
    vehicleMake: 'Volkswagen',
    vehicleModel: 'Golf VII (5G)',
    vehicleEngine: '2.0 TDI CR (150 KM)',
    selectedOilBrand: 'Motul',
    oilProductName: 'Motul 8100 X-clean+ 5W-30',
    oilQuantityLiters: 4.7,
    includeEngineFlush: true,
    includeMetalGuard: true,
    totalNetto: 476.8,
    totalBrutto: 586.46,
    status: 'Potwierdzona',
    notes: 'Proszę o sprawdzenie koloru starego oleju przed płukaniem.'
  },
  {
    id: 'bk-1002',
    referenceNumber: 'OIL-2026-9422',
    createdAt: '2026-11-01 08:15',
    date: '2026-11-02',
    timeSlot: '11:30',
    clientName: 'Tomasz Nowak',
    phone: '+48 502 987 654',
    email: 'tomasz.nowak@firm.pl',
    registrationPlate: 'WA 88219',
    vehicleMake: 'BMW',
    vehicleModel: 'Seria 3 G20 / G21',
    vehicleEngine: '320d / 320d xDrive (190 KM)',
    selectedOilBrand: 'Liqui Moly',
    oilProductName: 'Liqui Moly Top Tec 4600 5W-30',
    oilQuantityLiters: 5.0,
    includeEngineFlush: false,
    includeMetalGuard: true,
    totalNetto: 523.0,
    totalBrutto: 643.29,
    status: 'Oczekująca',
    notes: 'Auto flotowe, proszę o fakturę VAT.'
  }
];

export function getAdminStore(): AdminStoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: AdminStoreData = {
        prices: DEFAULT_PRICES,
        settings: DEFAULT_SETTINGS,
        bookings: INITIAL_SAMPLE_BOOKINGS
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (parsed?.settings) {
      parsed.settings.email = 'dreamstudiopl@gmail.com';
      parsed.settings.phone = '+48 500 184 999';
    }
    return parsed;
  } catch {
    return {
      prices: DEFAULT_PRICES,
      settings: DEFAULT_SETTINGS,
      bookings: INITIAL_SAMPLE_BOOKINGS
    };
  }
}

export function saveAdminStore(data: AdminStoreData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('oilexx-store-updated'));
  } catch (err) {
    console.error('Failed to save store', err);
  }
}

export function resetAdminStore(): AdminStoreData {
  const initial: AdminStoreData = {
    prices: DEFAULT_PRICES,
    settings: DEFAULT_SETTINGS,
    bookings: INITIAL_SAMPLE_BOOKINGS
  };
  saveAdminStore(initial);
  return initial;
}

export function calculateQuotation(
  oilLiters: number,
  filterTier: 'Standard' | 'Premium' | 'Performance',
  oilBrand: 'Motul' | 'Liqui Moly' | 'Valvoline' | 'Własny olej i filtr',
  includeFlush: boolean,
  includeMetalGuard: boolean,
  prices: ServicePrices
) {
  const isCustomerMaterials = oilBrand === 'Własny olej i filtr';
  const oilPricePerLiter = isCustomerMaterials ? 0 : (prices.oilPricesPerLiterNetto[oilBrand as 'Motul' | 'Liqui Moly' | 'Valvoline'] ?? 50);
  const oilTotalNetto = isCustomerMaterials ? 0 : Number((oilLiters * oilPricePerLiter).toFixed(2));
  const filterNetto = isCustomerMaterials ? 0 : (prices.filterPricesNetto[filterTier] ?? 45);
  const laborNetto = prices.laborCostNetto;
  const flushNetto = includeFlush ? prices.addonsNetto.engineFlush : 0;
  const metalGuardNetto = includeMetalGuard ? prices.addonsNetto.metalGuard : 0;

  const totalNetto = Number((oilTotalNetto + filterNetto + laborNetto + flushNetto + metalGuardNetto).toFixed(2));
  const vatAmount = Number((totalNetto * prices.vatRate).toFixed(2));
  const totalBrutto = Number((totalNetto + vatAmount).toFixed(2));

  return {
    oilPricePerLiter,
    oilTotalNetto,
    filterNetto,
    laborNetto,
    flushNetto,
    metalGuardNetto,
    totalNetto,
    vatAmount,
    totalBrutto
  };
}

/**
 * Sprawdza, czy dla danej daty i godziny istnieje potwierdzona rezerwacja w CMS.
 * Jeśli rezerwacja ma status 'Potwierdzona' lub 'Zrealizowana', slot jest blokowany na stronie na szaro.
 */
export function isBookingConfirmedForSlot(
  bookings: AppointmentBooking[] | undefined,
  dateStr: string,
  timeSlot: string
): boolean {
  if (!bookings || !dateStr || !timeSlot) return false;

  const normalize = (d: string) => {
    if (!d) return '';
    const clean = d.split('T')[0].trim();
    return clean;
  };

  const target = normalize(dateStr);

  return bookings.some((b) => {
    if (b.status !== 'Potwierdzona' && b.status !== 'Zrealizowana') return false;
    const bDate = normalize(b.date);
    return bDate === target && b.timeSlot === timeSlot;
  });
}
