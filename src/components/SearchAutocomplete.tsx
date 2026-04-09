"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { debounce } from "@/lib/utils";
import { IconSearch } from "@/components/Icons";

interface Props {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

interface Suggestion {
  title: string;
  slug: string;
}

export default function SearchAutocomplete({ value, onChange, onSubmit }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [searched, setSearched] = useState(false);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) { setSuggestions([]); setIsOpen(false); setSearched(false); return; }
      const { data } = await supabase.from("posts").select("title, slug").ilike("title", `%${query}%`).eq("published", true).limit(5);
      setSearched(true);
      if (data) { setSuggestions(data); setIsOpen(true); }
    }, 300),
    [supabase]
  );

  useEffect(() => { fetchSuggestions(value); }, [value, fetchSuggestions]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
      return;
    }
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted((p) => (p < suggestions.length - 1 ? p + 1 : 0)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted((p) => (p > 0 ? p - 1 : suggestions.length - 1)); }
    else if (e.key === "Enter") { e.preventDefault(); if (highlighted >= 0) go(suggestions[highlighted].slug); else onSubmit(); }
    else if (e.key === "Escape") { setIsOpen(false); }
  }

  function go(slug: string) { setIsOpen(false); router.push(`/blog/${slug}`); }

  const showEmpty = searched && suggestions.length === 0 && value.trim().length > 2;

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <IconSearch className="absolute left-3 w-4 h-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => { onChange(e.target.value); setHighlighted(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0 || showEmpty) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-1.5 text-sm bg-transparent text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none"
        />
      </div>

      {isOpen && value.trim().length > 0 && (
        <div className="absolute z-50 mt-2 w-full top-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg">
          {suggestions.length > 0 ? suggestions.map((s, i) => (
            <div
              key={s.slug}
              className={`cursor-pointer px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 ${i === highlighted ? "bg-gray-100 dark:bg-neutral-900" : "hover:bg-gray-50 dark:hover:bg-neutral-900"}`}
              onMouseDown={() => go(s.slug)}
              onMouseEnter={() => setHighlighted(i)}
            >
              {s.title}
            </div>
          )) : showEmpty ? (
            <div className="px-4 py-3 text-sm text-gray-400 dark:text-neutral-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
