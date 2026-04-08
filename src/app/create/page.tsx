"use client";

import React, { useState, useMemo, useRef, Suspense, useEffect, useCallback } from "react";
import SideBar from "@/components/Navbar";
import { marked } from "marked";
import DOMPurify from "dompurify";
import { createPost } from "@/lib/supabase/api";
import { useToast } from "@/components/Toast";
import { useRouter } from "next/navigation";
import MarkdownToolbar from "@/components/MarkdownToolbar";
import ImageUpload from "@/components/ImageUpload";

function CreatePostContent() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const toast = useToast();
  const router = useRouter();
  const [publishing, setPublishing] = useState(false);

  // Auto-save draft to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("draft");
    if (saved) {
      try {
        const d = JSON.parse(saved);
        if (d.title) setTitle(d.title);
        if (d.description) setDescription(d.description);
        if (d.tags) setTags(d.tags);
        if (d.markdown) setMarkdown(d.markdown);
      } catch {}
    }
  }, []);

  const saveDraft = useCallback(() => {
    localStorage.setItem("draft", JSON.stringify({ title, description, tags, markdown }));
  }, [title, description, tags, markdown]);

  useEffect(() => {
    const timer = setTimeout(saveDraft, 1000);
    return () => clearTimeout(timer);
  }, [saveDraft]);

  const handlePublish = async () => {
    if (publishing) return;
    setPublishing(true);
    try {
      const post = await createPost({
        title,
        content: markdown,
        short_description: description,
        cover_image: coverImage || undefined,
        tags,
        published: true,
      });
      localStorage.removeItem("draft");
      toast("Post published!", "success");
      router.push(`/blog/${post.slug}`);
    } catch (err: any) {
      toast(err.message || "Failed to publish", "error");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <SideBar>
      <div className="max-w-7xl mx-auto">
        {/* Page header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-neutral-100">
            Create New Post
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-neutral-400">
            Write your post in Markdown and see a live preview.
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

        {/* Publish button */}
        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={handlePublish}
            disabled={!title.trim() || !markdown.trim() || publishing}
            className="px-6 py-2.5 bg-gray-900 dark:bg-neutral-100 text-white dark:text-black text-sm font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {publishing ? "Publishing..." : "Publish"}
          </button>
        </div>
      </div>
    </SideBar>
  );
}

export default function CreatePostPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <CreatePostContent />
    </Suspense>
  );
}
