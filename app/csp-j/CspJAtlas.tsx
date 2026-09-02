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

type PracticeItem = {
  newQ: number;
  sourceYear: number;
  sourceQ: number;
  topic: string;
  summary: string;
  score: number;
  url: string;
};

type LearningResource = {
  title: string;
  type: string;
  topics: string;
  description: string;
  url: string;
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

const learningResources: LearningResource[] = [
  { title: "OI Wiki 学习路线", type: "中文路线", topics: "整体规划", description: "从语言基础、算法与数据结构到专题训练的竞赛学习地图。", url: "https://oi-wiki.org/contest/roadmap/" },
  { title: "OI Wiki 语言基础", type: "中文教程", topics: "C++ 语言", description: "复习变量、表达式、控制结构、函数、类与标准库等基础知识。", url: "https://oi-wiki.org/lang/" },
  { title: "OI Wiki 基础算法", type: "中文教程", topics: "排序 · 枚举 · 分治", description: "集中学习复杂度、枚举、递归、贪心、二分与排序等常考方法。", url: "https://oi-wiki.org/basic/" },
  { title: "OI Wiki 数据结构", type: "中文教程", topics: "栈 · 队列 · 树", description: "配合历年题补齐线性结构、树、并查集与字符串结构。", url: "https://oi-wiki.org/ds/" },
  { title: "OI Wiki 图论", type: "中文教程", topics: "图 · 最短路 · 遍历", description: "从图的基本概念逐步进入 DFS、BFS、最短路与生成树。", url: "https://oi-wiki.org/graph/" },
  { title: "OI Wiki 动态规划基础", type: "中文教程", topics: "动态规划", description: "用状态、转移与最优子结构理解阅读程序和完善程序中的 DP。", url: "https://oi-wiki.org/dp/basic/" },
  { title: "VisuAlgo", type: "交互演示", topics: "算法可视化", description: "通过动画观察排序、树、图和动态规划的执行过程，适合课堂演示。", url: "https://visualgo.net/zh" },
  { title: "MIT 6.006 算法导论", type: "视频课程", topics: "算法 · 数据结构", description: "MIT 开放课程，包含讲课视频、讲义、练习与测验，可用于进阶学习。", url: "https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/" },
  { title: "A Method for the Construction of Minimum-Redundancy Codes", type: "经典论文", topics: "Huffman 编码", description: "Huffman 1952 年原始论文；适合从历年编码题延伸到经典算法史。", url: "https://doi.org/10.1109/JRPROC.1952.273898" },
];

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let result = value;
    result = Math.imul(result ^ (result >>> 15), result | 1);
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61);
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(values: T[], random: () => number) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const target = Math.floor(random() * (index + 1));
    [result[index], result[target]] = [result[target], result[index]];
  }
  return result;
}

function buildPractice(years: Paper[], seed: number): PracticeItem[] {
  const random = seededRandom(seed);
  const makeItem = (paper: Paper, sourceQ: number, newQ: number): PracticeItem => ({
    newQ,
    sourceYear: paper.year,
    sourceQ,
    topic: paper.items[sourceQ - 1][0],
    summary: paper.items[sourceQ - 1][1],
    score: scoreFor(paper, sourceQ),
    url: urlFor(paper),
  });

  const questionPools = new Map(years.map((paper) => [paper.year, shuffle(Array.from({ length: 15 }, (_, index) => index + 1), random)]));
  const yearPool = shuffle([...years, ...years, years[Math.floor(random() * years.length)]], random);
  const singles = yearPool.map((paper, index) => makeItem(paper, questionPools.get(paper.year)!.pop()!, index + 1));
  const readingPaper = years[Math.floor(random() * years.length)];
  const completionPaper = shuffle(years.filter((paper) => paper.year !== readingPaper.year), random)[0];
  const reading = [16, 17, 18].map((sourceQ, index) => makeItem(readingPaper, sourceQ, 16 + index));
  const completion = [19, 20].map((sourceQ, index) => makeItem(completionPaper, sourceQ, 19 + index));
  return [...singles, ...reading, ...completion];
}

export function CspJAtlas({ years }: { years: Paper[] }) {
  const [yearFilter, setYearFilter] = useState("all");
  const [sectionFilter, setSectionFilter] = useState("all");
  const [selected, setSelected] = useState({ year: 2022, q: 17 });
  const [practiceSeed, setPracticeSeed] = useState(20250902);
  const practice = useMemo(() => buildPractice(years, practiceSeed), [practiceSeed, years]);
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

      <section className="csp-panel csp-practice" aria-labelledby="practice-title">
        <div className="csp-panel-heading csp-practice-heading">
          <div><p className="csp-kicker">课堂工具 · 100 分制</p><h2 id="practice-title">随机历年练习</h2><p>选择题覆盖全部 7 个年份；阅读程序与完善程序分别抽取一套完整题组，避免拆散上下文。</p></div>
          <div className="csp-practice-actions"><button type="button" onClick={() => setPracticeSeed(Date.now())}>重新组卷</button><button type="button" onClick={() => window.print()}>打印练习</button></div>
        </div>
        <div className="csp-practice-note"><strong>使用说明</strong><span>这里生成的是题目索引练习单。点击“查看原题”进入对应年份试卷作答；重新组卷后题目会变化。</span></div>
        {[
          { title: "一、单项选择题", range: [1, 15], total: 30 },
          { title: "二、阅读程序", range: [16, 18], total: 40 },
          { title: "三、完善程序", range: [19, 20], total: 30 },
        ].map((group) => <div className="csp-practice-group" key={group.title}>
          <h3>{group.title}<span>{group.total} 分</span></h3>
          <div className="csp-practice-list">
            {practice.filter((item) => item.newQ >= group.range[0] && item.newQ <= group.range[1]).map((item) => <article key={item.newQ}>
              <b>Q{item.newQ}</b>
              <div><strong>{item.topic}</strong><p>{item.summary}</p><small>来源：{item.sourceYear} 年 Q{item.sourceQ} · {item.score} 分</small></div>
              <a href={item.url} target="_blank" rel="noreferrer">查看原题 ↗</a>
            </article>)}
          </div>
        </div>)}
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

      <section className="csp-resources" aria-labelledby="resources-title">
        <div className="csp-resource-heading"><div><p className="csp-kicker">教师备课 · 延伸学习</p><h2 id="resources-title">从考点到课程、动画与经典论文</h2></div><p>建议先用历年题定位薄弱点，再选择同主题资源讲解，最后回到随机练习检验迁移能力。</p></div>
        <div className="csp-resource-grid">
          {learningResources.map((resource) => <a key={resource.title} href={resource.url} target="_blank" rel="noreferrer">
            <div><span>{resource.type}</span><small>{resource.topics}</small></div>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <b>开始学习 ↗</b>
          </a>)}
        </div>
      </section>
      <p className="csp-source">数据整理自洛谷有题 · 难度评级仅作学习规划参考</p>
    </div>
  );
}
