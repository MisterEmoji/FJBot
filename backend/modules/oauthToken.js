const { request } = require("undici");

const { clientId, clientSecret, webpage } =
  require("../../common/config-resolver.js").resolve();

module.exports = {
  exchangeCode(code) {
    return new Promise((resolve, reject) => {
      // request access token from discord api
      request("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          code,
          grant_type: "authorization_code",
          redirect_uri: `http://${webpage.host}:${webpage.port}`,
          scope: "identify",
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (response.statusCode !== 200) {
            reject(`Failed to exchange code`);
          }
          resolve(response.body.json());
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // TODO: test it
  refreshToken(refreshToken) {
    return new Promise((resolve, reject) => {
      request("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (response.statusCode !== 200) {
            reject(`Failed to refresh token`);
          }
          resolve(response.body.json());
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  // TODO: test it
  revokeToken(accessToken) {
    return new Promise((resolve, reject) => {
      request("https://discord.com/api/oauth2/token", {
        method: "POST",
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          token: accessToken,
          token_type_hint: "access_token",
        }).toString(),
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      })
        .then((response) => {
          if (response.statusCode !== 200) {
            reject(`Failed to revoke token`);
          }
          resolve(response.body.json());
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
