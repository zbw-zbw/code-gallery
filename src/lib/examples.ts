import { AnalysisResult, Language } from "@/types";

export interface Example {
  id: string;
  title: string;
  description: string;
  category: "algorithm" | "pattern" | "async" | "data-structure";
  language: Language;
  code: string;
  preAnalyzed: AnalysisResult;
}

export const CATEGORY_LABELS: Record<string, string> = {
  all: "全部",
  algorithm: "算法",
  pattern: "设计模式",
  async: "异步",
  "data-structure": "数据结构",
};

export const EXAMPLES: Example[] = [
  // ──────────────────────────────────────────────
  // 1. Bubble Sort
  // ──────────────────────────────────────────────
  {
    id: "bubble-sort",
    title: "冒泡排序",
    description: "经典排序算法，逐步比较相邻元素并交换",
    category: "algorithm",
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
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "对数组进行冒泡排序，升序排列",
      executionSteps: [
        { stepNumber: 1, lineNumber: 1, description: "调用 bubbleSort，传入数组 [5, 3, 8, 1, 4]", variables: [{ name: "arr", value: "[5,3,8,1,4]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "外层循环开始，i = 0", variables: [{ name: "arr", value: "[5,3,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 3, lineNumber: 3, description: "内层循环开始，j = 0", variables: [{ name: "arr", value: "[5,3,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 4, lineNumber: 4, description: "比较 arr[0]=5 和 arr[1]=3，5 > 3 为 true", variables: [{ name: "arr", value: "[5,3,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "0", type: "number", changed: false }], highlight: "branch-true" },
        { stepNumber: 5, lineNumber: 5, description: "交换 arr[0] 和 arr[1]，数组变为 [3, 5, 8, 1, 4]", variables: [{ name: "arr", value: "[3,5,8,1,4]", type: "array", changed: true }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "0", type: "number", changed: false }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 3, description: "内层循环继续，j = 1", variables: [{ name: "arr", value: "[3,5,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "1", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 4, description: "比较 arr[1]=5 和 arr[2]=8，5 > 8 为 false", variables: [{ name: "arr", value: "[3,5,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "1", type: "number", changed: false }], highlight: "branch-false" },
        { stepNumber: 8, lineNumber: 3, description: "内层循环继续，j = 2", variables: [{ name: "arr", value: "[3,5,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "2", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 9, lineNumber: 4, description: "比较 arr[2]=8 和 arr[3]=1，8 > 1 为 true", variables: [{ name: "arr", value: "[3,5,8,1,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "2", type: "number", changed: false }], highlight: "branch-true" },
        { stepNumber: 10, lineNumber: 5, description: "交换 arr[2] 和 arr[3]，数组变为 [3, 5, 1, 8, 4]", variables: [{ name: "arr", value: "[3,5,1,8,4]", type: "array", changed: true }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "2", type: "number", changed: false }], highlight: "normal" },
        { stepNumber: 11, lineNumber: 3, description: "内层循环继续，j = 3", variables: [{ name: "arr", value: "[3,5,1,8,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 12, lineNumber: 4, description: "比较 arr[3]=8 和 arr[4]=4，8 > 4 为 true", variables: [{ name: "arr", value: "[3,5,1,8,4]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "3", type: "number", changed: false }], highlight: "branch-true" },
        { stepNumber: 13, lineNumber: 5, description: "交换 arr[3] 和 arr[4]，数组变为 [3, 5, 1, 4, 8]", variables: [{ name: "arr", value: "[3,5,1,4,8]", type: "array", changed: true }, { name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "3", type: "number", changed: false }], highlight: "normal" },
        { stepNumber: 14, lineNumber: 2, description: "第一轮排序完成，最大值 8 已就位", variables: [{ name: "arr", value: "[3,5,1,4,8]", type: "array", changed: false }, { name: "i", value: "0", type: "number", changed: false }], highlight: "loop-end", annotation: "后续轮次继续排序剩余元素" },
        { stepNumber: 15, lineNumber: 7, description: "排序完成，返回 [1, 3, 4, 5, 8]", variables: [{ name: "arr", value: "[1,3,4,5,8]", type: "array", changed: true }], highlight: "return" },
      ],
      architecture: {
        nodes: [
          { id: "bubbleSort", label: "bubbleSort", type: "function", description: "冒泡排序主函数" },
          { id: "arr", label: "arr (参数)", type: "variable" },
          { id: "i", label: "i (循环变量)", type: "variable" },
          { id: "j", label: "j (循环变量)", type: "variable" },
        ],
        edges: [
          { from: "bubbleSort", to: "arr", label: "接收参数" },
          { from: "bubbleSort", to: "i", label: "初始化" },
          { from: "i", to: "j", label: "控制" },
        ],
        mermaidCode: `graph TD
    A[bubbleSort] -->|接收参数| B["arr (参数)"]
    A -->|初始化| C["i (循环变量)"]
    C -->|控制| D["j (循环变量)"]
    D -->|比较| E{"arr[j] > arr[j+1]"}
    E -->|是| F[交换元素]
    E -->|否| D
    F --> D`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "输入数组", type: "input" },
          { id: "compare", label: "比较相邻元素", type: "decision" },
          { id: "swap", label: "交换位置", type: "process" },
          { id: "next", label: "下一个元素", type: "process" },
          { id: "output", label: "排序结果", type: "output" },
        ],
        edges: [
          { from: "input", to: "compare", label: "传入数组" },
          { from: "compare", to: "swap", label: "需要交换" },
          { from: "swap", to: "next", label: "继续" },
          { from: "compare", to: "next", label: "无需交换" },
          { from: "next", to: "compare", label: "下一对" },
          { from: "next", to: "output", label: "排序完成" },
        ],
        mermaidCode: `graph LR
    A[输入数组] --> B{比较相邻元素}
    B -->|需要交换| C[交换位置]
    B -->|无需交换| D[下一个元素]
    C --> D
    D --> B
    D --> E[排序结果]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 2. Fibonacci
  // ──────────────────────────────────────────────
  {
    id: "fibonacci",
    title: "斐波那契递归",
    description: "经典递归算法，展示递归调用栈",
    category: "algorithm",
    language: "python",
    code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(5)
print(result)`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "python" },
      summary: "递归计算第 N 个斐波那契数",
      executionSteps: [
        { stepNumber: 1, lineNumber: 7, description: "调用 fibonacci(5)", variables: [{ name: "n", value: "5", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "判断 n=5, 5 <= 1 为 false", variables: [{ name: "n", value: "5", type: "number", changed: false }], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 4, description: "递归调用 fibonacci(4) + fibonacci(3)", variables: [{ name: "n", value: "5", type: "number", changed: false }], highlight: "function-call", annotation: "进入递归分支" },
        { stepNumber: 4, lineNumber: 2, description: "fibonacci(4): 判断 4 <= 1 为 false", variables: [{ name: "n", value: "4", type: "number", changed: true }], highlight: "branch-false" },
        { stepNumber: 5, lineNumber: 4, description: "fibonacci(4): 递归调用 fibonacci(3) + fibonacci(2)", variables: [{ name: "n", value: "4", type: "number", changed: false }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 2, description: "fibonacci(3): 判断 3 <= 1 为 false", variables: [{ name: "n", value: "3", type: "number", changed: true }], highlight: "branch-false" },
        { stepNumber: 7, lineNumber: 4, description: "fibonacci(3): 递归调用 fibonacci(2) + fibonacci(1)", variables: [{ name: "n", value: "3", type: "number", changed: false }], highlight: "function-call" },
        { stepNumber: 8, lineNumber: 3, description: "fibonacci(1): 判断 1 <= 1 为 true，返回 1", variables: [{ name: "n", value: "1", type: "number", changed: true }], highlight: "branch-true" },
        { stepNumber: 9, lineNumber: 2, description: "fibonacci(2): 判断 2 <= 1 为 false", variables: [{ name: "n", value: "2", type: "number", changed: true }], highlight: "branch-false" },
        { stepNumber: 10, lineNumber: 3, description: "fibonacci(0): 判断 0 <= 1 为 true，返回 0", variables: [{ name: "n", value: "0", type: "number", changed: true }], highlight: "branch-true" },
        { stepNumber: 11, lineNumber: 3, description: "fibonacci(1): 返回 1（基础情况）", variables: [{ name: "n", value: "1", type: "number", changed: false }], highlight: "return" },
        { stepNumber: 12, lineNumber: 7, description: "fibonacci(5) = 5，赋值给 result", variables: [{ name: "result", value: "5", type: "number", changed: true }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "fib", label: "fibonacci", type: "function", description: "递归计算斐波那契数" },
          { id: "base", label: "基础情况 (n<=1)", type: "function" },
          { id: "recur", label: "递归分支", type: "function" },
        ],
        edges: [
          { from: "fib", to: "base", label: "n <= 1" },
          { from: "fib", to: "recur", label: "n > 1" },
          { from: "recur", to: "fib", label: "递归调用" },
        ],
        mermaidCode: `graph TD
    A[fibonacci] -->|n <= 1| B["基础情况 (n<=1)"]
    A -->|n > 1| C[递归分支]
    C -->|fib(n-1)| A
    C -->|fib(n-2)| A
    B --> D[返回 n]`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "参数 n", type: "input" },
          { id: "check", label: "判断 n<=1", type: "decision" },
          { id: "return_n", label: "返回 n", type: "output" },
          { id: "recur", label: "递归分解", type: "process" },
          { id: "sum", label: "求和返回", type: "output" },
        ],
        edges: [
          { from: "input", to: "check" },
          { from: "check", to: "return_n", label: "是" },
          { from: "check", to: "recur", label: "否" },
          { from: "recur", to: "sum", label: "递归结果" },
        ],
        mermaidCode: `graph LR
    A[参数 n] --> B{判断 n<=1}
    B -->|是| C[返回 n]
    B -->|否| D[递归分解]
    D --> E[求和返回]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 3. Binary Search
  // ──────────────────────────────────────────────
  {
    id: "binary-search",
    title: "二分查找",
    description: "在有序数组中高效查找目标值",
    category: "algorithm",
    language: "typescript",
    code: `function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
binarySearch([1,3,5,7,9,11,13], 7);`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "typescript" },
      summary: "在有序数组中使用二分查找定位目标值",
      executionSteps: [
        { stepNumber: 1, lineNumber: 9, description: "调用 binarySearch，目标值 7", variables: [{ name: "arr", value: "[1,3,5,7,9,11,13]", type: "array", changed: true }, { name: "target", value: "7", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "初始化 left=0, right=6", variables: [{ name: "arr", value: "[1,3,5,7,9,11,13]", type: "array", changed: false }, { name: "target", value: "7", type: "number", changed: false }, { name: "left", value: "0", type: "number", changed: true }, { name: "right", value: "6", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 3, description: "进入循环，left(0) <= right(6)", variables: [{ name: "left", value: "0", type: "number", changed: false }, { name: "right", value: "6", type: "number", changed: false }], highlight: "loop-start" },
        { stepNumber: 4, lineNumber: 4, description: "计算 mid = 3, arr[3] = 7", variables: [{ name: "mid", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 5, description: "比较 arr[3]=7 === target=7，匹配成功", variables: [{ name: "mid", value: "3", type: "number", changed: false }], highlight: "branch-true" },
        { stepNumber: 6, lineNumber: 5, description: "返回索引 3", variables: [{ name: "mid", value: "3", type: "number", changed: false }], highlight: "return" },
      ],
      architecture: {
        nodes: [
          { id: "bs", label: "binarySearch", type: "function", description: "二分查找函数" },
          { id: "arr", label: "arr (有序数组)", type: "variable" },
          { id: "target", label: "target (目标值)", type: "variable" },
        ],
        edges: [
          { from: "bs", to: "arr", label: "接收" },
          { from: "bs", to: "target", label: "接收" },
        ],
        mermaidCode: `graph TD
    A[binarySearch] -->|接收| B["arr (有序数组)"]
    A -->|接收| C["target (目标值)"]
    A --> D{arr[mid] === target}
    D -->|是| E[返回 mid]
    D -->|否| F{arr[mid] < target}
    F -->|是| G[搜索右半部分]
    F -->|否| H[搜索左半部分]
    G --> A
    H --> A`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "有序数组 + 目标值", type: "input" },
          { id: "calc_mid", label: "计算中间位置", type: "process" },
          { id: "compare", label: "比较中间值", type: "decision" },
          { id: "narrow", label: "缩小范围", type: "process" },
          { id: "output", label: "返回索引", type: "output" },
        ],
        edges: [
          { from: "input", to: "calc_mid" },
          { from: "calc_mid", to: "compare" },
          { from: "compare", to: "output", label: "匹配" },
          { from: "compare", to: "narrow", label: "不匹配" },
          { from: "narrow", to: "calc_mid", label: "继续" },
        ],
        mermaidCode: `graph LR
    A[有序数组 + 目标值] --> B[计算中间位置]
    B --> C{比较中间值}
    C -->|匹配| D[返回索引]
    C -->|不匹配| E[缩小范围]
    E --> B`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 4. Promise Chain
  // ──────────────────────────────────────────────
  {
    id: "promise-chain",
    title: "Promise 链",
    description: "展示异步链式调用的执行顺序",
    category: "async",
    language: "javascript",
    code: `function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .then(user => user.name)
    .then(name => console.log(name));
}
fetchUser(42);`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "通过 Promise 链获取用户数据并提取名称",
      executionSteps: [
        { stepNumber: 1, lineNumber: 7, description: "调用 fetchUser(42)", variables: [{ name: "id", value: "42", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 3, description: "发起 fetch 请求 /api/users/42", variables: [{ name: "id", value: "42", type: "number", changed: false }], highlight: "normal", annotation: "异步操作，等待响应" },
        { stepNumber: 3, lineNumber: 3, description: "收到 Response 对象", variables: [{ name: "res", value: "Response{}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "调用 res.json() 解析响应体", variables: [{ name: "res", value: "Response{}", type: "object", changed: false }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 4, description: "获得 user 对象 { name: 'Alice', ... }", variables: [{ name: "user", value: '{"name":"Alice"}', type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 5, description: "提取 user.name = 'Alice'", variables: [{ name: "name", value: "'Alice'", type: "string", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 6, description: "console.log('Alice')，输出用户名", variables: [{ name: "name", value: "'Alice'", type: "string", changed: false }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "fetchUser", label: "fetchUser", type: "function", description: "获取用户信息" },
          { id: "fetch", label: "fetch API", type: "external" },
          { id: "json", label: "res.json()", type: "function" },
          { id: "extract", label: "提取 name", type: "function" },
          { id: "log", label: "console.log", type: "external" },
        ],
        edges: [
          { from: "fetchUser", to: "fetch", label: "调用" },
          { from: "fetch", to: "json", label: "then" },
          { from: "json", to: "extract", label: "then" },
          { from: "extract", to: "log", label: "then" },
        ],
        mermaidCode: `graph LR
    A[fetchUser] -->|调用| B[fetch API]
    B -->|then| C[res.json]
    C -->|then| D[提取 name]
    D -->|then| E[console.log]`,
      },
      dataFlow: {
        nodes: [
          { id: "id", label: "用户 ID", type: "input" },
          { id: "api", label: "API 请求", type: "process" },
          { id: "response", label: "响应数据", type: "storage" },
          { id: "parse", label: "JSON 解析", type: "process" },
          { id: "name", label: "用户名", type: "output" },
        ],
        edges: [
          { from: "id", to: "api", label: "42" },
          { from: "api", to: "response", label: "Response" },
          { from: "response", to: "parse" },
          { from: "parse", to: "name", label: "Alice" },
        ],
        mermaidCode: `graph LR
    A[用户 ID] -->|42| B[API 请求]
    B -->|Response| C[响应数据]
    C --> D[JSON 解析]
    D -->|Alice| E[用户名]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 5. Pub/Sub Pattern
  // ──────────────────────────────────────────────
  {
    id: "pub-sub",
    title: "发布-订阅模式",
    description: "简单的 EventEmitter 实现",
    category: "pattern",
    language: "typescript",
    code: `class EventEmitter {
  private events: Record<string, Function[]> = {};
  on(event: string, fn: Function) {
    (this.events[event] ||= []).push(fn);
  }
  emit(event: string, ...args: any[]) {
    this.events[event]?.forEach(fn => fn(...args));
  }
}
const bus = new EventEmitter();
bus.on("data", (msg) => console.log(msg));
bus.emit("data", "hello");`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "typescript" },
      summary: "实现简单的发布-订阅事件系统",
      executionSteps: [
        { stepNumber: 1, lineNumber: 9, description: "创建 EventEmitter 实例 bus", variables: [{ name: "bus", value: "EventEmitter{}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 10, description: "调用 bus.on('data', callback) 注册监听", variables: [{ name: "bus", value: "EventEmitter{}", type: "object", changed: false }], highlight: "function-call" },
        { stepNumber: 3, lineNumber: 3, description: "on 方法：初始化 events['data'] 为空数组", variables: [{ name: "event", value: "'data'", type: "string", changed: true }, { name: "fn", value: "callback", type: "function", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "on 方法：将 callback 推入 events['data'] 数组", variables: [{ name: "events", value: '{"data":[callback]}', type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 11, description: "调用 bus.emit('data', 'hello')", variables: [{ name: "event", value: "'data'", type: "string", changed: true }, { name: "args", value: "['hello']", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 6, description: "emit 方法：遍历 events['data'] 中的回调", variables: [{ name: "events", value: '{"data":[callback]}', type: "object", changed: false }], highlight: "loop-start" },
        { stepNumber: 7, lineNumber: 6, description: "执行 callback('hello')，输出 hello", variables: [{ name: "msg", value: "'hello'", type: "string", changed: true }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "emitter", label: "EventEmitter", type: "class", description: "事件发射器类" },
          { id: "on", label: "on()", type: "function", description: "注册事件监听" },
          { id: "emit", label: "emit()", type: "function", description: "触发事件" },
          { id: "events", label: "events", type: "variable", description: "事件存储映射" },
        ],
        edges: [
          { from: "emitter", to: "on", label: "方法" },
          { from: "emitter", to: "emit", label: "方法" },
          { from: "on", to: "events", label: "写入" },
          { from: "emit", to: "events", label: "读取" },
        ],
        mermaidCode: `graph TD
    A[EventEmitter] -->|方法| B["on()"]
    A -->|方法| C["emit()"]
    B -->|写入| D[events 映射]
    C -->|读取| D
    C -->|调用回调| E[订阅者]`,
      },
      dataFlow: {
        nodes: [
          { id: "register", label: "注册监听", type: "input" },
          { id: "store", label: "事件存储", type: "storage" },
          { id: "trigger", label: "触发事件", type: "process" },
          { id: "dispatch", label: "分发回调", type: "process" },
          { id: "output", label: "执行结果", type: "output" },
        ],
        edges: [
          { from: "register", to: "store", label: "callback" },
          { from: "trigger", to: "dispatch" },
          { from: "dispatch", to: "store", label: "查找回调" },
          { from: "dispatch", to: "output", label: "执行" },
        ],
        mermaidCode: `graph LR
    A[注册监听] -->|callback| B[事件存储]
    C[触发事件] --> D[分发回调]
    D -->|查找| B
    D -->|执行| E[执行结果]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 6. Stack
  // ──────────────────────────────────────────────
  {
    id: "stack",
    title: "栈实现",
    description: "后进先出数据结构的简单实现",
    category: "data-structure",
    language: "javascript",
    code: `class Stack {
  #items = [];
  push(item) { this.#items.push(item); }
  pop() { return this.#items.pop(); }
  peek() { return this.#items.at(-1); }
  get size() { return this.#items.length; }
}
const s = new Stack();
s.push("a");
s.push("b");
s.pop();
s.peek();`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "实现栈数据结构，支持 push、pop、peek 操作",
      executionSteps: [
        { stepNumber: 1, lineNumber: 9, description: "创建 Stack 实例 s", variables: [{ name: "s", value: "Stack{#items:[]}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 10, description: "调用 s.push('a')", variables: [{ name: "item", value: "'a'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 3, lineNumber: 3, description: "将 'a' 压入栈，#items = ['a']", variables: [{ name: "#items", value: "['a']", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 11, description: "调用 s.push('b')", variables: [{ name: "item", value: "'b'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 3, description: "将 'b' 压入栈，#items = ['a', 'b']", variables: [{ name: "#items", value: "['a','b']", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 12, description: "调用 s.pop()，弹出栈顶元素", variables: [{ name: "#items", value: "['a','b']", type: "array", changed: false }], highlight: "function-call" },
        { stepNumber: 7, lineNumber: 4, description: "返回 'b'，#items = ['a']", variables: [{ name: "#items", value: "['a']", type: "array", changed: true }], highlight: "return" },
        { stepNumber: 8, lineNumber: 13, description: "调用 s.peek()，查看栈顶", variables: [{ name: "#items", value: "['a']", type: "array", changed: false }], highlight: "function-call" },
        { stepNumber: 9, lineNumber: 5, description: "返回栈顶元素 'a'，栈不变", variables: [{ name: "#items", value: "['a']", type: "array", changed: false }], highlight: "return" },
      ],
      architecture: {
        nodes: [
          { id: "stack", label: "Stack", type: "class", description: "栈类" },
          { id: "push", label: "push()", type: "function" },
          { id: "pop", label: "pop()", type: "function" },
          { id: "peek", label: "peek()", type: "function" },
          { id: "items", label: "#items", type: "variable" },
        ],
        edges: [
          { from: "stack", to: "push", label: "方法" },
          { from: "stack", to: "pop", label: "方法" },
          { from: "stack", to: "peek", label: "方法" },
          { from: "push", to: "items", label: "写入" },
          { from: "pop", to: "items", label: "读取并移除" },
          { from: "peek", to: "items", label: "只读" },
        ],
        mermaidCode: `graph TD
    A[Stack] -->|方法| B["push()"]
    A -->|方法| C["pop()"]
    A -->|方法| D["peek()"]
    B -->|写入| E["#items"]
    C -->|读取并移除| E
    D -->|只读| E`,
      },
      dataFlow: {
        nodes: [
          { id: "push_input", label: "push 输入", type: "input" },
          { id: "stack_store", label: "栈存储", type: "storage" },
          { id: "pop_output", label: "pop 输出", type: "output" },
          { id: "peek_output", label: "peek 输出", type: "output" },
        ],
        edges: [
          { from: "push_input", to: "stack_store", label: "压入" },
          { from: "stack_store", to: "pop_output", label: "弹出" },
          { from: "stack_store", to: "peek_output", label: "查看" },
        ],
        mermaidCode: `graph LR
    A[push 输入] -->|压入| B[栈存储]
    B -->|弹出| C[pop 输出]
    B -->|查看| D[peek 输出]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 7. Quick Sort (NEW)
  // ──────────────────────────────────────────────
  {
    id: "quick-sort",
    title: "快速排序",
    description: "高效的分治排序算法，通过选取基准元素分区排序",
    category: "algorithm",
    language: "python",
    code: `def quick_sort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quick_sort(left) + middle + quick_sort(right)

result = quick_sort([5, 3, 8, 1, 4, 7])
print(result)`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "python" },
      summary: "使用快速排序对数组进行升序排列",
      executionSteps: [
        { stepNumber: 1, lineNumber: 9, description: "调用 quick_sort([5, 3, 8, 1, 4, 7])", variables: [{ name: "arr", value: "[5,3,8,1,4,7]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "判断 len(arr)=6, 6 <= 1 为 false", variables: [{ name: "arr", value: "[5,3,8,1,4,7]", type: "array", changed: false }], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 3, description: "选取基准 pivot = arr[3] = 1", variables: [{ name: "pivot", value: "1", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "构建 left 分区：比 1 小的元素 = []", variables: [{ name: "left", value: "[]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 5, description: "构建 middle 分区：等于 1 的元素 = [1]", variables: [{ name: "middle", value: "[1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 6, description: "构建 right 分区：比 1 大的元素 = [5,3,8,4,7]", variables: [{ name: "right", value: "[5,3,8,4,7]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 7, description: "递归调用 quick_sort(left) 和 quick_sort(right)", variables: [{ name: "left", value: "[]", type: "array", changed: false }, { name: "right", value: "[5,3,8,4,7]", type: "array", changed: false }], highlight: "function-call", annotation: "进入递归分支" },
        { stepNumber: 8, lineNumber: 2, description: "quick_sort([]): len=0 <= 1 为 true，返回 []", variables: [{ name: "arr", value: "[]", type: "array", changed: true }], highlight: "branch-true" },
        { stepNumber: 9, lineNumber: 3, description: "quick_sort([5,3,8,4,7]): 选取 pivot = arr[2] = 8", variables: [{ name: "arr", value: "[5,3,8,4,7]", type: "array", changed: true }, { name: "pivot", value: "8", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 10, lineNumber: 7, description: "递归分区完成，拼接结果 [1] + [5,3,8,4,7] 排序结果", variables: [{ name: "left", value: "[]", type: "array", changed: false }, { name: "middle", value: "[1]", type: "array", changed: false }, { name: "right", value: "[1,3,4,5,7,8]", type: "array", changed: true }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "qs", label: "quick_sort", type: "function", description: "快速排序递归函数" },
          { id: "pivot", label: "pivot (基准)", type: "variable", description: "分区基准值" },
          { id: "left", label: "left 分区", type: "variable" },
          { id: "middle", label: "middle 分区", type: "variable" },
          { id: "right", label: "right 分区", type: "variable" },
        ],
        edges: [
          { from: "qs", to: "pivot", label: "选取基准" },
          { from: "qs", to: "left", label: "构建" },
          { from: "qs", to: "middle", label: "构建" },
          { from: "qs", to: "right", label: "构建" },
          { from: "qs", to: "qs", label: "递归调用" },
        ],
        mermaidCode: `graph TD
    A[quick_sort] -->|选取基准| B["pivot (基准)"]
    A -->|构建| C["left 分区"]
    A -->|构建| D["middle 分区"]
    A -->|构建| E["right 分区"]
    A -->|递归调用| A
    C -->|x < pivot| A
    E -->|x > pivot| A`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "输入数组", type: "input" },
          { id: "base_check", label: "判断长度<=1", type: "decision" },
          { id: "partition", label: "分区操作", type: "process" },
          { id: "recur", label: "递归排序", type: "process" },
          { id: "merge", label: "拼接结果", type: "process" },
          { id: "output", label: "排序结果", type: "output" },
        ],
        edges: [
          { from: "input", to: "base_check", label: "传入" },
          { from: "base_check", to: "output", label: "是(直接返回)" },
          { from: "base_check", to: "partition", label: "否" },
          { from: "partition", to: "recur", label: "left/right" },
          { from: "recur", to: "merge", label: "子数组排序结果" },
          { from: "merge", to: "output", label: "拼接" },
        ],
        mermaidCode: `graph LR
    A[输入数组] --> B{判断长度<=1}
    B -->|是| C[排序结果]
    B -->|否| D[分区操作]
    D -->|left/right| E[递归排序]
    E -->|子数组结果| F[拼接结果]
    F --> C`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 8. Two Sum (NEW)
  // ──────────────────────────────────────────────
  {
    id: "two-sum",
    title: "两数之和",
    description: "使用哈希表高效查找数组中和为目标值的两个元素",
    category: "algorithm",
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
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "在数组中找到两个数使其和等于目标值，返回索引",
      executionSteps: [
        { stepNumber: 1, lineNumber: 10, description: "调用 twoSum([2,7,11,15], 9)", variables: [{ name: "nums", value: "[2,7,11,15]", type: "array", changed: true }, { name: "target", value: "9", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "初始化空哈希表 map", variables: [{ name: "map", value: "Map{}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 3, description: "进入循环，i = 0", variables: [{ name: "i", value: "0", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 4, lineNumber: 4, description: "计算 complement = 9 - nums[0] = 9 - 2 = 7", variables: [{ name: "complement", value: "7", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 5, description: "map.has(7) 为 false，7 不在 map 中", variables: [{ name: "map", value: "Map{}", type: "object", changed: false }], highlight: "branch-false" },
        { stepNumber: 6, lineNumber: 8, description: "map.set(2, 0)，存入当前元素", variables: [{ name: "map", value: "Map{2:0}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 3, description: "循环继续，i = 1", variables: [{ name: "i", value: "1", type: "number", changed: true }], highlight: "loop-start" },
        { stepNumber: 8, lineNumber: 4, description: "计算 complement = 9 - nums[1] = 9 - 7 = 2", variables: [{ name: "complement", value: "2", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 9, lineNumber: 5, description: "map.has(2) 为 true，2 在 map 中", variables: [{ name: "map", value: "Map{2:0}", type: "object", changed: false }], highlight: "branch-true" },
        { stepNumber: 10, lineNumber: 6, description: "返回 [map.get(2), 1] = [0, 1]", variables: [{ name: "map", value: "Map{2:0}", type: "object", changed: false }, { name: "i", value: "1", type: "number", changed: false }], highlight: "return" },
      ],
      architecture: {
        nodes: [
          { id: "twoSum", label: "twoSum", type: "function", description: "两数之和函数" },
          { id: "map", label: "map (哈希表)", type: "variable", description: "存储已遍历的元素" },
          { id: "i", label: "i (循环变量)", type: "variable" },
          { id: "complement", label: "complement", type: "variable" },
        ],
        edges: [
          { from: "twoSum", to: "map", label: "初始化" },
          { from: "twoSum", to: "i", label: "控制循环" },
          { from: "i", to: "complement", label: "计算" },
          { from: "complement", to: "map", label: "查找" },
        ],
        mermaidCode: `graph TD
    A[twoSum] -->|初始化| B["map (哈希表)"]
    A -->|控制循环| C["i (循环变量)"]
    C -->|计算| D[complement]
    D -->|查找| B
    B -->|命中| E[返回索引]
    B -->|未命中| F[存入 map]
    F --> C`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "数组 + 目标值", type: "input" },
          { id: "calc", label: "计算补数", type: "process" },
          { id: "lookup", label: "哈希表查找", type: "decision" },
          { id: "store", label: "存入哈希表", type: "storage" },
          { id: "output", label: "返回索引对", type: "output" },
        ],
        edges: [
          { from: "input", to: "calc", label: "target - nums[i]" },
          { from: "calc", to: "lookup", label: "complement" },
          { from: "lookup", to: "output", label: "找到匹配" },
          { from: "lookup", to: "store", label: "未找到" },
          { from: "store", to: "calc", label: "下一元素" },
        ],
        mermaidCode: `graph LR
    A[数组 + 目标值] -->|target - nums[i]| B[计算补数]
    B -->|complement| C{哈希表查找}
    C -->|找到匹配| D[返回索引对]
    C -->|未找到| E[存入哈希表]
    E -->|下一元素| B`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 9. Merge Sort (NEW)
  // ──────────────────────────────────────────────
  {
    id: "merge-sort",
    title: "归并排序",
    description: "分治策略的经典实现，递归拆分数组再合并",
    category: "algorithm",
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
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}

mergeSort([38, 27, 43, 3, 9, 82, 10]);`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "typescript" },
      summary: "使用归并排序对数组进行升序排列",
      executionSteps: [
        { stepNumber: 1, lineNumber: 17, description: "调用 mergeSort([38, 27, 43, 3, 9, 82, 10])", variables: [{ name: "arr", value: "[38,27,43,3,9,82,10]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "判断 arr.length=7, 7 <= 1 为 false", variables: [{ name: "arr", value: "[38,27,43,3,9,82,10]", type: "array", changed: false }], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 3, description: "计算 mid = 3，将数组拆分为左右两半", variables: [{ name: "mid", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "递归调用 mergeSort([38,27,43]) 处理左半部分", variables: [{ name: "left", value: "[38,27,43]", type: "array", changed: true }], highlight: "function-call", annotation: "进入左子树" },
        { stepNumber: 5, lineNumber: 5, description: "递归调用 mergeSort([3,9,82,10]) 处理右半部分", variables: [{ name: "right", value: "[3,9,82,10]", type: "array", changed: true }], highlight: "function-call", annotation: "进入右子树" },
        { stepNumber: 6, lineNumber: 6, description: "调用 merge 合并左右两个有序数组", variables: [{ name: "left", value: "[27,38,43]", type: "array", changed: true }, { name: "right", value: "[3,9,10,82]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 7, lineNumber: 9, description: "merge：初始化 result=[]，i=0, j=0", variables: [{ name: "result", value: "[]", type: "array", changed: true }, { name: "i", value: "0", type: "number", changed: true }, { name: "j", value: "0", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 10, description: "比较 left[0]=27 和 right[0]=3，27 <= 3 为 false", variables: [{ name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "0", type: "number", changed: false }], highlight: "branch-false" },
        { stepNumber: 9, lineNumber: 13, description: "result.push(right[0])，result=[3]，j++", variables: [{ name: "result", value: "[3]", type: "array", changed: true }, { name: "j", value: "1", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 10, lineNumber: 10, description: "比较 left[0]=27 和 right[1]=9，27 <= 9 为 false", variables: [{ name: "i", value: "0", type: "number", changed: false }, { name: "j", value: "1", type: "number", changed: false }], highlight: "branch-false" },
      ],
      architecture: {
        nodes: [
          { id: "ms", label: "mergeSort", type: "function", description: "归并排序递归函数" },
          { id: "merge", label: "merge", type: "function", description: "合并两个有序数组" },
          { id: "mid", label: "mid (中点)", type: "variable" },
        ],
        edges: [
          { from: "ms", to: "mid", label: "计算中点" },
          { from: "ms", to: "ms", label: "递归左半" },
          { from: "ms", to: "ms", label: "递归右半" },
          { from: "ms", to: "merge", label: "合并结果" },
        ],
        mermaidCode: `graph TD
    A[mergeSort] -->|计算中点| B["mid"]
    A -->|递归| A
    A -->|合并| C[merge]
    A -->|arr.length <= 1| D[返回 arr]`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "输入数组", type: "input" },
          { id: "split", label: "拆分数组", type: "process" },
          { id: "recur_left", label: "递归排序左半", type: "process" },
          { id: "recur_right", label: "递归排序右半", type: "process" },
          { id: "merge_process", label: "合并有序数组", type: "process" },
          { id: "output", label: "排序结果", type: "output" },
        ],
        edges: [
          { from: "input", to: "split", label: "传入" },
          { from: "split", to: "recur_left", label: "左半部分" },
          { from: "split", to: "recur_right", label: "右半部分" },
          { from: "recur_left", to: "merge_process", label: "有序左" },
          { from: "recur_right", to: "merge_process", label: "有序右" },
          { from: "merge_process", to: "output", label: "合并结果" },
        ],
        mermaidCode: `graph LR
    A[输入数组] --> B[拆分数组]
    B -->|左半部分| C[递归排序左半]
    B -->|右半部分| D[递归排序右半]
    C -->|有序左| E[合并有序数组]
    D -->|有序右| E
    E --> F[排序结果]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 10. DFS Tree Traversal (NEW)
  // ──────────────────────────────────────────────
  {
    id: "dfs-tree",
    title: "深度优先搜索",
    description: "递归实现树的深度优先遍历",
    category: "algorithm",
    language: "javascript",
    code: `function dfs(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  dfs(node.left, result);
  dfs(node.right, result);
  return result;
}

const tree = {
  value: 1,
  left: { value: 2, left: { value: 4 }, right: { value: 5 } },
  right: { value: 3, right: { value: 6 } },
};

const order = dfs(tree);`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "对二叉树进行前序深度优先遍历，输出节点值序列",
      executionSteps: [
        { stepNumber: 1, lineNumber: 15, description: "调用 dfs(tree)，根节点值为 1", variables: [{ name: "node", value: "{value:1}", type: "object", changed: true }, { name: "result", value: "[]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "节点不为 null，继续遍历", variables: [{ name: "node", value: "{value:1}", type: "object", changed: false }], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 3, description: "将节点值 1 推入 result", variables: [{ name: "result", value: "[1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 4, description: "递归遍历左子树 node.left，值为 2", variables: [{ name: "node", value: "{value:2}", type: "object", changed: true }], highlight: "function-call", annotation: "进入左子树" },
        { stepNumber: 5, lineNumber: 3, description: "将节点值 2 推入 result", variables: [{ name: "result", value: "[1,2]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 4, description: "递归遍历左子树的左子节点，值为 4", variables: [{ name: "node", value: "{value:4}", type: "object", changed: true }], highlight: "function-call" },
        { stepNumber: 7, lineNumber: 3, description: "将节点值 4 推入 result", variables: [{ name: "result", value: "[1,2,4]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 4, description: "节点 4 的左子节点为 null，返回", variables: [{ name: "node", value: "null", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 9, lineNumber: 5, description: "节点 4 的右子节点为 null，返回", variables: [{ name: "node", value: "null", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 10, lineNumber: 5, description: "回到节点 2，遍历右子树 node.right，值为 5", variables: [{ name: "node", value: "{value:5}", type: "object", changed: true }], highlight: "function-call", annotation: "进入右子树" },
      ],
      architecture: {
        nodes: [
          { id: "dfs", label: "dfs", type: "function", description: "深度优先搜索递归函数" },
          { id: "node", label: "node (当前节点)", type: "variable", description: "二叉树节点" },
          { id: "result", label: "result (结果数组)", type: "variable" },
        ],
        edges: [
          { from: "dfs", to: "node", label: "检查" },
          { from: "dfs", to: "result", label: "写入" },
          { from: "dfs", to: "dfs", label: "递归左子树" },
          { from: "dfs", to: "dfs", label: "递归右子树" },
        ],
        mermaidCode: `graph TD
    A[dfs] -->|检查| B["node (当前节点)"]
    A -->|写入| C["result (结果数组)"]
    A -->|递归左子树| A
    A -->|递归右子树| A
    B -->|为 null| D[返回 result]
    B -->|不为 null| E[推入节点值]`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "树根节点", type: "input" },
          { id: "visit", label: "访问当前节点", type: "process" },
          { id: "push", label: "记录节点值", type: "storage" },
          { id: "go_left", label: "遍历左子树", type: "process" },
          { id: "go_right", label: "遍历右子树", type: "process" },
          { id: "output", label: "遍历序列", type: "output" },
        ],
        edges: [
          { from: "input", to: "visit", label: "当前节点" },
          { from: "visit", to: "push", label: "节点值" },
          { from: "push", to: "go_left", label: "左子节点" },
          { from: "go_left", to: "visit", label: "递归" },
          { from: "go_left", to: "go_right", label: "左子树完成" },
          { from: "go_right", to: "visit", label: "递归" },
          { from: "go_right", to: "output", label: "遍历完成" },
        ],
        mermaidCode: `graph LR
    A[树根节点] --> B[访问当前节点]
    B --> C[记录节点值]
    C --> D[遍历左子树]
    D -->|递归| B
    D -->|左子树完成| E[遍历右子树]
    E -->|递归| B
    E -->|遍历完成| F[遍历序列]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 11. Singleton Pattern (NEW)
  // ──────────────────────────────────────────────
  {
    id: "singleton",
    title: "单例模式",
    description: "确保一个类只有一个实例并提供全局访问点",
    category: "pattern",
    language: "typescript",
    code: `class Database {
  private static instance: Database | null = null;
  private connection: string;

  private constructor(config: string) {
    this.connection = config;
  }

  static getInstance(config?: string): Database {
    if (!Database.instance) {
      Database.instance = new Database(config || "default");
    }
    return Database.instance;
  }
}

const db1 = Database.getInstance("prod-db");
const db2 = Database.getInstance("test-db");
console.log(db1 === db2);`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "typescript" },
      summary: "通过单例模式确保 Database 类只有一个实例",
      executionSteps: [
        { stepNumber: 1, lineNumber: 14, description: "调用 Database.getInstance('prod-db')", variables: [{ name: "config", value: "'prod-db'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 8, description: "检查 Database.instance 是否存在，为 null", variables: [{ name: "Database.instance", value: "null", type: "object", changed: false }], highlight: "branch-true" },
        { stepNumber: 3, lineNumber: 9, description: "创建新实例 new Database('prod-db')", variables: [{ name: "Database.instance", value: "Database{connection:'prod-db'}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 10, description: "返回 Database.instance，赋值给 db1", variables: [{ name: "db1", value: "Database{...}", type: "object", changed: true }], highlight: "return" },
        { stepNumber: 5, lineNumber: 15, description: "调用 Database.getInstance('test-db')", variables: [{ name: "config", value: "'test-db'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 8, description: "检查 Database.instance 是否存在，已有实例", variables: [{ name: "Database.instance", value: "Database{...}", type: "object", changed: false }], highlight: "branch-false" },
        { stepNumber: 7, lineNumber: 10, description: "直接返回已有实例，忽略 'test-db' 配置", variables: [{ name: "db2", value: "Database{...}", type: "object", changed: true }], highlight: "return", annotation: "返回同一实例" },
        { stepNumber: 8, lineNumber: 16, description: "比较 db1 === db2，结果为 true", variables: [{ name: "db1", value: "Database{...}", type: "object", changed: false }, { name: "db2", value: "Database{...}", type: "object", changed: false }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "db", label: "Database", type: "class", description: "数据库连接单例类" },
          { id: "instance", label: "static instance", type: "variable", description: "静态实例引用" },
          { id: "getInstance", label: "getInstance()", type: "function", description: "获取唯一实例" },
          { id: "constructor", label: "constructor", type: "function", description: "私有构造函数" },
        ],
        edges: [
          { from: "db", to: "getInstance", label: "静态方法" },
          { from: "db", to: "constructor", label: "私有" },
          { from: "getInstance", to: "instance", label: "检查/创建" },
          { from: "constructor", to: "instance", label: "初始化" },
        ],
        mermaidCode: `graph TD
    A[Database] -->|静态方法| B["getInstance()"]
    A -->|私有| C[constructor]
    B -->|检查/创建| D["static instance"]
    C -->|初始化| D
    B -->|返回| D`,
      },
      dataFlow: {
        nodes: [
          { id: "call", label: "调用 getInstance", type: "input" },
          { id: "check", label: "实例是否存在", type: "decision" },
          { id: "create", label: "创建新实例", type: "process" },
          { id: "return_existing", label: "返回已有实例", type: "output" },
          { id: "return_new", label: "返回新实例", type: "output" },
        ],
        edges: [
          { from: "call", to: "check" },
          { from: "check", to: "return_existing", label: "是" },
          { from: "check", to: "create", label: "否" },
          { from: "create", to: "return_new" },
        ],
        mermaidCode: `graph LR
    A[调用 getInstance] --> B{实例是否存在}
    B -->|是| C[返回已有实例]
    B -->|否| D[创建新实例]
    D --> E[返回新实例]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 12. Observer Pattern (NEW)
  // ──────────────────────────────────────────────
  {
    id: "observer",
    title: "观察者模式",
    description: "定义对象间一对多的依赖关系，状态变化时自动通知所有观察者",
    category: "pattern",
    language: "javascript",
    code: `class Subject {
  constructor() {
    this.observers = [];
  }
  subscribe(observer) {
    this.observers.push(observer);
  }
  notify(data) {
    this.observers.forEach(obs => obs.update(data));
  }
}

class Observer {
  constructor(name) {
    this.name = name;
  }
  update(data) {
    console.log(\`\${this.name} received: \${data}\`);
  }
}

const subject = new Subject();
const obs1 = new Observer("Observer A");
const obs2 = new Observer("Observer B");
subject.subscribe(obs1);
subject.subscribe(obs2);
subject.notify("Hello World");`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "实现观察者模式，主题对象通知所有订阅的观察者",
      executionSteps: [
        { stepNumber: 1, lineNumber: 22, description: "创建 Subject 实例 subject", variables: [{ name: "subject", value: "Subject{observers:[]}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 23, description: "创建 Observer 实例 obs1 'Observer A'", variables: [{ name: "obs1", value: "Observer{name:'Observer A'}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 3, lineNumber: 24, description: "创建 Observer 实例 obs2 'Observer B'", variables: [{ name: "obs2", value: "Observer{name:'Observer B'}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 25, description: "调用 subject.subscribe(obs1) 订阅观察者A", variables: [{ name: "subject.observers", value: "[obs1]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 26, description: "调用 subject.subscribe(obs2) 订阅观察者B", variables: [{ name: "subject.observers", value: "[obs1,obs2]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 6, lineNumber: 27, description: "调用 subject.notify('Hello World')", variables: [{ name: "data", value: "'Hello World'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 7, lineNumber: 8, description: "遍历 observers 数组，逐个调用 update", variables: [{ name: "subject.observers", value: "[obs1,obs2]", type: "array", changed: false }], highlight: "loop-start" },
        { stepNumber: 8, lineNumber: 8, description: "调用 obs1.update('Hello World')，输出日志", variables: [{ name: "obs1", value: "Observer A", type: "object", changed: false }], highlight: "normal" },
        { stepNumber: 9, lineNumber: 8, description: "调用 obs2.update('Hello World')，输出日志", variables: [{ name: "obs2", value: "Observer B", type: "object", changed: false }], highlight: "loop-end" },
      ],
      architecture: {
        nodes: [
          { id: "subject", label: "Subject", type: "class", description: "主题类，管理观察者" },
          { id: "observer", label: "Observer", type: "class", description: "观察者类" },
          { id: "subscribe", label: "subscribe()", type: "function", description: "订阅方法" },
          { id: "notify", label: "notify()", type: "function", description: "通知方法" },
          { id: "update", label: "update()", type: "function", description: "更新方法" },
        ],
        edges: [
          { from: "subject", to: "subscribe", label: "方法" },
          { from: "subject", to: "notify", label: "方法" },
          { from: "observer", to: "update", label: "方法" },
          { from: "subscribe", to: "observer", label: "注册" },
          { from: "notify", to: "update", label: "调用" },
        ],
        mermaidCode: `graph TD
    A[Subject] -->|方法| B["subscribe()"]
    A -->|方法| C["notify()"]
    D[Observer] -->|方法| E["update()"]
    B -->|注册| D
    C -->|调用| E`,
      },
      dataFlow: {
        nodes: [
          { id: "register", label: "注册观察者", type: "input" },
          { id: "observers_list", label: "观察者列表", type: "storage" },
          { id: "state_change", label: "状态变化", type: "process" },
          { id: "dispatch", label: "广播通知", type: "process" },
          { id: "observer_update", label: "观察者更新", type: "output" },
        ],
        edges: [
          { from: "register", to: "observers_list", label: "添加" },
          { from: "state_change", to: "dispatch", label: "触发" },
          { from: "dispatch", to: "observers_list", label: "读取" },
          { from: "dispatch", to: "observer_update", label: "逐个通知" },
        ],
        mermaidCode: `graph LR
    A[注册观察者] -->|添加| B[观察者列表]
    C[状态变化] -->|触发| D[广播通知]
    D -->|读取| B
    D -->|逐个通知| E[观察者更新]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 13. Factory Pattern (NEW)
  // ──────────────────────────────────────────────
  {
    id: "factory",
    title: "工厂模式",
    description: "通过工厂方法创建对象，隐藏实例化逻辑",
    category: "pattern",
    language: "typescript",
    code: `interface Shape {
  draw(): void;
}

class Circle implements Shape {
  constructor(public radius: number) {}
  draw() {
    console.log(\`Drawing circle with radius \${this.radius}\`);
  }
}

class Rectangle implements Shape {
  constructor(public width: number, public height: number) {}
  draw() {
    console.log(\`Drawing rect \${this.width}x\${this.height}\`);
  }
}

function createShape(type: string, ...args: number[]): Shape {
  switch (type) {
    case "circle":
      return new Circle(args[0]);
    case "rectangle":
      return new Rectangle(args[0], args[1]);
    default:
      throw new Error(\`Unknown shape: \${type}\`);
  }
}

const circle = createShape("circle", 5);
const rect = createShape("rectangle", 3, 4);
circle.draw();
rect.draw();`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "typescript" },
      summary: "通过工厂方法根据类型创建不同的图形对象",
      executionSteps: [
        { stepNumber: 1, lineNumber: 25, description: "调用 createShape('circle', 5)", variables: [{ name: "type", value: "'circle'", type: "string", changed: true }, { name: "args", value: "[5]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 18, description: "switch 匹配 case 'circle'", variables: [{ name: "type", value: "'circle'", type: "string", changed: false }], highlight: "branch-true" },
        { stepNumber: 3, lineNumber: 19, description: "创建 Circle 实例，radius = 5", variables: [{ name: "circle", value: "Circle{radius:5}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 26, description: "调用 createShape('rectangle', 3, 4)", variables: [{ name: "type", value: "'rectangle'", type: "string", changed: true }, { name: "args", value: "[3,4]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 20, description: "switch 匹配 case 'rectangle'", variables: [{ name: "type", value: "'rectangle'", type: "string", changed: false }], highlight: "branch-true" },
        { stepNumber: 6, lineNumber: 21, description: "创建 Rectangle 实例，width=3, height=4", variables: [{ name: "rect", value: "Rectangle{width:3,height:4}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 27, description: "调用 circle.draw()，输出绘制圆形", variables: [{ name: "circle", value: "Circle{radius:5}", type: "object", changed: false }], highlight: "function-call" },
        { stepNumber: 8, lineNumber: 28, description: "调用 rect.draw()，输出绘制矩形", variables: [{ name: "rect", value: "Rectangle{width:3,height:4}", type: "object", changed: false }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "factory", label: "createShape", type: "function", description: "工厂函数" },
          { id: "shape", label: "Shape (接口)", type: "module", description: "图形接口" },
          { id: "circle", label: "Circle", type: "class", description: "圆形类" },
          { id: "rectangle", label: "Rectangle", type: "class", description: "矩形类" },
        ],
        edges: [
          { from: "factory", to: "shape", label: "返回" },
          { from: "circle", to: "shape", label: "实现" },
          { from: "rectangle", to: "shape", label: "实现" },
          { from: "factory", to: "circle", label: "创建" },
          { from: "factory", to: "rectangle", label: "创建" },
        ],
        mermaidCode: `graph TD
    A[createShape 工厂] -->|创建| B[Circle]
    A -->|创建| C[Rectangle]
    B -->|实现| D["Shape 接口"]
    C -->|实现| D
    A -->|返回| D`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "类型 + 参数", type: "input" },
          { id: "switch", label: "类型判断", type: "decision" },
          { id: "create_circle", label: "创建圆形", type: "process" },
          { id: "create_rect", label: "创建矩形", type: "process" },
          { id: "output", label: "Shape 对象", type: "output" },
        ],
        edges: [
          { from: "input", to: "switch", label: "type" },
          { from: "switch", to: "create_circle", label: "circle" },
          { from: "switch", to: "create_rect", label: "rectangle" },
          { from: "create_circle", to: "output" },
          { from: "create_rect", to: "output" },
        ],
        mermaidCode: `graph LR
    A[类型 + 参数] -->|type| B{类型判断}
    B -->|circle| C[创建圆形]
    B -->|rectangle| D[创建矩形]
    C --> E[Shape 对象]
    D --> E`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 14. Async/Await (NEW)
  // ──────────────────────────────────────────────
  {
    id: "async-await",
    title: "Async/Await 顺序请求",
    description: "使用 async/await 按顺序执行多个异步请求",
    category: "async",
    language: "javascript",
    code: `async function fetchUserData(userId) {
  const profile = await fetch(\`/api/users/\${userId}\`);
  const profileData = await profile.json();

  const posts = await fetch(\`/api/users/\${userId}/posts\`);
  const postsData = await posts.json();

  return { profile: profileData, posts: postsData };
}

fetchUserData(42).then(data => console.log(data));`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "使用 async/await 顺序获取用户资料和文章列表",
      executionSteps: [
        { stepNumber: 1, lineNumber: 10, description: "调用 fetchUserData(42)", variables: [{ name: "userId", value: "42", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 2, description: "await fetch('/api/users/42')，等待响应", variables: [{ name: "userId", value: "42", type: "number", changed: false }], highlight: "normal", annotation: "异步等待，暂停执行" },
        { stepNumber: 3, lineNumber: 2, description: "收到 profile Response 对象", variables: [{ name: "profile", value: "Response{}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 3, description: "await profile.json()，解析用户资料", variables: [{ name: "profile", value: "Response{}", type: "object", changed: false }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 3, description: "获得 profileData = { name: 'Alice', age: 30 }", variables: [{ name: "profileData", value: '{"name":"Alice"}', type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 5, description: "await fetch('/api/users/42/posts')，等待响应", variables: [{ name: "posts", value: "Response{}", type: "object", changed: true }], highlight: "normal", annotation: "第二个异步请求" },
        { stepNumber: 7, lineNumber: 6, description: "await posts.json()，解析文章列表", variables: [{ name: "posts", value: "Response{}", type: "object", changed: false }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 6, description: "获得 postsData = [{ title: 'Hello' }]", variables: [{ name: "postsData", value: "[{title:'Hello'}]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 9, lineNumber: 8, description: "返回 { profile: profileData, posts: postsData }", variables: [{ name: "profileData", value: '{"name":"Alice"}', type: "object", changed: false }, { name: "postsData", value: "[{title:'Hello'}]", type: "array", changed: false }], highlight: "return" },
        { stepNumber: 10, lineNumber: 10, description: ".then 回调输出合并数据", variables: [{ name: "data", value: "{profile,posts}", type: "object", changed: true }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "fetchUserData", label: "fetchUserData", type: "function", description: "异步获取用户数据" },
          { id: "fetchProfile", label: "fetch 用户资料", type: "external" },
          { id: "fetchPosts", label: "fetch 文章列表", type: "external" },
          { id: "parseProfile", label: "解析 profile.json", type: "function" },
          { id: "parsePosts", label: "解析 posts.json", type: "function" },
        ],
        edges: [
          { from: "fetchUserData", to: "fetchProfile", label: "await" },
          { from: "fetchProfile", to: "parseProfile", label: "await" },
          { from: "fetchUserData", to: "fetchPosts", label: "await" },
          { from: "fetchPosts", to: "parsePosts", label: "await" },
          { from: "parseProfile", to: "fetchUserData", label: "返回数据" },
          { from: "parsePosts", to: "fetchUserData", label: "返回数据" },
        ],
        mermaidCode: `graph TD
    A[fetchUserData] -->|await| B["fetch 用户资料"]
    B -->|await| C["解析 profile.json"]
    C --> D["返回 profileData"]
    A -->|await| E["fetch 文章列表"]
    E -->|await| F["解析 posts.json"]
    F --> G["返回 postsData"]
    D --> H[合并返回]
    G --> H`,
      },
      dataFlow: {
        nodes: [
          { id: "userId", label: "用户 ID", type: "input" },
          { id: "req_profile", label: "请求用户资料", type: "process" },
          { id: "res_profile", label: "资料响应", type: "storage" },
          { id: "req_posts", label: "请求文章列表", type: "process" },
          { id: "res_posts", label: "文章响应", type: "storage" },
          { id: "merge", label: "合并数据", type: "process" },
          { id: "output", label: "返回结果", type: "output" },
        ],
        edges: [
          { from: "userId", to: "req_profile", label: "42" },
          { from: "req_profile", to: "res_profile", label: "Response" },
          { from: "userId", to: "req_posts", label: "42" },
          { from: "req_posts", to: "res_posts", label: "Response" },
          { from: "res_profile", to: "merge" },
          { from: "res_posts", to: "merge" },
          { from: "merge", to: "output" },
        ],
        mermaidCode: `graph LR
    A[用户 ID] -->|42| B[请求用户资料]
    A -->|42| C[请求文章列表]
    B --> D[资料响应]
    C --> E[文章响应]
    D --> F[合并数据]
    E --> F
    F --> G[返回结果]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 15. Race Condition (NEW)
  // ──────────────────────────────────────────────
  {
    id: "race-condition",
    title: "Promise.race 与 Promise.all",
    description: "展示 Promise 竞态和多任务并行处理的差异",
    category: "async",
    language: "javascript",
    code: `function delay(ms, value) {
  return new Promise(resolve => setTimeout(() => resolve(value), ms));
}

async function demo() {
  // Promise.race: 取最先完成的结果
  const fastest = await Promise.race([
    delay(300, "slow"),
    delay(100, "fast"),
    delay(200, "medium"),
  ]);
  console.log("race:", fastest);

  // Promise.all: 等待全部完成
  const results = await Promise.all([
    delay(100, "a"),
    delay(200, "b"),
    delay(300, "c"),
  ]);
  console.log("all:", results);
}

demo();`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "对比 Promise.race 和 Promise.all 的执行行为",
      executionSteps: [
        { stepNumber: 1, lineNumber: 7, description: "调用 demo()，开始异步演示", variables: [], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 10, description: "创建 3 个 delay Promise 同时启动", variables: [{ name: "delay(300)", value: "Pending", type: "promise", changed: true }, { name: "delay(100)", value: "Pending", type: "promise", changed: true }, { name: "delay(200)", value: "Pending", type: "promise", changed: true }], highlight: "normal", annotation: "3 个定时器同时开始" },
        { stepNumber: 3, lineNumber: 10, description: "Promise.race 等待最快完成的 Promise", variables: [{ name: "fastest", value: "Pending", type: "string", changed: false }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 10, description: "delay(100) 最先完成，resolve('fast')", variables: [{ name: "fastest", value: "'fast'", type: "string", changed: true }], highlight: "normal" },
        { stepNumber: 5, lineNumber: 15, description: "console.log('race: fast')，输出竞速结果", variables: [{ name: "fastest", value: "'fast'", type: "string", changed: false }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 18, description: "创建 3 个新的 delay Promise 同时启动", variables: [{ name: "delay(100)", value: "Pending", type: "promise", changed: true }, { name: "delay(200)", value: "Pending", type: "promise", changed: true }, { name: "delay(300)", value: "Pending", type: "promise", changed: true }], highlight: "normal", annotation: "3 个新定时器同时开始" },
        { stepNumber: 7, lineNumber: 18, description: "Promise.all 等待全部 Promise 完成", variables: [{ name: "results", value: "Pending", type: "array", changed: false }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 18, description: "delay(100) 完成，results 中记录 'a'", variables: [{ name: "results[0]", value: "'a'", type: "string", changed: true }], highlight: "normal" },
        { stepNumber: 9, lineNumber: 18, description: "delay(200) 完成，results 中记录 'b'", variables: [{ name: "results[1]", value: "'b'", type: "string", changed: true }], highlight: "normal" },
        { stepNumber: 10, lineNumber: 18, description: "delay(300) 完成，results = ['a', 'b', 'c']，全部就绪", variables: [{ name: "results", value: "['a','b','c']", type: "array", changed: true }], highlight: "normal" },
      ],
      architecture: {
        nodes: [
          { id: "demo", label: "demo", type: "function", description: "异步演示函数" },
          { id: "delay", label: "delay", type: "function", description: "延迟 Promise 工厂" },
          { id: "race", label: "Promise.race", type: "function", description: "竞速选择" },
          { id: "all", label: "Promise.all", type: "function", description: "全部等待" },
        ],
        edges: [
          { from: "demo", to: "delay", label: "创建" },
          { from: "demo", to: "race", label: "调用" },
          { from: "demo", to: "all", label: "调用" },
          { from: "delay", to: "race", label: "传入" },
          { from: "delay", to: "all", label: "传入" },
        ],
        mermaidCode: `graph TD
    A[demo] -->|创建| B[delay]
    B -->|传入| C["Promise.race"]
    B -->|传入| D["Promise.all"]
    A -->|调用| C
    A -->|调用| D
    C -->|最先完成| E["返回最快结果"]
    D -->|全部完成| F["返回结果数组"]`,
      },
      dataFlow: {
        nodes: [
          { id: "promises", label: "Promise 集合", type: "input" },
          { id: "race_gate", label: "竞速门", type: "decision" },
          { id: "fastest", label: "最快结果", type: "output" },
          { id: "all_gate", label: "全部完成门", type: "process" },
          { id: "all_results", label: "结果数组", type: "output" },
        ],
        edges: [
          { from: "promises", to: "race_gate", label: "同时启动" },
          { from: "race_gate", to: "fastest", label: "第一个 resolve" },
          { from: "promises", to: "all_gate", label: "同时启动" },
          { from: "all_gate", to: "all_results", label: "全部 resolve" },
        ],
        mermaidCode: `graph LR
    A[Promise 集合] -->|同时启动| B{竞速门}
    B -->|第一个 resolve| C[最快结果]
    A -->|同时启动| D[全部完成门]
    D -->|全部 resolve| E[结果数组]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 16. Linked List (NEW)
  // ──────────────────────────────────────────────
  {
    id: "linked-list",
    title: "链表实现",
    description: "带有头节点和尾指针的单向链表数据结构",
    category: "data-structure",
    language: "javascript",
    code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.size = 0;
  }

  append(value) {
    const node = new Node(value);
    if (!this.head) {
      this.head = node;
    } else {
      let current = this.head;
      while (current.next) {
        current = current.next;
      }
      current.next = node;
    }
    this.size++;
  }

  toArray() {
    const arr = [];
    let current = this.head;
    while (current) {
      arr.push(current.value);
      current = current.next;
    }
    return arr;
  }
}

const list = new LinkedList();
list.append(10);
list.append(20);
list.append(30);
console.log(list.toArray());`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "javascript" },
      summary: "实现链表数据结构，支持追加和转换为数组",
      executionSteps: [
        { stepNumber: 1, lineNumber: 35, description: "创建 LinkedList 实例 list", variables: [{ name: "list", value: "LinkedList{head:null,size:0}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 36, description: "调用 list.append(10)", variables: [{ name: "value", value: "10", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 3, lineNumber: 12, description: "创建 Node(10)，head 为 null，直接设为 head", variables: [{ name: "list.head", value: "Node{value:10,next:null}", type: "object", changed: true }, { name: "list.size", value: "1", type: "number", changed: true }], highlight: "branch-true" },
        { stepNumber: 4, lineNumber: 37, description: "调用 list.append(20)", variables: [{ name: "value", value: "20", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 15, description: "head 不为 null，遍历找到尾节点", variables: [{ name: "current", value: "Node{value:10}", type: "object", changed: true }], highlight: "branch-false" },
        { stepNumber: 6, lineNumber: 18, description: "尾节点的 next 指向 Node(20)", variables: [{ name: "list.head.next", value: "Node{value:20,next:null}", type: "object", changed: true }, { name: "list.size", value: "2", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 38, description: "调用 list.append(30)", variables: [{ name: "value", value: "30", type: "number", changed: true }], highlight: "function-call" },
        { stepNumber: 8, lineNumber: 16, description: "遍历链表，current 从 head 移到 tail", variables: [{ name: "current", value: "Node{value:20}", type: "object", changed: true }], highlight: "loop-start" },
        { stepNumber: 9, lineNumber: 18, description: "尾节点 next 指向 Node(30)，size=3", variables: [{ name: "list.size", value: "3", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 10, lineNumber: 39, description: "调用 list.toArray()，返回 [10, 20, 30]", variables: [{ name: "arr", value: "[10,20,30]", type: "array", changed: true }], highlight: "return" },
      ],
      architecture: {
        nodes: [
          { id: "ll", label: "LinkedList", type: "class", description: "链表类" },
          { id: "node", label: "Node", type: "class", description: "节点类" },
          { id: "head", label: "head", type: "variable", description: "头指针" },
          { id: "append", label: "append()", type: "function" },
          { id: "toArray", label: "toArray()", type: "function" },
        ],
        edges: [
          { from: "ll", to: "head", label: "属性" },
          { from: "ll", to: "append", label: "方法" },
          { from: "ll", to: "toArray", label: "方法" },
          { from: "append", to: "node", label: "创建" },
          { from: "node", to: "node", label: "next" },
        ],
        mermaidCode: `graph TD
    A[LinkedList] -->|属性| B[head]
    A -->|方法| C["append()"]
    A -->|方法| D["toArray()"]
    C -->|创建| E[Node]
    E -->|next| E`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "追加值", type: "input" },
          { id: "create_node", label: "创建节点", type: "process" },
          { id: "find_tail", label: "找到尾节点", type: "process" },
          { id: "link", label: "链接节点", type: "process" },
          { id: "traverse", label: "遍历链表", type: "process" },
          { id: "output", label: "数组结果", type: "output" },
        ],
        edges: [
          { from: "input", to: "create_node", label: "value" },
          { from: "create_node", to: "find_tail" },
          { from: "find_tail", to: "link", label: "tail.next" },
          { from: "link", to: "traverse" },
          { from: "traverse", to: "output", label: "收集值" },
        ],
        mermaidCode: `graph LR
    A[追加值] -->|value| B[创建节点]
    B --> C[找到尾节点]
    C -->|tail.next| D[链接节点]
    D --> E[遍历链表]
    E -->|收集值| F[数组结果]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 17. Queue (NEW)
  // ──────────────────────────────────────────────
  {
    id: "queue",
    title: "队列实现",
    description: "先进先出数据结构的 TypeScript 实现",
    category: "data-structure",
    language: "typescript",
    code: `class Queue<T> {
  private items: T[] = [];

  enqueue(item: T): void {
    this.items.push(item);
  }

  dequeue(): T | undefined {
    return this.items.shift();
  }

  peek(): T | undefined {
    return this.items[0];
  }

  get size(): number {
    return this.items.length;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }
}

const queue = new Queue<string>();
queue.enqueue("first");
queue.enqueue("second");
queue.enqueue("third");
console.log(queue.dequeue()); // "first"
console.log(queue.peek());   // "second"
console.log(queue.size);     // 2`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "typescript" },
      summary: "实现泛型队列数据结构，支持入队、出队、查看等操作",
      executionSteps: [
        { stepNumber: 1, lineNumber: 21, description: "创建 Queue 实例，泛型为 string", variables: [{ name: "queue", value: "Queue{items:[]}", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 2, lineNumber: 22, description: "调用 queue.enqueue('first')", variables: [{ name: "item", value: "'first'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 3, lineNumber: 3, description: "将 'first' 压入 items，items=['first']", variables: [{ name: "items", value: "['first']", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 23, description: "调用 queue.enqueue('second')", variables: [{ name: "item", value: "'second'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 5, lineNumber: 3, description: "将 'second' 压入 items，items=['first','second']", variables: [{ name: "items", value: "['first','second']", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 24, description: "调用 queue.enqueue('third')", variables: [{ name: "item", value: "'third'", type: "string", changed: true }], highlight: "function-call" },
        { stepNumber: 7, lineNumber: 3, description: "将 'third' 压入 items，items=['first','second','third']", variables: [{ name: "items", value: "['first','second','third']", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 8, lineNumber: 25, description: "调用 queue.dequeue()，移除队首", variables: [{ name: "items", value: "['first','second','third']", type: "array", changed: false }], highlight: "function-call" },
        { stepNumber: 9, lineNumber: 6, description: "返回 'first'，items=['second','third']", variables: [{ name: "items", value: "['second','third']", type: "array", changed: true }], highlight: "return" },
        { stepNumber: 10, lineNumber: 26, description: "调用 queue.peek()，查看队首", variables: [{ name: "items", value: "['second','third']", type: "array", changed: false }], highlight: "function-call" },
      ],
      architecture: {
        nodes: [
          { id: "queue", label: "Queue<T>", type: "class", description: "泛型队列类" },
          { id: "enqueue", label: "enqueue()", type: "function", description: "入队操作" },
          { id: "dequeue", label: "dequeue()", type: "function", description: "出队操作" },
          { id: "peek", label: "peek()", type: "function", description: "查看队首" },
          { id: "items", label: "items", type: "variable", description: "内部数组存储" },
        ],
        edges: [
          { from: "queue", to: "enqueue", label: "方法" },
          { from: "queue", to: "dequeue", label: "方法" },
          { from: "queue", to: "peek", label: "方法" },
          { from: "enqueue", to: "items", label: "尾部推入" },
          { from: "dequeue", to: "items", label: "头部移除" },
          { from: "peek", to: "items", label: "只读首元素" },
        ],
        mermaidCode: `graph TD
    A["Queue<T>"] -->|方法| B["enqueue()"]
    A -->|方法| C["dequeue()"]
    A -->|方法| D["peek()"]
    B -->|尾部推入| E[items]
    C -->|头部移除| E
    D -->|只读| E`,
      },
      dataFlow: {
        nodes: [
          { id: "enqueue_input", label: "入队元素", type: "input" },
          { id: "queue_store", label: "队列存储", type: "storage" },
          { id: "dequeue_output", label: "出队元素", type: "output" },
          { id: "peek_output", label: "查看队首", type: "output" },
        ],
        edges: [
          { from: "enqueue_input", to: "queue_store", label: "尾部入队" },
          { from: "queue_store", to: "dequeue_output", label: "头部出队" },
          { from: "queue_store", to: "peek_output", label: "查看" },
        ],
        mermaidCode: `graph LR
    A[入队元素] -->|尾部入队| B[队列存储]
    B -->|头部出队| C[出队元素]
    B -->|查看| D[查看队首]`,
      },
    },
  },

  // ──────────────────────────────────────────────
  // 18. Binary Tree Traversal (NEW)
  // ──────────────────────────────────────────────
  {
    id: "binary-tree",
    title: "二叉树遍历",
    description: "Python 实现二叉树的层序遍历（BFS）",
    category: "data-structure",
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
    result = []
    queue = deque([root])
    while queue:
        level_size = len(queue)
        level = []
        for _ in range(level_size):
            node = queue.popleft()
            level.append(node.val)
            if node.left:
                queue.append(node.left)
            if node.right:
                queue.append(node.right)
        result.append(level)
    return result

#        1
#      /   \\
#     2     3
#    / \\   /
#   4   5 6
root = TreeNode(1,
    TreeNode(2, TreeNode(4), TreeNode(5)),
    TreeNode(3, TreeNode(6), None))
print(level_order(root))`,
    preAnalyzed: {
      success: true,
      codeInput: { code: "", language: "python" },
      summary: "使用 BFS 层序遍历二叉树，按层输出节点值",
      executionSteps: [
        { stepNumber: 1, lineNumber: 8, description: "调用 level_order(root)，根节点值为 1", variables: [{ name: "root", value: "TreeNode{val:1}", type: "object", changed: true }, { name: "result", value: "[]", type: "array", changed: true }], highlight: "function-call" },
        { stepNumber: 2, lineNumber: 9, description: "root 不为 None，继续执行", variables: [{ name: "root", value: "TreeNode{val:1}", type: "object", changed: false }], highlight: "branch-false" },
        { stepNumber: 3, lineNumber: 11, description: "初始化 queue = deque([root])", variables: [{ name: "queue", value: "deque([TreeNode{val:1}])", type: "object", changed: true }], highlight: "normal" },
        { stepNumber: 4, lineNumber: 12, description: "进入 while 循环，queue 不为空", variables: [{ name: "queue", value: "deque([TreeNode{val:1}])", type: "object", changed: false }], highlight: "loop-start" },
        { stepNumber: 5, lineNumber: 13, description: "level_size = 1，开始处理第一层", variables: [{ name: "level_size", value: "1", type: "number", changed: true }], highlight: "normal" },
        { stepNumber: 6, lineNumber: 15, description: "弹出 node(1)，level=[1]", variables: [{ name: "node", value: "TreeNode{val:1}", type: "object", changed: true }, { name: "level", value: "[1]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 7, lineNumber: 17, description: "node.left(2) 存在，加入 queue", variables: [{ name: "queue", value: "deque([TreeNode{val:2}])", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 8, lineNumber: 19, description: "node.right(3) 存在，加入 queue", variables: [{ name: "queue", value: "deque([TreeNode{val:2},TreeNode{val:3}])", type: "object", changed: true }], highlight: "branch-true" },
        { stepNumber: 9, lineNumber: 20, description: "第一层完成，result.append([1])", variables: [{ name: "result", value: "[[1]]", type: "array", changed: true }], highlight: "normal" },
        { stepNumber: 10, lineNumber: 12, description: "第二轮循环，处理第二层节点 2 和 3", variables: [{ name: "queue", value: "deque([TreeNode{val:2},TreeNode{val:3}])", type: "object", changed: false }, { name: "level_size", value: "2", type: "number", changed: true }], highlight: "loop-start", annotation: "开始处理第二层" },
      ],
      architecture: {
        nodes: [
          { id: "lot", label: "level_order", type: "function", description: "层序遍历函数" },
          { id: "root", label: "root (根节点)", type: "variable" },
          { id: "queue", label: "queue (队列)", type: "variable", description: "BFS 辅助队列" },
          { id: "result", label: "result (结果)", type: "variable" },
        ],
        edges: [
          { from: "lot", to: "root", label: "接收" },
          { from: "lot", to: "queue", label: "初始化" },
          { from: "lot", to: "result", label: "写入" },
          { from: "queue", to: "queue", label: "子节点入队" },
        ],
        mermaidCode: `graph TD
    A[level_order] -->|接收| B["root (根节点)"]
    A -->|初始化| C["queue (队列)"]
    A -->|写入| D["result (结果)"]
    C -->|子节点入队| C
    C -->|出队| E[处理节点]
    E --> D`,
      },
      dataFlow: {
        nodes: [
          { id: "input", label: "根节点", type: "input" },
          { id: "init_queue", label: "初始化队列", type: "process" },
          { id: "dequeue", label: "出队节点", type: "process" },
          { id: "enqueue_children", label: "子节点入队", type: "process" },
          { id: "record_level", label: "记录层级", type: "storage" },
          { id: "output", label: "层序结果", type: "output" },
        ],
        edges: [
          { from: "input", to: "init_queue", label: "root" },
          { from: "init_queue", to: "dequeue", label: "队列" },
          { from: "dequeue", to: "enqueue_children", label: "当前节点" },
          { from: "enqueue_children", to: "dequeue", label: "更新队列" },
          { from: "dequeue", to: "record_level", label: "节点值" },
          { from: "record_level", to: "output", label: "层级完成" },
        ],
        mermaidCode: `graph LR
    A[根节点] -->|root| B[初始化队列]
    B -->|队列| C[出队节点]
    C -->|当前节点| D[子节点入队]
    D -->|更新队列| C
    C -->|节点值| E[记录层级]
    E -->|层级完成| F[层序结果]`,
      },
    },
  },
];
