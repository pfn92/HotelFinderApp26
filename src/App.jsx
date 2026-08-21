import { useCallback, useEffect, useMemo, useState } from 'react';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import FilterPanel, { PRICE_MAX } from './components/FilterPanel';
import ResultsToolbar from './components/ResultsToolbar';
import HotelGrid from './components/HotelGrid';
import MapView from './components/MapView';
import HotelModal from './components/HotelModal';
import { IconClose } from './components/Icons';
import { generateHotels, PROPERTY_TYPES } from './data/mockHotels';
import { kmToMiles } from './utils/geo';
import { useTheme } from './hooks/useTheme';
import './App.css';

const DEFAULT_FILTERS = {
  sort: 'price-asc',
  types: [...PROPERTY_TYPES],
  maxDistanceMi: 15,
  maxPrice: PRICE_MAX,
  minStars: 0,
  minScore: 0,
  amenities: [],
  freeCancellationOnly: false,
};

const DEFAULT_LOCATION = {
  lat: 25.2048,
  lng: 55.2708,
  label: 'Dubai, United Arab Emirates',
};

export default function App() {
  const { isDark, toggle } = useTheme();
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [locating, setLocating] = useState(false);
  const [locError, setLocError] = useState(null);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [view, setView] = useState('grid');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const allHotels = useMemo(
    () => generateHotels(location.lat, location.lng),
    [location]
  );

  const visibleHotels = useMemo(() => {
    const list = allHotels.filter((h) => {
      if (!filters.types.includes(h.type)) return false;
      if (kmToMiles(h.distanceKm) > filters.maxDistanceMi) return false;
      if (h.price > filters.maxPrice) return false;
      if (h.stars < filters.minStars) return false;
      if (h.reviewScore < filters.minScore) return false;
      if (filters.freeCancellationOnly && !h.freeCancellation) return false;
      if (!filters.amenities.every((a) => h.amenities.includes(a))) return false;
      return true;
    });

    return list.sort((a, b) => {
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
  }, [allHotels, filters]);

  // Close the mobile filter drawer on Escape.
  useEffect(() => {
    if (!filtersOpen) return undefined;
    const onKey = (e) => e.key === 'Escape' && setFiltersOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [filtersOpen]);

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

  const resetFilters = useCallback(() => setFilters(DEFAULT_FILTERS), []);
  const selectHotel = useCallback((h) => setSelectedHotel(h), []);

  return (
    <div className="app">
      <Header isDark={isDark} onToggleTheme={toggle} />

      <section className="hero">
        <div className="hero-inner">
          <h1 className="hero-title">Find your next stay</h1>
          <p className="hero-sub">
            Compare hotels, resorts and B&amp;Bs near any destination.
          </p>
          <SearchBar
            onSelectLocation={handleSelectLocation}
            onLocate={handleLocate}
            locating={locating}
            locError={locError}
          />
        </div>
      </section>

      <main className="layout">
        <div className={`filters-shell ${filtersOpen ? 'is-open' : ''}`}>
          <FilterPanel
            filters={filters}
            onChange={setFilters}
            onReset={resetFilters}
            resultCount={visibleHotels.length}
            totalCount={allHotels.length}
          />
          <button
            type="button"
            className="filters-done btn btn-primary"
            onClick={() => setFiltersOpen(false)}
          >
            Show {visibleHotels.length} stays
          </button>
          <button
            type="button"
            className="icon-btn filters-close"
            onClick={() => setFiltersOpen(false)}
            aria-label="Close filters"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        {filtersOpen && (
          <div className="filters-scrim" onClick={() => setFiltersOpen(false)} aria-hidden="true" />
        )}

        <div className="results">
          <ResultsToolbar
            locationLabel={location.label}
            resultCount={visibleHotels.length}
            sort={filters.sort}
            onSortChange={(sort) => setFilters((f) => ({ ...f, sort }))}
            view={view}
            onViewChange={setView}
            onOpenFilters={() => setFiltersOpen(true)}
          />

          {view === 'grid' ? (
            <HotelGrid hotels={visibleHotels} onSelect={selectHotel} onReset={resetFilters} />
          ) : (
            <MapView
              hotels={visibleHotels}
              center={location}
              selectedId={selectedHotel?.id}
              onSelect={selectHotel}
              isDark={isDark}
            />
          )}
        </div>
      </main>

      <HotelModal
        key={selectedHotel?.id}
        hotel={selectedHotel}
        onClose={() => setSelectedHotel(null)}
      />

      <footer className="footer">
        Rates shown are simulated demo data for illustration only — not live prices.
      </footer>
    </div>
  );
}
