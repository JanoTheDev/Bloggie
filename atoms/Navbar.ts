import { atom, useAtom } from "jotai";
import { userData } from "@/data/UserData";

export const sidebarToggle = atom<boolean>(false);
export const searchBarText = atom<string>("");