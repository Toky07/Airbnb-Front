import { useEffect, useMemo } from 'react';
import { Link } from 'react-router';
import L from 'leaflet';
import {
  Circle,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';
import type { GeoCoordinates, RoomListItem } from '../../../core/types/room.types';
import {
  formatPricePerNight,
  getRoomCoordinates,
  getRoomLocation,
} from '../../../core/types/room.types';

const defaultMarkerIcon = L.icon({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

L.Marker.prototype.options.icon = defaultMarkerIcon;

const DEFAULT_CENTER: [number, number] = [46.603354, 1.888334];
const OSM_ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

type MapMarker = {
  room: RoomListItem;
  coordinates: GeoCoordinates;
};

type SearchMapViewProps = {
  rooms: RoomListItem[];
  center?: GeoCoordinates | null;
  radiusKm?: number;
  className?: string;
};

type FitMapBoundsProps = {
  markers: MapMarker[];
  center?: GeoCoordinates | null;
  radiusKm?: number;
};

function FitMapBounds({ markers, center, radiusKm }: FitMapBoundsProps) {
  const map = useMap();

  useEffect(() => {
    if (center && radiusKm) {
      const radiusMeters = radiusKm * 1000;
      const latDelta = radiusMeters / 111_320;
      const lngDelta =
        radiusMeters / (111_320 * Math.cos((center.lat * Math.PI) / 180));

      map.fitBounds([
        [center.lat - latDelta, center.lng - lngDelta],
        [center.lat + latDelta, center.lng + lngDelta],
      ]);
      return;
    }

    if (markers.length === 0) {
      map.setView(DEFAULT_CENTER, 6);
      return;
    }

    if (markers.length === 1) {
      const [marker] = markers;
      map.setView([marker.coordinates.lat, marker.coordinates.lng], 12);
      return;
    }

    const bounds = L.latLngBounds(
      markers.map(({ coordinates }) => [coordinates.lat, coordinates.lng]),
    );
    map.fitBounds(bounds, { padding: [32, 32] });
  }, [center, map, markers, radiusKm]);

  return null;
}

const SearchMapView = ({
  rooms,
  center = null,
  radiusKm,
  className = '',
}: SearchMapViewProps) => {
  const markers = useMemo(
    () =>
      rooms.flatMap((room) => {
        const coordinates = getRoomCoordinates(room);
        if (!coordinates || !room.slug) {
          return [];
        }

        return [{ room, coordinates }];
      }),
    [rooms],
  );

  const mapCenter = useMemo<[number, number]>(() => {
    if (center) {
      return [center.lat, center.lng];
    }

    if (markers[0]) {
      return [markers[0].coordinates.lat, markers[0].coordinates.lng];
    }

    return DEFAULT_CENTER;
  }, [center, markers]);

  return (
    <div
      className={`overflow-hidden rounded-2xl border border-line bg-mist soft-shadow ${className}`.trim()}
      data-testid="search-map-view"
    >
      <MapContainer
        center={mapCenter}
        zoom={12}
        scrollWheelZoom
        className="h-full min-h-[320px] w-full"
      >
        <TileLayer
          attribution={OSM_ATTRIBUTION}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {center && radiusKm ? (
          <Circle
            center={[center.lat, center.lng]}
            radius={radiusKm * 1000}
            pathOptions={{
              color: '#0F6B6B',
              fillColor: '#0F6B6B',
              fillOpacity: 0.12,
              weight: 2,
            }}
          />
        ) : null}

        {markers.map(({ room, coordinates }) => (
          <Marker key={room.id} position={[coordinates.lat, coordinates.lng]}>
            <Popup>
              <div className="space-y-1 text-sm">
                <p className="font-semibold text-ink">{room.name}</p>
                <p className="text-ink/60">{getRoomLocation(room)}</p>
                <p className="font-medium text-ink">
                  {formatPricePerNight(room.pricePerNight)} / nuit
                </p>
                <Link
                  to={`/rooms/${room.slug}`}
                  className="inline-flex font-medium text-brand hover:underline"
                >
                  Voir le logement
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}

        <FitMapBounds markers={markers} center={center} radiusKm={radiusKm} />
      </MapContainer>
    </div>
  );
};

export default SearchMapView;
