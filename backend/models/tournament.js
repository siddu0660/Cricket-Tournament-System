function addTournament(data) {
  return new Promise((resolve, reject) => {
    const sql = `
            INSERT INTO Tournament 
            (tournamentName, startDate, endDate, tourLocation, numberOfTeams, teams, numberOfMatches, tourFormat, weightage, sponsorship)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

    const values = [
      data.tournamentName,
      data.startDate,
      data.endDate,
      data.tourLocation,
      data.numberOfTeams,
      JSON.stringify(data.teams),
      data.numberOfMatches,
      data.tourFormat,
      JSON.stringify(data.weightage),
      JSON.stringify(data.sponsorship),
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

function updateTournament(tournamentId, data) {
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
          key === "teams" || key === "sponsorship" || key === "weightage"
            ? JSON.stringify(data[key])
            : data[key]
        );
      }
    }

    values.push(tournamentId);

    const sql = `UPDATE Tournament SET ${fields.join(
      ", "
    )} WHERE tournamentId = ?`;

    db.query(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

function deleteTournament(tournamentId) {
  return new Promise((resolve, reject) => {
    const sql = "DELETE FROM Tournament WHERE tournamentId = ?";
    db.query(sql, [tournamentId], (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

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

function generateFixtures(tournamentId) {
  return new Promise((resolve, reject) => {
    getTournamentById(tournamentId)
      .then((tournament) => {
        if (!tournament) {
          return reject(new Error("Tournament not found"));
        }

        try {
          const teams = JSON.parse(tournament.teams);
          const startDate = new Date(tournament.startDate);
          const endDate = new Date(tournament.endDate);

          if (!Array.isArray(teams) || teams.length < 2) {
            return reject(new Error("Invalid teams data"));
          }

          const fixtures = [];
          const numTeams = teams.length;

          const tournamentDays = Math.floor(
            (endDate - startDate) / (1000 * 60 * 60 * 24)
          );
          const matchesPerDay = Math.ceil(
            tournament.numberOfMatches / tournamentDays
          );

          let currentDate = new Date(startDate);
          let matchCount = 0;

          for (let i = 0; i < numTeams; i++) {
            for (let j = i + 1; j < numTeams; j++) {
              const matchData = {
                tournamentId: tournamentId,
                team1Id: teams[i],
                team2Id: teams[j],
                matchDate: new Date(currentDate),
                matchStartTime: "14:30:00",
                matchFormat: tournament.tourFormat,
                umpires: JSON.stringify([]),
              };

              fixtures.push(matchData);
              matchCount++;

              if (matchCount % matchesPerDay === 0) {
                currentDate.setDate(currentDate.getDate() + 1);
              }

              if (currentDate > endDate) {
                break;
              }
            }
          }

          const promises = fixtures.map((fixture) => {
            return new Promise((resolve, reject) => {
              getAllVenues()
                .then((venues) => {
                  if (venues.length === 0) {
                    return reject(new Error("No venues available"));
                  }

                  const randomVenue =
                    venues[Math.floor(Math.random() * venues.length)];
                  fixture.venueId = randomVenue.venueId;

                  fixture.matchDate = fixture.matchDate
                    .toISOString()
                    .split("T");

                  addMatch(tournamentId, fixture)
                    .then((result) => resolve(result))
                    .catch((err) => reject(err));
                })
                .catch((err) => reject(err));
            });
          });

          Promise.all(promises)
            .then((results) => resolve(results))
            .catch((err) => reject(err));
        } catch (error) {
          reject(error);
        }
      })
      .catch((err) => reject(err));
  });
}