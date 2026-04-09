"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ConfirmDialog from "@/components/ConfirmDialog";
import { useUser } from "@/lib/supabase/hooks";
import { getComments, addComment, deleteComment } from "@/lib/supabase/api";
import { useToast } from "@/components/Toast";
import { relativeTime } from "@/lib/utils";

interface Comment {
  id: string;
  content: string;
  created_at: string;
  parent_id: string | null;
  author_id: string;
  author: { id: string; username: string; avatar_url: string };
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);

  const fetchComments = useCallback(async () => {
    try { setComments(await getComments(postId)); }
    catch { toast("Failed to load comments", "error"); }
    finally { setLoading(false); }
  }, [postId, toast]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  async function handleAdd(parentId?: string) {
    const content = parentId ? replyContent.trim() : newComment.trim();
    if (!content || submitting) return;
    setSubmitting(true);
    try {
      await addComment(postId, content, parentId);
      parentId ? (setReplyContent(""), setReplyingTo(null)) : setNewComment("");
      await fetchComments();
    } catch { toast("Failed to post comment", "error"); }
    finally { setSubmitting(false); }
  }

  async function handleDelete(id: string) {
    try { await deleteComment(id); await fetchComments(); setDeleteTarget(null); }
    catch { toast("Failed to delete", "error"); }
  }

  async function handleEditSave(id: string) {
    if (!editContent.trim()) return;
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { error } = await supabase.from("comments").update({ content: editContent.trim() }).eq("id", id);
    if (error) { toast("Failed to edit", "error"); return; }
    setEditingId(null);
    await fetchComments();
  }

  const topLevel = comments.filter((c) => !c.parent_id);
  const getReplies = (id: string) => comments.filter((c) => c.parent_id === id);

  function renderComment(comment: Comment, depth = 0) {
    const isOwn = user?.id === comment.author_id;
    const childReplies = getReplies(comment.id);
    const ts = String(Math.floor(new Date(comment.created_at).getTime() / 1000));

    return (
      <div key={comment.id} className={`relative ${depth > 0 ? "ml-4 pl-4" : ""}`}>
        {/* Reddit-style thread line */}
        {depth > 0 && (
          <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-200 dark:bg-neutral-800 hover:bg-gray-400 dark:hover:bg-neutral-600 transition-colors cursor-pointer" onClick={() => {}} />
        )}

        <div className="flex gap-3 py-3">
          <Link href={`/profile/${comment.author?.id}`} className="shrink-0">
            {comment.author?.avatar_url ? (
              <Image src={comment.author.avatar_url} alt="" width={depth > 0 ? 24 : 28} height={depth > 0 ? 24 : 28} className="rounded-full object-cover" />
            ) : (
              <div className={`${depth > 0 ? "w-6 h-6 text-[10px]" : "w-7 h-7 text-xs"} rounded-full bg-gray-200 dark:bg-neutral-800 flex items-center justify-center font-medium text-gray-500 dark:text-neutral-400`}>
                {comment.author?.username?.charAt(0).toUpperCase() ?? "?"}
              </div>
            )}
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link href={`/profile/${comment.author?.id}`} className="text-sm font-medium text-gray-900 dark:text-neutral-100 hover:underline">
                {comment.author?.username || "Unknown"}
              </Link>
              <span className="text-xs text-gray-400 dark:text-neutral-600">{relativeTime(ts)}</span>
            </div>
            {editingId === comment.id ? (
              <div className="mt-1 flex gap-2">
                <input type="text" value={editContent} onChange={(e) => setEditContent(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleEditSave(comment.id); if (e.key === "Escape") setEditingId(null); }} className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 py-1.5 text-sm text-gray-900 dark:text-neutral-100 focus:outline-none focus:border-gray-400 dark:focus:border-neutral-600" autoFocus />
                <button onClick={() => handleEditSave(comment.id)} className="rounded-lg bg-gray-900 dark:bg-neutral-100 px-3 py-1.5 text-xs font-medium text-white dark:text-black">Save</button>
                <button onClick={() => setEditingId(null)} className="text-xs text-gray-400">Cancel</button>
              </div>
            ) : (
              <p className="mt-0.5 text-sm text-gray-700 dark:text-neutral-300 leading-relaxed">{comment.content}</p>
            )}
            <div className="mt-1.5 flex items-center gap-3">
              {user && (
                <button
                  onClick={() => { setReplyingTo(replyingTo === comment.id ? null : comment.id); setReplyContent(""); }}
                  className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300"
                >
                  Reply
                </button>
              )}
              {isOwn && (Date.now() - new Date(comment.created_at).getTime()) < 5 * 60 * 1000 && (
                <button onClick={() => { setEditingId(comment.id); setEditContent(comment.content); }} className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-neutral-500 dark:hover:text-neutral-300">
                  Edit
                </button>
              )}
              {isOwn && (
                <button onClick={() => setDeleteTarget(comment.id)} className="text-xs font-medium text-gray-400 hover:text-red-500 dark:text-neutral-500 dark:hover:text-red-400">
                  Delete
                </button>
              )}
            </div>

            {replyingTo === comment.id && (
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleAdd(comment.id); }}
                  placeholder="Write a reply..."
                  className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 py-1.5 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-gray-400 dark:focus:border-neutral-600"
                  autoFocus
                />
                <button
                  onClick={() => handleAdd(comment.id)}
                  disabled={submitting || !replyContent.trim()}
                  className="rounded-lg bg-gray-900 dark:bg-neutral-100 px-3 py-1.5 text-xs font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors"
                >
                  Reply
                </button>
              </div>
            )}
          </div>
        </div>

        {childReplies.length > 0 && (
          <div>{childReplies.map((r) => renderComment(r, depth + 1))}</div>
        )}
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-neutral-100">
        Comments {comments.length > 0 && <span className="text-sm font-normal text-gray-400">({comments.length})</span>}
      </h3>

      {!userLoading && user ? (
        <div className="mt-4 flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") handleAdd(); }}
            placeholder="Write a comment..."
            className="flex-1 rounded-lg border border-gray-200 dark:border-neutral-800 bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-neutral-100 placeholder:text-gray-400 dark:placeholder:text-neutral-600 focus:outline-none focus:border-gray-400 dark:focus:border-neutral-600"
          />
          <button
            onClick={() => handleAdd()}
            disabled={submitting || !newComment.trim()}
            className="rounded-lg bg-gray-900 dark:bg-neutral-100 px-4 py-2 text-sm font-medium text-white dark:text-black hover:bg-gray-800 dark:hover:bg-neutral-200 disabled:opacity-50 transition-colors"
          >
            Post
          </button>
        </div>
      ) : !userLoading ? (
        <p className="mt-4 text-sm text-gray-500"><Link href="/login" className="font-medium text-gray-900 dark:text-neutral-100 underline underline-offset-2">Sign in</Link> to comment</p>
      ) : null}

      <div className="mt-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="h-7 w-7 rounded-full bg-gray-200 dark:bg-neutral-800 shrink-0" />
                <div className="flex-1 space-y-2"><div className="h-3 w-24 rounded bg-gray-200 dark:bg-neutral-800" /><div className="h-3 w-full rounded bg-gray-200 dark:bg-neutral-800" /></div>
              </div>
            ))}
          </div>
        ) : comments.length === 0 ? (
          <p className="py-8 text-center text-sm text-gray-400 dark:text-neutral-500">No comments yet. Be the first to comment!</p>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-neutral-900">
            {topLevel.map((c) => renderComment(c))}
          </div>
        )}
      </div>
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => deleteTarget && handleDelete(deleteTarget)}
        title="Delete comment"
        message="Are you sure? This can't be undone."
        confirmLabel="Delete"
        destructive
      />
    </div>
  );
}
