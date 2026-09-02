"use client";

import { useMemo, useState } from "react";

type Paper = {
  year: number;
  id: number;
  difficulty: number;
  why: string;
  subs: number[];
  scores: number[];
  items: string[][];
};

const topics = ["计算机基础", "C++语言", "数据结构", "数学与组合", "算法与图论", "程序综合"];
const topicClass: Record<string, string> = {
  计算机基础: "csp-topic-foundation",
  "C++语言": "csp-topic-language",
  数据结构: "csp-topic-data",
  数学与组合: "csp-topic-math",
  算法与图论: "csp-topic-algorithm",
  程序综合: "csp-topic-program",
};
const sectionFor = (q: number) => q <= 15 ? "单项选择" : q <= 18 ? "阅读程序" : "完善程序";
const scoreFor = (paper: Paper, q: number) => q <= 15 ? 2 : paper.scores[q - 16];
const subsFor = (paper: Paper, q: number) => q <= 15 ? 1 : paper.subs[q - 16];
const starsFor = (value: number) => "★".repeat(value) + "☆".repeat(5 - value);
const urlFor = (paper: Paper) => `https://ti.luogu.com.cn/problemset/${paper.id}/training`;

export function CspJAtlas({ years }: { years: Paper[] }) {
  const [yearFilter, setYearFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selected, setSelected] = useState({ year: 2022, q: 17 });
  const visiblePapers = useMemo(() => years.filter((paper) => yearFilter === "all" || String(paper.year) === yearFilter), [yearFilter, years]);
  const selectedPaper = years.find((paper) => paper.year === selected.year) ?? years[0];
  const selectedItem = selectedPaper.items[selected.q - 1];
  const visibleCount = visiblePapers.reduce((sum, paper) => sum + paper.items.filter((_, index) => sectionFilter === "all" || sectionFor(index + 1) === sectionFilter).length, 0);

  return (
    <div className="csp-atlas">
      <section className="csp-intro">
        <div>
          <p className="eyebrow">2019—2025 · CSP-J 第一轮</p>
          <h1>CSP-J 历年题目与难度图谱</h1>
          <p>按年份查看每个大题的考点、题型、分值与小问数，并直接进入对应年度原题。</p>
        </div>
        <div className="csp-stats" aria-label="数据概览">
          <div><strong>7</strong><span>历年试卷</span></div>
          <div><strong>140</strong><span>大题总数</span></div>
          <div><strong>300</strong><span>实际小问</span></div>
        </div>
      </section>

      <section className="csp-panel csp-years" aria-labelledby="difficulty-title">
        <div className="csp-panel-heading"><div><h2 id="difficulty-title">年度难度与原题入口</h2><p>五星依据知识跨度、代码阅读强度和算法深度综合评估，并非官方评级。</p></div></div>
        <div className="csp-year-links">
          {years.map((paper) => <a key={paper.year} href={urlFor(paper)} target="_blank" rel="noreferrer"><span>{paper.year}<small>原题 ↗</small></span><b aria-label={`${paper.difficulty} 星难度`}>{starsFor(paper.difficulty)}</b></a>)}
        </div>
      </section>

      <section className="csp-filters" aria-label="筛选题目">
        <div><strong>筛选题目</strong><span>{visibleCount} 题</span></div>
        <label>年份<select value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}><option value="all">全部年份</option>{years.map((paper) => <option value={paper.year} key={paper.year}>{paper.year}</option>)}</select></label>
        <label>题型<select value={sectionFilter} onChange={(event) => setSectionFilter(event.target.value)}><option value="all">全部题型</option>{["单项选择", "阅读程序", "完善程序"].map((section) => <option value={section} key={section}>{section}</option>)}</select></label>
      </section>

      <div className="csp-layout">
        <section className="csp-question-area" aria-label="历年题目">
          <div className="csp-legend">{topics.map((topic) => <span key={topic}><i className={topicClass[topic]} />{topic}</span>)}</div>
          {visiblePapers.map((paper) => {
            const questions = paper.items.map((item, index) => ({ item, q: index + 1 })).filter(({ q }) => sectionFilter === "all" || sectionFor(q) === sectionFilter);
            if (!questions.length) return null;
            return <section className="csp-paper" key={paper.year}>
              <div className="csp-paper-heading"><div><h2>{paper.year} 年</h2><p>{paper.why}</p></div><div><b aria-label={`${paper.difficulty} 星难度`}>{starsFor(paper.difficulty)}</b><a href={urlFor(paper)} target="_blank" rel="noreferrer">原题 ↗</a></div></div>
              <div className="csp-grid">{questions.map(({ item, q }) => {
                const active = selected.year === paper.year && selected.q === q;
                return <button key={q} type="button" aria-pressed={active} aria-label={`${paper.year} 年第 ${q} 题，${item[0]}：${item[1]}`} onClick={() => setSelected({ year: paper.year, q })} className={`${topicClass[item[0]]} ${active ? "is-selected" : ""}`}>Q{q}</button>;
              })}</div>
            </section>;
          })}
        </section>

        <aside className="csp-detail" aria-live="polite">
          <div className="csp-detail-top"><span>{selectedPaper.year} · Q{selected.q}</span><b>{starsFor(selectedPaper.difficulty)}</b></div>
          <h2>{selectedItem[0]}</h2>
          <p className="csp-meta">{sectionFor(selected.q)} · {scoreFor(selectedPaper, selected.q)} 分 · {subsFor(selectedPaper, selected.q)} 个小问</p>
          <p className="csp-summary">{selectedItem[1]}</p>
          <p className="csp-why"><strong>年度难度说明：</strong>{selectedPaper.why}</p>
          <a className="csp-primary-link" href={urlFor(selectedPaper)} target="_blank" rel="noreferrer">打开 {selectedPaper.year} 年原题 ↗</a>
        </aside>
      </div>
      <p className="csp-source">数据整理自洛谷有题 · 难度评级仅作学习规划参考</p>
    </div>
  );
}
