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

- [ ] 2026-08-08 注册表〔待补〕项写实：ztl-symphony（CLI/API 调用方式、会话生命周期）、ztl-agent-mgmt（12 skill 清单核对）、ztl-content（目录与 Linear 对接）、lao-law-lib（管道用法与本地路径）——需把对应仓库挂进会话通读。
- [ ] 2026-08-08 claude.ai 账户级陈旧副本停用（用户手工）：fs-notes-lao、bol-exchange-rate、ztl-content-writing-loop/ztl-linear-content-writing-loop 二留一；wht-processor、journal-cleanup 确认后处置。清单详见 bps 仓库分支 `claude/agent-orchestration-platform-uw5xvv` 的 `_archive\2026-08-MP分层路由改造记录.md`。
- [x] 2026-08-09 bps 分层路由改造分支**已裁定废弃**（用户删除分支）；改造记录存档 `docs/2026-08-bps分层路由改造记录-存档.md`（含 17 skill 隐藏清单+承接矩阵+账户级停用清单），日后想启用照单重做即可。
- [ ] 第二期躯干：见 `MP-PLATFORM-BLUEPRINT.md` 实施清单 1-6（Telegram 网关 → symphony 对接 → 滴答看板 → 同步盘数据面 → 定时任务 → 三场景验收）。
- [ ] 弃用仓库 GitHub Archive（用户手工）：ztl-agent、ZTL-SYSTEM、ztl-ai-system、Monthly-Tax-Submit、Mr.-ZTL、sole-prop-bookkeeping。

## 已完成

- [x] 2026-08-08 MP 仓库建仓落盘（章程/注册表/路由表/mp agent/SOP/蓝图）。
- [x] 2026-08-09 ZTL_Manage（并入 ZTL_Customers）整体迁 WorkDrive `ZTL-Manage` 并完成云端 MCP 读写验证；routing-table 云覆盖 gate 删除，数据面全云端。
