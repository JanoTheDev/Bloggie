"use client";

import { userAccount } from "@/atoms/userAccount";
import Navbar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { IconVerified, IconLocation, IconWork } from "@/components/Icons";
import type { BlogPost } from "@/types";

export default function Profile() {
  const [userAcc] = useAtom(userAccount);
  const [userPosts, setUserPosts] = useState<BlogPost[]>([]);
  const [userHistory, setUserHistory] = useState<BlogPost[]>([]);
  const [userLiked, setUserLiked] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setUserPosts(BlogData.filter((d) => d.user.user_id === userAcc.user_id));
    setUserHistory(BlogData.filter((d) => d.info.views_count.includes(userAcc.user_id) && d.user.user_id !== userAcc.user_id));
    setUserLiked(BlogData.filter((d) => d.info.like_count.includes(userAcc.user_id) && d.user.user_id !== userAcc.user_id));
    setLoading(false);
  }, [userAcc]);

  return (
    <Suspense>
      <Navbar>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Your Profile</h1>

        <div className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Image src={userAcc.profile_picture} alt={userAcc.username} width={80} height={80} className="rounded-full object-cover" />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">{userAcc.username}</h2>
                {userAcc.verified && <IconVerified className="w-5 h-5 text-blue-500" />}
              </div>
              <p className="text-sm text-gray-500 dark:text-neutral-400 mt-1">{userAcc.followers.length} followers</p>
              <p className="text-sm text-gray-600 dark:text-neutral-300 mt-1">{userAcc.user_description}</p>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-neutral-400">
                <span className="flex items-center gap-1"><IconLocation className="w-4 h-4" /> {userAcc.location}</span>
                <span className="flex items-center gap-1"><IconWork className="w-4 h-4" /> {userAcc.work_place}</span>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {userAcc.skills.map((skill: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">Edit Profile</button>
          </div>
        </div>

        {loading ? <SkeletonGrid count={3} /> : (
          <>
            {userPosts.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-3">{userPosts.length} posts</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {userPosts.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
                </div>
              </section>
            )}
            {userHistory.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-3">{userHistory.length} viewed</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {userHistory.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
                </div>
              </section>
            )}
            {userLiked.length > 0 && (
              <section className="mb-8">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-3">{userLiked.length} liked</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {userLiked.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
                </div>
              </section>
            )}
          </>
        )}
      </Navbar>
    </Suspense>
  );
}
