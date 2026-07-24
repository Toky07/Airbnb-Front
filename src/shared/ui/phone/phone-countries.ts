import {
  getCountries,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js';

export type PhoneCountryOption = {
  code: CountryCode;
  dialCode: string;
  flag: string;
  name: string;
};

const COUNTRY_NAMES: Partial<Record<CountryCode, string>> = {
  FR: 'France',
  BE: 'Belgique',
  CH: 'Suisse',
  CA: 'Canada',
  MG: 'Madagascar',
  RE: 'La Réunion',
  GP: 'Guadeloupe',
  MQ: 'Martinique',
  GF: 'Guyane',
  US: 'États-Unis',
  GB: 'Royaume-Uni',
  DE: 'Allemagne',
  ES: 'Espagne',
  IT: 'Italie',
  PT: 'Portugal',
  MA: 'Maroc',
  SN: 'Sénégal',
  CI: "Côte d'Ivoire",
  LU: 'Luxembourg',
  NL: 'Pays-Bas',
};

const PREFERRED_COUNTRIES: CountryCode[] = [
  'FR',
  'BE',
  'CH',
  'CA',
  'MG',
  'RE',
  'GP',
  'MQ',
  'GF',
  'US',
  'GB',
  'DE',
  'ES',
  'IT',
  'PT',
  'MA',
  'SN',
  'CI',
];

export function countryToFlag(countryCode: string): string {
  return countryCode
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

export function getPhoneCountryOptions(): PhoneCountryOption[] {
  const available = new Set(getCountries());
  const preferred = PREFERRED_COUNTRIES.filter((code) => available.has(code));
  const preferredSet = new Set(preferred);
  const rest = getCountries()
    .filter((code) => !preferredSet.has(code))
    .sort((a, b) => a.localeCompare(b));

  return [...preferred, ...rest].map((code) => ({
    code,
    dialCode: `+${getCountryCallingCode(code)}`,
    flag: countryToFlag(code),
    name: COUNTRY_NAMES[code] ?? code,
  }));
}
