import { mulberry32, seedFromString } from '../utils/prng';
import { haversineDistanceKm, randomPointNear } from '../utils/geo';

export const PROPERTY_TYPES = ['Hotel', 'Resort', 'Inn & B&B'];

const NAME_PREFIXES = [
  'Grand', 'Royal', 'Al Noor', 'Al Waha', 'Marina', 'Jumeirah', 'Desert Rose', 'Al Reem',
  'Palm', 'Oasis', 'Corniche', 'Al Manara', 'Dune', 'Golden', 'Emerald', 'Al Bustan',
  'Skyline', 'Heritage', 'Pearl', 'Starlight', 'Crescent', 'Al Fahidi', 'Meridian',
  'Falcon', 'Zayed', 'Creekside', 'Vista',
];

const HOTEL_SUFFIXES = ['Hotel', 'Suites', 'Hotel Apartments', 'Plaza Hotel', 'Grand Hotel', 'Hotel & Suites'];
const RESORT_SUFFIXES = ['Resort & Spa', 'Beach Resort', 'Resort', 'All-Inclusive Resort', 'Resort & Marina'];
const INN_SUFFIXES = ['Inn', 'Boutique Stay', 'Lodge', 'Guesthouse', 'Residence'];

const AMENITIES_POOL = [
  'Free WiFi', 'Pool', 'Free Breakfast', 'Parking', 'Gym', 'Spa',
  'Pet Friendly', 'Air Conditioning', 'Restaurant', 'Bar', 'Beach Access', 'Airport Shuttle',
];

const STREET_NAMES = [
  'Sheikh Zayed Rd', 'Al Wasl Rd', 'Jumeirah Beach Rd', 'Al Maktoum Rd', 'Corniche Rd',
  'Al Sufouh Rd', 'Marina Walk', 'Al Reem St', 'Khalid Bin Waleed St', 'Al Ittihad Rd',
  'Hessa St', 'Al Khaleej Rd',
];

const NEIGHBOURHOODS = [
  'Downtown', 'Marina District', 'Beachfront', 'Old Town', 'Business Bay',
  'Financial Centre', 'Waterfront', 'Cultural Quarter', 'Airport District', 'Garden District',
];

const HIGHLIGHTS = [
  'Rooftop infinity pool',
  'Panoramic skyline views',
  'Award-winning restaurant',
  'Private beach cabanas',
  'Newly renovated rooms',
  'Steps from the metro',
  'Full-service desert spa',
  'Family suites available',
];

function pick(rand, arr) {
  return arr[Math.floor(rand() * arr.length)];
}

function pickMany(rand, arr, min, max) {
  const count = min + Math.floor(rand() * (max - min + 1));
  const pool = [...arr];
  const result = [];
  for (let i = 0; i < count && pool.length; i++) {
    const idx = Math.floor(rand() * pool.length);
    result.push(pool.splice(idx, 1)[0]);
  }
  return result;
}

/** Booking-style word for a 0-10 review score. */
export function reviewLabel(score) {
  if (score >= 9) return 'Exceptional';
  if (score >= 8.5) return 'Excellent';
  if (score >= 8) return 'Very good';
  if (score >= 7) return 'Good';
  return 'Pleasant';
}

/**
 * Deterministically generates a list of mock hotels/resorts around a
 * coordinate. Same (lat, lng) always yields the same results, so a repeat
 * search or a page refresh looks stable to the user.
 */
export function generateHotels(lat, lng, count = 24) {
  const seed = seedFromString(`${lat.toFixed(3)},${lng.toFixed(3)}|v2`);
  const rand = mulberry32(seed);
  const hotels = [];

  for (let i = 0; i < count; i++) {
    const type = pick(rand, PROPERTY_TYPES);
    const suffixArr =
      type === 'Resort' ? RESORT_SUFFIXES : type === 'Inn & B&B' ? INN_SUFFIXES : HOTEL_SUFFIXES;
    const name = `${pick(rand, NAME_PREFIXES)} ${pick(rand, suffixArr)}`;

    const rawStars = type === 'Resort' ? 3 + rand() * 2.5 : 2 + rand() * 3.5;
    const stars = Math.min(5, Math.max(2, Math.round(rawStars)));

    const reviewScore = Math.round((6 + rand() * 3.9) * 10) / 10; // 6.0 - 9.9
    const reviewCount = 20 + Math.floor(rand() * 1800);

    const basePrice =
      type === 'Resort' ? 650 + rand() * 1600 : type === 'Inn & B&B' ? 250 + rand() * 550 : 350 + rand() * 950;
    const price = Math.round(basePrice / 5) * 5;
    const hasDiscount = rand() < 0.4;
    const originalPrice = hasDiscount ? Math.round(price * (1.12 + rand() * 0.28)) : null;

    const { lat: hLat, lng: hLng } = randomPointNear(rand, lat, lng, 24);
    const distanceKm = haversineDistanceKm(lat, lng, hLat, hLng);

    const amenities = pickMany(rand, AMENITIES_POOL, 4, 7);
    const freeCancellation = rand() < 0.55;
    const streetNum = 100 + Math.floor(rand() * 9800);
    const neighbourhood = pick(rand, NEIGHBOURHOODS);
    const highlight = pick(rand, HIGHLIGHTS);
    // Scarcity signal on a minority of listings only, so it keeps its punch.
    const roomsLeft = rand() < 0.3 ? 1 + Math.floor(rand() * 4) : null;
    const breakfastIncluded = amenities.includes('Free Breakfast');

    hotels.push({
      id: `h${i}-${seed}`,
      name,
      type,
      stars,
      reviewScore,
      reviewCount,
      price,
      originalPrice,
      currency: 'AED',
      lat: hLat,
      lng: hLng,
      distanceKm,
      address: `${streetNum} ${pick(rand, STREET_NAMES)}`,
      neighbourhood,
      highlight,
      amenities,
      freeCancellation,
      breakfastIncluded,
      roomsLeft,
    });
  }

  return hotels;
}
