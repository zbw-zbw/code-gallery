import { Language } from "@/types";

const STORAGE_KEY = "code-gallery-history";
const MAX_HISTORY = 8;

export interface HistoryEntry {
  id: string;
  code: string;
  language: Language;
  timestamp: number;
  summary?: string;
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export function getHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

export function addHistory(code: string, language: Language, summary?: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    // Dedup: if same code+language already exists, remove old entry
    const filtered = history.filter(
      (h) => !(h.code === code && h.language === language)
    );
    const entry: HistoryEntry = {
      id: generateId(),
      code,
      language,
      timestamp: Date.now(),
      summary: summary?.slice(0, 80),
    };
    const updated = [entry, ...filtered].slice(0, MAX_HISTORY);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Storage full or unavailable — silently ignore
  }
}

export function removeHistory(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const history = getHistory();
    const updated = history.filter((h) => h.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // silently ignore
  }
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // silently ignore
  }
}

export function getPreview(code: string, maxLen = 80): string {
  const lines = code.split("\n");
  if (lines.length <= 2) {
    const text = lines.join(" ").trim();
    return text.length > maxLen ? text.slice(0, maxLen) + "..." : text;
  }
  // Show first line (or first non-empty line)
  const firstNonEmpty = lines.find((l) => l.trim()) || lines[0];
  const trimmed = firstNonEmpty.trim();
  return trimmed.length > maxLen ? trimmed.slice(0, maxLen) + "..." : trimmed;
}

export function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  if (seconds < 60) return "刚刚";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} 天前`;
  return new Date(timestamp).toLocaleDateString("zh-CN");
}
