"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { SkeletonGrid, SkeletonUserCard } from "@/components/Skeleton";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import type { BlogPost, User } from "@/types";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [userAcc] = useAtom(userAccount);

  useEffect(() => {
    const shuffledBlogs = [...BlogData].sort(() => Math.random() - 0.5);
    const shuffledUsers = [...AllUserData].sort(() => Math.random() - 0.5);
    setBlogs(shuffledBlogs);
    setUsers(shuffledUsers.slice(0, 4));
    setLoading(false);
  }, [userAcc.user_id]);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Home</h1>

      {loading ? (
        <>
          <SkeletonGrid count={6} />
          <div className="flex flex-col gap-3 mt-8">
            <SkeletonUserCard />
            <SkeletonUserCard />
          </div>
        </>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
            {blogs.slice(0, 6).map((post) => (
              <SmallCardInfo data={post} key={post.cardID} />
            ))}
          </div>

          {users.length > 0 && (
            <div className="mb-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-3">Suggested for you</h2>
              <div className="flex flex-col gap-3">
                {users.map((user) => (
                  <UserCardInfo data={user} key={user.user_id} />
                ))}
              </div>
            </div>
          )}

          {blogs.length > 6 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {blogs.slice(6).map((post) => (
                <SmallCardInfo data={post} key={post.cardID} />
              ))}
            </div>
          )}
        </>
      )}
    </SideBar>
  );
}
