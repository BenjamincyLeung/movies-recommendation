const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pgClient = new pg.Client({
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DB_NAME || "movies_recommendation",
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
});

module.exports = { pgClient };
