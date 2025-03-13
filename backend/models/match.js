function addMatch(tournamentId, data) {
  return new Promise((resolve, reject) => {
    const sql = `
            INSERT INTO Matches
            (tournamentId, team1Id, team2Id, venueId, matchDate, matchStartTime, matchFormat, tossWinnerTeam1, tossDecision, umpires)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      tournamentId,
      data.team1Id,
      data.team2Id,
      data.venueId,
      data.matchDate,
      data.matchStartTime,
      data.matchFormat,
      data.tossWinnerTeam1,
      data.tossDecision,
      JSON.stringify(data.umpires),
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
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

function updateMatch(matchId, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length === 0) {
      return reject(new Error("No fields to update"));
    }

    let fields = [];
    let values = [];

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === "umpires" ? JSON.stringify(data[key]) : data[key]);
      }
    }

    values.push(matchId);

    const sql = `UPDATE Matches SET ${fields.join(", ")} WHERE matchId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteMatch(matchId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Matches WHERE matchId = ?";
    db.query(sql, [matchId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

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

function updateMatchResult(matchId, data) {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE Matches 
      SET winnerId = ?, matchResult = ?, matchEndTime = ?, manOfTheMatchId = ? 
      WHERE matchId = ?
    `;

    const values = [
      data.winnerId,
      data.matchResult,
      data.matchEndTime,
      data.manOfTheMatchId,
      matchId,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        updateTeamStatistics(data.winnerId, data.team1Id, data.team2Id)
          .then(() => resolve(result))
          .catch((err) => reject(err));
      }
    });
  });
}