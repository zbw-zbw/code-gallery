import { Language } from "@/types";

export const PAIN_POINTS = [
  {
    emoji: "🧠",
    title: "脑中编译太慢",
    description:
      "面对陌生代码，要在脑中模拟执行：变量怎么变、循环几次——平均花15分钟才能理清",
  },
  {
    emoji: "📝",
    title: "图解做不动",
    description:
      "想给博客配代码动画，手动画图30分钟起步，还不一定画得准",
  },
  {
    emoji: "🔄",
    title: "Review 太痛苦",
    description: "200行代码逐行读，不知道整体结构，2小时后：这啥？",
  },
];

export const FEATURES = [
  {
    icon: "🎬",
    title: "执行流程动画",
    description:
      "粘贴代码，AI 逐步还原执行过程。变量变化、数据流动、循环过程一目了然",
  },
  {
    icon: "🏗️",
    title: "架构图生成",
    description:
      "自动分析函数调用关系和模块依赖，生成可交互的架构图",
  },
  {
    icon: "📎",
    title: "可嵌入图解",
    description: "导出为图片或 iframe 嵌入代码，直接插入技术博客",
  },
];

export const HOW_IT_WORKS_STEPS = [
  {
    number: 1,
    title: "粘贴代码",
    description: "支持 JavaScript、Python、Java 等主流语言",
  },
  {
    number: 2,
    title: "AI 分析",
    description: "DeepSeek 深度理解代码逻辑和执行流程",
  },
  {
    number: 3,
    title: "查看图解",
    description: "执行动画、架构图、数据流，可导出分享",
  },
];

export const BUBBLE_SORT_CODE = `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`;

export const BUBBLE_SORT_ARRAY = [
  { value: 5, height: 100 },
  { value: 3, height: 60 },
  { value: 8, height: 160 },
  { value: 1, height: 20 },
  { value: 4, height: 80 },
];

// === Playground constants ===

export const SUPPORTED_LANGUAGES: { value: Language; label: string; color: string }[] = [
  { value: "javascript", label: "JavaScript", color: "#f7df1e" },
  { value: "typescript", label: "TypeScript", color: "#3178c6" },
  { value: "python", label: "Python", color: "#3776ab" },
  { value: "java", label: "Java", color: "#b07219" },
  { value: "go", label: "Go", color: "#00add8" },
  { value: "rust", label: "Rust", color: "#dea584" },
  { value: "cpp", label: "C++", color: "#f34b7d" },
];

export const LANGUAGE_PATTERNS: Record<string, RegExp[]> = {
  python: [
    /^(import |from \S+ import|def |class |print\()/m,
    /:\s*$/m,
    /^(if |elif |else:|for |while |try:|except)/m,
  ],
  typescript: [
    /:\s*(string|number|boolean|any|unknown|never|interface |type )/,
    /^(const |let |var ).+:\s*\w+/m,
  ],
  java: [/public\s+(class|static|void)/m, /System\.out/, /^(import java\.|class )/m],
  go: [/^(package |func |import \()/m, /fmt\./, /:=/],
  rust: [
    /^(fn |use |let mut |impl |pub |struct |enum )/m,
    /println!\(/,
    /->\s*\w+/,
  ],
  cpp: [/#include\s*</, /std::/, /cout\s*<</, /^(int |void |class |namespace )/m],
  javascript: [
    /^(const |let |var |function |=>|console\.log)/m,
    /^(async |await |export |import )/m,
  ],
};

export function detectLanguage(code: string): Language {
  for (const [lang, patterns] of Object.entries(LANGUAGE_PATTERNS)) {
    if (patterns.some((p) => p.test(code))) {
      return lang as Language;
    }
  }
  return "javascript";
}

export const EXAMPLE_CODES: { title: string; language: Language; code: string }[] = [
  {
    title: "冒泡排序",
    language: "javascript",
    code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

bubbleSort([5, 3, 8, 1, 4]);`,
  },
  {
    title: "斐波那契递归",
    language: "python",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(5)
print(result)`,
  },
  {
    title: "API 数据获取",
    language: "typescript",
    code: `async function fetchUserData(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return {
    name: data.name,
    email: data.email,
    age: data.age
  };
}

fetchUserData("123");`,
  },
];
