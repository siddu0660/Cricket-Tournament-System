const db = require("../config/db.js");

// TODO : Add all functions needed for the user frontend

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
  //Teams: Fetch their Team details using getTeambyId for every team id in teams json


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
  //getTeamStats
  //getTeamTournaments
  
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

  
  


  



  