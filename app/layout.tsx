import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://shan3003.github.io"),
  title: { default: "Shan Xie · Research Notes", template: "%s · Shan Xie" },
  description: "多语模型、科研工作流与个人 Codex Skills 的实验记录。",
  authors: [{ name: "Shan Xie", url: "https://github.com/ShAn3003" }],
  openGraph: {
    type: "website",
    locale: "zh_CN",
    siteName: "Shan Xie · Research Notes",
    title: "Shan Xie · Research Notes",
    description: "多语模型、科研工作流与个人 Codex Skills 的实验记录。",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <a className="skip-link" href="#main">跳到主要内容</a>
        <Header />
        <main id="main" className="shell page-content">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
