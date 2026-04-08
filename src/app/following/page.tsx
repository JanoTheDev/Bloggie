"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import React, { Suspense, useEffect, useState } from "react";

export default function Following() {
  const [data, setData] = useState<any[]>([]);
  const [userAcc] = useAtom(userAccount);

  useEffect(() => {
    const usersToShow = AllUserData.filter((user) =>
      userAcc.following.includes(user.user_id)
    );
    const blogPostsToShow = BlogData.filter((post) =>
      post.user.followers?.includes(userAcc.user_id)
    );

    const sortedData: any[] = [];
    for (const user of usersToShow) {
      sortedData.push(user);
      const userBlogPosts = blogPostsToShow.filter(
        (post) => post.user.user_id === user.user_id
      );
      sortedData.push(...userBlogPosts);
    }
    setData(sortedData);
  }, [userAcc.profiles_opened, userAcc.user_id]);

  const blogs = data.filter((x) => x.cardID);
  const users = data.filter((x) => !x.cardID);

  return (
    <Suspense>
      <SideBar>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Following</h1>

        {users.length > 0 && (
          <div className="flex flex-col gap-3 mb-8">
            {users.map((x: any, i: number) => (
              <UserCardInfo data={x} key={i} />
            ))}
          </div>
        )}

        {blogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {blogs.map((x: any, i: number) => (
              <SmallCardInfo data={x} key={i} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-12">No posts from people you follow yet.</p>
        )}
      </SideBar>
    </Suspense>
  );
}
