export type RequestType = 'adoption' | 'food' | 'meetup' | 'donation';

export interface RequestItem {
  id: string;
  type: RequestType;
  position: [number, number];
  title: string;
  description: string;
  connectedTo?: string; // ID of the connected item (e.g. Adoption -> Meetup)
}

export const REQUEST_COLORS: Record<RequestType, string> = {
  adoption: 'green',
  food: 'violet',
  meetup: 'yellow',
  donation: 'red',
};
