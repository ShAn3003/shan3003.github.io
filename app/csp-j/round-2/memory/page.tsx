import type { Metadata } from "next";
import { Round2Handbook } from "./Round2Handbook";
export const metadata: Metadata = { title: "CSP-J 第二轮基础知识速查", description: "配合 T1/T2 刷题路线的模拟、排序、整数与提交检查。" };
export default function Page() { return <Round2Handbook />; }
