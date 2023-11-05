const { pgClient } = require("./pgConfig");
const { importRatingToPg } = require("./importRatingToPg");

async function main(pgClient) {
  try {
    await pgClient.connect();
    await importRatingToPg(pgClient);
  } catch (err) {
    console.log(err);
  } finally {
    await pgClient.end();
  }
}

main(pgClient);
