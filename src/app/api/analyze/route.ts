import { NextRequest, NextResponse } from "next/server";
import { analyzeCode } from "@/lib/deepseek";
import { AnalysisResult, Language } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/lib/constants";

export const maxDuration = 30;

// Language whitelist — reject unsupported languages early
const VALID_LANGUAGES = new Set(SUPPORTED_LANGUAGES.map((l) => l.value));

export async function POST(request: NextRequest) {
  let code: string = "";
  let language: string = "javascript";

  try {
    const body = await request.json();
    code = body.code;
    language = body.language;
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "请求体格式错误",
        codeInput: { code: "", language: "javascript" },
        summary: "",
        executionSteps: [],
        architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
        dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
      } as AnalysisResult,
      { status: 400 }
    );
  }

  const safeLang: Language = VALID_LANGUAGES.has(language as Language)
    ? (language as Language)
    : "javascript";

  // Validation — check trimmed code to catch whitespace-only input
  if (!code || typeof code !== "string" || code.trim().length === 0) {
    return NextResponse.json(
      {
        success: false,
        error: "代码不能为空",
        codeInput: { code: code || "", language: safeLang },
        summary: "",
        executionSteps: [],
        architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
        dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
      } as AnalysisResult,
      { status: 400 }
    );
  }

  if (code.length > 5000) {
    return NextResponse.json(
      {
        success: false,
        error: "代码长度不能超过 5000 字符",
        codeInput: { code, language: safeLang },
        summary: "",
        executionSteps: [],
        architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
        dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
      } as AnalysisResult,
      { status: 400 }
    );
  }

  if (!process.env.DEEPSEEK_API_KEY) {
    return NextResponse.json(
      {
        success: false,
        error: "服务暂未配置，请稍后再试",
        codeInput: { code, language: safeLang },
        summary: "",
        executionSteps: [],
        architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
        dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
      } as AnalysisResult,
      { status: 500 }
    );
  }

  try {
    const result = await analyzeCode(code, safeLang);

    if (!result.success) {
      return NextResponse.json(result, { status: 502 });
    }

    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "服务器内部错误";
    return NextResponse.json(
      {
        success: false,
        error: message,
        // Preserve the user's original code so the frontend can re-fill the editor
        codeInput: { code, language: safeLang },
        summary: "",
        executionSteps: [],
        architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
        dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
      } as AnalysisResult,
      { status: 500 }
    );
  }
}
