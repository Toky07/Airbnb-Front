import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from 'react';
import { guestFieldClassName, guestFieldDisabledClassName } from './form-field-classes';

type TextFieldBaseProps = {
  label: string;
  className?: string;
  fullWidth?: boolean;
};

type InputFieldProps = TextFieldBaseProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false;
  };

type TextareaFieldProps = TextFieldBaseProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true;
  };

type TextFieldProps = InputFieldProps | TextareaFieldProps;

function fieldClassName(disabled?: boolean) {
  return disabled ? guestFieldDisabledClassName : guestFieldClassName;
}

const TextField = (props: TextFieldProps) => {
  const { label, className = '', fullWidth, multiline, ...rest } = props;
  const wrapperClass = [fullWidth ? 'sm:col-span-2' : '', className].filter(Boolean).join(' ');

  return (
    <label className={['block', wrapperClass].filter(Boolean).join(' ')}>
      <span className="mb-2 block text-sm font-medium text-ink/80">{label}</span>
      {multiline ? (
        <textarea
          {...(rest as TextareaHTMLAttributes<HTMLTextAreaElement>)}
          className={fieldClassName()}
        />
      ) : (
        <input
          {...(rest as InputHTMLAttributes<HTMLInputElement>)}
          className={fieldClassName((rest as InputHTMLAttributes<HTMLInputElement>).disabled)}
        />
      )}
    </label>
  );
};

export default TextField;

export function AuthFormHeader({
  title,
  description,
}: {
  title: string;
  description: ReactNode;
}) {
  return (
    <div className="mb-8 text-center">
      <h1 className="font-display text-2xl font-bold text-ink">{title}</h1>
      <p className="mt-2 text-sm text-ink/60">{description}</p>
    </div>
  );
}
