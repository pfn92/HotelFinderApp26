import HotelMedia from './HotelMedia';
import { AMENITY_ICONS } from './iconMaps';
import { IconCheck, IconPin, IconStar, IconTrend } from './Icons';
import { kmToMiles } from '../utils/geo';
import { formatAED } from '../utils/currency';
import { reviewLabel } from '../data/mockHotels';

const VISIBLE_AMENITIES = 4;

export default function HotelCard({ hotel, isBestRate, onSelect }) {
  const distanceMi = kmToMiles(hotel.distanceKm);
  const discountPct = hotel.originalPrice
    ? Math.round((1 - hotel.price / hotel.originalPrice) * 100)
    : null;
  const shown = hotel.amenities.slice(0, VISIBLE_AMENITIES);
  const overflow = hotel.amenities.length - shown.length;

  return (
    <article className="card">
      {/* The whole card is clickable, but the button is what screen readers and
          keyboards land on — avoids a click handler on a non-interactive tag. */}
      <button
        type="button"
        className="card-hit"
        onClick={() => onSelect(hotel)}
        aria-label={`View details and rates for ${hotel.name}`}
      />

      <HotelMedia hotel={hotel} className="card-media">
        <span className="tag tag-type">{hotel.type}</span>
        {isBestRate && (
          <span className="tag tag-best">
            <IconTrend width={12} height={12} strokeWidth={2.5} />
            Best rate
          </span>
        )}
        {discountPct > 0 && <span className="tag tag-deal">−{discountPct}%</span>}
      </HotelMedia>

      <div className="card-body">
        <div className="card-top">
          <h3 className="card-name">{hotel.name}</h3>
          <span className="stars" aria-label={`${hotel.stars} star property`}>
            {Array.from({ length: hotel.stars }).map((_, i) => (
              <IconStar key={i} width={12} height={12} />
            ))}
          </span>
        </div>

        <p className="card-loc">
          <IconPin width={14} height={14} />
          {hotel.neighbourhood} · {distanceMi.toFixed(1)} mi away
        </p>

        <p className="card-highlight">{hotel.highlight}</p>

        <ul className="amenity-row">
          {shown.map((a) => {
            const Icon = AMENITY_ICONS[a];
            return (
              <li key={a} className="amenity" title={a}>
                {Icon && <Icon width={13} height={13} />}
                <span>{a}</span>
              </li>
            );
          })}
          {overflow > 0 && <li className="amenity amenity-more">+{overflow}</li>}
        </ul>

        <div className="card-signals">
          {hotel.freeCancellation && (
            <span className="signal signal-good">
              <IconCheck width={13} height={13} strokeWidth={2.5} />
              Free cancellation
            </span>
          )}
          {hotel.roomsLeft && (
            <span className="signal signal-urgent">
              Only {hotel.roomsLeft} left
            </span>
          )}
        </div>

        <footer className="card-foot">
          <div className="score">
            <span className="score-num">{hotel.reviewScore.toFixed(1)}</span>
            <span className="score-meta">
              <strong>{reviewLabel(hotel.reviewScore)}</strong>
              <span>{hotel.reviewCount.toLocaleString()} reviews</span>
            </span>
          </div>

          <div className="price">
            {hotel.originalPrice && (
              <span className="price-was">{formatAED(hotel.originalPrice)}</span>
            )}
            <span className="price-now">{formatAED(hotel.price)}</span>
            <span className="price-unit">per night</span>
          </div>
        </footer>
      </div>
    </article>
  );
}
