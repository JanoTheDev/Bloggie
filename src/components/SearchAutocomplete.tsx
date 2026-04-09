"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { debounce } from "@/lib/utils";
import { IconSearch } from "@/components/Icons";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

interface Result {
  title: string;
  slug: string;
  short_description: string | null;
  tags: string[] | null;
  match: "title" | "description" | "tag";
}

export default function SearchAutocomplete({ value, onChange, onSubmit }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [results, setResults] = useState<Result[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [searched, setSearched] = useState(false);

  const fetchResults = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) { setResults([]); setIsOpen(false); setSearched(false); return; }

      const q = query.trim();
      const fields = "title, slug, short_description, tags";

      // Run 3 queries in parallel with hierarchy: title > description > tags
      const [titleRes, descRes, tagRes] = await Promise.all([
        supabase.from("posts").select(fields).eq("published", true).ilike("title", `%${q}%`).limit(5),
        supabase.from("posts").select(fields).eq("published", true).ilike("short_description", `%${q}%`).limit(3),
        supabase.from("posts").select(fields).eq("published", true).contains("tags", [q.toLowerCase()]).limit(3),
      ]);

      const seen = new Set<string>();
      const merged: Result[] = [];

      for (const post of titleRes.data || []) {
        if (!seen.has(post.slug)) { seen.add(post.slug); merged.push({ ...post, match: "title" }); }
      }
      for (const post of descRes.data || []) {
        if (!seen.has(post.slug)) { seen.add(post.slug); merged.push({ ...post, match: "description" }); }
      }
      for (const post of tagRes.data || []) {
        if (!seen.has(post.slug)) { seen.add(post.slug); merged.push({ ...post, match: "tag" }); }
      }

      setSearched(true);
      setResults(merged.slice(0, 7));
      setIsOpen(true);
    }, 300),
    [supabase]
  );

  useEffect(() => { fetchResults(value); }, [value, fetchResults]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((p) => (p < results.length - 1 ? p + 1 : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted((p) => (p > 0 ? p - 1 : results.length - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (highlighted >= 0) go(results[highlighted].slug); else onSubmit(); }
    else if (e.key === "Escape") { setIsOpen(false); }
  }

  function go(slug: string) { setIsOpen(false); router.push(`/blog/${slug}`); }

  const showEmpty = searched && results.length === 0 && value.trim().length > 1;

  const matchLabel = (m: string) =>
    m === "title" ? null : m === "description" ? "in description" : "in tags";

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <IconSearch className="absolute left-3 w-4 h-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => { onChange(e.target.value); setHighlighted(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (value.trim().length > 0 && (results.length > 0 || showEmpty)) setIsOpen(true); }}
          onBlur={() => setTimeout(() => { setIsOpen(false); setHighlighted(-1); }, 120)}
          placeholder="Search posts, tags..."
          className="w-full pl-10 pr-4 py-1.5 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent"
        />
      </div>

      {isOpen && value.trim().length > 0 && (
        <div className="absolute z-50 mt-2 w-full top-full max-h-72 overflow-y-auto rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg">
          {results.length > 0 ? results.map((r, i) => {
            const label = matchLabel(r.match);
            return (
              <div
                key={r.slug}
                className={`cursor-pointer px-4 py-2.5 ${i === highlighted ? "bg-gray-100 dark:bg-neutral-900" : "hover:bg-gray-50 dark:hover:bg-neutral-900"}`}
                onMouseDown={() => go(r.slug)}
                onMouseEnter={() => setHighlighted(i)}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-800 dark:text-neutral-200 truncate">{r.title}</span>
                  {label && (
                    <span className="shrink-0 text-[11px] text-gray-400 dark:text-neutral-600">{label}</span>
                  )}
                </div>
                {r.short_description && (
                  <p className="text-xs text-gray-400 dark:text-neutral-500 truncate mt-0.5">{r.short_description}</p>
                )}
              </div>
            );
          }) : showEmpty ? (
            <div className="px-4 py-3 text-sm text-gray-400 dark:text-neutral-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
