/**
 * Server entry point
 * Build the frontend first to run backend (npm run build)
 */

"use strict";

const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");

const pino = require("pino-http");

const fs = require("node:fs");
const path = require("node:path");

const { webpage, cookieSecrets } = require("../common/envconfig");

const pgStore = require("./modules/sessionStore");

const { SESSION_TIMEOUT } = require("./modules/constants.js");

const apiRoute = require("./routes/api");
const oauthHandler = require("./middleware/oauthHandler.js");
const fallback = require("./middleware/fallback.js");
const stripURLQuery = require("./middleware/stripURLQuery.js");

const STATIC_FILES_PATH = path.join(__dirname, "../frontend/build");

// check if static directory exists
if (!fs.existsSync(STATIC_FILES_PATH)) {
  throw new Error(
    "Invalid static directory (does not exist): " + STATIC_FILES_PATH
  );
}

const logPath = path.join(__dirname, `./logs/${Date.now()}.json.log`);

const app = express();
const logger = pino({ stream: fs.createWriteStream(logPath, "utf-8") });

app.use(logger);

// Initialize session storage.
app.use(
  session({
    store: pgStore, // session store removes session data after cookie expiration by default
    resave: false,
    saveUninitialized: false,
    rolling: true,
    name: "fjw.sid",
    secret: cookieSecrets,
    cookie: {
      maxAge: SESSION_TIMEOUT,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production" ? true : false,
    },
  })
);

app.use(cookieParser(cookieSecrets));

// api route
app.use("/api", apiRoute);

// oauth handler
app.get("/*", oauthHandler);

app.get("/*", stripURLQuery);

// static files route
app.use(express.static(STATIC_FILES_PATH));

// serve index.html every time unknown route is requested becase routing is handled on client-side
app.get("/*", (req, res) => {
  res.sendFile(path.join("index.html"), { root: STATIC_FILES_PATH });
});

// handle errors
// this middleware is used only when calling `next(err)` in any other route Handler
// otherwise its ignored

app.use(fallback);

// no need to specify fallback page, since we're routing on client side
// apiRoute handles unknown routes on its own (responds with an error)

// start listening for requests
app.listen(webpage.port, webpage.host, () => {
  console.log(
    `[LOG] Webpage server listening at ${webpage.host}:${webpage.port} in ${process.env.NODE_ENV} mode`
  );
});
