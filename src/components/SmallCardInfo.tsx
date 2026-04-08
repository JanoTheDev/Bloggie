"use client";

import { useRouter } from "next/navigation";
import { atom, useAtom } from "jotai";
import Link from "next/link";

export const searchBarFilter = atom<string>("");

interface Props {
  data: any;
}

export default function SmallCardInfo({ data }: Props) {
  const router = useRouter();
  const [, setFilterQuery] = useAtom(searchBarFilter);

  function handleTag(e: React.MouseEvent, tag: string) {
    e.preventDefault();
    e.stopPropagation();
    setFilterQuery(tag);
    window.location.href = `/results?fq=${encodeURIComponent(tag)}`;
  }

  return (
    <Link
      href={`/blog/${data.cardID}`}
      className="group block bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md border border-gray-100 transition-all duration-200"
    >
      <div className="aspect-[3/2] overflow-hidden">
        <img
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          src={data.info.image}
          alt={data.info.name}
        />
      </div>

      <div className="p-4">
        {data.info.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {data.info.tags.slice(0, 3).map((tag: string, i: number) => (
              <button
                key={i}
                onClick={(e) => handleTag(e, tag)}
                className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors"
              >
                {tag.charAt(0).toUpperCase() + tag.slice(1)}
              </button>
            ))}
            {data.info.tags.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-medium text-gray-400">
                +{data.info.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            router.push(`/profile/${data.user.user_id}`);
          }}
          className="flex items-center gap-2 mb-2"
        >
          <img
            src={data.user.profile_picture}
            alt={data.user.username}
            className="w-6 h-6 rounded-full object-cover"
          />
          <span className="text-sm text-gray-500 font-medium">{data.user.username}</span>
          {data.user.verified && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          )}
        </button>

        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{data.info.name}</h3>
        <p className="text-sm text-gray-500 line-clamp-2">{data.info.shortDescription}</p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {data.info.views_count.length}
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {data.info.like_count.length}
            </span>
          </div>
          <span className="flex items-center gap-1 text-xs text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
            {data.info.read_later.length}
          </span>
        </div>
      </div>
    </Link>
  );
}
