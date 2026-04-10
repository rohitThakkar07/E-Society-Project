import React from "react";
import { Loader2 } from "lucide-react";

/**
 * Full-page or section loading UI (theme-aware). Reuse across routes and data fetches.
 */
export function PageLoader({ message = "Loading…", fullScreen = true, className = "" }) {
  const wrap = fullScreen
    ? "flex min-h-screen flex-col items-center justify-center gap-3 bg-[var(--bg)] px-4 text-[var(--text-muted)]"
    : "flex flex-col items-center justify-center gap-2 py-12 text-[var(--text-muted)]";

  return (
    <div
      className={`${wrap} ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
      aria-label={message}
    >
      <Loader2 className="h-10 w-10 shrink-0 animate-spin text-[var(--accent)]" strokeWidth={2.25} />
      <p className="text-center text-sm font-semibold">{message}</p>
    </div>
  );
}

/** Inline row (tables, cards) */
export function PageLoaderInline({ message = "Loading…", className = "" }) {
  return (
    <div
      className={`flex items-center justify-center gap-2 py-10 text-[var(--text-muted)] ${className}`}
      role="status"
      aria-busy="true"
      aria-label={message}
    >
      <Loader2 className="h-6 w-6 shrink-0 animate-spin text-[var(--accent)]" strokeWidth={2.25} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}

/** Neutral skeleton blocks for list/grid placeholders */
export function ListSkeleton({ rows = 5, className = "", rowClassName = "h-20" }) {
  return (
    <div className={`space-y-3 ${className}`} aria-hidden>
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-md border border-[var(--border)] bg-[var(--card)] opacity-80 ${rowClassName}`}
        />
      ))}
    </div>
  );
}

/** Responsive grid of placeholder blocks (cards, polls, facilities) */
export function SkeletonGrid({
  count = 3,
  gridClassName = "grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3",
  itemClassName = "min-h-[16rem]",
}) {
  return (
    <div className={gridClassName} aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`animate-pulse rounded-md border border-[var(--border)] bg-[var(--card)] opacity-85 ${itemClassName}`}
        />
      ))}
    </div>
  );
}

export default PageLoader;
