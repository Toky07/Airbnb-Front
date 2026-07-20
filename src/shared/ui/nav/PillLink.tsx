import { Link } from 'react-router';

type PillLinkProps = {
  to: string;
  active?: boolean;
  children: React.ReactNode;
};

const PillLink = ({ to, active, children }: PillLinkProps) => (
  <Link
    to={to}
    className={[
      'rounded-full px-4 py-2 text-sm font-medium transition',
      active
        ? 'bg-slate-900 text-white'
        : 'border border-slate-200 text-slate-600 hover:border-slate-300',
    ].join(' ')}
  >
    {children}
  </Link>
);

export default PillLink;
