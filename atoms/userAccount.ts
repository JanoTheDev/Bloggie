import { atom } from "jotai";
import { userData } from "@/data/UserData";
import { AllUserData } from "@/data/AllUserData";

export const userAccount = atom<any>(AllUserData[1]);
