"use client";

import { useCallback, useEffect, useState } from "react";
import { useAtom } from "jotai";
import { toastAtom, type ToastMessage } from "@/atoms/toast";

let toastId = 0;

export function useToast() {
  const [, setToasts] = useAtom(toastAtom);

  const toast = useCallback(
    (message: string, type: "success" | "error" | "info" = "info") => {
      const id = ++toastId;
      setToasts((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    },
    [setToasts]
  );

  return toast;
}

const accentColors: Record<ToastMessage["type"], string> = {
  success: "bg-green-500",
  error: "bg-red-500",
  info: "bg-blue-500",
};

function ToastItem({ toast, onRemove }: { toast: ToastMessage; onRemove: () => void }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation on next frame
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setVisible(false);
      // Wait for exit animation before removing
      setTimeout(onRemove, 200);
    }, 2800);
    return () => clearTimeout(timeout);
  }, [onRemove]);

  return (
    <div
      className={`flex items-stretch overflow-hidden rounded-lg shadow-lg transition-all duration-200 ease-out ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-4"
      } bg-white dark:bg-neutral-900`}
    >
      {/* Color accent bar */}
      <div className={`w-1 shrink-0 ${accentColors[toast.type]}`} />

      <p className="px-4 py-3 text-sm text-gray-900 dark:text-neutral-100">
        {toast.message}
      </p>
    </div>
  );
}

export function Toast() {
  const [toasts, setToasts] = useAtom(toastAtom);

  const removeToast = useCallback(
    (id: number) => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    },
    [setToasts]
  );

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onRemove={() => removeToast(t.id)} />
      ))}
    </div>
  );
}
