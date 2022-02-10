import { IGetMovieDetailResult, IGetTvDetailResult } from "./api";
import { atom, selector } from "recoil";

export interface IUser {
  email: string;
  password: string;
}

const userEmail = localStorage.getItem("userEmail") || "";

export const userState = atom<IUser>({
  key: "userInfo",
  default: {
    email: userEmail,
    password: "",
  },
});
export const movieDetailState = atom<IGetMovieDetailResult>({
  key: "movieDetail",
  default: {} as IGetMovieDetailResult,
});

export const tvDetailState = atom<IGetTvDetailResult>({
  key: "tvDetail",
  default: {} as IGetTvDetailResult,
});
