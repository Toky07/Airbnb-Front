import type { FormEvent, ReactNode } from 'react';
import PageContainer from '../layout/PageContainer';

type AuthFormShellProps = {
  children: ReactNode;
  onSubmit?: (event: FormEvent) => void;
  maxWidth?: 'md' | 'lg';
};

const maxWidthClass = {
  md: 'max-w-md',
  lg: 'max-w-lg',
} as const;

const AuthFormShell = ({ children, onSubmit, maxWidth = 'md' }: AuthFormShellProps) => {
  const shellClass = `surface soft-shadow page-mist w-full ${maxWidthClass[maxWidth]} rounded-2xl p-8`;

  return (
    <PageContainer className="flex min-h-[70vh] items-center justify-center py-12">
      {onSubmit ? (
        <form onSubmit={onSubmit} className={shellClass}>
          {children}
        </form>
      ) : (
        <div className={shellClass}>{children}</div>
      )}
    </PageContainer>
  );
};

export default AuthFormShell;
