"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [randomData, setRandomData] = useState<any[]>([]);
  const [userAcc] = useAtom(userAccount);

  useEffect(() => {
    const randomizedData: any[] = [];
    const shuffledBlogData = [...BlogData].sort(() => Math.random() - 0.5);
    const shuffledUserData = [...AllUserData].sort(() => Math.random() - 0.5);

    let blogIndex = 0;
    for (let i = 0; i < 5; i++) {
      const blogSlice = shuffledBlogData.slice(blogIndex, blogIndex + 5);
      randomizedData.push(...blogSlice);
      blogIndex += 5;
      if (i < 4) {
        randomizedData.push(...shuffledUserData.slice(i, i + 1));
      }
    }

    setRandomData(randomizedData);
    setLoading(false);
  }, [userAcc.user_id]);

  if (loading) return null;

  const blogs = randomData.filter((x) => x.cardID);
  const users = randomData.filter((x) => !x.cardID);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Home</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8">
        {blogs.slice(0, 6).map((x: any, i: number) => (
          <SmallCardInfo data={x} key={i} />
        ))}
      </div>

      {users.length > 0 && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Suggested for you</h2>
          <div className="flex flex-col gap-3">
            {users.map((x: any, i: number) => (
              <UserCardInfo data={x} key={i} />
            ))}
          </div>
        </div>
      )}

      {blogs.length > 6 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {blogs.slice(6).map((x: any, i: number) => (
            <SmallCardInfo data={x} key={i} />
          ))}
        </div>
      )}
    </SideBar>
  );
}
