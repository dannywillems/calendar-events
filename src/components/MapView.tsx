import { useEffect } from 'react';
import {
  CircleMarker,
  MapContainer,
  TileLayer,
  Tooltip,
  useMap,
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { CalEvent, FacetKey } from '../lib/types';
import { colorFor, type ColorMap } from '../lib/colors';
import { colorValue } from '../lib/filters';
import { formatRange } from '../lib/date';

interface MapViewProps {
  events: CalEvent[];
  colorFacet: FacetKey;
  colorMap: ColorMap;
  onSelect: (event: CalEvent) => void;
}

interface Point {
  event: CalEvent;
  lat: number;
  lng: number;
}

// Pan and zoom the map to fit the current set of points whenever they change.
function FitBounds({ points }: { points: Point[] }) {
  const map = useMap();
  useEffect(() => {
    if (points.length === 0) {
      return;
    }
    if (points.length === 1) {
      map.setView([points[0].lat, points[0].lng], 5);
      return;
    }
    map.fitBounds(
      points.map((p) => [p.lat, p.lng]),
      { padding: [40, 40] },
    );
  }, [map, points]);
  return null;
}

// Type guard: an event that has both coordinates resolved.
function hasCoords(
  event: CalEvent,
): event is CalEvent & { lat: number; lng: number } {
  return typeof event.lat === 'number' && typeof event.lng === 'number';
}

export default function MapView({
  events,
  colorFacet,
  colorMap,
  onSelect,
}: MapViewProps) {
  const points: Point[] = events
    .filter(hasCoords)
    .map((event) => ({ event, lat: event.lat, lng: event.lng }));

  if (points.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-600 dark:text-slate-400">
        No events with a known location match the current filters.
      </p>
    );
  }

  return (
    <div className="h-[420px] overflow-hidden rounded-lg border border-slate-200 sm:h-[520px] dark:border-slate-700">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FitBounds points={points} />
        {points.map(({ event, lat, lng }) => {
          const color = colorFor(colorMap, colorValue(event, colorFacet));
          return (
            <CircleMarker
              key={event.id}
              center={[lat, lng]}
              radius={8}
              pathOptions={{
                color: '#ffffff',
                weight: 1.5,
                fillColor: color.hex,
                fillOpacity: 0.9,
              }}
              eventHandlers={{ click: () => onSelect(event) }}
            >
              <Tooltip direction="top" offset={[0, -6]}>
                <span className="font-medium">{event.name}</span>
                <br />
                {formatRange(event.start, event.end)}
                {event.location ? ` - ${event.location}` : ''}
              </Tooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
