export interface Tournament {
    tournamentId?: number;  
    tournamentName: string;
    startDate: string;
    endDate: string;
    tourLocation: string;
    numberOfTeams: number;
    teams: string[];  
    numberOfMatches: number;
    tourFormat: string;
    weightage: {
      win: number;
      draw: number;
      loss: number;
    };
    sponsorship: any[]; 
  } 