"use client";

import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { getProfile, getPostsByAuthor, toggleFollow, isFollowing as checkFollowing } from "@/lib/supabase/api";
import { useUser } from "@/lib/supabase/hooks";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { IconLocation, IconWork } from "@/components/Icons";
import { useToast } from "@/components/Toast";

export default function OtherProfile() {
  const { userID } = useParams<{ userID: string }>();
  const { user } = useUser();
  const toast = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  useEffect(() => {
    if (!userID) return;
    Promise.all([
      getProfile(userID),
      getPostsByAuthor(userID),
    ]).then(([p, posts]) => {
      setProfile(p);
      setPosts(posts || []);
    }).catch(() => {})
    .finally(() => setLoading(false));

    if (user) {
      checkFollowing(userID).then(setFollowing).catch(() => {});
    }
  }, [userID, user]);

  const isOwn = user?.id === userID;

  async function handleFollow() {
    if (!user) { toast("Sign in to follow", "info"); return; }
    try {
      const { following: now } = await toggleFollow(userID);
      setFollowing(now);
      toast(now ? `Following ${profile.username}` : `Unfollowed ${profile.username}`, "success");
    } catch { toast("Failed", "error"); }
  }

  if (loading) return <SideBar><SkeletonGrid count={3} /></SideBar>;
  if (!profile) return <SideBar><div className="text-center py-16"><p className="text-gray-400 dark:text-neutral-500 text-lg">User not found</p></div></SideBar>;

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">{isOwn ? "Your" : `${profile.username}'s`} Profile</h1>

      <div className="bg-white dark:bg-neutral-950 rounded-xl border border-gray-100 dark:border-neutral-800 p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
          {profile.avatar_url ? (
            <Image src={profile.avatar_url} alt={profile.username} width={80} height={80} className="rounded-full object-cover" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-neutral-800" />
          )}
          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900 dark:text-neutral-100">{profile.username}</h2>
            {profile.bio && <p className="text-sm text-gray-600 dark:text-neutral-300 mt-1">{profile.bio}</p>}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-gray-500 dark:text-neutral-400">
              {profile.location && <span className="flex items-center gap-1"><IconLocation className="w-4 h-4" /> {profile.location}</span>}
              {profile.work_place && <span className="flex items-center gap-1"><IconWork className="w-4 h-4" /> {profile.work_place}</span>}
            </div>
            {profile.skills?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {profile.skills.map((s: string, i: number) => (
                  <span key={i} className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 rounded-full">{s}</span>
                ))}
              </div>
            )}
          </div>
          {!isOwn && (
            <button onClick={handleFollow} className={`shrink-0 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${following ? "bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300" : "bg-gray-900 dark:bg-neutral-100 text-white dark:text-black"}`}>
              {following ? "Following" : "Follow"}
            </button>
          )}
        </div>
      </div>

      {posts.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-neutral-100 mb-3">{posts.length} posts</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {posts.map((p: any) => <SmallCardInfo data={p} key={p.id} />)}
          </div>
        </section>
      )}
    </SideBar>
  );
}
