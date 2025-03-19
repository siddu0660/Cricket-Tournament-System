export interface Match {
  id: string;
  tournamentId: string;
  tournamentName: string;
  team1: {
    id: string;
    name: string;
    shortName: string;
  };
  team2: {
    id: string;
    name: string;
    shortName: string;
  };
  venue: string;
  date: string;
  time: string;
  status: 'scheduled' | 'live' | 'completed';
} 