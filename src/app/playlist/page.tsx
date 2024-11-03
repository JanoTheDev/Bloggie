"use client"

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
  const searchParams = useSearchParams()
  const [data, setData] = useState<any>([]);
  const [userAcc, setUserAcc] = useAtom(userAccount);
  const [routerList, setRouterList] = useState<any>()

  const findList = () => {
    const list = searchParams.get("list");
    setRouterList(list);
    if (list === "RH") {
      const usersToShow = AllUserData.filter((user) =>
        userAcc.profiles_opened.includes(user.user_id)
      );

      const blogPostsToShow = BlogData.filter((post) =>
        post.info.views_count.includes(userAcc.user_id)
      );

      const sortedData = [];

      for (const user of usersToShow) {
        sortedData.push(user);
        const userBlogPosts = blogPostsToShow.filter(
          (post) => post.user.user_id === user.user_id
        );
        sortedData.push(...userBlogPosts);
      }

      setData(sortedData);
    } else if (list === "RL") {
      const usersToShow = AllUserData.filter((user) =>
        userAcc.read_later.includes(user.user_id)
      );

      const blogPostsToShow = BlogData.filter((post) =>
        post.info.read_later.includes(userAcc.user_id)
      );

      const sortedData = [];

      for (const user of usersToShow) {
        const userBlogPosts = blogPostsToShow.filter(
          (post) => post.user.user_id === user.user_id
        );

        if (userBlogPosts.length > 0) {
          sortedData.push(user);
          sortedData.push(...userBlogPosts);
        }
        setData(sortedData);
      }
    } else if (list === "LB") {
      const usersToShow = AllUserData.filter((user) =>
        userAcc.liked_blogs.includes(user.user_id)
      );

      const blogPostsToShow = BlogData.filter((post) =>
        post.info.like_count.includes(userAcc.user_id)
      );

      const sortedData = [];

      for (const user of usersToShow) {
        const userBlogPosts = blogPostsToShow.filter(
          (post) => post.user.user_id === user.user_id
        );

        if (userBlogPosts.length > 0) {
          sortedData.push(user);
          sortedData.push(...userBlogPosts);
        }
        setData(sortedData);
      }
    }
  }

  useEffect(() => {
    findList();
  }, []);

  return (
    <SideBar>
      <p className="text-3xl font-bold ml-6 text-center lg:text-start pb-6 border-b-2 border-black mr-6 mb-6">
        {routerList === "RH" ? "Blog history" : routerList === "LB" ? "Liked blogs" : "Read blogs later"}
      </p>
      <div
        className="lg:ml-0"
        style={{
          display: "flex",
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        {data.map((x: any, i: number) => (
          <React.Fragment key={i}>
            <div className="items-center justify-center flex pt-6 lg:pt-0 lg:justify-start lg:items-start pb-6">
              <div className="flex justify-center lg:justify-start lg:pl-3">
                {x.cardID && <SmallCardInfo data={x} />}
              </div>
            </div>
            {!x.cardID && (
              <div className="w-full pt-6 pb-6 lg:pt-0 ">
                <UserCardInfo data={x} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </SideBar>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlaylistContent />
    </Suspense>
  );
}