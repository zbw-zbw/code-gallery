import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ExampleGrid from "@/components/examples/ExampleGrid";
import Link from "next/link";

export const metadata = {
  title: "示例库 - 代码画廊",
  description: "查看不同类型的代码可视化示例",
};

export default function ExamplesPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="min-h-screen bg-gallery-white">
          <section className="pt-24 pb-12 md:pt-32 md:pb-16">
            <div className="max-w-6xl mx-auto px-6 text-center">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-gallery-black mb-4">
                示例库
              </h1>
              <p className="text-lg text-gallery-gray max-w-xl mx-auto">
                查看不同类型的代码可视化
              </p>
            </div>
          </section>
          <section className="pb-24 md:pb-32">
            <div className="max-w-6xl mx-auto px-6">
              <ExampleGrid />
            </div>
          </section>
          <div className="text-center pb-16">
            <Link
              href="/"
              className="text-sm text-gallery-gray hover:text-code-purple transition-colors duration-200 inline-flex items-center gap-1"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              返回首页
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
