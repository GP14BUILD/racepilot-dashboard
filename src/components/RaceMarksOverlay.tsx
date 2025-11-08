import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';

export interface RaceMark {
  id: number;
  name: string;
  lat: number;
  lon: number;
  mark_type: 'start' | 'windward' | 'leeward' | 'offset' | 'gate' | 'finish';
  color: string;
  sequence: number;
  shape: 'circle' | 'triangle' | 'square' | 'pin';
}

interface RaceMarksOverlayProps {
  marks: RaceMark[];
  showLabels?: boolean;
  showSequence?: boolean;
}

export default function RaceMarksOverlay({
  marks,
  showLabels = true,
  showSequence = true
}: RaceMarksOverlayProps) {
  const map = useMap();

  useEffect(() => {
    if (!marks || marks.length === 0) return;

    const markersLayer = L.layerGroup();

    marks.forEach((mark) => {
      // Create custom icon based on mark type and shape
      const iconHtml = createMarkIcon(mark);

      const icon = L.divIcon({
        html: iconHtml,
        className: 'race-mark-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20],
      });

      // Create marker
      const marker = L.marker([mark.lat, mark.lon], { icon });

      // Add popup with mark details
      const popupContent = `
        <div style="padding: 8px; min-width: 150px;">
          <h3 style="margin: 0 0 8px 0; color: ${mark.color}; font-size: 16px;">
            ${mark.name}
          </h3>
          <p style="margin: 4px 0; font-size: 13px;">
            <strong>Type:</strong> ${mark.mark_type}
          </p>
          <p style="margin: 4px 0; font-size: 13px;">
            <strong>Sequence:</strong> ${mark.sequence}
          </p>
          <p style="margin: 4px 0; font-size: 12px; color: #666;">
            ${mark.lat.toFixed(6)}, ${mark.lon.toFixed(6)}
          </p>
        </div>
      `;
      marker.bindPopup(popupContent);

      // Add label if enabled
      if (showLabels) {
        const labelText = showSequence ? `${mark.sequence}. ${mark.name}` : mark.name;
        const label = L.tooltip({
          permanent: true,
          direction: 'top',
          className: 'race-mark-label',
          offset: [0, -25],
        }).setContent(labelText);
        marker.bindTooltip(label);
      }

      marker.addTo(markersLayer);
    });

    // Add connecting lines between marks in sequence
    if (marks.length > 1) {
      const sortedMarks = [...marks].sort((a, b) => a.sequence - b.sequence);
      const coursePoints = sortedMarks.map(m => [m.lat, m.lon] as [number, number]);

      const courseLine = L.polyline(coursePoints, {
        color: '#3B82F6',
        weight: 2,
        opacity: 0.6,
        dashArray: '5, 10',
      });
      courseLine.addTo(markersLayer);
    }

    markersLayer.addTo(map);

    // Cleanup
    return () => {
      map.removeLayer(markersLayer);
    };
  }, [map, marks, showLabels, showSequence]);

  return null;
}

/**
 * Create SVG icon for race mark based on type and shape
 */
function createMarkIcon(mark: RaceMark): string {
  const size = 40;
  const color = mark.color;

  let shape = '';

  switch (mark.shape) {
    case 'circle':
      shape = `<circle cx="${size/2}" cy="${size/2}" r="15" fill="${color}" stroke="#fff" stroke-width="3"/>`;
      break;
    case 'triangle':
      shape = `<polygon points="${size/2},8 32,32 8,32" fill="${color}" stroke="#fff" stroke-width="3"/>`;
      break;
    case 'square':
      shape = `<rect x="10" y="10" width="20" height="20" fill="${color}" stroke="#fff" stroke-width="3"/>`;
      break;
    case 'pin':
      // Pin shape (like a flag/buoy)
      shape = `
        <path d="M${size/2},10 L${size/2},35" stroke="${color}" stroke-width="3" fill="none"/>
        <circle cx="${size/2}" cy="10" r="8" fill="${color}" stroke="#fff" stroke-width="2"/>
      `;
      break;
  }

  // Add mark type indicator
  let typeIndicator = '';
  switch (mark.mark_type) {
    case 'start':
      typeIndicator = '<text x="20" y="25" text-anchor="middle" font-size="18" fill="#fff" font-weight="bold">S</text>';
      break;
    case 'finish':
      typeIndicator = '<text x="20" y="25" text-anchor="middle" font-size="18" fill="#fff" font-weight="bold">F</text>';
      break;
    case 'windward':
      typeIndicator = '<text x="20" y="25" text-anchor="middle" font-size="18" fill="#fff" font-weight="bold">↑</text>';
      break;
    case 'leeward':
      typeIndicator = '<text x="20" y="25" text-anchor="middle" font-size="18" fill="#fff" font-weight="bold">↓</text>';
      break;
  }

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow-${mark.id}" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" flood-opacity="0.3"/>
        </filter>
      </defs>
      <g filter="url(#shadow-${mark.id})">
        ${shape}
        ${typeIndicator}
      </g>
    </svg>
  `;
}

// Add CSS for mark labels
const style = document.createElement('style');
style.textContent = `
  .race-mark-label {
    background: rgba(0, 0, 0, 0.75) !important;
    border: none !important;
    color: #fff !important;
    font-weight: 600;
    font-size: 12px;
    padding: 4px 8px;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0,0,0,0.2);
  }

  .race-mark-label::before {
    border-top-color: rgba(0, 0, 0, 0.75) !important;
  }

  .race-mark-icon {
    background: transparent !important;
    border: none !important;
  }
`;
document.head.appendChild(style);
