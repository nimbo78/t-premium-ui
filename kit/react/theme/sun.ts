/** Sunrise/sunset in UTC ("Almanac for Computers" algorithm, ~2 min accuracy). */
export const MOSCOW = { lat: 55.7558, lng: 37.6173 };

const rad = (d: number) => (d * Math.PI) / 180;
const deg = (r: number) => (r * 180) / Math.PI;
const mod = (a: number, n: number) => ((a % n) + n) % n;

function dayOfYear(date: Date): number {
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return Math.round((day - start) / 86_400_000);
}

function eventHoursUtc(date: Date, lat: number, lng: number, rising: boolean): number | null {
  const lngHour = lng / 15;
  const t = dayOfYear(date) + ((rising ? 6 : 18) - lngHour) / 24;
  const M = 0.9856 * t - 3.289;
  const L = mod(M + 1.916 * Math.sin(rad(M)) + 0.02 * Math.sin(rad(2 * M)) + 282.634, 360);
  let RA = mod(deg(Math.atan(0.91764 * Math.tan(rad(L)))), 360);
  RA = (RA + (Math.floor(L / 90) * 90 - Math.floor(RA / 90) * 90)) / 15;
  const sinDec = 0.39782 * Math.sin(rad(L));
  const cosDec = Math.cos(Math.asin(sinDec));
  const cosH = (Math.cos(rad(90.833)) - sinDec * Math.sin(rad(lat))) / (cosDec * Math.cos(rad(lat)));
  if (cosH > 1 || cosH < -1) return null;
  const H = (rising ? 360 - deg(Math.acos(cosH)) : deg(Math.acos(cosH))) / 15;
  const T = H + RA - 0.06571 * t - 6.622;
  return mod(T - lngHour, 24);
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

/** Sunrise and sunset on the UTC day of `date`; null during polar day or night. */
export function sunTimes(date: Date, place = MOSCOW): SunTimes | null {
  const rise = eventHoursUtc(date, place.lat, place.lng, true);
  const set = eventHoursUtc(date, place.lat, place.lng, false);
  if (rise === null || set === null) return null;
  const midnight = Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
  return { sunrise: new Date(midnight + rise * 3_600_000), sunset: new Date(midnight + set * 3_600_000) };
}
