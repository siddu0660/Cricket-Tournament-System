function addPlayer(data) {
  return new Promise((resolve, reject) => {
    const sql = `
            INSERT INTO Player 
            (firstName, secondName, dateOfBirth, jerseyNumber, playerRole, 
            battingStyle, bowlingStyle, gender, nationality, teamsPlayed)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      data.firstName,
      data.secondName,
      data.dateOfBirth,
      JSON.stringify(data.jerseyNumber),
      data.playerRole,
      data.battingStyle,
      data.bowlingStyle,
      data.gender,
      data.nationality,
      JSON.stringify(data.teamsPlayed || []),
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

function updatePlayer(playerId, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length === 0) {
      return reject(new Error("No fields to update"));
    }

    let fields = [];
    let values = [];

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(
          key === "jerseyNumber" || key === "teamsPlayed"
            ? JSON.stringify(data[key])
            : data[key]
        );
      }
    }

    values.push(playerId);

    const sql = `UPDATE Player SET ${fields.join(", ")} WHERE playerId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deletePlayer(playerId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Player WHERE playerId = ?";
    db.query(sql, [playerId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
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
