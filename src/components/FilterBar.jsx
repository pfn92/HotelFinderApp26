import { PROPERTY_TYPES } from '../data/mockHotels';
import { formatAED } from '../utils/currency';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Best rates (lowest price)' },
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'distance-asc', label: 'Nearest first' },
  { value: 'price-desc', label: 'Price: high to low' },
];

export default function FilterBar({ filters, onChange, resultCount }) {
  function set(patch) {
    onChange({ ...filters, ...patch });
  }

  function toggleType(type) {
    const has = filters.types.includes(type);
    set({ types: has ? filters.types.filter((t) => t !== type) : [...filters.types, type] });
  }

  return (
    <div className="filter-bar">
      <div className="filter-row filter-row-top">
        <div className="type-pills">
          {PROPERTY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`pill ${filters.types.includes(type) ? 'pill-active' : ''}`}
              onClick={() => toggleType(type)}
            >
              {type}
            </button>
          ))}
        </div>

        <label className="sort-select">
          Sort by
          <select value={filters.sort} onChange={(e) => set({ sort: e.target.value })}>
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="filter-row filter-row-bottom">
        <label className="range-field">
          Max distance: <strong>{filters.maxDistanceMi} mi</strong>
          <input
            type="range"
            min="1"
            max="15"
            value={filters.maxDistanceMi}
            onChange={(e) => set({ maxDistanceMi: Number(e.target.value) })}
          />
        </label>

        <label className="range-field">
          Max price: <strong>{formatAED(filters.maxPrice)}/night</strong>
          <input
            type="range"
            min="200"
            max="2500"
            step="50"
            value={filters.maxPrice}
            onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          />
        </label>

        <label className="select-field">
          Min star rating
          <select
            value={filters.minStars}
            onChange={(e) => set({ minStars: Number(e.target.value) })}
          >
            <option value={0}>Any</option>
            <option value={3}>3+</option>
            <option value={4}>4+</option>
            <option value={5}>5</option>
          </select>
        </label>

        <label className="checkbox-field">
          <input
            type="checkbox"
            checked={filters.freeCancellationOnly}
            onChange={(e) => set({ freeCancellationOnly: e.target.checked })}
          />
          Free cancellation only
        </label>

        <span className="result-count">{resultCount} stays found</span>
      </div>
    </div>
  );
}
