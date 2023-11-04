const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const pgClient = new pg.Client({
  host: process.env.PG_HOST || "localhost",
  database: process.env.PG_DB_NAME || "movies_recommendation",
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
});

module.exports = { pgClient };
