"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import Image from "next/image";
import { IconEye, IconHeart, IconBookmark, IconVerified } from "@/components/Icons";
import { useToast } from "@/components/Toast";
import { relativeTime, readingTime } from "@/lib/utils";
import type { BlogPost } from "@/types";

export const searchBarFilter = atom<string>("");

const BLUR_DATA_URL = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iMjYiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjI2IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+";

export default function SmallCardInfo({ data }: { data: BlogPost }) {
  const router = useRouter();
  const [, setFilterQuery] = useAtom(searchBarFilter);
  const toast = useToast();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  function handleTag(e: React.MouseEvent, tag: string) {
    e.preventDefault();
    e.stopPropagation();
    setFilterQuery(tag);
    router.push(`/results?fq=${encodeURIComponent(tag)}`);
  }

  function handleLike(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setLiked(!liked);
    toast(liked ? "Removed like" : "Liked post", "success");
  }

  function handleSave(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setSaved(!saved);
    toast(saved ? "Removed from saved" : "Saved for later", "success");
  }

  return (
    <Link
      href={`/blog/${data.cardID}`}
      className="group block bg-white dark:bg-neutral-950 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-neutral-800 transition-all duration-200"
    >
      <div className="aspect-[3/2] overflow-hidden relative">
        <Image
          src={data.info.image}
          alt={data.info.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          placeholder="blur"
          blurDataURL={BLUR_DATA_URL}
        />
      </div>

      <div className="p-4">
        {data.info.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.info.tags.slice(0, 3).map((tag, i) => (
              <button key={i} onClick={(e) => handleTag(e, tag)} className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
            {data.info.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium text-gray-400">+{data.info.tags.length - 3}</span>
            )}
          </div>
        )}

        <button onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push(`/profile/${data.user.user_id}`); }} className="flex items-center gap-2 mb-2">
          <Image src={data.user.profile_picture} alt={data.user.username} width={24} height={24} className="rounded-full object-cover" />
          <span className="text-sm text-gray-500 dark:text-neutral-400 font-medium">{data.user.username}</span>
          {data.user.verified && <IconVerified className="w-4 h-4 text-blue-500" />}
        </button>

        <h3 className="font-semibold text-gray-900 dark:text-neutral-100 mb-1 line-clamp-1">{data.info.name}</h3>
        <p className="text-sm text-gray-500 dark:text-neutral-400 line-clamp-2">{data.info.shortDescription}</p>

        <div className="flex items-center gap-2 mt-2 text-xs text-gray-400 dark:text-neutral-500">
          <span>{relativeTime(data.info.time_posted)}</span>
          <span>·</span>
          <span>{readingTime(data.info.data)}</span>
        </div>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <IconEye className="w-4 h-4" /> {data.info.views_count.length}
            </span>
            <button onClick={handleLike} className={`flex items-center gap-1 text-xs transition-colors ${liked ? "text-red-500" : "text-gray-400 hover:text-red-400"}`} aria-label={liked ? "Unlike" : "Like"}>
              <IconHeart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} /> {data.info.like_count.length + (liked ? 1 : 0)}
            </button>
          </div>
          <button onClick={handleSave} className={`flex items-center gap-1 text-xs transition-colors ${saved ? "text-blue-500" : "text-gray-400 hover:text-blue-400"}`} aria-label={saved ? "Unsave" : "Save"}>
            <IconBookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} /> {data.info.read_later.length + (saved ? 1 : 0)}
          </button>
        </div>
      </div>
    </Link>
  );
}
