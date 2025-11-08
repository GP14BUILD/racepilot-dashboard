import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

interface WindData {
  lat: number;
  lon: number;
  speed: number; // knots
  direction: number; // degrees true
  timestamp?: string;
}

interface WindVisualizationProps {
  windData: WindData[];
  showArrows?: boolean;
  showBarbs?: boolean;
  opacity?: number;
}

export default function WindVisualization({
  windData,
  showArrows = true,
  showBarbs = false,
  opacity = 0.8
}: WindVisualizationProps) {
  const map = useMap();

  useEffect(() => {
    if (!windData || windData.length === 0) return;

    const windLayer = L.layerGroup();

    windData.forEach((wind, index) => {
      if (showArrows) {
        // Create wind arrow
        const arrowIcon = createWindArrow(wind.direction, wind.speed, opacity);
        const arrow = L.marker([wind.lat, wind.lon], {
          icon: L.divIcon({
            html: arrowIcon,
            className: 'wind-arrow',
            iconSize: [60, 60],
            iconAnchor: [30, 30],
          }),
        });

        // Add popup with wind details
        arrow.bindPopup(`
          <div style="padding: 8px;">
            <h4 style="margin: 0 0 8px 0;">Wind Data</h4>
            <p style="margin: 4px 0;"><strong>Speed:</strong> ${wind.speed.toFixed(1)} kn</p>
            <p style="margin: 4px 0;"><strong>Direction:</strong> ${wind.direction.toFixed(0)}°</p>
            ${wind.timestamp ? `<p style="margin: 4px 0; font-size: 11px; color: #666;">${new Date(wind.timestamp).toLocaleString()}</p>` : ''}
          </div>
        `);

        arrow.addTo(windLayer);
      }

      if (showBarbs) {
        // Create wind barb (meteorological style)
        const barbIcon = createWindBarb(wind.direction, wind.speed, opacity);
        const barb = L.marker([wind.lat, wind.lon], {
          icon: L.divIcon({
            html: barbIcon,
            className: 'wind-barb',
            iconSize: [40, 80],
            iconAnchor: [20, 40],
          }),
        });

        barb.addTo(windLayer);
      }
    });

    windLayer.addTo(map);

    return () => {
      map.removeLayer(windLayer);
    };
  }, [map, windData, showArrows, showBarbs, opacity]);

  return null;
}

/**
 * Create wind arrow SVG
 */
function createWindArrow(direction: number, speed: number, opacity: number): string {
  const size = 60;
  const color = getWindSpeedColor(speed);

  // Rotate arrow to point in wind direction
  const rotation = direction;

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="wind-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g transform="translate(${size/2}, ${size/2}) rotate(${rotation})">
        <g filter="url(#wind-shadow)">
          <!-- Arrow shaft -->
          <line x1="0" y1="0" x2="0" y2="-20" stroke="${color}" stroke-width="3" opacity="${opacity}"/>
          <!-- Arrow head -->
          <polygon points="0,-20 -6,-12 6,-12" fill="${color}" opacity="${opacity}"/>
          <!-- Speed indicator circle -->
          <circle cx="0" cy="0" r="${Math.min(speed/2 + 3, 12)}" fill="${color}" opacity="${opacity * 0.3}" stroke="${color}" stroke-width="1.5"/>
        </g>
        <!-- Speed label -->
        <text x="0" y="15" text-anchor="middle" font-size="11" font-weight="bold" fill="#333" opacity="${opacity}">
          ${speed.toFixed(0)}
        </text>
      </g>
    </svg>
  `;
}

/**
 * Create meteorological wind barb
 */
function createWindBarb(direction: number, speed: number, opacity: number): string {
  const size = 80;
  const color = '#333';

  // Calculate number of barbs based on speed
  // Each full barb = 10 knots, half barb = 5 knots
  const fullBarbs = Math.floor(speed / 10);
  const halfBarb = (speed % 10) >= 5;

  let barbs = '';
  let yOffset = -30;

  // Draw full barbs
  for (let i = 0; i < fullBarbs; i++) {
    barbs += `<line x1="0" y1="${yOffset}" x2="15" y2="${yOffset - 8}" stroke="${color}" stroke-width="2.5" opacity="${opacity}"/>`;
    yOffset += 8;
  }

  // Draw half barb
  if (halfBarb) {
    barbs += `<line x1="0" y1="${yOffset}" x2="8" y2="${yOffset - 4}" stroke="${color}" stroke-width="2.5" opacity="${opacity}"/>`;
  }

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(${size/2}, ${size/2}) rotate(${direction + 180})">
        <!-- Barb staff -->
        <line x1="0" y1="10" x2="0" y2="-35" stroke="${color}" stroke-width="2.5" opacity="${opacity}"/>
        ${barbs}
        <!-- Base circle -->
        <circle cx="0" cy="10" r="4" fill="${color}" opacity="${opacity}"/>
      </g>
    </svg>
  `;
}

/**
 * Get color based on wind speed (Beaufort scale inspired)
 */
function getWindSpeedColor(speed: number): string {
  if (speed < 5) return '#4CAF50'; // Light - Green
  if (speed < 10) return '#8BC34A'; // Moderate - Light Green
  if (speed < 15) return '#FFC107'; // Fresh - Yellow
  if (speed < 20) return '#FF9800'; // Strong - Orange
  if (speed < 25) return '#FF5722'; // Gale - Deep Orange
  return '#F44336'; // Storm - Red
}

// Add CSS for wind visualization
const style = document.createElement('style');
style.textContent = `
  .wind-arrow, .wind-barb {
    background: transparent !important;
    border: none !important;
    pointer-events: all;
    cursor: pointer;
  }

  .wind-arrow:hover, .wind-barb:hover {
    filter: brightness(1.2);
  }
`;
document.head.appendChild(style);
