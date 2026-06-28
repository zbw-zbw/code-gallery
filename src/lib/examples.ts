"use client";

import { Language, AnalysisResult } from "@/types";

export interface Example {
  id: string;
  title: string;
  description: string;
  category: "algorithm" | "pattern" | "async" | "data-structure";
  difficulty: "easy" | "medium" | "hard";
  language: Language;
  code: string;
  preAnalyzed: AnalysisResult;
}

export const CATEGORY_LABELS: Record<string, string> = {
  all: "全部分类",
  algorithm: "算法",
  pattern: "设计模式",
  async: "异步",
  "data-structure": "数据结构",
};

export const DIFFICULTY_LABELS: Record<string, string> = {
  all: "全部难度",
  easy: "简单",
  medium: "中等",
  hard: "困难",
};

const DIFFICULTY_STYLES: Record<string, string> = {
  easy: "bg-data-green/10 text-data-green",
  medium: "bg-flow-blue/10 text-flow-blue",
  hard: "bg-code-purple/10 text-code-purple",
};

function exampleHeader(
  title: string,
  language: Language
): AnalysisResult["codeInput"] {
  const ext: Record<Language, string> = {
    javascript: "js",
    typescript: "ts",
    python: "py",
    java: "java",
    go: "go",
    rust: "rs",
    cpp: "cpp",
  };
  return {
    code: "",
    language,
    fileName: `${title.toLowerCase().replace(/\s+/g, "-")}.${ext[language]}`,
  };
}

const baseMermaid = (code: string) =>
  code.replace(/^\n+/, "").replace(/\n+$/, "");

function makePreAnalyzed(
  code: string,
  language: Language,
  title: string,
  summary: string,
  executionSteps: AnalysisResult["executionSteps"],
  architectureNodes: AnalysisResult["architecture"]["nodes"],
  architectureEdges: AnalysisResult["architecture"]["edges"],
  architectureMermaid: string,
  dataFlowNodes: AnalysisResult["dataFlow"]["nodes"],
  dataFlowEdges: AnalysisResult["dataFlow"]["edges"],
  dataFlowMermaid: string
): AnalysisResult {
  return {
    success: true,
    codeInput: { ...exampleHeader(title, language), code },
    summary,
    executionSteps,
    architecture: {
      nodes: architectureNodes,
      edges: architectureEdges,
      mermaidCode: baseMermaid(architectureMermaid),
    },
    dataFlow: {
      nodes: dataFlowNodes,
      edges: dataFlowEdges,
      mermaidCode: baseMermaid(dataFlowMermaid),
    },
  };
}

export { DIFFICULTY_STYLES };

