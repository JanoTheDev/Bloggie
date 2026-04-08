"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function LoadingBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setLoading(true);
    setProgress(80);
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => { setLoading(false); setProgress(0); }, 200);
    }, 300);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 z-[9999] h-0.5 bg-gray-900 dark:bg-neutral-100 transition-all duration-300 ease-out"
      style={{ width: `${progress}%`, opacity: progress === 100 ? 0 : 1 }}
    />
  );
}
