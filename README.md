# Bloggie

A modern, full-stack blog platform built with Next.js and Supabase, featuring real-time interactions, markdown-powered posts, and a polished developer experience.

## Features

- **Authentication** -- Email/password and GitHub OAuth via Supabase Auth
- **Blog posts** -- Create, edit, and publish markdown posts with live preview
- **Markdown editor** -- Toolbar with formatting buttons, drag-and-drop image upload, auto-save drafts
- **Comments** -- Threaded comment system with replies
- **Social interactions** -- Like, bookmark, follow with optimistic UI and animated counters
- **Search** -- Autocomplete search with keyboard navigation
- **Notifications** -- Bell icon with unread badge, real-time polling
- **User profiles** -- Editable profiles with avatar, bio, skills, location
- **Dark mode** -- Pure black theme with persisted preference
- **Responsive sidebar** -- Collapsible navigation with persisted state, user profile section at bottom
- **Blog reader** -- Table of contents sidebar, related posts, code copy buttons, share link
- **Infinite scroll** -- Load more pagination on the home feed
- **SEO** -- Dynamic Open Graph and Twitter Card meta tags per post
- **Accessibility** -- Skip-to-content, ARIA labels, keyboard navigation, focus management
- **Performance** -- Skeleton loading states, blur image placeholders, page transition animations
- **PWA** -- Web app manifest for installability
- **Error handling** -- Error boundary with recovery, custom 404 page

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Row Level Security)
- **UI:** React 19, Tailwind CSS v4, Headless UI
- **Language:** TypeScript
- **State:** Jotai
- **Markdown:** Marked + DOMPurify + Highlight.js

## Getting Started

### Prerequisites

- Node.js 20 or later
- A Supabase project ([supabase.com](https://supabase.com))

### Setup

```bash
git clone https://github.com/JanoTheDev/Bloggie.git
cd Bloggie
npm install
```

Create a `.env.local` file:

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Run the database schema and storage setup in the Supabase SQL Editor:

1. `supabase/schema.sql` -- Creates tables, RLS policies, triggers, and indexes
2. `supabase/storage.sql` -- Creates storage buckets for avatars and cover images
3. `supabase/seed.sql` -- (Optional) Sample data after creating a user account

Start the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### GitHub OAuth (Optional)

1. Supabase Dashboard > Authentication > Providers > GitHub
2. Create a GitHub OAuth App at github.com/settings/developers
3. Set the callback URL to `https://your-project.supabase.co/auth/v1/callback`

## Project Structure

```
src/
  app/              Pages and layouts (App Router)
    blog/[id]/      Blog post detail with comments
    create/         Post editor with markdown toolbar
    login/          Authentication
    signup/
    profile/        User profiles
    settings/       Profile settings
    following/      Feed from followed users
    playlist/       Bookmarks, history, liked posts
    results/        Search results
  components/       Shared UI components
  lib/
    supabase/       Supabase client, server, hooks, API layer
    utils.ts        Utilities (relative time, reading time, debounce)
  atoms/            Jotai state atoms
  types/            TypeScript interfaces
supabase/
  schema.sql        Database schema and RLS policies
  storage.sql       Storage bucket setup
  seed.sql          Sample data
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run lint` | Run ESLint |
