"use client";

import { useEffect, useState } from "react";

export default function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    function onScroll() {
      const main = document.getElementById("main-content");
      if (!main) return;
      const { scrollTop, scrollHeight, clientHeight } = main;
      setProgress(
        scrollHeight <= clientHeight
          ? 0
          : (scrollTop / (scrollHeight - clientHeight)) * 100
      );
    }
    const main = document.getElementById("main-content");
    main?.addEventListener("scroll", onScroll, { passive: true });
    return () => main?.removeEventListener("scroll", onScroll);
  }, []);

  if (progress === 0) return null;
  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-0.5 bg-blue-500 transition-[width] duration-150"
      style={{ width: `${progress}%` }}
    />
  );
}
