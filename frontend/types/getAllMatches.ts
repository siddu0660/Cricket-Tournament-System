export interface Match {
    matchId: number;
    tournamentId: number;
    team1Id: number;
    team2Id: number;
    team1Name: string;
    team2Name: string;
    venueName: string;
    venueId: number;
    tournamentName: string;
    manOfTheMatchId: number;
    manOfTheMatchName: string | null;
    matchDate: string;
    matchFormat: string;
    matchResult: string;
    umpires: string[];
    winnerId: number | null;
    scores?: {
      team1: string;
      team2: string;
    };
  }
  
  export interface MatchesResponse {
    data: Match[];
  }