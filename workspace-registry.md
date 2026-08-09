# 工作区注册表（workspace-registry）— 单一权威

> 「一人公司」组织架构：**仓库 = 员工，MP = 领导**。MP 定域只看本表；域内细节以各仓库自己的 CLAUDE.md/MANIFEST 为准。
> 状态：✅ 活跃在编 ｜ 🔧 基础设施 ｜ ⛔ 弃用（MP 永不派单）
> 最后更新：2026-08-09（挂载 ztl-symphony/ztl-agent-mgmt/ZTL_Content/lao-law-lib 四仓通读写实；ZTL_Content 一项因仓库内无 CLAUDE.md/git 记录、未提及 Linear，仍标注为待用户澄清，非本轮遗漏）

## 在编员工

### ztl-bps-workspace（会计+税务主力）✅
- **本地**：`D:\ztl-agent-v2` ｜ **GitHub**：yangxiyun/ztl-bps-workspace
- **岗位**：代账做账全流程 + 老挝月度/按次税务申报 + 质控预审 + 应收账款。41 skill + 8 编排 agent。
- **接单范围（触发词）**：做账/loop/序时账/银行核对/往来对账/调汇/月结/结账/TB/报表/附注/上传表/凭证复核；报税/VAT/PIT/WHT/预扣税/特区附加/税金汇总/申报表；复核 TB·报表·申报表/质控/预审；开票/应收/催款/核销/AR；客户资料整理/建档/PBC（**场景例：整理 CRCT 2026-06 客户资料 → 本仓库**）。
- **入口**：整月做账=`@accounting-loop-flow`；月度报税=`@lao-tax-monthly-filing-flow`；WHT 按次=`@wht-filing-flow`；单独月结=`@lao-month-end-close`；质控=`@qc-review-accounting-flow`/`@qc-review-tax-flow`/`@qc-review-flow`；应收=`@ztl-ar`；资料整理=`lao-pbc-file-organizer`（经 loop 卡片0 或直呼）。
- **数据依赖**：代账根 = WorkDrive `10_BPS`（本地 `Z:\10_BPS\` 为 TrueSync 映射视图；目录标准见其 `shared\代账目录标准.md`）。⛔ `D:\_BPS\` 旧 PBC 文件夹 2026-08-09 裁定废弃，不得再指向。商务客户主档随 ZTL_Customers 并入 WorkDrive `ZTL_Manage`（见 mgmt 条目）。**云端会话经 zoho-workdrive MCP 直接读写执行**（云覆盖 gate 见 routing-table 消歧规则 6；数据面权威见 `CLOUD-DATA-BLUEPRINT.md`）。
- **上报协议**：AGENT-RETURN v1（其 ARCHITECTURE.md §3.5，全平台协议权威）。
- **分层路由改造**：17 skill 隐藏 + MANIFEST/CLAUDE 同步在其分支 `claude/agent-orchestration-platform-uw5xvv`（2026-08-08 用户裁定暂不并 master，保持分支存放）。

### ztl-agent-mgmt（管理+报价）✅
- **本地**：`D:\ztl-agent-mgmt` ｜ **GitHub**：yangxiyun/ztl-agent-mgmt
- **岗位**：商机/项目管理、报价、归档。2 agent（`mgmt-workflow-router`、`pricing-quote-flow`）+ 12 skill（7 mgmt-* + 4 ztl-pricing-* + annual-portfolio-rollover）。
- **接单范围**：报价/报价函/工时/复杂度；商机/立项/转项目/归档/管线复盘/证照归档/收件分拣。
- **入口**：管理类=`@mgmt-workflow-router`；报价类=`@pricing-quote-flow`。
- **例外**：新增代账客户建档（mgmt-new-bps-client）与通用模板填充（doc-template-fill）在 bps 仓库。
- **12 skill 清单核实（2026-08-09 通读，与描述一致）**：mgmt-* 7个（mgmt-onboard-opportunity/mgmt-convert-to-project/mgmt-archive-project/mgmt-pipeline-review/mgmt-archive-licenses/mgmt-client-insights/mgmt-inbox-triage）+ ztl-pricing-* 4个（ztl-pricing-framework/ztl-pricing-audit/ztl-pricing-bps/ztl-pricing-advisory）+ annual-portfolio-rollover 1个。2 agent 均在 `.claude\agents\`：`mgmt-workflow-router`（管理域路由入口）、`pricing-quote-flow`（报价九步法编排）。
- **数据依赖**：管理文档数据库 = WorkDrive 团队文件夹 `ZTL-Manage`（✅ 2026-08-09 由 `D:\ZTL_Manage\` 整体迁入完成并经 MCP 读写验证；商务客户主档=子目录 `03_customers`，云端会话直接读写）。`_meta\db\` 六张表（客户.md/商机.md/项目.md/合同.md/联系人.md/收款.md，单一事实来源）等 `_meta` 资料按需整理修改后移入本仓库 git 化，移一批引用切一批。其余目录 `00_Inbox`/`01_商机`/`02_合同和结算`/`04_专项工作`/`05_模板` 随整体上云。

### laos-compliance-kb（Lao-wiki 合规知识库）✅
- **本地**：`D:\laos-wiki` ｜ **GitHub**：yangxiyun/laos-compliance-kb（**私有**——2026-08-09 用户裁定由 PUBLIC 改 PRIVATE；此前为公开，`处理完成/` 内 40+ 份原件曾公开可见，如需评估影响见该日 Log）
- **岗位**：老挝合规知识库（税务/会计/工商/人力资源四域 + 业务经验库），Obsidian+GitHub 双面。三层架构（原始资料/Wiki 页面/META），`META/SCHEMA.md` 是宪法。
- **接单范围**：加入知识库/收进 Lao-wiki/摄入这份法规/这篇文章存档知识库；查老挝法规/税法/DTA/合规问题（**场景例：把这篇文章加到 Lao-wiki → 本仓库**）。
- **入口**：摄入=`laos-kb-ingest` 工作流（文件放 `待摄入/` → 生成 Wiki 页 → 更新 META/Index+Log → git push）；查询=直接在该仓库会话提问。
- **数据依赖**：仓库自含，云端可全流程执行（无本地盘依赖）。

### ztl-content（公众号/内容）✅
- **本地**：`D:\ztl-content` ｜ **GitHub**：yangxiyun/ztl-content ｜ **代号**：`content`
  ⛔ 旧路径 `D:\ZTL_Content` 已弃用且不存在。它曾被写进 symphony 的 `workspaces.content`，导致 content 任务全部静默回落到 bps 仓库执行（`orchestrator.js` 的 `fs.existsSync` 判假只打一行 warn）。2026-08-09 已修。
- **岗位**：研究文章、公众号选题库与成稿。
- **接单范围**：写文章/公众号/改写成 N 字/按大纲写/按批注改/选题（**场景例：把这篇改写成 1200 字公众号文章 → 本仓库**）。
- **入口**：写作闭环 skill `ztl-content-writing-loop`（claude.ai 账户级 Cowork 插件，Linear Issue/Document 驱动；论据源=laos-compliance-kb）。**双系统分工（2026-08-09 用户裁定）**：任务状态卡在滴答「MP派工单」，稿件工作台（Issue 大纲/Document 初稿/批注改稿）留在 Linear——Linear 是本 skill 的作业载体而非派工看板，写作任务建 Linear Issue 属正常流程。⚠️ 账户级有一对同 description 副本（ztl-content-writing-loop / ztl-linear-content-writing-loop），二留一后本表更新为留用名。
- 〔2026-08-09 复核订正：上一版按 `D:\ZTL_Content`（不存在的路径）通读，故结论「未初始化 git、只有选题候选一个目录」**是错的**。实际 `D:\ztl-content` 有 git（remote=yangxiyun/ztl-content，Initial commit 2026-07-18），含 `articles/`、`knowledge-base/`、`选题候选/`、`ztl-contents-scaffold/`、`01_选题库.xlsx`、`README.md`，共 710K。仍待澄清的只剩一项：账户级两个同 description skill（ztl-content-writing-loop / ztl-linear-content-writing-loop）的二留一裁定未定。（"仓库内未提及 Linear" 一条已由上面的双系统分工裁定解释：Linear 是账户级 skill 的作业载体，不落在本仓库里。）〕

### lao-law-lib（法规翻译+OCR 管道）✅
- **本地**：`D:\ztl-lao-law-lib`（⚠️ 非 `D:\lao-law-lib`，2026-08-09 通读核实实际路径） ｜ **GitHub**：yangxiyun/lao-law-lib
- **岗位**：老挝法律中文翻译、老文 OCR（lozh.py 管道：Google Vision OCR + Translate）。
- **接单范围**：翻译这部法规/OCR 老文件/lozh 跑一批；产出排版走 bps 仓库账户级 skill `lao-law-layout`（法规译文→正式 Word）。下游知识沉淀 → laos-compliance-kb。
- **管道用法**：`python tools/lozh.py --input gs://lao-china-trans/input/ --output gs://lao-china-trans/output/ --local-out ./translated [--force-ocr|--no-ocr] [--model nmt|tllm] [--glossary-id lao-legal-glossary] [--reuse-ocr GS_PREFIX] [--dry-run]`；输入输出须为 GCS `gs://` 路径，按文件自动分流：原生文档走 batchTranslateDocument，扫描件走 Vision OCR→版面重建→体检→translateText。
- **目录约定**：`laws/<法规ID>/` 下固定四子目录——`source/`（原件PDF只进不改）、`ocr/`（lozh.py 产物）、`work/`（排版中间产物 units.json 等，供 lao-law-layout 消费）、`release/`（定稿 `{法规简称}{编号}_{年份}_{中文|老中对照}.docx`）。
- **凭据**：需 Google Cloud ADC（`gcloud auth application-default login` 或 `GOOGLE_APPLICATION_CREDENTIALS`），默认 project `gen-lang-client-0351867985`、桶 `gs://lao-china-trans/`；仓库内无凭据文件，需人工配置。
- **与 laos-compliance-kb 交接**：⚠️ 尚未打通，仓库处于第一阶段，`work/units_final.json` 计划经待开发的 `tools/units2db.py` 导入（第二阶段），当前无对接代码/文档。

