# MP 平台第二期蓝图（躯干）：Telegram 入口 + 云端执行 + 任务看板

> 第一期（大脑：分层路由 + MP 章程/注册表/路由表）已落地。本文是第二期实施蓝图，动工前先核对 ztl-symphony 现状。
> 已拍板：入口=Telegram；数据=同步盘双端同步；引擎=ztl-symphony；看板=滴答清单；使用者=仅本人。

## 目标体验

手机 Telegram 发「整理 CRCT 6 月资料」→ MP 会话解析派单 → symphony 在 bps 工作区起执行会话 → 滴答清单出现任务卡并流转状态 → 遇 gate 时 Telegram 收到【待决策】+回答清单 → 回 `symphony: 1A 2B` → 续跑 → 完成收摘要与产出物路径。

## 架构

```
Telegram Bot（BotFather 建，仅白名单你的 user id）
   │ webhook/长轮询
   ▼
MP 网关（常驻小服务，跑在办公室电脑或云主机；Node，可并入 ztl-symphony 仓库）
   │ ①收消息→落任务队列 ②推送执行侧回报/待决策 ③接 symphony: 应答续跑
   ▼
ztl-symphony 编排器
   │ 以 ztl-mp 为工作目录起「MP 会话」（--agent mp）做定域与任务包
   ▼ 按任务包在目标工作区起执行会话（每任务独立会话=天然并行隔离）
执行工作区（bps / mgmt / kb / content / lao-law-lib）
   │ AGENT-RETURN v1 上报包回传网关
   ▼
滴答清单「MP 派工单」项目（ticktick-mcp）：建卡/状态流转（排队/执行中/待决策/完成）
```

## 实施清单（建议顺序）

1. ✅ **symphony 对接勘察**（2026-08-09）：勘察报告落 `ztl-symphony/docs/MP-对接勘察报告.md`。结论：控制平面（滴答清单）本身就是提交/续跑 API；补了两个缺口——G1 结构化事件出口（`logs/events.jsonl`）、G3 跨工作区 cwd（任务描述「工作区：<代号>」+ `cfg.workspaces` 白名单）。
2. ✅ **Telegram Bot**（2026-08-09）：`ztl-symphony/gateway/` 三模块（gateway.js 主循环 / mp-dispatch.js MP 定域会话→任务包→建卡 / telegram.js 长轮询封装），`scripts/gateway.ps1` 运维。安全已落实：仅 `MP_TG_CHAT_ID` 白名单（其余静默丢弃）、token 走 `MP_TG_TOKEN` 环境变量。**待人工**：BotFather 建 bot 配好两个环境变量后跑验收场景。
3. ✅ **任务看板**（2026-08-09）：控制平面清单原地改名「MP派工单」（在途任务零迁移），建卡=网关 createIssue，状态流转=编排器现成状态机（Todo→In Progress→In Review→Done + agent-* 标签），不另设状态源。⚠️ 滴答里另有一个空的列表项目「MP派工」（用户手建），已冗余，建议删除。
4. ✅ **云端数据面**（2026-08-09 完成，权威见 `CLOUD-DATA-BLUEPRINT.md`）：主存储 = Zoho WorkDrive。代账客户资料在 WorkDrive `10_BPS`、管理库整体迁 WorkDrive `20_ZTLMGMT`（含客户主档 `03_customers`），云端 MCP 读写已验证，路由「数据位置 gate」删除。⛔ `D:\_BPS\` 旧 PBC 文件夹废弃。
5. 🔄 **去单机化（Claude Code 云端会话方案，2026-08-09 用户选定）**：**入口三通道并存**——Telegram 网关（2026-08-09 用户改判保留，已连通）＋ claude.ai App 的 MP Project ＋ 企业微信（2026-08-09 实测裁定：**仅 V1 群机器人出向通知**，V2 入向发单因大陆备案域名要求放弃，方案见 `docs/企业微信接入方案.md`；故发单仍是 Telegram + App 两条），入口同写滴答「MP派工单」，卡片格式统一按 `dida-board-contract.md`；**执行**走 Claude Code 云端会话在目标仓库起会话（clone 即用、数据走 MCP、无盘符依赖）；**数据访问**全 MCP，淘汰 `--add-dir Z:\10_BPS` 盘符参数。盘符参数改造记 backlog，另开有权限会话执行。
6. 🔄 **MP 驾驶舱=编排总线**（2026-08-09 用户终裁，任务书 v2 见 `docs/MP驾驶舱任务书.md`）：本地单页工作台（WorkBuddy 式）——录入→MP 定域→本地任务库（tasks.db）→直接 spawn Claude Code 执行→结果/决策**选项按钮**回界面；**滴答降为只读镜像**（异步简化状态卡，手机瞥一眼用）；Telegram 网关改调驾驶舱 `/api/dispatch`；App MP Project 暂留滴答建卡作异地备用通道。
7. **定时任务**：月度申报提醒、每日 AR 简报等改用 Routines/CronCreate 云端定时，产出经同一 MCP 回报通道。
8. **验收场景**：三场景 App 端全链路跑通（CRCT 资料整理、Lao-wiki 摄入、公众号改写均纯云可跑）。

## 风险与对策

- 个人微信不做（无合规 API，封号风险）——已裁定；**Telegram 网关 2026-08-09 用户改判保留**，与 App 直连并行做双入口。
- 去单机化后无常驻机：入口=claude.ai App、执行=云端会话、状态=滴答+git、数据=WorkDrive，全链路无本地依赖。
- token 失控：MP 直连白名单+禁扇出纪律+模型分级（L/M/H 只升不降）已写入路由表；单任务再加预算上限。
- 安全：执行会话权限沿用各仓库权限模式；对外提交类动作永远 GATE_CONFIRM 人工确认。
