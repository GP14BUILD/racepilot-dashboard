import { TrackPoint } from './types';

// Sailing tactical analytics utilities

export interface VMGData {
  timestamp: string;
  vmg: number; // Velocity Made Good (knots)
  vmgUpwind: number;
  vmgDownwind: number;
  targetAngle: number;
}

export interface Layline {
  points: [number, number][]; // [lat, lon] pairs
  tack: 'port' | 'starboard';
}

export interface TackAnalysis {
  timestamp: string;
  lat: number;
  lon: number;
  lostDistance: number; // meters
  timeInIrons: number; // seconds
  efficiency: number; // percentage
}

/**
 * Calculate VMG (Velocity Made Good) towards wind
 */
export function calculateVMG(trackPoint: TrackPoint, targetHeading: number): VMGData {
  const { sog, cog, twa } = trackPoint;

  // VMG = SOG * cos(angle to target)
  const angleToTarget = Math.abs(((cog - targetHeading + 180) % 360) - 180);
  const vmg = sog * Math.cos((angleToTarget * Math.PI) / 180);

  // Upwind VMG (when TWA < 90)
  const vmgUpwind = twa && Math.abs(twa) < 90
    ? sog * Math.cos((twa * Math.PI) / 180)
    : 0;

  // Downwind VMG (when TWA > 90)
  const vmgDownwind = twa && Math.abs(twa) > 90
    ? sog * Math.cos(((180 - Math.abs(twa)) * Math.PI) / 180)
    : 0;

  // Optimal angle varies by boat, typically 40-45° upwind, 140-150° downwind
  const targetAngle = twa && Math.abs(twa) < 90 ? 42 : 145;

  return {
    timestamp: trackPoint.ts,
    vmg,
    vmgUpwind,
    vmgDownwind,
    targetAngle
  };
}

/**
 * Calculate laylines from current position to a mark
 */
export function calculateLaylines(
  currentLat: number,
  currentLon: number,
  markLat: number,
  markLon: number,
  windDirection: number, // degrees true
  tackingAngle: number = 42, // typical upwind angle
  distance: number = 500 // meters to project
): { port: Layline; starboard: Layline } {

  // Port tack layline (wind from port side)
  const portLaylineHeading = (windDirection + tackingAngle) % 360;
  const portPoints = projectLine(currentLat, currentLon, portLaylineHeading, distance);

  // Starboard tack layline (wind from starboard side)
  const starboardLaylineHeading = (windDirection - tackingAngle + 360) % 360;
  const starboardPoints = projectLine(currentLat, currentLon, starboardLaylineHeading, distance);

  return {
    port: { points: portPoints, tack: 'port' },
    starboard: { points: starboardPoints, tack: 'starboard' }
  };
}

/**
 * Project a line from a point in a direction for a distance
 */
function projectLine(
  lat: number,
  lon: number,
  heading: number,
  distance: number,
  points: number = 50
): [number, number][] {
  const R = 6371000; // Earth radius in meters
  const result: [number, number][] = [];

  for (let i = 0; i <= points; i++) {
    const d = (distance * i) / points;
    const brng = (heading * Math.PI) / 180;

    const lat1 = (lat * Math.PI) / 180;
    const lon1 = (lon * Math.PI) / 180;

    const lat2 = Math.asin(
      Math.sin(lat1) * Math.cos(d / R) +
      Math.cos(lat1) * Math.sin(d / R) * Math.cos(brng)
    );

    const lon2 = lon1 + Math.atan2(
      Math.sin(brng) * Math.sin(d / R) * Math.cos(lat1),
      Math.cos(d / R) - Math.sin(lat1) * Math.sin(lat2)
    );

    result.push([
      (lat2 * 180) / Math.PI,
      (lon2 * 180) / Math.PI
    ]);
  }

  return result;
}

/**
 * Detect tacks in GPS track
 */
