/**
 * oauth handler
 * queries oauth data based on url 'code' parameter returned by discord authorization
 */

const { SESSION_TIMEOUT } = require("../modules/constants.js");

const { exchangeCode } = require("../modules/oauthToken");

async function oauthHandler(req, res, next) {
  const { code, state } = req.query;

  if (!code) {
    next();
    return;
  }

  // check for state validity
  if (state !== req.session.oauth_state) {
    // destroy invalid session
    req.session.destroy();

    // tell the client that authorization failed
    res.cookie("error", "invalid_state");

    next();
    return;
  }

  // remove oauth state from the session to save some db space
  req.session.oauth_state = undefined;

  try {
    const oauthData = await exchangeCode(code);

    req.session.access_token = oauthData.access_token;
    req.session.refresh_token = oauthData.refresh_token;

    res.cookie("loggedIn", "true", { maxAge: SESSION_TIMEOUT });

    next();
  } catch (error) {
    console.error(error);
    res.cookie("error", "oauth_request_fail");
    next();
    return;
  }
}

module.exports = oauthHandler;
