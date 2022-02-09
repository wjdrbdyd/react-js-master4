const API_KEY = "1ce2ede31dfb944e6fdbbf129a3154a6";
const BASE_PATH = "https://api.themoviedb.org/3";

interface IProgram {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  vote_average: number;
  vote_count: number;
}

export interface IPopTv extends IProgram {
  first_air_date: string;
  name: string;
  origin_country: string[];
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
}
export interface IGetPopTvResult {
  page: number;
  results: IPopTv[];
  total_pages: number;
  total_results: number;
}

export interface IMovie extends IProgram {
  adult: boolean;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string;
  release_date: string;
  title: string;
  video: false;
}
export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}
export function getPopTv() {
  return fetch(
    `${BASE_PATH}/tv/popular?api_key=${API_KEY}&language=ko&page=1`
  ).then((response) => response.json());
}
export function getMovies() {
  return fetch(
    `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}&language=ko&region=kr`
  ).then((response) => response.json());
}
