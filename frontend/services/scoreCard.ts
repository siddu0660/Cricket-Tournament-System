import axios from 'axios';

interface MatchStatistics {
  matchStatisticsId: number;
  teamId: number;
  runsScored: number;
  oversPlayed: number;
  totalWickets: number;
  wides: number;
  noBalls: number;
}

interface TeamScores {
  team1Stats: MatchStatistics;
  team2Stats: MatchStatistics;
}

interface PlayerStats {
  playerMatchStatisticsId: number;
  matchStatisticsId: number;
  playerId: number;
  runsScored: number;
  ballsFaced: number;
  fours: number;
  sixes: number;
  oversBowled: number;
  battingStatus: string;
  runsConceded: number;
  maidens: number;
  wicketsTaken: number;
  catchesTaken: number;
  stumpingsTaken: number;
  Team1Name: string;
  Team2Name: string;
  matchId: number;
  teamId: number;
  playerFullName: string;
  playerTeamId: number;
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
  overs: number;
  maidens: number;
  runs: number;
  wickets: number;
  economy: number;
}

interface ScoreCardStats {
  firstInnings: {
    batting: BattingStats[];
    bowling: BowlingStats[];
  };
  secondInnings: {
    batting: BattingStats[];
    bowling: BowlingStats[];
  };
}

export async function getMatchStatistics(
  matchId: number,
  team1Id: number,
  team2Id: number
): Promise<TeamScores> {
  try {
    const [team1Response, team2Response] = await Promise.all([
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matchStatistics`, {
        matchId,
        teamId: team1Id,
      }),
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matchStatistics`, {
        matchId,
        teamId: team2Id,
      }),
    ]);
    console.log('Team 1 Statistics:', team1Response.data);
    console.log('Team 2 Statistics:', team2Response.data);
    

    return {
      team1Stats: team1Response.data,
      team2Stats: team2Response.data,
    };

  } catch (error) {
    console.error('Error fetching match statistics:', error);
    throw new Error('Failed to fetch match statistics');
  }
}

export async function getMatchScoreCard(
  matchId: number,
  team1Id: number,
  team2Id: number
): Promise<ScoreCardStats> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v2/matchScoreCard/${matchId}`
    );
    const playerStats: PlayerStats[] = response.data;

    // Find the minimum and maximum matchStatisticsId to determine innings
    const matchStatisticsIds = [...new Set(playerStats.map(stat => stat.matchStatisticsId))];
    const firstInningsId = Math.min(...matchStatisticsIds);
    const secondInningsId = Math.max(...matchStatisticsIds);

    const firstInnings = {
      batting: [] as BattingStats[],
      bowling: [] as BowlingStats[]
    };

    const secondInnings = {
      batting: [] as BattingStats[],
      bowling: [] as BowlingStats[]
    };

    // Process first innings
    const firstInningsStats = playerStats.filter(stat => stat.matchStatisticsId === firstInningsId);
    firstInningsStats.forEach(player => {
      if (player.playerTeamId === player.teamId) {
        // Player is batting
        firstInnings.batting.push({
          player: player.playerFullName,
          runs: player.runsScored,
          balls: player.ballsFaced,
          fours: player.fours,
          sixes: player.sixes,
          strikeRate: player.ballsFaced > 0 ? (player.runsScored / player.ballsFaced) * 100 : 0
        });
      } else {
        // Player is bowling
        firstInnings.bowling.push({
          player: player.playerFullName,
          overs: player.oversBowled,
          maidens: player.maidens,
          runs: player.runsConceded,
          wickets: player.wicketsTaken,
          economy: player.oversBowled > 0 ? player.runsConceded / player.oversBowled : 0
        });
      }
    });

    // Process second innings
    const secondInningsStats = playerStats.filter(stat => stat.matchStatisticsId === secondInningsId);
    secondInningsStats.forEach(player => {
      if (player.playerTeamId === player.teamId) {
        // Player is batting
        secondInnings.batting.push({
          player: player.playerFullName,
          runs: player.runsScored,
          balls: player.ballsFaced,
          fours: player.fours,
          sixes: player.sixes,
          strikeRate: player.ballsFaced > 0 ? (player.runsScored / player.ballsFaced) * 100 : 0
        });
      } else {
        // Player is bowling
        secondInnings.bowling.push({
          player: player.playerFullName,
          overs: player.oversBowled,
          maidens: player.maidens,
          runs: player.runsConceded,
          wickets: player.wicketsTaken,
          economy: player.oversBowled > 0 ? player.runsConceded / player.oversBowled : 0
        });
      }
    });

    return {
      firstInnings,
      secondInnings
    };

  } catch (error) {
    console.error('Error fetching match scorecard:', error);
    throw new Error('Failed to fetch match scorecard');
  }
}