export function detectTacks(trackPoints: TrackPoint[]): TackAnalysis[] {
  const tacks: TackAnalysis[] = [];
  let previousTWA = 0;

  for (let i = 1; i < trackPoints.length; i++) {
    const current = trackPoints[i];
    const prev = trackPoints[i - 1];

    if (!current.twa || !prev.twa) continue;

    // Detect tack when TWA crosses through zero (sign change)
    const tackDetected =
      (prev.twa > 0 && current.twa < 0) ||
      (prev.twa < 0 && current.twa > 0);

    if (tackDetected) {
      // Calculate tack efficiency
      const timeDiff = (new Date(current.ts).getTime() - new Date(prev.ts).getTime()) / 1000;
      const distance = calculateDistance(prev.lat, prev.lon, current.lat, current.lon);

      // A good tack loses minimal distance and time
      const expectedDistance = (prev.sog + current.sog) / 2 * 0.514444 * timeDiff; // knots to m/s
      const lostDistance = expectedDistance - distance;
      const efficiency = Math.max(0, Math.min(100, (distance / expectedDistance) * 100));

      tacks.push({
        timestamp: current.ts,
        lat: current.lat,
        lon: current.lon,
        lostDistance,
        timeInIrons: timeDiff,
        efficiency
      });
    }

    previousTWA = current.twa;
  }

  return tacks;
}

/**
 * Calculate distance between two GPS points (Haversine formula)
 */
export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate start line bias
 */
export function calculateStartLineBias(
  pinLat: number,
  pinLon: number,
  boatLat: number,
  boatLon: number,
  windDirection: number
): {
  lineHeading: number;
  bias: number;
  favoredEnd: 'pin' | 'boat' | 'neutral';
} {
  // Calculate line heading
  const lat1 = toRad(pinLat);
  const lat2 = toRad(boatLat);
  const dLon = toRad(boatLon - pinLon);

  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  const lineHeading = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;

  // Calculate bias (angle between wind and line)
  const bias = ((windDirection - lineHeading + 180) % 360) - 180;

  // Determine favored end
  let favoredEnd: 'pin' | 'boat' | 'neutral';
  if (Math.abs(bias) < 5) {
    favoredEnd = 'neutral';
  } else if (bias > 0) {
    favoredEnd = 'pin';
  } else {
    favoredEnd = 'boat';
  }

  return { lineHeading, bias, favoredEnd };
}

/**
 * Calculate optimal tacking angle for given wind speed
 */
export function getOptimalTackingAngle(windSpeed: number): number {
  // Typical tacking angles based on wind speed
  if (windSpeed < 8) return 45; // Light air
  if (windSpeed < 12) return 42; // Medium
  if (windSpeed < 18) return 38; // Fresh
  return 35; // Strong wind
}

/**
 * Calculate performance percentage against target boat speed
 */
export function calculatePerformance(
  actualSpeed: number,
  windSpeed: number,
  windAngle: number,
  polarData?: { tws: number[]; twa: number[]; target: number[][] }
): number {
  if (!polarData) return 100; // No polar data, assume 100%

  // Find target speed from polar diagram
  const targetSpeed = interpolatePolar(polarData, windSpeed, Math.abs(windAngle));

  if (targetSpeed === 0) return 0;
  return (actualSpeed / targetSpeed) * 100;
}

/**
 * Interpolate polar diagram to get target speed
 */
function interpolatePolar(
  polarData: { tws: number[]; twa: number[]; target: number[][] },
  windSpeed: number,
  windAngle: number
): number {
  // Simple bilinear interpolation
  // Find surrounding TWS and TWA values
  const twsIndex = polarData.tws.findIndex(tws => tws >= windSpeed);
  const twaIndex = polarData.twa.findIndex(twa => twa >= windAngle);

  if (twsIndex === -1 || twaIndex === -1) return 0;

  // For simplicity, return closest value
  return polarData.target[twsIndex]?.[twaIndex] || 0;
}

/**
 * Calculate wind shifts over time
 */
export function detectWindShifts(
  trackPoints: TrackPoint[],
  thresholdDegrees: number = 10
): Array<{ timestamp: string; shift: number; type: 'lift' | 'header' }> {
  const shifts: Array<{ timestamp: string; shift: number; type: 'lift' | 'header' }> = [];

  for (let i = 5; i < trackPoints.length; i++) {
    const current = trackPoints[i];
    const previous = trackPoints[i - 5]; // Compare with 5 points ago

    if (!current.twa || !previous.twa) continue;

    const shift = current.twa - previous.twa;

    if (Math.abs(shift) > thresholdDegrees) {
      shifts.push({
        timestamp: current.ts,
        shift,
        type: shift > 0 ? 'lift' : 'header'
      });
    }
  }

  return shifts;
}
