import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export const sidebarToggle = atomWithStorage<boolean>("sidebar-open", false);
export const searchBarText = atom<string>("");