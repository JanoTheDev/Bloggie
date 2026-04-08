"use client";

import Link from "next/link";
import Image from "next/image";
import { IconLocation, IconWork } from "@/components/Icons";
import { useToast } from "@/components/Toast";
import { toggleFollow } from "@/lib/supabase/api";
import { useUser } from "@/lib/supabase/hooks";
import { useState } from "react";

export default function UserCardInfo({ data }: { data: any }) {
  const { user } = useUser();
  const toast = useToast();
  const [following, setFollowing] = useState(false);

  const userId = data.user_id || data.id;
  const username = data.username || "Unknown";
  const avatar = data.profile_picture || data.avatar_url;
  const bio = data.user_description || data.bio || "";
  const isOwn = user?.id === userId;

  async function handleFollow() {
    if (!user) { toast("Sign in to follow", "info"); return; }
    if (isOwn) return;
    try {
      const { following: nowFollowing } = await toggleFollow(userId);
      setFollowing(nowFollowing);
      toast(nowFollowing ? `Following ${username}` : `Unfollowed ${username}`, "success");
    } catch { toast("Failed", "error"); }
  }

  return (
    <div className="flex items-center gap-4 p-4 bg-white dark:bg-neutral-950 rounded-xl border border-gray-100 dark:border-neutral-800">
      <Link href={`/profile/${userId}`} className="shrink-0">
        {avatar ? (
          <Image src={avatar} alt={username} width={48} height={48} className="rounded-full object-cover" />
        ) : (
          <div className="w-12 h-12 rounded-full bg-gray-200 dark:bg-neutral-800" />
        )}
      </Link>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <Link href={`/profile/${userId}`} className="font-semibold text-gray-900 dark:text-neutral-100 truncate hover:underline">
            {username}
          </Link>
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
        {bio && (
          <p className="text-sm text-gray-400 dark:text-neutral-500 truncate mt-0.5">{bio}</p>
        )}
      </div>

      {!isOwn && (
        <button
          onClick={handleFollow}
          className={`shrink-0 px-4 py-1.5 text-sm font-medium rounded-lg transition-colors ${
            following
              ? "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 hover:bg-gray-200 dark:hover:bg-neutral-800"
              : "bg-gray-900 dark:bg-neutral-100 text-white dark:text-black hover:bg-gray-800 dark:hover:bg-neutral-200"
          }`}
        >
          {following ? "Following" : "Follow"}
        </button>
      )}
    </div>
  );
}
