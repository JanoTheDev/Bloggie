import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("title, slug, short_description, created_at, author:profiles!author_id(username)")
    .eq("published", true)
    .order("created_at", { ascending: false })
    .limit(20);

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bloggie.vercel.app";

  const items = (posts || []).map((p: any) => `
    <item>
      <title><![CDATA[${p.title}]]></title>
      <link>${baseUrl}/blog/${p.slug}</link>
      <description><![CDATA[${p.short_description || ""}]]></description>
      <pubDate>${new Date(p.created_at).toUTCString()}</pubDate>
      <author>${p.author?.username || "Unknown"}</author>
    </item>`).join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Bloggie</title>
    <link>${baseUrl}</link>
    <description>A modern blog platform for developers</description>
    <language>en</language>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml", "Cache-Control": "s-maxage=3600, stale-while-revalidate" },
  });
}
