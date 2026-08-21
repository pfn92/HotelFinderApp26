import { IconSearch } from './Icons';

export default function EmptyState({ onReset }) {
  return (
    <div className="empty">
      <span className="empty-icon" aria-hidden="true">
        <IconSearch width={26} height={26} />
      </span>
      <h3>No stays match your filters</h3>
      <p>Try widening the distance, raising the price ceiling, or dropping an amenity.</p>
      <button type="button" className="btn btn-primary" onClick={onReset}>
        Reset filters
      </button>
    </div>
  );
}
