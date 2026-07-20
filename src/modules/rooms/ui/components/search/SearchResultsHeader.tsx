type SearchResultsHeaderProps = {
  query: string;
  loading: boolean;
  total: number;
};

const SearchResultsHeader = ({ query, loading, total }: SearchResultsHeaderProps) => (
  <div>
    <h1 className="text-2xl font-bold text-slate-900">
      {query ? `Résultats pour « ${query} »` : 'Tous les logements'}
    </h1>
    <p className="mt-1 text-sm text-slate-500">
      {loading
        ? 'Chargement…'
        : `${total} logement${total > 1 ? 's' : ''} trouvé${total > 1 ? 's' : ''}`}
    </p>
  </div>
);

export default SearchResultsHeader;
