export interface Tournament {
    tournamentId?: number;  // Optional since it's auto-generated
    tournamentName: string;
    startDate: string;
    endDate: string;
    tourLocation: string;
    numberOfTeams: number;
    teams: string[];  // Array of team names
    numberOfMatches: number;
    tourFormat: string;
    weightage: {
      win: number;
      draw: number;
      loss: number;
    };
    sponsorship: any[]; // You can make this more specific based on your needs
  } 