import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import { Button } from '../../../../shared/ui';
import { usePageTitle } from '../../../../shared/hooks/usePageTitle';
import HostPropertiesTable from '../components/HostPropertiesTable';
import { useHostPropertyContext } from '../context/host-property.context';

const HostPropertiesListPage = () => {
  usePageTitle('Mes établissements');
  const { properties, loading } = useHostPropertyContext();

  if (loading) {
    return (
      <div className="h-96 animate-pulse rounded-2xl border border-ink/8 bg-surface p-8 soft-shadow" />
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <h1 className="font-display text-4xl font-bold text-ink">Mes établissements</h1>
          <p className="mt-3 text-lg text-ink/50">
            Consultez vos hôtels et gérez les chambres de chaque établissement.
          </p>
        </div>
        <Link to="/host/property/new">
          <Button className="px-6 py-3">
            <FontAwesomeIcon icon="plus" className="mr-2 h-4 w-4" />
            Ajouter un établissement
          </Button>
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-surface px-8 py-16 text-center soft-shadow">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-mist text-ink/50">
            <FontAwesomeIcon icon="hotel" className="h-7 w-7" />
          </div>
          <h2 className="mt-6 font-display text-2xl font-semibold text-ink">Aucun établissement</h2>
          <p className="mx-auto mt-3 max-w-md text-ink/50">
            Créez votre premier établissement pour commencer à publier des chambres.
          </p>
          <Link to="/host/property/new" className="mt-8 inline-block">
            <Button className="px-8 py-4">Créer mon établissement</Button>
          </Link>
        </div>
      ) : (
        <HostPropertiesTable properties={properties} />
      )}
    </div>
  );
};

export default HostPropertiesListPage;
