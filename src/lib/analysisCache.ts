import { AnalysisResult } from "@/types";

const CACHE_KEY = "code-gallery-analysis-cache";
const MAX_CACHE_SIZE = 20;
const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

interface CacheEntry {
  key: string;
  result: AnalysisResult;
  timestamp: number;
}

function makeKey(code: string, language: string): string {
  // Simple hash for cache key (not cryptographic, just for dedup)
  const str = `${language}::${code}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash + char) | 0;
  }
  return hash.toString(36);
}

export function getCached(code: string, language: string): AnalysisResult | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entries: CacheEntry[] = JSON.parse(raw);
    const key = makeKey(code, language);
    const entry = entries.find(
      (e) => e.key === key && Date.now() - e.timestamp < CACHE_TTL
    );
    return entry?.result ?? null;
  } catch {
    return null;
  }
}

export function setCache(code: string, language: string, result: AnalysisResult): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const entries: CacheEntry[] = raw ? JSON.parse(raw) : [];
    const key = makeKey(code, language);
    // Remove existing entry for same key
    const filtered = entries.filter((e) => e.key !== key);
    const newEntry: CacheEntry = { key, result, timestamp: Date.now() };
    const updated = [newEntry, ...filtered]
      .slice(0, MAX_CACHE_SIZE)
      .filter((e) => Date.now() - e.timestamp < CACHE_TTL);
    localStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable
  }
}

export function clearCache(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // silently ignore
  }
}
