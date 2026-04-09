"use client";

import { useEffect, useRef } from "react";

interface Props {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  children: React.ReactNode;
}

export default function InfiniteScroll({ onLoadMore, hasMore, loading, children }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || loading) return;
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMore(); },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, onLoadMore]);

  return (
    <>
      {children}
      <div ref={sentinelRef} className="h-1" />
      {loading && hasMore && (
        <div className="flex justify-center py-6">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-gray-300 dark:border-neutral-700 border-t-gray-900 dark:border-t-neutral-100" />
        </div>
      )}
      {!hasMore && !loading && (
        <p className="text-center text-sm text-gray-400 dark:text-neutral-600 py-6">You've reached the end</p>
      )}
    </>
  );
}
