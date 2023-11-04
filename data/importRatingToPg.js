const dotenv = require("dotenv");
const s3modules = require("@aws-sdk/client-s3"); // ES Modules import

dotenv.config();

async function importRatingToPg(pgClient) {
  const input = {
    Bucket: "movies-recommendation-rating",
    Key: "rating.json",
  };

  const config = {
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.IAM_USER_KEY,
      secretAccessKey: process.env.IAM_USER_SECRET,
    },
  };

  try {
    const response = await getData(input, config, getS3File);
    const ratingData = JSON.parse(response);
    console.log(`Fetched rating Data, data rows: ${ratingData.length}`);

    await pgClient.query(/*sql*/ `DELETE FROM ratings`);

    const filmsQuery = await pgClient.query(
      /*sql*/ `SELECT name,id from films`
    );

    const filmsMap = new Map(
      filmsQuery.rows.map((film) => [film.name, film.id])
    );

    for (const rating of ratingData) {
      const filmId = filmsMap.get(rating.title);
      const score = rating.rating * 2;
      console.log(rating);

      console.log(
        "Insert the user_id: ",
        rating.userId,
        ". FilmId: ",
        filmId,
        ". The rate is scored: ",
        score
      );

      const fakeUserId = rating.userId.toString();
      const queryUser = await pgClient.query(
        /*sql */ `SELECT * FROM users WHERE id = ($1)`,
        [fakeUserId]
      );
      const fakeUsername = "fake name " + fakeUserId;
      const fakeEmail = `fakemail${fakeUserId}@gmail.com`;
      if (queryUser.rows.length === 0) {
        await pgClient.query(
          /*sql */ `INSERT INTO users (id, email, name) VALUES ($1,$2,$3)`,
          [fakeUserId, fakeEmail, fakeUsername]
        );
        console.log("Inserted fake users");
      }

      const sqlQuery =
        /*sql */
        `INSERT INTO ratings (user_id, film_id, rating)
                VALUES ($1, $2, $3)`;
      await pgClient.query(sqlQuery, [fakeUserId, filmId, score]);
      console.log("finished inserted");
    }
  } catch (err) {
    console.log(err);
  }

  async function getData(input, config, getS3File) {
    try {
      const response = await getS3File(input, config);

      const ratingData = await response.Body.transformToString();
      return ratingData;
    } catch (err) {
      console.log(err);
    }
  }

  async function getS3File(input, config) {
    const S3Client = s3modules.S3Client;
    const GetObjectCommand = s3modules.GetObjectCommand;
    const client = new S3Client(config);
    try {
      const command = new GetObjectCommand(input);
      const response = await client.send(command);
      return response;
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = { importRatingToPg };
