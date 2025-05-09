const db = require("../config/db.js");

// Teams

function getAllTeams() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Team";
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getTeamsByTournament(tournamentId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Team WHERE JSON_CONTAINS(tournamentsPlayed, JSON_ARRAY(?))";
        db.query(sql, [tournamentId], (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
        });
    });
}

function getTeamById(teamId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Team WHERE teamId = ?";
        db.query(sql, [teamId], (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[0]);
        }
        });
    });
}

function getTournamentsByTeam(teamId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Tournament WHERE JSON_CONTAINS(teamsPlayed, ?)";
        db.query(sql, [teamId], (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
        });
    });
}

// ----------------------------------------------------------- //

// Venues

function getVenueById(venueId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Venue WHERE venueId = ?";
        db.query(sql, [venueId], (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[0]);
        }
        });
    });
}

function getAllVenues() {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Venue";
        db.query(sql, (err, results) => {
        if (err) {
            reject(err);
        } else {
            resolve(results);
        }
        });
    });
}

function checkVenueAvailability(venueId, date) {
    return new Promise((resolve, reject) => {
        const sql = `
                SELECT COUNT(*) as matchCount 
                FROM Matches 
                WHERE venueId = ? AND matchDate = ?
            `;

        db.query(sql, [venueId, date], (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result[0].matchCount === 0);
        }
        });
    });
}

// ----------------------------------------------------------- //

