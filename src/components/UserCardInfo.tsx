"use client";

import { useAtom } from "jotai";
import { userAccount } from "@/atoms/userAccount";
import Link from "next/link";

interface Props {
  data: any;
}

export default function UserCardInfo({ data }: Props) {
  const [userAcc] = useAtom(userAccount);

  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-100">
      <Link href={`/profile/${data.user_id}`} className="shrink-0">
        <img
          src={data.profile_picture}
          alt={data.username}
          className="w-12 h-12 rounded-full object-cover"
        />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link
            href={`/profile/${data.user_id}`}
            className="font-semibold text-gray-900 truncate hover:underline"
          >
            {data.username}
          </Link>
          {data.verified && (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-blue-500 shrink-0">
              <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          )}
          {data.location && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {data.location}
            </span>
          )}
          {data.work_place && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 ml-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
              </svg>
              {data.work_place}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="text-sm text-gray-500">{data.followers?.length || 0} followers</span>
          <span className="text-gray-300">·</span>
          <span className="text-sm text-gray-400 truncate">{data.user_description}</span>
        </div>
      </div>

      <button
        className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          data.followers?.includes(userAcc.user_id)
            ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
            : "bg-gray-900 text-white hover:bg-gray-800"
        }`}
      >
        {data.followers?.includes(userAcc.user_id) ? "Following" : "Follow"}
      </button>
    </div>
  );
}
