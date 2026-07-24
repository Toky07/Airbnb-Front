import { useEffect, useId, useMemo, useRef, useState } from 'react';
import type { CountryCode } from 'libphonenumber-js';
import { getPhoneCountryOptions } from './phone-countries';
import {
  DEFAULT_PHONE_COUNTRY,
  formatNationalInput,
  parsePhoneValue,
  toE164Phone,
} from './phone-utils';

type PhoneInputProps = {
  id?: string;
  label?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
  className?: string;
  hint?: string;
  defaultCountry?: CountryCode;
};

const PhoneInput = ({
  id,
  label = 'Téléphone',
  value,
  onChange,
  required = false,
  disabled = false,
  error = false,
  fullWidth = false,
  className = '',
  hint,
  defaultCountry = DEFAULT_PHONE_COUNTRY,
}: PhoneInputProps) => {
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const countryOptions = useMemo(() => getPhoneCountryOptions(), []);
  const isFocusedRef = useRef(false);

  const initial = parsePhoneValue(value, defaultCountry);
  const [country, setCountry] = useState<CountryCode>(initial.country);
  const [national, setNational] = useState(initial.national);

  useEffect(() => {
    if (isFocusedRef.current) {
      return;
    }

    const next = parsePhoneValue(value, defaultCountry);
    const currentE164 = toE164Phone(national, country);
    if (value === currentE164 && next.country === country) {
      return;
    }

    setCountry(next.country);
    setNational(next.national);
  }, [value, defaultCountry, national, country]);

  const shellClass = [
    'flex overflow-hidden rounded-xl border bg-white transition duration-200',
    error
      ? 'border-red-300 focus-within:border-red-400 focus-within:ring-2 focus-within:ring-red-100'
      : 'border-line focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
    disabled ? 'bg-mist opacity-70' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const handleCountryChange = (nextCountry: CountryCode) => {
    setCountry(nextCountry);
    const formatted = formatNationalInput(national, nextCountry);
    setNational(formatted);
    onChange(toE164Phone(formatted, nextCountry));
  };

  const handleNationalChange = (raw: string) => {
    const formatted = formatNationalInput(raw, country);
    setNational(formatted);
    onChange(toE164Phone(formatted, country));
  };

  return (
    <div className={[fullWidth ? 'sm:col-span-2' : '', className].filter(Boolean).join(' ')}>
      {label ? (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-ink/80">
          {label}
          {required ? <span className="text-brand"> *</span> : null}
        </label>
      ) : null}

      <div className={shellClass}>
        <label className="sr-only" htmlFor={`${inputId}-country`}>
          Indicatif pays
        </label>
        <select
          id={`${inputId}-country`}
          value={country}
          disabled={disabled}
          onChange={(event) => handleCountryChange(event.target.value as CountryCode)}
          className="max-w-[8.5rem] shrink-0 border-0 border-r border-line bg-mist/50 px-2.5 py-3 text-sm text-ink outline-none disabled:cursor-not-allowed"
          aria-label="Indicatif pays"
        >
          {countryOptions.map((option) => (
            <option key={option.code} value={option.code}>
              {option.flag} {option.code} {option.dialCode}
            </option>
          ))}
        </select>

        <div className="flex min-w-0 flex-1 items-center px-3">
          <input
            id={inputId}
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            required={required}
            disabled={disabled}
            value={national}
            onFocus={() => {
              isFocusedRef.current = true;
            }}
            onBlur={() => {
              isFocusedRef.current = false;
              const next = parsePhoneValue(value || toE164Phone(national, country), country);
              setCountry(next.country);
              setNational(next.national);
              if (next.national) {
                onChange(toE164Phone(next.national, next.country));
              }
            }}
            onChange={(event) => handleNationalChange(event.target.value)}
            placeholder="06 12 34 56 78"
            aria-invalid={error || undefined}
            className="min-w-0 flex-1 border-0 bg-transparent py-3 text-sm text-ink outline-none placeholder:text-ink/40 disabled:cursor-not-allowed"
          />
        </div>
      </div>

      {hint ? <p className="mt-1.5 text-xs text-ink/50">{hint}</p> : null}
    </div>
  );
};

export default PhoneInput;
