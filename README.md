# Bloggie

A modern, full-stack blog platform built with Next.js 16 and Supabase, featuring real authentication, real-time interactions, a markdown editor, analytics dashboard, and a polished UI with dark mode.

## Features

**Authentication**
- Email/password signup and login
- GitHub OAuth
- Password reset flow (forgot password, email link, reset form)
- Protected routes with middleware session refresh
- Open redirect prevention on login

**Blog Posts**
- Create, edit, and delete posts with a two-panel markdown editor and live preview
- Markdown toolbar (bold, italic, heading, code, link, image, quote, list)
- Drag-and-drop cover image upload to Supabase Storage
- Post scheduling with date picker (publish now or schedule for later)
- Auto-save drafts to localStorage
- Live word count
- Code syntax highlighting with highlight.js (github-dark theme)
- Copy-code buttons on code blocks
- YouTube and Twitter/X embed detection and rendering
- Cover image hero, tags, reading time, relative timestamps

**Reading Experience**
- Table of contents sidebar generated from headings (sticky, highlights current section)
- Related posts section based on matching tags
- Reading progress bar at top of viewport
- Share button (copies link to clipboard)
- Edit button for post authors

**Social**
- Like and bookmark with optimistic UI and animated counters
- Follow/unfollow users
- Threaded comment system with Reddit-style thread lines
- Comment editing (within 5 minutes) and deletion with confirmation modals
- Notification system with bell icon, unread badge, 30-second polling
- Notifications triggered on likes, comments, and follows
- User profiles with follower/following counts

**Analytics**
- Post analytics dashboard with stat cards (total views, likes, comments)
- Horizontal bar chart showing views by post
- Full posts table with edit/delete actions per row
- Edit/delete overlays on post cards in your profile

**Search**
- Autocomplete dropdown with debounced Supabase queries
- Search across titles (priority), descriptions, and tags with hierarchy labels
- Full-text search with Postgres tsvector (optional migration)
- Keyboard navigation (arrow keys, enter, escape)

**Design and UX**
- Dark mode with pure black/neutral palette, persisted to localStorage
- Responsive collapsible sidebar with user profile section at bottom
- Settings popover with theme toggle, profile link, and sign out
- Skeleton loading states and blur image placeholders
- Page transition animations and loading bar
- Infinite scroll with intersection observer
- Keyboard shortcuts (n = new post, / = focus search, ? = help modal)
- Confirmation modals for all destructive actions (no browser alerts)
- Back-to-top floating button
- Custom 404 page and error boundary with recovery
- Client-side navigation with Next.js Link prefetching

**SEO and Distribution**
- Dynamic Open Graph and Twitter Card meta tags per blog post
- Dynamic sitemap.xml with all published posts
- RSS feed at /feed.xml
- PWA web app manifest

**Security**
- Row Level Security on all database tables
- Ownership verification on post update/delete and comment delete
- Open redirect prevention on login
- Supabase Auth with secure session handling via middleware

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| UI | React 19, Tailwind CSS v4, Headless UI |
| Language | TypeScript |
| State | Jotai |
| Markdown | Marked + DOMPurify + Highlight.js |

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project ([supabase.com](https://supabase.com))

### Installation

```bash
git clone https://github.com/JanoTheDev/Bloggie.git
cd Bloggie
npm install
```

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Database Setup

Run these SQL files in the Supabase SQL Editor (Dashboard > SQL Editor > New Query):

1. `supabase/schema.sql` -- Tables, RLS policies, triggers, indexes
2. `supabase/storage.sql` -- Storage buckets for avatars and cover images
3. `supabase/search.sql` -- (Optional) Full-text search with tsvector
4. `supabase/scheduling.sql` -- (Optional) Post scheduling with pg_cron
5. `supabase/seed.sql` -- (Optional) Sample data after creating a user

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### GitHub OAuth (Optional)

1. Supabase Dashboard > Authentication > Providers > GitHub
2. Create a GitHub OAuth App at [github.com/settings/developers](https://github.com/settings/developers)
3. Set callback URL to `https://your-project.supabase.co/auth/v1/callback`

## Project Structure

```
src/
  app/
    blog/[id]/          Blog post detail + edit page
    create/             Post editor with toolbar and preview
    dashboard/          Analytics dashboard
    following/          Feed from followed users
    forgot-password/    Password reset request
    login/, signup/     Authentication
    playlist/           Bookmarks, history, liked posts
    profile/            User profile + [userID] profiles
    reset-password/     Password reset form
    results/            Search results
    settings/           Edit profile
    feed.xml/           RSS feed route
    sitemap.ts          Dynamic sitemap
    not-found.tsx       Custom 404

  components/
    AnimatedCounter     Smooth number animations
    BackToTop           Floating scroll-to-top button
    Comments            Threaded comments with edit/delete
    ConfirmDialog       Reusable confirmation modal
    EmbedRenderer       YouTube/Twitter embed detection
    ErrorBoundary       Graceful error recovery
    Icons               23 shared SVG icon components
    ImageUpload         Drag-and-drop Supabase Storage upload
    InfiniteScroll      Intersection observer auto-loading
    KeyboardShortcuts   Global shortcuts with help modal
    LoadingBar          Top progress bar on navigation
    MarkdownToolbar     Formatting buttons for the editor
    Navbar              Sidebar layout with search and user section
    NotificationBell    Bell icon with unread badge and dropdown
    ReadingProgress     Scroll progress bar for blog posts
    RelatedPosts        Tag-based related post suggestions
    SearchAutocomplete  Debounced search with hierarchical results
    Skeleton            Loading placeholder components
    SmallCardInfo       Blog post card with interactions
    TableOfContents     Sticky heading-based TOC sidebar
    ThemeProvider       Dark mode persistence
    Toast               Toast notification system
    UserCardInfo        User card with follow button

  lib/
    supabase/
      api.ts            25+ data functions (CRUD, social, feed, notifications)
      client.ts         Browser Supabase client
      hooks.ts          useUser and useProfile hooks
      server.ts         Server Supabase client
    utils.ts            relativeTime, readingTime, debounce, throttle

  atoms/                Jotai atoms (sidebar, search, theme, toast)
  types/                TypeScript interfaces

supabase/
  schema.sql            Database schema and RLS policies
  storage.sql           Storage bucket setup
  search.sql            Full-text search migration
  scheduling.sql        Post scheduling migration
  seed.sql              Sample data
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
