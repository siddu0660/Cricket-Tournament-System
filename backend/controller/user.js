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

function getMatchById(tournamentId,matchId) {
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
        WHERE M.tournamentId = ? AND M.matchId = ?
    `;
    db.query(sql, [tournamentId,matchId], (err, result) => {
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

function getAllSquads() {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Squad";
    db.query(sql, (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getSquadById(squadId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Squad WHERE squadId = ?";
    db.query(sql, [squadId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

function getSquadsByTournament(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM Squad WHERE tournamentId = ?";
    db.query(sql, [tournamentId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
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