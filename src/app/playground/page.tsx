"use client";

import { useState, useCallback, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Language, AnalysisResult } from "@/types";
import PlaygroundLayout from "@/components/playground/PlaygroundLayout";
import CodeInputPanel from "@/components/playground/CodeInputPanel";
import ResultPanel from "@/components/playground/ResultPanel";
import ExampleDrawer from "@/components/playground/ExampleDrawer";
import HistoryDrawer from "@/components/playground/HistoryDrawer";
import { ToastProvider } from "@/components/shared/Toast";
import { EXAMPLES } from "@/lib/examples";
import { addHistory } from "@/lib/codeHistory";
import { getCached, setCache } from "@/lib/analysisCache";
import type { Example } from "@/lib/examples";

function encodeCodeForUrl(code: string, language: string): string {
  try {
    return btoa(unescape(encodeURIComponent(`${language}||${code}`)));
  } catch {
    return "";
  }
}

function decodeCodeFromUrl(encoded: string): { code: string; language: Language } | null {
  try {
    const decoded = decodeURIComponent(escape(atob(encoded)));
    const [lang, ...codeParts] = decoded.split("||");
    if (lang && codeParts.length > 0) {
      return { code: codeParts.join("||"), language: lang as Language };
    }
  } catch {}
  return null;
}

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const abortRef = useRef<AbortController | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisDuration, setAnalysisDuration] = useState<number | null>(null);

  // Load example from URL param (runs once on mount)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (initializedRef.current) return;
    initializedRef.current = true;

    // Priority: ?code= param > ?example= param
    const codeParam = searchParams.get("code");
    if (codeParam) {
      const decoded = decodeCodeFromUrl(codeParam);
      if (decoded) {
        setCode(decoded.code);
        setLanguage(decoded.language);
        return;
      }
    }

    const exampleId = searchParams.get("example");
    if (exampleId) {
      const example = EXAMPLES.find((e) => e.id === exampleId);
      if (example) {
        setCode(example.code);
        setLanguage(example.language);
        setResult(example.preAnalyzed);
      }
    }
  }, [searchParams]);

  // Cleanup fetch on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return;

    // Check cache first — skip API call if cached
    const cached = getCached(code, language);
    if (cached) {
      setResult(cached);
      setError(null);
      setAnalysisDuration(0); // Cached = instant
      return;
    }

    // Cancel any in-flight request
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsAnalyzing(true);
    setError(null);
    const startTime = Date.now();

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
        signal: controller.signal,
      });

      const data: AnalysisResult = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "分析请求失败");
      } else {
        setResult(data);
        setAnalysisDuration(Date.now() - startTime);
        // Cache the result for future same-code analyses
        setCache(code, language, data);
        // Save to history after successful analysis
        addHistory(code, language, data.summary);
      }
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        // User cancelled, do nothing
        return;
      }
      setError(err instanceof Error ? err.message : "网络请求失败");
    } finally {
      if (abortRef.current === controller) {
        setIsAnalyzing(false);
        abortRef.current = null;
      }
    }
  }, [code, language]);

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsAnalyzing(false);
  }, []);

  const handleShareUrl = useCallback(() => {
    const encoded = encodeCodeForUrl(code, language);
    if (!encoded) return;
    const url = `${window.location.origin}${window.location.pathname}?code=${encoded}`;
    router.replace(url, { scroll: false });
    navigator.clipboard.writeText(url);
  }, [code, language, router]);

  // Skip clearing result on initial load and example selection
  const skipClearRef = useRef(false);

  const handleSelectExample = (example: Example) => {
    skipClearRef.current = true;
    setCode(example.code);
    setLanguage(example.language);
    setResult(example.preAnalyzed);
    setError(null);
  };

  const handleSelectHistory = useCallback((historyCode: string, historyLang: Language) => {
    skipClearRef.current = true;
    setCode(historyCode);
    setLanguage(historyLang);
    setResult(null);
    setError(null);
  }, []);

  // Clear result when code changes (user edits code after seeing a result)
  const codeChangedRef = useRef(false);
  useEffect(() => {
    if (skipClearRef.current) {
      skipClearRef.current = false;
      return;
    }
    // Don't clear on initial load from URL/example
    if (codeChangedRef.current) {
      setResult(null);
      setError(null);
    }
    codeChangedRef.current = true;
  }, [code]);

  return (
    <PlaygroundLayout>
      <div className="flex-1 min-h-0 flex flex-col md:flex-row overflow-hidden">
        {/* Left: Code input - 50% on both mobile and desktop */}
        <div className="flex-1 md:flex-1 min-h-0 flex flex-col">
          <CodeInputPanel
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onAnalyze={handleAnalyze}
            onCancel={handleCancel}
            onShareUrl={handleShareUrl}
            onClear={() => {
              setResult(null);
              setError(null);
            }}
            isAnalyzing={isAnalyzing}
            extraToolbar={
              <div className="flex items-center gap-2">
                <HistoryDrawer onSelect={handleSelectHistory} />
                <ExampleDrawer onSelect={handleSelectExample} />
              </div>
            }
          />
        </div>

        {/* Right: Result - 50% on both mobile and desktop */}
        <div className="flex-1 md:flex-1 min-h-0 flex flex-col">
          <ResultPanel
            result={result}
            isAnalyzing={isAnalyzing}
            error={error}
            onRetry={handleAnalyze}
            onShareUrl={handleShareUrl}
            analysisDuration={analysisDuration}
          />
        </div>
      </div>
    </PlaygroundLayout>
  );
}

export default function PlaygroundPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center text-gallery-gray">
          加载中...
        </div>
      }
    >
      <ToastProvider>
        <PlaygroundContent />
      </ToastProvider>
    </Suspense>
  );
}
