"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "@/lib/supabase/hooks";
import { getComments, addComment, deleteComment } from "@/lib/supabase/api";
import { useToast } from "@/components/Toast";
import { relativeTime } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  user_id: string;
  profile: {
    id: string;
    username: string;
    avatar_url: string;
  };
}

export default function Comments({ postId }: { postId: string }) {
  const { user, loading: userLoading } = useUser();
  const toast = useToast();

  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchComments = useCallback(async () => {
    try {
      const data = await getComments(postId);
      setComments(data);
    } catch {
      toast("Failed to load comments", "error");
    } finally {
      setLoading(false);
    }
  }, [postId, toast]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  async function handleAddComment(parentId?: string) {
    const content = parentId ? replyContent.trim() : newComment.trim();
    if (!content || submitting) return;

    setSubmitting(true);
    try {
      await addComment(postId, content, parentId);
      if (parentId) {
        setReplyContent("");
        setReplyingTo(null);
      } else {
        setNewComment("");
      }
      await fetchComments();
      toast("Comment posted", "success");
    } catch {
      toast("Failed to post comment", "error");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteComment(id);
      await fetchComments();
      toast("Comment deleted", "success");
    } catch {
      toast("Failed to delete comment", "error");
    }
  }

  // Build threaded structure
  const topLevel = comments.filter((c) => !c.parent_id);
  const replies = (parentId: string) =>
    comments.filter((c) => c.parent_id === parentId);

  function renderComment(comment: Comment, isReply = false) {
    const isOwn = user?.id === comment.user_id;

    return (
      <div key={comment.id} className={isReply ? "ml-10" : ""}>
        <div className="flex gap-3 py-4">
          {/* Avatar */}
          <div className="shrink-0">
            {comment.profile.avatar_url ? (
              <Image
                src={comment.profile.avatar_url}
                alt={comment.profile.username}
                width={32}
                height={32}
                className="rounded-full object-cover"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                {comment.profile.username?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {comment.profile.username}
              </span>
              <span className="text-xs text-neutral-500 dark:text-neutral-500">
                {relativeTime(comment.created_at)}
              </span>
            </div>
            <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">
              {comment.content}
            </p>
            <div className="mt-2 flex items-center gap-3">
              {user && (
                <button
                  onClick={() => {
                    setReplyingTo(
                      replyingTo === comment.id ? null : comment.id
                    );
                    setReplyContent("");
                  }}
                  className="text-xs font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  Reply
                </button>
              )}
              {isOwn && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300"
                >
                  Delete
                </button>
              )}
            </div>

            {/* Reply input */}
            {replyingTo === comment.id && (
              <div className="mt-3 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleAddComment(comment.id);
                  }}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-lg border border-neutral-200 bg-transparent px-3 py-1.5 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600"
                />
                <button
                  onClick={() => handleAddComment(comment.id)}
                  disabled={submitting || !replyContent.trim()}
                  className="rounded-lg bg-neutral-900 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Nested replies */}
        {replies(comment.id).map((reply) => renderComment(reply, true))}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-800 dark:bg-neutral-950">
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        Comments{" "}
        {comments.length > 0 && (
          <span className="text-sm font-normal text-neutral-500">
            ({comments.length})
          </span>
        )}
      </h3>

      {/* New comment input */}
      {!userLoading && user ? (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAddComment();
            }}
            placeholder="Write a comment..."
            className="flex-1 rounded-lg border border-neutral-200 bg-transparent px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none dark:border-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-600 dark:focus:border-neutral-600"
          />
          <button
            onClick={() => handleAddComment()}
            disabled={submitting || !newComment.trim()}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-neutral-200"
          >
            Post
          </button>
        </div>
      ) : !userLoading ? (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-500">
          <Link
            href="/login"
            className="font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-700 dark:text-neutral-100 dark:hover:text-neutral-300"
          >
            Sign in
          </Link>{" "}
          to comment
        </p>
      ) : null}

      {/* Comments list */}
      <div className="mt-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-8 w-8 shrink-0 rounded-full bg-neutral-200 dark:bg-neutral-800" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 rounded bg-neutral-200 dark:bg-neutral-800" />
                  <div className="h-3 w-full rounded bg-neutral-200 dark:bg-neutral-800" />
                </div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-neutral-500 dark:text-neutral-500">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          <div className="divide-y divide-neutral-100 dark:divide-neutral-900">
            {topLevel.map((comment) => renderComment(comment))}
          </div>
        )}
      </div>
    </div>
  );
}
