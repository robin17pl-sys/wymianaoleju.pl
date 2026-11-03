import React, { useState } from 'react';
import { 
  X, 
  DollarSign, 
  Calendar, 
  Users, 
  Settings, 
  Save, 
  RotateCcw, 
  Check, 
  ShieldAlert, 
  Clock, 
  Search,
  Filter,
  Car,
  Droplet
} from 'lucide-react';
import { 
  AdminStoreData, 
  saveAdminStore, 
  resetAdminStore, 
  AppointmentBooking, 
  ServicePrices, 
  WorkshopSettings 
} from '../data/adminStore';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: AdminStoreData;
  onDataUpdated: (data: AdminStoreData) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onDataUpdated
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'prices' | 'bookings' | 'customers' | 'settings'>('prices');
  
  // Local state for editing
  const [prices, setPrices] = useState<ServicePrices>({ ...initialData.prices });
  const [settings, setSettings] = useState<WorkshopSettings>({ ...initialData.settings });
  const [bookings, setBookings] = useState<AppointmentBooking[]>([...initialData.bookings]);
  
  // Search query for bookings/customers
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Save changes handler
  const handleSave = () => {
    const updated: AdminStoreData = {
      prices,
      settings,
      bookings
    };
    saveAdminStore(updated);
    onDataUpdated(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  // Reset to default handler
  const handleReset = () => {
    if (confirm('Czy na pewno chcesz przywrócić domyślne stawki i konfigurację?')) {
      const fresh = resetAdminStore();
      setPrices({ ...fresh.prices });
      setSettings({ ...fresh.settings });
      setBookings([...fresh.bookings]);
      onDataUpdated(fresh);
    }
  };

  // Change booking status
  const handleStatusChange = (bookingId: string, newStatus: AppointmentBooking['status']) => {
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
    setBookings(updated);
    const storeUpdated = { prices, settings, bookings: updated };
    saveAdminStore(storeUpdated);
    onDataUpdated(storeUpdated);
  };

  // Filtered bookings
  const filteredBookings = bookings.filter(b => {
    const matchesSearch = 
      b.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.registrationPlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.phone.includes(searchQuery) ||
      b.referenceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
      
      <div className="relative w-full max-w-5xl my-6 bg-[#0c1017] border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#111722] border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-black text-lg text-white uppercase tracking-tight flex items-center gap-2">
                <span>Panel Zarządzania ZMIANAOLEJU.pl</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-400 text-black font-extrabold uppercase">
                  Właściciel
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Edycja cennika, stawek robocizny, rezerwacji i danych warsztatu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {savedSuccess && (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mr-2">
                <Check className="w-4 h-4" /> Zapisano!
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Zapisz zmiany</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center px-6 bg-[#0e131d] border-b border-slate-800/80 gap-2 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('prices')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'prices'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Cennik Olejów i Usług</span>
          </button>

          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'bookings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Rezerwacje ({bookings.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('customers')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'customers'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Baza Klientów</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors flex items-center gap-2 cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Dane Firmy i Treści</span>
          </button>
        </div>

        {/* Tab Content Area (Scrollable) */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: PRICING */}
          {activeTab === 'prices' && (
            <div className="space-y-6">
              
              {/* Robocizna podstawowa */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-1">
                  1. Robocizna Podstawowa (Wymiana oleju i filtra w 27 min)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Cena za usługę ekspresowej wymiany, kontrolę szczelności podnośnikiem i dokręcenie kluczem Nm.
                </p>

                <div className="max-w-xs">
                  <label className="block text-xs text-slate-300 mb-1">Koszt robocizny (zł netto):</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={prices.laborCostNetto}
                      onChange={(e) => setPrices({ ...prices, laborCostNetto: Number(e.target.value) })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">zł netto</span>
                  </div>
                </div>
              </div>

              {/* Ceny oleju za 1 litr (Strictly 3 brands: Motul, Liqui Moly, Valvoline) */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-1">
                  2. Ceny Olejów za 1 Litr (zł netto)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Stawka za litr mnożona jest przez dokładną pojemność miski olejowej wybranego pojazdu.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  
                  {/* Motul */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-sm text-red-400 mb-2">MOTUL (Francja)</div>
                    <label className="block text-[11px] text-slate-400 mb-1">Cena netto za 1 L:</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={prices.oilPricesPerLiterNetto.Motul}
                        onChange={(e) => setPrices({
                          ...prices,
                          oilPricesPerLiterNetto: {
                            ...prices.oilPricesPerLiterNetto,
                            Motul: Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">zł/L</span>
                    </div>
                  </div>

                  {/* Liqui Moly */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-sm text-blue-400 mb-2">LIQUI MOLY (Niemcy)</div>
                    <label className="block text-[11px] text-slate-400 mb-1">Cena netto za 1 L:</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={prices.oilPricesPerLiterNetto['Liqui Moly']}
                        onChange={(e) => setPrices({
                          ...prices,
                          oilPricesPerLiterNetto: {
                            ...prices.oilPricesPerLiterNetto,
                            'Liqui Moly': Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">zł/L</span>
                    </div>
                  </div>

                  {/* Valvoline */}
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="font-bold text-sm text-amber-400 mb-2">VALVOLINE (USA)</div>
                    <label className="block text-[11px] text-slate-400 mb-1">Cena netto za 1 L:</label>
                    <div className="relative">
                      <input
                        type="number"
                        value={prices.oilPricesPerLiterNetto.Valvoline}
                        onChange={(e) => setPrices({
                          ...prices,
                          oilPricesPerLiterNetto: {
                            ...prices.oilPricesPerLiterNetto,
                            Valvoline: Number(e.target.value)
                          }
                        })}
                        className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white font-bold"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">zł/L</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* Filtry oleju wg kategorii */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-1">
                  3. Ceny Filtrów Oleju (zł netto)
                </h4>
                <p className="text-xs text-slate-400 mb-4">
                  Dopasowywane automatycznie w zależności od klasy silnika pojazdu (Mann, Mahle, Knecht).
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Standard (np. 1.4-2.0 TDI/TSI):</label>
                    <input
                      type="number"
                      value={prices.filterPricesNetto.Standard}
                      onChange={(e) => setPrices({
                        ...prices,
                        filterPricesNetto: { ...prices.filterPricesNetto, Standard: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Premium (np. BMW B47, Mercedes OM654):</label>
                    <input
                      type="number"
                      value={prices.filterPricesNetto.Premium}
                      onChange={(e) => setPrices({
                        ...prices,
                        filterPricesNetto: { ...prices.filterPricesNetto, Premium: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Performance (np. V6, GTI, B58):</label>
                    <input
                      type="number"
                      value={prices.filterPricesNetto.Performance}
                      onChange={(e) => setPrices({
                        ...prices,
                        filterPricesNetto: { ...prices.filterPricesNetto, Performance: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Dodatki */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-1">
                  4. Usługi Dodatkowe i Ochrona Silnika (zł netto)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Płukanie silnika chemią warsztatową (Engine Flush):</label>
                    <input
                      type="number"
                      value={prices.addonsNetto.engineFlush}
                      onChange={(e) => setPrices({
                        ...prices,
                        addonsNetto: { ...prices.addonsNetto, engineFlush: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-300 mb-1">Metal Guard – Nanomodyfikator tarcia (zł netto):</label>
                    <input
                      type="number"
                      value={prices.addonsNetto.metalGuard}
                      onChange={(e) => setPrices({
                        ...prices,
                        addonsNetto: { ...prices.addonsNetto, metalGuard: Number(e.target.value) }
                      })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white font-bold"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: BOOKINGS */}
          {activeTab === 'bookings' && (
            <div className="space-y-4">
              
              {/* Search and status filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Szukaj po tablicy rejestracyjnej, nazwisku lub telefonie..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg text-xs text-white px-3 py-2"
                  >
                    <option value="all">Wszystkie statusy</option>
                    <option value="Oczekująca">Oczekująca</option>
                    <option value="Potwierdzona">Potwierdzona</option>
                    <option value="Zrealizowana">Zrealizowana</option>
                    <option value="Odwołana">Odwołana</option>
                  </select>
                </div>
              </div>

              {/* Bookings Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs divide-y divide-slate-800">
                  <thead className="bg-[#111622] text-slate-400 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Nr zlecenia</th>
                      <th className="py-3 px-4">Termin</th>
                      <th className="py-3 px-4">Pojazd & Tablica</th>
                      <th className="py-3 px-4">Klient & Tel</th>
                      <th className="py-3 px-4">Olej & Dodatki</th>
                      <th className="py-3 px-4 text-right">Kwota Brutto</th>
                      <th className="py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-slate-500">
                          Brak rezerwacji spełniających kryteria wyszukiwania.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-slate-900/60">
                          <td className="py-3 px-4 font-mono font-bold text-amber-400">
                            {b.referenceNumber}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-white">{b.date}</div>
                            <div className="text-[11px] text-amber-300 font-mono">{b.timeSlot}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-bold text-white">{b.vehicleMake} {b.vehicleModel}</div>
                            <div className="font-mono text-amber-300 font-semibold">{b.registrationPlate}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-200">{b.clientName}</div>
                            <div className="text-slate-400 font-mono">{b.phone}</div>
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-medium text-slate-200">
                              {b.selectedOilBrand === 'Własny olej i filtr' 
                                ? 'Własny olej i filtr' 
                                : `${b.selectedOilBrand} (${b.oilQuantityLiters} L) + ${b.selectedFilterBrand || 'Filtron'}`}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {b.includeEngineFlush ? '✓ Płukanie ' : ''}
                              {b.includeMetalGuard ? '✓ Metal Guard' : ''}
                            </div>
                          </td>
                          <td className="py-3 px-4 text-right font-heading font-bold text-sm text-white tabular-nums">
                            {b.totalBrutto.toFixed(2)} zł
                          </td>
                          <td className="py-3 px-4">
                            <select
                              value={b.status}
                              onChange={(e) => handleStatusChange(b.id, e.target.value as AppointmentBooking['status'])}
                              className={`text-[11px] font-bold rounded px-2 py-1 border ${
                                b.status === 'Potwierdzona' ? 'bg-emerald-950 text-emerald-300 border-emerald-800' :
                                b.status === 'Zrealizowana' ? 'bg-blue-950 text-blue-300 border-blue-800' :
                                b.status === 'Odwołana' ? 'bg-rose-950 text-rose-300 border-rose-800' :
                                'bg-amber-950 text-amber-300 border-amber-800'
                              }`}
                            >
                              <option value="Oczekująca">Oczekująca</option>
                              <option value="Potwierdzona">Potwierdzona</option>
                              <option value="Zrealizowana">Zrealizowana</option>
                              <option value="Odwołana">Odwołana</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* TAB 3: CUSTOMERS */}
          {activeTab === 'customers' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-400">
                Baza klientów budowana automatycznie na podstawie zrealizowanych i zarezerwowanych wizyt.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-start justify-between">
                    <div>
                      <div className="font-bold text-sm text-white">{b.clientName}</div>
                      <div className="text-xs text-slate-400 mt-1">Telefon: <span className="text-white font-mono">{b.phone}</span></div>
                      <div className="text-xs text-slate-400">E-mail: <span className="text-slate-300">{b.email}</span></div>
                      <div className="text-xs text-slate-400 mt-2">
                        Pojazd: <strong className="text-amber-300">{b.registrationPlate}</strong> ({b.vehicleMake} {b.vehicleModel})
                      </div>
                    </div>
                    <span className="text-xs font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      Wizyta: {b.date}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: WORKSHOP SETTINGS & STRINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              
              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
                  Dane teleadresowe i godziny serwisu
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Nazwa firmy / serwisu:</label>
                    <input
                      type="text"
                      value={settings.companyName}
                      onChange={(e) => setSettings({ ...settings, companyName: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Numer telefonu:</label>
                    <input
                      type="text"
                      value={settings.phone}
                      onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Adres (Ulica i nr):</label>
                    <input
                      type="text"
                      value={settings.addressStreet}
                      onChange={(e) => setSettings({ ...settings, addressStreet: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Miasto i kod pocztowy:</label>
                    <input
                      type="text"
                      value={`${settings.addressPostalCode} ${settings.addressCity}`}
                      onChange={(e) => {
                        const parts = e.target.value.split(' ');
                        setSettings({
                          ...settings,
                          addressPostalCode: parts[0] || '41-608',
                          addressCity: parts.slice(1).join(' ') || 'Świętochłowice'
                        });
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
                <h4 className="font-heading text-sm font-bold uppercase tracking-wider text-amber-400 mb-4">
                  Hasła marketingowe i czas operacyjny
                </h4>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Główne hasło marketingowe:</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-400 mb-1">Czas operacyjny wymiany (minuty):</label>
                    <input
                      type="number"
                      value={settings.expressTimeMinutes}
                      onChange={(e) => setSettings({ ...settings, expressTimeMinutes: Number(e.target.value) })}
                      className="w-32 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Danger zone: Reset */}
              <div className="p-4 rounded-xl border border-red-900/40 bg-red-950/20 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-red-400">Przywrócenie ustawień fabrycznych</div>
                  <div className="text-[11px] text-slate-400">Kasuje wprowadzone zmiany cen i przywraca oryginalne stawki domyślne.</div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-4 py-2 rounded-lg bg-red-950 border border-red-800 text-red-300 hover:bg-red-900 text-xs font-bold transition-colors cursor-pointer"
                >
                  Przywróć domyślne
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#111722] border-t border-slate-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            Zmiany w cenniku natychmiast aktualizują kalkulacje w konfiguratorze dla klientów.
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Zamknij
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs uppercase tracking-wider"
            >
              Zapisz i zastosuj
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
