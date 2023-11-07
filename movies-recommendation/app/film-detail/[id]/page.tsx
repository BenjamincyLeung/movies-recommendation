import React from "react";
import FilmsScrollContainer from "@/app/components/FilmsScrollContainer";
import { Film, Category } from "../../model";

interface FilmsFromFlask {
  Distance: number;
  Title: string;
  film_id: number;
  image: string;
}

interface Props {
  params: { id: string };
}

const API_URL = process.env.API_URL;
const FLASK_API_URL = process.env.FLASK_API_URL;

const FilmDetails = async ({ params: { id } }: Props) => {
  const resFilmDetail = await fetch(`${API_URL}/getFilm/${parseInt(id)}`);
  const filmDeatil: Film = await resFilmDetail.json();

  const resFilmRecommendation = await fetch(
    `${FLASK_API_URL}/recommendation/${parseInt(id)}`
  );

  const filmsFromFlask: FilmsFromFlask[] = await resFilmRecommendation.json();

  const category: Category = {
    category: "Others also like theese movies",
    films: [],
  };

  for (const filmFromFlask of filmsFromFlask) {
    category.films.push({
      film: {
        id: filmFromFlask.film_id.toString(),
        name: filmFromFlask.Title,
        image: filmFromFlask.image,
      },
    });
  }

  return (
    <div className="text-white p-4">
      <div>
        <h1 className="text-4xl text-center font-bold mb-5">
          {filmDeatil.name}
        </h1>
        <video src="/asset/MyMovie.mp4" controls className="w-full" />
      </div>

      <div className="flex text-slate-950 mt-4">
        <button className="btn btn-success px-4 py-2 rounded-lg">Like</button>
        <button className="btn btn-success px-4 py-2 rounded-lg ml-5">
          Share
        </button>
        <button className="btn btn-success px-4 py-2 rounded-lg ml-5">
          Save to Watchlist
        </button>
      </div>

      <div className="mt-4">
        <h2 className="text-xl font-semibold">Movie Description</h2>
        <div className="flex flex-row">
          <div className="m-5 w-1/6">
            <img
              src={filmDeatil.image}
              alt={filmDeatil.name}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
          <div className="w-5/6 text-gray-400 mt-2">
            <p>Overview:</p>
            <p>{filmDeatil.overview}</p>
            <p className="mt-5">
              Release Date:{" "}
              {filmDeatil.release_date!.replace("T00:00:00.000Z", "")}
            </p>
          </div>
        </div>
        {/* Add more film description content here */}
      </div>

      <FilmsScrollContainer category={category} />
    </div>
  );
};

export default FilmDetails;
