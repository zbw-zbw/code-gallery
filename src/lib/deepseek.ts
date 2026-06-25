import OpenAI from "openai";
import { AnalysisResult, ArchNode, CodeInput, ExecutionStep, FlowNode } from "@/types";
import { ANALYSIS_SYSTEM_PROMPT, buildAnalysisPrompt } from "./prompts";

const client = new OpenAI({
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: process.env.DEEPSEEK_BASE_URL
    ? `${process.env.DEEPSEEK_BASE_URL.replace(/\/$/, "")}/v1`
    : "https://api.deepseek.com/v1",
});

const MODEL = process.env.DEEPSEEK_MODEL || "deepseek-chat";

export async function analyzeCode(
  code: string,
  language: string
): Promise<AnalysisResult> {
  const codeInput: CodeInput = {
    code,
    language: language as CodeInput["language"],
  };

  try {
    const response = await client.chat.completions.create(
      {
        model: MODEL,
        messages: [
          { role: "system", content: ANALYSIS_SYSTEM_PROMPT },
          {
            role: "user",
            content: buildAnalysisPrompt(code, language),
          },
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
        max_tokens: 4000,
      },
      { timeout: 30000 }
    );

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("API 返回内容为空");
    }

    let parsed: Partial<AnalysisResult>;
    try {
      parsed = JSON.parse(content);
    } catch {
      throw new Error("API 返回的 JSON 解析失败");
    }

    // Normalize the response into a valid AnalysisResult
    const result: AnalysisResult = {
      success: true,
      codeInput,
      summary: parsed.summary || "未能生成代码概述",
      executionSteps: Array.isArray(parsed.executionSteps)
        ? parsed.executionSteps.map((s: unknown, i: number) => {
            const step = s as Record<string, unknown>;
            return {
              stepNumber: Number(step.stepNumber) || i + 1,
              lineNumber: Number(step.lineNumber) || 1,
              description: String(step.description || ""),
              variables: Array.isArray(step.variables)
                ? step.variables.map((v: unknown) => {
                    const varState = v as Record<string, unknown>;
                    return {
                      name: String(varState.name || ""),
                      value: String(varState.value || ""),
                      type: String(varState.type || "unknown"),
                      changed: Boolean(varState.changed),
                    };
                  })
                : [],
              highlight: (step.highlight as ExecutionStep["highlight"]) || "normal",
              annotation: step.annotation
                ? String(step.annotation)
                : undefined,
            };
          })
        : [],
      architecture: {
        nodes: Array.isArray(parsed.architecture?.nodes)
          ? parsed.architecture.nodes.map((n: unknown) => {
              const node = n as Record<string, unknown>;
              return {
                id: String(node.id || ""),
                label: String(node.label || ""),
                type: (node.type as ArchNode["type"]) || "function",
                description: node.description
                  ? String(node.description)
                  : undefined,
              };
            })
          : [],
        edges: Array.isArray(parsed.architecture?.edges)
          ? parsed.architecture.edges.map((e: unknown) => {
              const edge = e as Record<string, unknown>;
              return {
                from: String(edge.from || ""),
                to: String(edge.to || ""),
                label: edge.label ? String(edge.label) : undefined,
              };
            })
          : [],
        mermaidCode: String(parsed.architecture?.mermaidCode || "graph TD\n"),
      },
      dataFlow: {
        nodes: Array.isArray(parsed.dataFlow?.nodes)
          ? parsed.dataFlow.nodes.map((n: unknown) => {
              const node = n as Record<string, unknown>;
              return {
                id: String(node.id || ""),
                label: String(node.label || ""),
                type: (node.type as FlowNode["type"]) || "process",
              };
            })
          : [],
        edges: Array.isArray(parsed.dataFlow?.edges)
          ? parsed.dataFlow.edges.map((e: unknown) => {
              const edge = e as Record<string, unknown>;
              return {
                from: String(edge.from || ""),
                to: String(edge.to || ""),
                label: edge.label ? String(edge.label) : undefined,
              };
            })
          : [],
        mermaidCode: String(parsed.dataFlow?.mermaidCode || "graph LR\n"),
      },
    };

    return result;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "未知错误";
    return {
      success: false,
      codeInput,
      summary: "分析失败",
      executionSteps: [],
      architecture: {
        nodes: [],
        edges: [],
        mermaidCode: "graph TD\n",
      },
      dataFlow: {
        nodes: [],
        edges: [],
        mermaidCode: "graph LR\n",
      },
      error: message,
    };
  }
}
