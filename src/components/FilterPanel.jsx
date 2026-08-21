import { PROPERTY_TYPES } from '../data/mockHotels';
import { AMENITY_ICONS, TYPE_ICONS } from './iconMaps';
import { formatAED } from '../utils/currency';
import { IconCheck } from './Icons';

export const PRICE_MIN = 200;
export const PRICE_MAX = 2500;

const SCORE_STEPS = [
  { value: 0, label: 'Any' },
  { value: 7, label: '7+' },
  { value: 8, label: '8+' },
  { value: 9, label: '9+' },
];

const STAR_STEPS = [
  { value: 0, label: 'Any' },
  { value: 3, label: '3★' },
  { value: 4, label: '4★' },
  { value: 5, label: '5★' },
];

const FILTERABLE_AMENITIES = [
  'Free WiFi',
  'Pool',
  'Free Breakfast',
  'Parking',
  'Gym',
  'Spa',
  'Beach Access',
  'Pet Friendly',
];

function Segmented({ legend, steps, value, onChange }) {
  return (
    <fieldset className="field">
      <legend className="field-label">{legend}</legend>
      <div className="segmented" role="group">
        {steps.map((s) => (
          <button
            key={s.value}
            type="button"
            className={`segment ${value === s.value ? 'is-on' : ''}`}
            aria-pressed={value === s.value}
            onClick={() => onChange(s.value)}
          >
            {s.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export default function FilterPanel({ filters, onChange, onReset, resultCount, totalCount }) {
  function set(patch) {
    onChange({ ...filters, ...patch });
  }

  function toggleIn(key, value) {
    const list = filters[key];
    const has = list.includes(value);
    set({ [key]: has ? list.filter((v) => v !== value) : [...list, value] });
  }

  const pricePct = ((filters.maxPrice - PRICE_MIN) / (PRICE_MAX - PRICE_MIN)) * 100;
  const distPct = ((filters.maxDistanceMi - 1) / (15 - 1)) * 100;

  return (
    <aside className="filters" aria-label="Filters">
      <div className="filters-head">
        <h2 className="filters-title">Filters</h2>
        <button type="button" className="link-btn" onClick={onReset}>
          Reset
        </button>
      </div>

      <p className="filters-count">
        <strong>{resultCount}</strong> of {totalCount} stays
      </p>

      <fieldset className="field">
        <legend className="field-label">Property type</legend>
        <div className="type-list">
          {PROPERTY_TYPES.map((type) => {
            const TypeIcon = TYPE_ICONS[type];
            const on = filters.types.includes(type);
            return (
              <button
                key={type}
                type="button"
                className={`type-option ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleIn('types', type)}
              >
                <span className="type-check" aria-hidden="true">
                  {on && <IconCheck width={12} height={12} strokeWidth={3} />}
                </span>
                {TypeIcon && <TypeIcon width={17} height={17} />}
                <span>{type}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">
          Max price <span className="field-value">{formatAED(filters.maxPrice)} / night</span>
        </legend>
        <input
          type="range"
          className="range"
          style={{ '--pct': `${pricePct}%` }}
          min={PRICE_MIN}
          max={PRICE_MAX}
          step="50"
          value={filters.maxPrice}
          onChange={(e) => set({ maxPrice: Number(e.target.value) })}
          aria-label="Maximum nightly price"
        />
        <div className="range-ends">
          <span>{formatAED(PRICE_MIN)}</span>
          <span>{formatAED(PRICE_MAX)}+</span>
        </div>
      </fieldset>

      <fieldset className="field">
        <legend className="field-label">
          Max distance <span className="field-value">{filters.maxDistanceMi} mi</span>
        </legend>
        <input
          type="range"
          className="range"
          style={{ '--pct': `${distPct}%` }}
          min="1"
          max="15"
          value={filters.maxDistanceMi}
          onChange={(e) => set({ maxDistanceMi: Number(e.target.value) })}
          aria-label="Maximum distance in miles"
        />
        <div className="range-ends">
          <span>1 mi</span>
          <span>15 mi</span>
        </div>
      </fieldset>

      <Segmented
        legend="Guest rating"
        steps={SCORE_STEPS}
        value={filters.minScore}
        onChange={(v) => set({ minScore: v })}
      />

      <Segmented
        legend="Star rating"
        steps={STAR_STEPS}
        value={filters.minStars}
        onChange={(v) => set({ minStars: v })}
      />

      <fieldset className="field">
        <legend className="field-label">Amenities</legend>
        <div className="amenity-filters">
          {FILTERABLE_AMENITIES.map((a) => {
            const Icon = AMENITY_ICONS[a];
            const on = filters.amenities.includes(a);
            return (
              <button
                key={a}
                type="button"
                className={`chip-toggle ${on ? 'is-on' : ''}`}
                aria-pressed={on}
                onClick={() => toggleIn('amenities', a)}
              >
                {Icon && <Icon width={14} height={14} />}
                {a}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="switch-row">
        <input
          type="checkbox"
          checked={filters.freeCancellationOnly}
          onChange={(e) => set({ freeCancellationOnly: e.target.checked })}
        />
        <span className="switch" aria-hidden="true" />
        <span>Free cancellation only</span>
      </label>
    </aside>
  );
}
