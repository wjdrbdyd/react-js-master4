export const API_KEY = "1ce2ede31dfb944e6fdbbf129a3154a6";
export const BASE_PATH = "https://api.themoviedb.org/3";

interface IProgram {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  vote_average: number;
  vote_count: number;
}
// 장르
export interface IGenres {
  id: number;
  name: string;
}
// Production Company
export interface IProductionCompany {
  id: number;
  logo_path: string;
  name: string;
  origin_country: string;
}
// Production Countries
export interface IProductionCountry {
  iso_3166_1: string;
  name: string;
}
// 음성 언어
export interface ISpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
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

//tv array
export interface IGetPopTvResult {
  page: number;
  results: IPopTv[];
  total_pages: number;
  total_results: number;
}
export interface ICreateBy {
  id: number;
  credit_id: string;
  name: string;
  gender: number;
  profile_path: string;
}
export interface IEpisodeToAr {
  air_date: string;
  episode_number: number;
  id: number;
  name: string;
  overview: string;
  production_code: string;
  season_number: number;
  still_path: string;
  vote_average: number;
  vote_count: number;
}
export interface INetworks {
  name: string;
  id: number;
  logo_path: string;
  origin_country: string;
}
export interface ISeasons {
  air_date: string;
  episode_count: number;
  id: number;
  name: string;
  overview: string;
  poster_path: string;
  season_number: number;
}
export interface ICommonDetail {
  genres: IGenres[];
  production_companies: IProductionCompany[];
  production_countries: IProductionCountry[];
  spoken_languages: ISpokenLanguage[];
  tagline: string;
  status: string;
  homepage: string;
}
export interface IGetTvDetailResult extends IPopTv, ICommonDetail {
  id: number;
  backdrop_path: string;
  genre_ids: number[];
  original_language: string;
  vote_average: number;
  vote_count: number;
  first_air_date: string;
  name: string;
  origin_country: string[];
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: string;
  adult: boolean;
  created_by: ICreateBy[];
  episode_run_time: number[];
  in_production: true;
  languages: string[];
  last_air_date: string;
  last_episode_to_air: IEpisodeToAr;
  next_episode_to_air: IEpisodeToAr;
  networks: INetworks[];
  number_of_episodes: number;
  number_of_seasons: number;
  seasons: ISeasons[];
  type: string;
  logos: IMovieImage[];
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
export interface IGetMovieDetailResult extends IMovie, ICommonDetail {
  belongs_to_collection: boolean;
  budget: number;
  imdb_id: string;
  revenue: number;
  runtime: number;
  logos: IMovieImage[];
}
// movie array
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
export function getMoiveImg(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}/images?api_key=${API_KEY}&language=en`
  ).then((response) => response.json());
}
export function getMovieDetail(movieId: number) {
  return fetch(
    `${BASE_PATH}/movie/${movieId}?api_key=${API_KEY}&language=ko`
  ).then((response) => response.json());
}
export function getTvDetail(tvId: number) {
  return fetch(`${BASE_PATH}/tv/${tvId}?api_key=${API_KEY}&language=ko`).then(
    (response) => response.json()
  );
}

export interface IMovieImage {
  aspect_ratio: number;
  height: number;
  iso_639_1: string;
  file_path: string;
  vote_average: number;
  vote_count: number;
  width: number;
}
export interface IMovieLogo {
  backdrops?: IMovieImage[];
  id: number;
  logos?: IMovieImage[];
  posters?: IMovieImage[];
}
export function getMovieImage(id: number) {
  const ajaxData = fetch(
    `${BASE_PATH}/movie/${id}/images?api_key=${API_KEY}&language=en`
  ).then((response) => response.json());

  return ajaxData;
}
