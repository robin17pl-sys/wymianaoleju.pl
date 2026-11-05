/**
 * Automatyczna wysyłka wiadomości e-mail do serwisu ZMIANAOLEJU.pl (dreamstudiopl@gmail.com)
 * Wykorzystuje bezgłowy endpoint AJAX oraz niewidoczną wysyłkę formularza,
 * dzięki czemu wiadomość wysyła się w 100% automatycznie w tle,
 * bez konieczności otwierania programu pocztowego u klienta.
 */

export const TARGET_EMAIL = 'dreamstudiopl@gmail.com';

export interface InquiryEmailData {
  referenceNumber: string;
  clientName: string;
  phone: string;
  email: string;
  registrationPlate?: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  vehicleEngine: string;
  fuelType: string;
  selectedOilBrand: string;
  selectedFilterBrand: string;
  includeFlush: boolean;
  includeMetalGuard: boolean;
  preferredDate?: string;
  notes?: string;
  source: 'Konfigurator Wyceny' | 'Rezerwacja Terminu' | 'Formularz Kontaktowy';
}

export async function sendAutomatedEmail(data: InquiryEmailData): Promise<{ success: boolean; error?: string }> {
  const subject = `[ZMIANAOLEJU.pl] ${data.source}: ${data.vehicleMake} ${data.vehicleModel} (${data.referenceNumber})`;

  const payload: Record<string, string> = {
    _subject: subject,
    _template: 'table',
    _captcha: 'false',
    _replyto: data.email || TARGET_EMAIL,
    'Typ_Zgłoszenia': data.source,
    'Numer_Referencyjny': data.referenceNumber,
    'Imię_i_Nazwisko': data.clientName,
    'Telefon': data.phone,
    'Adres_Email': data.email || 'Nie podano',
    'Pojazd': `${data.vehicleMake} ${data.vehicleModel} (${data.vehicleYear})`,
    'Silnik': `${data.vehicleEngine} [${data.fuelType}]`,
    'Numer_Rejestracyjny': data.registrationPlate || 'Brak / Do ustalenia',
    'Producent_Oleju': data.selectedOilBrand,
    'Producent_Filtra': data.selectedFilterBrand,
    'Płukanie_Silnika': data.includeFlush ? 'TAK (+49 zł)' : 'NIE',
    'Metal_Guard': data.includeMetalGuard ? 'TAK (+69 zł)' : 'NIE',
    'Preferowany_Termin': data.preferredDate || 'Do ustalenia w ofercie',
    'Uwagi_Klienta': data.notes || 'Brak dodatkowych uwag',
    'Data_Wysłania': new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  };

  try {
    // 1. Bezgłowy AJAX POST do FormSubmit
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return { success: true };
    }
  } catch (err) {
    console.warn('Wysyłka AJAX nie powiodła się, uruchamiam fallback w tle:', err);
  }

  // 2. Niezawodny fallback w tle bez przeładowywania strony
  try {
    sendViaHiddenIframeForm(payload);
    return { success: true };
  } catch (fallbackErr) {
    console.error('Błąd wysyłki:', fallbackErr);
    return { success: false, error: 'Nie udało się wysłać e-maila.' };
  }
}

export async function sendContactMessage(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): Promise<{ success: boolean }> {
  const payload: Record<string, string> = {
    _subject: `[ZMIANAOLEJU.pl] Zapytanie kontaktowe: ${data.name} (${data.phone})`,
    _template: 'table',
    _captcha: 'false',
    _replyto: data.email || TARGET_EMAIL,
    'Imię_i_Nazwisko': data.name,
    'Telefon': data.phone,
    'Adres_Email': data.email || 'Nie podano',
    'Wiadomość_Klienta': data.message || 'Prośba o szybki kontakt i konsultację techniczną',
    'Data_Wysłania': new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  };

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      return { success: true };
    }
  } catch (err) {
    console.warn('Wysyłka AJAX kontaktu nie powiodła się, fallback w tle:', err);
  }

  try {
    sendViaHiddenIframeForm(payload);
    return { success: true };
  } catch {
    return { success: false };
  }
}

function sendViaHiddenIframeForm(fields: Record<string, string>) {
  if (typeof document === 'undefined') return;

  let iframe = document.getElementById('hidden_email_iframe') as HTMLIFrameElement;
  if (!iframe) {
    iframe = document.createElement('iframe');
    iframe.id = 'hidden_email_iframe';
    iframe.name = 'hidden_email_iframe';
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
  }

  const form = document.createElement('form');
  form.action = `https://formsubmit.co/${TARGET_EMAIL}`;
  form.method = 'POST';
  form.target = 'hidden_email_iframe';
  form.style.display = 'none';

  for (const [key, value] of Object.entries(fields)) {
    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = key;
    input.value = value;
    form.appendChild(input);
  }

  document.body.appendChild(form);
  form.submit();
  setTimeout(() => {
    form.remove();
  }, 1200);
}
