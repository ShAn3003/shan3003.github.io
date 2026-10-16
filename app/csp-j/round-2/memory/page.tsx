import type { Metadata } from "next";
import { Round2Handbook } from "./Round2Handbook";
export const metadata: Metadata = { title: "CSP-J 第二轮算法手册", description: "算法识别、方法、复杂度、易错点与自测，关联 2019—2025 CSP-J 第二轮编程真题。" };
export default function Page() { return <Round2Handbook />; }
