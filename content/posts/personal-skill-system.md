---
title: "把反复踩过的坑，做成个人 Codex Skills"
date: "2026-08-21"
categories: [agent, research-workflow]
tags: [codex, skill, reproducibility]
excerpt: "个人 Skill 不应该只是更长的提示词，而应把真实失败压缩成边界清楚、可验证的工作流。"
---

过去一段时间，我和 AI agent 一起做了很多多语 VLM 评测、训练、数据审计和结果汇报。真正反复消耗时间的，并不是某个 API 怎么调用，而是同一类判断错误不断以新形式出现：

- 用另一个 benchmark 的数字回答当前 benchmark；
- 把 tmux、PID 或显存占用说成“实验已经完成”；
- 用户要求“继续训练”，执行时却重新初始化了 adapter；
- 把 free generation、首 token logits 和 perplexity 放进同一张可比表；
- 只给平均分，不给覆盖率、分母和具体样例链路。

这些问题靠一句“下次注意”解决不了。于是我开始把它们整理成 Skills。

## Skill 不是万能提示词

一个好 Skill 应该回答四件事：

1. 什么任务会触发它；
2. 它要保护哪些不变量；
3. 什么证据才算完成；
4. 哪些相似任务不应该触发它。

边界和能力同样重要。比如 `evidence-grounded-research` 约束的是研究建议：每个重要改进都要有可追溯论文或已完成实验，并给出迁移边界和可证伪测试。普通工程重构不需要它，否则只会给低风险工作增加摩擦。

## 从问题簇拆出能力

目前的原创 Skill 可以分为三层：

### 研究决策层

`evidence-grounded-research` 防止“听起来合理”替代真实证据。它要求把已检查证据、由此做出的推断、具体提案与能推翻提案的实验分开写清楚。

### 协作契约层

`research-collaboration-contract` 处理多轮任务中的语义漂移。继续、保留、同样、仅限、完成与可比不再是模糊修饰词，而是需要落实到 checkpoint、loss、prompt、split、状态和交付物的操作约束。

### 执行护栏层

`research-evidence-guard` 插件包含两个更窄的 Skill：

- `benchmark-evidence-audit` 检查协议身份证、逐行覆盖、解析与指标分母；
- `training-run-guard` 检查 GPU 所有权、真实进度、续训 provenance、scheduler 与完成证据。

这两个 Skill 还带有小型审计脚本。它们不会替代科研判断，只负责把行数、唯一 key、completion sidecar、optimizer step 和 checkpoint 必需文件这些客观门槛变成可执行检查。

## 如何记录个人 Skills

这个博客新增了一个持续维护的 [Skills 目录](/skills/)。每条记录包含：

- 归属：原创、参与维护或采用的社区能力；
- 解决的问题与典型触发场景；
- 当前维护状态；
- 所属插件与公开来源（若有）。

我刻意没有公开本机路径、私有数据和完整内部指令。公开记录的目标是解释设计选择与能力边界，不是把工作环境原样上传。

## 接下来如何判断它们是否有用

Skill 的价值最终不由文档长度决定，而由真实任务中的失败率决定。后续我会关注三类信号：是否减少协议返工，是否更少把 partial run 当成完整结果，以及用户修正后任务是否能稳定保持新约束。

如果一个规则从未改变实际决策，它就不应该继续留在 Skill 里。经验需要沉淀，但沉淀物也需要定期清理。
