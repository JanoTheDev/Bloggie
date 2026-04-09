"use client";

import SideBar from "@/components/Navbar";
import Comments from "@/components/Comments";
import { SkeletonUserCard } from "@/components/Skeleton";
import { getPostBySlug, recordView } from "@/lib/supabase/api";
import { useParams } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { marked } from "marked";
import DOMPurify from "dompurify";
import hljs from "highlight.js";
import "highlight.js/styles/github-dark.css";
import { useToast } from "@/components/Toast";
import { relativeTime, readingTime } from "@/lib/utils";
import TableOfContents from "@/components/TableOfContents";
import RelatedPosts from "@/components/RelatedPosts";
import EmbedRenderer from "@/components/EmbedRenderer";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/supabase/hooks";

export default function BlogPost() {
  const { id: slug } = useParams<{ id: string }>();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const toast = useToast();
  const { user } = useUser();

  useEffect(() => {
    if (!slug) return;
    getPostBySlug(slug)
      .then((data) => { setPost(data); recordView(data.id).catch(() => {}); })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [slug]);

  const createMarkup = (md: string) => ({
    __html: DOMPurify.sanitize(marked.parse(md, { async: false }) as string),
  });

  const handleCopyCode = useCallback((e: MouseEvent) => {
    const btn = (e.target as HTMLElement).closest("[data-copy-code]");
    if (!btn) return;
    const code = btn.closest("pre")?.querySelector("code");
    if (code) { navigator.clipboard.writeText(code.textContent || ""); toast("Copied", "success"); }
  }, [toast]);

  useEffect(() => { document.addEventListener("click", handleCopyCode); return () => document.removeEventListener("click", handleCopyCode); }, [handleCopyCode]);

  useEffect(() => {
    if (!post) return;
    // Syntax highlighting
    document.querySelectorAll(".markdown-body pre code").forEach((el) => {
      hljs.highlightElement(el as HTMLElement);
    });
    // Copy buttons
    document.querySelectorAll(".markdown-body pre").forEach((pre) => {
      if (pre.querySelector("[data-copy-code]")) return;
      pre.classList.add("relative", "group/code");
      const btn = document.createElement("button");
      btn.setAttribute("data-copy-code", "true");
      btn.className = "absolute top-2 right-2 p-1.5 rounded-md bg-gray-700/80 text-white opacity-0 group-hover/code:opacity-100 transition-opacity text-xs";
      btn.textContent = "Copy";
      pre.appendChild(btn);
    });
  }, [post]);

  if (loading) return <SideBar><div className="max-w-4xl mx-auto"><SkeletonUserCard /><div className="mt-6 h-48 bg-gray-200 dark:bg-neutral-800 rounded-xl animate-pulse" /></div></SideBar>;
  if (!post) return <SideBar><div className="text-center py-16"><p className="text-gray-400 dark:text-neutral-500 text-lg">Blog not found</p></div></SideBar>;

  const author = post.author || {};
  const ts = String(Math.floor(new Date(post.created_at).getTime() / 1000));
  const coverImage = post.cover_image || `https://picsum.photos/seed/${post.slug}/1200/400`;

  return (
    <SideBar>
      <div className="max-w-4xl mx-auto">
        {/* Cover image */}
        <div className="relative aspect-[3/1] rounded-xl overflow-hidden mb-6">
          <Image src={coverImage} alt={post.title} fill className="object-cover" sizes="(max-width: 1024px) 100vw, 900px" />
        </div>

        {/* Title + meta */}
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-neutral-100 leading-tight">{post.title}</h1>
        {post.short_description && (
          <p className="mt-2 text-lg text-gray-500 dark:text-neutral-400">{post.short_description}</p>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {post.tags.map((tag: string, i: number) => (
              <Link key={i} href={`/results?fq=${tag}`} className="px-2.5 py-0.5 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 rounded-full hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
                {tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author bar */}
        <div className="flex items-center gap-3 mt-5 pb-5 border-b border-gray-200 dark:border-neutral-800">
          <Link href={`/profile/${author.id}`} className="shrink-0">
            {author.avatar_url ? (
              <Image src={author.avatar_url} alt="" width={40} height={40} className="rounded-full object-cover" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center text-sm font-medium text-gray-500">{(author.username || "?")[0].toUpperCase()}</div>
            )}
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={`/profile/${author.id}`} className="text-sm font-semibold text-gray-900 dark:text-neutral-100 hover:underline">{author.username}</Link>
            <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-neutral-500">
              <span>{relativeTime(ts)}</span>
              <span>·</span>
              <span>{readingTime(post.content)}</span>
            </div>
          </div>
          {user?.id === author.id && (
            <Link href={`/blog/${slug}/edit`} className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-900 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors">
              Edit
            </Link>
          )}
          <button
            onClick={() => { navigator.clipboard.writeText(window.location.href); toast("Link copied", "success"); }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-500 dark:text-neutral-400 bg-gray-100 dark:bg-neutral-900 rounded-lg hover:bg-gray-200 dark:hover:bg-neutral-800 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 1 0 0 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186 9.566-5.314m-9.566 7.5 9.566 5.314m0 0a2.25 2.25 0 1 0 3.935-2.186 2.25 2.25 0 0 0-3.935 2.186Zm0-12.814a2.25 2.25 0 1 0 3.935 2.186 2.25 2.25 0 0 0-3.935-2.186Z" />
            </svg>
            Share
          </button>
        </div>

        {/* Content + TOC side-by-side */}
        <div className="flex gap-8 mt-6">
          <article className="markdown-body text-gray-900 dark:text-neutral-100 flex-1 min-w-0">
            <EmbedRenderer html={createMarkup(post.content).__html} />
          </article>
          <div className="hidden xl:block w-56 shrink-0">
            <TableOfContents content={post.content} />
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-10">
          <RelatedPosts currentPostId={post.id} tags={post.tags || []} />
        </div>

        {/* Comments */}
        <div className="mt-10 pb-8">
          <Comments postId={post.id} />
        </div>
      </div>
    </SideBar>
  );
}
