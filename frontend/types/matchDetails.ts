export interface Match {
    id: number;
    tournament: {
      id: number;
      name: string;
    };
    team1: {
      id: number;
      name: string;
      score: string;
      overs: string;
    };
    team2: {
      id: number;
      name: string;
      score: string;
      overs: string;
    };
    date: string;
    time: string;
    venue: string;
    location: string;
    status: string;
    result: string;
    toss: {
      winner: string;
      decision: string;
    };
    umpires: string[];
    manOfTheMatch: {
      id: number;
      name: string;
      team: string;
      performance: string;
    };
    battingStats: {
      team1: BattingStats[];
      team2: BattingStats[];
    };
    bowlingStats: {
      team1: BowlingStats[];
      team2: BowlingStats[];
    };
  }
  
  interface BattingStats {
    player: string;
    runs: number;
    balls: number;
    fours: number;
    sixes: number;
    strikeRate: number;
  }
  
  interface BowlingStats {
    player: string;
    overs: string;
    maidens: number;
    runs: number;
    wickets: number;
    economy: number;
  }

  export interface MatchAPIResponse {
    matchId: number;
    tournamentId: number;
    tournamentName: string;
    team1Id: number;
    team1Name: string;
    team2Id: number;
    team2Name: string;
    venueId: number;
    venueName: string;
    matchDate: string;
    matchFormat: string;
    winnerId: number;
    matchResult: string;
    umpires: string[];
    manOfTheMatchId: number;
    manOfTheMatchName: string;
  }
  