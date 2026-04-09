import { createClient } from "./client";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateSlug(title: string): string {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") +
    "-" +
    Date.now().toString(36)
  );
}

async function getCurrentUserId() {
  const supabase = createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) throw new Error("Not authenticated");
  return user.id;
}

// Create a notification (fire-and-forget, never throw)
async function notify(userId: string, type: string, actorId: string, postId?: string) {
  if (userId === actorId) return; // don't notify yourself
  const supabase = createClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    actor_id: actorId,
    post_id: postId || null,
  }).then(() => {});
}

// Common select string for posts with author + counts
const POST_SELECT = `
  *,
  author:profiles!author_id(*),
  likes(count),
  comments(count),
  bookmarks(count),
  views(count)
`;

// ---------------------------------------------------------------------------
// Posts
// ---------------------------------------------------------------------------

export async function getPosts(page = 0, limit = 12) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data;
}

export async function getPostBySlug(slug: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("slug", slug)
    .single();

  if (error) throw error;
  return data;
}

export async function getPostsByAuthor(authorId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("author_id", authorId)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
}

export async function createPost(data: {
  title: string;
  content: string;
  short_description: string;
  cover_image?: string;
  tags: string[];
  published: boolean;
}) {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const slug = generateSlug(data.title);

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      ...data,
      slug,
      author_id: userId,
    })
    .select()
    .single();

  if (error) throw error;
  return post;
}

export async function updatePost(
  id: string,
  data: Partial<{
    title: string;
    content: string;
    short_description: string;
    cover_image: string;
    tags: string[];
    published: boolean;
  }>
) {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { data: post, error } = await supabase
    .from("posts")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("author_id", userId)
    .select()
    .single();

  if (error) throw error;
  return post;
}

export async function deletePost(id: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("posts").delete().eq("id", id).eq("author_id", userId);

  if (error) throw error;
}

export async function searchPosts(query: string) {
  const supabase = createClient();
  const q = query.trim().toLowerCase();
  const pattern = `%${q}%`;

  // Search title, description, and content via ilike
  const textSearch = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .or(`title.ilike.${pattern},short_description.ilike.${pattern},content.ilike.${pattern}`)
    .order("created_at", { ascending: false });

  // Search tags via contains
  const tagSearch = supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .contains("tags", [q])
    .order("created_at", { ascending: false });

  const [textRes, tagRes] = await Promise.all([textSearch, tagSearch]);
  if (textRes.error) throw textRes.error;

  // Merge with deduplication, text matches first
  const seen = new Set<string>();
  const merged = [];
  for (const p of textRes.data || []) { if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); } }
  for (const p of tagRes.data || []) { if (!seen.has(p.id)) { seen.add(p.id); merged.push(p); } }
  return merged;
}

// ---------------------------------------------------------------------------
// Profiles
// ---------------------------------------------------------------------------

export async function getProfile(id: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

export async function getProfileByUsername(username: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(
  id: string,
  data: Partial<{
    username: string;
    avatar_url: string;
    bio: string;
    location: string;
    work_place: string;
    skills: string[];
    socials: Record<string, string>;
  }>
) {
  const supabase = createClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return profile;
}

// ---------------------------------------------------------------------------
// Social — Likes / Bookmarks / Follows
// ---------------------------------------------------------------------------

export async function toggleLike(postId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data: existing } = await supabase
    .from("likes")
    .select("user_id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);
    if (error) throw error;
    return { liked: false };
  }

  const { error } = await supabase
    .from("likes")
    .insert({ user_id: userId, post_id: postId });
  if (error) throw error;

  // Notify post author
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", postId).single();
  if (post) notify(post.author_id, "like", userId, postId);

  return { liked: true };
}

export async function toggleBookmark(postId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data: existing } = await supabase
    .from("bookmarks")
    .select("user_id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("post_id", postId);
    if (error) throw error;
    return { bookmarked: false };
  }

  const { error } = await supabase
    .from("bookmarks")
    .insert({ user_id: userId, post_id: postId });
  if (error) throw error;
  return { bookmarked: true };
}

