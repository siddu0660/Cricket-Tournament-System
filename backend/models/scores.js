function updatePointsTable(tournamentId, matchId) {
  return new Promise((resolve, reject) => {
    getMatchById(matchId)
      .then((match) => {
        if (!match) {
          return reject(new Error("Match not found"));
        }

        const updateTeam1 = updateTeamPointsInTournament(
          tournamentId,
          match.team1Id,
          match
        );
        const updateTeam2 = updateTeamPointsInTournament(
          tournamentId,
          match.team2Id,
          match
        );

        Promise.all([updateTeam1, updateTeam2])
          .then(() => resolve())
          .catch((err) => reject(err));
      })
      .catch((err) => reject(err));
  });
}

function updateTeamPointsInTournament(tournamentId, teamId, match) {
  return new Promise((resolve, reject) => {
    const checkSql =
      "SELECT * FROM PointsTable WHERE tournamentId = ? AND teamId = ?";

    db.query(checkSql, [tournamentId, teamId], (err, results) => {
      if (err) {
        reject(err);
      } else {
        const isWinner = match.winnerId === teamId;
        const isDrawn = match.matchResult === "Draw";
        const isNoResult = match.matchResult === "No Result";

        if (results.length > 0) {
          let updateFields = {
            matchesPlayed: JSON.stringify([
              ...JSON.parse(results[0].matchesPlayed),
              match.matchId,
            ]),
          };

          if (isWinner) {
            updateFields.matchesWon = results[0].matchesWon + 1;
          } else if (isDrawn) {
            updateFields.matchesDrawn = results[0].matchesDrawn + 1;
          } else if (isNoResult) {
            updateFields.noResultMatches = results[0].noResultMatches + 1;
          } else {
            updateFields.matchesLost = results[0].matchesLost + 1;
          }

          calculateNetRunRate(tournamentId, teamId)
            .then((netRunRate) => {
              updateFields.netRunRate = netRunRate;

              let fields = [];
              let values = [];

              for (const key in updateFields) {
                fields.push(`${key} = ?`);
                values.push(
                  key === "matchesPlayed"
                    ? updateFields[key]
                    : updateFields[key]
                );
              }

              values.push(results[0].pointsId);

              const updateSql = `UPDATE PointsTable SET ${fields.join(
                ", "
              )} WHERE pointsId = ?`;

              db.query(updateSql, values, (err) => {
                if (err) {
                  reject(err);
                } else {
                  resolve();
                }
              });
            })
            .catch((err) => reject(err));
        } else {
          const insertSql = `
            INSERT INTO PointsTable 
            (tournamentId, teamId, matchesPlayed, matchesWon, matchesDrawn, matchesLost, noResultMatches, netRunRate)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
          `;

          const values = [
            tournamentId,
            teamId,
            JSON.stringify([match.matchId]),
            isWinner ? 1 : 0,
            isDrawn ? 1 : 0,
            !isWinner && !isDrawn && !isNoResult ? 1 : 0,
            isNoResult ? 1 : 0,
            0.0, // Initial net run rate
          ];

          db.query(insertSql, values, (err) => {
            if (err) {
              reject(err);
            } else {
              resolve();
            }
          });
        }
      }
    });
  });
}

function addTournamentAwards(data) {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO TournamentAwards 
      (tournamentId, winnerId, runnerId, awards, playerOfTheTournament)
      VALUES (?, ?, ?, ?, ?)
    `;

    const values = [
      data.tournamentId,
      data.winnerId,
      data.runnerId,
      JSON.stringify(data.awards || {}),
      data.playerOfTheTournament,
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

function updateTournamentAwards(tournamentAwardsId, data) {
  return new Promise((resolve, reject) => {
    if (Object.keys(data).length === 0) {
      return reject(new Error("No fields to update"));
    }

    let fields = [];
    let values = [];

    for (const key in data) {
      if (data[key] !== undefined) {
        fields.push(`${key} = ?`);
        values.push(key === "awards" ? JSON.stringify(data[key]) : data[key]);
      }
    }

    values.push(tournamentAwardsId);

    const sql = `UPDATE TournamentAwards SET ${fields.join(
      ", "
    )} WHERE tournamentAwardsId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function getTournamentAwards(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM TournamentAwards WHERE tournamentId = ?";
    db.query(sql, [tournamentId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result[0]);
      }
    });
  });
}