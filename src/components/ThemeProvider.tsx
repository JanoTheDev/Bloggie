"use client";

import { useAtom } from "jotai";
import { themeAtom } from "@/atoms/theme";
import { useEffect } from "react";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme] = useAtom(themeAtom);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return <>{children}</>;
}
