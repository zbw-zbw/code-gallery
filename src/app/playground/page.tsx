"use client";

import { useState, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Language, AnalysisResult } from "@/types";
import PlaygroundLayout from "@/components/playground/PlaygroundLayout";
import CodeInputPanel from "@/components/playground/CodeInputPanel";
import ResultPanel from "@/components/playground/ResultPanel";
import ExampleDrawer from "@/components/playground/ExampleDrawer";
import { ToastProvider } from "@/components/shared/Toast";
import { EXAMPLES } from "@/lib/examples";
import { Example } from "@/lib/examples";

function PlaygroundContent() {
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState<Language>("javascript");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load example from URL param
  useEffect(() => {
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

  const handleAnalyze = useCallback(async () => {
    if (!code.trim()) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });

      const data: AnalysisResult = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "分析请求失败");
      } else {
        setResult(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "网络请求失败");
    } finally {
      setIsAnalyzing(false);
    }
  }, [code, language]);

  const handleSelectExample = (example: Example) => {
    setCode(example.code);
    setLanguage(example.language);
    setResult(example.preAnalyzed);
    setError(null);
  };

  return (
    <PlaygroundLayout>
      <div className="h-full grid grid-cols-1 md:grid-cols-2 grid-rows-[1fr_1fr] md:grid-rows-1 overflow-y-auto md:overflow-y-hidden">
        {/* Left: Code input */}
        <div className="min-h-0 flex flex-col">
          <CodeInputPanel
            code={code}
            language={language}
            onCodeChange={setCode}
            onLanguageChange={setLanguage}
            onAnalyze={handleAnalyze}
            isAnalyzing={isAnalyzing}
            extraToolbar={<ExampleDrawer onSelect={handleSelectExample} />}
          />
        </div>

        {/* Right: Result */}
        <div className="min-h-0 flex flex-col">
          <ResultPanel
            result={result}
            isAnalyzing={isAnalyzing}
            error={error}
            onRetry={handleAnalyze}
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
