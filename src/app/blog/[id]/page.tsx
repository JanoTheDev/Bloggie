"use client";

import SideBar from "@/components/Navbar";
import UserCardInfo from "@/components/UserCardInfo";
import Comments from "@/components/Comments";
import { SkeletonUserCard } from "@/components/Skeleton";
import { getPostBySlug, recordView } from "@/lib/supabase/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import "highlight.js/styles/default.css";
import { useToast } from "@/components/Toast";
import { relativeTime, readingTime } from "@/lib/utils";

export default function BlogPost() {
  const { id: slug } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then((data) => {
        setPost(data);
        recordView(data.id).catch(() => {});
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const createMarkup = (markdown: string) => ({
    __html: DOMPurify.sanitize(marked.parse(markdown, { async: false }) as string),
  });

  const handleCopyCode = useCallback((e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest("[data-copy-code]");
    if (!btn) return;
    const code = btn.closest("pre")?.querySelector("code");
    if (code) {
      navigator.clipboard.writeText(code.textContent || "");
      toast("Copied to clipboard", "success");
    }
  }, [toast]);

  useEffect(() => {
    document.addEventListener("click", handleCopyCode);
    return () => document.removeEventListener("click", handleCopyCode);
  }, [handleCopyCode]);

  useEffect(() => {
    if (!post) return;
    document.querySelectorAll(".markdown-body pre").forEach((pre) => {
      if (pre.querySelector("[data-copy-code]")) return;
      pre.classList.add("relative", "group/code");
      const btn = document.createElement("button");
      btn.setAttribute("data-copy-code", "true");
      btn.setAttribute("aria-label", "Copy code");
      btn.className = "absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/80 text-white opacity-0 group-hover/code:opacity-100 transition-opacity text-xs";
      btn.textContent = "Copy";
      pre.appendChild(btn);
    });
  }, [post]);

  function handleShare() {
    navigator.clipboard.writeText(window.location.href);
    toast("Link copied", "success");
  }

  if (loading) return <SideBar><div className="max-w-3xl"><SkeletonUserCard /></div></SideBar>;
  if (!post) return <SideBar><div className="text-center py-16"><p className="text-gray-400 dark:text-neutral-500 text-lg">Blog not found</p></div></SideBar>;

  const author = post.author || {};
  const ts = String(Math.floor(new Date(post.created_at).getTime() / 1000));

  return (
    <SideBar>
      <div className="max-w-3xl">
        <UserCardInfo data={{ ...author, user_id: author.id, profile_picture: author.avatar_url, user_description: author.bio || "", followers: [] }} />

        <div className="flex items-center gap-3 mt-4 text-sm text-gray-400 dark:text-neutral-500">
          <span>{relativeTime(ts)}</span>
          <span>·</span>
          <span>{readingTime(post.content)}</span>
          <button onClick={handleShare} className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-600 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-900 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors" aria-label="Share">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Z" />
            </svg>
            Share
          </button>
        </div>

        <hr className="my-6 border-gray-200 dark:border-neutral-800" />
        <article className="markdown-body text-gray-900 dark:text-neutral-100" dangerouslySetInnerHTML={createMarkup(post.content)} />

        <hr className="my-8 border-gray-200 dark:border-neutral-800" />
        <Comments postId={post.id} />
      </div>
    </SideBar>
  );
}
