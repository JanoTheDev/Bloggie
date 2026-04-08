"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import React, { Suspense, useEffect, useState } from "react";
import type { BlogPost, User } from "@/types";

export default function Following() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userAcc] = useAtom(userAccount);

  useEffect(() => {
    const followedUsers = AllUserData.filter((u) => userAcc.following.includes(u.user_id));
    const followedPosts = BlogData.filter((p) => p.user.followers?.includes(userAcc.user_id));
    setUsers(followedUsers);
    setBlogs(followedPosts);
    setLoading(false);
  }, [userAcc]);

  return (
    <Suspense>
      <SideBar>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Following</h1>

        {loading ? (
          <SkeletonGrid count={6} />
        ) : blogs.length === 0 && users.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-gray-500 text-lg">No activity from people you follow yet.</p>
            <p className="text-gray-400 dark:text-gray-600 text-sm mt-1">Follow creators to see their posts here.</p>
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
    </Suspense>
  );
}
