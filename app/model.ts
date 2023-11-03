export interface Categories {
  id: string;
  category: string;
  films: FilmCategories[];
}

export interface FilmCategories {
  id: string;
  film_id: string;
  category_id: string;
  film: Films;
}

export interface Films {
  id: string;
  name: string;
  image: string;
  adult: boolean;
  overview: string;
  release_date: string;
}
