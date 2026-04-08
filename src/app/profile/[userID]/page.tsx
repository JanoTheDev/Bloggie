"use client";

import { userAccount } from "@/atoms/userAccount";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { AllUserData } from "@/data/AllUserData";
import { BlogData } from "@/data/BlogData";
import { useAtom } from "jotai";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IconVerified, IconLocation, IconWork } from "@/components/Icons";
import { useToast } from "@/components/Toast";
import type { User, BlogPost } from "@/types";

export default function OtherProfile() {
  const { userID } = useParams<{ userID: string }>();
  const [userAcc] = useAtom(userAccount);
  const toast = useToast();
  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [viewed, setViewed] = useState<BlogPost[]>([]);
  const [liked, setLiked] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userID) return;
    setProfile(AllUserData.find((u) => u.user_id === userID) || null);
    setPosts(BlogData.filter((d) => d.user.user_id === userID));
    setViewed(BlogData.filter((d) => d.info.views_count.includes(userID) && d.user.user_id !== userID));
    setLiked(BlogData.filter((d) => d.info.like_count.includes(userID) && d.user.user_id !== userID));
    setLoading(false);
  }, [userID]);

  if (loading) return <SideBar><SkeletonGrid count={3} /></SideBar>;
  if (!profile) return <SideBar><div className="text-center py-16"><p className="text-gray-400 dark:text-gray-500 text-lg">User not found</p></div></SideBar>;

  const isOwn = profile.user_id === userAcc.user_id;
  const isFollowing = profile.followers.includes(userAcc.user_id);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{isOwn ? "Your" : `${profile.username}'s`} Profile</h1>

      <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <Image src={profile.profile_picture} alt={profile.username} width={80} height={80} className="rounded-full object-cover" />
          <div className="flex-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">{profile.username}</h2>
              {profile.verified && <IconVerified className="w-5 h-5 text-blue-500" />}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.followers.length} followers</p>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{profile.user_description}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><IconLocation className="w-4 h-4" /> {profile.location}</span>
              <span className="flex items-center gap-1"><IconWork className="w-4 h-4" /> {profile.work_place}</span>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {profile.skills.map((skill, i) => (
                <span key={i} className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-full">{skill}</span>
              ))}
            </div>
          </div>
          <button
            onClick={() => { if (!isOwn) toast(isFollowing ? `Unfollowed ${profile.username}` : `Following ${profile.username}`, "success"); }}
            className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              isOwn ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              : isFollowing ? "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
              : "bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100"
            }`}
          >
            {isOwn ? "Edit" : isFollowing ? "Following" : "Follow"}
          </button>
        </div>
      </div>

      {posts.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{posts.length} posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
          </div>
        </section>
      )}
      {viewed.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{viewed.length} viewed</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {viewed.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
          </div>
        </section>
      )}
      {liked.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{liked.length} liked</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {liked.map((p) => <SmallCardInfo data={p} key={p.cardID} />)}
          </div>
        </section>
      )}
    </SideBar>
  );
}
