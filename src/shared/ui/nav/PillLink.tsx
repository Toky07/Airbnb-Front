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
      'rounded-xl px-4 py-2 text-sm font-medium transition duration-200',
      active
        ? 'bg-brand text-white'
        : 'border border-line text-ink/70 hover:border-brand/30 hover:bg-mist',
    ].join(' ')}
  >
    {children}
  </Link>
);

export default PillLink;
