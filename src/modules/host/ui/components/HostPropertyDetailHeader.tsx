import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { SegmentedControl } from '../../../../shared/ui';

type HostPropertyDetailHeaderProps = {
  name: string;
  subtitle: string;
  activeTab: 'rooms' | 'info' | 'availability' | 'pricing';
  onTabChange: (tab: 'rooms' | 'info' | 'availability' | 'pricing') => void;
};

const HostPropertyDetailHeader = ({
  name,
  subtitle,
  activeTab,
  onTabChange,
}: HostPropertyDetailHeaderProps) => (
  <>
    <Link
      to="/host/property"
      className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
    >
        <FontAwesomeIcon icon="arrow-left" className="h-3.5 w-3.5" />
      Retour à mes établissements
    </Link>

    <div className="flex flex-wrap items-end justify-between gap-6">
      <div>
        <h1 className="font-serif text-4xl font-bold text-slate-900">{name}</h1>
        <p className="mt-2 text-lg text-slate-500">{subtitle}</p>
      </div>

      <SegmentedControl
        value={activeTab}
        onChange={onTabChange}
        options={[
          { value: 'rooms', label: 'Chambres' },
          { value: 'pricing', label: 'Tarification' },
          { value: 'availability', label: 'Disponibilité' },
          { value: 'info', label: 'Informations' },
        ]}
      />
    </div>
  </>
);

export default HostPropertyDetailHeader;
