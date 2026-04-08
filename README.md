# Bloggie

A modern blog platform built with Next.js and React, featuring markdown-powered posts, user profiles, and a responsive reading experience.

## Features

- Responsive sidebar navigation with persisted open/closed state
- Blog post feed with adaptive card grid layout
- User profiles with a follow system
- Blog post detail view with full markdown rendering and code syntax highlighting
- Search across posts and users
- Tag-based filtering for discovering content
- Playlist and bookmark system (history, read later, liked blogs)
- Dark mode support
- Skeleton loading states for smoother perceived performance
- Toast notifications
- Markdown editor with live preview for creating posts
- TypeScript throughout with proper interfaces and type safety

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS v4, Headless UI
- **Language:** TypeScript
- **State Management:** Jotai
- **Markdown:** Marked + DOMPurify
- **Syntax Highlighting:** Highlight.js

## Getting Started

### Prerequisites

- Node.js 18 or later

### Installation

```bash
git clone https://github.com/JanoTheDev/Bloggie.git
cd Bloggie
npm install
npm run dev
```

The development server will be available at [http://localhost:3000](http://localhost:3000).

## Project Structure

```
src/
  app/            # Next.js App Router pages and layouts
    blog/         # Blog post detail view
    create/       # Post creation with markdown editor
    following/    # Following feed
    playlist/     # Bookmarks, history, and liked posts
    profile/      # User profile pages
    results/      # Search results
  atoms/          # Jotai state atoms
  components/     # Shared UI components (Navbar, Skeleton, cards)
  data/           # Static data and content
  types/          # TypeScript interfaces and type definitions
```

## Scripts

| Command         | Description                        |
| --------------- | ---------------------------------- |
| `npm run dev`   | Start the development server       |
| `npm run build` | Create a production build          |
| `npm run start` | Serve the production build locally |
| `npm run lint`  | Run ESLint checks                  |
