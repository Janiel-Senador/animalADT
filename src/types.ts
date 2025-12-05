export type RequestType = 'adoption' | 'food' | 'meetup' | 'donation';
export type PetType = 'Cat' | 'Dog' | 'Fish' | 'Bird' | 'Lizard' | 'Others';

export interface RequestItem {
  id: string;
  type: RequestType;
  position: [number, number];
  
  // Common Display Fields (Can be generated or manually entered for Meetup)
  title?: string; 
  description?: string;

  // Shared Contact Info
  contactNumber?: string;
  facebook?: string;
  email?: string;
  ownerName?: string; // "name" requested for Donation

  // Adoption Specific
  petType?: string; // Value from Dropdown or Input
  petName?: string;

  // Food Specific
  foodType?: string; // "wet, dry, treats"
  foodAmount?: string; // "kl of catfood"

  // Donation Specific
  donationReason?: string;

  connectedTo?: string; // ID of the connected item (e.g. Adoption -> Meetup)
}

export const REQUEST_COLORS: Record<RequestType, string> = {
  adoption: 'green',
  food: 'violet',
  meetup: 'yellow',
  donation: 'red',
};
