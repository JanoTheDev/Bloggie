"use client";

import { userAccount } from "@/atoms/userAccount";
import Navbar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import Link from "next/link";
import React, { Suspense, useEffect, useState } from "react";

export default function Profile() {
  const [userAcc] = useAtom(userAccount);
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userHistory, setUserHistory] = useState<any[]>([]);
  const [userLiked, setUserLiked] = useState<any[]>([]);

  useEffect(() => {
    setUserPosts(BlogData.filter((d) => d.user.user_id === userAcc.user_id));
    setUserHistory(
      BlogData.filter(
        (d) =>
          d.info.views_count.includes(userAcc.user_id) &&
          d.user.user_id !== userAcc.user_id
      )
    );
    setUserLiked(
      BlogData.filter(
        (d) =>
          d.info.like_count.includes(userAcc.user_id) &&
          d.user.user_id !== userAcc.user_id
      )
    );
  }, [userAcc]);

  return (
    <Suspense>
      <Navbar>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Your Profile</h1>

        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={userAcc.profile_picture}
              alt={userAcc.username}
              className="w-20 h-20 rounded-full object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl font-bold text-gray-900">{userAcc.username}</h2>
                {userAcc.verified && (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-blue-500">
                    <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <p className="text-sm text-gray-500 mt-1">{userAcc.followers.length} followers</p>
              <p className="text-sm text-gray-600 mt-1">{userAcc.user_description}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  {userAcc.location}
                </span>
                <span className="flex items-center gap-1">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
                  </svg>
                  {userAcc.work_place}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {userAcc.skills.map((skill: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-3 mt-4">
                {userAcc.socials.github && (
                  <Link href={userAcc.socials.github} className="text-gray-400 hover:text-gray-600">GitHub</Link>
                )}
                {userAcc.socials.twitter && (
                  <Link href={userAcc.socials.twitter} className="text-gray-400 hover:text-gray-600">Twitter</Link>
                )}
              </div>
            </div>
            <button className="px-4 py-2 text-sm font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Edit Profile
            </button>
          </div>
        </div>

        {userPosts.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{userPosts.length} posts</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {userPosts.map((x: any, i: number) => (
                <SmallCardInfo data={x} key={i} />
              ))}
            </div>
          </section>
        )}

        {userHistory.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{userHistory.length} viewed</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {userHistory.map((x: any, i: number) => (
                <SmallCardInfo data={x} key={i} />
              ))}
            </div>
          </section>
        )}

        {userLiked.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">{userLiked.length} liked</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {userLiked.map((x: any, i: number) => (
                <SmallCardInfo data={x} key={i} />
              ))}
            </div>
          </section>
        )}
      </Navbar>
    </Suspense>
  );
}
