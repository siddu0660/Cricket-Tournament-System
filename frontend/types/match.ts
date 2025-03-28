export interface Match {
  tournamentId: number;
  team1Id: number;
  team2Id: number;
  venueId: number;
  matchDate: string;
}

export interface MatchResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface MatchData {
  tournamentId: number;
  team1Id: number;
  team2Id: number;
  venueId: number;
  matchDate: Date;
} 