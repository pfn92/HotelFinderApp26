import HotelCard from './HotelCard';

export default function HotelGrid({ hotels, onSelect }) {
  if (hotels.length === 0) {
    return (
      <div className="empty-state">
        <h3>No stays match your filters</h3>
        <p>Try widening the distance, raising the max price, or clearing a filter.</p>
      </div>
    );
  }

  const lowestPrice = Math.min(...hotels.map((h) => h.price));

  return (
    <div className="hotel-grid">
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
