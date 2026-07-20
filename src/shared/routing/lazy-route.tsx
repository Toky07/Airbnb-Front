import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import RouteFallback from './RouteFallback';

export function lazyPage<T extends ComponentType>(
  factory: () => Promise<{ default: T }>,
) {
  return lazy(factory);
}

export function withSuspense(Component: ComponentType | LazyExoticComponent<ComponentType>) {
  const Resolved = Component as ComponentType;
  const Wrapped = () => (
    <Suspense fallback={<RouteFallback />}>
      <Resolved />
    </Suspense>
  );
  return Wrapped;
}

export function lazyRoute<T extends ComponentType>(
  factory: () => Promise<{ default: T }>,
) {
  return withSuspense(lazyPage(factory));
}