export async function toggleFollow(followingId: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data: existing } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", userId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (existing) {
    const { error } = await supabase
      .from("follows")
      .delete()
      .eq("follower_id", userId)
      .eq("following_id", followingId);
    if (error) throw error;
    return { following: false };
  }

  const { error } = await supabase
    .from("follows")
    .insert({ follower_id: userId, following_id: followingId });
  if (error) throw error;

  notify(followingId, "follow", userId);

  return { following: true };
}

export async function isLiked(postId: string): Promise<boolean> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data } = await supabase
    .from("likes")
    .select("user_id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  return !!data;
}

export async function isBookmarked(postId: string): Promise<boolean> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data } = await supabase
    .from("bookmarks")
    .select("user_id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  return !!data;
}

export async function isFollowing(userId: string): Promise<boolean> {
  const supabase = createClient();
  const currentUserId = await getCurrentUserId();

  const { data } = await supabase
    .from("follows")
    .select("follower_id")
    .eq("follower_id", currentUserId)
    .eq("following_id", userId)
    .maybeSingle();

  return !!data;
}

export async function recordView(postId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { error } = await supabase
    .from("views")
    .insert({ post_id: postId, user_id: user?.id ?? null });

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Comments
// ---------------------------------------------------------------------------

export async function getComments(postId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("comments")
    .select("*, author:profiles!author_id(*)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data;
}

export async function addComment(
  postId: string,
  content: string,
  parentId?: string
) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("comments")
    .insert({
      post_id: postId,
      author_id: userId,
      content,
      parent_id: parentId ?? null,
    })
    .select("*, author:profiles!author_id(*)")
    .single();

  if (error) throw error;

  // Notify post author
  const { data: post } = await supabase.from("posts").select("author_id").eq("id", postId).single();
  if (post) notify(post.author_id, "comment", userId, postId);

  return data;
}

export async function deleteComment(id: string) {
  const supabase = createClient();
  const userId = await getCurrentUserId();
  const { error } = await supabase.from("comments").delete().eq("id", id).eq("author_id", userId);

  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Notifications
// ---------------------------------------------------------------------------

export async function getNotifications() {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { data, error } = await supabase
    .from("notifications")
    .select("*, actor:profiles!actor_id(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) throw error;
  return data;
}

export async function markNotificationRead(id: string) {
  const supabase = createClient();
  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("id", id);

  if (error) throw error;
}

export async function markAllNotificationsRead() {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { error } = await supabase
    .from("notifications")
    .update({ read: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
}

export async function getUnreadCount(): Promise<number> {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  const { count, error } = await supabase
    .from("notifications")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("read", false);

  if (error) throw error;
  return count ?? 0;
}

// ---------------------------------------------------------------------------
// Follows — Followers & Following lists
// ---------------------------------------------------------------------------

export async function getFollowers(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("follower:profiles!follower_id(*)")
    .eq("following_id", userId);

  if (error) throw error;
  return data.map((row) => row.follower);
}

export async function getFollowing(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("follows")
    .select("following:profiles!following_id(*)")
    .eq("follower_id", userId);

  if (error) throw error;
  return data.map((row) => row.following);
}

export async function getFollowCounts(userId: string) {
  const supabase = createClient();
  const [followers, following] = await Promise.all([
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
    supabase.from("follows").select("*", { count: "exact", head: true }).eq("follower_id", userId),
  ]);
  return { followers: followers.count || 0, following: following.count || 0 };
}

// ---------------------------------------------------------------------------
// Feed
// ---------------------------------------------------------------------------

export async function getFeed(page = 0, limit = 12) {
  const supabase = createClient();
  const userId = await getCurrentUserId();

  // Get IDs of users the current user follows
  const { data: followRows, error: followError } = await supabase
    .from("follows")
    .select("following_id")
    .eq("follower_id", userId);

  if (followError) throw followError;

  const followingIds = followRows.map((row) => row.following_id);

  if (followingIds.length === 0) return [];

  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("published", true)
    .in("author_id", followingIds)
    .order("created_at", { ascending: false })
    .range(page * limit, (page + 1) * limit - 1);

  if (error) throw error;
  return data;
}
