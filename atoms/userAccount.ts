import { atom } from "jotai";
import { AllUserData } from "@/data/AllUserData";

export const userAccount = atom<any>(AllUserData[1]);