## 执行引擎与基础设施

### ztl-symphony（执行引擎）🔧
- **GitHub**：yangxiyun/ztl-symphony
- **去单机化（2026-08-09 用户选定 Claude Code 云端会话方案）**：入口**双通道并存**——Telegram 网关（用户改判保留，已连通，bot `@ztl_mp_bot`）＋ claude.ai App 的 MP Project，两者同写滴答「MP派工单」；执行走云端会话在目标仓库起会话、数据全 MCP、淘汰盘符参数；改造项记 backlog。以下描述为改造前的单机形态，逐步迁移中。
- **角色**：JS 编排器——驱动 Claude Code 会话执行派单：按工作区起独立会话、`--resume` 同 session 续跑省 token、`symphony: 1A 2B` 应答续跑、AGENT-RETURN v1 对齐方（`orchestrator/prompt-builder.js` 的 AGENT_RETURN_SPEC/AUTONOMY_CONTRACT）。
- **MP 关系**：MP 定域后经 symphony 在目标仓库起执行会话。**2026-08-09 二期落地**：①`gateway/` Telegram 网关（手机发单→headless MP 定域会话→滴答「MP派工单」建卡→事件推送→reply 决策续跑，环境变量 `MP_TG_TOKEN`/`MP_TG_CHAT_ID`）；②编排器事件流 `logs/events.jsonl`；③跨工作区执行（**优先读卡片 `ws-<代号>` 标签**，读不到才回落任务描述「工作区：<代号>」行；+ `cfg.workspaces` 白名单，代号与本表对齐：bps/mgmt/laos-wiki/content/lao-law-lib/mp）。
- **CLI 调用**：无 bin/npm script，运维走 `scripts\orchestrator.ps1 {start|stop|status|dry-run|check|install-autostart}`（内部为 `node orchestrator\orchestrator.js {run|status|dry-run|check}`）；真正执行体是它 spawn 的 `claude` CLI：`claude -p --output-format json --max-turns N [--model M --effort E] --allowedTools ... [--resume <sessionId>] --strict-mcp-config --add-dir Z:\10_BPS`，prompt 走 stdin（`orchestrator\orchestrator.js`）。
- **API/可编程调用**：无独立 API server；`linear-client.js`/`dida-client.js` 是编排器内部对 Linear GraphQL / 滴答清单 v2 API 的封装，供其自身轮询用，非对外接口。
- **会话生命周期**：每个 Linear issue 一次 claim 即 spawn 独立 claude 会话，`cwd = D:\ztl-agent-v2`；人在 issue 描述末尾粘 `symphony: 1A 2B` / `symphony: 通过/继续/<修改意见>` 触发续跑；`registry.js` 记录的 `sessionId` 存在则走 `--resume` 续跑（精简 prompt），resume 失败（session 过期等）自动回落冷启动重跑（完整任务书+断点续跑说明）。
- **AGENT-RETURN v1**：`orchestrator\return-parser.js`（`parseAgentReturn`/`parseRunOutput`）解析 claude 最终文本尾部六段（【状态】DONE/MISSING_INPUT/GATE_CONFIRM/HUMAN_ESCALATION/ERROR 等），无此块判 `UNPARSED` 按 park 处理；协议规范权威在 `D:\ztl-agent-v2\ARCHITECTURE.md §3.5`，本仓库 `orchestrator\prompt-builder.js` 只是把契约文字嵌入 prompt 的消费方。

