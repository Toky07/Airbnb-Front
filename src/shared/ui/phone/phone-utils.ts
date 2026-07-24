import {
  AsYouType,
  parsePhoneNumberFromString,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js';

export const DEFAULT_PHONE_COUNTRY: CountryCode = 'FR';

export function parsePhoneValue(
  value: string,
  fallbackCountry: CountryCode = DEFAULT_PHONE_COUNTRY,
): { country: CountryCode; national: string } {
  const trimmed = value.trim();
  if (!trimmed) {
    return { country: fallbackCountry, national: '' };
  }

  const parsed =
    parsePhoneNumberFromString(trimmed) ??
    parsePhoneNumberFromString(trimmed, fallbackCountry);

  if (parsed) {
    const country = parsed.country ?? fallbackCountry;
    return {
      country,
      national: parsed.formatNational(),
    };
  }

  return {
    country: fallbackCountry,
    national: trimmed.replace(/^\+\d{1,4}\s*/, ''),
  };
}

export function formatNationalInput(national: string, country: CountryCode): string {
  return new AsYouType(country).input(national);
}

export function toE164Phone(national: string, country: CountryCode): string {
  const trimmed = national.trim();
  if (!trimmed) {
    return '';
  }

  const parsed = parsePhoneNumberFromString(trimmed, country);
  if (parsed) {
    return parsed.number;
  }

  const digits = trimmed.replace(/\D/g, '');
  if (!digits) {
    return '';
  }

  return `+${getCountryCallingCode(country)}${digits}`;
}
