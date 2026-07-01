import { Language } from "@/types";

export interface CodeTemplate {
  id: string;
  title: string;
  description: string;
  language: Language;
  code: string;
  icon: string; // emoji or short text
}

export const CODE_TEMPLATES: CodeTemplate[] = [
  {
    id: "binary-search",
    title: "二分查找",
    description: "经典算法：有序数组中查找目标值",
    language: "javascript",
    icon: "🔍",
    code: `function binarySearch(arr, target) {
  let left = 0;
  let right = arr.length - 1;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) {
      return mid;
    } else if (arr[mid] < target) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return -1;
}

const result = binarySearch([1, 3, 5, 7, 9, 11], 7);
console.log(result);`,
  },
  {
    id: "fibonacci",
    title: "斐波那契",
    description: "递归 + 记忆化优化的经典示例",
    language: "javascript",
    icon: "🌀",
    code: `function fibonacci(n, memo = {}) {
  if (n <= 1) return n;
  if (memo[n]) return memo[n];
  memo[n] = fibonacci(n - 1, memo) + fibonacci(n - 2, memo);
  return memo[n];
}

const result = fibonacci(10);
console.log(result);`,
  },
  {
    id: "bubble-sort",
    title: "冒泡排序",
    description: "最直观的排序算法演示",
    language: "javascript",
    icon: "🫧",
    code: `function bubbleSort(arr) {
  const n = arr.length;
  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

const result = bubbleSort([64, 34, 25, 12, 22, 11, 90]);
console.log(result);`,
  },
  {
    id: "promise-chain",
    title: "Promise 链",
    description: "异步编程：Promise 链式调用",
    language: "javascript",
    icon: "🔗",
    code: `function fetchUser(id) {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ id, name: "User" + id }), 100);
  });
}

fetchUser(1)
  .then(user => {
    console.log("用户:", user);
    return fetchUser(2);
  })
  .then(user2 => {
    console.log("用户2:", user2);
  });`,
  },
  {
    id: "observer-pattern",
    title: "观察者模式",
    description: "设计模式：发布-订阅实现",
    language: "javascript",
    icon: "👁️",
    code: `class EventEmitter {
  constructor() {
    this.events = {};
  }

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
emitter.on("greet", (name) => console.log("Hello, " + name));
emitter.emit("greet", "World");`,
  },
  {
    id: "tree-traversal",
    title: "二叉树遍历",
    description: "前序遍历二叉树的递归实现",
    language: "javascript",
    icon: "🌳",
    code: `function preorder(node) {
  if (!node) return;
  console.log(node.value);
  preorder(node.left);
  preorder(node.right);
}

const root = {
  value: 1,
  left: { value: 2, left: null, right: null },
  right: { value: 3, left: null, right: null }
};

preorder(root);`,
  },
];
