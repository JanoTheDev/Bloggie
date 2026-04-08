"use client";

import { useAtom } from "jotai";
import { userAccount } from "@/atoms/userAccount";
import Link from "next/link";
import Image from "next/image";
import { IconVerified, IconLocation, IconWork } from "@/components/Icons";
import { useToast } from "@/components/Toast";
import type { User, BlogUser } from "@/types";

export default function UserCardInfo({ data }: { data: User | BlogUser }) {
  const [userAcc] = useAtom(userAccount);
  const toast = useToast();
  const isFollowing = "followers" in data && data.followers?.includes(userAcc.user_id);

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800">
      <Link href={`/profile/${data.user_id}`} className="shrink-0">
        <Image src={data.profile_picture} alt={data.username} width={48} height={48} className="rounded-full object-cover" />
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link href={`/profile/${data.user_id}`} className="font-semibold text-gray-900 dark:text-white truncate hover:underline">
            {data.username}
          </Link>
          {data.verified && <IconVerified className="w-4 h-4 text-blue-500 shrink-0" />}
          {data.location && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 ml-2">
              <IconLocation className="w-3.5 h-3.5" /> {data.location}
            </span>
          )}
          {data.work_place && (
            <span className="hidden sm:flex items-center gap-1 text-xs text-gray-400 ml-2">
              <IconWork className="w-3.5 h-3.5" /> {data.work_place}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          {"followers" in data && <span className="text-sm text-gray-500 dark:text-gray-400">{data.followers?.length || 0} followers</span>}
          <span className="text-gray-300 dark:text-gray-600">·</span>
          <span className="text-sm text-gray-400 dark:text-gray-500 truncate">{data.user_description}</span>
        </div>
      </div>

      <button
        onClick={() => toast(isFollowing ? `Unfollowed ${data.username}` : `Following ${data.username}`, "success")}
        className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
          isFollowing
            ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
            : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
        }`}
      >
        {isFollowing ? "Following" : "Follow"}
      </button>
    </div>
  );
}
