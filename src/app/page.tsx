"use client";

import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import InfiniteScroll from "@/components/InfiniteScroll";
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
      const dedup = (arr: any[]) => { const seen = new Set<string>(); return arr.filter((p) => { if (seen.has(p.id)) return false; seen.add(p.id); return true; }); };
      if (pageNum === 0) setPosts(dedup(data || []));
      else setPosts((prev) => dedup([...prev, ...(data || [])]));
      setHasMore((data?.length || 0) === 12);
    } catch {
      setPosts([]);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => { loadPosts(0); }, [loadPosts]);

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return;
    setLoadingMore(true);
    setPage((p) => {
      const next = p + 1;
      loadPosts(next);
      return next;
    });
  }, [loadingMore, hasMore, loadPosts]);

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
        <InfiniteScroll onLoadMore={loadMore} hasMore={hasMore} loading={loadingMore}>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((post) => (
              <SmallCardInfo data={post} key={post.id} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </SideBar>
  );
}
