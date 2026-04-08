"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { BlogData } from "@/data/BlogData";
import SideBar from "@/components/Navbar";
import SmallCardInfo, { searchBarFilter } from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { useAtom } from "jotai";
import { searchBarText } from "@/atoms/Navbar";
import { AllUserData } from "@/data/AllUserData";
import UserCardInfo from "@/components/UserCardInfo";
import type { BlogPost, User } from "@/types";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<BlogPost[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);
  const [, setFilterQuery] = useAtom(searchBarFilter);

  useEffect(() => {
    const sq = searchParams.get("sq") || "";
    const fq = searchParams.get("fq") || "";
    setSearchQuery(sq);
    setFilterQuery(fq);

    const sqLower = sq.toLowerCase();
    const fqLower = fq.toLowerCase();

    let filtered = [...BlogData];
    if (fq) filtered = filtered.filter((p) => p.info.tags.includes(fqLower));
    if (sq) filtered = filtered.filter((p) =>
      p.user.username.toLowerCase().includes(sqLower) ||
      p.info.name.toLowerCase().includes(sqLower) ||
      p.info.shortDescription.toLowerCase().includes(sqLower)
    );
    setItems(filtered);

    if (sq) {
      setUsers(AllUserData.filter((u) =>
        u.username.toLowerCase().includes(sqLower) ||
        u.work_place.toLowerCase().includes(sqLower) ||
        u.location.toLowerCase().includes(sqLower) ||
        u.user_description.toLowerCase().includes(sqLower)
      ));
    }
    setLoading(false);
  }, [searchParams]);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
        Results for &ldquo;{searchQuery}&rdquo;
      </h1>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : items.length === 0 && users.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-neutral-500 text-lg">No results found.</p>
          <p className="text-gray-400 dark:text-neutral-400 text-sm mt-1">Try a different search term.</p>
        </div>
      ) : (
        <>
          {users.length > 0 && (
            <div className="flex flex-col gap-3 mb-8">
              {users.map((u) => <UserCardInfo data={u} key={u.user_id} />)}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {items.map((p) => <SmallCardInfo key={p.cardID} data={p} />)}
          </div>
        </>
      )}
    </SideBar>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
