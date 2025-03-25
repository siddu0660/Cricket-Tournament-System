const db = require("../config/db.js");

// Teams
function getAllTeams(tournamentId) {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM Team WHERE JSON_CONTAINS(tournamentsPlayed, ?)";
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
    const sql = "SELECT * FROM Matches WHERE tournamentId = ?";
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

//getPlayersStats
//getPlayerMatchStats
//getPlayerTournamentStats

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
    const sql = "SELECT * FROM Matches WHERE matchId = ?";
    db.query(sql, [matchId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}

//getMatchScoreCard
//getMatchStats




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

//getTeamMatches
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

const teamController = {
    getAllTeams,
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

module.exports = {
    teamController,
    venueController,
    tournamentController
};