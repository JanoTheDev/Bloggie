# Bloggie

A modern, full-stack blog platform built with Next.js and Supabase.

## Features

**Core**
- Email/password and GitHub OAuth authentication
- Password reset flow with email verification
- Create, edit, and delete blog posts with markdown editor
- Markdown toolbar (bold, italic, heading, code, link, image, quote, list)
- Drag-and-drop image upload to Supabase Storage
- Post scheduling with date picker
- Auto-save drafts to localStorage
- Live word count in editor

**Reading**
- Blog posts with cover image hero, code syntax highlighting, and copy-code buttons
- YouTube and Twitter/X embed support in posts
- Table of contents sidebar generated from headings
- Related posts based on matching tags
- Reading progress bar
- Reading time estimates

**Social**
- Like, bookmark, and follow with optimistic UI and animated counters
- Threaded comment system with Reddit-style thread lines
- Comment editing (within 5 minutes) and deletion with confirmation modals
- Notification system with bell icon, unread badge, and polling
- User profiles with follower/following counts
- Post analytics dashboard with stats and bar chart

**Search and Discovery**
- Autocomplete search across titles, descriptions, and tags with hierarchy
- Full-text search with Postgres tsvector (optional migration)
- Infinite scroll with intersection observer
- Tag-based filtering

**Polish**
- Dark mode with pure black/neutral palette, persisted preference
- Responsive sidebar with user profile section and settings popover
- Skeleton loading states and blur image placeholders
- Page transition animations and loading bar
- Keyboard shortcuts (n=new post, /=search, ?=help)
- Confirmation modals for destructive actions (no browser alerts)
- Back-to-top button
- Skip-to-content link and ARIA labels
- Custom 404 page and error boundary
- PWA manifest
- RSS feed and dynamic sitemap
- Dynamic Open Graph and Twitter Card meta tags per post

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)
- **UI:** React 19, Tailwind CSS v4, Headless UI
- **Language:** TypeScript
- **State:** Jotai
- **Markdown:** Marked + DOMPurify + Highlight.js

## Getting Started

### Prerequisites

- Node.js 20+
- A Supabase project

### Setup

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

Run these SQL files in the Supabase SQL Editor (in order):

1. `supabase/schema.sql` - Tables, RLS policies, triggers, indexes
2. `supabase/storage.sql` - Storage buckets for avatars and cover images
3. `supabase/search.sql` - (Optional) Full-text search with tsvector
4. `supabase/scheduling.sql` - (Optional) Post scheduling support
5. `supabase/seed.sql` - (Optional) Sample data

```bash
npm run dev
```

### GitHub OAuth

1. Supabase Dashboard > Authentication > Providers > GitHub
2. Create a GitHub OAuth App at github.com/settings/developers
3. Callback URL: `https://your-project.supabase.co/auth/v1/callback`

## Project Structure

```
src/
  app/              Pages (App Router)
    blog/[id]/      Blog post detail + edit
    create/         Post editor
    dashboard/      Analytics
    login/, signup/ Auth
    forgot-password/, reset-password/
    profile/, settings/
    following/, playlist/, results/
  components/       UI components
  lib/
    supabase/       Client, server, hooks, API
    utils.ts        Utilities
  atoms/            Jotai state
  types/            TypeScript interfaces
supabase/           SQL migrations
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Serve production |
| `npm run lint` | ESLint |
