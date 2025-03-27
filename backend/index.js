const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const { teamController, venueController, tournamentController } = require("./controller/user");
const { teamAdminController, venueAdminController, tournamentAdminController, matchAdminController } = require("./controller/admin");

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
    }
});

userRouter.get("/teamsTournament/:id", async (req, res) => {
    try {
        const teams = await teamController.getTeamsByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

userRouter.get("/teams/:id/tournaments", async (req, res) => {
    try {
        const tournaments = await teamController.getTournamentsByTeam(req.params.id);
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.get("/venue", async (req, res) => {
    try {
        const teams = await venueController.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

userRouter.get("/venue/:id/checkAvailability?date=:date", async (req, res) => {
    try {
        const isAvailable = await venueController.checkVenueAvailability(req.params.id, req.params.date);
        res.status(200).json({ available: isAvailable });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

userRouter.get("/tournaments", async (req, res) => {
    try {
        const tournaments = await tournamentController.getAllTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

userRouter.get("/tournaments/:id/matches", async (req, res) => {
    try {
        const teams = await tournamentController.getMatchesByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Admin Routes

const adminRouter = express.Router();
app.use("/api/v2", adminRouter);

adminRouter.get("/teams", async (req, res) => {
    try {
        const teams = await teamController.getAllTeams();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get("/teamsTournament/:id", async (req, res) => {
    try {
        const teams = await teamController.getTeamsByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

adminRouter.put("/teams/:id", async (req, res) => {
    try {
        await teamAdminController.updateTeam(req.params.id, req.body);
        res.status(200).json({ message: "Team updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.delete("/teams/:id", async (req, res) => {
    try {
        await teamAdminController.deleteTeam(req.params.id);
        res.status(200).json({ message: "Team deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get("/venue", async (req, res) => {
    try {
        const teams = await venueController.getAllVenues();
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

adminRouter.get("/venue/:id/checkAvailability?date=:date", async (req, res) => {
    try {
        const isAvailable = await venueController.checkVenueAvailability(req.params.id, req.params.date);
        res.status(200).json({ available: isAvailable });
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

adminRouter.put("/venue/:id", async (req, res) => {
    try {
        await venueAdminController.updateVenue(req.params.id, req.body);
        res.status(200).json({ message: "Venue updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.delete("/venue/:id", async (req, res) => {
    try {
        await venueAdminController.deleteVenue(req.params.id);
        res.status(200).json({ message: "Venue deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.get("/tournaments", async (req, res) => {
    try {
        const tournaments = await tournamentController.getAllTournaments();
        res.status(200).json(tournaments);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

adminRouter.get("/tournaments/:id/matches", async (req, res) => {
    try {
        const teams = await tournamentController.getMatchesByTournament(req.params.id);
        res.status(200).json(teams);
    } catch (error) {
        res.status(500).json({ error: error.message });
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
    }
});

adminRouter.put("/tournaments/:id", async (req, res) => {
    try {
        await tournamentAdminController.updateTournament(req.params.id, req.body);
        res.status(200).json({ message: "Tournament updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.delete("/tournaments/:id", async (req, res) => {
    try {
        await tournamentAdminController.deleteTournament(req.params.id);
        res.status(200).json({ message: "Tournament deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

adminRouter.post("/matchesTournament/:id", async (req, res) => {
    try {
        const result = await matchAdminController.addMatches(req.body, req.params.id);
        res.status(201).json({
        message: "Match created successfully",
        matchId: result.insertId,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = 8000;

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
