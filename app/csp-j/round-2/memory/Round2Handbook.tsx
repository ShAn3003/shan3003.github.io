"use client";

import { useEffect, useMemo, useState } from "react";

type MemoryPoint = {
  id: string;
  category: string;
  title: string;
  must: string[];
  trap: string;
  mnemonic: string;
  question: string;
  answer: string;
  refs: string;
};

const categories = ["全部", "复杂度与实现", "模拟与数据结构", "贪心与数学"];

const points: MemoryPoint[] = [
  {
    "id": "r2-complexity",
    "category": "复杂度与实现",
    "title": "先看数据范围，再决定算法",
    "must": [
      "估算状态数量 × 单次转移代价，时间与空间同时计算。",
      "先写可解释的暴力，保留小规模版本用于对拍。",
      "n=200000 时逐对比较接近 200 亿对，需考虑排序扫描或其他优化。"
    ],
    "trap": "仅改快读通常不能解决复杂度数量级问题。",
    "mnemonic": "范围定量级，暴力找重复。",
    "question": "双重循环一定是 O(n²) 吗？",
    "answer": "不一定，要计算实际迭代次数及两变量的变化关系。",
    "refs": "通用方法"
  },
  {
    "id": "r2-integer",
    "category": "复杂度与实现",
    "title": "整数范围与乘法边界",
    "must": [
      "先估最大累加和、乘积和计数，再选类型。",
      "两个 int 相乘需先扩展：1LL*a*b；赋给 long long 不会自动改变乘法类型。",
      "正整数上取整可写 a/b+(a%b!=0)，避免 a+b-1 溢出。"
    ],
    "trap": "有符号整数溢出不可依赖；浮点 pow 不适合精确整数边界判定。",
    "mnemonic": "先扩类型再计算，等号边界单独验。",
    "question": "long long s=a*b 是否保证 int 大数乘积正确？",
    "answer": "不能，乘法可能先按 int 溢出，应先扩展类型并检查结果范围。",
    "refs": "2022 T1/T2"
  },
  {
    "id": "r2-simulation",
    "category": "模拟与数据结构",
    "title": "模拟：状态与同步更新",
    "must": [
      "列全位置、方向、时间、标记等状态。",
      "按题意规定单次操作的读取、计算、写回顺序。",
      "同时发生的变化先算好再统一提交。"
    ],
    "trap": "新旧状态混用、漏计初始状态、把转向当成不占步数。",
    "mnemonic": "状态列全，顺序写明。",
    "question": "机器人遇障碍转向时，本次操作是否一定前进？",
    "answer": "不一定。2024 T2 规定只右转而不前进，转向本身占一次操作。",
    "refs": "2019 T2、2024 T2"
  },
  {
    "id": "r2-sort",
    "category": "模拟与数据结构",
    "title": "排序、排名与比较器",
    "must": [
      "先规定主关键字及并列规则，保存原编号。",
      "比较器必须使用严格比较并满足严格弱序。",
      "常规排序 O(n log n)，值域小时可维护桶计数。"
    ],
    "trap": "用 <= 作为比较器；差值比较溢出；相等元素排名规则不明确。",
    "mnemonic": "先定并列，原号别丢。",
    "question": "return a.score>=b.score 为什么有问题？",
    "answer": "相等时两个方向比较均为真，违反严格弱序。",
    "refs": "2020 T2、2021 T2、2025 T2"
  },
  {
    "id": "r2-math",
    "category": "贪心与数学",
    "title": "整除、位运算与精确计算",
    "must": [
      "用商、余数、奇偶性把大范围枚举变成简单判断。",
      "整数乘方可逐次相乘并提前检查上限；指数较大时再学习快速幂。",
      "解密题先推导两数之和，再检查整数解；整根判定不能只靠浮点近似。"
    ],
    "trap": "漏掉 0、恰好整除、完全平方数；数学公式在定长整数中仍可能溢出。",
    "mnemonic": "先化简，再检查范围。",
    "question": "取模乘法是否自动避免溢出？",
    "answer": "不是。a*b 可能先溢出，需根据范围选择更宽类型或安全乘法。",
    "refs": "2020 T1、2021 T1、2022 T1/T2"
  },
  {
    "id": "r2-debug",
    "category": "复杂度与实现",
    "title": "提交检查与独立对拍",
    "must": [
      "检查格式、文件名、下标、类型和多测重置。",
      "自测覆盖最小、相等、极值、无解、恰好边界。",
      "保留独立暴力并对拍；发现差异先保存和缩小反例。"
    ],
    "trap": "暴力与优化复用同一个错误假设；只测随机不测边界。",
    "mnemonic": "小、等、极、空、边。",
    "question": "对拍结果不一致，应立即改优化答案迎合暴力吗？",
    "answer": "不应。先手算缩小后的反例，分别检查两份程序。",
    "refs": "全部编程题"
  }
];

