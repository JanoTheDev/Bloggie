"use client";

import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { getFeed } from "@/lib/supabase/api";
import { useUser } from "@/lib/supabase/hooks";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";

export default function Following() {
  const { user, loading: authLoading } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    getFeed()
      .then((data) => {
        const seen = new Set<string>();
        setPosts((data || []).filter((p: any) => { if (seen.has(p.id)) return false; seen.add(p.id); return true; }));
      })
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  return (
    <Suspense>
      <SideBar>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Following</h1>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : !user ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-neutral-500 text-lg">Sign in to see your feed</p>
            <Link href="/login" className="mt-4 inline-block px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg">Sign in</Link>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-neutral-500 text-lg">No posts from people you follow yet.</p>
            <p className="text-gray-400 dark:text-neutral-500 text-sm mt-1">Follow creators to see their posts here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((p: any) => <SmallCardInfo data={p} key={p.id} />)}
          </div>
        )}
      </SideBar>
    </Suspense>
  );
}
