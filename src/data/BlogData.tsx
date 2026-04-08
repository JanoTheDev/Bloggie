const blogContent = `
# Lorem Ipsum

**Lorem ipsum** dolor sit amet, *consectetur adipiscing elit*. Integer nec odio. Praesent libero. Sed cursus ante dapibus diam.

1. Sed nisi.
2. Nulla quis sem at nibh elementum imperdiet.
3. Duis sagittis ipsum.

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lorem Ipsum</title>
    <style>
        .text {
            color: red;
            text-align: center;
            font-size: 24px;
        }
        .background {
          background-color: black;
          padding-top: 50px;
          padding-bottom: 50px;
          margin-bottom: 200px;
        }
    </style>
</head>
<body>
<div class="background">
   <p class="text" href="https://google.com/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
</div>

</body>
</html>
\`\`\`
\n
> **Note:** Lorem ipsum dolor sit amet, consectetur adipiscing elit.
\n

# Basic HTML Code:
\n\n
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lorem Ipsum</title>
    <style>
        .text {
            color: red;
            text-align: center;
            font-size: 24px;
        }
        .background {
          background-color: black;
          padding-top: 50px;
          padding-bottom: 50px;
          margin-bottom: 200px;
        }
    </style>
</head>
<body>
<div class="background">
   <p class="text" href="https://google.com/">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
</div>

</body>
</html>
`;

export const BlogData = [
  {
    cardID: "1",
    user: {
      username: "User1",
      verified: true,
      user_id: "1",
      followers: ["2", "3"],
      profile_picture: "https://picsum.photos/seed/user1/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 1",
      location: "Location 1",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post1/600/400",
      name: "Getting Started with React",
      shortDescription: "A beginner-friendly guide to building your first React app.",
      read_later: ["2", "3", "4"],
      views_count: ["1", "2", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["react", "javascript", "frontend", "tutorial", "web"],
      data: blogContent,
    },
  },
  {
    cardID: "2",
    user: {
      username: "User2",
      verified: false,
      user_id: "2",
      followers: ["1", "3"],
      profile_picture: "https://picsum.photos/seed/user2/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 2",
      location: "Location 2",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post2/600/400",
      name: "CSS Grid Deep Dive",
      shortDescription: "Master CSS Grid layout with practical examples.",
      read_later: ["1", "3", "4"],
      views_count: ["1"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["css", "layout"],
      data: blogContent,
    },
  },
  {
    cardID: "3",
    user: {
      username: "User3",
      verified: false,
      user_id: "3",
      followers: ["1", "2"],
      profile_picture: "https://picsum.photos/seed/user3/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post3/600/400",
      name: "TypeScript Tips & Tricks",
      shortDescription: "Level up your TypeScript with these pro tips.",
      read_later: ["2", "4"],
      views_count: ["3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["typescript", "javascript", "tips", "dev"],
      data: blogContent,
    },
  },
  {
    cardID: "4",
    user: {
      username: "User3",
      verified: false,
      user_id: "3",
      followers: ["1", "2"],
      profile_picture: "https://picsum.photos/seed/user3/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post4/600/400",
      name: "Node.js Performance",
      shortDescription: "Optimize your Node.js applications for speed.",
      read_later: ["2", "3"],
      views_count: ["2", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["nodejs", "performance", "backend", "optimization"],
      data: blogContent,
    },
  },
  {
    cardID: "5",
    user: {
      username: "User3",
      verified: false,
      user_id: "3",
      followers: ["1", "2"],
      profile_picture: "https://picsum.photos/seed/user3/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post5/600/400",
      name: "Tailwind CSS Patterns",
      shortDescription: "Common UI patterns built with Tailwind CSS.",
      read_later: ["2", "4"],
      views_count: ["1", "2"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["tailwind", "css", "design", "ui"],
      data: blogContent,
    },
  },
  {
    cardID: "6",
    user: {
      username: "User3",
      verified: false,
      user_id: "3",
      followers: ["1", "2"],
      profile_picture: "https://picsum.photos/seed/user3/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post6/600/400",
      name: "Docker for Developers",
      shortDescription: "Containerize your dev environment with Docker.",
      read_later: ["2", "3"],
      views_count: ["1", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["docker", "devops", "containers"],
      data: blogContent,
    },
  },
  {
    cardID: "7",
    user: {
      username: "User3",
      verified: false,
      user_id: "3",
      followers: ["1", "2"],
      profile_picture: "https://picsum.photos/seed/user3/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post7/600/400",
      name: "Git Workflow Guide",
      shortDescription: "Efficient Git workflows for modern teams.",
      read_later: ["1", "3", "4"],
      views_count: ["2", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["git", "workflow", "collaboration", "tools"],
      data: blogContent,
    },
  },
  {
    cardID: "8",
    user: {
      username: "User4",
      verified: false,
      user_id: "4",
      following: ["1", "2", "3"],
      profile_picture: "https://picsum.photos/seed/user4/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post8/600/400",
      name: "REST API Design",
      shortDescription: "Best practices for designing RESTful APIs.",
      read_later: ["1", "2", "3", "4"],
      views_count: ["1", "2", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["api", "rest", "backend", "design"],
      data: blogContent,
    },
  },
  {
    cardID: "9",
    user: {
      username: "User3",
      verified: false,
      user_id: "3",
      followers: ["1", "2"],
      profile_picture: "https://picsum.photos/seed/user3/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post9/600/400",
      name: "Next.js App Router",
      shortDescription: "Exploring the new App Router in Next.js.",
      read_later: ["1", "2"],
      views_count: ["1", "2", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["nextjs", "react", "routing", "fullstack"],
      data: blogContent,
    },
  },
  {
    cardID: "10",
    user: {
      username: "User4",
      verified: false,
      user_id: "4",
      following: ["1", "2", "3"],
      profile_picture: "https://picsum.photos/seed/user4/200/200",
      join_date: "1693732421",
      user_description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
      work_place: "Workplace 3",
      location: "Location 3",
    },
    info: {
      time_posted: "1693732421",
      image: "https://picsum.photos/seed/post10/600/400",
      name: "Auth with JWT",
      shortDescription: "Implement secure authentication using JSON Web Tokens.",
      read_later: ["1", "4"],
      views_count: ["1", "2", "3"],
      like_count: ["1", "2", "3"],
      copy_count: ["1", "2", "3"],
      tags: ["auth", "jwt", "security", "backend"],
      data: blogContent,
    },
  },
];
