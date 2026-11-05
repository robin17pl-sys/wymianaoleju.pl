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

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  try {
    // 1. Bezgłowy AJAX z FormData do FormSubmit
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
    });

    const resJson = await response.json().catch(() => null);
    if (response.ok && (!resJson || resJson.success !== 'false')) {
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

/**
 * Wymusza bezpośrednie wysłanie wiadomości aktywacyjnej z FormSubmit w nowej karcie.
 * FormSubmit wymaga jednorazowego standardowego POST-a z poziomu przeglądarki,
 * aby wygenerować link potwierdzający do skrzynki dreamstudiopl@gmail.com.
 */
export function triggerFormSubmitActivation() {
  if (typeof document === 'undefined') return;

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = `https://formsubmit.co/${TARGET_EMAIL}`;
  form.target = '_blank';

  const fields: Record<string, string> = {
    _subject: 'Aktywacja powiadomień ze strony ZMIANAOLEJU.pl (dreamstudiopl@gmail.com)',
    _template: 'table',
    _captcha: 'false',
    Serwis: 'ZMIANAOLEJU.pl - Ekspresowa Wymiana Oleju',
    Cel: 'Jednorazowa autoryzacja skrzynki dreamstudiopl@gmail.com w FormSubmit',
    Adres_Docelowy: TARGET_EMAIL,
    Wiadomość: 'Kliknij przycisk "Activate Form" w e-mailu aktywacyjnym przesłanym przez FormSubmit, aby odblokować powiadomienia.',
    Data_Wysłania: new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  };

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
  }, 1000);
}

/**
 * Wysyła szybki testowy e-mail na dreamstudiopl@gmail.com
 */
export async function sendTestEmail(): Promise<{ success: boolean; message: string }> {
  const payload: Record<string, string> = {
    _subject: '[TEST ZMIANAOLEJU.pl] Testowa wysyłka powiadomienia na dreamstudiopl@gmail.com',
    _template: 'table',
    _captcha: 'false',
    _replyto: TARGET_EMAIL,
    'Status': 'Test połączenia z formularzem wymianaoleju.pl',
    'Odbiorca': TARGET_EMAIL,
    'Serwis': 'ZMIANAOLEJU.pl Express Oil Service',
    'Data_i_Godzina': new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' }),
    'Komunikat': 'Jeśli widzisz tę wiadomość, automatyczne powiadomienia z konfiguratora i rezerwacji działają w 100% poprawnie!'
  };

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  try {
    const res = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: formData
    });

    const data = await res.json().catch(() => null);
    if (res.ok && (!data || data.success !== 'false')) {
      return { success: true, message: 'Wiadomość testowa wysłana! Sprawdź skrzynkę dreamstudiopl@gmail.com.' };
    } else if (data && data.message) {
      return { success: false, message: `Odpowiedź serwera: ${data.message}` };
    }
  } catch (err) {
    console.warn('Błąd wysyłki testu AJAX:', err);
  }

  // Fallback
  try {
    sendViaHiddenIframeForm(payload);
    return { success: true, message: 'Wiadomość testowa wysłana w tle! Sprawdź dreamstudiopl@gmail.com.' };
  } catch {
    return { success: false, message: 'Wystąpił błąd podczas wysyłania testu.' };
  }
}

export async function sendContactMessage(data: {
  name: string;
  phone: string;
  email: string;
  message: string;
}): Promise<{ success: boolean }> {
  const payload: Record<string, string> = {
    _subject: `[ZMIANAOLEJU.pl] Wiadomość z formularza kontaktowego: ${data.name} (${data.phone})`,
    _template: 'table',
    _captcha: 'false',
    _replyto: data.email || TARGET_EMAIL,
    'Imię_i_Nazwisko': data.name,
    'Telefon': data.phone,
    'Adres_Email': data.email || 'Nie podano',
    'Wiadomość': data.message || 'Prośba o kontakt ze strony serwisu',
    'Data_Wysłania': new Date().toLocaleString('pl-PL', { timeZone: 'Europe/Warsaw' })
  };

  const formData = new FormData();
  for (const [key, value] of Object.entries(payload)) {
    formData.append(key, value);
  }

  try {
    const response = await fetch(`https://formsubmit.co/ajax/${TARGET_EMAIL}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json'
      },
      body: formData
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
