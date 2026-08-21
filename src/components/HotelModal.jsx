import { useEffect } from 'react';
import { AMENITY_ICONS, IconStar, IconClose, IconCheck, IconPin } from './Icons';
import { kmToMiles } from '../utils/geo';
import { formatAED } from '../utils/currency';

const NIGHTS = 3;
const TAX_RATE = 0.12;

export default function HotelModal({ hotel, onClose }) {
  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'Escape') onClose();
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!hotel) return null;

  const distanceMi = kmToMiles(hotel.distanceKm);
  const subtotal = hotel.price * NIGHTS;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close">
          <IconClose />
        </button>

        <div className="modal-media" style={{ '--hue': hueFromId(hotel.id) }}>
          <span className="hotel-card-type">{hotel.type}</span>
        </div>

        <div className="modal-body">
          <div className="hotel-card-header">
            <h2>{hotel.name}</h2>
            <div className="stars">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <IconStar key={i} />
              ))}
            </div>
          </div>

          <p className="hotel-card-address">
            <IconPin /> {hotel.address} · {distanceMi.toFixed(1)} mi from your search location
          </p>

          <div className="review-badge">
            <span className="review-score">{hotel.reviewScore.toFixed(1)}</span>
            <span className="review-count">{hotel.reviewCount.toLocaleString()} reviews</span>
          </div>

          <h4>Amenities</h4>
          <div className="amenity-grid">
            {hotel.amenities.map((a) => {
              const Icon = AMENITY_ICONS[a];
              return (
                <span key={a} className="amenity-chip">
                  {Icon && <Icon />}
                  {a}
                </span>
              );
            })}
          </div>

          {hotel.freeCancellation && (
            <p className="free-cancel">
              <IconCheck /> Free cancellation available
            </p>
          )}

          <div className="price-breakdown">
            <h4>Estimated price ({NIGHTS} nights)</h4>
            <div className="breakdown-row">
              <span>
                {formatAED(hotel.price)} × {NIGHTS} nights
              </span>
              <span>{formatAED(subtotal)}</span>
            </div>
            <div className="breakdown-row">
              <span>Taxes & fees</span>
              <span>{formatAED(taxes)}</span>
            </div>
            <div className="breakdown-row breakdown-total">
              <span>Total</span>
              <span>{formatAED(total)}</span>
            </div>
          </div>

          <button type="button" className="btn btn-primary btn-block">
            Reserve at {formatAED(hotel.price)}/night
          </button>
          <p className="modal-disclaimer">
            Demo data — no real booking is made. Connect a rates provider (e.g. Amadeus, Booking.com, Expedia
            Rapid) to show live availability and pricing.
          </p>
        </div>
      </div>
    </div>
  );
}

function hueFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}
