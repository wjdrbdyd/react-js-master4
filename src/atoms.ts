import { atom, selector } from "recoil";

export interface IUser {
  email: string;
  password: string;
}

const userEmail = localStorage.getItem("userEmail") || "";

console.log(`userEmail:${userEmail}`);
export const userState = atom<IUser>({
  key: "userInfo",
  default: {
    email: userEmail,
    password: "",
  },
});
