import { useMemo, useState } from 'react';
import SearchBar from './components/SearchBar';
import FilterBar from './components/FilterBar';
import HotelGrid from './components/HotelGrid';
import HotelModal from './components/HotelModal';
import { generateHotels, PROPERTY_TYPES } from './data/mockHotels';
import { kmToMiles } from './utils/geo';
import './App.css';

const DEFAULT_FILTERS = {
  sort: 'price-asc',
  types: [...PROPERTY_TYPES],
  maxDistanceMi: 10,
  maxPrice: 2500,
  minStars: 0,
  freeCancellationOnly: false,
};

const DEFAULT_LOCATION = { lat: 25.2048, lng: 55.2708, label: 'Dubai, United Arab Emirates' };

export default function App() {
  const [location, setLocation] = useState(DEFAULT_LOCATION); // { lat, lng, label }
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const allHotels = useMemo(() => {
    if (!location) return [];
    return generateHotels(location.lat, location.lng);
  }, [location]);

  const visibleHotels = useMemo(() => {
    let list = allHotels.filter((h) => {
      if (!filters.types.includes(h.type)) return false;
      if (kmToMiles(h.distanceKm) > filters.maxDistanceMi) return false;
      if (h.price > filters.maxPrice) return false;
      if (h.stars < filters.minStars) return false;
      if (filters.freeCancellationOnly && !h.freeCancellation) return false;
      return true;
    });

    list = [...list].sort((a, b) => {
      switch (filters.sort) {
        case 'rating-desc':
          return b.reviewScore - a.reviewScore;
        case 'distance-asc':
          return a.distanceKm - b.distanceKm;
        case 'price-desc':
          return b.price - a.price;
        case 'price-asc':
        default:
          return a.price - b.price;
      }
    });

    return list;
  }, [allHotels, filters]);

  function handleLocate() {
    setLocError(null);
    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by this browser.');
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false);
        setLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          label: 'Your current location',
        });
      },
      (err) => {
        setLocating(false);
        setLocError(
          err.code === err.PERMISSION_DENIED
            ? 'Location permission denied. Try searching a place instead.'
            : 'Could not get your location. Try searching a place instead.'
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function handleSelectLocation(loc) {
    setLocError(null);
    setLocation(loc);
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true">
            StayScout
          </span>
        </div>
        <p className="tagline">Find the best hotel & resort rates near you</p>
      </header>

      <SearchBar
        onSelectLocation={handleSelectLocation}
        onLocate={handleLocate}
        locating={locating}
        locError={locError}
      />

      <div className="results-heading">
        Showing stays near <strong>{location.label}</strong>
      </div>
      <FilterBar filters={filters} onChange={setFilters} resultCount={visibleHotels.length} />
      <HotelGrid hotels={visibleHotels} onSelect={setSelectedHotel} />

      <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />

      <footer className="app-footer">
        Rates shown are simulated demo data for illustration only, not live prices.
      </footer>
    </div>
  );
}
