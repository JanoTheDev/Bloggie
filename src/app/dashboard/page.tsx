"use client";

import { Suspense, useEffect, useState } from "react";
import SideBar from "@/components/Navbar";
import { useUser } from "@/lib/supabase/hooks";
import { createClient } from "@/lib/supabase/client";

interface PostAnalytics {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  likes: { count: number }[];
  comments: { count: number }[];
  views: { count: number }[];
}

function DashboardContent() {
  const { user, loading: userLoading } = useUser();
  const [posts, setPosts] = useState<PostAnalytics[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchAnalytics() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select(
          "id, title, slug, created_at, likes(count), comments(count), views(count)"
        )
        .eq("author_id", user!.id)
        .eq("published", true)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setPosts(data as unknown as PostAnalytics[]);
      }
      setLoading(false);
    }

    fetchAnalytics();
  }, [user]);

  if (userLoading || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-neutral-400">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-gray-500 dark:text-neutral-400 text-lg">
          Sign in to view your dashboard
        </p>
        <a
          href="/login"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Sign In
        </a>
      </div>
    );
  }

  const getCount = (arr: { count: number }[]) =>
    arr?.[0]?.count ?? 0;

  const totalViews = posts.reduce((sum, p) => sum + getCount(p.views), 0);
  const totalLikes = posts.reduce((sum, p) => sum + getCount(p.likes), 0);
  const totalComments = posts.reduce(
    (sum, p) => sum + getCount(p.comments),
    0
  );

  const sortedByViews = [...posts].sort(
    (a, b) => getCount(b.views) - getCount(a.views)
  );
  const chartPosts = sortedByViews.slice(0, 7);
  const maxViews = chartPosts.length > 0 ? getCount(chartPosts[0].views) : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 dark:text-neutral-100">
        Dashboard
      </h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 p-5">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Total Views
          </p>
          <p className="text-3xl font-bold dark:text-neutral-100">
            {totalViews.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 p-5">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Total Likes
          </p>
          <p className="text-3xl font-bold dark:text-neutral-100">
            {totalLikes.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 p-5">
          <p className="text-sm text-gray-500 dark:text-neutral-400">
            Total Comments
          </p>
          <p className="text-3xl font-bold dark:text-neutral-100">
            {totalComments.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Bar Chart */}
      {chartPosts.length > 0 && (
        <div className="bg-white dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 p-5 mb-8">
          <h2 className="text-lg font-semibold mb-4 dark:text-neutral-100">
            Views by Post
          </h2>
          <div className="space-y-3">
            {chartPosts.map((post) => {
              const views = getCount(post.views);
              const pct = maxViews > 0 ? (views / maxViews) * 100 : 0;
              return (
                <div key={post.id} className="flex items-center gap-3">
                  <span className="text-sm truncate w-40 shrink-0 dark:text-neutral-100">
                    {post.title}
                  </span>
                  <div className="flex-1 h-7 rounded-md bg-gray-100 dark:bg-neutral-900 overflow-hidden">
                    <div
                      className="h-full rounded-md bg-blue-500/20 dark:bg-blue-500/30 flex items-center px-2 transition-all duration-300"
                      style={{ width: `${Math.max(pct, 2)}%` }}
                    >
                      <span className="text-xs font-medium text-blue-500 whitespace-nowrap">
                        {views.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Posts Table */}
      <div className="bg-white dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-neutral-800 text-left text-gray-500 dark:text-neutral-400">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium text-right">Views</th>
                <th className="px-5 py-3 font-medium text-right">Likes</th>
                <th className="px-5 py-3 font-medium text-right">Comments</th>
                <th className="px-5 py-3 font-medium text-right">Published</th>
              </tr>
            </thead>
            <tbody>
              {sortedByViews.map((post) => (
                <tr
                  key={post.id}
                  className="border-b last:border-b-0 dark:border-neutral-800 hover:bg-gray-50 dark:hover:bg-neutral-900 transition-colors"
                >
                  <td className="px-5 py-3 font-medium dark:text-neutral-100">
                    {post.title}
                  </td>
                  <td className="px-5 py-3 text-right dark:text-neutral-100">
                    {getCount(post.views).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right dark:text-neutral-100">
                    {getCount(post.likes).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right dark:text-neutral-100">
                    {getCount(post.comments).toLocaleString()}
                  </td>
                  <td className="px-5 py-3 text-right text-gray-500 dark:text-neutral-400">
                    {new Date(post.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {sortedByViews.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-gray-500 dark:text-neutral-400"
                  >
                    No published posts yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <SideBar>
      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500 dark:text-neutral-400">
              Loading...
            </div>
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </SideBar>
  );
}
