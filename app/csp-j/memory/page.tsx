import type { Metadata } from "next";
import { MemoryHandbook } from "./MemoryHandbook";

export const metadata: Metadata = {
  title: "CSP-J 背诵手册",
  description: "按考点分类整理 CSP-J 第一轮适合背诵的定义、公式、易错点与自测题。",
  openGraph: {
    title: "CSP-J 背诵手册",
    description: "计算机基础、C++、数据结构、算法复杂度、数学与编码考前速记。",
    images: [{ url: "/csp-j-og.png", width: 1200, height: 630, alt: "CSP-J 背诵手册" }],
  },
};

export default function MemoryPage() {
  return <MemoryHandbook />;
}
