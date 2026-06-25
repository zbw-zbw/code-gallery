(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,85149,e=>{"use strict";let a=`function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,t={python:[/^(import |from \S+ import|def |class |print\()/m,/:\s*$/m,/^(if |elif |else:|for |while |try:|except)/m],typescript:[/:\s*(string|number|boolean|any|unknown|never|interface |type )/,/^(const |let |var ).+:\s*\w+/m],java:[/public\s+(class|static|void)/m,/System\.out/,/^(import java\.|class )/m],go:[/^(package |func |import \()/m,/fmt\./,/:=/],rust:[/^(fn |use |let mut |impl |pub |struct |enum )/m,/println!\(/,/->\s*\w+/],cpp:[/#include\s*</,/std::/,/cout\s*<</,/^(int |void |class |namespace )/m],javascript:[/^(const |let |var |function |=>|console\.log)/m,/^(async |await |export |import )/m]},r=[{title:"冒泡排序",language:"javascript",code:`function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}

bubbleSort([5, 3, 8, 1, 4]);`},{title:"斐波那契递归",language:"python",code:`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(5)
print(result)`},{title:"API 数据获取",language:"typescript",code:`async function fetchUserData(userId: string) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return {
    name: data.name,
    email: data.email,
    age: data.age
  };
}

fetchUserData("123");`}];e.s(["BUBBLE_SORT_CODE",0,a,"EXAMPLE_CODES",0,r,"FEATURES",0,[{icon:"🎬",title:"执行流程动画",description:"粘贴代码，AI 逐步还原执行过程。变量变化、数据流动、循环过程一目了然"},{icon:"🏗️",title:"架构图生成",description:"自动分析函数调用关系和模块依赖，生成可交互的架构图"},{icon:"📎",title:"可嵌入图解",description:"导出为图片或 iframe 嵌入代码，直接插入技术博客"}],"HOW_IT_WORKS_STEPS",0,[{number:1,title:"粘贴代码",description:"支持 JavaScript、Python、Java 等主流语言"},{number:2,title:"AI 分析",description:"DeepSeek 深度理解代码逻辑和执行流程"},{number:3,title:"查看图解",description:"执行动画、架构图、数据流，可导出分享"}],"PAIN_POINTS",0,[{emoji:"🧠",title:"脑中编译太慢",description:"面对陌生代码，要在脑中模拟执行：变量怎么变、循环几次——平均花15分钟才能理清"},{emoji:"📝",title:"图解做不动",description:"想给博客配代码动画，手动画图30分钟起步，还不一定画得准"},{emoji:"🔄",title:"Review 太痛苦",description:"200行代码逐行读，不知道整体结构，2小时后：这啥？"}],"SUPPORTED_LANGUAGES",0,[{value:"javascript",label:"JavaScript",color:"#f7df1e"},{value:"typescript",label:"TypeScript",color:"#3178c6"},{value:"python",label:"Python",color:"#3776ab"},{value:"java",label:"Java",color:"#b07219"},{value:"go",label:"Go",color:"#00add8"},{value:"rust",label:"Rust",color:"#dea584"},{value:"cpp",label:"C++",color:"#f34b7d"}],"detectLanguage",0,function(e){for(let[a,r]of Object.entries(t))if(r.some(a=>a.test(e)))return a;return"javascript"}])},86046,e=>{"use strict";let a=[{id:"bubble-sort",title:"冒泡排序",description:"经典排序算法，逐步比较相邻元素并交换",category:"algorithm",language:"javascript",code:`function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
bubbleSort([5, 3, 8, 1, 4]);`,preAnalyzed:{success:!0,codeInput:{code:"",language:"javascript"},summary:"对数组进行冒泡排序，升序排列",executionSteps:[{stepNumber:1,lineNumber:1,description:"调用 bubbleSort，传入数组 [5, 3, 8, 1, 4]",variables:[{name:"arr",value:"[5,3,8,1,4]",type:"array",changed:!0}],highlight:"function-call"},{stepNumber:2,lineNumber:2,description:"外层循环开始，i = 0",variables:[{name:"arr",value:"[5,3,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!0}],highlight:"loop-start"},{stepNumber:3,lineNumber:3,description:"内层循环开始，j = 0",variables:[{name:"arr",value:"[5,3,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"0",type:"number",changed:!0}],highlight:"loop-start"},{stepNumber:4,lineNumber:4,description:"比较 arr[0]=5 和 arr[1]=3，5 > 3 为 true",variables:[{name:"arr",value:"[5,3,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"0",type:"number",changed:!1}],highlight:"branch-true"},{stepNumber:5,lineNumber:5,description:"交换 arr[0] 和 arr[1]，数组变为 [3, 5, 8, 1, 4]",variables:[{name:"arr",value:"[3,5,8,1,4]",type:"array",changed:!0},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"0",type:"number",changed:!1}],highlight:"normal"},{stepNumber:6,lineNumber:3,description:"内层循环继续，j = 1",variables:[{name:"arr",value:"[3,5,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"1",type:"number",changed:!0}],highlight:"normal"},{stepNumber:7,lineNumber:4,description:"比较 arr[1]=5 和 arr[2]=8，5 > 8 为 false",variables:[{name:"arr",value:"[3,5,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"1",type:"number",changed:!1}],highlight:"branch-false"},{stepNumber:8,lineNumber:3,description:"内层循环继续，j = 2",variables:[{name:"arr",value:"[3,5,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"2",type:"number",changed:!0}],highlight:"normal"},{stepNumber:9,lineNumber:4,description:"比较 arr[2]=8 和 arr[3]=1，8 > 1 为 true",variables:[{name:"arr",value:"[3,5,8,1,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"2",type:"number",changed:!1}],highlight:"branch-true"},{stepNumber:10,lineNumber:5,description:"交换 arr[2] 和 arr[3]，数组变为 [3, 5, 1, 8, 4]",variables:[{name:"arr",value:"[3,5,1,8,4]",type:"array",changed:!0},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"2",type:"number",changed:!1}],highlight:"normal"},{stepNumber:11,lineNumber:3,description:"内层循环继续，j = 3",variables:[{name:"arr",value:"[3,5,1,8,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"3",type:"number",changed:!0}],highlight:"normal"},{stepNumber:12,lineNumber:4,description:"比较 arr[3]=8 和 arr[4]=4，8 > 4 为 true",variables:[{name:"arr",value:"[3,5,1,8,4]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"3",type:"number",changed:!1}],highlight:"branch-true"},{stepNumber:13,lineNumber:5,description:"交换 arr[3] 和 arr[4]，数组变为 [3, 5, 1, 4, 8]",variables:[{name:"arr",value:"[3,5,1,4,8]",type:"array",changed:!0},{name:"i",value:"0",type:"number",changed:!1},{name:"j",value:"3",type:"number",changed:!1}],highlight:"normal"},{stepNumber:14,lineNumber:2,description:"第一轮排序完成，最大值 8 已就位",variables:[{name:"arr",value:"[3,5,1,4,8]",type:"array",changed:!1},{name:"i",value:"0",type:"number",changed:!1}],highlight:"loop-end",annotation:"后续轮次继续排序剩余元素"},{stepNumber:15,lineNumber:7,description:"排序完成，返回 [1, 3, 4, 5, 8]",variables:[{name:"arr",value:"[1,3,4,5,8]",type:"array",changed:!0}],highlight:"return"}],architecture:{nodes:[{id:"bubbleSort",label:"bubbleSort",type:"function",description:"冒泡排序主函数"},{id:"arr",label:"arr (参数)",type:"variable"},{id:"i",label:"i (循环变量)",type:"variable"},{id:"j",label:"j (循环变量)",type:"variable"}],edges:[{from:"bubbleSort",to:"arr",label:"接收参数"},{from:"bubbleSort",to:"i",label:"初始化"},{from:"i",to:"j",label:"控制"}],mermaidCode:`graph TD
    A[bubbleSort] -->|接收参数| B["arr (参数)"]
    A -->|初始化| C["i (循环变量)"]
    C -->|控制| D["j (循环变量)"]
    D -->|比较| E{"arr[j] > arr[j+1]"}
    E -->|是| F[交换元素]
    E -->|否| D
    F --> D`},dataFlow:{nodes:[{id:"input",label:"输入数组",type:"input"},{id:"compare",label:"比较相邻元素",type:"decision"},{id:"swap",label:"交换位置",type:"process"},{id:"next",label:"下一个元素",type:"process"},{id:"output",label:"排序结果",type:"output"}],edges:[{from:"input",to:"compare",label:"传入数组"},{from:"compare",to:"swap",label:"需要交换"},{from:"swap",to:"next",label:"继续"},{from:"compare",to:"next",label:"无需交换"},{from:"next",to:"compare",label:"下一对"},{from:"next",to:"output",label:"排序完成"}],mermaidCode:`graph LR
    A[输入数组] --> B{比较相邻元素}
    B -->|需要交换| C[交换位置]
    B -->|无需交换| D[下一个元素]
    C --> D
    D --> B
    D --> E[排序结果]`}}},{id:"fibonacci",title:"斐波那契递归",description:"经典递归算法，展示递归调用栈",category:"algorithm",language:"python",code:`def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)

