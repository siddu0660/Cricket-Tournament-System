export interface Squad {
  squadId: number;
  teamId: number;
  tournamentId: number;
  teamName: string;
  tournamentName: string;
  matchesWon: number;
  matchesLost: number;
  matchesDrawn: number;
  teamOwner: string;
  sinceYear: number;
  players: string[];
}

export interface SquadResponse {
  squads: Squad[];
} 