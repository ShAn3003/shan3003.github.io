"use client";

import { useEffect, useMemo, useState } from "react";

type Range = [number, number];
type Method = "trees" | "merge" | "compress";
const examples: Record<Method, string> = {
  trees: "2 5\n4 8",
  merge: "1 5\n3 8\n12 16\n14 20\n25 30",
  compress: "100 500\n300 800\n100000000 100000010",
};
const solutions: Record<Method, string> = {
  trees: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int L, m; cin >> L >> m;
    vector<int> d(L + 2, 0);
    for (int j = 0; j < m; ++j) {
        int a, b; cin >> a >> b;
        ++d[a]; --d[b + 1];
    }
    int cover = 0, ans = 0;
    for (int i = 0; i <= L; ++i) {
        cover += d[i];
        if (cover == 0) ++ans;
    }
    cout << ans << '\\n';
}`,
  merge: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<pair<long long,long long>> a(n);
    for (auto &[l,r] : a) cin >> l >> r;
    sort(a.begin(), a.end());
    vector<pair<long long,long long>> merged;
    for (auto [l,r] : a) {
        if (merged.empty() || l > merged.back().second + 1)
            merged.push_back({l,r});
        else
            merged.back().second = max(merged.back().second,r);
    }
    long long ans = 0;
    for (auto [l,r] : merged) ans += r-l+1;
    cout << ans << '\\n';
}`,
  compress: `#include <bits/stdc++.h>
using namespace std;
int main() {
    int n; cin >> n;
    vector<pair<long long,long long>> a(n);
    vector<long long> xs;
    for (auto &[l,r] : a) {
        cin >> l >> r;
        xs.push_back(l);
        xs.push_back(r+1);
    }
    sort(xs.begin(),xs.end());
    xs.erase(unique(xs.begin(),xs.end()),xs.end());
    vector<int> d(xs.size()+1);
    for (auto [l,r] : a) {
        int L = lower_bound(xs.begin(),xs.end(),l)-xs.begin();
        int R = lower_bound(xs.begin(),xs.end(),r+1)-xs.begin();
        ++d[L]; --d[R];
    }
    long long ans=0;
    int cover=0;
    for(int i=0;i+1<(int)xs.size();++i) {
        cover+=d[i];
        if(cover>0) ans+=xs[i+1]-xs[i];
    }
    cout<<ans<<'\\n';
}`,
};
function parse(s: string): Range[] {
  const lines=s.trim().split(/\n/).map(x=>x.trim()).filter(Boolean);
  if (!lines.length || lines.length>8) throw new Error("请输入 1～8 行区间。");
  return lines.map(line=>{
    const p=line.split(/[\s,，]+/).map(Number);
    if(p.length!==2 || p.some(x=>!Number.isSafeInteger(x)) || p[0]<0 || p[0]>p[1] || !Number.isSafeInteger(p[1]+1))
      throw new Error("请输入非负安全整数，且每行满足 左端点 ≤ 右端点。");
    return [p[0],p[1]] as Range;
  });
}
function merge(a: Range[]): Range[] {
  const ans:Range[]=[];
  for(const [l,r] of [...a].sort((x,y)=>x[0]-y[0]||x[1]-y[1])){
    if(!ans.length||l>ans[ans.length-1][1]+1) ans.push([l,r]);
    else ans[ans.length-1][1]=Math.max(r,ans[ans.length-1][1]);
  }
  return ans;
}
const fmt=(n:number)=>n.toLocaleString("en-US");
const boxStyle={border:"1px solid var(--border, #d1d5db)",borderRadius:14,padding:18} as const;
const buttonStyle={padding:"9px 13px",border:"1px solid #94a3b8",borderRadius:9,cursor:"pointer",background:"transparent",color:"inherit"} as const;
const codeStyle={whiteSpace:"pre-wrap",overflowX:"auto",background:"#0f172a",color:"#e2e8f0",borderRadius:12,padding:16,fontSize:12,lineHeight:1.8} as const;

