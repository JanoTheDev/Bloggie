"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { relativeTime, readingTime } from "@/lib/utils";

interface RelatedPost {
  id: string;
  slug: string;
  title: string;
  cover_image: string | null;
  content: string;
  created_at: string;
  author: { username: string; avatar_url: string | null } | null;
}

const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI2IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+";

export default function RelatedPosts({
  currentPostId,
  tags,
}: {
  currentPostId: string;
  tags: string[];
}) {
  const [posts, setPosts] = useState<RelatedPost[]>([]);

  useEffect(() => {
    if (tags.length === 0) return;

    const supabase = createClient();

    supabase
      .from("posts")
      .select("id, slug, title, cover_image, content, created_at, author:profiles(username, avatar_url)")
      .eq("published", true)
      .neq("id", currentPostId)
      .overlaps("tags", tags)
      .limit(3)
      .then(({ data }) => {
        if (data) setPosts(data as unknown as RelatedPost[]);
      });
  }, [currentPostId, tags]);

  if (posts.length === 0) return null;

  return (
    <section>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-4">
        Related Posts
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {posts.map((post) => {
          const cover =
            post.cover_image || `https://picsum.photos/seed/${post.slug}/600/400`;
          const author = post.author;

          return (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="group block bg-white dark:bg-neutral-950 rounded-xl overflow-hidden border border-gray-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <div className="aspect-[3/2] overflow-hidden relative">
                <Image
                  src={cover}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA_URL}
                />
              </div>
              <div className="p-3">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-neutral-100 line-clamp-1">
                  {post.title}
                </h4>
                <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-400 dark:text-neutral-500">
                  <span>{author?.username || "Unknown"}</span>
                  <span>·</span>
                  <span>{readingTime(post.content || "")}</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