result = fibonacci(5)
print(result)`,preAnalyzed:{success:!0,codeInput:{code:"",language:"python"},summary:"递归计算第 N 个斐波那契数",executionSteps:[{stepNumber:1,lineNumber:7,description:"调用 fibonacci(5)",variables:[{name:"n",value:"5",type:"number",changed:!0}],highlight:"function-call"},{stepNumber:2,lineNumber:2,description:"判断 n=5, 5 <= 1 为 false",variables:[{name:"n",value:"5",type:"number",changed:!1}],highlight:"branch-false"},{stepNumber:3,lineNumber:4,description:"递归调用 fibonacci(4) + fibonacci(3)",variables:[{name:"n",value:"5",type:"number",changed:!1}],highlight:"function-call",annotation:"进入递归分支"},{stepNumber:4,lineNumber:2,description:"fibonacci(4): 判断 4 <= 1 为 false",variables:[{name:"n",value:"4",type:"number",changed:!0}],highlight:"branch-false"},{stepNumber:5,lineNumber:4,description:"fibonacci(4): 递归调用 fibonacci(3) + fibonacci(2)",variables:[{name:"n",value:"4",type:"number",changed:!1}],highlight:"function-call"},{stepNumber:6,lineNumber:2,description:"fibonacci(3): 判断 3 <= 1 为 false",variables:[{name:"n",value:"3",type:"number",changed:!0}],highlight:"branch-false"},{stepNumber:7,lineNumber:4,description:"fibonacci(3): 递归调用 fibonacci(2) + fibonacci(1)",variables:[{name:"n",value:"3",type:"number",changed:!1}],highlight:"function-call"},{stepNumber:8,lineNumber:3,description:"fibonacci(1): 判断 1 <= 1 为 true，返回 1",variables:[{name:"n",value:"1",type:"number",changed:!0}],highlight:"branch-true"},{stepNumber:9,lineNumber:2,description:"fibonacci(2): 判断 2 <= 1 为 false",variables:[{name:"n",value:"2",type:"number",changed:!0}],highlight:"branch-false"},{stepNumber:10,lineNumber:3,description:"fibonacci(0): 判断 0 <= 1 为 true，返回 0",variables:[{name:"n",value:"0",type:"number",changed:!0}],highlight:"branch-true"},{stepNumber:11,lineNumber:3,description:"fibonacci(1): 返回 1（基础情况）",variables:[{name:"n",value:"1",type:"number",changed:!1}],highlight:"return"},{stepNumber:12,lineNumber:7,description:"fibonacci(5) = 5，赋值给 result",variables:[{name:"result",value:"5",type:"number",changed:!0}],highlight:"normal"}],architecture:{nodes:[{id:"fib",label:"fibonacci",type:"function",description:"递归计算斐波那契数"},{id:"base",label:"基础情况 (n<=1)",type:"function"},{id:"recur",label:"递归分支",type:"function"}],edges:[{from:"fib",to:"base",label:"n <= 1"},{from:"fib",to:"recur",label:"n > 1"},{from:"recur",to:"fib",label:"递归调用"}],mermaidCode:`graph TD
    A[fibonacci] -->|n <= 1| B["基础情况 (n<=1)"]
    A -->|n > 1| C[递归分支]
    C -->|fib(n-1)| A
    C -->|fib(n-2)| A
    B --> D[返回 n]`},dataFlow:{nodes:[{id:"input",label:"参数 n",type:"input"},{id:"check",label:"判断 n<=1",type:"decision"},{id:"return_n",label:"返回 n",type:"output"},{id:"recur",label:"递归分解",type:"process"},{id:"sum",label:"求和返回",type:"output"}],edges:[{from:"input",to:"check"},{from:"check",to:"return_n",label:"是"},{from:"check",to:"recur",label:"否"},{from:"recur",to:"sum",label:"递归结果"}],mermaidCode:`graph LR
    A[参数 n] --> B{判断 n<=1}
    B -->|是| C[返回 n]
    B -->|否| D[递归分解]
    D --> E[求和返回]`}}},{id:"binary-search",title:"二分查找",description:"在有序数组中高效查找目标值",category:"algorithm",language:"typescript",code:`function binarySearch(arr: number[], target: number): number {
  let left = 0, right = arr.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] === target) return mid;
    if (arr[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}
binarySearch([1,3,5,7,9,11,13], 7);`,preAnalyzed:{success:!0,codeInput:{code:"",language:"typescript"},summary:"在有序数组中使用二分查找定位目标值",executionSteps:[{stepNumber:1,lineNumber:9,description:"调用 binarySearch，目标值 7",variables:[{name:"arr",value:"[1,3,5,7,9,11,13]",type:"array",changed:!0},{name:"target",value:"7",type:"number",changed:!0}],highlight:"function-call"},{stepNumber:2,lineNumber:2,description:"初始化 left=0, right=6",variables:[{name:"arr",value:"[1,3,5,7,9,11,13]",type:"array",changed:!1},{name:"target",value:"7",type:"number",changed:!1},{name:"left",value:"0",type:"number",changed:!0},{name:"right",value:"6",type:"number",changed:!0}],highlight:"normal"},{stepNumber:3,lineNumber:3,description:"进入循环，left(0) <= right(6)",variables:[{name:"left",value:"0",type:"number",changed:!1},{name:"right",value:"6",type:"number",changed:!1}],highlight:"loop-start"},{stepNumber:4,lineNumber:4,description:"计算 mid = 3, arr[3] = 7",variables:[{name:"mid",value:"3",type:"number",changed:!0}],highlight:"normal"},{stepNumber:5,lineNumber:5,description:"比较 arr[3]=7 === target=7，匹配成功",variables:[{name:"mid",value:"3",type:"number",changed:!1}],highlight:"branch-true"},{stepNumber:6,lineNumber:5,description:"返回索引 3",variables:[{name:"mid",value:"3",type:"number",changed:!1}],highlight:"return"}],architecture:{nodes:[{id:"bs",label:"binarySearch",type:"function",description:"二分查找函数"},{id:"arr",label:"arr (有序数组)",type:"variable"},{id:"target",label:"target (目标值)",type:"variable"}],edges:[{from:"bs",to:"arr",label:"接收"},{from:"bs",to:"target",label:"接收"}],mermaidCode:`graph TD
    A[binarySearch] -->|接收| B["arr (有序数组)"]
    A -->|接收| C["target (目标值)"]
    A --> D{arr[mid] === target}
    D -->|是| E[返回 mid]
    D -->|否| F{arr[mid] < target}
    F -->|是| G[搜索右半部分]
    F -->|否| H[搜索左半部分]
    G --> A
    H --> A`},dataFlow:{nodes:[{id:"input",label:"有序数组 + 目标值",type:"input"},{id:"calc_mid",label:"计算中间位置",type:"process"},{id:"compare",label:"比较中间值",type:"decision"},{id:"narrow",label:"缩小范围",type:"process"},{id:"output",label:"返回索引",type:"output"}],edges:[{from:"input",to:"calc_mid"},{from:"calc_mid",to:"compare"},{from:"compare",to:"output",label:"匹配"},{from:"compare",to:"narrow",label:"不匹配"},{from:"narrow",to:"calc_mid",label:"继续"}],mermaidCode:`graph LR
    A[有序数组 + 目标值] --> B[计算中间位置]
    B --> C{比较中间值}
    C -->|匹配| D[返回索引]
    C -->|不匹配| E[缩小范围]
    E --> B`}}},{id:"promise-chain",title:"Promise 链",description:"展示异步链式调用的执行顺序",category:"async",language:"javascript",code:`function fetchUser(id) {
  return fetch(\`/api/users/\${id}\`)
    .then(res => res.json())
    .then(user => user.name)
    .then(name => console.log(name));
}
fetchUser(42);`,preAnalyzed:{success:!0,codeInput:{code:"",language:"javascript"},summary:"通过 Promise 链获取用户数据并提取名称",executionSteps:[{stepNumber:1,lineNumber:7,description:"调用 fetchUser(42)",variables:[{name:"id",value:"42",type:"number",changed:!0}],highlight:"function-call"},{stepNumber:2,lineNumber:3,description:"发起 fetch 请求 /api/users/42",variables:[{name:"id",value:"42",type:"number",changed:!1}],highlight:"normal",annotation:"异步操作，等待响应"},{stepNumber:3,lineNumber:3,description:"收到 Response 对象",variables:[{name:"res",value:"Response{}",type:"object",changed:!0}],highlight:"normal"},{stepNumber:4,lineNumber:4,description:"调用 res.json() 解析响应体",variables:[{name:"res",value:"Response{}",type:"object",changed:!1}],highlight:"normal"},{stepNumber:5,lineNumber:4,description:"获得 user 对象 { name: 'Alice', ... }",variables:[{name:"user",value:'{"name":"Alice"}',type:"object",changed:!0}],highlight:"normal"},{stepNumber:6,lineNumber:5,description:"提取 user.name = 'Alice'",variables:[{name:"name",value:"'Alice'",type:"string",changed:!0}],highlight:"normal"},{stepNumber:7,lineNumber:6,description:"console.log('Alice')，输出用户名",variables:[{name:"name",value:"'Alice'",type:"string",changed:!1}],highlight:"normal"}],architecture:{nodes:[{id:"fetchUser",label:"fetchUser",type:"function",description:"获取用户信息"},{id:"fetch",label:"fetch API",type:"external"},{id:"json",label:"res.json()",type:"function"},{id:"extract",label:"提取 name",type:"function"},{id:"log",label:"console.log",type:"external"}],edges:[{from:"fetchUser",to:"fetch",label:"调用"},{from:"fetch",to:"json",label:"then"},{from:"json",to:"extract",label:"then"},{from:"extract",to:"log",label:"then"}],mermaidCode:`graph LR
    A[fetchUser] -->|调用| B[fetch API]
    B -->|then| C[res.json]
    C -->|then| D[提取 name]
    D -->|then| E[console.log]`},dataFlow:{nodes:[{id:"id",label:"用户 ID",type:"input"},{id:"api",label:"API 请求",type:"process"},{id:"response",label:"响应数据",type:"storage"},{id:"parse",label:"JSON 解析",type:"process"},{id:"name",label:"用户名",type:"output"}],edges:[{from:"id",to:"api",label:"42"},{from:"api",to:"response",label:"Response"},{from:"response",to:"parse"},{from:"parse",to:"name",label:"Alice"}],mermaidCode:`graph LR
    A[用户 ID] -->|42| B[API 请求]
    B -->|Response| C[响应数据]
    C --> D[JSON 解析]
    D -->|Alice| E[用户名]`}}},{id:"pub-sub",title:"发布-订阅模式",description:"简单的 EventEmitter 实现",category:"pattern",language:"typescript",code:`class EventEmitter {
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
bus.emit("data", "hello");`,preAnalyzed:{success:!0,codeInput:{code:"",language:"typescript"},summary:"实现简单的发布-订阅事件系统",executionSteps:[{stepNumber:1,lineNumber:9,description:"创建 EventEmitter 实例 bus",variables:[{name:"bus",value:"EventEmitter{}",type:"object",changed:!0}],highlight:"normal"},{stepNumber:2,lineNumber:10,description:"调用 bus.on('data', callback) 注册监听",variables:[{name:"bus",value:"EventEmitter{}",type:"object",changed:!1}],highlight:"function-call"},{stepNumber:3,lineNumber:3,description:"on 方法：初始化 events['data'] 为空数组",variables:[{name:"event",value:"'data'",type:"string",changed:!0},{name:"fn",value:"callback",type:"function",changed:!0}],highlight:"normal"},{stepNumber:4,lineNumber:4,description:"on 方法：将 callback 推入 events['data'] 数组",variables:[{name:"events",value:'{"data":[callback]}',type:"object",changed:!0}],highlight:"normal"},{stepNumber:5,lineNumber:11,description:"调用 bus.emit('data', 'hello')",variables:[{name:"event",value:"'data'",type:"string",changed:!0},{name:"args",value:"['hello']",type:"array",changed:!0}],highlight:"function-call"},{stepNumber:6,lineNumber:6,description:"emit 方法：遍历 events['data'] 中的回调",variables:[{name:"events",value:'{"data":[callback]}',type:"object",changed:!1}],highlight:"loop-start"},{stepNumber:7,lineNumber:6,description:"执行 callback('hello')，输出 hello",variables:[{name:"msg",value:"'hello'",type:"string",changed:!0}],highlight:"normal"}],architecture:{nodes:[{id:"emitter",label:"EventEmitter",type:"class",description:"事件发射器类"},{id:"on",label:"on()",type:"function",description:"注册事件监听"},{id:"emit",label:"emit()",type:"function",description:"触发事件"},{id:"events",label:"events",type:"variable",description:"事件存储映射"}],edges:[{from:"emitter",to:"on",label:"方法"},{from:"emitter",to:"emit",label:"方法"},{from:"on",to:"events",label:"写入"},{from:"emit",to:"events",label:"读取"}],mermaidCode:`graph TD
    A[EventEmitter] -->|方法| B["on()"]
    A -->|方法| C["emit()"]
    B -->|写入| D[events 映射]
    C -->|读取| D
    C -->|调用回调| E[订阅者]`},dataFlow:{nodes:[{id:"register",label:"注册监听",type:"input"},{id:"store",label:"事件存储",type:"storage"},{id:"trigger",label:"触发事件",type:"process"},{id:"dispatch",label:"分发回调",type:"process"},{id:"output",label:"执行结果",type:"output"}],edges:[{from:"register",to:"store",label:"callback"},{from:"trigger",to:"dispatch"},{from:"dispatch",to:"store",label:"查找回调"},{from:"dispatch",to:"output",label:"执行"}],mermaidCode:`graph LR
    A[注册监听] -->|callback| B[事件存储]
    C[触发事件] --> D[分发回调]
    D -->|查找| B
    D -->|执行| E[执行结果]`}}},{id:"stack",title:"栈实现",description:"后进先出数据结构的简单实现",category:"data-structure",language:"javascript",code:`class Stack {
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
s.peek();`,preAnalyzed:{success:!0,codeInput:{code:"",language:"javascript"},summary:"实现栈数据结构，支持 push、pop、peek 操作",executionSteps:[{stepNumber:1,lineNumber:9,description:"创建 Stack 实例 s",variables:[{name:"s",value:"Stack{#items:[]}",type:"object",changed:!0}],highlight:"normal"},{stepNumber:2,lineNumber:10,description:"调用 s.push('a')",variables:[{name:"item",value:"'a'",type:"string",changed:!0}],highlight:"function-call"},{stepNumber:3,lineNumber:3,description:"将 'a' 压入栈，#items = ['a']",variables:[{name:"#items",value:"['a']",type:"array",changed:!0}],highlight:"normal"},{stepNumber:4,lineNumber:11,description:"调用 s.push('b')",variables:[{name:"item",value:"'b'",type:"string",changed:!0}],highlight:"function-call"},{stepNumber:5,lineNumber:3,description:"将 'b' 压入栈，#items = ['a', 'b']",variables:[{name:"#items",value:"['a','b']",type:"array",changed:!0}],highlight:"normal"},{stepNumber:6,lineNumber:12,description:"调用 s.pop()，弹出栈顶元素",variables:[{name:"#items",value:"['a','b']",type:"array",changed:!1}],highlight:"function-call"},{stepNumber:7,lineNumber:4,description:"返回 'b'，#items = ['a']",variables:[{name:"#items",value:"['a']",type:"array",changed:!0}],highlight:"return"},{stepNumber:8,lineNumber:13,description:"调用 s.peek()，查看栈顶",variables:[{name:"#items",value:"['a']",type:"array",changed:!1}],highlight:"function-call"},{stepNumber:9,lineNumber:5,description:"返回栈顶元素 'a'，栈不变",variables:[{name:"#items",value:"['a']",type:"array",changed:!1}],highlight:"return"}],architecture:{nodes:[{id:"stack",label:"Stack",type:"class",description:"栈类"},{id:"push",label:"push()",type:"function"},{id:"pop",label:"pop()",type:"function"},{id:"peek",label:"peek()",type:"function"},{id:"items",label:"#items",type:"variable"}],edges:[{from:"stack",to:"push",label:"方法"},{from:"stack",to:"pop",label:"方法"},{from:"stack",to:"peek",label:"方法"},{from:"push",to:"items",label:"写入"},{from:"pop",to:"items",label:"读取并移除"},{from:"peek",to:"items",label:"只读"}],mermaidCode:`graph TD
    A[Stack] -->|方法| B["push()"]
    A -->|方法| C["pop()"]
    A -->|方法| D["peek()"]
    B -->|写入| E["#items"]
    C -->|读取并移除| E
    D -->|只读| E`},dataFlow:{nodes:[{id:"push_input",label:"push 输入",type:"input"},{id:"stack_store",label:"栈存储",type:"storage"},{id:"pop_output",label:"pop 输出",type:"output"},{id:"peek_output",label:"peek 输出",type:"output"}],edges:[{from:"push_input",to:"stack_store",label:"压入"},{from:"stack_store",to:"pop_output",label:"弹出"},{from:"stack_store",to:"peek_output",label:"查看"}],mermaidCode:`graph LR
    A[push 输入] -->|压入| B[栈存储]
    B -->|弹出| C[pop 输出]
    B -->|查看| D[peek 输出]`}}}];e.s(["CATEGORY_LABELS",0,{all:"全部",algorithm:"算法",pattern:"设计模式",async:"异步","data-structure":"数据结构"},"EXAMPLES",0,a])},90793,e=>{e.v(a=>Promise.all(["static/chunks/1r_jg9rqldd73.js","static/chunks/2oig4q__r3_ku.js","static/chunks/1q5mw3gyh8vqx.js","static/chunks/44ofxaigyotr1.js","static/chunks/3g9pqnzt6k691.js","static/chunks/3ih68zia8urf6.js","static/chunks/0g6vbgrwuncdz.js","static/chunks/1qpkjj92ccpm7.js","static/chunks/1gvdziv46f33n.js"].map(a=>e.l(a))).then(()=>a(73681)))}]);