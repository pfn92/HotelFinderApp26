import { useEffect, useId, useRef, useState } from 'react';
import { geocodePlace } from '../api/geocode';
import { IconAlert, IconLocate, IconPin, IconSearch } from './Icons';

export default function SearchBar({ onSelectLocation, onLocate, locating, locError }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState(null);

  const debounceRef = useRef(null);
  const abortRef = useRef(null);
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listId = useId();

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cancel any in-flight debounce/request when the component goes away.
  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortRef.current) abortRef.current.abort();
    },
    []
  );

  function handleQueryChange(value) {
    setQuery(value);
    setSearchError(null);
    setActiveIndex(-1);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortRef.current) abortRef.current.abort();

    if (value.trim().length < 3) {
      setSuggestions([]);
      setOpen(false);
      return;
    }

    debounceRef.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      setSearching(true);
      try {
        const results = await geocodePlace(value, controller.signal);
        setSuggestions(results);
        setOpen(true);
      } catch (err) {
        if (err.name !== 'AbortError') setSearchError("Couldn't search that place. Try again.");
      } finally {
        setSearching(false);
      }
    }, 400);
  }

  function handlePick(place) {
    setQuery(place.label);
    setOpen(false);
    setActiveIndex(-1);
    onSelectLocation({ lat: place.lat, lng: place.lng, label: place.label });
    inputRef.current?.blur();
  }

  function handleKeyDown(e) {
    if (!open || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        setOpen(true);
        e.preventDefault();
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => (i <= 0 ? suggestions.length - 1 : i - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      handlePick(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim()) return;
    if (suggestions.length > 0) {
      handlePick(suggestions[activeIndex >= 0 ? activeIndex : 0]);
      return;
    }
    setSearching(true);
    setSearchError(null);
    try {
      const results = await geocodePlace(query);
      if (results.length > 0) handlePick(results[0]);
      else setSearchError('No matching place found. Try a different search.');
    } catch {
      setSearchError("Couldn't search that place. Try again.");
    } finally {
      setSearching(false);
    }
  }

  const message = searchError || locError;

  return (
    <div className="search" ref={containerRef}>
      <form className="search-row" onSubmit={handleSubmit} role="search">
        <div className="search-field">
          <IconSearch className="search-icon" width={18} height={18} />
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search a city or area — try Dubai Marina"
            value={query}
            autoComplete="off"
            role="combobox"
            aria-expanded={open && suggestions.length > 0}
            aria-controls={listId}
            aria-autocomplete="list"
            aria-activedescendant={activeIndex >= 0 ? `${listId}-opt-${activeIndex}` : undefined}
            aria-label="Search for a place"
            onChange={(e) => handleQueryChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
          />
          {searching && <span className="spinner" aria-label="Searching" />}

          {open && suggestions.length > 0 && (
            <ul className="suggestions" id={listId} role="listbox">
              {suggestions.map((s, i) => (
                <li
                  key={`${s.lat},${s.lng}`}
                  id={`${listId}-opt-${i}`}
                  role="option"
                  aria-selected={i === activeIndex}
                  className={i === activeIndex ? 'is-active' : ''}
                  onMouseEnter={() => setActiveIndex(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handlePick(s)}
                >
                  <IconPin width={15} height={15} />
                  <span>{s.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button type="submit" className="btn btn-primary" disabled={searching}>
          {searching ? 'Searching…' : 'Search'}
        </button>

        <button type="button" className="btn btn-ghost" onClick={onLocate} disabled={locating}>
          <IconLocate width={16} height={16} />
          {locating ? 'Locating…' : 'Use my location'}
        </button>
      </form>

      {message && (
        <p className="search-message" role="status">
          <IconAlert width={15} height={15} />
          {message}
        </p>
      )}
    </div>
  );
}
