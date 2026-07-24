import type { ReactNode } from 'react';
import { vi } from 'vitest';

type MockMapProps = {
  children?: ReactNode;
  center?: [number, number];
  className?: string;
};

type MockCircleProps = {
  radius?: number;
};

export const MapContainer = ({ children, center, className }: MockMapProps) => (
  <div
    data-testid="map-container"
    data-center={center ? `${center[0]},${center[1]}` : undefined}
    className={className}
  >
    {children}
  </div>
);

export const TileLayer = () => <div data-testid="tile-layer" />;

export const Marker = ({ children }: { children?: ReactNode }) => (
  <div data-testid="map-marker">{children}</div>
);

export const Popup = ({ children }: { children?: ReactNode }) => <div>{children}</div>;

export const Circle = ({ radius }: MockCircleProps) => (
  <div data-testid="map-circle" data-radius={radius} />
);

export const useMap = () => ({
  fitBounds: vi.fn(),
  setView: vi.fn(),
});
