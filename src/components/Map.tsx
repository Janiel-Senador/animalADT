import { type FC } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMapEvents } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import { REQUEST_COLORS, type RequestItem } from '../types';
import { Phone, Facebook, Mail, User } from 'lucide-react';

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
  const connections = items
    .filter(item => item.connectedTo)
    .map(source => {
      const target = items.find(i => i.id === source.connectedTo);
      if (target) {
        return {
          source,
          target,
          positions: [source.position, target.position] as [number, number][],
          color: REQUEST_COLORS[source.type]
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
            <div className="p-1 min-w-[200px]">
              <h3 className="font-bold text-lg capitalize mb-1 flex items-center gap-2" style={{ color: REQUEST_COLORS[item.type] }}>
                {item.type}
              </h3>
              
              {/* Title & Description (Generic or Generated) */}
              {item.title && <p className="font-semibold mb-1">{item.title}</p>}
              {item.description && <p className="text-sm text-gray-600 mb-2 italic">{item.description}</p>}

              {/* Specific Fields Display */}
              {item.type === 'food' && (
                <div className="text-sm mb-2 bg-violet-50 p-2 rounded">
                  <p><strong>Food:</strong> {item.foodType}</p>
                  <p><strong>Amount:</strong> {item.foodAmount}</p>
                </div>
              )}

              {item.type === 'donation' && item.ownerName && (
                 <div className="text-sm mb-2 flex items-center gap-1 text-gray-700">
                   <User size={14} /> <span>{item.ownerName}</span>
                 </div>
              )}

              {/* Contact Info Section */}
              {(item.contactNumber || item.facebook || item.email) && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs space-y-1">
                  <p className="font-semibold text-gray-500">Contact Info:</p>
                  
                  {item.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={12} className="text-gray-400" />
                      <span>{item.contactNumber}</span>
                    </div>
                  )}
                  
                  {item.facebook && (
                    <div className="flex items-center gap-2">
                      <Facebook size={12} className="text-blue-600" />
                      <a href={item.facebook.startsWith('http') ? item.facebook : `https://${item.facebook}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline truncate max-w-[150px]">
                        {item.facebook}
                      </a>
                    </div>
                  )}
                  
                  {item.email && (
                    <div className="flex items-center gap-2">
                      <Mail size={12} className="text-gray-400" />
                      <span>{item.email}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
