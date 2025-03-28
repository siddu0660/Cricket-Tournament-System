export interface Team {
    teamId: number;
    teamName: string;
    tournamentId?: number;
  }
  
  export interface TournamentTeam {
    tournamentId: number;
    tournamentName: string;
    teams: Team[];
  }
  
  export interface Fixture {
    fixtureId: string;
    groupNumber: number;
    team1: Team;
    team2: Team;
    venueId: string | number;
    matchDate: string;
    matchStatus: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
    tournamentId: number;
    matchResult: any | null;
  } 