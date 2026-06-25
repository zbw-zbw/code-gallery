import { toPng } from "html-to-image";

export async function exportAsPng(
  element: HTMLElement,
  options: { scale?: number; title?: string } = {}
): Promise<void> {
  const dataUrl = await toPng(element, {
    pixelRatio: options.scale || 2,
    backgroundColor: "#ffffff",
  });
  const link = document.createElement("a");
  link.download = `code-gallery-${Date.now()}.png`;
  link.href = dataUrl;
  link.click();
}

export function exportAsSvg(svgString: string): void {
  const blob = new Blob([svgString], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `code-gallery-${Date.now()}.svg`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

export function generateEmbedCode(): string {
  return `<iframe src="https://code-gallery.vercel.app/embed/demo" width="800" height="500" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;"></iframe>`;
}

export function generateMarkdown(
  code: string,
  language: string,
  summary: string,
  stepCount: number,
  mermaidCode: string
): string {
  return `## 代码分析 - ${summary}

### 源代码
\`\`\`${language}
${code}
\`\`\`

### 执行流程
共 ${stepCount} 个执行步骤

### 架构图
\`\`\`mermaid
${mermaidCode}
\`\`\`

> 由 [代码画廊](https://code-gallery.vercel.app) 生成`;
}
