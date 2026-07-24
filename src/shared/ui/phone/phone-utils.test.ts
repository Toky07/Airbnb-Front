import {
  AsYouType,
  parsePhoneNumberFromString,
  getCountryCallingCode,
  type CountryCode,
} from 'libphonenumber-js';
import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PHONE_COUNTRY,
  formatNationalInput,
  parsePhoneValue,
  toE164Phone,
} from './phone-utils';
import { countryToFlag } from './phone-countries';

describe('phone-utils', () => {
  it('parse un numéro E.164 français', () => {
    const result = parsePhoneValue('+33601020304');
    expect(result.country).toBe('FR');
    expect(result.national).toBe('06 01 02 03 04');
  });

  it('formate la saisie nationale', () => {
    expect(formatNationalInput('0612345678', 'FR' as CountryCode)).toBe('06 12 34 56 78');
  });

  it('convertit vers E.164', () => {
    expect(toE164Phone('06 12 34 56 78', 'FR')).toBe('+33612345678');
  });

  it('retourne vide pour une saisie vide', () => {
    expect(toE164Phone('', DEFAULT_PHONE_COUNTRY)).toBe('');
    expect(parsePhoneValue('').national).toBe('');
  });

  it('génère un drapeau emoji', () => {
    expect(countryToFlag('FR')).toBe('🇫🇷');
  });

  it('AsYouType reste cohérent avec parsePhoneNumberFromString', () => {
    const formatted = new AsYouType('FR').input('0612345678');
    const parsed = parsePhoneNumberFromString(formatted, 'FR');
    expect(parsed?.number).toBe('+33612345678');
    expect(getCountryCallingCode('FR')).toBe('33');
  });
});
