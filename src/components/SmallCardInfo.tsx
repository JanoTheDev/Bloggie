"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { IconEye, IconHeart, IconBookmark, IconVerified } from "@/components/Icons";
import { useToast } from "@/components/Toast";
import { relativeTime, readingTime } from "@/lib/utils";
import { toggleLike, toggleBookmark } from "@/lib/supabase/api";
import { useUser } from "@/lib/supabase/hooks";

const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI2IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+";

export default function SmallCardInfo({ data }: { data: any }) {
  const router = useRouter();
  const toast = useToast();
  const { user } = useUser();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likeCount, setLikeCount] = useState(data.likes?.[0]?.count ?? 0);
  const [saveCount, setSaveCount] = useState(data.bookmarks?.[0]?.count ?? 0);

  const author = data.author || {};
  const viewCount = data.views?.[0]?.count ?? 0;
  const coverImage = data.cover_image || `https://picsum.photos/seed/${data.slug}/600/400`;

  async function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast("Sign in to like posts", "info"); return; }
    try {
      const { liked: nowLiked } = await toggleLike(data.id);
      setLiked(nowLiked);
      setLikeCount((c: number) => c + (nowLiked ? 1 : -1));
      toast(nowLiked ? "Liked" : "Unliked", "success");
    } catch { toast("Failed to like", "error"); }
  }

  async function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) { toast("Sign in to save posts", "info"); return; }
    try {
      const { bookmarked } = await toggleBookmark(data.id);
      setSaved(bookmarked);
      setSaveCount((c: number) => c + (bookmarked ? 1 : -1));
      toast(bookmarked ? "Saved" : "Removed", "success");
    } catch { toast("Failed to save", "error"); }
  }

  function handleTag(e: React.MouseEvent, tag: string) {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/results?fq=${encodeURIComponent(tag)}`);
  }

  return (
    <Link
      href={`/blog/${data.slug}`}
      className="group block bg-white dark:bg-neutral-950 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-neutral-800 transition-all duration-200"
    >
      <div className="aspect-[3/2] overflow-hidden relative">
        <Image src={coverImage} alt={data.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-300" placeholder="blur" blurDataURL={BLUR_DATA_URL} />
      </div>

      <div className="p-4">
        {data.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.tags.slice(0, 3).map((tag: string, i: number) => (
              <button key={i} onClick={(e) => handleTag(e, tag)} className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
            {data.tags.length > 3 && <span className="px-2 py-0.5 text-xs font-medium text-gray-400">+{data.tags.length - 3}</span>}
          </div>
        )}

        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/profile/${author.id}`); }} className="flex items-center gap-2 mb-2">
          {author.avatar_url && <Image src={author.avatar_url} alt={author.username || ""} width={24} height={24} className="rounded-full object-cover" />}
          <span className="text-sm text-gray-500 dark:text-neutral-400 font-medium">{author.username || "Unknown"}</span>
        </button>

        <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1 line-clamp-1">{data.title}</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">{data.short_description}</p>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-neutral-500">
          <span>{relativeTime(String(Math.floor(new Date(data.created_at).getTime() / 1000)))}</span>
          <span>·</span>
          <span>{readingTime(data.content || "")}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400"><IconEye className="w-4 h-4" /> {viewCount}</span>
            <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`} aria-label="Like">
              <IconHeart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> {likeCount}
            </button>
          </div>
          <button onClick={handleSave} className={`flex items-center gap-1 text-xs transition-colors ${saved ? "text-blue-500" : "text-gray-400 hover:text-blue-400"}`} aria-label="Save">
            <IconBookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} /> {saveCount}
          </button>
        </div>
      </div>
    </Link>
  );
}
