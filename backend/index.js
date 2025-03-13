const express = require("express");
const session = require("express-session");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();

require("dotenv").config();

app.use(
    cors({
        origin: [process.env.URL_DEV, process.env.URL_ADMIN],
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

const port = 8000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});