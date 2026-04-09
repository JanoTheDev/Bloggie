import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("slug, updated_at")
    .eq("published", true)
    .order("updated_at", { ascending: false });

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloggie.vercel.app";

  const postUrls = (posts || []).map((p: any) => ({
    url: `${baseUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/signup`, changeFrequency: "monthly", priority: 0.3 },
    ...postUrls,
  ];
}
