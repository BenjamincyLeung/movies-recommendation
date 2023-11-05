const { pgClient } = require("./pgConfig");
const dotenv = require("dotenv");
const { importRatingToPg } = require("./importRatingToPg");
const fs = require("fs");
const XLSX = require("xlsx");

dotenv.config();

async function main() {
  try {
    await pgClient.connect();

    // Check

    const filmsQuery = await pgClient.query(/*sql*/ `SELECT * FROM films`);

    if (filmsQuery.rowCount > 0) {
      console.log(
        'Films Data has already seeded. If you want to seed only the rating data, please run "npm run rating-data-init".'
      );
      return;
    }

    const categpryDataArr = JSON.parse(
      fs.readFileSync("./data/categories.json")
    );

    const filmData = JSON.parse(fs.readFileSync("./data/final_film.json"));

    // const ratingData = JSON.parse(fs.readFileSync("./data/rating.json"));
    // console.log(ratingData.length);

    //   //============section A. import categories data============
    const workbook = XLSX.readFile("./data/Excel_movie_image.xlsx");
    const imdbWorkBook = workbook.Sheets["Worksheet"];
    const imagesSet = XLSX.utils.sheet_to_json(imdbWorkBook);
    console.log(imagesSet);
    for (let i = 0; i < 200; i++) {
      filmData[i].poster_path = imagesSet[i].imdb_id;
    }
    console.log("step A0 - post_path has been changed : ", filmData);
    const filmsMap = new Map();
    for (const films of filmData) {
      console.log("step A1 - will insert: ", films.title, films.release_date);
      const sqlQuery =
        /*sql */
        `INSERT INTO films (name, image, adult, overview, release_date)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id`;
      const filmId = (
        await pgClient.query(sqlQuery, [
          films.title,
          films.poster_path,
          films.adult,
          films.overview,
          films.release_date,
        ])
      ).rows[0];
      console.log("step A2 - inserted: ", films.title, films.release_date);
      filmsMap.set(films.title, filmId.id);
    }
    console.log("Step A3 - film's id: ", filmsMap);

    //============section B. import categories data============
    const categoriesSet = new Set();
    const categoriesMap = new Map();

    for (const categoryData of categpryDataArr) {
      const rawGenres = categoryData.genres;
      const genresArray = eval(rawGenres);

      genresArray.forEach((genres) => {
        const genre = genres.name;
        console.log("step B1 - get each genre: ", genre);
        categoriesSet.add(genre);
      });
    }
    console.log("Step B2 - check category set", categoriesSet);
    const categoryArray = Array.from(categoriesSet);

    for (const category of categoryArray) {
      console.log("step B3 - will insert: ", category);
      const sqlQuery = /*sql */ `INSERT INTO categories (category) VALUES ('${category}') RETURNING id`;
      const categoryId = (await pgClient.query(sqlQuery)).rows[0];
      categoriesMap.set(category, categoryId.id);
      console.log("step B4 - inserted: ", category);
    }
    console.log("step B5 - category's id: ", categoriesMap);

    //============section C. import film_Categories data============
    for (const categoryData of categpryDataArr) {
      const filmWithCategories = [];
      const titleId = filmsMap.get(categoryData.title);
      const rawGenres = categoryData.genres;
      const genresArray = eval(rawGenres);

      genresArray.forEach((genres) => {
        const genreId = categoriesMap.get(genres.name);
        const filmWithCategory = {
          name: titleId,
          category: genreId,
        };
        filmWithCategories.push(filmWithCategory);
      });

      for (const filmWithCategory of filmWithCategories) {
        const sqlQuery = /*sql */ `INSERT INTO film_categories (film_id, category_id) VALUES ($1, $2)`;
        await pgClient.query(sqlQuery, [
          filmWithCategory.name,
          filmWithCategory.category,
        ]);
      }
      console.log("Inserted films with categories data ", filmWithCategories);
    }
    console.log("Seeded the films and categories data");

    //============section D. import rating data============

    if (process.env.IAM_USER_KEY && process.env.IAM_USER_SECRET) {
      await importRatingToPg(pgClient);
    } else {
      console.log(
        "You have not configured the AWS access key and secret yet so there are no fake users and rating data seeded to database"
      );
    }

    // for (let i = 0; i < ratingData.length; i++) {
    //   const filmId = filmsMap.get(ratingData[i].title);
    //   const score = ratingData[i].rating * 2;

    //   console.log(
    //     "Step D1 - this is the: ",
    //     i,
    //     "loop(s), the user_id is: ",
    //     ratingData[i].userId,
    //     " to filmId: ",
    //     filmId,
    //     ". The rate is scored: ",
    //     score
    //   );

    //   const fakeUserId = ratingData[i].userId.toString();
    //   const queryUser = await pgClient.query(
    //     /*sql */ `SELECT * FROM users WHERE id = ($1)`,
    //     [fakeUserId]
    //   );
    //   const fakeUsername = "fake name " + fakeUserId;
    //   const fakeEmail = `fakemail${fakeUserId}@gmail.com`;
    //   if (queryUser.rows.length === 0) {
    //     await pgClient.query(
    //       /*sql */ `INSERT INTO users (id, email, name) VALUES ($1,$2,$3)`,
    //       [fakeUserId, fakeEmail, fakeUsername]
    //     );
    //     console.log("Inserted fake users");
    //   }

    //   const sqlQuery =
    //     /*sql */
    //     `INSERT INTO ratings (user_id, film_id, rating)
    //       VALUES ($1, $2, $3)`;
    //   await pgClient.query(sqlQuery, [fakeUserId, filmId, score]);
    //   console.log("finished inserted");
    // }
  } catch (err) {
    console.log(err);
  } finally {
    await pgClient.end();
  }
}

main();
