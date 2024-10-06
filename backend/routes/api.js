/**
 * Api router
 * Calls discord.js api
 */

const express = require("express");
const path = require("node:path");
const { request } = require("undici");
const { md5 } = require("js-md5");

const { clientId, webpage } = require("../../common/envconfig");

const router = express.Router();

const DC_API_ENDPOINT = "https://discord.com/api/v10/";

// error wrapper
function error(status, message) {
  const err = new Error(message);
  err.status = status;
  return err;
}

// check if client is authorized to use the api
const Authorize = (req, res, next) => {
  if (!req.session.access_token) {
    next(error(401, "Client not authorized"));
  } else {
    next();
  }
};

router.get("/oauth", (req, res) => {
  req.session.oauth_state = md5(req.sessionID);

  // Construct auth redirect url
  // NOTE: Make sure to add redirect_uri to permitted redirects on discord dev panel
  res.redirect(
    "https://discord.com/oauth2/authorize?" +
      new URLSearchParams({
        response_type: "code",
        scope: "identify",
        state: req.session.oauth_state,
        client_id: clientId,
        redirect_uri: `http://${webpage.host}:${webpage.port}`,
      }).toString()
  );
});

router.use(Authorize);

router.get("/user", async (req, res, next) => {
  try {
    const response = await request(path.join(DC_API_ENDPOINT, `/users/@me`), {
      headers: {
        authorization: `Bearer ${req.session.access_token}`,
      },
    });

    res.send(await response.body.json());
  } catch (err) {
    console.error(err);
    next(error(502, "Failed to fetch the user"));
  }
});

// fallback
router.use((req, res, next) => {
  next(error(404, "Unknown api route: " + req.url));
});

module.exports = router;
