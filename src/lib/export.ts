import { toPng } from "html-to-image";
import { getHighlightedHtml } from "@/components/shared/SyntaxHighlighter";

export interface PngExportOptions {
  scale?: number;
  title?: string;
  backgroundColor?: string;
  /** If true, fall back to opening the image in a new tab when the download trigger fails */
  fallbackToOpen?: boolean;
}

export async function exportAsPng(
  element: HTMLElement,
  options: PngExportOptions = {}
): Promise<void> {
  const {
    scale = 2,
    title = "code-gallery",
    backgroundColor = "#ffffff",
    fallbackToOpen = true,
  } = options;

  let dataUrl: string;
  try {
    dataUrl = await toPng(element, {
      pixelRatio: scale,
      backgroundColor,
      // Skip loading cross-origin assets to keep the export fast and predictable
      skipFonts: false,
      cacheBust: true,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "未知错误";
    throw new Error(`PNG 生成失败: ${message}`);
  }

  if (!dataUrl || dataUrl.length < 100) {
    throw new Error("PNG 数据为空，请重试");
  }

  // Sanitize filename — keep it safe for common filesystems
  const safeTitle = title.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 60) || "code-gallery";
  const filename = `${safeTitle}-${Date.now()}.png`;

  // Prefer Blob URL over data URL for large images — avoids the 2MB dataURL limit
  // on some browsers and releases memory immediately via revokeObjectURL.
  try {
    const blob = await (await fetch(dataUrl)).blob();
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.download = filename;
    link.href = blobUrl;
    link.rel = "noopener";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    // Defer revoke to the next tick so Safari/Edge actually start the download first
    setTimeout(() => URL.revokeObjectURL(blobUrl), 0);
  } catch (blobErr) {
    if (!fallbackToOpen) {
      throw new Error(
        `PNG 下载失败: ${blobErr instanceof Error ? blobErr.message : "未知错误"}`
      );
    }
    // Last-resort fallback: open the data URL in a new tab
    window.open(dataUrl, "_blank", "noopener,noreferrer");
  }
}

export function exportAsSvg(svgString: string, title = "code-gallery"): void {
  if (!svgString) {
    throw new Error("SVG 内容为空");
  }
  const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const safeTitle = title.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 60) || "code-gallery";
  link.download = `${safeTitle}-${Date.now()}.svg`;
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

/**
 * Generate an embed iframe that points to the current origin.
 * Falls back to a sensible default when window is not available (SSR).
 */
export function generateEmbedCode(options: {
  width?: number;
  height?: number;
  path?: string;
} = {}): string {
  const { width = 800, height = 500, path = "/playground" } = options;
  const origin =
    typeof window !== "undefined" ? window.location.origin : "https://code-gallery.kyriewen.cn";
  const safePath = path.startsWith("/") ? path : `/${path}`;
  return `<iframe src="${origin}${safePath}" width="${width}" height="${height}" frameborder="0" style="border-radius:12px;border:1px solid #e5e7eb;" loading="lazy" title="代码画廊"></iframe>`;
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

> 由 [代码画廊](https://code-gallery.kyriewen.cn/playground) 生成`;
}

/**
 * Build a self-contained HTML file that embeds the analysis inline.
 * The page works offline — no network, no API calls. The user can open the
 * downloaded file in any modern browser and play back the analysis.
 */
export function buildStandaloneHtml(args: {
  title: string;
  language: string;
  code: string;
  summary: string;
  steps: Array<{
    lineNumber: number;
    description: string;
    variables?: Record<string, string>;
    highlight?: string;
  }>;
  mermaidCode: string;
}): string {
  const { title, language, code, summary, steps, mermaidCode } = args;

  const escapedTitle = escapeHtml(title);
  const escapedSummary = escapeHtml(summary);
  const escapedCode = escapeHtml(code);
  const highlightedCode = getHighlightedHtml(code, language);
  const stepsJson = JSON.stringify(steps).replace(/</g, "\\u003c");
  const mermaidJson = JSON.stringify(mermaidCode).replace(/</g, "\\u003c");

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapedTitle} - 代码画廊</title>
<style>
  :root{--bg:#ffffff;--fg:#111827;--muted:#6b7280;--line:#f3f4f6;--line-active:#a78bfa33;--line-border:#7c3aed;--code-bg:#1f2937;--code-fg:#e5e7eb;--code-muted:#9ca3af;--accent:#7c3aed;--accent-2:#10b981;--border:#e5e7eb;--shadow:0 1px 2px rgba(0,0,0,.04),0 8px 24px rgba(0,0,0,.06)}
  *{box-sizing:border-box}
  html,body{margin:0;padding:0;background:var(--bg);color:var(--fg);font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif;line-height:1.5}
  a{color:var(--accent);text-decoration:none}
  a:hover{text-decoration:underline}
  .wrap{max-width:1100px;margin:0 auto;padding:24px 20px 80px}
  header{margin-bottom:24px}
  h1{font-size:24px;margin:0 0 6px}
  .summary{color:var(--muted);font-size:14px;margin:0}
  .meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:10px;font-size:12px;color:var(--muted)}
  .badge{display:inline-block;padding:2px 8px;border:1px solid var(--border);border-radius:999px;background:#fafafa}
  .grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
  @media (max-width:800px){.grid{grid-template-columns:1fr}}
  .card{background:#fff;border:1px solid var(--border);border-radius:14px;box-shadow:var(--shadow);overflow:hidden;display:flex;flex-direction:column;min-height:420px}
  .card h2{font-size:14px;margin:0;padding:12px 14px;border-bottom:1px solid var(--border);background:#fafafa;font-weight:600;color:#374151}
  .card .body{flex:1;padding:14px;overflow:auto}
  .code-card{background:var(--code-bg);color:var(--code-fg);font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:12.5px;line-height:1.6}
  .code-card h2{background:#111827;color:#f9fafb;border-bottom:1px solid #374151}
  .code-line{display:flex}
  .code-line.active{background:var(--line-active)}
  .code-line.active .ln{color:var(--line-border);font-weight:600}
  .code-line.active .src{color:#fff}
  .ln{width:46px;text-align:right;padding:0 10px;color:#6b7280;user-select:none;flex-shrink:0}
  .src{padding-right:8px;white-space:pre;overflow:hidden}
  .player{display:flex;align-items:center;gap:10px;padding:10px 14px;border-top:1px solid var(--border);background:#fafafa;font-size:12px}
  .player button{appearance:none;border:1px solid var(--border);background:#fff;border-radius:8px;padding:6px 10px;cursor:pointer;font-size:12px}
  .player button:hover{background:#f3f4f6}
  .player .step{color:var(--muted);font-variant-numeric:tabular-nums}
  .desc{padding:10px 14px;border-top:1px solid var(--border);background:#fafafa;font-size:13px;color:#374151;min-height:42px}
  .vars{margin-top:8px;display:flex;flex-wrap:wrap;gap:6px}
  .var{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;font-size:11px;background:#f3f4f6;border:1px solid var(--border);border-radius:6px;padding:2px 6px}
  .var b{color:var(--accent);font-weight:600}
  .mermaid-host{display:flex;align-items:center;justify-content:center;padding:18px;min-height:300px;overflow:auto}
  .mermaid-host svg{max-width:100%;height:auto}
  footer{margin-top:32px;text-align:center;color:var(--muted);font-size:12px}
  footer a{color:var(--accent)}
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>${escapedTitle}</h1>
    <p class="summary">${escapedSummary}</p>
    <div class="meta">
      <span class="badge">语言: ${escapeHtml(language)}</span>
      <span class="badge">步骤: ${steps.length}</span>
      <span class="badge">导出时间: ${new Date().toLocaleString("zh-CN")}</span>
    </div>
  </header>

  <div class="grid">
    <section class="card code-card">
      <h2>源代码</h2>
      <div class="body" id="codeBody"></div>
      <div class="player">
        <button id="prevBtn" type="button">◀ 上一步</button>
        <button id="playBtn" type="button">▶ 播放</button>
        <button id="nextBtn" type="button">▶ 下一步</button>
        <span class="step" id="stepLabel">0 / ${steps.length}</span>
      </div>
      <div class="desc" id="stepDesc">点击「播放」开始逐步执行。</div>
    </section>

    <section class="card">
      <h2>架构图</h2>
      <div class="body">
        <div class="mermaid-host" id="mermaidHost"></div>
      </div>
    </section>
  </div>

  <footer>由 <a href="https://code-gallery.kyriewen.cn/playground">代码画廊</a> 生成 · 离线可打开</footer>
</div>

<script type="application/json" id="steps">${stepsJson}</script>
<script type="application/json" id="mermaid">${mermaidJson}</script>
<script>
// ---- Code lines (rendered once) ----
(function(){
  var codeHtml = ${JSON.stringify(highlightedCode)};
  var lines = codeHtml.split("\\n");
  var box = document.getElementById("codeBody");
  for(var i=0;i<lines.length;i++){
    var row=document.createElement("div");
    row.className="code-line";
    row.dataset.line=(i+1);
    var ln=document.createElement("div");
    ln.className="ln";
    ln.textContent=(i+1);
    var src=document.createElement("div");
    src.className="src";
    src.innerHTML=lines[i]||"\\u00a0";
    row.appendChild(ln);row.appendChild(src);
    box.appendChild(row);
  }
})();

// ---- Player ----
(function(){
  var steps = JSON.parse(document.getElementById("steps").textContent);
  var cur = 0;
  var playing = false;
  var timer = null;
  var lines = document.querySelectorAll(".code-line");
  var stepLabel = document.getElementById("stepLabel");
  var stepDesc = document.getElementById("stepDesc");
  var playBtn = document.getElementById("playBtn");
  var prevBtn = document.getElementById("prevBtn");
  var nextBtn = document.getElementById("nextBtn");

  function clearActive(){
    for(var i=0;i<lines.length;i++) lines[i].classList.remove("active");
  }
  function render(){
    clearActive();
    var s = steps[cur];
    if(!s){ stepLabel.textContent="0 / "+steps.length; stepDesc.textContent="点击「播放」开始逐步执行。"; return; }
    if(s.lineNumber>0 && lines[s.lineNumber-1]) lines[s.lineNumber-1].classList.add("active");
    stepLabel.textContent=(cur+1)+" / "+steps.length;
    var html = "<strong>第 "+(cur+1)+" 步:</strong> "+escapeHtml(s.description||"");
    if(s.variables && Object.keys(s.variables).length){
      html += '<div class="vars">';
      for(var k in s.variables){ html += '<span class="var"><b>'+escapeHtml(k)+'</b> = '+escapeHtml(String(s.variables[k]))+'</span>'; }
      html += "</div>";
    }
    stepDesc.innerHTML = html;
  }
  function step(delta){
    cur = Math.max(0, Math.min(steps.length-1, cur+delta));
    render();
  }
  function togglePlay(){
    if(playing){ stop(); } else { play(); }
  }
  function play(){
    if(playing) return;
    if(cur>=steps.length-1) cur=0;
    playing = true; playBtn.textContent="⏸ 暂停";
    timer = setInterval(function(){
      if(cur>=steps.length-1){ stop(); return; }
      step(1);
    }, 1500);
  }
  function stop(){
    playing = false; playBtn.textContent="▶ 播放";
    if(timer){ clearInterval(timer); timer=null; }
  }
  playBtn.addEventListener("click", togglePlay);
  prevBtn.addEventListener("click", function(){ stop(); step(-1); });
  nextBtn.addEventListener("click", function(){ stop(); step(1); });
  document.addEventListener("keydown", function(e){
    if(e.target && (e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")) return;
    if(e.key==="ArrowRight"){ stop(); step(1); }
    else if(e.key==="ArrowLeft"){ stop(); step(-1); }
    else if(e.key===" "){ e.preventDefault(); togglePlay(); }
  });
  render();
})();

// ---- Mermaid (best-effort CDN; graceful fallback if offline) ----
(function(){
  var code = JSON.parse(document.getElementById("mermaid").textContent);
  var host = document.getElementById("mermaidHost");
  var script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js";
  script.onload = function(){
    try{
      mermaid.initialize({ startOnLoad:false, theme:"default", securityLevel:"strict", fontFamily:"inherit" });
      mermaid.render("mermaid-svg", code).then(function(r){
        host.innerHTML = r.svg;
      }).catch(function(){
        host.innerHTML = '<pre style="white-space:pre-wrap;font-size:12px;color:#374151">'+escapeHtml(code)+'</pre>';
      });
    }catch(e){
      host.innerHTML = '<pre style="white-space:pre-wrap;font-size:12px;color:#374151">'+escapeHtml(code)+'</pre>';
    }
  };
  script.onerror = function(){
    host.innerHTML = '<pre style="white-space:pre-wrap;font-size:12px;color:#374151">'+escapeHtml(code)+'</pre>';
  };
  document.head.appendChild(script);
})();

function escapeHtml(s){
  return String(s).replace(/[&<>"']/g, function(c){ return ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"})[c]; });
}
</script>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Trigger a download of the standalone HTML in the browser.
 */
export function downloadStandaloneHtml(
  html: string,
  filename = "code-gallery-analysis"
): void {
  const safeName = filename.replace(/[\\/:*?"<>|]+/g, "-").slice(0, 60) || "code-gallery-analysis";
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.download = `${safeName}-${Date.now()}.html`;
  link.href = url;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => URL.revokeObjectURL(url), 0);
}
