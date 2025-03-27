export interface Team {
  teamId: number;
  teamName: string;
  teamOwner: string;
  sinceYear: number;
  tournamentsPlayed: any[]; // or define a specific tournament interface
  coaches: any[]; // or define a specific coach interface
  matchesWon: number;
  matchesDrawn: number;
  matchesLost: number;
  noResultMatches: number;
  totalPoints: number;
} 