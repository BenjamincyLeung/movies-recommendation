import { Categories } from "./model";
import FilmsScrollContainer from "./components/FilmsScrollContainer";

const API_URL = process.env.API_URL;

export default async function Home() {
  const res = await fetch(`${API_URL}/getFilm`);
  const categories: Categories[] = await res.json();

  return (
    <div className="flex flex-col items-center space-y-6">
      {categories.map((category) => (
        <FilmsScrollContainer category={category} key={category.category} />
      ))}
    </div>
  );
}
