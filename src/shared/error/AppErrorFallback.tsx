import { Button } from '../ui';

type AppErrorFallbackProps = {
  error: Error;
  onReset: () => void;
};

const AppErrorFallback = ({ error, onReset }: AppErrorFallbackProps) => (
  <div className="page-mist flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
    <p className="text-sm font-semibold uppercase tracking-widest text-brand">Erreur</p>
    <h1 className="mt-4 font-display text-4xl font-bold tracking-tight text-ink md:text-5xl">
      Une erreur est survenue
    </h1>
    <p className="mt-4 max-w-md text-ink/60">
      L&apos;application a rencontré un problème inattendu. Vous pouvez réessayer ou recharger la
      page.
    </p>
    {import.meta.env.DEV && (
      <pre className="mt-6 max-w-xl overflow-x-auto rounded-xl border border-line bg-mist p-4 text-left text-sm text-ink/70">
        {error.message}
      </pre>
    )}
    <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
      <Button type="button" onClick={onReset}>
        Réessayer
      </Button>
      <Button type="button" variant="secondary" onClick={() => window.location.reload()}>
        Recharger la page
      </Button>
    </div>
  </div>
);

export default AppErrorFallback;
