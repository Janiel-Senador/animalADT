import { useState, useEffect } from 'react';
import MapComponent from './components/Map';
import RequestForm from './components/RequestForm';
import type { RequestItem } from './types';
import { Heart } from 'lucide-react';

function App() {
  const [items, setItems] = useState<RequestItem[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data from API
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/requests');
        if (!response.ok) throw new Error('Failed to fetch');
        const data = await response.json();
        
        // Transform DB data (lat/lng) back to frontend format (position array)
        const formattedItems = data.map((item: any) => ({
          ...item,
          position: [item.lat, item.lng],
        }));
        
        setItems(formattedItems);
      } catch (error) {
        console.error('Error fetching requests:', error);
        // Fallback to empty or keep mock data logic if desired
      } finally {
        setIsLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleMapClick = (position: [number, number]) => {
    setSelectedPosition(position);
    setShowForm(true);
  };

  const handleAddItem = async (data: Omit<RequestItem, 'id' | 'position'>) => {
    if (!selectedPosition) return;

    const payload = {
      ...data,
      position: selectedPosition,
    };

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const savedItem = await response.json();
        // Update local state immediately
        const newItem: RequestItem = {
          ...savedItem,
          position: [savedItem.lat, savedItem.lng],
        };
        setItems(prev => [...prev, newItem]);
        setShowForm(false);
        setSelectedPosition(null);
      }
    } catch (error) {
      console.error('Error saving request:', error);
      alert('Failed to save request. Please try again.');
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col relative overflow-hidden">
      {/* Header */}
      <header className="bg-white shadow-md p-4 z-10 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="bg-blue-600 p-2 rounded-full">
            <Heart className="text-white w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-blue-800">Cebu Animal Hub</h1>
        </div>
        <div className="flex space-x-4 text-sm font-medium">
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span> Adoption</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></span> Meetup</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-violet-500 mr-1"></span> Food</div>
          <div className="flex items-center"><span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span> Donation</div>
        </div>
      </header>

      {/* Map Area */}
      <div className="flex-1 relative z-0">
        <MapComponent 
          items={items} 
          onMapClick={handleMapClick} 
        />
        
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow-lg z-[1000]">
            Loading data...
          </div>
        )}

        {/* Instructions Overlay */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[500] max-w-xs">
          <h3 className="font-bold text-gray-800 mb-2">How to use:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
            <li>Click map to add request.</li>
            <li>Green: Adoption (Connect to Meetup!)</li>
            <li>Violet: Food Request</li>
            <li>Red: Donation/Medical</li>
            <li>Yellow: Meetup Points</li>
          </ul>
        </div>
      </div>

      {/* Request Form Modal/Overlay */}
      {showForm && (
        <RequestForm 
          position={selectedPosition} 
          onClose={() => {
            setShowForm(false);
            setSelectedPosition(null);
          }}
          onSubmit={handleAddItem}
          existingItems={items}
        />
      )}
    </div>
  );
}

export default App;
