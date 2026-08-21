import { useEffect, useRef, useState } from 'react';
import HotelMedia from './HotelMedia';
import { AMENITY_ICONS } from './iconMaps';
import { IconCheck, IconClose, IconPin, IconStar } from './Icons';
import { kmToMiles } from '../utils/geo';
import { formatAED } from '../utils/currency';
import { reviewLabel } from '../data/mockHotels';

const TAX_RATE = 0.12;
const MAX_NIGHTS = 14;

export default function HotelModal({ hotel, onClose }) {
  // Remounted per hotel (keyed by id in App), so this initial value is the
  // reset — no effect needed to clear it between properties.
  const [nights, setNights] = useState(3);
  const dialogRef = useRef(null);
  const restoreRef = useRef(null);

  useEffect(() => {
    if (!hotel) return undefined;

    restoreRef.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    function handleKey(e) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;

      // Keep focus inside the dialog while it is open.
      const focusables = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (!focusables?.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKey);
    dialogRef.current?.querySelector('.modal-close')?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = overflow;
      restoreRef.current?.focus?.();
    };
  }, [hotel, onClose]);

  if (!hotel) return null;

  const distanceMi = kmToMiles(hotel.distanceKm);
  const subtotal = hotel.price * nights;
  const taxes = Math.round(subtotal * TAX_RATE);
  const total = subtotal + taxes;
  const savings = hotel.originalPrice ? (hotel.originalPrice - hotel.price) * nights : 0;

  return (
    <div className="backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        ref={dialogRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose} aria-label="Close details">
          <IconClose width={18} height={18} />
        </button>

        <HotelMedia hotel={hotel} className="modal-media">
          <span className="tag tag-type">{hotel.type}</span>
        </HotelMedia>

        <div className="modal-body">
          <div className="modal-head">
            <h2 id="modal-title">{hotel.name}</h2>
            <span className="stars" aria-label={`${hotel.stars} star property`}>
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <IconStar key={i} width={13} height={13} />
              ))}
            </span>
          </div>

          <p className="card-loc">
            <IconPin width={14} height={14} />
            {hotel.address} · {hotel.neighbourhood} · {distanceMi.toFixed(1)} mi from your search
          </p>

          <div className="score score-lg">
            <span className="score-num">{hotel.reviewScore.toFixed(1)}</span>
            <span className="score-meta">
              <strong>{reviewLabel(hotel.reviewScore)}</strong>
              <span>{hotel.reviewCount.toLocaleString()} verified reviews</span>
            </span>
          </div>

          <p className="modal-highlight">{hotel.highlight}</p>

          <section className="modal-section">
            <h4>Amenities</h4>
            <ul className="amenity-grid">
              {hotel.amenities.map((a) => {
                const Icon = AMENITY_ICONS[a];
                return (
                  <li key={a} className="amenity">
                    {Icon && <Icon width={14} height={14} />}
                    <span>{a}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          {hotel.freeCancellation && (
            <p className="signal signal-good signal-block">
              <IconCheck width={14} height={14} strokeWidth={2.5} />
              Free cancellation up to 24 hours before check-in
            </p>
          )}

          <section className="modal-section">
            <div className="nights-head">
              <h4>Estimated total</h4>
              <div className="stepper" role="group" aria-label="Number of nights">
                <button
                  type="button"
                  onClick={() => setNights((n) => Math.max(1, n - 1))}
                  disabled={nights <= 1}
                  aria-label="One night fewer"
                >
                  −
                </button>
                <span>
                  {nights} {nights === 1 ? 'night' : 'nights'}
                </span>
                <button
                  type="button"
                  onClick={() => setNights((n) => Math.min(MAX_NIGHTS, n + 1))}
                  disabled={nights >= MAX_NIGHTS}
                  aria-label="One night more"
                >
                  +
                </button>
              </div>
            </div>

            <dl className="breakdown">
              <div>
                <dt>
                  {formatAED(hotel.price)} × {nights} {nights === 1 ? 'night' : 'nights'}
                </dt>
                <dd>{formatAED(subtotal)}</dd>
              </div>
              <div>
                <dt>Taxes &amp; fees (12%)</dt>
                <dd>{formatAED(taxes)}</dd>
              </div>
              {savings > 0 && (
                <div className="breakdown-save">
                  <dt>You save</dt>
                  <dd>−{formatAED(savings)}</dd>
                </div>
              )}
              <div className="breakdown-total">
                <dt>Total</dt>
                <dd>{formatAED(total)}</dd>
              </div>
            </dl>
          </section>

          <button type="button" className="btn btn-primary btn-block">
            Reserve · {formatAED(total)}
          </button>

          <p className="modal-note">
            Demo data — no real booking is made. Connect a rates provider (Amadeus, Booking.com, or
            Expedia Rapid) for live availability and pricing.
          </p>
        </div>
      </div>
    </div>
  );
}
