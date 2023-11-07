export interface Category {
  id?: string;
  category: string;
  films: FilmCategory[];
}

export interface FilmCategory {
  id?: string;
  film_id?: string;
  category_id?: string;
  film?: Film;
}

export interface Film {
  id: string;
  name: string;
  image: string;
  adult?: boolean;
  overview?: string;
  release_date?: string;
}

export interface FilmsOfCategory {
  category: string;
  films: Film[];
}
