-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- ============================================================================
-- BLOGGIE DATABASE SCHEMA
-- A complete schema for the Bloggie blog platform with RLS policies,
-- triggers, and indexes.
-- ============================================================================


-- ============================================================================
-- TABLES
-- ============================================================================

-- Profiles: extends Supabase auth.users with public profile data
create table profiles (
  id          uuid references auth.users on delete cascade primary key,
  username    text unique not null,
  avatar_url  text,
  bio         text,
  location    text,
  work_place  text,
  skills      text[],
  socials     jsonb default '{}',
  created_at  timestamptz default now(),
  updated_at  timestamptz default now()
);

-- Posts: blog posts with markdown content
create table posts (
  id                uuid default gen_random_uuid() primary key,
  author_id         uuid references profiles on delete cascade not null,
  title             text not null,
  slug              text unique not null,
  content           text not null,  -- markdown content
  short_description text,
  cover_image       text,
  tags              text[],
  published         boolean default false,
  created_at        timestamptz default now(),
  updated_at        timestamptz default now()
);

-- Comments: threaded comments on posts
create table comments (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references posts on delete cascade not null,
  author_id  uuid references profiles on delete cascade not null,
  content    text not null,
  parent_id  uuid references comments on delete cascade,  -- null = top-level comment
  created_at timestamptz default now()
);

-- Likes: one like per user per post
create table likes (
  user_id    uuid references profiles on delete cascade not null,
  post_id    uuid references posts on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Bookmarks: saved posts per user
create table bookmarks (
  user_id    uuid references profiles on delete cascade not null,
  post_id    uuid references posts on delete cascade not null,
  created_at timestamptz default now(),
  primary key (user_id, post_id)
);

-- Follows: user-to-user follow relationships
create table follows (
  follower_id  uuid references profiles on delete cascade not null,
  following_id uuid references profiles on delete cascade not null,
  created_at   timestamptz default now(),
  primary key (follower_id, following_id),
  check (follower_id != following_id)
);

-- Views: post view tracking (nullable user_id for anonymous views)
create table views (
  id         uuid default gen_random_uuid() primary key,
  post_id    uuid references posts on delete cascade not null,
  user_id    uuid references profiles on delete cascade,  -- null for anonymous views
  created_at timestamptz default now()
);

-- Notifications: in-app notifications for user activity
create table notifications (
  id         uuid default gen_random_uuid() primary key,
  user_id    uuid references profiles on delete cascade not null,
  type       text not null,  -- 'like', 'comment', 'follow'
  actor_id   uuid references profiles on delete cascade not null,
  post_id    uuid references posts on delete cascade,  -- null for follow notifications
  read       boolean default false,
  created_at timestamptz default now()
);


-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

alter table profiles      enable row level security;
alter table posts          enable row level security;
alter table comments       enable row level security;
alter table likes          enable row level security;
alter table bookmarks      enable row level security;
alter table follows        enable row level security;
alter table views          enable row level security;
alter table notifications  enable row level security;

-- ---------------------------------------------------------------------------
-- Profiles policies
-- ---------------------------------------------------------------------------

-- Anyone can view profiles
create policy "Profiles are viewable by everyone"
  on profiles for select
  using (true);

-- Users can update only their own profile
create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- ---------------------------------------------------------------------------
-- Posts policies
-- ---------------------------------------------------------------------------

-- Anyone can view published posts
create policy "Published posts are viewable by everyone"
  on posts for select
  using (published = true);

-- Authors can view their own drafts
create policy "Authors can view their own drafts"
  on posts for select
  using (auth.uid() = author_id);

-- Authenticated users can create posts (as themselves)
create policy "Authenticated users can create posts"
  on posts for insert
  with check (auth.uid() = author_id);

-- Authors can update their own posts
create policy "Authors can update their own posts"
  on posts for update
  using (auth.uid() = author_id)
  with check (auth.uid() = author_id);

-- Authors can delete their own posts
create policy "Authors can delete their own posts"
  on posts for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- Comments policies
-- ---------------------------------------------------------------------------

-- Anyone can view comments
create policy "Comments are viewable by everyone"
  on comments for select
  using (true);

-- Authenticated users can create comments (as themselves)
create policy "Authenticated users can create comments"
  on comments for insert
  with check (auth.uid() = author_id);

-- Users can delete their own comments
create policy "Users can delete their own comments"
  on comments for delete
  using (auth.uid() = author_id);

-- ---------------------------------------------------------------------------
-- Likes policies
-- ---------------------------------------------------------------------------

-- Anyone can view likes
create policy "Likes are viewable by everyone"
  on likes for select
  using (true);

-- Authenticated users can like posts (as themselves)
create policy "Authenticated users can like posts"
  on likes for insert
  with check (auth.uid() = user_id);

-- Users can remove their own likes
create policy "Users can remove their own likes"
  on likes for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Bookmarks policies
-- ---------------------------------------------------------------------------

-- Users can only see their own bookmarks
create policy "Users can view their own bookmarks"
  on bookmarks for select
  using (auth.uid() = user_id);

-- Users can create their own bookmarks
create policy "Users can create bookmarks"
  on bookmarks for insert
  with check (auth.uid() = user_id);

-- Users can remove their own bookmarks
create policy "Users can remove their own bookmarks"
  on bookmarks for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Follows policies
-- ---------------------------------------------------------------------------

-- Anyone can view follows
create policy "Follows are viewable by everyone"
  on follows for select
  using (true);

-- Authenticated users can follow others (as themselves)
create policy "Authenticated users can follow others"
  on follows for insert
  with check (auth.uid() = follower_id);

-- Users can unfollow (delete their own follows)
create policy "Users can unfollow"
  on follows for delete
  using (auth.uid() = follower_id);

-- ---------------------------------------------------------------------------
-- Views policies
-- ---------------------------------------------------------------------------

-- Anyone can insert a view (including anonymous)
create policy "Anyone can record a view"
  on views for insert
  with check (true);

-- Allow selecting views for aggregation
create policy "Views are viewable by everyone"
  on views for select
  using (true);

-- ---------------------------------------------------------------------------
-- Notifications policies
-- ---------------------------------------------------------------------------

-- Users can only see their own notifications
create policy "Users can view their own notifications"
  on notifications for select
  using (auth.uid() = user_id);

-- Users can mark their own notifications as read
create policy "Users can update their own notifications"
  on notifications for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);


-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Auto-create a profile when a new user signs up via Supabase Auth
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, username)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'user_' || left(new.id::text, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update the updated_at column on row modification
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger on_profiles_updated
  before update on profiles
  for each row execute function public.handle_updated_at();

create trigger on_posts_updated
  before update on posts
  for each row execute function public.handle_updated_at();


-- ============================================================================
-- INDEXES
-- ============================================================================

create index idx_posts_author_id   on posts (author_id);
create index idx_posts_created_at  on posts (created_at desc);
create index idx_comments_post_id  on comments (post_id);
create index idx_likes_post_id     on likes (post_id);
create index idx_bookmarks_user_id on bookmarks (user_id);
create index idx_follows_following on follows (following_id);
create index idx_notifications_user_read on notifications (user_id, read);
