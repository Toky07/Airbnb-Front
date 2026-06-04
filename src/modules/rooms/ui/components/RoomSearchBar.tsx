import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../../../../shared/ui';

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
        'flex w-full items-center gap-2 rounded-full border border-slate-200 bg-white shadow-sm transition focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20',
        compact ? 'p-1.5' : 'p-2',
      ].join(' ')}
    >
      <label className="flex min-w-0 flex-1 items-center gap-3 px-4">
        <FontAwesomeIcon icon={faMagnifyingGlass} className="h-4 w-4 shrink-0 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Rechercher une destination, un établissement ou une chambre…"
          className="w-full border-0 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
        />
      </label>
      <Button type="submit" size={compact ? 'sm' : 'md'} className="shrink-0 rounded-full px-5">
        Rechercher
      </Button>
    </form>
  );
};

export default RoomSearchBar;
