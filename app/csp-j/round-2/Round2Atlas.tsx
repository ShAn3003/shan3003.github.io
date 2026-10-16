"use client";

import { useMemo, useState } from "react";
import questions from "@/data/cspj-round2.json";

const years = [...new Set(questions.map((item) => item.year))];
const topics = [...new Set(questions.map((item) => item.topic))];
const stars = (n: number) => "★".repeat(n) + "☆".repeat(5 - n);
const url = (id: string) => "https://www.luogu.com.cn/problem/" + id;
const colors: Record<string, string> = {
  "模拟与字符串": "csp-topic-language", "数学与位运算": "csp-topic-math",
  "排序与数据结构": "csp-topic-data", "动态规划": "csp-topic-program",
  "图论与搜索": "csp-topic-foundation", "贪心": "csp-topic-algorithm",
};

function makePractice(seed: number) {
  let state = seed >>> 0;
  const random = () => {
    state = Math.imul(state, 1664525) + 1013904223 | 0;
    return (state >>> 0) / 4294967296;
  };
  return [1, 2, 3, 4].map((q) => {
    const pool = questions.filter((item) => item.q === q);
    return pool[Math.floor(random() * pool.length)];
  });
}

export function Round2Atlas() {
  const [year, setYear] = useState("all");
  const [topic, setTopic] = useState("all");
  const [selectedId, setSelectedId] = useState(questions[0].id);
  const [seed, setSeed] = useState(20251016);
  const practice = useMemo(() => makePractice(seed), [seed]);
  const visible = questions.filter((item) => (year === "all" || String(item.year) === year) && (topic === "all" || item.topic === topic));
  const selected = visible.find((item) => item.id === selectedId) ?? visible[0];
  return <div className="csp-atlas csp-round2-atlas">
    <section className="csp-intro">
      <div><p className="eyebrow">2019—2025 · CSP-J 第二轮</p><h1>历年编程题与算法图谱</h1><p>从题意到算法、从易错点到训练：全国统一题每年 4 道，按年份与专题定位练习。</p>
        <a className="csp-handbook-link" href="/csp-j/round-2/memory/">打开第二轮算法手册 <span>方法 · 边界 · 自测 ↗</span></a>
        <p><a href="/csp-j/">← 第一轮题目图谱</a></p>
      </div>
      <div className="csp-stats" aria-label="数据概览"><div><strong>7</strong><span>历年试卷</span></div><div><strong>28</strong><span>编程题</span></div><div><strong>400</strong><span>每套总分</span></div></div>
    </section>

    <section className="csp-panel csp-years">
      <div className="csp-panel-heading"><div><h2>年度原题入口</h2><p>每题 100 分。五星为本站学习规划估计，反映完整解法的思维与实现负担，并非官方评级；同年各题可分别查看。</p></div></div>
      <div className="csp-year-links">{years.map((value) => <a key={value} href={url(questions.find((item) => item.year === value)!.id)} target="_blank" rel="noreferrer"><span>{value}<small>从 T1 开始 ↗</small></span><b>4 题 · 400 分</b></a>)}</div>
    </section>

    <section className="csp-panel csp-filters" aria-label="筛选编程题">
      <div><strong>题目索引</strong><span>{visible.length} / {questions.length} 题</span></div>
      <label>年份<select value={year} onChange={(event) => setYear(event.target.value)}><option value="all">全部年份</option>{years.map((value) => <option key={value} value={value}>{value}</option>)}</select></label>
      <label>算法专题<select value={topic} onChange={(event) => setTopic(event.target.value)}><option value="all">全部专题</option>{topics.map((value) => <option key={value}>{value}</option>)}</select></label>
    </section>

    <div className="csp-layout">
      <section className="csp-question-area">
        <div className="csp-legend">{topics.map((value) => <span key={value}><i className={colors[value]} />{value}</span>)}</div>
        {!visible.length && <p role="status">当前组合没有题目，请切换年份或专题。</p>}
        {years.map((value) => {
          const items = visible.filter((item) => item.year === value);
          if (!items.length) return null;
          return <section className="csp-paper" key={value}>
            <div className="csp-paper-heading"><div><h2>{value} 年</h2><p>全国统一题 · 点击题目查看算法切入点</p></div></div>
            <div className="csp-grid" style={{ gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>{items.map((item) => <button key={item.id} type="button" className={colors[item.topic] + (selected?.id === item.id ? " is-selected" : "")} style={{ height: "auto", minHeight: 58, padding: 10 }} aria-pressed={selected?.id === item.id} onClick={() => setSelectedId(item.id)}>T{item.q} · {item.title}<br /><small>{stars(item.difficulty)}</small></button>)}</div>
          </section>;
        })}
      </section>
      {selected && <aside className="csp-detail" aria-live="polite">
        <div className="csp-detail-top"><span>{selected.year} · T{selected.q}</span><b aria-label={selected.difficulty + " 星"}>{stars(selected.difficulty)}</b></div>
        <h2>{selected.title}</h2><p className="csp-meta">{selected.topic} · 100 分 · {selected.id}</p>
        <p className="csp-summary">{selected.summary}</p>
        <p className="csp-why"><strong>解题切入：</strong>{selected.approach}</p>
        <p className="csp-why"><strong>实现易错：</strong>{selected.trap}</p>
        <a className="csp-primary-link" href={url(selected.id)} target="_blank" rel="noreferrer">原题、样例与在线评测 ↗</a>
      </aside>}
    </div>

    <section className="csp-panel csp-practice">
      <div className="csp-panel-heading csp-practice-heading"><div><p className="csp-kicker">课堂工具 · 4 道编程题</p><h2>随机历年训练单</h2><p>从历年同题序各抽一题，合计 400 分；难度不保证等同某一年真卷。原题链接提供完整数据范围与样例。</p></div><div className="csp-practice-actions"><button type="button" onClick={() => setSeed(Date.now())}>重新组卷</button><button type="button" onClick={() => window.print()}>打印 / 保存 PDF</button></div></div>
      <div className="csp-practice-group"><div className="csp-practice-list">{practice.map((item, index) => <article key={item.id}><header><b>T{index + 1}</b><span>{item.title}</span><small>{item.year} · 100 分</small></header><p>{item.summary}</p><footer><span>{item.id} · 训练目标：{item.topic}</span><a href={url(item.id)} target="_blank" rel="noreferrer">打开完整题目 ↗</a></footer></article>)}</div></div>
      <div className="csp-practice-note"><strong>复盘顺序</strong><span>先读数据范围估算复杂度，再写朴素解校验；提交后记录错误样例，最后用算法手册回顾。打印内容为训练单摘要，完整题面请打开来源。</span></div>
    </section>

    <section className="memory-sources"><div><p className="eyebrow">Sources</p><h2>资料与整理范围</h2><p>题名、题序及题意按各题洛谷原题入口核对；算法切入与易错提醒为本站独立归纳，不能代替完整证明或题面。仅含全国统一题，不包含地方单独试卷。</p></div><ul>
      <li><a href="https://www.noi.cn/zxzy/lnzl/" target="_blank" rel="noreferrer">CCF NOI：历年题目与数据 ↗</a></li>
      <li><a href="https://www.noi.cn/zxzy/lnzl/jszl/2025-06-16/844463.shtml" target="_blank" rel="noreferrer">CCF：2024 年题目知识构成分析 ↗</a></li>
      <li><a href="https://www.noi.cn/upload/resources/file/2025/11/14/CSP-JS2025入门级题目知识构成分析报告.pdf" target="_blank" rel="noreferrer">CCF：2025 年入门级知识构成分析 ↗</a></li>
    </ul></section>
  </div>;
}
