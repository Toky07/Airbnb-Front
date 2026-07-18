import { Button } from '../ui';

type AppErrorFallbackProps = {
  error: Error;
  onReset: () => void;
};

const AppErrorFallback = ({ error, onReset }: AppErrorFallbackProps) => (
  <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 py-16 text-center">
    <p className="text-sm font-semibold uppercase tracking-widest text-brand">Erreur</p>
    <h1 className="mt-4 font-serif text-4xl font-medium text-slate-900 md:text-5xl">
      Une erreur est survenue
    </h1>
    <p className="mt-4 max-w-md text-slate-600">
      L&apos;application a rencontré un problème inattendu. Vous pouvez réessayer ou recharger la
      page.
    </p>
    {import.meta.env.DEV && (
      <pre className="mt-6 max-w-xl overflow-x-auto rounded-lg bg-slate-100 p-4 text-left text-sm text-slate-700">
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
