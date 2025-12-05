import { useState } from 'react';
import MapComponent from './components/Map';
import RequestForm from './components/RequestForm';
import type { RequestItem } from './types';
import { Heart } from 'lucide-react';

// Mock Data
const INITIAL_ITEMS: RequestItem[] = [
  {
    id: '1',
    type: 'meetup',
    position: [10.3180, 123.9050], // Near Ayala
    title: 'Ayala Center Meetup Point',
    description: 'Safe meetup spot for adoptions.',
  },
  {
    id: '2',
    type: 'adoption',
    position: [10.3500, 123.9000], // IT Park area roughly
    title: 'Golden Retriever Puppy',
    description: '3 months old, needs a loving home.',
    connectedTo: '1' // Connected to Ayala Meetup
  },
  {
    id: '3',
    type: 'food',
    position: [10.2900, 123.8800], // Downtown area
    title: 'Cat Food Needed',
    description: 'Stray cats in Carbon market need food.',
  },
  {
    id: '4',
    type: 'donation',
    position: [10.3300, 123.9200], // Mandaue area
    title: 'Emergency Vet Bill',
    description: 'Dog with broken leg needs surgery.',
  }
];

function App() {
  const [items, setItems] = useState<RequestItem[]>(INITIAL_ITEMS);
  const [selectedPosition, setSelectedPosition] = useState<[number, number] | null>(null);
  const [showForm, setShowForm] = useState(false);

  const handleMapClick = (position: [number, number]) => {
    setSelectedPosition(position);
    setShowForm(true);
  };

  const handleAddItem = (data: Omit<RequestItem, 'id' | 'position'>) => {
    if (!selectedPosition) return;
    
    const newItem: RequestItem = {
      id: Date.now().toString(),
      position: selectedPosition,
      ...data
    };
    
    setItems(prev => [...prev, newItem]);
    setShowForm(false);
    setSelectedPosition(null);
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
        
        {/* Instructions Overlay */}
        <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-sm p-4 rounded-lg shadow-lg z-[500] max-w-xs">
          <h3 className="font-bold text-gray-800 mb-2">How to use:</h3>
          <ul className="text-sm text-gray-600 space-y-1 list-disc pl-4">
            <li>Click anywhere on the map to add a request.</li>
            <li>Green lines connect Adoptions to Meetup points.</li>
            <li>Explore pins to help pets in Cebu!</li>
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
