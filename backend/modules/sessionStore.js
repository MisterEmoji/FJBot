/**
 * PostgreSQL based user session store
 */

const { Pool } = require("pg");
const expressSession = require("express-session");
const pgStore = require("connect-pg-simple")(expressSession);

const { db } = require("../../common/config-resolver.js").resolve();

const pool = new Pool({ ...db });

module.exports = new pgStore({
  pool: pool, // Connection pool
  tableName: "user_sessions",
  createTableIfMissing: true,
});
