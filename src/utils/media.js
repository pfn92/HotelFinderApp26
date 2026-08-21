// Deterministic placeholder artwork per hotel. Real listing photos would come
// from a rates provider; until then each property gets a stable, distinct
// gradient derived from its id so the UI looks composed rather than broken.

export function hueFromId(id) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) % 360;
  return h;
}

/** Two related hues + an angle, all stable for a given id. */
export function mediaStyle(id) {
  const hue = hueFromId(id);
  return {
    '--hue': hue,
    '--hue-2': (hue + 42) % 360,
    '--angle': `${(hue % 90) + 100}deg`,
  };
}
