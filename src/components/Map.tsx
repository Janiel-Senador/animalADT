import { type FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { REQUEST_COLORS, type RequestItem } from '../types';

// Fix for default marker icons in Leaflet with React
import 'leaflet/dist/leaflet.css';

// Center of Cebu
const CEBU_CENTER: [number, number] = [10.3157, 123.8854];

interface MapProps {
  items: RequestItem[];
  onMapClick: (position: [number, number]) => void;
}

// Component to handle map clicks
const MapEvents = ({ onClick }: { onClick: (pos: [number, number]) => void }) => {
  useMapEvents({
    click(e) {
      onClick([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
};

// Custom Icon generator
const createCustomIcon = (color: string) => {
  return new DivIcon({
    className: 'custom-pin',
    html: `<div style="
      background-color: ${color};
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div>
    </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const MapComponent: FC<MapProps> = ({ items, onMapClick }) => {
  // Filter for connections (Adoption -> Meetup)
  // We need to find items that have a 'connectedTo' property
  const connections = items
    .filter(item => item.connectedTo)
    .map(source => {
      const target = items.find(i => i.id === source.connectedTo);
      if (target) {
        return {
          source,
          target,
          positions: [source.position, target.position] as [number, number][],
          color: REQUEST_COLORS[source.type] // Color of the source (e.g., green for adoption)
        };
      }
      return null;
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  return (
    <MapContainer 
      center={CEBU_CENTER} 
      zoom={11} 
      style={{ height: '100%', width: '100%' }}
      maxBounds={[
        [9.4, 123.2], // South West of Cebu
        [11.4, 124.6]  // North East of Cebu
      ]}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapEvents onClick={onMapClick} />

      {/* Render Polylines for connections */}
      {connections.map((conn, idx) => (
        <Polyline 
          key={`conn-${idx}`} 
          positions={conn.positions} 
          pathOptions={{ color: conn.color, weight: 3, dashArray: '5, 10' }} 
        />
      ))}

      {/* Render Markers */}
      {items.map(item => (
        <Marker 
          key={item.id} 
          position={item.position}
          icon={createCustomIcon(REQUEST_COLORS[item.type])}
        >
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-lg capitalize mb-1" style={{ color: REQUEST_COLORS[item.type] }}>
                {item.type}
              </h3>
              <p className="font-semibold">{item.title}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
