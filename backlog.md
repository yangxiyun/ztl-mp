# backlog — 能力缺口与待办登记

> MP 发现缺口只登记不自建；每条注明发现日期与建议归属仓库。

## 待办

- [ ] 2026-08-09 【ztl-symphony】任务包【模型】字段解析：`mp-dispatch.js`/`orchestrator.js` 读 L/M/H → 映射 model id（L=claude-haiku-4-5、M=claude-sonnet-5、H=claude-opus-5）+ effort（low/medium/high）传 `--model/--effort`；无字段沿用现默认；ERROR/UNPARSED 重派自动升一档。
- [ ] 2026-08-09 【ztl-bps-workspace】mgmt-new-bps-client 建档流程补一步：同步在 ztl-mp `client-aliases.md` 加简称行。
- [ ] 2026-08-09 【用户】`client-aliases.md` 中 ⚠️ 待确认项补全（LCPI/LCPC/CGN-EL/CGN-TV 全称）；核对 `10_BPS` 下 `HUABAOSHEN_华保盛` 与 `03_HUABAOSHEN_华保盛` 疑似重复目录。
- [ ] 2026-08-09 【人工】删除 WorkDrive `ZTL-Manage/00_Inbox/` 下的 MCP 写入验证遗留文件 `_MCP验证通过_请删除此文件`（MCP 无删除接口）。
- [ ] 2026-08-09 【ztl-agent-mgmt】`_meta` 资料（含六张表）按需整理修改后移入仓库 git 化，移一批引用切一批。
- [ ] 2026-08-09 【ztl-bps-workspace】`shared\代账目录标准.md` 代账根注册表加 WorkDrive 云根记号（`wd:10_BPS/...`），并清除 `D:\_BPS\` 旧根条目（已废弃）。
- [ ] 2026-08-09 【ztl-agent-mgmt】归档类 skill（mgmt-onboard-opportunity / mgmt-archive-project）补「生成档案卡」步骤：一页 md（当事方/金额/期限/关键条款/原件 WorkDrive 指针）存 `_meta\db\` 旁；存量惰性补做。
- [ ] 2026-08-09 【ztl-symphony】去单机化（**Claude Code 云端会话方案**，用户选定，另开有该仓库权限会话执行）：①入口拆除 Telegram 常驻 gateway（`gateway/`+`scripts/gateway.ps1`），改 claude.ai App 直连 MP 云端会话；②执行改云端会话在目标仓库起会话；③淘汰 orchestrator spawn 里的 `--add-dir Z:\10_BPS` 等盘符参数，数据全走 MCP；④定时任务改 Routines/CronCreate。

- [ ] 2026-08-09 【MP Project / ztl-symphony】**手机端附件通道**：claude.ai App 的 MP Project 只有连接器（WorkDrive/滴答），无文件系统与 git，用户在手机上传的附件落不进目标仓库（本次《所得税法88号》PDF 即卡在此处，MP Project 只能建卡后停）。方案：MP Project 收到附件先经 WorkDrive MCP 转存约定中转目录（建议 `wd:ZTL-Manage/00_Inbox/_mp转交/`），任务包【参数】写 WorkDrive 指针而非本地路径；执行侧会话按指针取件后落各仓库入口目录（如 laos-compliance-kb 的 `待摄入/`）。中转目录标准写入 `CLOUD-DATA-BLUEPRINT.md`。
- [ ] 2026-08-09 【ztl-symphony / 滴答】**卡片一键转执行会话**：卡片字段规范部分已完成（见 `dida-board-contract.md`：`ws-<代号>` 路由标签 + 任务包描述模板 + 附件 WorkDrive 指针位置）。**剩余**：打通从卡片拉起 claude.ai/code 对应仓库云端会话执行 → 依赖下面的 environment_id 一项。
- [ ] 2026-08-09 【ztl-mp / 云端】**云端兜底 routine**：用 RemoteTrigger 建 10 分钟 cron，读心跳清单 `__symphony-heartbeat__`（本地 orchestrator 每 60s 写），过期 >3 分钟且卡片静置 ≥15 分钟才接管，接管卡打 `agent-cloud`。**前置卡点**：RemoteTrigger 无 list-environments 动作，需先拿到 bps/mgmt/laos-wiki/content/lao-law-lib 五个仓库的 cloud `environment_id` 才能建一次性执行会话；拿不到则退化为「云端只推通知提醒开机」。
- [ ] 2026-08-09 【laos-compliance-kb】**法规原件迁 WorkDrive**：仓库 36M 里 17M 是 `处理完成/` 的 21 个 PDF + 7 个 doc，全部纳入 git（`.git` 已 19M），而真正的知识只有 87 个 md、几百 KB。每摄入一部法规仓库涨几 MB 且 PDF 不可 diff。方案=原件移入 WorkDrive 新目录，md 内改为 `CLOUD-DATA-BLUEPRINT.md` 已约定的路径记号引用，仓库本体留 GitHub 不动。⛔ 已排除 Google Drive（会变成 WorkDrive+GDrive+GitHub 三套存储，与单一数据面裁定冲突）。
- [ ] 2026-08-09 【用户手工】滴答删除 5 个已弃用的自造标签：`bps` / `pbc-organize` / `laos-compliance-kb` / `法规摄入` / `mp派工单`（滴答 MCP 无删标签接口）。它们已从在用卡片上摘除，只剩废弃卡 `【整理】HBS 2026-07 PBC 资料` 上还挂着 `bps`/`pbc-organize`。路由改用 `ws-*` 封闭集，见 `dida-board-contract.md` §2。
- [ ] 2026-08-09 【ztl-mp】MP Project 指令文本补「能力边界」段：明确 App Project 只做识别/定域/落卡+WorkDrive 读写与纯咨询，凡需动 git 仓库/本地文件的执行一律转 Claude Code（本地或 claude.ai/code 云端会话），避免用户误判为故障。
- [ ] 2026-08-08 注册表〔待补〕项写实：ztl-symphony（CLI/API 调用方式、会话生命周期）、ztl-agent-mgmt（12 skill 清单核对）、ztl-content（目录与 Linear 对接）、lao-law-lib（管道用法与本地路径）——需把对应仓库挂进会话通读。
- [ ] 2026-08-08 claude.ai 账户级陈旧副本停用（用户手工）：fs-notes-lao、bol-exchange-rate、ztl-content-writing-loop/ztl-linear-content-writing-loop 二留一；wht-processor、journal-cleanup 确认后处置。清单详见 bps 仓库分支 `claude/agent-orchestration-platform-uw5xvv` 的 `_archive\2026-08-MP分层路由改造记录.md`。
- [x] 2026-08-09 bps 分层路由改造分支**已裁定废弃**（用户删除分支）；改造记录存档 `docs/2026-08-bps分层路由改造记录-存档.md`（含 17 skill 隐藏清单+承接矩阵+账户级停用清单），日后想启用照单重做即可。
- [ ] 第二期躯干：见 `MP-PLATFORM-BLUEPRINT.md` 实施清单（①symphony 对接 ✅ ②Telegram 网关 ✅但从未连通、已裁定拆除 ③滴答看板 ✅ ④云端数据面 ✅ ⑤去单机化 🔄 ⑥定时任务 🔄 ⑦三场景验收）。
- [ ] 弃用仓库 GitHub Archive（用户手工）：ztl-agent、ZTL-SYSTEM、ztl-ai-system、Monthly-Tax-Submit、Mr.-ZTL、sole-prop-bookkeeping。

## 已完成

- [x] 2026-08-08 MP 仓库建仓落盘（章程/注册表/路由表/mp agent/SOP/蓝图）。
- [x] 2026-08-09 **滴答派单断链修复**：App 侧 MP 建的卡全部卡死无人认领。根因=看板契约从来没被写下来（缺 columnId、缺 `agent-ready`、自造语义标签、描述用【】格式、工作区填 GitHub 仓库名而非白名单代号），外加 `workspaces.content` 指向已弃用的 `D:\ZTL_Content` 导致 content 任务静默跑进 bps 仓库。产出：新建 `dida-board-contract.md`；路由表加代号列；Project 指令补建卡硬规格；symphony 侧 `ws-*` 标签路由 + 拆 Z 盘全局闸 + `recover()` 避让 `agent-cloud` + 在线心跳。
- [x] 2026-08-09 ZTL_Manage（并入 ZTL_Customers）整体迁 WorkDrive `ZTL-Manage` 并完成云端 MCP 读写验证；routing-table 云覆盖 gate 删除，数据面全云端。
