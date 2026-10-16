import type { Metadata } from "next";
import { Round2Atlas } from "./Round2Atlas";

export const metadata: Metadata = { title: "CSP-J 第二轮题目与算法图谱", description: "2019—2025 年 CSP-J 第二轮全国统一编程题、算法考点、易错点与训练单。" };

export default function Round2Page() { return <Round2Atlas />; }
