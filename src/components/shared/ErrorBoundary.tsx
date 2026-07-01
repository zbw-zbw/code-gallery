"use client";

import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log to console for debugging — in production, this would be reported to Sentry
    if (typeof window !== "undefined") {
      console.error("[ErrorBoundary]", {
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
      });
    }
  }

  handleReset = () => {
    // Reset state — if error persists after reset, the user will see the fallback again
    // (which is the correct behavior for non-recoverable errors)
    this.setState({ hasError: false, error: null });
  };

  handleReload = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  handleCopyError = async () => {
    const { error } = this.state;
    if (!error || typeof navigator === "undefined") return;
    const text = `${error.message}\n\n${error.stack || ""}`;
    try {
      await navigator.clipboard.writeText(text);
      // ToastProvider may not be available inside ErrorBoundary, so use alert as fallback
      if (typeof window !== "undefined" && "navigator" in window) {
        alert("错误信息已复制到剪贴板");
      }
    } catch {
      // Fallback: select text in a temporary textarea
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand("copy");
      } catch {
        // ignore
      }
      document.body.removeChild(textarea);
    }
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="h-full flex flex-col items-center justify-center text-gallery-gray px-6 py-8">
          <div className="w-14 h-14 rounded-xl bg-red-50 flex items-center justify-center mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gallery-black mb-1">
            渲染出错
          </p>
          <p className="text-xs text-gallery-gray text-center max-w-md mb-4 break-all">
            {this.state.error?.message || "发生未知错误"}
          </p>
          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={this.handleReset}
              className="px-4 py-1.5 bg-code-purple hover:bg-code-purple-light text-white text-xs font-medium rounded-lg transition-colors duration-200"
            >
              重试
            </button>
            <button
              onClick={this.handleCopyError}
              className="px-4 py-1.5 bg-gallery-bg hover:bg-gallery-border/50 text-gallery-black text-xs font-medium rounded-lg transition-colors duration-200"
            >
              复制错误
            </button>
            <button
              onClick={this.handleReload}
              className="px-4 py-1.5 bg-gallery-bg hover:bg-gallery-border/50 text-gallery-gray hover:text-gallery-black text-xs font-medium rounded-lg transition-colors duration-200"
            >
              刷新页面
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
