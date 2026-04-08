"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { debounce } from "@/lib/utils";

interface SearchAutocompleteProps {
  value: string;
  onChange: (v: string) => void;
  onSubmit: () => void;
}

interface Suggestion {
  title: string;
  slug: string;
}

export default function SearchAutocomplete({
  value,
  onChange,
  onSubmit,
}: SearchAutocompleteProps) {
  const router = useRouter();
  const supabase = createClient();

  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchSuggestions = useCallback(
    debounce(async (query: string) => {
      if (!query.trim()) {
        setSuggestions([]);
        setIsOpen(false);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select("title, slug")
        .ilike("title", `%${query}%`)
        .limit(5);

      setIsLoading(false);
      setHasSearched(true);

      if (!error && data) {
        setSuggestions(data);
        setIsOpen(true);
      }
    }, 300),
    [supabase]
  );

  useEffect(() => {
    fetchSuggestions(value);
  }, [value, fetchSuggestions]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    onChange(newValue);
    setHighlightedIndex(-1);

    if (!newValue.trim()) {
      setSuggestions([]);
      setIsOpen(false);
      setHasSearched(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!isOpen || suggestions.length === 0) {
      if (e.key === "Enter") {
        e.preventDefault();
        onSubmit();
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < suggestions.length) {
          navigateToPost(suggestions[highlightedIndex].slug);
        } else {
          onSubmit();
        }
        break;
      case "Escape":
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  }

  function navigateToPost(slug: string) {
    setIsOpen(false);
    setHighlightedIndex(-1);
    router.push(`/blog/${slug}`);
  }

  function handleBlur() {
    setTimeout(() => {
      setIsOpen(false);
      setHighlightedIndex(-1);
    }, 150);
  }

  const showNoResults =
    hasSearched && suggestions.length === 0 && value.trim().length > 2;

  return (
    <div ref={containerRef} className="relative w-full">
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (suggestions.length > 0 || showNoResults) setIsOpen(true);
        }}
        onBlur={handleBlur}
        placeholder="Search posts..."
        className="w-full pl-10 text-sm rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100 dark:focus:border-neutral-600 dark:focus:ring-neutral-600"
      />

      {isOpen && (value.trim().length > 0) && (
        <div className="absolute z-50 mt-1 w-full top-full max-h-64 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg dark:border-neutral-800 dark:bg-neutral-950">
          {suggestions.length > 0 ? (
            suggestions.map((suggestion, index) => (
              <div
                key={suggestion.slug}
                className={`cursor-pointer px-4 py-2 text-sm ${
                  index === highlightedIndex
                    ? "bg-gray-50 dark:bg-neutral-900"
                    : ""
                } hover:bg-gray-50 dark:hover:bg-neutral-900`}
                onMouseDown={() => navigateToPost(suggestion.slug)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {suggestion.title}
              </div>
            ))
          ) : showNoResults ? (
            <div className="px-4 py-2 text-sm text-gray-500 dark:text-neutral-500">
              No results
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
