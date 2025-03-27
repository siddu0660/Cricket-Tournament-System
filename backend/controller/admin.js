const db = require('../config/db');

// Teams
function addTeam(data) {
    return new Promise((resolve, reject) => {
        const sql = `
                    INSERT INTO Team 
                    (teamName, teamOwner, sinceYear, tournamentsPlayed, matchesWon, matchesLost, matchesDrawn)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                `;

        const values = [
        data.teamName,
        data.teamOwner,
        data.sinceYear,
        JSON.stringify(data.tournamentsPlayed || []),
        data.matchesWon,
        data.matchesLost,
        data.matchesDrawn,
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

// --------------------------------------------- //

// Venue 

function addVenue(data) {
    return new Promise((resolve, reject) => {
        const sql = `
                INSERT INTO Venue 
                (venueName, capacity, venueLocation, surfaceType, country)
                VALUES (?, ?, ?, ?, ?)
            `;

        const values = [
        data.venueName,
        data.capacity,
        data.venueLocation,
        data.surfaceType,
        data.country,
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

function updateVenue(venueId, data) {
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

        values.push(venueId);

        const sql = `UPDATE Venue SET ${fields.join(", ")} WHERE venueId = ?`;

        db.query(sql, values, (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
        });
    });
}

function deleteVenue(venueId) {
    return new Promise((resolve, reject) => {
        const sql = "DELETE FROM Venue WHERE venueId = ?";
        db.query(sql, [venueId], (err, result) => {
        if (err) {
            reject(err);
        } else {
            resolve(result);
        }
        });
    });
}

// --------------------------------------------- //

// Tournament

function addTournament(data) {
    return new Promise((resolve, reject) => {
        const sql = `
                INSERT INTO Tournament 
                (tournamentName, startDate, endDate, tourLocation, numberOfTeams, teams, numberOfMatches, tourFormat, weightage, sponsorship)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        const teamsArray = JSON.parse(data.teams);
        const weightageArray = JSON.parse(data.weightage);
        const sponsorshipArray = JSON.parse(data.sponsorship);

        const values = [
        data.tournamentName,
        data.startDate,
        data.endDate,
        data.tourLocation,
        data.numberOfTeams,
        JSON.stringify(teamsArray),
        data.numberOfMatches,
        data.tourFormat,
        JSON.stringify(weightageArray),
        JSON.stringify(sponsorshipArray),
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

// --------------------------------------------- //

// Match

function addMatch(tournamentId, data) {
    return new Promise((resolve, reject) => {
        const sql = `
                INSERT INTO Matches
                (tournamentId, team1Id, team2Id, venueId, matchDate)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        const values = [
        tournamentId,
        data.team1Id,
        data.team2Id,
        data.venueId,
        data.matchDate,
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

function addMatches(tournamentId, matches) {
    return new Promise((resolve, reject) => {
        const results = [];
        let completed = 0;

        matches.forEach((match) => {
            const sql = `
                INSERT INTO Matches
                (tournamentId, team1Id, team2Id, venueId, matchDate)
                VALUES (?, ?, ?, ?, ?)
            `;

            const values = [
                tournamentId,
                match.team1Id,
                match.team2Id,
                match.venueId,
                match.matchDate,
            ];

            db.query(sql, values, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    results.push(result);
                    completed += 1;
                    if (completed === matches.length) {
                        resolve(results);
                    }
                }
            });
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

// --------------------------------------------- //

// Player 
function addPlayer(data) {
    return new Promise((resolve, reject) => {
        const sql = `
                INSERT INTO Player 
                (firstName, secondName, dateOfBirth, jerseyNumber, playerRole, 
                battingStyle, bowlingStyle, gender, nationality, teamsPlayed)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;

        const jerseyNumberArray = JSON.parse(data.jerseyNumber);
        const teamsPlayedArray = JSON.parse(data.teamsPlayed);

        const values = [
        data.firstName,
        data.secondName,
        data.dateOfBirth,
        JSON.stringify(jerseyNumberArray),
        data.playerRole,
        data.battingStyle,
        data.bowlingStyle,
        data.gender,
        data.nationality,
        JSON.stringify(teamsPlayedArray || []),
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

const teamAdminController = {
    addTeam,
    updateTeam,
    deleteTeam
}

const venueAdminController = {
    addVenue,
    updateVenue,
    deleteVenue,
}

const tournamentAdminController = {
    addTournament,
    updateTournament,
    deleteTournament,
}

const matchAdminController = {
    addMatch,
    addMatches,
    updateMatch,
    deleteMatch,
    updateMatchResult
}

const playerAdminController = {
    addPlayer,
    getPlayerById,
    updatePlayer,
    deletePlayer
}

module.exports = {
    teamAdminController,
    venueAdminController,
    tournamentAdminController,
    matchAdminController,
    playerAdminController
}