import { type FormEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../../../shared/ui';
import { getHttpClient } from '../../../../../shared/http/composition/http.composition';

type AmenityOption = {
  id: number;
  name: string;
};

type AdvancedFiltersPanelProps = {
  initialMinPrice?: number;
  initialMaxPrice?: number;
  initialMinGuests?: number;
  initialCity?: string;
  initialAmenityIds?: number[];
  baseSearchParams: URLSearchParams;
};

const AdvancedFiltersPanel = ({
  initialMinPrice,
  initialMaxPrice,
  initialMinGuests,
  initialCity = '',
  initialAmenityIds = [],
  baseSearchParams,
}: AdvancedFiltersPanelProps) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [minPrice, setMinPrice] = useState(initialMinPrice?.toString() ?? '');
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice?.toString() ?? '');
  const [minGuests, setMinGuests] = useState(initialMinGuests?.toString() ?? '');
  const [city, setCity] = useState(initialCity);
  const [amenityIds, setAmenityIds] = useState<number[]>(initialAmenityIds);
  const [amenities, setAmenities] = useState<AmenityOption[]>([]);

  useEffect(() => {
    setMinPrice(initialMinPrice?.toString() ?? '');
    setMaxPrice(initialMaxPrice?.toString() ?? '');
    setMinGuests(initialMinGuests?.toString() ?? '');
    setCity(initialCity);
    setAmenityIds(initialAmenityIds);
  }, [initialMinPrice, initialMaxPrice, initialMinGuests, initialCity, initialAmenityIds]);

  useEffect(() => {
    let cancelled = false;

    async function loadAmenities() {
      const response = await getHttpClient().get('/amenities/catalog?scope=room');
      if (!response.ok || cancelled) {
        return;
      }

      const data: unknown = await response.json();
      if (!Array.isArray(data) || cancelled) {
        return;
      }

      setAmenities(
        data
          .map((entry) => {
            if (!entry || typeof entry !== 'object') {
              return null;
            }

            const record = entry as Record<string, unknown>;
            const id = Number(record.id);
            const name = typeof record.name === 'string' ? record.name : '';
            return Number.isFinite(id) && name ? { id, name } : null;
          })
          .filter((entry): entry is AmenityOption => entry !== null),
      );
    }

    void loadAmenities();

    return () => {
      cancelled = true;
    };
  }, []);

  const toggleAmenity = (id: number) => {
    setAmenityIds((current) =>
      current.includes(id) ? current.filter((entry) => entry !== id) : [...current, id],
    );
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams(baseSearchParams);

    const setOrDelete = (key: string, value: string) => {
      const trimmed = value.trim();
      if (trimmed) {
        params.set(key, trimmed);
      } else {
        params.delete(key);
      }
    };

    setOrDelete('minPrice', minPrice);
    setOrDelete('maxPrice', maxPrice);
    setOrDelete('minGuests', minGuests);
    setOrDelete('city', city);

    if (amenityIds.length > 0) {
      params.set('amenityIds', amenityIds.join(','));
    } else {
      params.delete('amenityIds');
    }

    params.delete('page');
    navigate(`/search?${params.toString()}`);
    setOpen(false);
  };

  const handleReset = () => {
    const params = new URLSearchParams(baseSearchParams);
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('minGuests');
    params.delete('city');
    params.delete('amenityIds');
    params.delete('page');
    navigate(`/search?${params.toString()}`);
    setOpen(false);
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="text-sm font-medium text-brand underline-offset-2 hover:text-brand-dark hover:underline"
      >
        {open ? 'Masquer les filtres avancés' : 'Filtres avancés'}
      </button>

      {open ? (
        <form
          onSubmit={handleSubmit}
          className="surface mt-4 grid gap-4 rounded-2xl p-4 md:grid-cols-2"
        >
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink/70">Prix min. (€/nuit)</span>
            <input
              type="number"
              min="0"
              value={minPrice}
              onChange={(event) => setMinPrice(event.target.value)}
              className="rounded-xl border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink/70">Prix max. (€/nuit)</span>
            <input
              type="number"
              min="0"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
              className="rounded-xl border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink/70">Voyageurs min.</span>
            <input
              type="number"
              min="1"
              value={minGuests}
              onChange={(event) => setMinGuests(event.target.value)}
              className="rounded-xl border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          <label className="flex flex-col gap-1 text-sm">
            <span className="font-medium text-ink/70">Ville</span>
            <input
              type="text"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              placeholder="Ex. Paris"
              className="rounded-xl border border-line bg-white px-3 py-2 outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
            />
          </label>

          {amenities.length > 0 ? (
            <fieldset className="md:col-span-2">
              <legend className="mb-2 text-sm font-medium text-ink/70">Équipements</legend>
              <div className="flex flex-wrap gap-2">
                {amenities.map((amenity) => {
                  const active = amenityIds.includes(amenity.id);
                  return (
                    <button
                      key={amenity.id}
                      type="button"
                      onClick={() => toggleAmenity(amenity.id)}
                      className={[
                        'rounded-xl border px-3 py-1.5 text-sm transition duration-200',
                        active
                          ? 'border-brand bg-brand text-white'
                          : 'border-line bg-surface text-ink/70 hover:border-brand/30 hover:bg-mist',
                      ].join(' ')}
                    >
                      {amenity.name}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          ) : null}

          <div className="flex flex-wrap gap-2 md:col-span-2">
            <Button type="submit">Appliquer</Button>
            <Button type="button" variant="secondary" onClick={handleReset}>
              Réinitialiser
            </Button>
          </div>
        </form>
      ) : null}
    </div>
  );
};

export default AdvancedFiltersPanel;
