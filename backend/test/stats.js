function updatePlayerCareerStats(playerId) {
  return new Promise((resolve, reject) => {
    getPlayerMatchStatisticsByPlayer(playerId)
      .then((stats) => {
        const matchesPlayed = stats.length;
        let totalRuns = 0;
        let highestScore = 0;
        let totalBallsFaced = 0;
        let totalWickets = 0;
        let bestBowlingFigures = "0/0";
        let bestBowlingWickets = 0;
        let bestBowlingRuns = 0;
        let totalRunsConceded = 0;
        let totalOversBowled = 0;
        let numberOf6s = 0;
        let numberOf4s = 0;

        stats.forEach((stat) => {
          totalRuns += stat.runsScored;
          if (stat.runsScored > highestScore) {
            highestScore = stat.runsScored;
          }
          totalBallsFaced += stat.ballsFaced;
          numberOf6s += stat.sixes;
          numberOf4s += stat.fours;

          totalWickets += stat.wicketsTaken;
          totalRunsConceded += stat.runsConceded;
          totalOversBowled += parseFloat(stat.oversBowled);

          if (
            stat.wicketsTaken > bestBowlingWickets ||
            (stat.wicketsTaken === bestBowlingWickets &&
              stat.runsConceded < bestBowlingRuns)
          ) {
            bestBowlingWickets = stat.wicketsTaken;
            bestBowlingRuns = stat.runsConceded;
            bestBowlingFigures = `${stat.wicketsTaken}/${stat.runsConceded}`;
          }
        });

        const strikeRate =
          totalBallsFaced > 0 ? (totalRuns / totalBallsFaced) * 100 : 0;
        const economyRate =
          totalOversBowled > 0 ? totalRunsConceded / totalOversBowled : 0;

        const manOfTheMatchSql =
          "SELECT COUNT(*) as count FROM Matches WHERE manOfTheMatchId = ?";

        db.query(manOfTheMatchSql, [playerId], (err, result) => {
          if (err) {
            reject(err);
          } else {
            const numberOfManOfTheMatch = result[0].count;

            const checkSql = "SELECT * FROM PlayerStats WHERE playerId = ?";

            db.query(checkSql, [playerId], (err, results) => {
              if (err) {
                reject(err);
              } else {
                if (results.length > 0) {
                  const updateSql = `
                    UPDATE PlayerStats 
                    SET matchesPlayed = ?, totalRuns = ?, highestScore = ?, strikeRate = ?, 
                    totalWickets = ?, bestBowlingFigures = ?, economyRate = ?, 
                    numberOf6s = ?, numberOf4s = ?, numberOfManOfTheMatch = ?
                    WHERE playerId = ?
                  `;

                  const values = [
                    matchesPlayed,
                    totalRuns,
                    highestScore,
                    strikeRate.toFixed(2),
                    totalWickets,
                    bestBowlingFigures,
                    economyRate.toFixed(2),
                    numberOf6s,
                    numberOf4s,
                    numberOfManOfTheMatch,
                    playerId,
                  ];

                  db.query(updateSql, values, (err) => {
                    if (err) {
                      reject(err);
                    } else {
                      resolve();
                    }
                  });
                } else {
                  const insertSql = `
                    INSERT INTO PlayerStats 
                    (playerId, matchesPlayed, totalRuns, highestScore, strikeRate, 
                    totalWickets, bestBowlingFigures, economyRate, numberOf6s, numberOf4s, numberOfManOfTheMatch)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                  `;

                  const values = [
                    playerId,
                    matchesPlayed,
                    totalRuns,
                    highestScore,
                    strikeRate.toFixed(2),
                    totalWickets,
                    bestBowlingFigures,
                    economyRate.toFixed(2),
                    numberOf6s,
                    numberOf4s,
                    numberOfManOfTheMatch,
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
          }
        });
      })
      .catch((err) => reject(err));
  });
}
