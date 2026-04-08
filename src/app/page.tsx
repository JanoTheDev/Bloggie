"use client";

import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { getPosts } from "@/lib/supabase/api";
import React, { useEffect, useState, useCallback } from "react";

export default function Home() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPosts = useCallback(async (pageNum: number) => {
    try {
      const data = await getPosts(pageNum, 12);
      if (pageNum === 0) {
        setPosts(data || []);
      } else {
        setPosts((prev) => [...prev, ...(data || [])]);
      }
      setHasMore((data?.length || 0) === 12);
    } catch {
      // Empty database is fine
      setPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { loadPosts(0); }, [loadPosts]);

  const loadMore = () => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    const next = page + 1;
    setPage(next);
    loadPosts(next);
  };

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Home</h1>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-neutral-500 text-lg">No posts yet.</p>
          <p className="text-gray-400 dark:text-neutral-500 text-sm mt-1">Be the first to publish something!</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post) => (
              <SmallCardInfo data={post} key={post.id} />
            ))}
          </div>

          {hasMore && (
            <div className="flex justify-center mt-8">
              <button
                onClick={loadMore}
                disabled={loadingMore}
                className="px-6 py-2.5 text-sm font-medium bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                {loadingMore ? "Loading..." : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </SideBar>
  );
}
