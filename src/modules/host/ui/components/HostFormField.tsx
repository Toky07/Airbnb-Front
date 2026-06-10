import type { ReactNode } from 'react';
import { hostFieldLabelClassName } from '../constants/host-form-classes';

type HostFormFieldProps = {
  label: string;
  children: ReactNode;
  fullWidth?: boolean;
};

const HostFormField = ({ label, children, fullWidth = false }: HostFormFieldProps) => (
  <label className={fullWidth ? 'block md:col-span-2' : 'block'}>
    <span className={hostFieldLabelClassName}>{label}</span>
    {children}
  </label>
);

export default HostFormField;
