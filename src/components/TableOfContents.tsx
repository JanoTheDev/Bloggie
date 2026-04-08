"use client";

import { useEffect, useMemo, useState } from "react";

interface Heading {
  level: number;
  text: string;
  id: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

function parseHeadings(content: string): Heading[] {
  const regex = /^(#{1,3})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].trim();
    headings.push({ level, text, id: slugify(text) });
  }
  return headings;
}

const indentClass: Record<number, string> = {
  1: "",
  2: "pl-3",
  3: "pl-6",
};

export default function TableOfContents({ content }: { content: string }) {
  const headings = useMemo(() => parseHeadings(content), [content]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0.1 }
    );

    for (const heading of headings) {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="sticky top-24 bg-white dark:bg-neutral-950 rounded-xl border border-gray-100 dark:border-neutral-800 p-4">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-neutral-100 mb-3">
        Table of Contents
      </h4>
      <ul className="flex flex-col gap-1.5">
        {headings.map((heading) => (
          <li key={heading.id} className={indentClass[heading.level]}>
            <a
              href={`#${heading.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(heading.id)?.scrollIntoView({ behavior: "smooth" });
              }}
              className={`block text-sm transition-colors ${
                activeId === heading.id
                  ? "text-gray-900 dark:text-neutral-100 font-medium"
                  : "text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-300"
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
