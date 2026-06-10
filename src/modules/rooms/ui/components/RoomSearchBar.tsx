import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';

type RoomSearchBarProps = {
  initialSearch?: string;
  compact?: boolean;
};

const RoomSearchBar = ({ initialSearch = '', compact = false }: RoomSearchBarProps) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState(initialSearch);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = search.trim();
    if (trimmed) {
      navigate(`/search?q=${encodeURIComponent(trimmed)}`);
      return;
    }
    navigate('/search');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={[
        'flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg focus-within:bg-slate-100',
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
      <button
        type="submit"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--color-brand)] text-white transition hover:bg-[var(--color-brand-dark)]"
        aria-label="Rechercher"
      >
        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4" />
      </button>
    </form>
  );
};

export default RoomSearchBar;
