const pg = require("pg");
const dotenv = require("dotenv");
const XLSX = require("xlsx");
const fs = require("fs");
dotenv.config();

const client = new pg.Client({
  host: process.env.PG_HOST,
  database: process.env.PG_DB_NAME,
  user: process.env.PG_USERNAME,
  password: process.env.PG_PASSWORD,
});

async function main() {
  await client.connect();
  await client.query(/*sql*/ `DELETE FROM film_Categories`);
  await client.query(/*sql*/ `DELETE FROM ratings`);
  await client.query(/*sql*/ `DELETE FROM categories`);
  await client.query(/*sql*/ `DELETE FROM films`);
  await client.query(/*sql*/ `DELETE FROM users`);

  const categoryData = JSON.parse(fs.readFileSync("./data/categories.json"));
  console.log(categoryData);

  const filmData = JSON.parse(fs.readFileSync("./data/final_film.json"));
  console.log(filmData);

  const ratingData = JSON.parse(fs.readFileSync("./data/rating.json"));
  console.log(ratingData.length);

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
      await client.query(sqlQuery, [
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

  for (let i = 0; i < categoryData.length; i++) {
    const rawGenres = categoryData[i].genres;
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
    const categoryId = (await client.query(sqlQuery)).rows[0];
    categoriesMap.set(category, categoryId.id);
    console.log("step B4 - inserted: ", category);
  }
  console.log("step B5 - category's id: ", categoriesMap);

  //============section C. import film_Categories data============
  for (let i = 0; i < categoryData.length; i++) {
    const filmWithCategories = [];
    const titleId = filmsMap.get(categoryData[i].title);
    const rawGenres = categoryData[i].genres;
    const genresArray = eval(rawGenres);

    genresArray.forEach((genres) => {
      const genreId = categoriesMap.get(genres.name);
      const filmWithCategory = {
        name: titleId,
        category: genreId,
      };
      filmWithCategories.push(filmWithCategory);
    });
    console.log(
      "Step C1 - this is the: ",
      i,
      "loop(s), the film categories are: ",
      filmWithCategories
    );

    for (const filmWithCategory of filmWithCategories) {
      const sqlQuery = /*sql */ `INSERT INTO film_categories (film_id, category_id) VALUES ($1, $2)`;
      await client.query(sqlQuery, [
        filmWithCategory.name,
        filmWithCategory.category,
      ]);
    }
    console.log(
      "Step C2 - this is the: ",
      i,
      "loop(s), inserted: ",
      filmWithCategories
    );
  }

  //============section D. import rating data============
  for (let i = 0; i < ratingData.length; i++) {
    const movieId = filmsMap.get(ratingData[i].title);
    const score = ratingData[i].rating * 2;

    console.log(
      "Step D1 - this is the: ",
      i,
      "loop(s), the user_id is: ",
      ratingData[i].userId,
      " to movieId: ",
      movieId,
      ". The rate is scored: ",
      score
    );

    const fakeUserId = ratingData[i].userId.toString();
    const queryUser = await client.query(
      /*sql */ `SELECT * FROM users WHERE id = ($1)`,
      [fakeUserId]
    );
    const fakeUsername = "fake name " + fakeUserId;
    const fakeEmail = `fakemail${fakeUserId}@gmail.com`;
    if (queryUser.rows.length === 0) {
      await client.query(
        /*sql */ `INSERT INTO users (id, email, name) VALUES ($1,$2,$3)`,
        [fakeUserId, fakeEmail, fakeUsername]
      );
      console.log("Inserted fake users");
    }

    const sqlQuery =
      /*sql */
      `INSERT INTO ratings (user_id, film_id, rating)
        VALUES ($1, $2, $3)`;
    await client.query(sqlQuery, [fakeUserId, movieId, score]);
    console.log("finished inserted");
  }

  await client.query("ALTER SEQUENCE users_id_seq RESTART WITH 300001;");

  await client.end();
}

main();
