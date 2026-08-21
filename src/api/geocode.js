// Free, keyless geocoding via OpenStreetMap's Nominatim public API.
// Used only to turn a typed place name into coordinates for the mock
// hotel generator — no account or API key required.

const BASE_URL = 'https://nominatim.openstreetmap.org/search';

export async function geocodePlace(query, signal) {
  const url = `${BASE_URL}?format=json&addressdetails=0&limit=5&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = await res.json();
  return data.map((item) => ({
    label: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }));
}
