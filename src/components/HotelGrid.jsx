import HotelCard from './HotelCard';
import EmptyState from './EmptyState';

export default function HotelGrid({ hotels, onSelect, onReset }) {
  if (hotels.length === 0) return <EmptyState onReset={onReset} />;

  const lowestPrice = Math.min(...hotels.map((h) => h.price));

  return (
    <div className="grid">
      {hotels.map((hotel) => (
        <HotelCard
          key={hotel.id}
          hotel={hotel}
          isBestRate={hotel.price === lowestPrice}
          onSelect={onSelect}
        />
      ))}
    </div>
  );
}
