import { useEffect } from 'react';
import { useMap, Polyline } from 'react-leaflet';
import { calculateLaylines } from '../tacticalUtils';

interface LaylinesOverlayProps {
  currentLat: number;
  currentLon: number;
  markLat: number;
  markLon: number;
  windDirection: number; // degrees true
  tackingAngle?: number; // default 42 degrees
  distance?: number; // meters to project
  showPort?: boolean;
  showStarboard?: boolean;
}

export default function LaylinesOverlay({
  currentLat,
  currentLon,
  markLat,
  markLon,
  windDirection,
  tackingAngle = 42,
  distance = 500,
  showPort = true,
  showStarboard = true
}: LaylinesOverlayProps) {
  const laylines = calculateLaylines(
    currentLat,
    currentLon,
    markLat,
    markLon,
    windDirection,
    tackingAngle,
    distance
  );

  return (
    <>
      {/* Port tack layline (green) */}
      {showPort && (
        <Polyline
          positions={laylines.port.points}
          pathOptions={{
            color: '#10B981',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
          }}
        >
          <div className="leaflet-tooltip" style={{
            background: '#10B981',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            Port Layline
          </div>
        </Polyline>
      )}

      {/* Starboard tack layline (red) */}
      {showStarboard && (
        <Polyline
          positions={laylines.starboard.points}
          pathOptions={{
            color: '#EF4444',
            weight: 3,
            opacity: 0.7,
            dashArray: '10, 10',
          }}
        >
          <div className="leaflet-tooltip" style={{
            background: '#EF4444',
            color: 'white',
            border: 'none',
            padding: '4px 8px',
            borderRadius: '4px',
            fontWeight: '600',
            fontSize: '12px'
          }}>
            Starboard Layline
          </div>
        </Polyline>
      )}

      {/* Wind direction indicator at current position */}
      <WindDirectionIndicator
        lat={currentLat}
        lon={currentLon}
        direction={windDirection}
      />
    </>
  );
}

/**
 * Wind direction indicator component
 */
function WindDirectionIndicator({
  lat,
  lon,
  direction
}: {
  lat: number;
  lon: number;
  direction: number;
}) {
  const map = useMap();

  useEffect(() => {
    const windIcon = L.divIcon({
      html: `
        <svg width="50" height="50" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="indicator-shadow">
              <feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.4"/>
            </filter>
          </defs>
          <g transform="translate(25, 25) rotate(${direction})">
            <g filter="url(#indicator-shadow)">
              <!-- Wind arrow -->
              <line x1="0" y1="15" x2="0" y2="-15" stroke="#3B82F6" stroke-width="3"/>
              <polygon points="0,-15 -5,-8 5,-8" fill="#3B82F6"/>
              <!-- Tail feathers -->
              <line x1="0" y1="10" x2="-4" y2="14" stroke="#3B82F6" stroke-width="2"/>
              <line x1="0" y1="10" x2="4" y2="14" stroke="#3B82F6" stroke-width="2"/>
            </g>
          </g>
          <!-- Cardinal direction label -->
          <text x="25" y="45" text-anchor="middle" font-size="10" font-weight="bold" fill="#3B82F6">
            ${getCardinalDirection(direction)}
          </text>
        </svg>
      `,
      className: 'wind-direction-indicator',
      iconSize: [50, 50],
      iconAnchor: [25, 25],
    });

    const marker = L.marker([lat, lon], { icon: windIcon });
    marker.bindPopup(`
      <div style="padding: 8px;">
        <h4 style="margin: 0 0 8px 0; color: #3B82F6;">Wind Direction</h4>
        <p style="margin: 4px 0;"><strong>${direction.toFixed(0)}° (${getCardinalDirection(direction)})</strong></p>
        <p style="margin: 4px 0; font-size: 12px; color: #666;">True heading</p>
      </div>
    `);

    marker.addTo(map);

    return () => {
      map.removeLayer(marker);
    };
  }, [map, lat, lon, direction]);

  return null;
}

/**
 * Convert degrees to cardinal direction
 */
function getCardinalDirection(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(((degrees % 360) / 22.5));
  return directions[index % 16];
}

// Add CSS
const style = document.createElement('style');
style.textContent = `
  .wind-direction-indicator {
    background: transparent !important;
    border: none !important;
    animation: wind-pulse 2s ease-in-out infinite;
  }

  @keyframes wind-pulse {
    0%, 100% {
      opacity: 1;
      transform: scale(1);
    }
    50% {
      opacity: 0.8;
      transform: scale(1.05);
    }
  }
`;
document.head.appendChild(style);
