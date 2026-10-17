import type { Metadata } from "next";
import { IntervalLesson } from "./IntervalLesson";
export const metadata: Metadata = {
  title: "区间覆盖与并集 · 差分、合并、离散化 | CSP-J",
  description: "校门外的树、差分数组、前缀和、区间合并与坐标压缩的交互式 C++ 教学实验室。",
};
export default function Page() { return <IntervalLesson />; }
