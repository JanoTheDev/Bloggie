-- Run this after schema.sql to populate sample data
-- NOTE: First create at least one user account through the app's signup page.
-- Then update the author_id values below with your actual user ID.
-- You can find your user ID in the Supabase Dashboard > Authentication > Users

-- Replace 'YOUR_USER_ID' with your actual user ID from auth.users
DO $$
DECLARE
  user_id uuid := 'YOUR_USER_ID';
BEGIN
  -- Update profile
  UPDATE profiles SET
    username = 'demo_user',
    bio = 'Full-stack developer passionate about web technologies.',
    location = 'San Francisco, CA',
    work_place = 'Tech Corp',
    skills = ARRAY['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
    avatar_url = 'https://picsum.photos/seed/demo/200/200'
  WHERE id = user_id;

  -- Insert sample posts
  INSERT INTO posts (author_id, title, slug, content, short_description, cover_image, tags, published) VALUES
  (user_id, 'Getting Started with React', 'getting-started-react-' || substr(md5(random()::text), 1, 8), E'# Getting Started with React\n\n**React** is a JavaScript library for building user interfaces...\n\n## Prerequisites\n\n- Node.js 18+\n- Basic JavaScript knowledge\n\n## Creating Your First App\n\n```bash\nnpx create-next-app@latest my-app\ncd my-app\nnpm run dev\n```\n\n> React makes it painless to create interactive UIs.', 'A beginner-friendly guide to building your first React app.', 'https://picsum.photos/seed/post1/600/400', ARRAY['react', 'javascript', 'tutorial'], true),
  (user_id, 'TypeScript Tips & Tricks', 'typescript-tips-' || substr(md5(random()::text), 1, 8), E'# TypeScript Tips & Tricks\n\nLevel up your TypeScript with these practical tips.\n\n## 1. Use const assertions\n\n```ts\nconst colors = ["red", "green", "blue"] as const;\ntype Color = typeof colors[number]; // "red" | "green" | "blue"\n```\n\n## 2. Template literal types\n\n```ts\ntype EventName = `on${Capitalize<string>}`;\n```', 'Level up your TypeScript with these pro tips.', 'https://picsum.photos/seed/post2/600/400', ARRAY['typescript', 'tips', 'dev'], true),
  (user_id, 'CSS Grid Deep Dive', 'css-grid-deep-dive-' || substr(md5(random()::text), 1, 8), E'# CSS Grid Deep Dive\n\nMaster the most powerful layout system in CSS.\n\n```css\n.grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 1rem;\n}\n```\n\n## When to use Grid vs Flexbox\n\n- Use **Grid** for 2D layouts\n- Use **Flexbox** for 1D layouts', 'Master CSS Grid layout with practical examples.', 'https://picsum.photos/seed/post3/600/400', ARRAY['css', 'layout', 'frontend'], true),
  (user_id, 'Docker for Developers', 'docker-for-devs-' || substr(md5(random()::text), 1, 8), E'# Docker for Developers\n\nContainerize your development environment.\n\n```dockerfile\nFROM node:20-alpine\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nEXPOSE 3000\nCMD ["npm", "start"]\n```', 'Containerize your dev environment with Docker.', 'https://picsum.photos/seed/post4/600/400', ARRAY['docker', 'devops'], true),
  (user_id, 'Next.js App Router Guide', 'nextjs-app-router-' || substr(md5(random()::text), 1, 8), E'# Next.js App Router\n\nThe App Router brings React Server Components to Next.js.\n\n## Key Concepts\n\n- `page.tsx` defines routes\n- `layout.tsx` wraps pages\n- `loading.tsx` shows loading states\n- Server Components by default\n- Use `"use client"` for interactivity', 'Exploring the new App Router in Next.js.', 'https://picsum.photos/seed/post5/600/400', ARRAY['nextjs', 'react', 'fullstack'], true),
  (user_id, 'REST API Best Practices', 'rest-api-best-practices-' || substr(md5(random()::text), 1, 8), E'# REST API Best Practices\n\n## Use proper HTTP methods\n\n- GET for reading\n- POST for creating\n- PUT/PATCH for updating\n- DELETE for removing\n\n## Use proper status codes\n\n- 200 OK\n- 201 Created\n- 404 Not Found\n- 500 Internal Server Error', 'Best practices for designing RESTful APIs.', 'https://picsum.photos/seed/post6/600/400', ARRAY['api', 'rest', 'backend'], true);
END $$;
