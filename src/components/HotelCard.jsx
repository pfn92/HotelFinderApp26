import { AMENITY_ICONS, IconStar, IconCheck } from './Icons';
import { kmToMiles } from '../utils/geo';
import { formatAED } from '../utils/currency';

export default function HotelCard({ hotel, isBestRate, onSelect }) {
  const distanceMi = kmToMiles(hotel.distanceKm);
  const discountPct = hotel.originalPrice
    ? Math.round((1 - hotel.price / hotel.originalPrice) * 100)
    : null;

  return (
    <article className="hotel-card" onClick={() => onSelect(hotel)}>
      <div className="hotel-card-media" style={{ '--hue': hueFromId(hotel.id) }}>
        <span className="hotel-card-type">{hotel.type}</span>
        {isBestRate && <span className="hotel-card-badge">Best rate nearby</span>}
      </div>

      <div className="hotel-card-body">
        <div className="hotel-card-header">
          <h3>{hotel.name}</h3>
          <div className="stars" aria-label={`${hotel.stars} star`}>
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <IconStar key={i} />
            ))}
          </div>
        </div>

        <p className="hotel-card-address">
          {hotel.address} · {distanceMi.toFixed(1)} mi away
        </p>

        <div className="review-badge">
          <span className="review-score">{hotel.reviewScore.toFixed(1)}</span>
          <span className="review-count">{hotel.reviewCount.toLocaleString()} reviews</span>
        </div>

        <div className="amenity-row">
          {hotel.amenities.slice(0, 5).map((a) => {
            const Icon = AMENITY_ICONS[a];
            return (
              <span key={a} className="amenity-chip" title={a}>
                {Icon && <Icon />}
                {a}
              </span>
            );
          })}
        </div>

        {hotel.freeCancellation && (
          <p className="free-cancel">
            <IconCheck /> Free cancellation
          </p>
        )}

        <div className="hotel-card-footer">
          <div className="price-block">
            {hotel.originalPrice && (
              <span className="price-original">{formatAED(hotel.originalPrice)}</span>
            )}
            <span className="price-current">{formatAED(hotel.price)}</span>
            <span className="price-unit">/night</span>
            {discountPct && <span className="price-discount">-{discountPct}%</span>}
          </div>
          <button type="button" className="btn btn-primary btn-small">
            View deal
          </button>
        </div>
      </div>
    </article>
  );
}

// Deterministic hue per hotel so the placeholder media block always looks
// the same for a given hotel instead of flickering between renders.
function hueFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}
