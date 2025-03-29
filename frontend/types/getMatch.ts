export interface Match {
    matchId: number;
    tournamentId: number;
    team1Id: number;
    manOfTheMatchId: number;
    matchDate: Date;
    matchFormat: string;
    matchResult: string;
    team1Name: string;
    team2Id: number;
    team2Name: string;
    venueId: number;
    venueName: string;
    winnerId: number | null;
    matchStatus: string;
}