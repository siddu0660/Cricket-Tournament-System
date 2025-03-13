function addMatchStatistics(data) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO MatchStatistics 
      (matchId, teamId, runsScored, oversPlayed, totalWickets, wides, noBalls, byes, legByes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.matchId,
      data.teamId,
      data.runsScored,
      data.oversPlayed,
      data.totalWickets,
      data.wides || 0,
      data.noBalls || 0,
      data.byes || 0,
      data.legByes || 0,
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

function updateMatchStatistics(matchStatisticsId, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length === 0) {
      return reject(new Error("No fields to update"));
    }

    let fields = [];
    let values = [];

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    values.push(matchStatisticsId);

    const sql = `UPDATE MatchStatistics SET ${fields.join(
      ", "
    )} WHERE matchStatisticsId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getMatchStatisticsByMatch(matchId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM MatchStatistics WHERE matchId = ?";
    db.query(sql, [matchId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function addPlayerMatchStatistics(data) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO PlayerMatchStatistics 
      (matchId, playerId, runsScored, ballsFaced, fours, sixes, oversBowled, 
      battingStatus, runsConceded, maidens, wicketsTaken, catchesTaken, stumpingsTaken)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.matchId,
      data.playerId,
      data.runsScored,
      data.ballsFaced,
      data.fours || 0,
      data.sixes || 0,
      data.oversBowled || 0,
      data.battingStatus || "Did Not Bat",
      data.runsConceded || 0,
      data.maidens || 0,
      data.wicketsTaken || 0,
      data.catchesTaken || 0,
      data.stumpingsTaken || 0,
    ];

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        updatePlayerCareerStats(data.playerId)
          .then(() => resolve(result))
          .catch((err) => reject(err));
      }
    });
  });
}

function updatePlayerMatchStatistics(playerMatchStatisticsId, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length === 0) {
      return reject(new Error("No fields to update"));
    }

    let fields = [];
    let values = [];

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(data[key]);
      }
    }

    values.push(playerMatchStatisticsId);

    const sql = `UPDATE PlayerMatchStatistics SET ${fields.join(
      ", "
    )} WHERE playerMatchStatisticsId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (data.playerId) {
          updatePlayerCareerStats(data.playerId)
            .then(() => resolve(result))
            .catch((err) => reject(err));
        } else {
          resolve(result);
        }
      }
    });
  });
}

function getPlayerMatchStatisticsByMatch(matchId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM PlayerMatchStatistics WHERE matchId = ?";
    db.query(sql, [matchId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}

function getPlayerMatchStatisticsByPlayer(playerId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM PlayerMatchStatistics WHERE playerId = ?";
    db.query(sql, [playerId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
}
