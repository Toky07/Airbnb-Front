import { useEffect, useRef } from 'react';

const APP_NAME = import.meta.env.VITE_APP_NAME;

export function usePageTitle(title?: string) {
  const prevTitle = useRef(document.title);

  useEffect(() => {
    const previous = prevTitle.current;
    document.title = title ? title : APP_NAME;

    return () => {
      document.title = previous;
    };
  }, [title]);
}
