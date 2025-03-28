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
    const sql = "SELECT * FROM Matches";
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

//getMatchScoreCard
//getMatchStats

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
      } else {
        resolve(results);
      }
    });
  });
}

//getPlayersStats
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
            ? `${player.id}, ${player.name}`
            : `${playerId} - Unknown Player`;
        })
        .filter(Boolean),
    };
  } catch (error) {
    console.error(`Error in getSquadById for squad ${squadId}:`, error);
    throw error;
  }
}

// function getSquadsByTournament(tournamentId) {
//   return new Promise((resolve, reject) => {
//     const sql = "SELECT * FROM Squad WHERE tournamentId = ?";
//     db.query(sql, [tournamentId], (err, results) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(results);
//       }
//     });
//   });
// }

async function getSquadsByTournament(tournamentId) {
  try {
    const squadQuery = `
      SELECT s.*, t.teamName, tn.tournamentName, t.matchesWon, t.matchesLost, t.matchesDrawn
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

    if (squads.length === 0) return null;

    const squad = squads[0];

    try {
      squad.players =
        typeof squad.players === "string"
          ? JSON.parse(squad.players)
          : squad.players || [];
    } catch (parseError) {
      console.error(`Error parsing players for tournament ${tournamentId}:`, parseError);
      squad.players = [];
    }

    const playerIds = squad.players.filter(
      (playerId) => playerId && Number.isInteger(playerId)
    );

    if (playerIds.length === 0) {
      console.warn(`No valid player IDs found for tournament ${tournamentId}`);
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
            ? `${player.id}, ${player.name}`
            : `${playerId} - Unknown Player`;
        })
        .filter(Boolean),
    };
  } catch (error) {
    console.error(`Error in getSquadsByTournament for tournament ${tournamentId}:`, error);
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
    getSquadsByTournament
}

module.exports = {
    teamController,
    venueController,
    tournamentController,
    matchController,
    playerController,
    squadController
};