export const EXAMPLES: Example[] = [
  // ========== Algorithm Easy ==========
  {
    id: "bubble-sort",
    title: "冒泡排序",
    description: "经典的 O(n²) 排序算法，通过相邻元素交换把最大值冒泡到末尾。",
    category: "algorithm",
    difficulty: "easy",
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
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "bubble-sort",
      "对数组进行冒泡排序，逐步将较大的元素移动到右侧",
      [
        { stepNumber: 1, lineNumber: 2, description: "外层循环开始，i = 0", variables: [{ name: "i", value: "0", type: "number", changed: true }, { name: "arr", value: "[5,3,8,1,4]", type: "array", changed: false }], highlight: "loop-start" },
        { stepNumber: 2, lineNumber: 3, description: "内层循环开始，j = 0", variables: [{ name: "j", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 3, lineNumber: 4, description: "比较 arr[0] 与 arr[1]：5 > 3", variables: [{ name: "arr[0]", value: "5", type: "number", changed: false }, { name: "arr[1]", value: "3", type: "number", changed: false }], highlight: "branch-true" },
        { stepNumber: 4, lineNumber: 5, description: "交换 arr[0] 与 arr[1]，数组变为 [3,5,8,1,4]", variables: [{ name: "arr", value: "[3,5,8,1,4]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 7, description: "内层循环继续，j = 1", variables: [{ name: "j", value: "1", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 6, lineNumber: 9, description: "外层循环进入下一轮，i = 1", variables: [{ name: "i", value: "1", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 7, lineNumber: 10, description: "返回排序结果 [1,3,4,5,8]", variables: [{ name: "result", value: "[1,3,4,5,8]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "bubbleSort", label: "bubbleSort", type: "function", description: "冒泡排序函数" },
      ],
      [],
      `graph TD
        A[调用 bubbleSort] --> B[bubbleSort 函数]
        B --> C[双重循环比较相邻元素]
        C --> D[返回排序后数组]`,
      [
        { id: "input", label: "输入数组", type: "input" },
        { id: "loop", label: "双重循环", type: "process" },
        { id: "swap", label: "相邻交换", type: "process" },
        { id: "output", label: "排序结果", type: "output" },
      ],
      [
        { from: "input", to: "loop" },
        { from: "loop", to: "swap" },
        { from: "swap", to: "output" },
      ],
      `graph TD
        input[输入数组 [5,3,8,1,4]] --> loop[外层循环 i]
        loop --> inner[内层循环 j]
        inner --> compare{比较相邻元素}
        compare -->|需要交换| swap[交换位置]
        compare -->|无需交换| next[继续下一轮]
        swap --> output[排序结果 [1,3,4,5,8]]
        next --> output`
    ),
  },

  {
    id: "fibonacci",
    title: "斐波那契递归",
    description: "用递归方式计算斐波那契数列，展示函数调用栈和递归返回过程。",
    category: "algorithm",
    difficulty: "easy",
    language: "python",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(5)
print(result)`,
    preAnalyzed: makePreAnalyzed(
      "",
      "python",
      "fibonacci",
      "通过递归调用计算第 n 个斐波那契数",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 fibonacci(5)", variables: [{ name: "n", value: "5", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "判断 n <= 1？5 > 1，继续递归", variables: [], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 3, description: "展开 fibonacci(4) + fibonacci(3)", variables: [], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 1, description: "调用 fibonacci(4)", variables: [{ name: "n", value: "4", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 3, description: "展开 fibonacci(3) + fibonacci(2)", variables: [], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 6, description: "最终结果 result = 5", variables: [{ name: "result", value: "5", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 7, description: "打印结果 5", variables: [{ name: "output", value: "5", type: "number", changed: true }], highlight: "return" },
      ],
      [
        { id: "fibonacci", label: "fibonacci", type: "function", description: "递归计算斐波那契" },
        { id: "base", label: "基准条件", type: "function", description: "n <= 1 时返回 n" },
      ],
      [
        { from: "fibonacci", to: "fibonacci", label: "递归调用" },
        { from: "fibonacci", to: "base", label: "终止" },
      ],
      `graph TD
        A[fibonacci(5)] --> B[fibonacci(4)]
        B --> C[fibonacci(3)]
        C --> D[fibonacci(2)]
        D --> E[fibonacci(1)]
        D --> F[fibonacci(0)]
        C --> G[fibonacci(1)]
        B --> H[fibonacci(2)]
        H --> I[fibonacci(1)]
        H --> J[fibonacci(0)]`,
      [
        { id: "call", label: "初始调用 n=5", type: "input" },
        { id: "recursion", label: "递归分解", type: "process" },
        { id: "base", label: "基准返回", type: "process" },
        { id: "sum", label: "结果汇总", type: "process" },
        { id: "out", label: "输出 5", type: "output" },
      ],
      [
        { from: "call", to: "recursion" },
        { from: "recursion", to: "base" },
        { from: "base", to: "sum" },
        { from: "sum", to: "out" },
      ],
      `graph TD
        call[调用 fibonacci(5)] --> recursion[递归分解为 fib(4)+fib(3)]
        recursion --> base[到达基准 fib(1)/fib(0)]
        base --> sum[逐层返回求和]
        sum --> out[输出结果 5]`
    ),
  },

  {
    id: "binary-search",
    title: "二分查找",
    description: "在有序数组中快速定位目标值，O(log n) 查找效率。",
    category: "algorithm",
    difficulty: "easy",
    language: "javascript",
    code: `function binarySearch(arr, target) {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}

binarySearch([1, 3, 5, 7, 9], 7);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "binary-search",
      "在有序数组中折半查找目标值",
      [
        { stepNumber: 1, lineNumber: 2, description: "初始化 left = 0, right = 4", variables: [{ name: "left", value: "0", type: "number", changed: true }, { name: "right", value: "4", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 3, description: "进入 while 循环", variables: [], highlight: "loop-start" },
        { stepNumber: 3, lineNumber: 4, description: "计算 mid = 2", variables: [{ name: "mid", value: "2", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 5, description: "arr[2] = 5 不等于 7", variables: [], highlight: "branch-false" },
        { stepNumber: 5, lineNumber: 6, description: "5 < 7，调整 left = mid + 1 = 3", variables: [{ name: "left", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 4, description: "mid = 3，arr[3] = 7，命中目标", variables: [{ name: "mid", value: "3", type: "number", changed: true }], highlight: "branch-true" },
        { stepNumber: 7, lineNumber: 10, description: "返回索引 3", variables: [{ name: "result", value: "3", type: "number", changed: true }], highlight: "return" },
      ],
      [
        { id: "binarySearch", label: "binarySearch", type: "function", description: "二分查找函数" },
      ],
      [],
      `graph TD
        A[binarySearch] --> B[初始化 left/right]
        B --> C[while 循环]
        C --> D{命中?}
        D -->|是| E[返回 mid]
        D -->|否| F[调整 left/right]
        F --> C`,
      [
        { id: "arr", label: "有序数组", type: "input" },
        { id: "range", label: "维护查找区间", type: "process" },
        { id: "mid", label: "取中点 mid", type: "process" },
        { id: "compare", label: "比较 target", type: "process" },
        { id: "idx", label: "返回索引", type: "output" },
      ],
      [
        { from: "arr", to: "range" },
        { from: "range", to: "mid" },
        { from: "mid", to: "compare" },
        { from: "compare", to: "idx" },
      ],
      `graph TD
        arr[有序数组 [1,3,5,7,9]] --> range[left=0, right=4]
        range --> mid[计算 mid]
        mid --> compare{arr[mid] vs target}
        compare -->|等于| idx[返回 mid]
        compare -->|小于| adjustL[left = mid + 1]
        compare -->|大于| adjustR[right = mid - 1]
        adjustL --> range
        adjustR --> range`
    ),
  },

  {
    id: "two-sum",
    title: "两数之和",
    description: "用哈希表在 O(n) 时间内找到和为目标值的两个数。",
    category: "algorithm",
    difficulty: "easy",
    language: "javascript",
    code: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

twoSum([2, 7, 11, 15], 9);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "two-sum",
      "利用哈希表一次遍历找出两数之和的索引",
      [
        { stepNumber: 1, lineNumber: 2, description: "初始化空哈希表 map", variables: [{ name: "map", value: "Map(0)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 3, description: "进入 for 循环，i = 0", variables: [{ name: "i", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 3, lineNumber: 4, description: "complement = 9 - 2 = 7", variables: [{ name: "complement", value: "7", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 5, description: "map 中没有 7，继续", variables: [], highlight: "branch-false" },
        { stepNumber: 5, lineNumber: 8, description: "将 nums[0]=2 存入 map", variables: [{ name: "map", value: "Map(1) {2=>0}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 3, description: "i = 1，nums[1] = 7", variables: [{ name: "i", value: "1", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 7, lineNumber: 5, description: "map 中存在 7，返回索引 [0, 1]", variables: [{ name: "result", value: "[0,1]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "twoSum", label: "twoSum", type: "function", description: "两数之和函数" },
        { id: "map", label: "哈希表", type: "function", description: "存储已遍历数值" },
      ],
      [
        { from: "twoSum", to: "map", label: "查询/写入" },
      ],
      `graph TD
        A[输入 nums, target] --> B[初始化 map]
        B --> C[遍历数组]
        C --> D{map 中存在 complement?}
        D -->|是| E[返回结果]
        D -->|否| F[存入 map]
        F --> C`,
      [
        { id: "input", label: "nums, target", type: "input" },
        { id: "loop", label: "遍历数组", type: "process" },
        { id: "lookup", label: "查找 complement", type: "process" },
        { id: "store", label: "存入当前数", type: "process" },
        { id: "out", label: "索引 [0,1]", type: "output" },
      ],
      [
        { from: "input", to: "loop" },
        { from: "loop", to: "lookup" },
        { from: "lookup", to: "out", label: "命中" },
        { from: "lookup", to: "store", label: "未命中" },
        { from: "store", to: "loop" },
      ],
      `graph TD
        input[输入 nums=[2,7,11,15], target=9] --> loop[i=0]
        loop --> lookup{map 中是否有 complement}
        lookup -->|是| out[返回 [map.get(7), 1]]
        lookup -->|否| store[map.set(nums[i], i)]
        store --> loop`
    ),
  },

  {
    id: "selection-sort",
    title: "选择排序",
    description: "每轮选择最小元素放到正确位置，展示索引交换过程。",
    category: "algorithm",
    difficulty: "easy",
    language: "javascript",
    code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    let minIdx = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIdx]) minIdx = j;
    }
    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
  }
  return arr;
}

selectionSort([64, 25, 12, 22, 11]);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "selection-sort",
      "选择排序：每次从未排序区间选出最小元素放到已排序区间末尾",
      [
        { stepNumber: 1, lineNumber: 2, description: "外层循环 i = 0", variables: [{ name: "i", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 2, lineNumber: 3, description: "假设当前最小索引 minIdx = 0", variables: [{ name: "minIdx", value: "0", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 4, description: "内层循环 j = 1，查找最小值", variables: [{ name: "j", value: "1", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 4, lineNumber: 5, description: "arr[4]=11 是最小值，minIdx = 4", variables: [{ name: "minIdx", value: "4", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 7, description: "交换 arr[0] 与 arr[4]，数组变为 [11,25,12,22,64]", variables: [{ name: "arr", value: "[11,25,12,22,64]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 10, description: "返回排序结果 [11,12,22,25,64]", variables: [{ name: "result", value: "[11,12,22,25,64]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "selectionSort", label: "selectionSort", type: "function", description: "选择排序函数" },
      ],
      [],
      `graph TD
        A[selectionSort] --> B[外层循环 i]
        B --> C[查找最小值索引]
        C --> D[交换 arr[i] 与 arr[minIdx]]
        D --> B`,
      [
        { id: "arr", label: "数组", type: "input" },
        { id: "find", label: "查找最小", type: "process" },
        { id: "swap", label: "交换位置", type: "process" },
        { id: "out", label: "排序结果", type: "output" },
      ],
      [
        { from: "arr", to: "find" },
        { from: "find", to: "swap" },
        { from: "swap", to: "out" },
      ],
      `graph TD
        arr[数组 [64,25,12,22,11]] --> find[查找最小值]
        find --> swap[交换到已排序区]
        swap --> arr
        arr --> out[排序结果]`
    ),
  },

  {
    id: "palindrome",
    title: "回文判断",
    description: "判断字符串是否正读反读相同，展示双指针收敛过程。",
    category: "algorithm",
    difficulty: "easy",
    language: "python",
    code: `def is_palindrome(s):
    left, right = 0, len(s) - 1
    while left < right:
        if s[left] != s[right]:
            return False
        left += 1
        right -= 1
    return True

print(is_palindrome("racecar"))`,
    preAnalyzed: makePreAnalyzed(
      "",
      "python",
      "palindrome",
      "使用双指针从两端向中间比较字符",
      [
        { stepNumber: 1, lineNumber: 2, description: "初始化 left = 0, right = 6", variables: [{ name: "left", value: "0", type: "number", changed: true }, { name: "right", value: "6", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 3, description: "进入 while 循环", variables: [], highlight: "loop-start" },
        { stepNumber: 3, lineNumber: 4, description: "比较 s[0]='r' 与 s[6]='r'，相同", variables: [], highlight: "branch-true" },
        { stepNumber: 4, lineNumber: 6, description: "left 增加到 1，right 减少到 5", variables: [{ name: "left", value: "1", type: "number", changed: true }, { name: "right", value: "5", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 7, description: "所有字符都比较完成，返回 True", variables: [{ name: "result", value: "True", type: "boolean", changed: true }], highlight: "return" },
      ],
      [
        { id: "is_palindrome", label: "is_palindrome", type: "function", description: "回文判断函数" },
      ],
      [],
      `graph TD
        A[is_palindrome] --> B[初始化双指针]
        B --> C[比较字符]
        C --> D{相同?}
        D -->|否| E[返回 False]
        D -->|是| F[移动指针]
        F --> C
        C --> G[返回 True]`,
      [
        { id: "s", label: "字符串", type: "input" },
        { id: "pointers", label: "双指针", type: "process" },
        { id: "compare", label: "字符比较", type: "process" },
        { id: "out", label: "True", type: "output" },
      ],
      [
        { from: "s", to: "pointers" },
        { from: "pointers", to: "compare" },
        { from: "compare", to: "out" },
      ],
      `graph TD
        s[字符串 racecar] --> pointers[left=0, right=6]
        pointers --> compare{比较 s[left] 与 s[right]}
        compare -->|相等| move[同时向中间移动]
        compare -->|不等| false[返回 False]
        move --> pointers
        pointers --> out[返回 True]`
    ),
  },

  {
    id: "array-unique",
    title: "数组去重",
    description: "利用 Set 快速去除数组中的重复元素。",
    category: "algorithm",
    difficulty: "easy",
    language: "typescript",
    code: `function unique<T>(arr: T[]): T[] {
  return [...new Set(arr)];
}

const result = unique([1, 2, 2, 3, 3, 3]);
console.log(result);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "array-unique",
      "使用 Set 去重后展开为数组",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 unique 泛型函数", variables: [{ name: "arr", value: "[1,2,2,3,3,3]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "创建 Set 自动去重", variables: [{ name: "set", value: "Set(3) {1,2,3}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 2, description: "展开 Set 得到 [1,2,3]", variables: [{ name: "result", value: "[1,2,3]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "unique", label: "unique", type: "function", description: "数组去重函数" },
        { id: "set", label: "Set", type: "function", description: "集合去重" },
      ],
      [
        { from: "unique", to: "set" },
      ],
      `graph TD
        A[输入数组] --> B[Set 去重]
        B --> C[展开为数组]
        C --> D[返回]`,
      [
        { id: "input", label: "数组 [1,2,2,3,3,3]", type: "input" },
        { id: "set", label: "Set 去重", type: "process" },
        { id: "spread", label: "展开", type: "process" },
        { id: "out", label: "[1,2,3]", type: "output" },
      ],
      [
        { from: "input", to: "set" },
        { from: "set", to: "spread" },
        { from: "spread", to: "out" },
      ],
      `graph TD
        input[原数组] --> set[转换为 Set]
        set --> spread[展开操作符 ...]
        spread --> out[去重后的数组]`
    ),
  },

  // ========== Algorithm Medium ==========
  {
    id: "quick-sort",
    title: "快速排序",
    description: "Python 实现的分治排序，展示分区与递归过程。",
    category: "algorithm",
    difficulty: "medium",
    language: "python",
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[0]
    left = [x for x in arr[1:] if x < pivot]
    right = [x for x in arr[1:] if x >= pivot]
    return quick_sort(left) + [pivot] + quick_sort(right)

print(quick_sort([3, 6, 8, 10, 1, 2, 1]))`,
    preAnalyzed: makePreAnalyzed(
      "",
      "python",
      "quick-sort",
      "以第一个元素为基准，递归地对左右子数组排序",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 quick_sort([3,6,8,10,1,2,1])", variables: [{ name: "arr", value: "[3,6,8,10,1,2,1]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "数组长度大于 1，继续执行", variables: [], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 3, description: "选择 pivot = 3", variables: [{ name: "pivot", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "left = [1,2,1]（小于 pivot 的元素）", variables: [{ name: "left", value: "[1,2,1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 5, description: "right = [6,8,10]（大于等于 pivot 的元素）", variables: [{ name: "right", value: "[6,8,10]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 6, description: "递归排序后合并 [1,1,2] + [3] + [6,8,10]", variables: [{ name: "result", value: "[1,1,2,3,6,8,10]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "quick_sort", label: "quick_sort", type: "function", description: "快速排序函数" },
      ],
      [],
      `graph TD
        A[quick_sort] --> B{长度 <= 1?}
        B -->|是| C[直接返回]
        B -->|否| D[选 pivot]
        D --> E[划分 left/right]
        E --> F[递归排序]
        F --> G[合并结果]`,
      [
        { id: "input", label: "数组", type: "input" },
        { id: "pivot", label: "选择 pivot", type: "process" },
        { id: "partition", label: "分区", type: "process" },
        { id: "recurse", label: "递归排序", type: "process" },
        { id: "merge", label: "合并", type: "process" },
        { id: "out", label: "排序结果", type: "output" },
      ],
      [
        { from: "input", to: "pivot" },
        { from: "pivot", to: "partition" },
        { from: "partition", to: "recurse" },
        { from: "recurse", to: "merge" },
        { from: "merge", to: "out" },
      ],
      `graph TD
        input[原数组] --> pivot[选基准 arr[0]=3]
        pivot --> partition{按大小分区}
        partition --> left[left=[1,2,1]]
        partition --> right[right=[6,8,10]]
        left --> recurseL[递归排序 left]
        right --> recurseR[递归排序 right]
        recurseL --> merge[left + [pivot] + right]
        recurseR --> merge
        merge --> out[结果]`
    ),
  },

  {
    id: "merge-sort",
    title: "归并排序",
    description: "TypeScript 递归拆分数组再合并有序子数组。",
    category: "algorithm",
    difficulty: "medium",
    language: "typescript",
    code: `function mergeSort(arr: number[]): number[] {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left: number[], right: number[]): number[] {
  const result: number[] = [];
  while (left.length && right.length) {
    if (left[0] < right[0]) result.push(left.shift()!);
    else result.push(right.shift()!);
  }
  return [...result, ...left, ...right];
}

mergeSort([38, 27, 43, 3, 9, 82, 10]);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "merge-sort",
      "分治法排序：递归拆分后再合并两个有序数组",
      [
        { stepNumber: 1, lineNumber: 2, description: "数组长度 7，需要拆分", variables: [{ name: "arr", value: "[38,27,43,3,9,82,10]", type: "array", changed: false }], highlight: "branch-false" },
        { stepNumber: 2, lineNumber: 3, description: "mid = 3", variables: [{ name: "mid", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 4, description: "递归排序左半部分 [38,27,43]", variables: [{ name: "left", value: "[27,38,43]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 5, description: "递归排序右半部分 [3,9,82,10]", variables: [{ name: "right", value: "[3,9,10,82]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 6, description: "合并左右有序数组", variables: [], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 12, description: "merge 函数中逐个比较并入 result", variables: [{ name: "result", value: "[3,9,10,27,38,43,82]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "mergeSort", label: "mergeSort", type: "function", description: "归并排序函数" },
        { id: "merge", label: "merge", type: "function", description: "合并两个有序数组" },
      ],
      [
        { from: "mergeSort", to: "mergeSort", label: "递归拆分" },
        { from: "mergeSort", to: "merge", label: "合并" },
      ],
      `graph TD
        A[mergeSort] --> B{长度 <= 1?}
        B -->|是| C[返回]
        B -->|否| D[拆分为 left/right]
        D --> E[递归 mergeSort]
        E --> F[merge 合并]
        F --> G[返回]`,
      [
        { id: "arr", label: "数组", type: "input" },
        { id: "split", label: "拆半", type: "process" },
        { id: "recurse", label: "递归排序", type: "process" },
        { id: "merge", label: "merge", type: "process" },
        { id: "out", label: "有序数组", type: "output" },
      ],
      [
        { from: "arr", to: "split" },
        { from: "split", to: "recurse" },
        { from: "recurse", to: "merge" },
        { from: "merge", to: "out" },
      ],
      `graph TD
        arr[原数组] --> split[拆分为两半]
        split --> recurseL[递归排序左半]
        split --> recurseR[递归排序右半]
        recurseL --> merge[合并两个有序数组]
        recurseR --> merge
        merge --> out[最终结果]`
    ),
  },

  // ========== Algorithm Hard ==========
  {
    id: "dfs-tree",
    title: "深度优先搜索",
    description: "JavaScript 递归遍历二叉树，展示前序遍历顺序。",
    category: "algorithm",
    difficulty: "hard",
    language: "javascript",
    code: `function preorder(node) {
  if (!node) return;
  console.log(node.value);
  preorder(node.left);
  preorder(node.right);
}

const root = {
  value: 1,
  left: { value: 2, left: { value: 4 }, right: { value: 5 } },
  right: { value: 3, left: { value: 6 }, right: { value: 7 } }
};
preorder(root);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "dfs-tree",
      "前序遍历二叉树：根节点 -> 左子树 -> 右子树",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 preorder(root)", variables: [{ name: "node", value: "root(1)", type: "object", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 3, description: "输出节点值 1", variables: [{ name: "output", value: "1", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 4, description: "递归遍历左子树", variables: [], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 3, description: "输出节点值 2", variables: [{ name: "output", value: "1,2", type: "string", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 4, description: "递归遍历左子树的左子节点 4", variables: [{ name: "node", value: "node(4)", type: "object", changed: true }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 3, description: "输出节点值 4", variables: [{ name: "output", value: "1,2,4", type: "string", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 1, description: "右子节点为空，返回", variables: [], highlight: "branch-false" },
        { stepNumber: 8, lineNumber: 5, description: "遍历完左子树，回溯遍历右子树 5", variables: [{ name: "node", value: "node(5)", type: "object", changed: true }], highlight: "function-call" },
        { stepNumber: 9, lineNumber: 12, description: "完整遍历序列 1,2,4,5,3,6,7", variables: [{ name: "sequence", value: "1,2,4,5,3,6,7", type: "string", changed: true }], highlight: "return" },
      ],
      [
        { id: "preorder", label: "preorder", type: "function", description: "前序遍历" },
        { id: "node", label: "TreeNode", type: "function", description: "树节点" },
      ],
      [
        { from: "preorder", to: "preorder", label: "递归" },
        { from: "preorder", to: "node", label: "访问" },
      ],
      `graph TD
        A[preorder] --> B{node?}
        B -->|否| C[返回]
        B -->|是| D[访问当前节点]
        D --> E[preorder(left)]
        D --> F[preorder(right)]`,
      [
        { id: "root", label: "根节点 1", type: "input" },
        { id: "visit", label: "访问当前节点", type: "process" },
        { id: "left", label: "递归左子树", type: "process" },
        { id: "right", label: "递归右子树", type: "process" },
        { id: "out", label: "输出序列", type: "output" },
      ],
      [
        { from: "root", to: "visit" },
        { from: "visit", to: "left" },
        { from: "visit", to: "right" },
        { from: "left", to: "out" },
        { from: "right", to: "out" },
      ],
      `graph TD
        root[节点 1] --> visit[输出 1]
        visit --> left[递归左子树 2]
        visit --> right[递归右子树 3]
        left --> visit
        right --> visit
        visit --> out[序列 1,2,4,5,3,6,7]`
    ),
  },

  {
    id: "quick-sort-in-place",
    title: "快速排序（原地）",
    description: "JavaScript 原地分区快排，O(log n) 额外空间。",
    category: "algorithm",
    difficulty: "hard",
    language: "javascript",
    code: `function quickSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;
  const pivot = partition(arr, left, right);
  quickSortInPlace(arr, left, pivot - 1);
  quickSortInPlace(arr, pivot + 1, right);
}

function partition(arr, left, right) {
  const pivot = arr[right];
  let i = left;
  for (let j = left; j < right; j++) {
    if (arr[j] < pivot) {
      [arr[i], arr[j]] = [arr[j], arr[i]];
      i++;
    }
  }
  [arr[i], arr[right]] = [arr[right], arr[i]];
  return i;
}

const a = [3, 6, 8, 10, 1, 2, 1];
quickSortInPlace(a);
console.log(a);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "quick-sort-in-place",
      "原地快速排序：partition 后将 pivot 放到正确位置，再递归排序两侧",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 quickSortInPlace，left=0, right=6", variables: [{ name: "left", value: "0", type: "number", changed: true }, { name: "right", value: "6", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 3, description: "调用 partition，以 arr[6]=1 为 pivot", variables: [], highlight: "function-call" },
        { stepNumber: 3, lineNumber: 9, description: "partition 中 i 从 0 开始", variables: [{ name: "i", value: "0", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 11, description: "遍历数组，所有元素 >= 1，i 保持 0", variables: [{ name: "j", value: "5", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 5, lineNumber: 15, description: "交换 arr[0] 与 arr[6]，pivot 归位", variables: [{ name: "arr", value: "[1,6,8,10,3,2,1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 16, description: "返回 pivot 索引 0", variables: [{ name: "pivot", value: "0", type: "number", changed: true }], highlight: "return" },
        { stepNumber: 7, lineNumber: 4, description: "递归排序左半部分 quickSortInPlace(arr, 0, -1)", variables: [], highlight: "function-call" },
        { stepNumber: 8, lineNumber: 5, description: "递归排序右半部分 quickSortInPlace(arr, 1, 6)", variables: [], highlight: "function-call" },
        { stepNumber: 9, lineNumber: 24, description: "最终数组 [1,1,2,3,6,8,10]", variables: [{ name: "a", value: "[1,1,2,3,6,8,10]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "quickSortInPlace", label: "quickSortInPlace", type: "function", description: "原地快排" },
        { id: "partition", label: "partition", type: "function", description: "原地分区" },
      ],
      [
        { from: "quickSortInPlace", to: "partition" },
        { from: "quickSortInPlace", to: "quickSortInPlace", label: "递归" },
      ],
      `graph TD
        A[quickSortInPlace] --> B{left >= right?}
        B -->|否| C[partition]
        C --> D[递归左]
        C --> E[递归右]
        B -->|是| F[返回]`,
      [
        { id: "arr", label: "数组", type: "input" },
        { id: "pivot", label: "选 pivot", type: "process" },
        { id: "partition", label: "原地分区", type: "process" },
        { id: "recurse", label: "递归排序", type: "process" },
        { id: "out", label: "有序数组", type: "output" },
      ],
      [
        { from: "arr", to: "pivot" },
        { from: "pivot", to: "partition" },
        { from: "partition", to: "recurse" },
        { from: "recurse", to: "out" },
      ],
      `graph TD
        arr[原数组] --> pivot[选择右侧为 pivot]
        pivot --> partition[i 指针分区]
        partition --> recurseL[递归左侧]
        partition --> recurseR[递归右侧]
        recurseL --> out[有序数组]
        recurseR --> out`
    ),
  },

  // ========== Pattern Easy/Medium ==========
  {
    id: "pub-sub",
    title: "发布订阅模式",
    description: "实现 EventEmitter，展示事件订阅与发布机制。",
    category: "pattern",
    difficulty: "medium",
    language: "javascript",
    code: `class EventEmitter {
  events = {};
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  }
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
}

const emitter = new EventEmitter();
emitter.on("hello", name => console.log("Hi, " + name));
emitter.emit("hello", "Alice");`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "pub-sub",
      "发布订阅模式：通过事件名维护回调数组，发布时依次执行",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 EventEmitter 类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 events = {}", variables: [{ name: "events", value: "{}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 3, description: 'on("hello", callback) 订阅事件', variables: [{ name: "event", value: "hello", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 4, description: 'events["hello"] 不存在，初始化为空数组', variables: [{ name: "events", value: "{hello: []}", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 5, lineNumber: 6, description: '将回调存入 events["hello"]', variables: [{ name: "events", value: "{hello: [fn]}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 7, description: 'emit("hello", "Alice") 发布事件', variables: [{ name: "event", value: "hello", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 7, lineNumber: 9, description: "执行回调，输出 Hi, Alice", variables: [{ name: "output", value: "Hi, Alice", type: "string", changed: true }], highlight: "return" },
      ],
      [
        { id: "EventEmitter", label: "EventEmitter", type: "class", description: "事件中心" },
        { id: "subscriber", label: "订阅者", type: "function", description: "订阅回调" },
        { id: "publisher", label: "发布者", type: "function", description: "触发事件" },
      ],
      [
        { from: "subscriber", to: "EventEmitter", label: "on" },
        { from: "publisher", to: "EventEmitter", label: "emit" },
        { from: "EventEmitter", to: "subscriber", label: "通知" },
      ],
      `graph TD
        A[订阅者] -->|on| B[EventEmitter]
        C[发布者] -->|emit| B
        B -->|通知| A`,
      [
        { id: "sub", label: "订阅回调", type: "input" },
        { id: "store", label: "events 存储", type: "process" },
        { id: "pub", label: "发布事件", type: "input" },
        { id: "dispatch", label: "派发回调", type: "process" },
        { id: "out", label: "输出", type: "output" },
      ],
      [
        { from: "sub", to: "store" },
        { from: "pub", to: "dispatch" },
        { from: "store", to: "dispatch" },
        { from: "dispatch", to: "out" },
      ],
      `graph TD
        sub[on("hello", callback)] --> store[events["hello"] = [fn]]
        pub[emit("hello", "Alice")] --> dispatch[遍历回调数组]
        store --> dispatch
        dispatch --> out[输出 Hi, Alice]`
    ),
  },

  {
    id: "singleton",
    title: "单例模式",
    description: "TypeScript 实现确保全局只有一个 Logger 实例。",
    category: "pattern",
    difficulty: "medium",
    language: "typescript",
    code: `class Logger {
  private static instance: Logger;
  private constructor() {}
  static getInstance() {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }
  log(msg: string) {
    console.log("[LOG] " + msg);
  }
}

const a = Logger.getInstance();
const b = Logger.getInstance();
console.log(a === b);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "singleton",
      "单例模式：通过静态 instance 确保类只有一个实例",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Logger 类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "静态 instance 初始为 undefined", variables: [{ name: "Logger.instance", value: "undefined", type: "undefined", changed: false }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 5, description: "调用 Logger.getInstance()", variables: [], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 6, description: "instance 不存在，创建新实例", variables: [{ name: "Logger.instance", value: "Logger {}", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 5, lineNumber: 9, description: "返回单例对象 a", variables: [{ name: "a", value: "Logger {}", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 6, lineNumber: 14, description: "再次调用 getInstance()，直接返回已有实例 b", variables: [{ name: "b", value: "Logger {}", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 7, lineNumber: 15, description: "a === b 为 true，确认是同一实例", variables: [{ name: "same", value: "true", type: "boolean", changed: true }], highlight: "return" },
      ],
      [
        { id: "Logger", label: "Logger", type: "class", description: "日志单例类" },
        { id: "instance", label: "static instance", type: "function", description: "唯一实例引用" },
      ],
      [
        { from: "Logger", to: "instance", label: "getInstance" },
      ],
      `graph TD
        A[Logger.getInstance] --> B{instance?}
        B -->|否| C[创建实例]
        B -->|是| D[返回实例]
        C --> D`,
      [
        { id: "call", label: "getInstance()", type: "input" },
        { id: "check", label: "检查 instance", type: "process" },
        { id: "create", label: "创建实例", type: "process" },
        { id: "return", label: "返回实例", type: "process" },
        { id: "out", label: "同一引用", type: "output" },
      ],
      [
        { from: "call", to: "check" },
        { from: "check", to: "create", label: "首次" },
        { from: "check", to: "return", label: "已存在" },
        { from: "create", to: "return" },
        { from: "return", to: "out" },
      ],
      `graph TD
        call[调用 getInstance] --> check{instance 是否存在}
        check -->|否| create[创建 Logger 实例]
        check -->|是| return[返回已有实例]
        create --> return
        return --> out[a === b 为 true]`
    ),
  },

  {
    id: "observer",
    title: "观察者模式",
    description: "Subject 维护观察者列表，状态变化时通知所有观察者。",
    category: "pattern",
    difficulty: "medium",
    language: "javascript",
    code: `class Subject {
  observers = [];
  subscribe(observer) {
    this.observers.push(observer);
  }
  notify(data) {
    this.observers.forEach(o => o.update(data));
  }
}

class Observer {
  update(data) {
    console.log("收到通知: " + data);
  }
}

const subject = new Subject();
subject.subscribe(new Observer());
subject.notify("新消息");`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "observer",
      "观察者模式：Subject 状态变化时遍历通知所有 Observer",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Subject 类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 observers 为空数组", variables: [{ name: "observers", value: "[]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 3, description: "Observer 订阅 Subject", variables: [{ name: "observer", value: "Observer {}", type: "object", changed: true }], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 4, description: "将观察者加入列表", variables: [{ name: "observers", value: "[Observer]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 7, description: "Subject 状态变化，调用 notify", variables: [{ name: "data", value: "新消息", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 8, description: "遍历 observers，调用 update", variables: [], highlight: "loop-start" },
        { stepNumber: 7, lineNumber: 14, description: "输出 收到通知: 新消息", variables: [{ name: "output", value: "收到通知: 新消息", type: "string", changed: true }], highlight: "return" },
      ],
      [
        { id: "Subject", label: "Subject", type: "class", description: "被观察目标" },
        { id: "Observer", label: "Observer", type: "class", description: "观察者" },
      ],
      [
        { from: "Observer", to: "Subject", label: "subscribe" },
        { from: "Subject", to: "Observer", label: "notify" },
      ],
      `graph TD
        A[Observer] -->|subscribe| B[Subject]
        B -->|notify| A`,
      [
        { id: "sub", label: "Observer", type: "input" },
        { id: "list", label: "observers 列表", type: "process" },
        { id: "change", label: "状态变化", type: "input" },
        { id: "notify", label: "遍历通知", type: "process" },
        { id: "out", label: "收到通知", type: "output" },
      ],
      [
        { from: "sub", to: "list" },
        { from: "change", to: "notify" },
        { from: "list", to: "notify" },
        { from: "notify", to: "out" },
      ],
      `graph TD
        sub[Observer 订阅] --> list[observers 列表]
        change[状态变化] --> notify[遍历调用 update]
        list --> notify
        notify --> out[观察者收到更新]`
    ),
  },

  {
    id: "factory",
    title: "工厂模式",
    description: "TypeScript 根据类型参数创建不同 Shape 对象。",
    category: "pattern",
    difficulty: "hard",
    language: "typescript",
    code: `interface Shape {
  draw(): string;
}

class Circle implements Shape {
  draw() { return "画圆形"; }
}

class Square implements Shape {
  draw() { return "画方形"; }
}

class ShapeFactory {
  create(type: "circle" | "square"): Shape {
    if (type === "circle") return new Circle();
    return new Square();
  }
}

const factory = new ShapeFactory();
const shape = factory.create("circle");
console.log(shape.draw());`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "factory",
      "工厂模式：根据输入类型创建对应的具体 Shape 对象",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Shape 接口", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 3, description: "定义 Circle 类实现 Shape", variables: [], highlight: "normal" },
        { stepNumber: 3, lineNumber: 7, description: "定义 Square 类实现 Shape", variables: [], highlight: "normal" },
        { stepNumber: 4, lineNumber: 12, description: '调用 factory.create("circle")', variables: [{ name: "type", value: "circle", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 13, description: "type 为 circle，创建 Circle 实例", variables: [{ name: "shape", value: "Circle {}", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 6, lineNumber: 18, description: "调用 shape.draw()，输出 画圆形", variables: [{ name: "output", value: "画圆形", type: "string", changed: true }], highlight: "return" },
      ],
      [
        { id: "ShapeFactory", label: "ShapeFactory", type: "class", description: "工厂类" },
        { id: "Shape", label: "Shape", type: "module", description: "图形接口" },
        { id: "Circle", label: "Circle", type: "class", description: "圆形" },
        { id: "Square", label: "Square", type: "class", description: "方形" },
      ],
      [
        { from: "ShapeFactory", to: "Circle", label: "type=circle" },
        { from: "ShapeFactory", to: "Square", label: "type=square" },
        { from: "Circle", to: "Shape", label: "implements" },
        { from: "Square", to: "Shape", label: "implements" },
      ],
      `graph TD
        A[ShapeFactory] --> B{类型判断}
        B -->|circle| C[创建 Circle]
        B -->|square| D[创建 Square]
        C --> E[返回 Shape]
        D --> E`,
      [
        { id: "type", label: "type=circle", type: "input" },
        { id: "factory", label: "ShapeFactory", type: "process" },
        { id: "create", label: "创建 Circle", type: "process" },
        { id: "draw", label: "调用 draw", type: "process" },
        { id: "out", label: "画圆形", type: "output" },
      ],
      [
        { from: "type", to: "factory" },
        { from: "factory", to: "create", label: "circle" },
        { from: "create", to: "draw" },
        { from: "draw", to: "out" },
      ],
      `graph TD
        type[type=circle] --> factory[ShapeFactory]
        factory --> create[创建 Circle 对象]
        create --> draw[调用 draw()]
        draw --> out[输出 画圆形]`
    ),
  },

  {
    id: "counter-closure",
    title: "计数器闭包",
    description: "JavaScript 闭包实现私有计数器，展示作用域链。",
    category: "pattern",
    difficulty: "easy",
    language: "javascript",
    code: `function createCounter() {
  let count = 0;
  return {
    increment() { count++; },
    get() { return count; }
  };
}

const counter = createCounter();
counter.increment();
counter.increment();
console.log(counter.get());`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "counter-closure",
      "闭包：内部函数保持对外部 count 变量的引用",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 createCounter()", variables: [], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 count = 0", variables: [{ name: "count", value: "0", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 8, description: "返回包含 increment 和 get 的对象 counter", variables: [{ name: "counter", value: "{increment, get}", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 4, lineNumber: 10, description: "调用 counter.increment()，count 增加到 1", variables: [{ name: "count", value: "1", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 11, description: "再次调用 increment()，count 增加到 2", variables: [{ name: "count", value: "2", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 12, description: "调用 counter.get() 返回 2", variables: [{ name: "output", value: "2", type: "number", changed: true }], highlight: "return" },
      ],
      [
        { id: "createCounter", label: "createCounter", type: "function", description: "创建计数器" },
        { id: "closure", label: "闭包作用域", type: "function", description: "保存 count 状态" },
      ],
      [
        { from: "createCounter", to: "closure", label: "返回" },
        { from: "closure", to: "closure", label: "increment" },
      ],
      `graph TD
        A[createCounter] --> B[初始化 count]
        B --> C[返回 increment/get]
        C --> D[increment 修改闭包 count]
        D --> E[get 读取闭包 count]`,
      [
        { id: "call", label: "createCounter()", type: "input" },
        { id: "scope", label: "闭包作用域", type: "process" },
        { id: "inc", label: "increment", type: "input" },
        { id: "get", label: "get", type: "input" },
        { id: "out", label: "输出 2", type: "output" },
      ],
      [
        { from: "call", to: "scope" },
        { from: "scope", to: "inc" },
        { from: "inc", to: "scope" },
        { from: "scope", to: "get" },
        { from: "get", to: "out" },
      ],
      `graph TD
        call[调用 createCounter] --> scope[闭包持有 count=0]
        scope --> inc[调用 increment]
        inc --> scope[count 更新]
        scope --> get[调用 get]
        get --> out[返回 2]`
    ),
  },

  {
    id: "debounce",
    title: "防抖函数",
    description: "TypeScript 实现防抖，延迟执行并取消之前的定时器。",
    category: "pattern",
    difficulty: "medium",
    language: "typescript",
    code: `function debounce<T extends (...args: any[]) => void>(fn: T, wait: number) {
  let timer: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => fn(...args), wait);
  };
}

const log = debounce((msg: string) => console.log(msg), 300);
log("a");
log("ab");
log("abc");`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "debounce",
      "防抖：连续触发时只执行最后一次调用",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 debounce 创建防抖函数", variables: [{ name: "wait", value: "300", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 timer = null", variables: [{ name: "timer", value: "null", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 6, description: '第一次调用 log("a")，timer 为空，设置定时器', variables: [{ name: "timer", value: "Timeout", type: "object", changed: true }], highlight: "branch-false" },
        { stepNumber: 4, lineNumber: 4, description: '第二次调用 log("ab")，清除之前的 timer', variables: [{ name: "timer", value: "null", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 5, lineNumber: 5, description: "重新设置新的定时器等待 300ms", variables: [{ name: "timer", value: "Timeout", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 10, description: '第三次调用 log("abc")，再次清除并重置', variables: [], highlight: "branch-true" },
        { stepNumber: 7, lineNumber: 5, description: "300ms 后只执行最后一次，输出 abc", variables: [{ name: "output", value: "abc", type: "string", changed: true }], highlight: "return" },
      ],
      [
        { id: "debounce", label: "debounce", type: "function", description: "高阶函数" },
        { id: "timer", label: "timer", type: "function", description: "定时器引用" },
      ],
      [
        { from: "debounce", to: "timer", label: "set/clear" },
      ],
      `graph TD
        A[调用 log] --> B{timer?}
        B -->|是| C[clearTimeout]
        C --> D[setTimeout]
        B -->|否| D
        D --> E[延迟执行 fn]`,
      [
        { id: "call", label: "连续调用", type: "input" },
        { id: "check", label: "检查 timer", type: "process" },
        { id: "clear", label: "清除旧定时器", type: "process" },
        { id: "set", label: "设置新定时器", type: "process" },
        { id: "exec", label: "执行最后一次", type: "process" },
        { id: "out", label: "输出 abc", type: "output" },
      ],
      [
        { from: "call", to: "check" },
        { from: "check", to: "clear", label: "有 timer" },
        { from: "clear", to: "set" },
        { from: "check", to: "set", label: "无 timer" },
        { from: "set", to: "exec" },
        { from: "exec", to: "out" },
      ],
      `graph TD
        call[连续调用 log] --> check{timer 是否存在}
        check -->|是| clear[clearTimeout]
        check -->|否| set[setTimeout]
        clear --> set
        set --> exec[延迟执行 fn]
        exec --> out[输出 abc]`
    ),
  },

  {
    id: "iterator",
    title: "迭代器模式",
    description: "TypeScript 自定义集合的 Symbol.iterator 实现。",
    category: "pattern",
    difficulty: "medium",
    language: "typescript",
    code: `class Range {
  constructor(private start: number, private end: number) {}
  *[Symbol.iterator]() {
    for (let i = this.start; i <= this.end; i++) {
      yield i;
    }
  }
}

const range = new Range(1, 3);
for (const n of range) {
  console.log(n);
}`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "iterator",
      "迭代器模式：通过生成器定义 Range 集合的遍历方式",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Range 类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 start=1, end=3", variables: [{ name: "start", value: "1", type: "number", changed: true }, { name: "end", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 8, description: "创建 Range(1, 3) 实例", variables: [{ name: "range", value: "Range {}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 9, description: "for...of 调用迭代器", variables: [{ name: "n", value: "1", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 5, lineNumber: 10, description: "输出 1", variables: [{ name: "output", value: "1", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 9, description: "迭代器继续，n = 2", variables: [{ name: "n", value: "2", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 7, lineNumber: 10, description: "输出 2", variables: [{ name: "output", value: "2", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 9, description: "迭代器继续，n = 3", variables: [{ name: "n", value: "3", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 9, lineNumber: 10, description: "输出 3，迭代结束", variables: [{ name: "output", value: "3", type: "number", changed: true }], highlight: "return" },
      ],
      [
        { id: "Range", label: "Range", type: "class", description: "可迭代范围" },
        { id: "iterator", label: "Symbol.iterator", type: "function", description: "迭代器生成器" },
      ],
      [
        { from: "Range", to: "iterator", label: "实现" },
      ],
      `graph TD
        A[Range 类] --> B[实现 Symbol.iterator]
        B --> C[生成器 yield]
        C --> D[for...of 消费]`,
      [
        { id: "range", label: "Range(1,3)", type: "input" },
        { id: "iter", label: "迭代器", type: "process" },
        { id: "yield", label: "yield i", type: "process" },
        { id: "out", label: "输出 1,2,3", type: "output" },
      ],
      [
        { from: "range", to: "iter" },
        { from: "iter", to: "yield" },
        { from: "yield", to: "out" },
      ],
      `graph TD
        range[Range(1,3)] --> iter[Symbol.iterator]
        iter --> yield[生成器 yield i]
        yield --> out[for...of 输出 1,2,3]`
    ),
  },

  // ========== Async ==========
  {
    id: "promise-chain",
    title: "Promise 链式调用",
    description: "顺序执行多个异步操作，展示 then 链的数据流转。",
    category: "async",
    difficulty: "medium",
    language: "javascript",
    code: `function fetchUser(id) {
  return Promise.resolve({ id, name: "Alice" });
}

fetchUser(1)
  .then(user => user.name)
  .then(name => name.toUpperCase())
  .then(upper => console.log(upper));`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "promise-chain",
      "Promise 链：fetchUser 返回 Promise，then 链传递处理结果",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 fetchUser(1)", variables: [{ name: "id", value: "1", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: '返回 Promise.resolve({id:1, name:"Alice"})', variables: [{ name: "promise", value: "Promise", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 3, lineNumber: 5, description: "第一个 then 获取 user 对象", variables: [{ name: "user", value: "{id:1, name:Alice}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 5, description: '返回 user.name = "Alice"', variables: [{ name: "name", value: "Alice", type: "string", changed: true }], highlight: "return" },
        { stepNumber: 5, lineNumber: 6, description: '第二个 then 转为大写返回 "ALICE"', variables: [{ name: "upper", value: "ALICE", type: "string", changed: true }], highlight: "return" },
        { stepNumber: 6, lineNumber: 7, description: "第三个 then 输出 ALICE", variables: [{ name: "output", value: "ALICE", type: "string", changed: true }], highlight: "return" },
      ],
      [
        { id: "fetchUser", label: "fetchUser", type: "function", description: "返回 Promise" },
        { id: "then1", label: "then 1", type: "function", description: "获取 name" },
        { id: "then2", label: "then 2", type: "function", description: "转大写" },
        { id: "then3", label: "then 3", type: "function", description: "输出" },
      ],
      [
        { from: "fetchUser", to: "then1" },
        { from: "then1", to: "then2" },
        { from: "then2", to: "then3" },
      ],
      `graph TD
        A[fetchUser] --> B[then 1]
        B --> C[then 2]
        C --> D[then 3]`,
      [
        { id: "call", label: "fetchUser(1)", type: "input" },
        { id: "p1", label: "Promise<user>", type: "process" },
        { id: "p2", label: "Promise<name>", type: "process" },
        { id: "p3", label: "Promise<upper>", type: "process" },
        { id: "out", label: "ALICE", type: "output" },
      ],
      [
        { from: "call", to: "p1" },
        { from: "p1", to: "p2" },
        { from: "p2", to: "p3" },
        { from: "p3", to: "out" },
      ],
      `graph TD
        call[fetchUser(1)] --> p1[Promise.resolve(user)]
        p1 --> p2[then: 提取 name]
        p2 --> p3[then: 转为大写]
        p3 --> out[输出 ALICE]`
    ),
  },

  {
    id: "async-await",
    title: "Async/Await 顺序请求",
    description: "用 async/await 顺序获取用户资料和文章列表。",
    category: "async",
    difficulty: "medium",
    language: "javascript",
    code: `async function loadUserData(userId) {
  const profile = await fetchProfile(userId);
  const posts = await fetchPosts(profile.id);
  return { profile, posts };
}

function fetchProfile(id) {
  return Promise.resolve({ id, name: "Alice" });
}

function fetchPosts(id) {
  return Promise.resolve([{ title: "Hello" }]);
}

loadUserData(1).then(console.log);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "async-await",
      "async/await 让异步代码像同步一样顺序执行",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 loadUserData(1)", variables: [{ name: "userId", value: "1", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "await fetchProfile(1)，等待 Promise 完成", variables: [{ name: "profile", value: "{id:1, name:Alice}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 3, description: "await fetchPosts(1)，等待文章列表", variables: [{ name: "posts", value: "[{title:Hello}]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "返回 {profile, posts}", variables: [{ name: "result", value: "{profile, posts}", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 5, lineNumber: 14, description: "then 打印最终结果", variables: [{ name: "output", value: "{profile:{...}, posts:[...]}", type: "object", changed: true }], highlight: "return" },
      ],
      [
        { id: "loadUserData", label: "loadUserData", type: "function", description: "async 函数" },
        { id: "fetchProfile", label: "fetchProfile", type: "function", description: "获取用户资料" },
        { id: "fetchPosts", label: "fetchPosts", type: "function", description: "获取文章" },
      ],
      [
        { from: "loadUserData", to: "fetchProfile" },
        { from: "fetchProfile", to: "fetchPosts" },
        { from: "fetchPosts", to: "loadUserData" },
      ],
      `graph TD
        A[loadUserData] --> B[await fetchProfile]
        B --> C[await fetchPosts]
        C --> D[返回结果]`,
      [
        { id: "userId", label: "userId=1", type: "input" },
        { id: "profile", label: "获取 profile", type: "process" },
        { id: "posts", label: "获取 posts", type: "process" },
        { id: "combine", label: "组合结果", type: "process" },
        { id: "out", label: "输出", type: "output" },
      ],
      [
        { from: "userId", to: "profile" },
        { from: "profile", to: "posts" },
        { from: "posts", to: "combine" },
        { from: "combine", to: "out" },
      ],
      `graph TD
        userId[userId=1] --> profile[await fetchProfile]
        profile --> posts[await fetchPosts]
        posts --> combine[组合 {profile, posts}]
        combine --> out[输出结果]`
    ),
  },

  {
    id: "race-condition",
    title: "Promise 竞速与全等",
    description: "对比 Promise.race 和 Promise.all 的行为差异。",
    category: "async",
    difficulty: "hard",
    language: "javascript",
    code: `const p1 = new Promise(r => setTimeout(() => r("slow"), 300));
const p2 = new Promise(r => setTimeout(() => r("fast"), 100));

Promise.race([p1, p2]).then(winner => console.log("race:", winner));
Promise.all([p1, p2]).then(values => console.log("all:", values));`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "race-condition",
      "Promise.race 返回最快完成的 Promise，Promise.all 等待全部完成",
      [
        { stepNumber: 1, lineNumber: 1, description: "创建 p1，300ms 后 resolve", variables: [{ name: "p1", value: "Promise", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "创建 p2，100ms 后 resolve", variables: [{ name: "p2", value: "Promise", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 4, description: "Promise.race 等待最快结果", variables: [], highlight: "function-call" },
        { stepNumber: 4, lineNumber: 4, description: "p2 先完成，输出 race: fast", variables: [{ name: "winner", value: "fast", type: "string", changed: true }], highlight: "return" },
        { stepNumber: 5, lineNumber: 5, description: "Promise.all 等待两个 Promise 全部完成", variables: [], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 5, description: "300ms 后两个都完成，输出 all: [slow, fast]", variables: [{ name: "values", value: "[slow, fast]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "p1", label: "p1", type: "function", description: "300ms Promise" },
        { id: "p2", label: "p2", type: "function", description: "100ms Promise" },
        { id: "race", label: "Promise.race", type: "function", description: "竞速" },
        { id: "all", label: "Promise.all", type: "function", description: "全部" },
      ],
      [
        { from: "p1", to: "race" },
        { from: "p2", to: "race" },
        { from: "p1", to: "all" },
        { from: "p2", to: "all" },
      ],
      `graph TD
        A[p1 slow] --> B[Promise.race]
        C[p2 fast] --> B
        B --> D[race: fast]
        A --> E[Promise.all]
        C --> E
        E --> F[all: [slow, fast]]`,
      [
        { id: "p1", label: "p1 (300ms)", type: "input" },
        { id: "p2", label: "p2 (100ms)", type: "input" },
        { id: "race", label: "Promise.race", type: "process" },
        { id: "all", label: "Promise.all", type: "process" },
        { id: "outRace", label: "fast", type: "output" },
        { id: "outAll", label: "[slow, fast]", type: "output" },
      ],
      [
        { from: "p1", to: "race" },
        { from: "p2", to: "race" },
        { from: "p1", to: "all" },
        { from: "p2", to: "all" },
        { from: "race", to: "outRace" },
        { from: "all", to: "outAll" },
      ],
      `graph TD
        p1[p1 300ms] --> race[Promise.race]
        p2[p2 100ms] --> race
        race --> outRace[输出 fast]
        p1 --> all[Promise.all]
        p2 --> all
        all --> outAll[输出 [slow, fast]]`
    ),
  },

  {
    id: "concurrency-control",
    title: "Promise 并发控制",
    description: "TypeScript 实现最大并发数限制的任务调度器。",
    category: "async",
    difficulty: "hard",
    language: "typescript",
    code: `async function runWithLimit<T>(tasks: (() => Promise<T>)[], limit: number): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  for (const [i, task] of tasks.entries()) {
    const p = task().then(r => { results[i] = r; });
    executing.push(p);
    if (executing.length >= limit) {
      await Promise.race(executing);
    }
  }
  await Promise.all(executing);
  return results;
}

const tasks = [1, 2, 3, 4].map(n => () => Promise.resolve(n * 2));
runWithLimit(tasks, 2).then(console.log);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "concurrency-control",
      "限制并发数：同时最多运行 limit 个任务，完成一个再补充一个",
      [
        { stepNumber: 1, lineNumber: 1, description: "调用 runWithLimit(tasks, 2)", variables: [{ name: "limit", value: "2", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 results 和 executing 数组", variables: [{ name: "results", value: "[]", type: "array", changed: true }, { name: "executing", value: "[]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 4, description: "开始遍历任务，i=0", variables: [{ name: "i", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 4, lineNumber: 5, description: "执行任务 0，结果 2 存入 results[0]", variables: [{ name: "results", value: "[2]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 6, description: "executing 长度 1 < limit 2，继续", variables: [{ name: "executing", value: "[Promise]", type: "array", changed: true }], highlight: "branch-false" },
        { stepNumber: 6, lineNumber: 5, description: "执行任务 1，结果 4 存入 results[1]", variables: [{ name: "results", value: "[2,4]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 7, description: "executing 长度达到 2，等待任一完成", variables: [], highlight: "function-call" },
        { stepNumber: 8, lineNumber: 10, description: "所有任务完成，results = [2,4,6,8]", variables: [{ name: "results", value: "[2,4,6,8]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "runWithLimit", label: "runWithLimit", type: "function", description: "并发控制函数" },
        { id: "tasks", label: "tasks", type: "function", description: "任务数组" },
      ],
      [
        { from: "runWithLimit", to: "tasks", label: "调度" },
      ],
      `graph TD
        A[runWithLimit] --> B[维护 executing 队列]
        B --> C{队列满?}
        C -->|是| D[await Promise.race]
        C -->|否| E[继续添加任务]
        D --> E
        E --> F[await Promise.all]
        F --> G[返回 results]`,
      [
        { id: "tasks", label: "4 个任务", type: "input" },
        { id: "queue", label: "executing 队列", type: "process" },
        { id: "limit", label: "限制并发=2", type: "process" },
        { id: "race", label: "等待完成一个", type: "process" },
        { id: "all", label: "等待全部", type: "process" },
        { id: "out", label: "[2,4,6,8]", type: "output" },
      ],
      [
        { from: "tasks", to: "queue" },
        { from: "queue", to: "limit" },
        { from: "limit", to: "race", label: "满" },
        { from: "limit", to: "all", label: "遍历完" },
        { from: "race", to: "queue" },
        { from: "all", to: "out" },
      ],
      `graph TD
        tasks[任务列表] --> queue[executing 队列]
        queue --> limit{队列长度 >= limit?}
        limit -->|是| race[Promise.race 等待一个完成]
        limit -->|否| queue
        race --> queue
        queue --> all[Promise.all 等待剩余]
        all --> out[返回 results]`
    ),
  },

  // ========== Data Structure ==========
  {
    id: "stack",
    title: "栈实现",
    description: "用数组实现 LIFO 栈，展示 push 和 pop 操作。",
    category: "data-structure",
    difficulty: "easy",
    language: "javascript",
    code: `class Stack {
  items = [];
  push(item) { this.items.push(item); }
  pop() { return this.items.pop(); }
  peek() { return this.items[this.items.length - 1]; }
}

const s = new Stack();
s.push(1);
s.push(2);
console.log(s.pop());`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "stack",
      "栈（Stack）：后进先出的数据结构",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Stack 类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 items = []", variables: [{ name: "items", value: "[]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 7, description: "创建 Stack 实例 s", variables: [{ name: "s", value: "Stack {}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 8, description: "push(1)，items = [1]", variables: [{ name: "items", value: "[1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 9, description: "push(2)，items = [1,2]", variables: [{ name: "items", value: "[1,2]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 10, description: "pop() 移除并返回栈顶 2", variables: [{ name: "popped", value: "2", type: "number", changed: true }, { name: "items", value: "[1]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "Stack", label: "Stack", type: "class", description: "栈类" },
      ],
      [],
      `graph TD
        A[Stack] --> B[push]
        A --> C[pop]
        A --> D[peek]`,
      [
        { id: "push", label: "push", type: "input" },
        { id: "stack", label: "栈顶", type: "process" },
        { id: "pop", label: "pop", type: "output" },
      ],
      [
        { from: "push", to: "stack" },
        { from: "stack", to: "pop" },
      ],
      `graph TD
        push[push 1, push 2] --> stack[栈顶 -> 2]
        stack --> pop[pop 返回 2]`
    ),
  },

  {
    id: "linked-list",
    title: "链表实现",
    description: "JavaScript 单向链表，支持 append 和 toArray。",
    category: "data-structure",
    difficulty: "easy",
    language: "javascript",
    code: `class ListNode {
  constructor(val) {
    this.val = val;
    this.next = null;
  }
}

class LinkedList {
  head = null;
  append(val) {
    if (!this.head) { this.head = new ListNode(val); return; }
    let cur = this.head;
    while (cur.next) cur = cur.next;
    cur.next = new ListNode(val);
  }
  toArray() {
    const res = [];
    let cur = this.head;
    while (cur) { res.push(cur.val); cur = cur.next; }
    return res;
  }
}

const list = new LinkedList();
list.append(1);
list.append(2);
console.log(list.toArray());`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "linked-list",
      "单向链表：节点通过 next 指针连接",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 ListNode 节点类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 7, description: "定义 LinkedList 类", variables: [], highlight: "normal" },
        { stepNumber: 3, lineNumber: 18, description: "创建空链表 list", variables: [{ name: "head", value: "null", type: "object", changed: false }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 19, description: "append(1)，head 指向新节点 1", variables: [{ name: "head", value: "ListNode(1)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 20, description: "append(2)，遍历到尾节点后追加", variables: [{ name: "head.next", value: "ListNode(2)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 21, description: "toArray 遍历链表得到 [1, 2]", variables: [{ name: "result", value: "[1,2]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "LinkedList", label: "LinkedList", type: "class", description: "链表类" },
        { id: "ListNode", label: "ListNode", type: "class", description: "节点类" },
      ],
      [
        { from: "LinkedList", to: "ListNode", label: "包含" },
      ],
      `graph TD
        A[LinkedList] --> B[ListNode]
        B --> C[next]
        C --> D[ListNode]
        D --> E[null]`,
      [
        { id: "append", label: "append", type: "input" },
        { id: "head", label: "head", type: "process" },
        { id: "tail", label: "tail.next", type: "process" },
        { id: "toArray", label: "toArray", type: "process" },
        { id: "out", label: "[1,2]", type: "output" },
      ],
      [
        { from: "append", to: "head" },
        { from: "head", to: "tail" },
        { from: "tail", to: "toArray" },
        { from: "toArray", to: "out" },
      ],
      `graph TD
        append[append 1, append 2] --> head[head -> 1]
        head --> tail[1.next -> 2]
        tail --> toArray[遍历链表]
        toArray --> out[输出 [1,2]]`
    ),
  },

  {
    id: "queue",
    title: "队列实现",
    description: "TypeScript 泛型队列，先进先出。",
    category: "data-structure",
    difficulty: "easy",
    language: "typescript",
    code: `class Queue<T> {
  private items: T[] = [];
  enqueue(item: T) { this.items.push(item); }
  dequeue(): T | undefined { return this.items.shift(); }
  size(): number { return this.items.length; }
}

const q = new Queue<number>();
q.enqueue(10);
q.enqueue(20);
console.log(q.dequeue());`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "queue",
      "队列（Queue）：先进先出的数据结构",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Queue 泛型类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 items = []", variables: [{ name: "items", value: "[]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 8, description: "创建 Queue<number> 实例", variables: [{ name: "q", value: "Queue {}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 9, description: "enqueue(10)，items = [10]", variables: [{ name: "items", value: "[10]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 10, description: "enqueue(20)，items = [10,20]", variables: [{ name: "items", value: "[10,20]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 11, description: "dequeue() 移除队首 10", variables: [{ name: "dequeued", value: "10", type: "number", changed: true }, { name: "items", value: "[20]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "Queue", label: "Queue", type: "class", description: "队列类" },
      ],
      [],
      `graph TD
        A[Queue] --> B[enqueue 队尾]
        A --> C[dequeue 队首]`,
      [
        { id: "enqueue", label: "enqueue", type: "input" },
        { id: "tail", label: "队尾入队", type: "process" },
        { id: "head", label: "队首出队", type: "process" },
        { id: "out", label: "10", type: "output" },
      ],
      [
        { from: "enqueue", to: "tail" },
        { from: "tail", to: "head" },
        { from: "head", to: "out" },
      ],
      `graph TD
        enqueue[enqueue 10, enqueue 20] --> tail[队尾: 20]
        tail --> head[队首: 10]
        head --> out[dequeue 返回 10]`
    ),
  },

  {
    id: "lru-cache",
    title: "LRU 缓存",
    description: "JavaScript 实现最近最少使用缓存，展示 Map 顺序。",
    category: "data-structure",
    difficulty: "medium",
    language: "javascript",
    code: `class LRUCache {
  cache = new Map();
  constructor(capacity) { this.capacity = capacity; }
  get(key) {
    if (!this.cache.has(key)) return -1;
    const val = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, val);
    return val;
  }
  put(key, value) {
    if (this.cache.has(key)) this.cache.delete(key);
    this.cache.set(key, value);
    if (this.cache.size > this.capacity) {
      const first = this.cache.keys().next().value;
      this.cache.delete(first);
    }
  }
}

const cache = new LRUCache(2);
cache.put(1, 1);
cache.put(2, 2);
cache.get(1);
cache.put(3, 3);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "javascript",
      "lru-cache",
      "LRU 缓存：使用 Map 维护访问顺序，超出容量时淘汰最久未使用的项",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 LRUCache 类", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 3, description: "初始化 capacity = 2", variables: [{ name: "capacity", value: "2", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 15, description: "put(1,1)，cache = {1:1}", variables: [{ name: "cache", value: "Map(1)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 16, description: "put(2,2)，cache = {1:1, 2:2}", variables: [{ name: "cache", value: "Map(2)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 17, description: "get(1) 命中，移到最新位置 cache = {2:2, 1:1}", variables: [{ name: "cache", value: "Map(2)", type: "object", changed: true }, { name: "result", value: "1", type: "number", changed: true }], highlight: "branch-true" },
        { stepNumber: 6, lineNumber: 18, description: "put(3,3)，容量超了，删除最旧的 key 2", variables: [{ name: "cache", value: "Map(2)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 18, description: "最终 cache = {1:1, 3:3}", variables: [{ name: "cache", value: "Map {1=>1, 3=>3}", type: "object", changed: true }], highlight: "return" },
      ],
      [
        { id: "LRUCache", label: "LRUCache", type: "class", description: "LRU 缓存" },
        { id: "Map", label: "Map", type: "function", description: "维护顺序" },
      ],
      [
        { from: "LRUCache", to: "Map", label: "操作" },
      ],
      `graph TD
        A[put/get] --> B[更新 Map 顺序]
        B --> C{超出容量?}
        C -->|是| D[删除最旧 key]
        C -->|否| E[保持]`,
      [
        { id: "put", label: "put", type: "input" },
        { id: "get", label: "get", type: "input" },
        { id: "map", label: "Map 维护顺序", type: "process" },
        { id: "evict", label: "淘汰最旧", type: "process" },
        { id: "out", label: "缓存状态", type: "output" },
      ],
      [
        { from: "put", to: "map" },
        { from: "get", to: "map" },
        { from: "map", to: "evict", label: "超容" },
        { from: "evict", to: "out" },
        { from: "map", to: "out" },
      ],
      `graph TD
        put[put/get] --> map[Map 维护访问顺序]
        map --> evict{容量超过 2?}
        evict -->|是| remove[删除最久未使用]
        evict -->|否| keep[保留]
        remove --> out[最终缓存状态]
        keep --> out`
    ),
  },

  {
    id: "binary-tree",
    title: "二叉树层序遍历",
    description: "Python 广度优先搜索遍历二叉树，展示队列使用。",
    category: "data-structure",
    difficulty: "hard",
    language: "python",
    code: `from collections import deque

class TreeNode:
    def __init__(self, val=0, left=None, right=None):
        self.val = val
        self.left = left
        self.right = right

def level_order(root):
    if not root:
        return []
    result, queue = [], deque([root])
    while queue:
        node = queue.popleft()
        result.append(node.val)
        if node.left: queue.append(node.left)
        if node.right: queue.append(node.right)
    return result

root = TreeNode(1, TreeNode(2), TreeNode(3))
print(level_order(root))`,
    preAnalyzed: makePreAnalyzed(
      "",
      "python",
      "binary-tree",
      "二叉树 BFS：用队列按层逐节点访问",
      [
        { stepNumber: 1, lineNumber: 1, description: "导入 deque 队列", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 9, description: "调用 level_order(root)", variables: [{ name: "root", value: "TreeNode(1)", type: "object", changed: true }], highlight: "function-call" },
        { stepNumber: 3, lineNumber: 12, description: "初始化 result=[]，queue=[root]", variables: [{ name: "result", value: "[]", type: "array", changed: true }, { name: "queue", value: "deque([1])", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 13, description: "进入 while 循环", variables: [], highlight: "loop-start" },
        { stepNumber: 5, lineNumber: 14, description: "弹出队首节点 1，result=[1]", variables: [{ name: "result", value: "[1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 15, description: "左子节点 2 入队，queue=[2]", variables: [{ name: "queue", value: "deque([2])", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 16, description: "右子节点 3 入队，queue=[2,3]", variables: [{ name: "queue", value: "deque([2,3])", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 14, description: "弹出节点 2，result=[1,2]", variables: [{ name: "result", value: "[1,2]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 9, lineNumber: 17, description: "返回层序遍历结果 [1,2,3]", variables: [{ name: "result", value: "[1,2,3]", type: "array", changed: true }], highlight: "return" },
      ],
      [
        { id: "level_order", label: "level_order", type: "function", description: "层序遍历" },
        { id: "TreeNode", label: "TreeNode", type: "class", description: "树节点" },
      ],
      [
        { from: "level_order", to: "TreeNode", label: "访问" },
      ],
      `graph TD
        A[level_order] --> B[初始化队列]
        B --> C[while 队列非空]
        C --> D[出队访问]
        D --> E[左右子节点入队]
        E --> C`,
      [
        { id: "root", label: "根节点 1", type: "input" },
        { id: "queue", label: "队列", type: "process" },
        { id: "visit", label: "访问节点", type: "process" },
        { id: "enqueue", label: "子节点入队", type: "process" },
        { id: "out", label: "[1,2,3]", type: "output" },
      ],
      [
        { from: "root", to: "queue" },
        { from: "queue", to: "visit" },
        { from: "visit", to: "enqueue" },
        { from: "enqueue", to: "queue" },
        { from: "visit", to: "out" },
      ],
      `graph TD
        root[根节点 1] --> queue[初始化 queue=[1]]
        queue --> visit[弹出访问 1]
        visit --> enqueue[左2右3入队]
        enqueue --> queue
        queue --> visit2[弹出访问 2]
        visit2 --> out[结果 [1,2,3]]`
    ),
  },

  {
    id: "rb-tree",
    title: "红黑树插入",
    description: "TypeScript 简化红黑树插入与旋转，展示自平衡过程。",
    category: "data-structure",
    difficulty: "hard",
    language: "typescript",
    code: `enum Color { Red, Black }
class RBNode {
  color = Color.Red;
  constructor(public val: number, public left: RBNode | null = null, public right: RBNode | null = null, public parent: RBNode | null = null) {}
}

class RBTree {
  root: RBNode | null = null;
  insert(val: number) {
    const node = new RBNode(val);
    if (!this.root) { this.root = node; node.color = Color.Black; return; }
    // 简化：仅展示 BST 插入，平衡旋转省略
    let cur = this.root;
    while (true) {
      if (val < cur.val) {
        if (!cur.left) { cur.left = node; node.parent = cur; break; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = node; node.parent = cur; break; }
        cur = cur.right;
      }
    }
  }
}

const tree = new RBTree();
tree.insert(10);
tree.insert(5);
tree.insert(15);`,
    preAnalyzed: makePreAnalyzed(
      "",
      "typescript",
      "rb-tree",
      "红黑树：在 BST 插入基础上维护颜色与平衡（简化版展示插入过程）",
      [
        { stepNumber: 1, lineNumber: 1, description: "定义 Color 枚举", variables: [], highlight: "normal" },
        { stepNumber: 2, lineNumber: 2, description: "定义 RBNode 节点类", variables: [], highlight: "normal" },
        { stepNumber: 3, lineNumber: 8, description: "定义 RBTree 类", variables: [], highlight: "normal" },
        { stepNumber: 4, lineNumber: 11, description: "插入 10，root 为空，设为黑色根节点", variables: [{ name: "root", value: "RBNode(10, Black)", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 5, lineNumber: 11, description: "插入 5，比 10 小，放到左子节点，颜色为红", variables: [{ name: "root.left", value: "RBNode(5, Red)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 11, description: "插入 15，比 10 大，放到右子节点，颜色为红", variables: [{ name: "root.right", value: "RBNode(15, Red)", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 27, description: "最终树结构：10(黑)/5(红)/15(红)", variables: [{ name: "tree", value: "{root:10, left:5, right:15}", type: "object", changed: true }], highlight: "return" },
      ],
      [
        { id: "RBTree", label: "RBTree", type: "class", description: "红黑树" },
        { id: "RBNode", label: "RBNode", type: "class", description: "红黑树节点" },
      ],
      [
        { from: "RBTree", to: "RBNode", label: "包含" },
      ],
      `graph TD
        A[RBTree.insert] --> B{BST 定位}
        B --> C[插入新节点]
        C --> D[颜色调整]
        D --> E[旋转平衡]`,
      [
        { id: "insert", label: "insert", type: "input" },
        { id: "bst", label: "BST 定位", type: "process" },
        { id: "color", label: "颜色调整", type: "process" },
        { id: "rotate", label: "旋转平衡", type: "process" },
        { id: "out", label: "平衡树", type: "output" },
      ],
      [
        { from: "insert", to: "bst" },
        { from: "bst", to: "color" },
        { from: "color", to: "rotate" },
        { from: "rotate", to: "out" },
      ],
      `graph TD
        insert[插入 10,5,15] --> bst[BST 定位]
        bst --> color[新节点设为红色]
        color --> rotate[必要时旋转平衡]
        rotate --> out[最终红黑树结构]`
    ),
  },
];
