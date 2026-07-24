import { Link } from 'react-router';

const HostPropertyNotFound = () => (
  <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-6 py-12 text-center">
    <p className="font-display text-lg font-medium text-red-700">Établissement introuvable.</p>
    <Link to="/host/property" className="mt-4 inline-block text-sm font-semibold text-brand">
      Retour à la liste
    </Link>
  </div>
);

export default HostPropertyNotFound;
