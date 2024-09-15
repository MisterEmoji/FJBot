const { Client } = require("pg");
const { db } = require("./config-resolver").resolve();

// create db client instance
const client = new Client({
  ...db,
  application_name: "FJBot-app",
});

// connect to database
client.connect((err) => {
  if (err) {
    console.error(err);
    // exit with failure
    process.exit(1);
  } else {
    console.log(
      `[LOG] Connected to database ${db.database}@${db.host}:${db.port} as ${db.user}`
    );
  }
});

module.exports = {
  async query(text, params, callback) {
    return client.query(text, params, callback);
  },
  async end() {
    return client.end();
  },
  fetchSingle(queryResult) {
    return queryResult.rows[0];
  },
  fetchAll(queryResult) {
    return queryResult.rows;
  },
};
