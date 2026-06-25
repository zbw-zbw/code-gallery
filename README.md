# 代码画廊

> AI 把代码变成可交互的视觉故事

**代码画廊** 是一个 AI 驱动的代码可视化工具。用户粘贴代码后，AI 自动分析并生成执行流程动画、架构图和可嵌入的交互式图解。

## 项目背景

本项目为 **TRAE AI 创造力大赛 · 学习工作赛道** 参赛作品。

## 核心功能

- **执行流程动画**：逐步还原代码执行过程，变量变化、数据流动一目了然
- **架构图生成**：自动分析函数调用关系和模块依赖，生成可交互的架构图
- **数据流图**：追踪数据从输入到输出的完整路径
- **预置示例库**：6 个经典代码示例（冒泡排序、斐波那契、二分查找等），无需 API 即可体验
- **导出分享**：支持导出 PNG、SVG 或复制嵌入代码 / Markdown

## 技术栈

- [Next.js 16](https://nextjs.org/) + App Router
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Mermaid.js](https://mermaid.js.org/) — 架构图/数据流渲染
- [DeepSeek API](https://deepseek.com/) — AI 代码分析
- [html-to-image](https://github.com/bubkoo/html-to-image) — PNG 导出

## 快速开始

```bash
# 安装依赖
pnpm install

# 配置环境变量
# 复制 .env.local.example 为 .env.local，填入你的 DeepSeek API Key

# 开发
pnpm dev

# 构建
pnpm build
```

## 环境变量

```
DEEPSEEK_API_KEY=your-api-key-here
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat
```

## 部署

本项目针对 [Vercel](https://vercel.com) 优化。点击 Deploy to Vercel 即可一键部署。

> 注意：需要在 Vercel 项目设置中配置 `DEEPSEEK_API_KEY` 环境变量。

## 截图

- 首页：Landing 页面展示产品功能和价值主张
- Playground：代码输入 + AI 分析 + 三 Tab 可视化（执行流程/架构图/数据流）
- 示例库：6 个预置示例，点击即用

## 许可证

MIT
