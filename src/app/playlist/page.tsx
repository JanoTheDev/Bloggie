"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";
import type { BlogPost, User } from "@/types";

const titles: Record<string, string> = { RH: "Blog History", LB: "Liked Blogs", RL: "Read Later" };

function PlaylistContent() {
  const searchParams = useSearchParams();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAcc] = useAtom(userAccount);
  const list = searchParams.get("list") || "";

  useEffect(() => {
    let filteredUsers: User[] = [];
    let filteredBlogs: BlogPost[] = [];

    if (list === "RH") {
      filteredUsers = AllUserData.filter((u) => userAcc.profiles_opened.includes(u.user_id));
      filteredBlogs = BlogData.filter((p) => p.info.views_count.includes(userAcc.user_id));
    } else if (list === "RL") {
      filteredUsers = AllUserData.filter((u) => userAcc.read_later.includes(u.user_id));
      filteredBlogs = BlogData.filter((p) => p.info.read_later.includes(userAcc.user_id));
    } else if (list === "LB") {
      filteredUsers = AllUserData.filter((u) => userAcc.liked_blogs.includes(u.user_id));
      filteredBlogs = BlogData.filter((p) => p.info.like_count.includes(userAcc.user_id));
    }

    setUsers(filteredUsers);
    setBlogs(filteredBlogs);
    setLoading(false);
  }, [searchParams, userAcc, list]);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{titles[list] || "Playlist"}</h1>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : blogs.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-gray-500 text-lg">Nothing here yet.</p>
          <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Start browsing to fill this list.</p>
        </div>
      ) : (
        <>
          {users.length > 0 && (
            <div className="flex flex-col gap-3 mb-8">
              {users.map((u) => <UserCardInfo data={u} key={u.user_id} />)}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {blogs.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
          </div>
        </>
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
