"use client";

import { useState, useCallback, useRef, createContext, useContext, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType, options?: { duration?: number }) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const DEFAULT_DURATION: Record<ToastType, number> = {
  success: 2000,
  error: 5000,
  warning: 4000,
  info: 3000,
};

const MAX_TOASTS = 5;

const TYPE_STYLES: Record<ToastType, string> = {
  success: "bg-data-green text-white",
  error: "bg-red-500 text-white",
  warning: "bg-amber-500 text-white",
  info: "bg-gallery-black text-white",
};

const TYPE_ICONS: Record<ToastType, ReactNode> = {
  success: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  error: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const idCounter = useRef(0);
  const timersRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());

  const removeToast = useCallback((id: number) => {
    const timer = timersRef.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timersRef.current.delete(id);
    }
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "info", options?: { duration?: number }) => {
      // Dedupe: if the same message already exists with the same type, skip
      setToasts((prev) => {
        const exists = prev.find((t) => t.message === message && t.type === type);
        if (exists) return prev;
        return prev;
      });

      const id = ++idCounter.current;
      const newToast: Toast = { id, message, type };
      setToasts((prev) => {
        // Add new toast, trim to MAX_TOASTS (drop oldest)
        const updated = [...prev, newToast];
        if (updated.length > MAX_TOASTS) {
          const dropped = updated.slice(0, updated.length - MAX_TOASTS);
          dropped.forEach((t) => {
            const timer = timersRef.current.get(t.id);
            if (timer) {
              clearTimeout(timer);
              timersRef.current.delete(t.id);
            }
          });
          return updated.slice(-MAX_TOASTS);
        }
        return updated;
      });

      const duration = options?.duration ?? DEFAULT_DURATION[type];
      const timer = setTimeout(() => removeToast(id), duration);
      timersRef.current.set(id, timer);
    },
    [removeToast]
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container - aria-live ensures screen readers announce notifications */}
      <div
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 pointer-events-none"
        aria-live="polite"
        aria-atomic="true"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onRemove={() => removeToast(toast.id)}
              onPause={() => {
                const timer = timersRef.current.get(toast.id);
                if (timer) {
                  clearTimeout(timer);
                  timersRef.current.delete(toast.id);
                }
              }}
              onResume={() => {
                const timer = setTimeout(
                  () => removeToast(toast.id),
                  DEFAULT_DURATION[toast.type]
                );
                timersRef.current.set(toast.id, timer);
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({
  toast,
  onRemove,
  onPause,
  onResume,
}: {
  toast: Toast;
  onRemove: () => void;
  onPause: () => void;
  onResume: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
      className={`group flex items-center gap-2 px-4 py-2.5 ${TYPE_STYLES[toast.type]} text-sm font-medium rounded-full shadow-lg pointer-events-auto max-w-md`}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      role="status"
    >
      <span className="flex-shrink-0">{TYPE_ICONS[toast.type]}</span>
      <span className="flex-1">{toast.message}</span>
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-5 h-5 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="关闭通知"
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      </button>
    </motion.div>
  );
}
