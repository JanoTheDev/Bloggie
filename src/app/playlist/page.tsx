"use client";

import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/supabase/hooks";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";

const POST_SELECT = `*, author:profiles!author_id(*), likes(count), comments(count), bookmarks(count), views(count)`;
const titles: Record<string, string> = { RH: "Blog History", LB: "Liked Blogs", RL: "Read Later" };

function PlaylistContent() {
  const searchParams = useSearchParams();
  const { user, loading: authLoading } = useUser();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const list = searchParams.get("list") || "";

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }

    const supabase = createClient();
    let query;

    if (list === "RH") {
      query = supabase.from("views").select(`post_id, posts:post_id(${POST_SELECT})`).eq("user_id", user.id).order("created_at", { ascending: false });
    } else if (list === "LB") {
      query = supabase.from("likes").select(`post_id, posts:post_id(${POST_SELECT})`).eq("user_id", user.id).order("created_at", { ascending: false });
    } else if (list === "RL") {
      query = supabase.from("bookmarks").select(`post_id, posts:post_id(${POST_SELECT})`).eq("user_id", user.id).order("created_at", { ascending: false });
    }

    if (query) {
      query.then(({ data }) => {
        const mapped = (data || []).map((r: any) => r.posts).filter(Boolean);
        setPosts(mapped);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [searchParams, user, authLoading, list]);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">{titles[list] || "Playlist"}</h1>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : !user ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-neutral-500 text-lg">Sign in to view this list</p>
          <Link href="/login" className="mt-4 inline-block px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg">Sign in</Link>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-neutral-500 text-lg">Nothing here yet.</p>
          <p className="text-gray-400 dark:text-neutral-500 text-sm mt-1">Start browsing to fill this list.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {posts.map((p: any) => <SmallCardInfo data={p} key={p.id} />)}
        </div>
      )}
    </SideBar>
  );
}

export default function PlaylistPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <PlaylistContent />
    </Suspense>
  );
}
