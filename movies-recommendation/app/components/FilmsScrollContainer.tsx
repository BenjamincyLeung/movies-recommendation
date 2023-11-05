import React from "react";
import Link from "./Link";
import { Categories } from "../model";

const FilmsScrollContainer = ({ category }: { category: Categories }) => {
  return (
    <>
      <div className="w-full max-w-screen-xl">
        <h2 className="text-2xl font-bold mt-4 text-slate-200">
          {category.category}
        </h2>
        <div className="overflow-x-auto whitespace-no-wrap bg-gray-100 p-2 rounded-lg">
          <div className="flex space-x-4 p-2 scroll-snap-x-start">
            {category.films.map((film) => (
              <div
                key={film.id}
                className="flex-shrink-0 scroll-snap-align-start"
              >
                <Link href={`/film-detail/${film.film.id}`}>
                  <img
                    src={film.film.image}
                    alt={film.film.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default FilmsScrollContainer;
