"use client";

import React from "react";

interface MarkdownToolbarProps {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  onUpdate: (value: string) => void;
}

type ToolbarAction = {
  label: string;
  title: string;
  action: (
    text: string,
    selStart: number,
    selEnd: number
  ) => { newText: string; cursorStart: number; cursorEnd: number };
};

function wrapSelection(
  text: string,
  selStart: number,
  selEnd: number,
  before: string,
  after: string
) {
  const selected = text.slice(selStart, selEnd);
  const newText =
    text.slice(0, selStart) + before + selected + after + text.slice(selEnd);
  return {
    newText,
    cursorStart: selStart + before.length,
    cursorEnd: selEnd + before.length,
  };
}

function prependToLine(
  text: string,
  selStart: number,
  _selEnd: number,
  prefix: string
) {
  const lineStart = text.lastIndexOf("\n", selStart - 1) + 1;
  const newText = text.slice(0, lineStart) + prefix + text.slice(lineStart);
  return {
    newText,
    cursorStart: selStart + prefix.length,
    cursorEnd: selStart + prefix.length,
  };
}

const actions: (ToolbarAction | "divider")[] = [
  {
    label: "B",
    title: "Bold",
    action: (text, s, e) => wrapSelection(text, s, e, "**", "**"),
  },
  {
    label: "I",
    title: "Italic",
    action: (text, s, e) => wrapSelection(text, s, e, "*", "*"),
  },
  {
    label: "H",
    title: "Heading",
    action: (text, s, e) => prependToLine(text, s, e, "## "),
  },
  {
    label: "</>",
    title: "Code",
    action: (text, s, e) => {
      const selected = text.slice(s, e);
      const isMultiline = selected.includes("\n");
      if (isMultiline) {
        return wrapSelection(text, s, e, "```\n", "\n```");
      }
      return wrapSelection(text, s, e, "`", "`");
    },
  },
  "divider",
  {
    label: "Link",
    title: "Link",
    action: (text, s, e) => {
      const selected = text.slice(s, e);
      const linkText = selected || "text";
      const newText =
        text.slice(0, s) + `[${linkText}](url)` + text.slice(e);
      const urlStart = s + linkText.length + 3;
      return {
        newText,
        cursorStart: urlStart,
        cursorEnd: urlStart + 3,
      };
    },
  },
  {
    label: "Image",
    title: "Image",
    action: (text, s, e) => {
      const selected = text.slice(s, e);
      const altText = selected || "alt";
      const newText =
        text.slice(0, s) + `![${altText}](url)` + text.slice(e);
      const urlStart = s + altText.length + 4;
      return {
        newText,
        cursorStart: urlStart,
        cursorEnd: urlStart + 3,
      };
    },
  },
  "divider",
  {
    label: "Quote",
    title: "Blockquote",
    action: (text, s, e) => prependToLine(text, s, e, "> "),
  },
  {
    label: "List",
    title: "Unordered list",
    action: (text, s, e) => prependToLine(text, s, e, "- "),
  },
];

export default function MarkdownToolbar({
  textareaRef,
  onUpdate,
}: MarkdownToolbarProps) {
  function handleAction(action: ToolbarAction) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { value, selectionStart, selectionEnd } = textarea;
    const result = action.action(value, selectionStart, selectionEnd);

    onUpdate(result.newText);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(result.cursorStart, result.cursorEnd);
    });
  }

  return (
    <div className="flex flex-row items-center gap-1 rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 p-1.5 dark:border-neutral-800 dark:bg-neutral-900">
      {actions.map((item, index) => {
        if (item === "divider") {
          return (
            <div
              key={`divider-${index}`}
              className="mx-1 h-5 w-px self-center bg-gray-200 dark:bg-neutral-800"
            />
          );
        }

        return (
          <button
            key={item.label}
            type="button"
            title={item.title}
            onClick={() => handleAction(item)}
            className="rounded p-1.5 font-mono text-sm text-gray-600 hover:bg-gray-200 hover:text-gray-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
