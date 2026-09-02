import type { Metadata } from "next";
import data from "@/data/cspj.json";
import fullData from "@/data/cspj-full.json";
import "katex/dist/katex.min.css";
import { CspJAtlas } from "./CspJAtlas";

export const metadata: Metadata = {
  title: "CSP-J 历年题目图谱",
  description: "2019—2025 年 CSP-J 第一轮题目、考点与五星难度统计。",
  openGraph: {
    title: "CSP-J 历年题目图谱",
    description: "2019—2025 第一轮 · 140 题考点与难度",
    images: [{ url: "/csp-j-og.png", width: 1200, height: 630, alt: "CSP-J 历年题目图谱" }],
  },
};

export default function CspJPage() {
  return <CspJAtlas years={data} fullYears={fullData} />;
}
