import { NextRequest, NextResponse } from "next/server";
import { analyzeCode } from "@/lib/deepseek";
import { AnalysisResult } from "@/types";

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, language } = body;

    // Validation
    if (!code || typeof code !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "代码不能为空",
          codeInput: { code: "", language: language || "javascript" },
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
          codeInput: { code, language: language || "javascript" },
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
          error: "未配置 DeepSeek API Key，请在 .env.local 中设置 DEEPSEEK_API_KEY",
          codeInput: { code, language: language || "javascript" },
          summary: "",
          executionSteps: [],
          architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
          dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
        } as AnalysisResult,
        { status: 500 }
      );
    }

    const result = await analyzeCode(code, language || "javascript");

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
        codeInput: { code: "", language: "javascript" },
        summary: "",
        executionSteps: [],
        architecture: { nodes: [], edges: [], mermaidCode: "graph TD\n" },
        dataFlow: { nodes: [], edges: [], mermaidCode: "graph LR\n" },
      } as AnalysisResult,
      { status: 500 }
    );
  }
}
