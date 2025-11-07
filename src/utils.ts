import { TrackPoint, SessionStats } from './types';
import { formatDistance, intervalToDuration } from 'date-fns';

// Calculate distance between two GPS coordinates (Haversine formula)
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (degrees: number): number => {
  return degrees * (Math.PI / 180);
};

// Calculate total distance from track points
export const calculateTotalDistance = (points: TrackPoint[]): number => {
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += calculateDistance(
      points[i - 1].lat,
      points[i - 1].lon,
      points[i].lat,
      points[i].lon
    );
  }
  return total;
};

// Calculate session statistics
export const calculateStats = (points: TrackPoint[], startTs: string, endTs?: string): SessionStats => {
  if (points.length === 0) {
    return {
      duration: '0 minutes',
      distance: 0,
      avgSpeed: 0,
      maxSpeed: 0,
      pointCount: 0,
    };
  }

  const distance = calculateTotalDistance(points);
  const speeds = points.map(p => p.sog);
  const avgSpeed = speeds.reduce((a, b) => a + b, 0) / speeds.length;
  const maxSpeed = Math.max(...speeds);

  const start = new Date(startTs);
  const end = endTs ? new Date(endTs) : new Date(points[points.length - 1].ts);
  const durationMs = end.getTime() - start.getTime();
  const duration = intervalToDuration({ start: 0, end: durationMs });

  const durationStr = [
    duration.hours ? `${duration.hours}h` : '',
    duration.minutes ? `${duration.minutes}m` : '',
    duration.seconds ? `${duration.seconds}s` : '',
  ]
    .filter(Boolean)
    .join(' ') || '0s';

  return {
    duration: durationStr,
    distance: Math.round(distance * 100) / 100,
    avgSpeed: Math.round(avgSpeed * 10) / 10,
    maxSpeed: Math.round(maxSpeed * 10) / 10,
    pointCount: points.length,
  };
};

// Convert meters/second to knots
export const msToKnots = (ms: number): number => {
  return ms * 1.94384;
};

// Convert km to nautical miles
export const kmToNm = (km: number): number => {
  return km * 0.539957;
};
