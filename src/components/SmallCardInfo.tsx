"use client";

import { useRouter } from "next/navigation";
import { atom, useAtom } from "jotai";
import Link from "next/link";
import Image from "next/image";
import { IconEye, IconHeart, IconBookmark, IconVerified } from "@/components/Icons";
import type { BlogPost } from "@/types";

export const searchBarFilter = atom<string>("");

export default function SmallCardInfo({ data }: { data: BlogPost }) {
  const router = useRouter();
  const [, setFilterQuery] = useAtom(searchBarFilter);

  function handleTag(e: React.MouseEvent, tag: string) {
    e.preventDefault();
    e.stopPropagation();
    setFilterQuery(tag);
    router.push(`/results?fq=${encodeURIComponent(tag)}`);
  }

  return (
    <Link
      href={`/blog/${data.cardID}`}
      className="group block bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-800 transition-all duration-200"
    >
      <div className="aspect-[3/2] overflow-hidden relative">
        <Image
          src={data.info.image}
          alt={data.info.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="p-4">
        {data.info.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.info.tags.slice(0, 3).map((tag, i) => (
              <button key={i} onClick={(e) => handleTag(e, tag)} className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
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
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">{data.user.username}</span>
          {data.user.verified && <IconVerified className="w-4 h-4 text-blue-500" />}
        </button>

        <h3 className="font-semibold text-gray-900 dark:text-white mb-1 line-clamp-1">{data.info.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{data.info.shortDescription}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <IconEye className="w-4 h-4" /> {data.info.views_count.length}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <IconHeart className="w-4 h-4" /> {data.info.like_count.length}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <IconBookmark className="w-4 h-4" /> {data.info.read_later.length}
          </span>
        </div>
      </div>
    </Link>
  );
}
