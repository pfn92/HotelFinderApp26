import { IconChevronDown, IconGrid, IconMap, IconSliders } from './Icons';

const SORT_OPTIONS = [
  { value: 'price-asc', label: 'Lowest price' },
  { value: 'rating-desc', label: 'Top rated' },
  { value: 'distance-asc', label: 'Nearest first' },
  { value: 'price-desc', label: 'Highest price' },
];

export default function ResultsToolbar({
  locationLabel,
  resultCount,
  sort,
  onSortChange,
  view,
  onViewChange,
  onOpenFilters,
}) {
  return (
    <div className="toolbar">
      <div className="toolbar-head">
        <h1 className="toolbar-title">
          {resultCount} {resultCount === 1 ? 'stay' : 'stays'} near{' '}
          <span className="toolbar-place">{locationLabel}</span>
        </h1>
      </div>

      <div className="toolbar-actions">
        <button type="button" className="btn btn-outline filters-trigger" onClick={onOpenFilters}>
          <IconSliders width={16} height={16} />
          Filters
        </button>

        <label className="select-wrap">
          <span className="sr-only">Sort results by</span>
          <select value={sort} onChange={(e) => onSortChange(e.target.value)}>
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <IconChevronDown className="select-chevron" width={15} height={15} />
        </label>

        <div className="view-toggle" role="group" aria-label="Result view">
          <button
            type="button"
            className={view === 'grid' ? 'is-on' : ''}
            aria-pressed={view === 'grid'}
            onClick={() => onViewChange('grid')}
          >
            <IconGrid width={15} height={15} />
            List
          </button>
          <button
            type="button"
            className={view === 'map' ? 'is-on' : ''}
            aria-pressed={view === 'map'}
            onClick={() => onViewChange('map')}
          >
            <IconMap width={15} height={15} />
            Map
          </button>
        </div>
      </div>
    </div>
  );
}
