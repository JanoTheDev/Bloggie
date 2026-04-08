import { atom } from "jotai";

export interface ToastMessage {
  id: number;
  message: string;
  type: "success" | "error" | "info";
}

export const toastAtom = atom<ToastMessage[]>([]);
