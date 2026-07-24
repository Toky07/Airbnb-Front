import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router';
import type { HostProperty } from '../../core/types/host.types';
import { resolveMediaUrl } from '../../../../shared/utils/resolve-media-url';
import HostDataTable, {
  HostDataTableBody,
  HostDataTableCell,
  HostDataTableHead,
  HostDataTableHeaderCell,
  HostDataTableRow,
} from './HostDataTable';

type HostPropertiesTableProps = {
  properties: HostProperty[];
};

const HostPropertiesTable = ({ properties }: HostPropertiesTableProps) => (
  <HostDataTable>
    <table className="min-w-full">
      <HostDataTableHead>
        <HostDataTableHeaderCell>Établissement</HostDataTableHeaderCell>
        <HostDataTableHeaderCell>Localisation</HostDataTableHeaderCell>
        <HostDataTableHeaderCell>Type</HostDataTableHeaderCell>
        <HostDataTableHeaderCell align="center">Chambres</HostDataTableHeaderCell>
        <HostDataTableHeaderCell align="right">Action</HostDataTableHeaderCell>
      </HostDataTableHead>
      <HostDataTableBody>
        {properties.map((property) => {
          const imageUrl = resolveMediaUrl(property.image);
          const location = [property.city, property.country].filter(Boolean).join(', ');

          return (
            <HostDataTableRow key={property.id}>
              <HostDataTableCell>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-mist">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink/40">
                        <FontAwesomeIcon icon="hotel" className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-ink">{property.name}</p>
                    {property.address ? (
                      <p className="mt-0.5 text-xs text-ink/50">{property.address}</p>
                    ) : null}
                  </div>
                </div>
              </HostDataTableCell>
              <HostDataTableCell>
                <span className="text-ink/70">{location || '—'}</span>
              </HostDataTableCell>
              <HostDataTableCell>
                <span className="inline-flex rounded-xl bg-mist px-3 py-1 text-xs font-medium text-ink/70">
                  {property.propertyType?.name ?? 'Non renseigné'}
                </span>
              </HostDataTableCell>
              <HostDataTableCell align="center">
                <span className="inline-flex min-w-8 items-center justify-center rounded-xl bg-brand px-3 py-1 text-xs font-bold text-white">
                  {property.roomCount}
                </span>
              </HostDataTableCell>
              <HostDataTableCell align="right">
                <Link
                  to={`/host/property/${property.id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2 text-xs font-semibold text-white transition hover:bg-brand-dark"
                >
                  Gérer
                  <FontAwesomeIcon icon="arrow-right" className="h-3 w-3" />
                </Link>
              </HostDataTableCell>
            </HostDataTableRow>
          );
        })}
      </HostDataTableBody>
    </table>
  </HostDataTable>
);

export default HostPropertiesTable;
