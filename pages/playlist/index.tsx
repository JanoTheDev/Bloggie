import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import UserCardInfo from "@/components/UserCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

export default function Home() {
  const router = useRouter();
  const { list } = router.query;

  const [data, setData] = useState<any>([]);
  const [userAcc, setUserAcc] = useAtom(userAccount);

  useEffect(() => {
    if (router.isReady) {
      if (list === "RH") {
        const usersToShow = AllUserData.filter((user) =>
          userAcc.profiles_opened.includes(user.user_id)
        );

        const blogPostsToShow = BlogData.filter((post) =>
          post.info.views_count.includes(userAcc.user_id)
        );

        const sortedData = [];

        // Loop through usersToShow
        for (const user of usersToShow) {
          // Push user data to sortedData
          sortedData.push(user);

          // Filter blog posts seen by userAcc for this user
          const userBlogPosts = blogPostsToShow.filter(
            (post) => post.user.user_id === user.user_id
          );

          // Push the filtered blog posts to sortedData
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

        // Loop through usersToShow
        for (const user of usersToShow) {
          // Filter blog posts seen by userAcc for this user
          const userBlogPosts = blogPostsToShow.filter(
            (post) => post.user.user_id === user.user_id
          );

          // Only add the user if there are blog posts to show for them
          if (userBlogPosts.length > 0) {
            // Push user data to sortedData
            sortedData.push(user);

            // Push the filtered blog posts to sortedData
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

        // Loop through usersToShow
        for (const user of usersToShow) {
          // Filter blog posts seen by userAcc for this user
          const userBlogPosts = blogPostsToShow.filter(
            (post) => post.user.user_id === user.user_id
          );

          // Only add the user if there are blog posts to show for them
          if (userBlogPosts.length > 0) {
            // Push user data to sortedData
            sortedData.push(user);

            // Push the filtered blog posts to sortedData
            sortedData.push(...userBlogPosts);
          }
          setData(sortedData);
        }
      }
    }
  }, [list, router.isReady, userAcc.profiles_opened, userAcc.user_id]);

  return (
    <div>
      <SideBar>
        <p className="text-3xl font-bold pl-6 text-center lg:text-start">
          {list === "RH" ? "Blog history" : list === "LB" ? "Liked blogs" : "Read blogs later"}
        </p>
        <div
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
    </div>
  );
}
