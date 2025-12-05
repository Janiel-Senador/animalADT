import { useState, type FormEvent, type FC } from 'react';
import { REQUEST_COLORS, type RequestType, type RequestItem, type PetType } from '../types';
import { X } from 'lucide-react';

interface RequestFormProps {
  position: [number, number] | null;
  onClose: () => void;
  onSubmit: (data: Omit<RequestItem, 'id' | 'position'>) => void;
  existingItems: RequestItem[];
}

const PET_TYPES: PetType[] = ['Cat', 'Dog', 'Fish', 'Bird', 'Lizard', 'Others'];

const RequestForm: FC<RequestFormProps> = ({ position, onClose, onSubmit, existingItems }) => {
  const [type, setType] = useState<RequestType>('adoption');
  
  // Generic Fields
  const [title, setTitle] = useState(''); // Only for Meetup
  const [description, setDescription] = useState(''); // Generic notes

  // Contact Info
  const [contactNumber, setContactNumber] = useState('');
  const [facebook, setFacebook] = useState('');
  const [email, setEmail] = useState('');
  const [ownerName, setOwnerName] = useState('');

  // Adoption/Specifics
  const [selectedPetType, setSelectedPetType] = useState<PetType>('Cat');
  const [customPetType, setCustomPetType] = useState('');
  const [petName, setPetName] = useState('');

  // Food Specifics
  const [foodType, setFoodType] = useState(''); // wet, dry, treats
  const [foodAmount, setFoodAmount] = useState('');

  // Donation Specifics
  const [donationReason, setDonationReason] = useState('');

  const [connectedTo, setConnectedTo] = useState('');

  if (!position) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    // Construct the data based on type
    const baseData = {
      type,
      connectedTo: connectedTo || undefined,
    };

    let specificData: Partial<RequestItem> = {};

    // Helper to get final pet type
    const finalPetType = selectedPetType === 'Others' ? customPetType : selectedPetType;

    switch (type) {
      case 'adoption':
        specificData = {
          petType: finalPetType,
          petName,
          contactNumber,
          facebook,
          email,
          title: `Adopt ${petName || 'Pet'}`, // Auto-generate title for display
          description: `${finalPetType} needs a home.`,
        };
        break;
      case 'food':
        specificData = {
          petType: finalPetType, // "Kind of pet"
          foodType,
          foodAmount,
          contactNumber,
          facebook,
          email,
          title: `Food Request: ${finalPetType}`,
          description: `${foodAmount} of ${foodType} needed.`,
        };
        break;
      case 'donation':
        specificData = {
          petType: finalPetType, // "Kind of pet"
          petName,
          ownerName,
          donationReason,
          contactNumber,
          facebook,
          email,
          title: `Donation: ${petName}`,
          description: donationReason,
        };
        break;
      case 'meetup':
        specificData = {
          title,
          description,
        };
        break;
    }

    onSubmit({
      ...baseData,
      ...specificData,
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
        {/* Type Selector */}
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

        {/* --- DYNAMIC FIELDS BASED ON TYPE --- */}

        {/* 1. MEETUP: Keep original Title/Description */}
        {type === 'meetup' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meetup Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g., Central Plaza Meetup"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={3}
                placeholder="Meetup details..."
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </>
        )}

        {/* 2. ADOPTION, FOOD, DONATION: Pet Type Selector */}
        {['adoption', 'food', 'donation'].includes(type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kind of Pet</label>
            <select
              value={selectedPetType}
              onChange={(e) => setSelectedPetType(e.target.value as PetType)}
              className="w-full border border-gray-300 rounded-md p-2 mb-2"
            >
              {PET_TYPES.map(pt => (
                <option key={pt} value={pt}>{pt}</option>
              ))}
            </select>
            {selectedPetType === 'Others' && (
              <input
                type="text"
                value={customPetType}
                onChange={(e) => setCustomPetType(e.target.value)}
                required
                placeholder="Specify pet type..."
                className="w-full border border-gray-300 rounded-md p-2"
              />
            )}
          </div>
        )}

        {/* 3. ADOPTION & DONATION: Pet Name */}
        {['adoption', 'donation'].includes(type) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Pet Name</label>
            <input
              type="text"
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              required
              placeholder="Pet's Name"
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
        )}

        {/* 4. FOOD: Specifics */}
        {type === 'food' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Food Type</label>
              <input
                type="text"
                value={foodType}
                onChange={(e) => setFoodType(e.target.value)}
                required
                placeholder="e.g. Wet, Dry, Treats"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Amount (kg/qty)</label>
              <input
                type="text"
                value={foodAmount}
                onChange={(e) => setFoodAmount(e.target.value)}
                required
                placeholder="e.g. 2kg"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </>
        )}

        {/* 5. DONATION: Specifics */}
        {type === 'donation' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
              <input
                type="text"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                required
                placeholder="Full Name"
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Donation</label>
              <textarea
                value={donationReason}
                onChange={(e) => setDonationReason(e.target.value)}
                required
                rows={3}
                placeholder="Medical condition, injury, etc."
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </>
        )}

        {/* 6. COMMON CONTACT INFO (Adoption, Food, Donation) */}
        {['adoption', 'food', 'donation'].includes(type) && (
          <div className="bg-gray-50 p-3 rounded-md border border-gray-200 space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm">Contact Details</h3>
            
            <div>
              <label className="block text-xs font-medium text-gray-600">Contact Number</label>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                required
                placeholder="0912..."
                className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Facebook Name/URL</label>
              <input
                type="text"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                required
                placeholder="fb.com/..."
                className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="example@gmail.com"
                className="w-full border border-gray-300 rounded-md p-1.5 text-sm"
              />
            </div>
          </div>
        )}

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
                  {meetup.title}
                </option>
              ))}
            </select>
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
          Location: {position[0].toFixed(4)}, {position[1].toFixed(4)}
        </div>
      </form>
    </div>
  );
};

export default RequestForm;
