import { ReactNode } from "react";

interface LoadingFallbackProps {
  message?: string;
  /** Smaller, inline variant (for sections inside a layout) */
  inline?: boolean;
  /** Optional sub-action button row */
  actions?: ReactNode;
}

/**
 * Reusable loading fallback used by Suspense boundaries.
 * Avoids the "just plain text" experience on slow networks / hydration.
 */
export default function LoadingFallback({
  message = "加载中...",
  inline = false,
  actions,
}: LoadingFallbackProps) {
  if (inline) {
    return (
      <div className="flex items-center gap-2 text-sm text-gallery-gray py-3 px-2">
        <span
          aria-hidden="true"
          className="inline-block w-3.5 h-3.5 border-2 border-gallery-gray/40 border-t-code-purple rounded-full animate-spin"
        />
        <span>{message}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="h-screen w-full flex flex-col items-center justify-center gap-3 bg-gallery-white"
    >
      <div
        aria-hidden="true"
        className="w-10 h-10 border-[3px] border-gallery-border border-t-code-purple rounded-full animate-spin"
      />
      <p className="text-sm text-gallery-gray">{message}</p>
      {actions}
    </div>
  );
}
