import { atom, useAtom } from "jotai";

export const sidebarToggle = atom<boolean>(false);
export const searchBarText = atom<string>("");