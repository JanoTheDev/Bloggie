"use client";

import SideBar from "@/components/Navbar";
import UserCardInfo from "@/components/UserCardInfo";
import { SkeletonUserCard } from "@/components/Skeleton";
import { BlogData } from "@/data/BlogData";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "highlight.js/styles/default.css";
import type { BlogUser, BlogInfo } from "@/types";

export default function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [owner, setOwner] = useState<BlogUser | null>(null);
  const [info, setInfo] = useState<BlogInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const post = BlogData.find((d) => d.cardID === id);
    if (post) {
      setOwner(post.user);
      setInfo(post.info);
    }
    setLoading(false);
  }, [id]);

  const createMarkup = (markdown: string) => ({
    __html: DOMPurify.sanitize(marked.parse(markdown, { async: false }) as string),
  });

  if (loading) return <SideBar><div className="max-w-3xl"><SkeletonUserCard /><div className="mt-6 space-y-3">{[...Array(8)].map((_, i) => <div key={i} className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" style={{ width: `${70 + Math.random() * 30}%` }} />)}</div></div></SideBar>;
  if (!owner) return <SideBar><div className="text-center py-16"><p className="text-gray-400 dark:text-gray-500 text-lg">Blog not found</p></div></SideBar>;

  return (
    <SideBar>
      <div className="max-w-3xl">
        <UserCardInfo data={owner} />
        <hr className="my-6 border-gray-200 dark:border-gray-800" />
        <article
          className="markdown-body text-gray-900 dark:text-gray-100"
          dangerouslySetInnerHTML={createMarkup(info!.data)}
        />
      </div>
    </SideBar>
  );
}
