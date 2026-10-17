"use client";
import { useState } from "react";
import data from "@/data/cspj-round2.json";

type Step = { id: string; title: string; stage: string; reason: string };
type Problem = { year: number; q: number; id: string; title: string; topic: string; summary: string; approach: string; trap: string; prerequisites: string[]; practice: Step[] };
const questions = data as Problem[];
const years = [...new Set(questions.map((item) => item.year))];
const url = (id: string) => "https://www.luogu.com.cn/problem/" + id;

export function Round2Atlas() {
  const [year, setYear] = useState("all");
  const [query, setQuery] = useState("");
  const visible = questions.filter((item) => (year === "all" || String(item.year) === year) && (item.title + item.topic + item.prerequisites.join(" ")).includes(query.trim()));
  return <div className="memory-handbook round2-roadmap">
    <section className="memory-hero">
      <div><p className="eyebrow">2019—2025 · CSP-J 第二轮 · T1 / T2</p><h1>从基础练习走到历年真题</h1><p>面向基础较弱的同学，只聚焦每年第一、第二题。建议先完成各年 T1，再进入 T2；部分 T2 需要较多过渡练习。每条路线按技能拆解，关联题不一定与真题完全同型。</p><div className="memory-hero-links"><a href="/csp-j/">← 第一轮图谱</a><a href="/csp-j/round-2/memory/">基础知识速查</a><a href="/csp-j/round-2/intervals/">区间算法可视化 · 差分 / 合并 / 离散化</a><button type="button" onClick={() => window.print()}>打印路线 / 保存 PDF</button></div></div>
    </section>
    <section className="memory-method"><h2>一条路线怎样学</h2><ol><li><strong>先看前置知识</strong><span>不熟的语法先用基础题练会，不急着做整套试卷。</span></li><li><strong>依编号逐题提交</strong><span>自己写出并通过一题，再进入下一题；卡住时只看对应知识点。</span></li><li><strong>用错例做复盘</strong><span>真题通过后，写下一句算法和一组边界样例；再做巩固题。</span></li></ol></section>
    <section className="memory-toolbar" aria-label="筛选学习路线">
      <label><span>搜索题目或知识</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：模拟、排序、乘方" /></label>
      <div><button type="button" className={year === "all" ? "is-active" : ""} onClick={() => setYear("all")}>全部年份</button>{years.map((item) => <button key={item} type="button" className={year === String(item) ? "is-active" : ""} onClick={() => setYear(String(item))}>{item}</button>)}</div>
      <p>显示 {visible.length} / 14 条路线</p>
    </section>
    <div className="memory-groups">
      {!visible.length && <p role="status">没有匹配路线，请切换年份或搜索词。</p>}
      {years.map((value) => {
        const items = visible.filter((item) => item.year === value);
        if (!items.length) return null;
        return <section className="memory-group" key={value}><header><p>{value}</p><h2>{value} 年 · 第一、第二题</h2><span>{items.length} 条路线</span></header><div className="memory-grid">{items.map((item) => <article key={item.id}>
          <div className="memory-card-top"><span>T{item.q} · {item.topic}</span><a href={url(item.id)} target="_blank" rel="noreferrer">{item.id} 原题 ↗</a></div>
          <h3>{item.title}</h3><p>{item.summary}</p>
          <h4>先会这些</h4><ul>{item.prerequisites.map((point) => <li key={point}>{point}</li>)}</ul>
          <p className="memory-mnemonic"><strong>从这里入手：</strong>{item.approach}</p>
          <p className="memory-trap"><strong>容易错在：</strong>{item.trap}</p>
          <h4 style={{ marginTop: 24 }}>按顺序刷题</h4>
          <ol className="round2-steps">{item.practice.map((step) => <li key={step.id}><a href={url(step.id)} target="_blank" rel="noreferrer"><strong>{step.stage.startsWith("可选") ? "选做" : "必做"} · {step.stage} · {step.title}</strong><small> {step.id} ↗</small></a><p>{step.reason}</p></li>)}</ol>
          <footer>达到目标：能独立写出本题，并解释每个状态或变量的作用。</footer>
        </article>)}</div></section>;
      })}
    </div>
    <section className="memory-sources"><div><p className="eyebrow">Sources</p><h2>范围与资料</h2><p>收录 2019—2025 全国统一题的 T1/T2，共 14 道。关联练习的先后顺序为本站教学建议，可按学生实际掌握程度调整。题意与要求以链接中的完整题面为准。</p></div><ul><li><a href="https://www.noi.cn/zxzy/lnzl/" target="_blank" rel="noreferrer">CCF NOI：历年题目与数据 ↗</a></li><li><a href="https://www.luogu.com.cn/problem/list" target="_blank" rel="noreferrer">洛谷：原题与同类练习入口 ↗</a></li></ul></section>
  </div>;
}
