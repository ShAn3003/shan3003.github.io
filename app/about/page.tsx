import type { Metadata } from "next";

export const metadata: Metadata = { title: "关于", description: "Shan Xie 的研究兴趣与工作原则。" };

export default function AboutPage() {
  return (
    <>
      <header className="page-hero">
        <p className="eyebrow">ABOUT</p><h1>你好，我是 Shan Xie。</h1>
        <p>我有人工智能专业背景，目前关注多语视觉语言模型、跨语言一致性、可信评测，以及让 AI agent 更可靠地参与科研工作的协作机制。</p>
      </header>
      <div className="about-grid">
        <section><h2>我在这里记录什么</h2><p>论文通常保留最终方法与结果；博客更适合保存形成结论的过程。我会记录失败的实验、协议陷阱、数据与工程细节，以及这些经验如何被整理成可复用的 Skills。</p></section>
        <section><h2>工作原则</h2><p>先看真实文件与输出，再下结论；先确认协议可比，再比较数字；把 smoke、运行中和正式结果严格分开。</p></section>
      </div>
      <p className="contact-line">GitHub · <a href="https://github.com/ShAn3003">@ShAn3003</a></p>
    </>
  );
}
