"use client";

import React, { useState, useMemo, useRef, Suspense, useEffect, useCallback } from "react";
import SideBar from "@/components/Navbar";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { createClient } from "@/lib/supabase/client";
import { useUser } from "@/lib/supabase/hooks";
import { useToast } from "@/components/Toast";
import { useParams, useRouter } from "next/navigation";
import MarkdownToolbar from "@/components/MarkdownToolbar";
import ImageUpload from "@/components/ImageUpload";

function EditPostContent() {
  const { id: slug } = useParams<{ id: string }>();
  const { user, loading: userLoading } = useUser();
  const toast = useToast();
  const router = useRouter();
  const supabase = createClient();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Fetch the post
  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error || !data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setPost(data);
      setTitle(data.title || "");
      setDescription(data.short_description || "");
      setTags(data.tags || []);
      setMarkdown(data.content || "");
      setCoverImage(data.cover_image || "");
      setLoading(false);
    }

    fetchPost();
  }, [slug]);

  // Check authorization once user and post are loaded
  useEffect(() => {
    if (userLoading || loading) return;
    if (post && user && post.user_id !== user.id) {
      router.replace(`/blog/${slug}`);
    }
  }, [user, userLoading, post, loading, slug, router]);

  const previewHtml = useMemo(() => {
    if (!markdown) return "";
    const raw = marked.parse(markdown, { async: false }) as string;
    return DOMPurify.sanitize(raw);
  }, [markdown]);

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagInput.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleUpdate = async () => {
    if (updating || !post) return;
    setUpdating(true);
    try {
      const { error } = await supabase
        .from("posts")
        .update({
          title,
          content: markdown,
          short_description: description,
          cover_image: coverImage || null,
          tags,
        })
        .eq("id", post.id);

      if (error) throw error;

      toast("Post updated!", "success");
      router.push(`/blog/${slug}`);
    } catch (err: any) {
      toast(err.message || "Failed to update", "error");
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (deleting || !post) return;
    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );
    if (!confirmed) return;

    setDeleting(true);
    try {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", post.id);

      if (error) throw error;

      toast("Post deleted.", "success");
      router.push("/profile");
    } catch (err: any) {
      toast(err.message || "Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  };

  // Loading skeleton
  if (loading || userLoading) {
    return (
      <SideBar>
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="h-8 w-48 bg-gray-200 dark:bg-neutral-800 rounded-lg animate-pulse" />
            <div className="mt-2 h-4 w-72 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
          </div>
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
                <div className="h-5 w-12 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-11 w-full bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
                <div className="h-5 w-28 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
                <div className="h-5 w-10 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-10 w-full bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
                <div className="h-5 w-24 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-32 w-full bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
                <div className="h-5 w-36 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse" />
                <div className="h-64 w-full bg-gray-100 dark:bg-neutral-900 rounded-lg animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-5">
                <div className="h-4 w-16 bg-gray-200 dark:bg-neutral-800 rounded animate-pulse mb-4" />
                <div className="space-y-3">
                  <div className="h-4 w-full bg-gray-100 dark:bg-neutral-900 rounded animate-pulse" />
                  <div className="h-4 w-3/4 bg-gray-100 dark:bg-neutral-900 rounded animate-pulse" />
                  <div className="h-4 w-5/6 bg-gray-100 dark:bg-neutral-900 rounded animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SideBar>
    );
  }

  // Post not found
  if (notFound) {
    return (
      <SideBar>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-16 h-16 text-gray-300 dark:text-neutral-700 mb-4"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
              />
            </svg>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-neutral-100 mb-2">
              Post not found
            </h2>
            <p className="text-sm text-gray-500 dark:text-neutral-400 mb-6">
              The post you are looking for does not exist or has been removed.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2 bg-gray-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </SideBar>
    );
  }

  // Not authorized (will redirect, show nothing in the meantime)
  if (!user || (post && post.user_id !== user.id)) {
    return null;
  }

  return (
    <SideBar>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            Edit Post
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Update your post content and settings.
          </p>
        </div>

        {/* Two-panel layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left panel - Editor */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 space-y-4">
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
                >
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Your post title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 text-lg font-semibold bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent"
                />
              </div>

              {/* Short description */}
              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
                >
                  Short Description
                </label>
                <input
                  id="description"
                  type="text"
                  placeholder="A brief summary of your post"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent text-sm"
                />
              </div>

              {/* Tags */}
              <div>
                <label
                  htmlFor="tags"
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
                >
                  Tags
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-700 dark:text-neutral-300 border border-gray-200 dark:border-neutral-800 rounded-full hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400 dark:hover:border-red-800 transition-colors"
                    >
                      {tag}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className="w-3.5 h-3.5"
                      >
                        <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                      </svg>
                    </button>
                  ))}
                </div>
                <input
                  id="tags"
                  type="text"
                  placeholder="Type a tag and press Enter"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="w-full px-4 py-2 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent text-sm"
                />
              </div>

              {/* Cover image */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5">
                  Cover Image
                </label>
                <ImageUpload bucket="covers" currentUrl={coverImage} onUpload={setCoverImage} />
              </div>

              {/* Markdown editor */}
              <div>
                <label
                  htmlFor="markdown"
                  className="block text-sm font-medium text-gray-700 dark:text-neutral-300 mb-1.5"
                >
                  Content (Markdown)
                </label>
                <MarkdownToolbar textareaRef={textareaRef} onUpdate={setMarkdown} />
                <textarea
                  ref={textareaRef}
                  id="markdown"
                  placeholder="Write your post content in Markdown..."
                  value={markdown}
                  onChange={(e) => setMarkdown(e.target.value)}
                  rows={18}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-b-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent text-sm font-mono leading-relaxed resize-y"
                />
              </div>
            </div>
          </div>

          {/* Right panel - Preview */}
          <div className="flex-1 min-w-0">
            <div className="bg-white dark:bg-neutral-950 border border-gray-200 dark:border-neutral-800 rounded-xl p-5 sticky top-24">
              <h2 className="text-sm font-medium text-gray-500 dark:text-neutral-400 uppercase tracking-wide mb-4">
                Preview
              </h2>

              {title && (
                <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100 mb-2">
                  {title}
                </h1>
              )}
              {description && (
                <p className="text-sm text-gray-500 dark:text-neutral-400 mb-1">
                  {description}
                </p>
              )}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 text-xs font-medium bg-gray-100 dark:bg-neutral-900 text-gray-600 dark:text-neutral-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {(title || description || tags.length > 0) && markdown && (
                <hr className="border-gray-200 dark:border-neutral-800 mb-4" />
              )}

              {markdown ? (
                <div
                  className="markdown-body"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <p className="text-sm text-gray-400 dark:text-neutral-500 italic">
                  Start writing Markdown on the left to see a live preview
                  here.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="mt-6 flex justify-between">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="px-5 py-2.5 bg-red-600 dark:bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 dark:hover:bg-red-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {deleting ? "Deleting..." : "Delete Post"}
          </button>
          <button
            type="button"
            onClick={handleUpdate}
            disabled={!title.trim() || !markdown.trim() || updating}
            className="px-6 py-2.5 bg-gray-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </div>
    </SideBar>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <EditPostContent />
    </Suspense>
  );
}