### ticktick-mcp（滴答清单 MCP server）🔧
- 任务看板承载。**2026-08-09 已接通**：看板=symphony 控制平面清单「MP派工单」（四列 Todo/In Progress/In Review/Done + agent-* 标签），单一状态源；ticktick-mcp 供会话侧建卡/查看/管理，编排器侧走 symphony 的 dida-client.js（同一账号同一数据）。
- **看板字段规范一律以 `dida-board-contract.md` 为准**（project/列 id、封闭标签词汇表、建卡模板、状态机、决策回填、双认领方约定）。2026-08-09 之前该契约不存在，App 侧 MP 建的卡因缺 columnId、缺 `agent-ready`、自造语义标签而全部卡死无人认领——新增或改动看板字段前先读该文件。
- **认领方两个**：本地 orchestrator 为主（10 秒轮询）；云端 routine 兜底（10 分钟轮询，仅在心跳过期 >3 分钟且卡片静置 ≥15 分钟时接管，接管卡打 `agent-cloud`）。心跳载体=独立清单 `__symphony-heartbeat__`。

## ⛔ 弃用名单（2026-08-08 确认，MP 永不派单；建议 GitHub Archive 防混淆）

ztl-agent（旧 D:\ZTL_Agent 指挥层前身）、ZTL-SYSTEM、ztl-ai-system、Monthly-Tax-Submit、Mr.-ZTL、sole-prop-bookkeeping（加拿大副业）。

## 不纳入管辖

ztl-laobooks（试验品，2026-08-08 裁定）、my-web-blog（个人网站）。
