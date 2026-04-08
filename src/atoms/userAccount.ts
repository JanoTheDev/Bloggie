import { atom } from "jotai";
import { AllUserData } from "@/data/AllUserData";
import type { User } from "@/types";

export const userAccount = atom<User>(AllUserData[1]);
