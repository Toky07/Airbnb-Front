type SearchResultsHeaderProps = {
  query: string;
  loading: boolean;
  total: number;
};

const SearchResultsHeader = ({ query, loading, total }: SearchResultsHeaderProps) => (
  <div>
    <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
      {query ? `Résultats pour « ${query} »` : 'Tous les logements'}
    </h1>
    <p className="mt-1 text-sm text-ink/50">
      {loading
        ? 'Chargement…'
        : `${total} logement${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
    </p>
  </div>
);

export default SearchResultsHeader;