// Tournaments
function getAllTournaments() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Tournament";
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getTournamentById(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Tournament WHERE tournamentId = ?";
    db.query(sql, [tournamentId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function getMatchesByTournament(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        M.*,
        Team1.teamName AS team1Name,
        Team2.teamName AS team2Name,
        V.venueName
      FROM Matches M
      INNER JOIN Team Team1 ON M.team1Id = Team1.teamId
      INNER JOIN Team Team2 ON M.team2Id = Team2.teamId
      INNER JOIN Venue V ON M.venueId = V.venueId
      WHERE M.tournamentId = ?
    `;

    db.query(sql, [tournamentId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//getTournamentStandings
//getTournamentStatistics

// ----------------------------------------------------------- //

// Matches

function getAllMatches() {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        M.*,
        Team1.teamName AS team1Name,
        Team2.teamName AS team2Name,
        V.venueName,
        T.tournamentName,
        CONCAT(P.firstName, ' ', P.secondName) AS manOfTheMatchName
        FROM Matches M
        INNER JOIN Team Team1 ON M.team1Id = Team1.teamId
        INNER JOIN Team Team2 ON M.team2Id = Team2.teamId
        INNER JOIN Venue V ON M.venueId = V.venueId
        INNER JOIN Tournament T ON T.tournamentId = M.tournamentId
        LEFT JOIN Player P ON M.manOfTheMatchId = P.playerId
    `;
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getMatchById(matchId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
        M.*,
        Team1.teamName AS team1Name,
        Team2.teamName AS team2Name,
        V.venueName,
        T.tournamentName,
        CONCAT(P.firstName, ' ', P.secondName) AS manOfTheMatchName
        FROM Matches M
        INNER JOIN Team Team1 ON M.team1Id = Team1.teamId
        INNER JOIN Team Team2 ON M.team2Id = Team2.teamId
        INNER JOIN Venue V ON M.venueId = V.venueId
        INNER JOIN Tournament T ON T.tournamentId = M.tournamentId
        LEFT JOIN Player P ON M.manOfTheMatchId = P.playerId
        WHERE M.matchId = ?
    `;
    db.query(sql, [matchId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function getMatchesByTeam(teamId, tournamentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT * FROM Matches WHERE (team1Id = ? OR team2Id = ?) AND tournamentId = ?";
    db.query(sql, [teamId, teamId, tournamentId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getTeamIdBySquadByPlayerId(playerId) {
  let squadId;
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT teamId 
      FROM Squad 
      WHERE JSON_CONTAINS(players, ?)
    `;
    db.query(sql, [JSON.stringify(playerId)], (err, results) => {
      if (err) {
        reject(err);
      } else {
        if (results.length > 0) {
          resolve(results[0].teamId);
        } else {
          resolve(null); 
        }
      }
    });
  });
}

function getMatchStatsId(matchId, teamId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
          ms.*,
          t1.TeamName AS Team1Name,
          t2.TeamName AS Team2Name
      FROM 
          MatchStatistics ms
      INNER JOIN 
          Matches m ON m.matchId = ms.matchId
      INNER JOIN 
          Team t1 ON m.team1Id = t1.TeamID
      INNER JOIN 
          Team t2 ON m.team2Id = t2.TeamID
      WHERE 
          ms.matchId = ? AND ms.teamId = ?
    `;
    db.query(sql, [matchId, teamId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function getMatchScoreCard(matchId, callback) {
  db.query(
    "SELECT team1Id, team2Id FROM Matches WHERE matchId = ?",
    [matchId],
    (err, matchResults) => {
      if (err) return callback(err);
      if (matchResults.length === 0)
        return callback(new Error("Match not found"));

      const team1Id = matchResults[0].team1Id;
      const team2Id = matchResults[0].team2Id;

      const sql = `
        WITH CombinedMS AS (
          (
              SELECT 
                  ms.*,
                  t1.TeamName AS Team1Name,
                  t2.TeamName AS Team2Name
              FROM 
                  MatchStatistics ms
              INNER JOIN Matches m ON m.matchId = ms.matchId
              INNER JOIN Team t1 ON m.team1Id = t1.TeamID
              INNER JOIN Team t2 ON m.team2Id = t2.TeamID
              WHERE 
                  ms.matchId = ? AND ms.teamId = ?
          )
          UNION
          (
              SELECT 
                  ms.*,
                  t1.TeamName AS Team1Name,
                  t2.TeamName AS Team2Name
              FROM 
                  MatchStatistics ms
              INNER JOIN Matches m ON m.matchId = ms.matchId
              INNER JOIN Team t1 ON m.team1Id = t1.TeamID
              INNER JOIN Team t2 ON m.team2Id = t2.TeamID
              WHERE 
                  ms.matchId = ? AND ms.teamId = ?
          )
        )

        SELECT 
            PMS.*,
            CMS.Team1Name,
            CMS.Team2Name,
            CMS.matchId,
            CMS.teamId,
            CONCAT(p.firstName, ' ', p.secondName) AS playerFullName
        FROM 
            CombinedMS CMS
        INNER JOIN 
            PlayerMatchStatistics PMS 
            ON CMS.matchStatisticsId = PMS.matchStatisticsId
        INNER JOIN 
            Player p 
            ON PMS.playerId = p.playerId
        ORDER BY 
            CMS.teamId, PMS.playerId;
      `;

      db.query(
        sql,
        [matchId, team1Id, matchId, team2Id],
        (err, playerStats) => {
          if (err) return callback(err);

          const processedPlayers = [];
          let processedCount = 0;

          const processPlayer = (index) => {
            if (index >= playerStats.length) {
              return callback(null, processedPlayers);
            }

            const player = playerStats[index];

            getTeamIdBySquadByPlayerId(player.playerId)
              .then((teamId) => {
                processedPlayers.push({
                  ...player,
                  playerTeamId: teamId,
                });
                processedCount++;
                processPlayer(processedCount);
              })
              .catch((err) => callback(err));
          };

          processPlayer(0);
        }
      );
    }
  );
}

// ----------------------------------------------------------- //

// Players
function getPlayerById(playerId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Player WHERE playerId = ?";
    db.query(sql, [playerId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function getAllPlayers() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Player";
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getPlayersByTeam(teamId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Player WHERE JSON_CONTAINS(teamsPlayed, ?)";
    db.query(sql, [JSON.stringify(teamId)], (err, results) => {
      if (err) {
        reject(err);
      } else if (results.length === 0) {
        resolve({ message: "No Players in the Team" });
      } else {
        resolve(results);
      }
    });
  });
}

function getSquadIdByTeamAndTournament(teamId, tournamentId) {
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT squadId FROM Squad WHERE teamId = ? AND tournamentId = ?";
    db.query( sql, [teamId,tournamentId], (err, results) => {
        if (err) {
          reject(err);
        } else if (results.length > 0) {
          const squadId = results[0].squadId;
          resolve(squadId);
        } else {
          resolve(null);
        }
      }
    );
  });
}

async function getPlayersBySquad(teamId, tournamentId) {
  try {
    const squadId = await getSquadIdByTeamAndTournament(teamId, tournamentId);

    if (!squadId) {
      return null;
    }

    const squadDetails = await getSquadById(squadId);
    return squadDetails.players;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}

//getPlayersStats
function getPlayerStatsByTournament(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
          ps.*, 
          CONCAT(p.firstName, ' ', p.secondName) AS playerName, 
          p.playerId
      FROM 
          PlayerStats ps
      INNER JOIN 
          Player p ON ps.playerId = p.playerId
      WHERE 
          ps.tournamentId = ?;
    `;

    db.query(sql, [tournamentId], async (err, results) => {
      if (err) {
        reject(err);
      } else {
        const enrichedResults = [];
        for (const player of results) {
          try {
            const teamId = await getTeamIdBySquadByPlayerId(player.playerId);

            if (teamId) {
              const teamSql = `SELECT teamName FROM Team WHERE teamID = ?`;
              const [teamResult] = await db.promise().query(teamSql, [teamId]);

              const teamName =
                teamResult.length > 0 ? teamResult[0].teamName : null;

              enrichedResults.push({
                ...player,
                teamName: teamName,
              });
            } else {
              enrichedResults.push({
                ...player,
                teamName: null,
              });
            }
          } catch (error) {
            reject(error);
          }
        }
        resolve(enrichedResults);
      }
    });
  });
}

