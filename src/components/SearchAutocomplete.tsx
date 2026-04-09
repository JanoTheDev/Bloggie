"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { debounce } from "@/lib/utils";
import { IconSearch } from "@/components/Icons";

interface SearchAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

interface Suggestion {
  title: string;
  slug: string;
}

export default function SearchAutocomplete({ value, onChange, onSubmit }: SearchAutocompleteProps) {
  const router = useRouter();
  const supabase = createClient();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        setIsOpen(false);
        setHasSearched(false);
        return;
      }
      const { data } = await supabase
        .from("posts")
        .select("title, slug")
        .ilike("title", `%${query}%`)
        .eq("published", true)
        .limit(5);
      setHasSearched(true);
      if (data) {
        setSuggestions(data);
        setIsOpen(true);
      }
    }, 300),
    [supabase]
  );

  useEffect(() => { fetchSuggestions(value); }, [value, fetchSuggestions]);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((p) => (p < suggestions.length - 1 ? p + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((p) => (p > 0 ? p - 1 : suggestions.length - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0) navigateTo(suggestions[highlightedIndex].slug);
      else onSubmit();
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  }

  function navigateTo(slug: string) {
    setIsOpen(false);
    router.push(`/blog/${slug}`);
  }

  const showNoResults = hasSearched && suggestions.length === 0 && value.trim().length > 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-neutral-500 pointer-events-none" />
        <input
          type="search"
          value={value}
          onChange={(e) => { onChange(e.target.value); setHighlightedIndex(-1); }}
          onKeyDown={handleKeyDown}
          onFocus={() => { if (suggestions.length > 0 || showNoResults) setIsOpen(true); }}
          onBlur={() => setTimeout(() => setIsOpen(false), 150)}
          placeholder="Search posts, users..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-lg text-gray-900 dark:text-neutral-100 placeholder-gray-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-neutral-700 focus:border-transparent transition-colors"
        />
      </div>

      {isOpen && value.trim().length > 0 && (
        <div className="absolute z-50 mt-1.5 w-full top-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-lg">
          {suggestions.length > 0 ? (
            suggestions.map((s, i) => (
              <div
                key={s.slug}
                className={`cursor-pointer px-4 py-2.5 text-sm text-gray-700 dark:text-neutral-300 ${i === highlightedIndex ? "bg-gray-100 dark:bg-neutral-900" : "hover:bg-gray-50 dark:hover:bg-neutral-900"}`}
                onMouseDown={() => navigateTo(s.slug)}
                onMouseEnter={() => setHighlightedIndex(i)}
              >
                {s.title}
              </div>
            ))
          ) : showNoResults ? (
            <div className="px-4 py-3 text-sm text-gray-400 dark:text-neutral-500">No results found</div>
          ) : null}
        </div>
      )}
    </div>
  );
}
