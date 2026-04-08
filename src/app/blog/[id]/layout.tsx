import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id: slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select(
      "title, short_description, cover_image, author:profiles!author_id(username)"
    )
    .eq("slug", slug)
    .single();

  if (!post) return { title: "Post Not Found" };

  const title = post.title;
  const description = post.short_description || "Read this post on Bloggie";
  const image =
    post.cover_image || `https://picsum.photos/seed/${slug}/1200/630`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