function getPointsTable(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT 
          t.teamId,
          t.teamName,
          COUNT(CASE WHEN m.winnerId = t.teamId THEN 1 ELSE NULL END) AS matchesWon,
          COUNT(CASE WHEN m.winnerId != t.teamId AND m.winnerId IN (m.team1Id, m.team2Id) THEN 1 ELSE NULL END) AS matchesLost,
          COUNT(CASE WHEN m.winnerId = 0 THEN 1 ELSE NULL END) AS matchesDrawn,
          COUNT(CASE WHEN m.winnerId = -1 THEN 1 ELSE NULL END) AS noResultMatches,
          COUNT(m.matchId) AS totalMatchesPlayed,
          SUM(CASE 
              WHEN m.winnerId = t.teamId THEN 2
              WHEN m.winnerId = 0 THEN 1
              ELSE 0 
          END) AS totalPoints
      FROM 
          Team t
      LEFT JOIN 
          Matches m ON (m.team1Id = t.teamId OR m.team2Id = t.teamId)
      WHERE 
          m.tournamentId = ?
      GROUP BY 
          t.teamId, t.teamName
      ORDER BY 
          totalPoints DESC, matchesWon DESC;
    `;

    db.query(sql, [tournamentId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

//getPlayerMatchStats
//getPlayerTournamentStats

// -------------------------------- //

// Squads

async function getAllSquads() {
  try {
    const squadQuery = `
      SELECT s.*, t.teamName, tn.tournamentName, t.matchesWon, t.matchesLost, t.matchesDrawn
      FROM Squad s
      JOIN Team t ON s.teamId = t.teamId
      JOIN Tournament tn ON s.tournamentId = tn.tournamentId
    `;

    const squads = await new Promise((resolve, reject) => {
      db.query(squadQuery, (err, results) => {
        err ? reject(err) : resolve(results);
      });
    });

    squads.forEach((squad) => {
      try {
        squad.players =
          typeof squad.players === "string"
            ? JSON.parse(squad.players)
            : squad.players || [];
      } catch (parseError) {
        console.error(
          `Error parsing players for squad ${squad.squadId}:`,
          parseError
        );
        squad.players = [];
      }
    });

    const playerIds = [
      ...new Set(
        squads
          .flatMap((squad) => squad.players)
          .filter((playerId) => playerId && Number.isInteger(playerId))
      ),
    ];

    if (playerIds.length === 0) {
      console.warn("No valid player IDs found");
      return squads;
    }

    const players = await new Promise((resolve, reject) => {
      db.query(
          `SELECT playerId AS id, CONCAT(firstName, ' ', secondName) AS name 
          FROM Player 
          WHERE playerId IN (?)`,
        [playerIds],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    const playerMap = new Map(players.map((p) => [p.id, p]));

    return squads.map((squad) => ({
      squadId: squad.squadId,
      teamId: squad.teamId,
      tournamentId: squad.tournamentId,
      teamName: squad.teamName,
      tournamentName: squad.tournamentName,
      matchesWon: squad.matchesWon,
      matchesLost: squad.matchesLost,
      matchesDrawn: squad.matchesDrawn,
      players: squad.players
        .map((playerId) => {
          const player = playerMap.get(playerId);
          return player
            ? { id: player.id, name: player.name, squadId: squad.squadId }
            : { id: playerId, name: "Unknown Player", squadId: squad.squadId };
        })
        .filter(Boolean),
    }));
  } catch (error) {
    console.error("Error in getAllSquads:", error);
    throw error;
  }
}

async function getSquadById(squadId) {
  try {
    const squadQuery = `
      SELECT s.*, t.teamName, tn.tournamentName, t.matchesWon, t.matchesLost, t.matchesDrawn
      FROM Squad s
      JOIN Team t ON s.teamId = t.teamId
      JOIN Tournament tn ON s.tournamentId = tn.tournamentId
      WHERE s.squadId = ?
    `;

    const squads = await new Promise((resolve, reject) => {
      db.query(squadQuery, [squadId], (err, results) => {
        err ? reject(err) : resolve(results);
      });
    });

    if (squads.length === 0) return null;

    const squad = squads[0];

    try {
      squad.players =
        typeof squad.players === "string"
          ? JSON.parse(squad.players)
          : squad.players || [];
    } catch (parseError) {
      console.error(`Error parsing players for squad ${squadId}:`, parseError);
      squad.players = [];
    }

    const playerIds = squad.players.filter(
      (playerId) => playerId && Number.isInteger(playerId)
    );

    if (playerIds.length === 0) {
      console.warn(`No valid player IDs found for squad ${squadId}`);
      return {
        squadId: squad.squadId,
        teamId: squad.teamId,
        tournamentId: squad.tournamentId,
        teamName: squad.teamName,
        tournamentName: squad.tournamentName,
        matchesWon: squad.matchesWon,
        matchesLost: squad.matchesLost,
        matchesDrawn: squad.matchesDrawn,
        players: [],
      };
    }

    const players = await new Promise((resolve, reject) => {
      db.query(
          `SELECT playerId AS id, CONCAT(firstName, ' ', secondName) AS name 
          FROM Player 
          WHERE playerId IN (?)`,
        [playerIds],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    const playerMap = new Map(players.map((p) => [p.id, p]));

    return {
      squadId: squad.squadId,
      teamId: squad.teamId,
      tournamentId: squad.tournamentId,
      teamName: squad.teamName,
      tournamentName: squad.tournamentName,
      matchesWon: squad.matchesWon,
      matchesLost: squad.matchesLost,
      matchesDrawn: squad.matchesDrawn,
      players: squad.players
        .map((playerId) => {
          const player = playerMap.get(playerId);
          return player
            ? { id: player.id, name: player.name, teamId: squad.teamId }
            : { id: playerId, name: "Unknown Player", teamId: squad.squadId };
        })
        .filter(Boolean),
    };
  } catch (error) {
    console.error(`Error in getSquadById for squad ${squadId}:`, error);
    throw error;
  }
}

async function getSquadsByTournament(tournamentId) {
  try {
    const squadQuery = `
      SELECT s.*, t.teamName, tn.tournamentName, t.matchesWon, t.matchesLost, t.matchesDrawn, t.sinceYear, t.teamOwner
      FROM Squad s
      JOIN Team t ON s.teamId = t.teamId
      JOIN Tournament tn ON s.tournamentId = tn.tournamentId
      WHERE s.tournamentId = ? 
    `;

    const squads = await new Promise((resolve, reject) => {
      db.query(squadQuery, [tournamentId], (err, results) => {
        err ? reject(err) : resolve(results);
      });
    });

    squads.forEach((squad) => {
      try {
        squad.players =
          typeof squad.players === "string"
            ? JSON.parse(squad.players)
            : squad.players || [];
      } catch (parseError) {
        console.error(
          `Error parsing players for squad ${squad.squadId}:`,
          parseError
        );
        squad.players = [];
      }
    });

    const playerIds = [
      ...new Set(
        squads
          .flatMap((squad) => squad.players)
          .filter((playerId) => playerId && Number.isInteger(playerId))
      ),
    ];

    if (playerIds.length === 0) {
      console.warn("No valid player IDs found");
      return squads;
    }

    const players = await new Promise((resolve, reject) => {
      db.query(
        `SELECT playerId AS id, CONCAT(firstName, ' ', secondName) AS name 
          FROM Player 
          WHERE playerId IN (?)`,
        [playerIds],
        (err, results) => (err ? reject(err) : resolve(results))
      );
    });

    const playerMap = new Map(players.map((p) => [p.id, p]));

    return squads.map((squad) => ({
      squadId: squad.squadId,
      teamId: squad.teamId,
      tournamentId: squad.tournamentId,
      teamName: squad.teamName,
      tournamentName: squad.tournamentName,
      matchesWon: squad.matchesWon,
      matchesLost: squad.matchesLost,
      matchesDrawn: squad.matchesDrawn,
      sinceYear: squad.sinceYear,
      teamOwner: squad.teamOwner,
      players: squad.players
        .map((playerId) => {
          const player = playerMap.get(playerId);
          return player
            ? `${player.id}, ${player.name}`
            : `${playerId} - Unknown Player`;
        })
        .filter(Boolean),
    }));
  } catch (error) {
    console.error("Error in getAllSquads:", error);
    throw error;
  }
}

const teamController = {
    getAllTeams,
    getTeamsByTournament,
    getTeamById,
    getTournamentsByTeam,
};

const venueController = {
    getAllVenues,
    getVenueById,
    checkVenueAvailability
}

const tournamentController = {
    getAllTournaments,
    getTournamentById,
    getMatchesByTournament
}

const matchController = {
    getAllMatches,
    getMatchById,
    getMatchesByTeam
}

const playerController = {
    getPlayerById,
    getAllPlayers,
    getPlayersByTeam
}

const squadController = {
    getAllSquads,
    getSquadById,
    getSquadsByTournament,
    getPlayersBySquad
}

const statisticsController = {
    getMatchStatsId,
    getMatchScoreCard,
    getPlayerStatsByTournament,
    getPointsTable
}

module.exports = {
    teamController,
    venueController,
    tournamentController,
    matchController,
    playerController,
    squadController,
    statisticsController
};