"use client";

import { useEffect, useRef } from "react";

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/);
  return match ? match[1] : null;
}

function isTwitterUrl(url: string): boolean {
  return /(?:twitter\.com|x\.com)\/\w+\/status\/\d+/.test(url);
}

export default function EmbedRenderer({ html }: { html: string }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const links = ref.current.querySelectorAll("a[href]");

    links.forEach((link) => {
      const href = link.getAttribute("href") || "";

      const ytId = getYouTubeId(href);
      if (ytId) {
        const wrapper = document.createElement("div");
        wrapper.className = "my-4 aspect-video w-full max-w-2xl rounded-lg overflow-hidden";
        wrapper.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}" class="w-full h-full" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        link.parentNode?.replaceChild(wrapper, link);
        return;
      }

      if (isTwitterUrl(href)) {
        const wrapper = document.createElement("div");
        wrapper.className = "my-4";
        wrapper.innerHTML = `<blockquote class="twitter-tweet"><a href="${href}"></a></blockquote>`;
        link.parentNode?.replaceChild(wrapper, link);

        // Load Twitter embed script if not already loaded
        if (!document.querySelector('script[src*="platform.twitter.com"]')) {
          const script = document.createElement("script");
          script.src = "https://platform.twitter.com/widgets.js";
          script.async = true;
          document.body.appendChild(script);
        } else {
          (window as any).twttr?.widgets?.load();
        }
      }
    });
  }, [html]);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />;
}
