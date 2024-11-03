"use client"

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function OtherProfile() {
  const params = useParams();
  const userID = params.userID;

  const [userAcc, setUserAcc] = useAtom(userAccount);
  const [userProfile, setUserProfile] = useState<any>({});
  const [userPosts, setUserPosts] = useState<any[]>([]);
  const [userHistory, setUserHistory] = useState<any>({});
  const [userLiked, setUserLiked] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log(userID)
    if (userID) {
      const userData = AllUserData.find((data) => data.user_id === userID);
      if (userData) {
        setUserProfile(userData);
      }
    }
  }, [userID]);

  useEffect(() => {
    if (userID) {
      const filteredPosts = BlogData.filter(
        (data) => data.user.user_id === userID
      );
      setUserPosts(filteredPosts);

      const filteredHistory = BlogData.filter((data) => {
        return (
          data.info.views_count.includes(userID as string) &&
          data.user.user_id !== userID
        );
      });
      setUserHistory(filteredHistory);

      const filteredLiked = BlogData.filter((data) => {
        return (
          data.info.like_count.includes(userID as string) &&
          data.user.user_id !== userID
        );
      });
      setUserLiked(filteredLiked);

      setLoading(false);
    }
  }, [userID]);

  return (
    <div>
      <SideBar>
        <div>
          {loading === false && userProfile.user_id ? (
            <div className="ml-6 lg:ml-0">
              <p className="text-3xl font-bold ml-6 text-center lg:text-start pb-6 border-b-2 border-black mr-6 mb-6">
                {userProfile.username === userAcc.username ? `Your` : `${userProfile.username}'s`} Profile
              </p>
              <div className="flex flex-col space-y-6 lg:space-y-0 lg:flex-none lg:grid lg:grid-cols-2">
                <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-start">
                  <img
                    src={userProfile.profile_picture}
                    alt=""
                    className="flex w-24 h-24 mr-8 rounded-full ml-6"
                  />
                  <div className="flex flex-col items-center lg:items-start justify-center">
                    <div className="flex items-center">
                      <p className="text-2xl font-bold mr-2">
                        {userProfile.username}
                      </p>
                      {userProfile.verified === true ? (
                        <div className="relative group">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                            />
                          </svg>
                          <div className="absolute bottom-6 rounded-lg left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs py-1 px-2 opacity-0 lg:group-hover:opacity-100 transition-opacity duration-300">
                            Verified
                          </div>
                        </div>
                      ) : (
                        <></>
                      )}
                    </div>

                    <p className="text-lg font-semibold text-gray-600">
                      {userProfile.followers.length} followers
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {userProfile.user_description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-center lg:justify-end lg:mr-12">
                  <button className="text-white bg-gray-600 text-lg rounded-lg px-4 py-2 ">
                    {userProfile.user_id === userAcc.user_id
                      ? "Edit"
                      : userProfile.followers.includes(userAcc.user_id)
                      ? "Following"
                      : "Follow"}
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 pt-6 lg:pl-5">
                <div className="flex space-x-4 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                    />
                  </svg>
                  {userProfile.location}
                </div>
                <div className="flex space-x-4 ">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z"
                    />
                  </svg>

                  {userProfile.work_place}
                </div>

                <Link href={userProfile.socials.github}>
                  <img
                    src="https://cdn.discordapp.com/attachments/1038339416843886612/1152197162021691443/github.png"
                    alt="Github"
                    className="w-6 h-6"
                  />
                </Link>
                <Link href={userProfile.socials.twitter}>
                  <img
                    src="https://cdn.discordapp.com/attachments/1038339416843886612/1152197587726782514/twitter1.png"
                    alt="X"
                    className="w-6 h-6"
                  />
                </Link>
                <Link href={userProfile.socials.youtube}>
                  <img
                    src="https://cdn.discordapp.com/attachments/1038339416843886612/1152198303027576833/youtube.png"
                    alt="Youtube"
                    className="w-6 h-6"
                  />
                </Link>
                <Link href={userProfile.socials.instagram}>
                  <img
                    src="https://cdn.discordapp.com/attachments/1038339416843886612/1152198388947898378/instagram.png"
                    alt="Instagram"
                    className="w-6 h-6"
                  />
                </Link>
              </div>
              <div className="flex flex-wrap gap-6 pt-6 lg:pl-6">
                <p>Skills: {userProfile.skills.join(", ")}</p>
              </div>

              {userPosts.length > 0 ? (
                <div>
                  <p className="mt-12 text-xl pl-6">
                    {userPosts.length} posts
                  </p>

                  <div className="items-center justify-center flex lg:pt-0 lg:justify-start lg:items-start pb-6">
                    <div className="flex overflow-x-auto gap-3">
                      {userPosts.map((x: any, i: number) => (
                        <SmallCardInfo data={x} key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {userHistory.length > 0 ? (
                <div>
                  <p className="text-xl pl-6">
                    {userHistory.length} viewed blogs
                  </p>

                  <div className="items-center justify-center flex lg:pt-0 lg:justify-start lg:items-start pb-6">
                    <div className="flex overflow-x-auto gap-3">
                      {userHistory.map((x: any, i: number) => (
                        <SmallCardInfo data={x} key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}

              {userLiked.length > 0 ? (
                <div>
                  <p className="text-xl pl-6">
                    {userLiked.length} liked blogs
                  </p>

                  <div className="items-center justify-center flex lg:pt-0 lg:justify-start lg:items-start pb-6">
                    <div className="flex overflow-x-auto gap-3">
                      {userLiked.map((x: any, i: number) => (
                        <SmallCardInfo data={x} key={i} />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </div>
          ) : loading === false && !userProfile.user_id ? (
            <p className="text-center font-bold text-2xl">User not found</p>
          ) : loading === true && !userProfile.user_id ? (
            <p className="text-center font-bold text-2xl">Loading</p>
          ) : (
            <></>
          )}
        </div>
      </SideBar>
    </div>
  );
}