import type { Metadata, Viewport } from "next";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { MotionConfig } from "framer-motion";

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
  ],
};

export const metadata: Metadata = {
  title: "代码画廊 - AI 把代码变成可交互的视觉故事",
  description:
    "粘贴代码，AI 自动生成执行流程动画、架构图和可嵌入的交互式图解。让代码看得见，不只是被阅读。",
  keywords: ["代码可视化", "AI", "代码分析", "执行流程", "架构图"],
  authors: [{ name: "代码画廊" }],
  openGraph: {
    title: "代码画廊 - 让代码看得见",
    description: "AI 把代码变成可交互的视觉故事",
    type: "website",
    locale: "zh_CN",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${jetbrainsMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-gallery-white text-gallery-black">
        <MotionConfig reducedMotion="user">
          <a href="#main" className="skip-link">
            跳到主内容
          </a>
          {children}
        </MotionConfig>
      </body>
    </html>
  );
}
