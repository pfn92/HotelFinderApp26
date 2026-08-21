import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { formatAED } from '../utils/currency';

// CARTO basemaps: keyless, free for light use, and they ship a dark variant so
// the map can follow the app theme instead of glaring white in dark mode.
const TILES = {
  light: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
  dark: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
};
const ATTRIBUTION =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>';

function priceIcon(hotel, isSelected) {
  return L.divIcon({
    className: 'map-pin-wrap',
    html: `<span class="map-pin${isSelected ? ' is-selected' : ''}">${formatAED(hotel.price)}</span>`,
    iconSize: null,
  });
}

export default function MapView({ hotels, center, selectedId, onSelect, isDark }) {
  const elRef = useRef(null);
  const mapRef = useRef(null);
  const tileRef = useRef(null);
  const markersRef = useRef(new Map());
  const originRef = useRef(null);

  // Init once.
  useEffect(() => {
    const map = L.map(elRef.current, {
      center: [center.lat, center.lng],
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });
    mapRef.current = map;
    const markers = markersRef.current;
    return () => {
      map.remove();
      mapRef.current = null;
      markers.clear();
    };
    // Center changes are handled by the bounds effect below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Swap tiles when the theme flips.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (tileRef.current) map.removeLayer(tileRef.current);
    tileRef.current = L.tileLayer(isDark ? TILES.dark : TILES.light, {
      attribution: ATTRIBUTION,
      maxZoom: 19,
    }).addTo(map);
  }, [isDark]);

  // Origin marker for the searched location.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    if (originRef.current) map.removeLayer(originRef.current);
    originRef.current = L.marker([center.lat, center.lng], {
      icon: L.divIcon({ className: 'map-origin-wrap', html: '<span class="map-origin"></span>', iconSize: null }),
      interactive: false,
      zIndexOffset: -100,
    }).addTo(map);
  }, [center]);

  // Rebuild hotel markers when the visible set changes.
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    for (const m of markersRef.current.values()) map.removeLayer(m);
    markersRef.current.clear();

    for (const hotel of hotels) {
      const marker = L.marker([hotel.lat, hotel.lng], {
        icon: priceIcon(hotel, hotel.id === selectedId),
        title: hotel.name,
      })
        .addTo(map)
        .on('click', () => onSelect(hotel));
      markersRef.current.set(hotel.id, marker);
    }

    if (hotels.length > 0) {
      const bounds = L.latLngBounds([
        [center.lat, center.lng],
        ...hotels.map((h) => [h.lat, h.lng]),
      ]);
      map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
    } else {
      map.setView([center.lat, center.lng], 12);
    }
    // selectedId styling is handled in its own effect so we don't refit bounds.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hotels, center, onSelect]);

  // Restyle only the affected pins on selection change.
  useEffect(() => {
    for (const [id, marker] of markersRef.current) {
      const hotel = hotels.find((h) => h.id === id);
      if (hotel) marker.setIcon(priceIcon(hotel, id === selectedId));
    }
  }, [selectedId, hotels]);

  return <div className="map" ref={elRef} role="application" aria-label="Map of results" />;
}
