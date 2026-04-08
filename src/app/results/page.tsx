"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { BlogData } from "@/data/BlogData";
import SideBar from "@/components/Navbar";
import SmallCardInfo, { searchBarFilter } from "@/components/SmallCardInfo";
import { useAtom } from "jotai";
import { searchBarText } from "@/atoms/Navbar";
import { AllUserData } from "@/data/AllUserData";
import UserCardInfo from "@/components/UserCardInfo";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);
  const [, setFilterQuery] = useAtom(searchBarFilter);

  useEffect(() => {
    const sq = searchParams.get("sq") || "";
    const fq = searchParams.get("fq") || "";
    setSearchQuery(sq);
    setFilterQuery(fq);

    const sqLower = sq.toLowerCase();
    const fqLower = fq.toLowerCase();

    let filteredData = BlogData;

    if (fq) {
      filteredData = filteredData.filter((item) =>
        item.info.tags.includes(fqLower)
      );
    }

    if (sq) {
      filteredData = filteredData.filter((item) =>
        item.user.username.toLowerCase().includes(sqLower) ||
        item.info.name.toLowerCase().includes(sqLower) ||
        item.info.shortDescription.toLowerCase().includes(sqLower)
      );
    }

    setItems(filteredData);

    if (sq) {
      setUsers(
        AllUserData.filter(
          (user) =>
            user.user_id.toLowerCase().includes(sqLower) ||
            user.username.toLowerCase().includes(sqLower) ||
            user.work_place.toLowerCase().includes(sqLower) ||
            user.location.toLowerCase().includes(sqLower) ||
            user.user_description.toLowerCase().includes(sqLower)
        )
      );
    }
  }, [searchParams]);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Results for &ldquo;{searchQuery}&rdquo;
      </h1>

      {users.length > 0 && (
        <div className="flex flex-col gap-3 mb-8">
          {users.map((x: any, i: number) => (
            <UserCardInfo data={x} key={i} />
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((x: any, i: number) => (
            <SmallCardInfo key={i} data={x} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 py-12">No items found</p>
      )}
    </SideBar>
  );
}

export default function ResultsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResultsContent />
    </Suspense>
  );
}
