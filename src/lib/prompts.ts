export function buildAnalysisPrompt(code: string, language: string): string {
  return `请分析以下 ${language} 代码，返回严格的 JSON 格式分析结果。

代码：
\`\`\`${language}
${code}
\`\`\`

要求返回的 JSON 结构如下，所有字段必须存在：

{
  "summary": "一句话概述代码功能（不超过30字）",
  "executionSteps": [
    {
      "stepNumber": 1,
      "lineNumber": 1,
      "description": "本步骤说明，如'初始化变量 i = 0'",
      "variables": [
        { "name": "i", "value": "0", "type": "number", "changed": true }
      ],
      "highlight": "normal",
      "annotation": "可选注解"
    }
  ],
  "architecture": {
    "nodes": [
      { "id": "main", "label": "main", "type": "function", "description": "主函数" }
    ],
    "edges": [
      { "from": "main", "to": "helper", "label": "calls" }
    ],
    "mermaidCode": "graph TD\\n  A[main] --> B[helper]"
  },
  "dataFlow": {
    "nodes": [
      { "id": "input", "label": "输入数据", "type": "input" }
    ],
    "edges": [
      { "from": "input", "to": "process", "label": "原始数据" }
    ],
    "mermaidCode": "graph LR\\n  A[输入数据] --> B[处理过程]"
  }
}

详细要求：

1. **summary**: 一句话概述代码功能，简洁明了。

2. **executionSteps**:
   - 逐步模拟代码执行，最多返回 15 个关键步骤。
   - 每个步骤必须包含 stepNumber、lineNumber（对应源代码行号）、description（中文描述）、variables（当前所有可见变量的状态）。
   - variables 中每个变量包含 name、value（JSON 字符串形式）、type（number/string/array/object/boolean）、changed（本步骤是否变化）。
   - highlight 类型：normal、branch-true、branch-false、loop-start、loop-end、function-call、return。
   - 对于循环，展示前 2-3 次迭代即可。
   - description 使用中文。

3. **architecture**:
   - nodes: 识别函数、类、变量等，每个有 id、label、type（function/class/module/variable/external）、description。
   - edges: 表示调用关系、依赖关系等。
   - mermaidCode: 使用 Mermaid graph TD 语法的字符串，可生成架构图。确保语法正确。

4. **dataFlow**:
   - nodes: 标识数据的输入、处理、输出、决策点、存储点。
   - edges: 表示数据流动方向。
   - mermaidCode: 使用 Mermaid graph LR 语法的字符串，展示数据从左到右的流动。确保语法正确。

请确保返回的是严格合法的 JSON，不要包含任何 markdown 代码块标记或其他非 JSON 内容。`;
}

export const ANALYSIS_SYSTEM_PROMPT = `你是一个专业的代码分析专家。你的任务是将代码转化为结构化的可视化数据，帮助用户理解代码的执行过程、架构关系和数据流向。

你必须遵守以下规则：
1. 始终返回严格合法的 JSON 格式，不要包含 markdown 代码块标记（如 \`\`\`json）。
2. 所有描述使用中文。
3. 执行步骤要详细但精炼，最多 15 步。
4. Mermaid 图表代码确保语法正确，节点标签使用中文或英文均可，但要简洁。
5. 如果代码有错误，仍然尽可能分析其意图并返回结果。
6. 不要返回任何 JSON 以外的内容。`;
