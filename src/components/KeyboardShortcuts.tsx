"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

const shortcuts = [
  { key: "n", description: "Create new post" },
  { key: "/", description: "Focus search" },
  { key: "?", description: "Toggle shortcuts help" },
  { key: "Esc", description: "Close modal" },
];

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const tagName = target.tagName.toLowerCase();
      const isEditing =
        tagName === "input" ||
        tagName === "textarea" ||
        target.isContentEditable;

      if (e.key === "Escape") {
        setOpen(false);
        return;
      }

      if (isEditing) return;

      if (e.key === "n") {
        e.preventDefault();
        router.push("/create");
        return;
      }

      if (e.key === "/") {
        e.preventDefault();
        const searchInput = document.querySelector(
          'input[type="search"]'
        ) as HTMLInputElement | null;
        searchInput?.focus();
        return;
      }

      if (e.key === "?") {
        e.preventDefault();
        setOpen((prev) => !prev);
        return;
      }
    },
    [router]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setOpen(false)}
    >
      <div
        className="max-w-md w-full mx-4 bg-white dark:bg-neutral-950 rounded-xl border dark:border-neutral-800 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4 dark:text-neutral-100">
          Keyboard Shortcuts
        </h2>
        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div
              key={s.key}
              className="flex items-center justify-between"
            >
              <span className="text-sm text-gray-600 dark:text-neutral-300">
                {s.description}
              </span>
              <kbd className="bg-gray-100 dark:bg-neutral-900 px-2 py-0.5 rounded text-xs font-mono border dark:border-neutral-800 dark:text-neutral-100">
                {s.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
