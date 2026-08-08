# 工作区注册表（workspace-registry）— 单一权威

> 「一人公司」组织架构：**仓库 = 员工，MP = 领导**。MP 定域只看本表；域内细节以各仓库自己的 CLAUDE.md/MANIFEST 为准。
> 状态：✅ 活跃在编 ｜ 🔧 基础设施 ｜ ⛔ 弃用（MP 永不派单）
> 最后更新：2026-08-08（初版；标〔待补〕处需挂载对应仓库通读后写实）

## 在编员工

### ztl-bps-workspace（会计+税务主力）✅
- **本地**：`D:\ztl-agent-v2` ｜ **GitHub**：yangxiyun/ztl-bps-workspace
- **岗位**：代账做账全流程 + 老挝月度/按次税务申报 + 质控预审 + 应收账款。41 skill + 8 编排 agent。
- **接单范围（触发词）**：做账/loop/序时账/银行核对/往来对账/调汇/月结/结账/TB/报表/附注/上传表/凭证复核；报税/VAT/PIT/WHT/预扣税/特区附加/税金汇总/申报表；复核 TB·报表·申报表/质控/预审；开票/应收/催款/核销/AR；客户资料整理/建档/PBC（**场景例：整理 CRCT 2026-06 客户资料 → 本仓库**）。
- **入口**：整月做账=`@accounting-loop-flow`；月度报税=`@lao-tax-monthly-filing-flow`；WHT 按次=`@wht-filing-flow`；单独月结=`@lao-month-end-close`；质控=`@qc-review-accounting-flow`/`@qc-review-tax-flow`/`@qc-review-flow`；应收=`@ztl-ar`；资料整理=`lao-pbc-file-organizer`（经 loop 卡片0 或直呼）。
- **数据依赖**：代账根 `D:\_BPS\`、`Z:\10_BPS\`（多根注册表见其 `shared\代账目录标准.md`）；`D:\ZTL_Customers\` 商务主档。**云端执行前提=同步盘已覆盖对应客户目录**，否则派回本地会话。
- **上报协议**：AGENT-RETURN v1（其 ARCHITECTURE.md §3.5，全平台协议权威）。
- **分层路由改造**：17 skill 隐藏 + MANIFEST/CLAUDE 同步在其分支 `claude/agent-orchestration-platform-uw5xvv`（2026-08-08 用户裁定暂不并 master，保持分支存放）。

### ztl-agent-mgmt（管理+报价）✅
- **本地**：`D:\ztl-agent-mgmt` ｜ **GitHub**：yangxiyun/ztl-agent-mgmt
- **岗位**：商机/项目管理、报价、归档。2 agent（`mgmt-workflow-router`、`pricing-quote-flow`）+ 12 skill（7 mgmt-* + 4 ztl-pricing-* + annual-portfolio-rollover）。
- **接单范围**：报价/报价函/工时/复杂度；商机/立项/转项目/归档/管线复盘/证照归档/收件分拣。
- **入口**：管理类=`@mgmt-workflow-router`；报价类=`@pricing-quote-flow`。
- **例外**：新增代账客户建档（mgmt-new-bps-client）与通用模板填充（doc-template-fill）在 bps 仓库。
- 〔待补：挂载后核对 12 skill 清单与数据依赖（D:\ZTL_Manage db）〕

### laos-compliance-kb（Lao-wiki 合规知识库）✅
- **本地**：`D:\laos-wiki` ｜ **GitHub**：yangxiyun/laos-compliance-kb（公开）
- **岗位**：老挝合规知识库（税务/会计/工商/人力资源四域 + 业务经验库），Obsidian+GitHub 双面。三层架构（原始资料/Wiki 页面/META），`META/SCHEMA.md` 是宪法。
- **接单范围**：加入知识库/收进 Lao-wiki/摄入这份法规/这篇文章存档知识库；查老挝法规/税法/DTA/合规问题（**场景例：把这篇文章加到 Lao-wiki → 本仓库**）。
- **入口**：摄入=`laos-kb-ingest` 工作流（文件放 `待摄入/` → 生成 Wiki 页 → 更新 META/Index+Log → git push）；查询=直接在该仓库会话提问。
- **数据依赖**：仓库自含，云端可全流程执行（无本地盘依赖）。

### ztl-content（公众号/内容）✅
- **本地**：`D:\ZTL_Content` ｜ **GitHub**：yangxiyun/ztl-content
- **岗位**：研究文章、公众号选题库与成稿。
- **接单范围**：写文章/公众号/改写成 N 字/按大纲写/按批注改/选题（**场景例：把这篇改写成 1200 字公众号文章 → 本仓库**）。
- **入口**：写作闭环 skill `ztl-content-writing-loop`（claude.ai 账户级 Cowork 插件，Linear Issue/Document 驱动；论据源=laos-compliance-kb）。⚠️ 账户级有一对同 description 副本（ztl-content-writing-loop / ztl-linear-content-writing-loop），二留一后本表更新为留用名。
- 〔待补：挂载后核对仓库内目录与 Linear 工作流的对接方式〕

### lao-law-lib（法规翻译+OCR 管道）✅
- **GitHub**：yangxiyun/lao-law-lib
- **岗位**：老挝法律中文翻译、老文 OCR（lozh.py 管道：Google Vision OCR + Translate）。
- **接单范围**：翻译这部法规/OCR 老文件/lozh 跑一批；产出排版走 bps 仓库账户级 skill `lao-law-layout`（法规译文→正式 Word）。下游知识沉淀 → laos-compliance-kb。
- 〔待补：挂载后核对管道脚本用法与目录约定〕

## 执行引擎与基础设施

### ztl-symphony（执行引擎）🔧
- **GitHub**：yangxiyun/ztl-symphony
- **角色**：JS 编排器——驱动 Claude Code 会话执行派单：按工作区起独立会话、`--resume` 同 session 续跑省 token、`symphony: 1A 2B` 应答续跑、AGENT-RETURN v1 对齐方（`orchestrator/prompt-builder.js` 的 AGENT_RETURN_SPEC/AUTONOMY_CONTRACT）。
- **MP 关系**：MP 定域后经 symphony 在目标仓库起执行会话（第二期 Telegram 网关的承载层）。
- 〔待补：挂载后写实 CLI/API 调用方式与会话生命周期〕

### ticktick-mcp（滴答清单 MCP server）🔧
- 任务看板承载（第二期「MP 派工单」项目）。

## ⛔ 弃用名单（2026-08-08 确认，MP 永不派单；建议 GitHub Archive 防混淆）

ztl-agent（旧 D:\ZTL_Agent 指挥层前身）、ZTL-SYSTEM、ztl-ai-system、Monthly-Tax-Submit、Mr.-ZTL、sole-prop-bookkeeping（加拿大副业）。

## 不纳入管辖

ztl-laobooks（试验品，2026-08-08 裁定）、my-web-blog（个人网站）。