const sources = [
  { title: "CCF《全国青少年信息学奥林匹克系列竞赛大纲》", url: "https://www.noi.cn/upload/resources/file/2023/03/15/1fa58eac9c412e01ce3c89c761058a43.pdf" },
  { title: "cppreference：C++ 核心语言", url: "https://en.cppreference.com/w/cpp/language" },
  { title: "OI Wiki：复杂度简介", url: "https://oi-wiki.org/basic/complexity/" },
  { title: "OI Wiki：排序简介", url: "https://oi-wiki.org/basic/sort-intro/" },
  { title: "OI Wiki：数据结构", url: "https://oi-wiki.org/ds/" },
  { title: "OI Wiki：数学", url: "https://oi-wiki.org/math/" },
];

export function Round2Handbook() {
  const [category, setCategory] = useState("全部");
  const [query, setQuery] = useState("");
  const [learned, setLearned] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const saved = JSON.parse(window.localStorage.getItem("cspj-round2-basics-progress") ?? "[]");
      if (Array.isArray(saved)) setLearned(new Set(saved.filter((id): id is string => typeof id === "string" && points.some((point) => point.id === id))));
    } catch { /* Corrupt or unavailable storage does not block reading. */ }
  }, []);

  const visible = useMemo(() => points.filter((point) => {
    const categoryMatch = category === "全部" || point.category === category;
    const haystack = `${point.title} ${point.must.join(" ")} ${point.trap} ${point.mnemonic}`.toLowerCase();
    return categoryMatch && haystack.includes(query.trim().toLowerCase());
  }), [category, query]);

  function toggleLearned(id: string) {
    const next = new Set(learned);
    if (next.has(id)) next.delete(id); else next.add(id);
    setLearned(next);
    try { window.localStorage.setItem("cspj-round2-basics-progress", JSON.stringify([...next])); } catch { /* Progress remains available in this tab. */ }
  }

  return <div className="memory-handbook">
    <section className="memory-hero">
      <div><p className="eyebrow">CSP-J 第二轮 · 编程复习</p><h1>基础知识速查</h1><p>配合每年 T1/T2 路线，只保留循环、模拟、排序、整数边界等入门知识。先通过路线里的简单练习，再尝试真题；第二题有些需要更多过渡训练。</p><div className="memory-hero-links"><a href="/csp-j/round-2/">← 返回第二轮图谱</a><button type="button" onClick={() => window.print()}>打印手册</button></div></div>
      <div className="memory-progress"><strong>{learned.size}<small> / {points.length}</small></strong><span>已标记掌握</span><div><i style={{ width: `${learned.size / points.length * 100}%` }} /></div></div>
    </section>

    <section className="memory-method"><h2>建议使用方法</h2><ol><li><strong>先遮住答案</strong><span>只看标题，尝试说明适用条件和复杂度。</span></li><li><strong>再做一分钟自测</strong><span>展开问题，写下答案后核对。</span></li><li><strong>最后回到真题</strong><span>根据关联题号编程提交，再用错误样例复盘。</span></li></ol></section>

    <section className="memory-toolbar" aria-label="筛选背诵内容">
      <label><span>搜索考点</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="例如：模拟、排序、整数" /></label>
      <div>{categories.map((item) => <button key={item} type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div>
      <p>显示 {visible.length} / {points.length} 个考点</p>
    </section>

    <div className="memory-groups">
      {categories.slice(1).map((group) => {
        const groupPoints = visible.filter((point) => point.category === group);
        if (!groupPoints.length) return null;
        return <section key={group} className="memory-group">
          <header><p>{String(categories.indexOf(group)).padStart(2, "0")}</p><h2>{group}</h2><span>{groupPoints.length} 个考点</span></header>
          <div className="memory-grid">{groupPoints.map((point) => <article key={point.id} className={learned.has(point.id) ? "is-learned" : ""}>
            <div className="memory-card-top"><span>{point.category}</span><label><input type="checkbox" checked={learned.has(point.id)} onChange={() => toggleLearned(point.id)} /> 已掌握</label></div>
            <h3>{point.title}</h3>
            <h4>方法与复杂度</h4><ul>{point.must.map((item) => <li key={item}>{item}</li>)}</ul>
            <p className="memory-trap"><strong>易错：</strong>{point.trap}</p>
            <p className="memory-mnemonic"><strong>记忆：</strong>{point.mnemonic}</p>
            <details><summary>一分钟自测</summary><p>{point.question}</p><div><strong>答案：</strong>{point.answer}</div></details>
            <footer>关联真题：{point.refs}</footer>
          </article>)}</div>
        </section>;
      })}
    </div>

    <section className="memory-sources"><div><p className="eyebrow">Sources</p><h2>校对与延伸资料</h2><p>手册按历年题目重新组织并用简洁语言归纳；标准定义与知识范围可沿以下资料继续核对。</p></div><ul>{sources.map((source) => <li key={source.url}><a href={source.url} target="_blank" rel="noreferrer">{source.title}<span>↗</span></a></li>)}</ul></section>
    <p className="memory-disclaimer">本手册用于复习，不代替 CCF 官方大纲与原题。类型大小、整数行为等实现相关问题，以题目给定环境和 C++ 标准规定为准。</p>
  </div>;
}
