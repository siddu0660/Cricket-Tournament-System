interface PlayerStats {
    matches: number | null;
    runs: number | null;
    wickets: number | null;
    highestScore: number | null;
    bestBowling: string | null;
  }
  
  export interface Player {
    playerId?: string | number;
    firstName: string;
    secondName: string;
    dateOfBirth: string;
    jerseyNumber: string | number;
    playerRole: string;
    battingStyle: string;
    bowlingStyle: string;
    gender: boolean;
    nationality: string;
    teamsPlayed: string[];
    stats?: PlayerStats;  
  }