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
        'flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg focus-within:bg-slate-50 sm:flex-row sm:items-center sm:rounded-full sm:gap-0',
        compact ? 'p-1.5' : 'p-2',
      ].join(' ')}
    >
      <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une destination"
          className="w-full border-0 bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:font-normal placeholder:text-slate-500"
        />
      </label>
      <div className="hidden h-8 w-px bg-slate-200 sm:block" />
      <label className="flex items-center gap-2 px-4 sm:min-w-[9rem]">
        <span className="text-xs font-medium text-slate-500">Arrivée</span>
        <input
          type="date"
          value={checkIn}
          onChange={(event) => setCheckIn(event.target.value)}
          className="w-full border-0 bg-transparent text-sm font-medium text-slate-900 outline-none"
        />
      </label>
      <div className="hidden h-8 w-px bg-slate-200 sm:block" />
      <label className="flex items-center gap-2 px-4 sm:min-w-[9rem]">
        <span className="text-xs font-medium text-slate-500">Départ</span>
        <input
          type="date"
          value={checkOut}
          min={checkIn || undefined}
          onChange={(event) => setCheckOut(event.target.value)}
          className="w-full border-0 bg-transparent text-sm font-medium text-slate-900 outline-none"
        />
      </label>
      <button
        type="submit"
        className="flex h-10 w-full shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-white transition hover:bg-[var(--color-brand-dark)] sm:w-10"
        aria-label="Rechercher"
      >
        <FontAwesomeIcon icon="magnifying-glass" className="h-4 w-4" />
      </button>
    </form>
  );
};

export default RoomSearchBar;
