// Lookup tables kept out of Icons.jsx so that file only exports components
// (React Fast Refresh requires component-only modules).

import {
  IconAC,
  IconBeach,
  IconBed,
  IconBreakfast,
  IconGym,
  IconHome,
  IconPalm,
  IconParking,
  IconPet,
  IconPool,
  IconRestaurant,
  IconShuttle,
  IconSpa,
  IconWifi,
} from './Icons';

export const AMENITY_ICONS = {
  'Free WiFi': IconWifi,
  Pool: IconPool,
  'Free Breakfast': IconBreakfast,
  Parking: IconParking,
  Gym: IconGym,
  Spa: IconSpa,
  'Pet Friendly': IconPet,
  'Air Conditioning': IconAC,
  Restaurant: IconRestaurant,
  Bar: IconRestaurant,
  'Beach Access': IconBeach,
  'Airport Shuttle': IconShuttle,
};

export const TYPE_ICONS = {
  Hotel: IconBed,
  Resort: IconPalm,
  'Inn & B&B': IconHome,
};
