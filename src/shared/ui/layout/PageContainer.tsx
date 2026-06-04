import type { ReactNode } from 'react';

type PageContainerProps = {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section';
};

const PageContainer = ({ children, className = '', as: Tag = 'div' }: PageContainerProps) => (
  <Tag className={['mx-auto max-w-7xl px-4 sm:px-6 lg:px-8', className].join(' ')}>
    {children}
  </Tag>
);

export default PageContainer;
