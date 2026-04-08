"use client";

import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { searchPosts } from "@/lib/supabase/api";
import SideBar from "@/components/Navbar";
import SmallCardInfo from "@/components/SmallCardInfo";
import { SkeletonGrid } from "@/components/Skeleton";
import { useAtom } from "jotai";
import { searchBarText } from "@/atoms/Navbar";

function ResultsContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useAtom(searchBarText);

  useEffect(() => {
    const sq = searchParams.get("sq") || "";
    const fq = searchParams.get("fq") || "";
    setSearchQuery(sq || fq);

    const query = sq || fq;
    if (!query) { setLoading(false); return; }

    searchPosts(query)
      .then((data) => setItems(data || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <SideBar>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-6">
        Results for &ldquo;{searchQuery}&rdquo;
      </h1>

      {loading ? (
        <SkeletonGrid count={6} />
      ) : items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400 dark:text-neutral-500 text-lg">No results found.</p>
          <p className="text-gray-400 dark:text-neutral-500 text-sm mt-1">Try a different search term.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((p: any) => <SmallCardInfo key={p.id} data={p} />)}
        </div>
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
