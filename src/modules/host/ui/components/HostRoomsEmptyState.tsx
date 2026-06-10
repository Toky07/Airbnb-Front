import { faBed } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const HostRoomsEmptyState = () => (
  <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white py-20 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-50">
      <FontAwesomeIcon icon={faBed} className="h-8 w-8 text-slate-300" />
    </div>
    <p className="mt-6 font-serif text-2xl font-bold text-slate-900">Aucune chambre pour le moment</p>
    <p className="mt-2 text-slate-500">Commencez par ajouter votre première chambre.</p>
  </div>
);

export default HostRoomsEmptyState;
