import { Link } from 'react-router';
import { getRoomLocation, type RoomListItem } from '../../../core/types/room.types';

type HomeDestinationLinksProps = {
  rooms: RoomListItem[];
};

const HomeDestinationLinks = ({ rooms }: HomeDestinationLinksProps) => {
  const destinations = Array.from(
    new Map(
      rooms
        .map((room) => {
          const city = room.property?.city?.trim();
          if (!city) {
            return null;
          }
          return [city, getRoomLocation(room)] as const;
        })
        .filter((entry): entry is readonly [string, string] => entry !== null),
    ).values(),
  ).slice(0, 6);

  if (destinations.length === 0) {
    return null;
  }

  return (
    <section className="bg-mist py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="mb-6 font-display text-2xl font-bold tracking-tight text-ink">
          Inspiration pour vos prochains voyages
        </h2>
        <div className="flex flex-wrap gap-3">
          {destinations.map((location) => (
            <Link
              key={location}
              to={`/search?q=${encodeURIComponent(location.split(',')[0]?.trim() ?? location)}`}
              className="rounded-xl border border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink/70 transition duration-200 hover:border-brand/30 hover:text-brand"
            >
              {location}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HomeDestinationLinks;
