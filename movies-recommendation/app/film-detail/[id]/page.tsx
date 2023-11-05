import React from "react";
import FilmsScrollContainer from "@/app/components/FilmsScrollContainer";
import { Films, Categories } from "../../model";

interface Props {
  params: { id: string };
}

const API_URL = process.env.API_URL;

const FilmDetails = async ({ params: { id } }: Props) => {
  const res = await fetch(`${API_URL}/getFilm/${parseInt(id)}`);
  const filmDeatil: Films = await res.json();

  const res2 = await fetch(`${API_URL}/getFilm`);
  const categories: Categories[] = await res2.json();

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
              {filmDeatil.release_date.replace("T00:00:00.000Z", "")}
            </p>
          </div>
        </div>
        {/* Add more film description content here */}
      </div>

      <FilmsScrollContainer category={categories[0]} />
    </div>
  );
};

export default FilmDetails;
