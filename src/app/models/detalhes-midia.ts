import { TipoMidia } from "./tipo-midia";
export interface DetalhesMidiaModel {
  id: number;
  type: TipoMidia;
  adult: boolean;
  backdrop_path: string;
  genres: {id: number; name: string;}[];
  original_language: string;
  original_title: string;
  release_date?: string;
  first_air_date?: string;
  poster_path: string;
  title?: string;
  name?: string;
  video: boolean;
  overview: string;
  popularity: number;
  vote_average: number;
  revenue: number;
  homepage: string;
  vote_count: number;
  production_companies: {id: number; logo_path: string; name: string; origin_country: string;}[];
}

