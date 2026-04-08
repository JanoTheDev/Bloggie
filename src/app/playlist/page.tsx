"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useSearchParams } from "next/navigation";
import React, { Suspense, useEffect, useState } from "react";

function PlaylistContent() {
  const searchParams = useSearchParams();
  const [data, setData] = useState<any[]>([]);
  const [userAcc] = useAtom(userAccount);
  const [routerList, setRouterList] = useState("");

  useEffect(() => {
    const list = searchParams.get("list") || "";
    setRouterList(list);

    let usersToShow: typeof AllUserData = [];
    let blogPostsToShow: typeof BlogData = [];

    if (list === "RH") {
      usersToShow = AllUserData.filter((user) =>
        userAcc.profiles_opened.includes(user.user_id)
      );
      blogPostsToShow = BlogData.filter((post) =>
        post.info.views_count.includes(userAcc.user_id)
      );
    } else if (list === "RL") {
      usersToShow = AllUserData.filter((user) =>
        userAcc.read_later.includes(user.user_id)
      );
      blogPostsToShow = BlogData.filter((post) =>
        post.info.read_later.includes(userAcc.user_id)
      );
    } else if (list === "LB") {
      usersToShow = AllUserData.filter((user) =>
        userAcc.liked_blogs.includes(user.user_id)
      );
      blogPostsToShow = BlogData.filter((post) =>
        post.info.like_count.includes(userAcc.user_id)
      );
    }

    const sortedData: any[] = [];
    for (const user of usersToShow) {
      const userBlogPosts = blogPostsToShow.filter(
        (post) => post.user.user_id === user.user_id
      );
      if (userBlogPosts.length > 0 || list === "RH") {
        sortedData.push(user);
        sortedData.push(...userBlogPosts);
      }
    }
    setData(sortedData);
  }, [searchParams, userAcc]);

  const title =
    routerList === "RH"
      ? "Blog History"
      : routerList === "LB"
      ? "Liked Blogs"
      : "Read Later";

  const blogs = data.filter((x) => x.cardID);
  const users = data.filter((x) => !x.cardID);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{title}</h1>

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
        <p className="text-center text-gray-500 py-12">Nothing here yet.</p>
      )}
    </SideBar>
  );
}

export default function PlaylistPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaylistContent />
    </Suspense>
  );
}