export function IntervalLesson(){
  const [method,setMethod]=useState<Method>("trees");
  const [draft,setDraft]=useState(examples.trees);
  const [ranges,setRanges]=useState<Range[]>(parse(examples.trees));
  const [road,setRoad]=useState(10);
  const [step,setStep]=useState(0);
  const [auto,setAuto]=useState(false);
  const [error,setError]=useState("");
  const sorted=useMemo(()=>[...ranges].sort((a,b)=>a[0]-b[0]||a[1]-b[1]),[ranges]);
  const xs=useMemo(()=>[...new Set(ranges.flatMap(([l,r])=>[l,r+1]))].sort((a,b)=>a-b),[ranges]);
  const max=method==="merge"?sorted.length+1:method==="trees"?ranges.length+road+2:1+ranges.length+xs.length-1;
  const position=(x:number,lo:number,hi:number)=>8+(x-lo)/Math.max(1,hi-lo)*84;
  useEffect(()=>{if(!auto)return;const id=window.setInterval(()=>setStep(s=>Math.min(max,s+1)),850);return ()=>window.clearInterval(id);},[auto,max]);
  useEffect(()=>{if(step>=max)setAuto(false);},[step,max]);
  function changeMethod(m:Method){setAuto(false);setMethod(m);setDraft(examples[m]);setRanges(parse(examples[m]));setRoad(10);setStep(0);setError("");}
  function apply(){try{
    const a=parse(draft);
    if(method==="trees"&&a.some(([l,r])=>r>road||l>road))throw new Error("树的区间必须处于 0～L 之间。");
    setRanges(a);setStep(0);setAuto(false);setError("");
  }catch(e){setError(e instanceof Error?e.message:"输入错误");}}
  const finalMerge=merge(ranges);
  const answer=finalMerge.reduce((sum,[l,r])=>sum+r-l+1,0);
  let explanation="",highlight=-1,progress=0,coverage:number[]=[];
  const diff=Array(xs.length).fill(0) as number[];
  if(method==="merge"){
    const count=Math.min(step,sorted.length);
    const partial=merge(sorted.slice(0,count));
    progress=partial.reduce((sum,[l,r])=>sum+r-l+1,0);
    highlight=count-1;
    explanation=step===0?"先把所有区间按左端点升序排序。":step<=sorted.length?`处理第 ${step} 个区间 [${sorted[count-1].join(", ")}]：与当前合并区间重叠或相邻则延长右端点，否则开启新区间。`:"全部处理完成，按每个合并区间的 r-l+1 求整数点数量。";
  }else{
    const marked=method==="trees"?Math.min(step,ranges.length):Math.min(Math.max(0,step-1),ranges.length);
    for(const [l,r] of (method==="trees"?ranges:sorted).slice(0,marked)){
      const L=xs.indexOf(l),R=xs.indexOf(r+1);diff[L]++;diff[R]--;
    }
    const scan=method==="trees"?Math.max(0,step-ranges.length):Math.max(0,step-ranges.length-1);
    let covered=0;
    for(let i=0;i<xs.length-1;i++){
      covered+=diff[i];
      coverage.push(i<scan?covered:-1);
      if(i<scan&&covered>0)progress+=xs[i+1]-xs[i];
    }
    if(method==="trees"){
      const d=Array(road+2).fill(0);
      ranges.slice(0,marked).forEach(([l,r])=>{d[l]++;d[r+1]--;});
      let s=0,kept=0;
      for(let i=0;i<=road;i++){s+=d[i];if(i<scan&&s===0)kept++;}
      progress=kept;
      explanation=step<=ranges.length?(step===0?"初始化差分数组，每个位置都是 0。":`标记区间 [${ranges[step-1].join(",")}]：d[l]++，d[r+1]--。`):`对第 ${Math.min(road,scan-1)} 号树完成扫描：前缀和为 0 时，该树未被移除，答案加 1。`;
    }else explanation=step===0?"收集所有 l 与 r+1，排序去重形成关键边界。":step<=ranges.length+1?(step===1?"排序去重；每两个相邻边界之间的覆盖次数恒定。":`处理区间 [${sorted[step-2].join(",")}]，只在压缩后的两个边界位置分别进行 +1、-1。`):`扫描 [${fmt(xs[Math.max(0,scan-1)])},${fmt(xs[Math.min(xs.length-1,scan)])})，覆盖次数大于 0 就加上真实跨度。`;
  }
  const lo=Math.min(...ranges.map(x=>x[0])),hi=Math.max(...ranges.map(x=>x[1]))+1;
  const displayed=method==="merge"?merge(sorted.slice(0,Math.min(step,sorted.length))):finalMerge;
  return <main style={{maxWidth:1020,margin:"0 auto",padding:"38px 18px 100px",display:"grid",gap:24}}>
    <nav style={{fontSize:13,display:"flex",gap:14,flexWrap:"wrap"}}><a href="/csp-j/">CSP-J 首页</a><a href="/csp-j/round-2/">第二轮路线</a><a href="/csp-j/round-2/memory/">基础知识速查</a></nav>
    <header><p style={{fontSize:12,letterSpacing:2,color:"#168266",fontWeight:800}}>CSP-J · SECOND ROUND · INTERACTIVE LAB</p><h1 style={{fontSize:"clamp(28px,5vw,46px)",lineHeight:1.2,margin:"12px 0"}}>区间覆盖、并集与差分算法</h1><p style={{lineHeight:1.9,opacity:.75}}>从「校门外的树」出发，理解差分数组 + 前缀和、排序 + 区间合并、坐标压缩 + 差分。所有演示均可修改输入、单步执行、自动播放。</p></header>
    <section style={boxStyle}><h2 style={{fontSize:19,marginBottom:12}}>选择学习方法</h2><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{([["trees","① 校门外的树 · 普通差分"],["merge","② 排序 + 区间合并"],["compress","③ 坐标压缩 + 差分"]] as const).map(([m,name])=><button key={m} onClick={()=>changeMethod(m)} style={{...buttonStyle,background:method===m?"#166c55":"transparent",color:method===m?"white":"inherit"}}>{name}</button>)}</div><p style={{lineHeight:1.8,marginTop:14}}>{method==="trees"?"树的编号为 0～L。区间内的树被移走，计算剩余树的数量；这是求并集补集大小的典型例子。":method==="merge"?"先排序，再维护当前合并区间；输出不重叠的区间及其整数点数量。":"端点很大但区间少时，只记录边界 l 和 r+1。压缩后的单元代表不同跨度，不能直接 ans++。"}</p></section>
    <section style={boxStyle}><h2 style={{fontSize:19,marginBottom:12}}>修改测试数据</h2>{method==="trees"&&<label style={{display:"block",marginBottom:8}}>道路长度 L（0～30）： <input aria-label="道路长度" type="number" min="0" max="30" value={road} onChange={e=>{const v=Number(e.target.value);if(Number.isInteger(v)&&v>=0&&v<=30){setRoad(v);setStep(0);setAuto(false);}}} style={{width:72,padding:6,border:"1px solid #94a3b8",borderRadius:6}} /></label>}<label htmlFor="ranges-input" style={{fontSize:13}}>每行输入一个整数闭区间：左端点 右端点</label><textarea id="ranges-input" value={draft} onChange={e=>setDraft(e.target.value)} rows={5} style={{display:"block",width:"100%",margin:"8px 0",font:"13px/1.7 monospace",padding:12,borderRadius:9,border:"1px solid #94a3b8",background:"transparent",color:"inherit"}}/><button onClick={apply} style={{...buttonStyle,background:"#166c55",color:"white"}}>应用输入并重置</button>{error&&<p role="alert" style={{color:"#ef4444",marginTop:10}}>{error}</p>}</section>
    <section style={boxStyle}><div style={{display:"flex",justifyContent:"space-between",gap:8,alignItems:"center"}}><h2 style={{fontSize:19}}>逐步执行可视化</h2><span style={{fontSize:12,opacity:.7}}>{step} / {max}</span></div><div style={{height:6,background:"#cbd5e1",borderRadius:8,margin:"14px 0"}}><div style={{width:`${step/max*100}%`,height:"100%",background:"#168266",borderRadius:8}}/></div>
    {method==="trees"?<div style={{display:"grid",gridTemplateColumns:`repeat(${road+1},minmax(22px,1fr))`,gap:4,overflowX:"auto",padding:"12px 0"}}>
      {Array.from({length:road+1},(_,i)=>{const removed=ranges.slice(0,Math.min(step,ranges.length)).some(([l,r])=>i>=l&&i<=r);return <div key={i} style={{textAlign:"center",fontSize:12,background:removed?"#fee2e2":"#dcfce7",color:removed?"#991b1b":"#166534",borderRadius:7,padding:"8px 2px"}}><div style={{fontSize:22}}>{removed?"🪵":"🌳"}</div>{i}</div>;})}</div>:<svg role="img" aria-label="区间覆盖与合并可视化" viewBox="0 0 800 250" style={{width:"100%",background:"rgba(148,163,184,.07)",borderRadius:12}}>
      {sorted.map(([l,r],i)=><g key={i}><text x="8" y={23+i*22} fontSize="12" fill="currentColor">{`[${fmt(l)},${fmt(r)}]`}</text><rect x={120+position(l,lo,hi)*6.8} y={10+i*22} width={Math.max(3,(position(r+1,lo,hi)-position(l,lo,hi))*6.8)} height="15" rx="4" fill={method==="merge"&&i===highlight?"#f59e0b":"#3b82f6"} opacity={method==="merge"&&i>=step?.3:.9}/></g>)}
      <text x="8" y="222" fontSize="13" fill="currentColor">并集</text>{displayed.map(([l,r],i)=><rect key={i} x={120+position(l,lo,hi)*6.8} y="205" width={Math.max(3,(position(r+1,lo,hi)-position(l,lo,hi))*6.8)} height="18" rx="4" fill="#16a34a" />)}
    </svg>}
    {method==="compress"&&<div style={{overflowX:"auto",marginTop:16}}><div style={{display:"grid",gridTemplateColumns:`repeat(${xs.length},minmax(105px,1fr))`,gap:4,minWidth:xs.length*105}}>{xs.map((x,i)=><div key={i} style={{padding:8,border:"1px solid #94a3b8",borderRadius:6,textAlign:"center",fontSize:12}}><b>{fmt(x)}</b><br/>压缩下标 {i}<br/>diff = {diff[i]}<br/>{i<coverage.length?`覆盖 = ${coverage[i]<0?"?":coverage[i]}; 长度 = ${fmt(xs[i+1]-x)}`:"边界终点"}</div>)}</div></div>}
    <div style={{padding:"12px 14px",background:"rgba(22,163,74,.09)",borderRadius:9,marginTop:16,lineHeight:1.9}}>{explanation}</div>
    <div style={{display:"flex",gap:8,flexWrap:"wrap",marginTop:14}}><button style={buttonStyle} disabled={step===0} onClick={()=>{setAuto(false);setStep(Math.max(0,step-1));}}>← 上一步</button><button style={{...buttonStyle,background:"#166c55",color:"white"}} disabled={step>=max} onClick={()=>setStep(Math.min(max,step+1))}>下一步 →</button><button style={buttonStyle} onClick={()=>{if(step>=max)setStep(0);setAuto(x=>!x);}}>{auto?"暂停":"▶ 自动播放"}</button><button style={buttonStyle} onClick={()=>{setAuto(false);setStep(0);}}>↺ 重置</button></div>
    <div style={{marginTop:16,fontWeight:650}}>当前累计：{fmt(progress)}　|　{method==="trees"?"最终剩余":"最终并集"}：{fmt(method==="trees"?road+1-answer:answer)}</div></section>
    <section style={boxStyle}><h2 style={{fontSize:20}}>算法思想与关键公式</h2><p style={{lineHeight:2,margin:"12px 0"}}>{method==="trees"?"对区间 [l,r] 做 d[l]++、d[r+1]--，扫描前缀和得到每个位置的覆盖次数。cover=0 表示树未被移走；注意 0 号树不能访问 s[-1]。":"merge"===method?"按照左端点排序；若下一个区间的 l ≤ 当前 r+1（整数点口径），合并成 [current.l, max(current.r,r)]。否则把当前区间计入答案。":"收集所有 l、r+1 并去重排序，使用 lower_bound 把原始边界映射为压缩下标。对压缩区段求前缀和，cover>0 时累加 xs[i+1]-xs[i]。"} </p><pre style={codeStyle}><code>{solutions[method]}</code></pre></section>
    <section style={boxStyle}><h2 style={{fontSize:20}}>方法对比与易错点</h2><div style={{overflowX:"auto"}}><table style={{width:"100%",borderCollapse:"collapse",lineHeight:2,textAlign:"left"}}><thead><tr><th>方法</th><th>复杂度</th><th>优势</th></tr></thead><tbody><tr><td>普通差分</td><td>O(L+m)</td><td>小坐标范围、多区间修改</td></tr><tr><td>排序 + 合并</td><td>O(m log m)</td><td>直接输出合并结果</td></tr><tr><td>压缩 + 差分</td><td>O(m log m)</td><td>大坐标、每段覆盖次数</td></tr></tbody></table></div><p style={{lineHeight:1.9,marginTop:14}}>这里统一统计<strong>非负整数闭区间中的整数点</strong>：每段 [l,r] 的点数是 r-l+1；实数区间的几何长度用 r-l。对于相邻压缩边界 [xs[i],xs[i+1])，长度就是两者之差。所有示例使用安全整数，C++ 用 long long 避免 32 位范围不足。</p><p style={{lineHeight:1.9,marginTop:12}}>覆盖次数 cover = 0 表示未覆盖，cover &gt; 0 表示并集，cover == m 表示所有 m 个区间的交集，cover == k 可以统计恰好 k 重覆盖。</p></section>
    <section style={boxStyle}><h2 style={{fontSize:20}}>巩固练习</h2><ol style={{lineHeight:2,paddingLeft:22}}><li>校门外的树：道路 0～L，求删去若干区间后的剩余树木数量。</li><li>多个闭区间求并集：输出合并后的区间和不同整数点数量。</li><li>恰好覆盖 k 次：在大坐标下修改差分扫描条件，求所有 cover == k 的区段长度。</li><li>思考：为什么下标 0 不能访问 d[-1]？为什么右端点要写 r+1？</li></ol><p style={{marginTop:12}}><a href="https://www.luogu.com.cn/problem/P1047" target="_blank" rel="noreferrer">洛谷 P1047 校门外的树 ↗</a></p></section>
  </main>;
}
