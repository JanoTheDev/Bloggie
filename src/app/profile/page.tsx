"use client";

import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { getPostsByAuthor, getProfile, updateProfile } from "@/lib/supabase/api";
import { useUser } from "@/lib/supabase/hooks";
import React, { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import { IconVerified, IconLocation, IconWork } from "@/components/Icons";
import Link from "next/link";

export default function Profile() {
  const { user, loading: authLoading } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    Promise.all([
      getProfile(user.id),
      getPostsByAuthor(user.id),
    ]).then(([p, posts]) => {
      setProfile(p);
      setPosts(posts || []);
    }).catch(() => {})
    .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (!authLoading && !user) {
    return (
      <Suspense>
        <SideBar>
          <div className="text-center py-16">
            <p className="text-gray-400 dark:text-neutral-500 text-lg">Sign in to view your profile</p>
            <Link href="/login" className="mt-4 inline-block px-6 py-2.5 text-sm font-medium bg-gray-900 dark:bg-neutral-100 text-white dark:text-black rounded-lg">Sign in</Link>
          </div>
        </SideBar>
      </Suspense>
    );
  }

  return (
    <Suspense>
      <SideBar>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">Your Profile</h1>

        {loading ? <SkeletonGrid count={3} /> : profile && (
          <>
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
                <Link href="/settings" className="px-4 py-2 text-sm font-medium bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                  Edit Profile
                </Link>
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
          </>
        )}
      </SideBar>
    </Suspense>
  );
}
