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
