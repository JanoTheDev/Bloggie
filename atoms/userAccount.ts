import { atom } from "jotai";
import { userData } from "@/data/UserData";

export const userAccount = atom<any>(userData);
