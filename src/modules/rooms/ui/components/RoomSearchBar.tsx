import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

type RoomSearchBarProps = {
  initialSearch?: string;
  initialCheckIn?: string;
  initialCheckOut?: string;
  compact?: boolean;
};

const RoomSearchBar = ({
  initialSearch = '',
  initialCheckIn = '',
  initialCheckOut = '',
  compact = false,
}: RoomSearchBarProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initialSearch);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const params = new URLSearchParams();
    const trimmed = search.trim();
    if (trimmed) {
      params.set('q', trimmed);
    }
    if (checkIn && checkOut && checkOut > checkIn) {
      params.set('checkIn', checkIn);
      params.set('checkOut', checkOut);
    }
    const queryString = params.toString();
    navigate(queryString ? `/search?${queryString}` : '/search');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        'flex w-full flex-col gap-2 rounded-2xl border border-line bg-surface soft-shadow transition duration-200 focus-within:border-brand/30 sm:flex-row sm:items-center sm:gap-0',
        compact ? 'p-1.5' : 'p-2',
      ].join(' ')}
    >
      <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une destination"
          className="w-full border-0 bg-transparent text-sm font-medium text-ink outline-none placeholder:font-normal placeholder:text-ink/50"
        />
      </label>
      <div className="hidden h-8 w-px bg-line sm:block" />
      <label className="flex items-center gap-2 px-4 sm:min-w-[9rem]">
        <span className="text-xs font-medium text-ink/50">Arrivée</span>
        <input
          type="date"
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          className="w-full border-0 bg-transparent text-sm font-medium text-ink outline-none"
        />
      </label>
      <div className="hidden h-8 w-px bg-line sm:block" />
      <label className="flex items-center gap-2 px-4 sm:min-w-[9rem]">
        <span className="text-xs font-medium text-ink/50">Départ</span>
        <input
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(event) => setCheckOut(event.target.value)}
          className="w-full border-0 bg-transparent text-sm font-medium text-ink outline-none"
        />
      </label>
      <button
        type="submit"
        className="flex h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-sm font-semibold text-white transition duration-200 hover:bg-brand-dark sm:w-auto"
        aria-label="Rechercher"
      >
        <FontAwesomeIcon icon="magnifying-glass" className="h-4 w-4" />
        <span className="sm:hidden">Rechercher</span>
      </button>
    </form>
  );
};

export default RoomSearchBar;
