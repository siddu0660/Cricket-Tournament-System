function addTeam(data) {
  return new Promise((resolve, reject) => {
    const sql = `
                INSERT INTO Team 
                (teamName, teamOwner, sinceYear, tournamentsPlayed, coaches)
                VALUES (?, ?, ?, ?, ?)
            `;

    const values = [
      data.teamName,
      data.teamOwner,
      data.sinceYear,
      JSON.stringify(data.tournamentsPlayed || []),
      JSON.stringify(data.coaches || []),
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

function updateTeam(teamId, data) {
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
          key === "tournamentsPlayed" || key === "coaches"
            ? JSON.stringify(data[key])
            : data[key]
        );
      }
    }

    values.push(teamId);

    const sql = `UPDATE Team SET ${fields.join(", ")} WHERE teamId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteTeam(teamId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Team WHERE teamId = ?";
    db.query(sql, [teamId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

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
