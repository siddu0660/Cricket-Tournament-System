const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { teamController, venueController, tournamentController, matchController, playerController, squadController, matchStatisticsController } = require("./controller/user");
const { teamAdminController, venueAdminController, tournamentAdminController, matchAdminController, playerAdminController, squadAdminController, matchStatisticsAdminController, playerMatchStatisticsAdminController } = require("./controller/admin");

require("dotenv").config();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT", "DELETE"],
        credentials: true,
    })
);

app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {
        sameSite: "None",
        maxAge: 1000 * 60 * 60 * 24 * 365,
        secure: true,
        },
    })
);

app.use(express.json());
app.use(bodyParser.json());

// User Routes
const userRouter = express.Router();
app.use("/api", userRouter);

userRouter.get("/teams", async (req, res) => {
    try {
        const teams = await teamController.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/teamsTournament/:id", async (req, res) => {
    try {
        const teams = await teamController.getTeamsByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/teams/:id", async (req, res) => {
    try {
        const team = await teamController.getTeamById(req.params.id);
        if (!team) {
        return res.status(404).json({ error: "Team not found" });
        }
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/teams/:id/tournaments", async (req, res) => {
    try {
        const tournaments = await teamController.getTournamentsByTeam(req.params.id);
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/venue", async (req, res) => {
    try {
        const teams = await venueController.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/venue/:id", async (req, res) => {
    try {
        const venue = await venueController.getVenueById(req.params.id);
        if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
        }
        res.status(200).json(venue);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/venue/:id/checkAvailability?date=:date", async (req, res) => {
    try {
        const isAvailable = await venueController.checkVenueAvailability(req.params.id, req.params.date);
        res.status(200).json({ available: isAvailable });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/tournaments", async (req, res) => {
    try {
        const tournaments = await tournamentController.getAllTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/tournaments/:id", async (req, res) => {
    try {
        const tournament = await tournamentController.getTournamentById(req.params.id);
        if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/tournaments/:id/matches", async (req, res) => {
    try {
        const teams = await tournamentController.getMatchesByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/matches", async (req, res) => {
    try {
        const matches = await matchController.getAllMatches();
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/matches/:id", async (req, res) => {
    try {
        const match = await matchController.getMatchById(req.params.id);
        if (!match) {
        return res.status(404).json({ error: "Match not found" });
        }
        res.status(200).json(match);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/matches/:teamId/:tournamentId", async (req, res) => {
    try {
        const teams = await matchController.getTeamsByMatch(req.params.teamId, req.params.tournamentId);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/players", async (req, res) => {
    try {
        const players = await playerController.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/players/:id", async (req, res) => {
    try {
        const player = await playerController.getPlayerById(req.params.id);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/players/team/:id", async (req, res) => {
    try {
        const players = await playerController.getPlayersByTeam(req.params.id);
        if (!players || players.length === 0) {
            return res.status(404).json({ error: "No players found for this team" });
        }
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/matches/:id", async (req, res) => {
    try {
        const matchData = await matchController.getMatchById(req.params.id);
        console.log(matchData);
        res.status(200).json(matchData);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

userRouter.get("/squads", async (req, res) => {
    try {
        const squads = await squadController.getAllSquads();
        res.status(200).json(squads);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

userRouter.get("/squads/:id", async (req, res) => {
    try {
        const squads = await squadController.getSquadById(req.params.id);
        res.status(200).json(squads);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

userRouter.get("/squads/tournament/:id", async (req, res) => {
    try {
        const squads = await squadController.getSquadsByTournament(req.params.id);
        res.status(200).json(squads);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

userRouter.get("/squads/players", async (req, res) => {
    try {
        const teamId = req.body.teamId;
        const tournamentId = req.body.tournamentId;
        const players = await squadController.getPlayerBySquad(teamId, tournamentId);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

// Admin Routes

const adminRouter = express.Router();
app.use("/api/v2", adminRouter);

adminRouter.get("/teams", async (req, res) => {
    try {
        const teams = await teamController.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/teamsTournament/:id", async (req, res) => {
    try {
        console.log("Teams of Tournament Body : ",req.body);
        console.log("Teams of Tournament Params : ",req.params);
        const teams = await teamController.getTeamsByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/teams/:id", async (req, res) => {
    try {
        const team = await teamController.getTeamById(req.params.id);
        if (!team) {
        return res.status(404).json({ error: "Team not found" });
        }
        res.status(200).json(team);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.post("/teams", async (req, res) => {
    try {
        const result = await teamAdminController.addTeam(req.body);
        res.status(201).json({
        message: "Team created successfully",
        teamId: result.insertId,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.put("/teams/:id", async (req, res) => {
    try {
        await teamAdminController.updateTeam(req.params.id, req.body);
        res.status(200).json({ message: "Team updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.delete("/teams/:id", async (req, res) => {
    try {
        await teamAdminController.deleteTeam(req.params.id);
        res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/venue", async (req, res) => {
    try {
        const teams = await venueController.getAllVenues();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/venue/:id", async (req, res) => {
    try {
        const venue = await venueController.getVenueById(req.params.id);
        if (!venue) {
        return res.status(404).json({ error: "Venue not found" });
        }
        res.status(200).json(venue);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/venue/:id/checkAvailability?date=:date", async (req, res) => {
    try {
        const isAvailable = await venueController.checkVenueAvailability(req.params.id, req.params.date);
        res.status(200).json({ available: isAvailable });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.post("/venue", async (req, res) => {
    try {
        const result = await venueAdminController.addVenue(req.body);
        res.status(201).json({
        message: "Venue created successfully",
        venueId: result.insertId,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.put("/venue/:id", async (req, res) => {
    try {
        await venueAdminController.updateVenue(req.params.id, req.body);
        res.status(200).json({ message: "Venue updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.delete("/venue/:id", async (req, res) => {
    try {
        await venueAdminController.deleteVenue(req.params.id);
        res.status(200).json({ message: "Venue deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/tournaments", async (req, res) => {
    try {
        const tournaments = await tournamentController.getAllTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/tournaments/:id", async (req, res) => {
    try {
        const tournament = await tournamentController.getTournamentById(req.params.id);
        if (!tournament) {
        return res.status(404).json({ error: "Tournament not found" });
        }
        res.status(200).json(tournament);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/tournaments/:id/matches", async (req, res) => {
    try {
        const teams = await tournamentController.getMatchesByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.post("/tournaments", async (req, res) => {
    try {
        const result = await tournamentAdminController.addTournament(req.body);
        res.status(201).json({
        message: "Tournament created successfully",
        tournamentId: result.insertId,
        });
        console.log(req.body);
        console.log(result);
        console.log(result.insertId);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.put("/tournaments/:name", async (req, res) => {
    try {
        await tournamentAdminController.updateTournament(req.params.id, req.body);
        res.status(200).json({ message: "Tournament updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.delete("/tournaments/:id", async (req, res) => {
    try {
        await tournamentAdminController.deleteTournament(req.params.id);
        res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.post("/matchesTournament/:id", async (req, res) => {
    try {
        console.log("Request Body for Matches Tour : ", req.body, " ID ", req.params.id);
        
        const matches = req.body;
        const results = [];

        for (const match of matches) {
            match.tournamentId = req.params.id;
            const result = await matchAdminController.addMatches(req.params.id, [match]);
            results.push(result);
        }

        res.status(201).json({
            message: "Matches created successfully",
            results: results.map(result => result.insertId),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/players", async (req, res) => {
    try {
        const players = await playerController.getAllPlayers();
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/players/:id", async (req, res) => {
    try {
        const player = await playerController.getPlayerById(req.params.id);
        if (!player) {
            return res.status(404).json({ error: "Player not found" });
        }
        res.status(200).json(player);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/players/team/:id", async (req, res) => {
    try {
        const players = await playerController.getPlayersByTeam(req.params.id);
        if (!players || players.length === 0) {
            return res.status(404).json({ error: "No players found for this team" });
        }
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});


adminRouter.post("/players", async (req, res) => {
    try {
        const newPlayer = req.body;
        const result = await playerAdminController.addPlayer(newPlayer);
        res.status(201).json({
            message: "Player added successfully",
            playerId: result.insertId,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.put("/players/:id", async (req, res) => {
    try {
        const playerId = req.params.id;
        const updatedData = req.body;
        await playerAdminController.updatePlayer(playerId, updatedData);
        res.status(200).json({ message: "Player updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.delete("/players/:id", async (req, res) => {
    try {
        const playerId = req.params.id;
        await playerAdminController.deletePlayer(playerId);
        res.status(200).json({ message: "Player deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/matches", async (req, res) => {
    try {
        const matches = await matchController.getAllMatches();
        res.status(200).json(matches);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.get("/matches/:id", async (req, res) => {
    try {
        console.log(req.params.id);
        const matchData = await matchController.getMatchById(req.params.id);
        console.log(matchData);
        res.status(200).json(matchData);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

adminRouter.post("/matchConclude/:id", async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;
        console.log("Data for Match Conclude : ", data);
        console.log("Id for Match Conclude", id);
        await matchAdminController.updateMatchResult(id,data);
        res.status(200).json({ message : "Match Concluded successfully"});
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log(error.message);
    }
})

adminRouter.get("/squads", async (req, res) => {
    try {
        const squads = await squadController.getAllSquads();
        res.status(200).json(squads);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

adminRouter.get("/squads/:id", async (req, res) => {
    try {
        const squads = await squadController.getSquadById(req.params.id);
        res.status(200).json(squads);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

adminRouter.get("/squads/tournament/:id", async (req, res) => {
    try {
        const squads = await squadController.getSquadsByTournament(req.params.id);
        res.status(200).json(squads);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
});

adminRouter.post("/squads", async (req, res) => {
    try {
        const data = req.body;
        console.log("Data for Squad: ", data);
        await squadAdminController.addSquad(data);
        res.status(200).json({ message : "Squad Added successfully"});
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log(error.message);
    }
})

adminRouter.post("/squads/:squadId/player/:id", async (req, res) => {
    try {
        console.log("Data for Squad Player Add: ", req.params.squadId, req.params.id);
        await squadAdminController.addPlayerToSquad(req.params.squadId, req.params.id);
        res.status(200).json({ message : "Player Added to Squad successfully"});
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log(error.message);
    }
})

adminRouter.delete("/squads/:squadId/player/:id", async (req, res) => {
    try {
        console.log("Data for Squad Player Delete: ", req.params.squadId, req.params.id);
        await squadAdminController.deletePlayerFromSquad(req.params.squadId, req.params.id);
        res.status(200).json({ message : "Player Deleted from Squad successfully"});
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log(error.message);
    }
})

adminRouter.delete("/squads/:id", async (req, res) => {
    try {
        console.log("Squad Id for delete: ", req.params.id);
        await squadAdminController.deleteSquad(req.params.id);
        res.status(200).json({ message : "Squad Added successfully"});
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log(error.message);
    }
})

adminRouter.get("/squads/players/:teamId/:tournamentId", async (req, res) => {
    try {
        const teamId = req.params.teamId;
        const tournamentId = req.params.tournamentId;
        const players = await squadController.getPlayersBySquad(teamId, tournamentId);
        res.status(200).json(players);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

adminRouter.post("/matchStatistics", async (req, res) => {
    try {
        const matchId = req.body.matchId;
        const teamId = req.body.teamId;
        console.log("Data for Match Statistics : ", req.body);
        const data = await matchStatisticsAdminController.handleAddMatchStatistics(matchId, teamId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error : error.message });
        console.log(error.message);
    }
})

adminRouter.post("/playerMatchStatistics", async (req, res) => {
    try {
        const matchStatisticsId = req.body.matchStatisticsId;
        const playerId = req.body.playerId;
        console.log("Data for Player Match Statistics : ", req.body);
        const playerMatchStatistics = await playerMatchStatisticsAdminController.handlePlayerMatchStatistics(matchStatisticsId, playerId);
        res.status(200).json(playerMatchStatistics);
    } catch (error) {
        res.status(500).json({ error: error.message });
        console.log(error.message);
    }
})

adminRouter.put("/playerMatchStatistics/:playerMatchStatisticId", async (req, res) => {
    try {
        const playerMatchStatisticId = req.params.playerMatchStatisticId;
        const updateData = req.body;
        console.log("Updating Player Match Statistics for ID:", playerMatchStatisticId);
        console.log("Update data:", updateData);
        const updatedPlayerMatchStatistic = await playerMatchStatisticsAdminController.updatePlayerMatchStatistics(playerMatchStatisticId, updateData);

        if (!updatedPlayerMatchStatistic) {
            return res.status(404).json({ error: "Player match statistic not found" });
        }
        res.status(200).json(updatedPlayerMatchStatistic);
    } catch (error) {
        console.error("Error updating player match statistics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

const port = 8000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
