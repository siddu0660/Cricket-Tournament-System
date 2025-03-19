export interface Tournament {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  venue: string;
  teamCount: number;
  format: string;
  status: 'active' | 'completed' | 'upcoming';
} 