import { useEffect, useRef, useState } from 'react';
import { geocodePlace } from '../api/geocode';
import { IconLocate, IconSearch, IconPin } from './Icons';

export default function SearchBar({ onSelectLocation, onLocate, locating, locError }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleQueryChange(value) {
    setQuery(value);
    setSearchError(null);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (value.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setSearching(true);
      try {
        const results = await geocodePlace(value, controller.signal);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setSearchError("Couldn't search that place. Try again.");
        }
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function handlePick(place) {
    setQuery(place.label);
    setShowSuggestions(false);
    onSelectLocation({ lat: place.lat, lng: place.lng, label: place.label });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      handlePick(suggestions[0]);
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const results = await geocodePlace(query);
      if (results.length > 0) {
        handlePick(results[0]);
      } else {
        setSearchError('No matching place found. Try a different search.');
      }
    } catch {
      setSearchError("Couldn't search that place. Try again.");
    } finally {
      setSearching(false);
    }
  }

  return (
    <div className="search-bar" ref={containerRef}>
      <form className="search-row" onSubmit={handleSubmit}>
        <button
          type="button"
          className="btn btn-locate"
          onClick={onLocate}
          disabled={locating}
        >
          <IconLocate />
          {locating ? 'Locating…' : 'Use my location'}
        </button>

        <div className="search-input-wrap">
          <IconSearch className="search-input-icon" />
          <input
            type="text"
            placeholder="Search a city or area (e.g. Dubai Marina, Abu Dhabi)…"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {showSuggestions && suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((s, i) => (
                <li key={i} onClick={() => handlePick(s)}>
                  <IconPin className="suggestion-pin" />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>
      {(searchError || locError) && (
        <p className="search-error">{searchError || locError}</p>
      )}
    </div>
  );
}
