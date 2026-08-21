// Small inline SVG icon set (stroke-based, ~Feather style) so the app
// has zero icon-font/image dependencies.

const base = {
  width: 16,
  height: 16,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function IconWifi(props) {
  return (
    <svg {...base} {...props}>
      <path d="M5 12.55a11 11 0 0 1 14.08 0" />
      <path d="M1.42 9a16 16 0 0 1 21.16 0" />
      <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
      <circle cx="12" cy="20" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconPool(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 18c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
      <path d="M2 13c1.5 1.2 3 1.2 4.5 0s3-1.2 4.5 0 3 1.2 4.5 0 3-1.2 4.5 0" />
      <path d="M7 4l10 6-10 6z" />
    </svg>
  );
}

export function IconBreakfast(props) {
  return (
    <svg {...base} {...props}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v6a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <line x1="6" y1="1" x2="6" y2="4" />
      <line x1="10" y1="1" x2="10" y2="4" />
      <line x1="14" y1="1" x2="14" y2="4" />
    </svg>
  );
}

export function IconParking(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <path d="M9 17V7h4a3 3 0 0 1 0 6H9" />
    </svg>
  );
}

export function IconGym(props) {
  return (
    <svg {...base} {...props}>
      <path d="M6.5 6.5l11 11" />
      <path d="M21 21l-1-1M4 4L3 3" />
      <path d="M18 6l-3-3-2 2 3 3z" />
      <path d="M6 18l3 3 2-2-3-3z" />
      <path d="M17 4l3 3-1.5 1.5-3-3z" />
      <path d="M4 17l3 3-1.5 1.5-3-3z" />
    </svg>
  );
}

export function IconSpa(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 21c-4-2-7-5.5-7-10a7 7 0 0 1 14 0c0 4.5-3 8-7 10z" />
      <path d="M12 11c1-2 3-3 5-3-0.5 2-2 4-5 5-3-1-4.5-3-5-5 2 0 4 1 5 3z" />
    </svg>
  );
}

export function IconPet(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="5" cy="9" r="2" />
      <circle cx="10" cy="5" r="2" />
      <circle cx="15" cy="5" r="2" />
      <circle cx="19" cy="9" r="2" />
      <path d="M6 17c0-3 2-5 6-5s6 2 6 5c0 2-2 3-6 3s-6-1-6-3z" />
    </svg>
  );
}

export function IconAC(props) {
  return (
    <svg {...base} {...props}>
      <rect x="2" y="6" width="20" height="6" rx="1" />
      <path d="M6 16v3M10 16v4M14 16v3M18 16v4" />
    </svg>
  );
}

export function IconRestaurant(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 2v7c0 1.1.9 2 2 2s2-.9 2-2V2" />
      <path d="M5 11v11" />
      <path d="M15 2c-2 0-3 2-3 5s1 4 3 4v11" />
    </svg>
  );
}

export function IconBeach(props) {
  return (
    <svg {...base} {...props}>
      <path d="M2 22h20" />
      <path d="M2 16c4-8 16-8 20 0" />
      <path d="M12 16V2" />
      <path d="M12 6c2 0 4 1 4 3" />
    </svg>
  );
}

export function IconShuttle(props) {
  return (
    <svg {...base} {...props}>
      <rect x="1" y="6" width="16" height="10" rx="2" />
      <path d="M17 9h3l2 3v4h-5" />
      <circle cx="5.5" cy="18.5" r="1.5" />
      <circle cx="16.5" cy="18.5" r="1.5" />
    </svg>
  );
}

export function IconPin(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22s7-7.5 7-12.5a7 7 0 1 0-14 0C5 14.5 12 22 12 22z" />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}

export function IconLocate(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
    </svg>
  );
}

export function IconSearch(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </svg>
  );
}

export function IconStar(props) {
  return (
    <svg {...base} viewBox="0 0 24 24" width="14" height="14" fill="currentColor" stroke="none" {...props}>
      <path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.9L5.7 21l1.7-7L2 9.2l7.1-.6z" />
    </svg>
  );
}

export function IconClose(props) {
  return (
    <svg {...base} {...props}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export function IconCheck(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export function IconSun(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
    </svg>
  );
}

export function IconMoon(props) {
  return (
    <svg {...base} {...props}>
      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
    </svg>
  );
}

export function IconGrid(props) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

export function IconMap(props) {
  return (
    <svg {...base} {...props}>
      <path d="M9 3L3 5.5v15L9 18l6 3 6-2.5v-15L15 6z" />
      <path d="M9 3v15M15 6v15" />
    </svg>
  );
}

export function IconSliders(props) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h10M18 18h2" />
      <circle cx="16" cy="6" r="2" />
      <circle cx="10" cy="12" r="2" />
      <circle cx="16" cy="18" r="2" />
    </svg>
  );
}

export function IconBed(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 18v-8h13a5 5 0 0 1 5 5v3" />
      <path d="M3 14h18M3 18v2M21 18v2" />
      <circle cx="7.5" cy="11.5" r="1.5" />
    </svg>
  );
}

export function IconPalm(props) {
  return (
    <svg {...base} {...props}>
      <path d="M12 22c0-6 0-9 1-12" />
      <path d="M13 10c-3-3-7-2-9 1 3-1 5 0 6 1" />
      <path d="M13 10c1-4 5-6 8-4-3 0-5 2-5 4" />
      <path d="M13 10c3-1 6 1 6 4-2-2-4-2-5-1" />
    </svg>
  );
}

export function IconHome(props) {
  return (
    <svg {...base} {...props}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
      <path d="M10 21v-6h4v6" />
    </svg>
  );
}

export function IconChevronDown(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

export function IconTrend(props) {
  return (
    <svg {...base} {...props}>
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="15 7 21 7 21 13" />
    </svg>
  );
}

export function IconAlert(props) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 8v5M12 16.5v.5" />
    </svg>
  );
}
