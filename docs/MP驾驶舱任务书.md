# 任务书 v2：MP 驾驶舱（编排总线版 · WorkBuddy 式）

> **v2 重大变更（2026-08-09 用户终裁）**：驾驶舱不再是滴答看板的前端视图，而是**编排总线本身**——录入→定域→直接 spawn Claude Code 执行→结果/决策选项回到界面。滴答降为只读镜像。v1（滴答总线版）作废。
> 下发方式：在 claude.ai/code 对 **yangxiyun/ztl-symphony** 仓库开云端会话，把本文整段贴给它。
> 必读（ztl-mp 仓库 main）：`dida-board-contract.md`（字段语义沿用，总线角色变更见其头部标注）、`routing-table.md`（定域+模型分级）、`client-aliases.md`、`docs/MP-Project指令.md`。

## 用户需求（不删减）

一、任务录入：一句话写进去（例「整理CRCT2026年7月的PBC资料」）→ 自动经 MP 定域派单执行。
二、任务状态监控；对决策事项的反馈；生成结果的链接一键直达。
三、可视化面板：今日/本周/本月完成任务、待跟进事项；四类别=营销传播/项目销售前期/项目执行/财务人力资源。
四（v2 新增核心）：**编排不经滴答**——直接调 Claude Code 执行，结果与决策选项直接在界面反馈。

## 架构

- `dashboard/`：Node 服务（`0.0.0.0:8848`，LAN，无公网）+ 单文件 `index.html`（原生 JS 零构建零 CDN，响应式）。访问令牌 `MP_DASH_TOKEN`（未配置仅允许 localhost）。运维 `scripts/dashboard.ps1 {start|stop|status|install-autostart}`（⚠️ 脚本用 ASCII 或 UTF-8 BOM，防 PowerShell 5.1 编码坑）。
- **本地任务库**：`dashboard/tasks.db`（SQLite；若想零依赖用 JSON 文件库+写锁也可）——**任务单一状态源**，字段沿用看板契约语义：id/标题/客户/期间/类别（四选一）/工作区代号/入口/模型档/状态（queued|running|awaiting_decision|review|done|error）/产出列表/sessionId/时间戳。
- **runner 内核复用**：从 `orchestrator/orchestrator.js` 提炼可复用模块（或直接 require 其函数）：spawn `claude` CLI（`-p --output-format json`、`--model/--effort` 按 L/M/H 映射）、`--resume` 续跑、`return-parser.js` 解析 AGENT-RETURN 六段、**同客户串行互斥、并发槽（5）、重试退避、失败升一档**——这些纪律复用不重写。工作区 cwd 仍按 `cfg.workspaces` 白名单。
- **MP 定域**：复用 `gateway/mp-dispatch.js` 的 headless 定域逻辑（产出：工作区代号/入口/客户/期间/类别/模型档/任务包文本）。

## API

1. `POST /api/dispatch` {text}：定域 → 写 tasks.db（queued）→ runner 排队执行 → 返回任务对象。**不建滴答卡驱动执行**。
2. `GET /api/tasks`：全量任务列表（分状态），前端轮询或经 SSE 增量。
3. `GET /api/events`：SSE——任务状态变更、执行过程事件（复用/扩展 `logs/events.jsonl` 事件流，按 taskId 关联）实时推前端。
4. `POST /api/decision` {taskId, answer}：把裁定（如 `1A 2B`）经 `--resume` 喂回该任务会话续跑；状态 awaiting_decision→running。
5. `GET /api/files?path=`：空间浏览（TrueSync 映射盘白名单：`Z:\10_BPS` 与 ZTL-Manage 映射根，配置在 `dashboard/config.json`；resolve 后必须仍在根内，防目录穿越；pdf/图片内联预览，其余下载）。

## 界面（单页）

- **录入区**：输入框 + 场景芯片（`dashboard/scenes.json` 可自定义，预置：整理资料/月度做账/月度报税/开票/写公众号文章/报价/查法规——点击填模板句「整理〈客户〉〈yyyy-mm〉PBC 资料」改词即发）。
- **任务台**：按状态分组的任务卡（排队/执行中/待决策/待复核/完成/失败）；执行中卡可展开「执行过程」时间线（SSE）；**待决策卡把 AGENT-RETURN【待决策】的回答清单解析成可点选项按钮**（1A/1B 结构），也留自由文本框；完成卡显示产出链接（解析到空间浏览视图或 WorkDrive 链接）一键直达。
- **面板**（下半屏）：今日/本周/本月完成数（tasks.db 统计，不再依赖滴答 completed API）；四类别色块聚合（读任务的类别字段）；「待跟进」置顶（awaiting_decision + error）。
- 浅色、克制、手机单列堆叠，不引图表库。

## 滴答降级为只读镜像

- 每单创建/状态变更/完成时**异步**同步一张简化卡到滴答（标题+状态前缀+产出链接）；**绝不带 `agent-ready`/`agent-*` 执行标签**（防 orchestrator 老轮询抢跑）——建议直接建到一个新清单「MP镜像」或在原清单用 `mirror` 前缀标题。镜像失败只记日志，不阻塞主流程。
- orchestrator 的滴答轮询通道**保留不删**：claude.ai App 的 MP Project 仍经滴答建卡派单（异地备用通道），两总线并行，以驾驶舱为主。

## Telegram 切总线

- `gateway/gateway.js` 收消息改为 POST 本机 `http://127.0.0.1:8848/api/dispatch`（驾驶舱未启动时回落老滴答路径并提示）；【待决策】经 Telegram 推送，用户回 `symphony: 1A 2B` 由网关转 `/api/decision`（老习惯兼容）。

## 开发顺序（保底线）

- **P0**：任务库 + runner 复用 + dispatch/tasks/decision 三 API + 任务台界面 + 面板统计 + 滴答镜像。P0 即可用。
- **P1**：SSE 执行过程时间线、空间浏览、场景芯片、Telegram 切总线。
- **不做**：Office 生成/通用本地整理/多模型切换界面/桌面 App 打包。

## 约束

- 不删不破坏现有 orchestrator/gateway 滴答通道；驾驶舱代码自成一体，公共逻辑以 require 复用为先，确需改动原文件时保持向后兼容。
- 凭据全走现有环境变量；代码/文档无真实密钥。
- 云端无法联调本地 claude CLI/滴答没关系：逻辑对齐 + 写清本地自测步骤，不编造已验证。
- 交付含 `docs/驾驶舱使用说明.md`（启动/手机访问/令牌/排查）。

## 完成后

commit 推新分支 `feat/mp-dashboard`（不动 main）。回报：结果一句话 + 文件清单 + 用户本地启动三步 + 下一步一句话。
