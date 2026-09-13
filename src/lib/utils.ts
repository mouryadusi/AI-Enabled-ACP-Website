import { type ClassValue, clsx } from "clsx";

/** Tiny classnames helper so components can compose Tailwind classes conditionally. */
export function cx(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Clamp a number between a min and max. */
export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

/** Format a decimal (0-1) as a percentage string with fixed precision. */
export function formatPercent(value: number, digits = 2) {
  return `${(value * 100).toFixed(digits)}%`;
}

/** Convert latitude/longitude (degrees) to a point on a unit sphere. */
export function latLngToVector3(latDeg: number, lngDeg: number, radius = 1) {
  const lat = (latDeg * Math.PI) / 180;
  const lng = (lngDeg * Math.PI) / 180;
  const x = radius * Math.cos(lat) * Math.cos(lng);
  const y = radius * Math.sin(lat);
  const z = -radius * Math.cos(lat) * Math.sin(lng);
  return [x, y, z] as [number, number, number];
}
