import { useState, type FormEvent, type FC } from 'react';
import { REQUEST_COLORS, type RequestType, type RequestItem } from '../types';
import { X } from 'lucide-react';

interface RequestFormProps {
  position: [number, number] | null;
  onClose: () => void;
  onSubmit: (data: Omit<RequestItem, 'id' | 'position'>) => void;
  existingItems: RequestItem[];
}

const RequestForm: FC<RequestFormProps> = ({ position, onClose, onSubmit, existingItems }) => {
  const [type, setType] = useState<RequestType>('adoption');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [connectedTo, setConnectedTo] = useState('');

  if (!position) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({
      type,
      title,
      description,
      connectedTo: connectedTo || undefined,
    });
    onClose();
  };

  // Filter meetup items for connection if type is adoption
  const availableMeetups = existingItems.filter(item => item.type === 'meetup');

  return (
    <div className="absolute top-4 right-4 z-[1000] bg-white p-6 rounded-lg shadow-xl w-80 max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">New Request</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select 
            value={type} 
            onChange={(e) => setType(e.target.value as RequestType)}
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="adoption">Adoption (Green)</option>
            <option value="food">Food Request (Violet)</option>
            <option value="meetup">Meetup (Yellow)</option>
            <option value="donation">Donation (Red)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="e.g., Cute Puppy, Dog Food Needed"
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            placeholder="Details about the request..."
            className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Connection Logic: If Adoption, allow connecting to a Meetup */}
        {type === 'adoption' && availableMeetups.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Connect to Meetup</label>
            <select
              value={connectedTo}
              onChange={(e) => setConnectedTo(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">-- Select a Meetup (Optional) --</option>
              {availableMeetups.map(meetup => (
                <option key={meetup.id} value={meetup.id}>
                  {meetup.title} (Distance: TBD)
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">This will draw a line on the map.</p>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            className="w-full text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity"
            style={{ backgroundColor: REQUEST_COLORS[type] }}
          >
            Add Request
          </button>
        </div>
        
        <div className="text-xs text-gray-500 mt-2">
          Selected Location: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
