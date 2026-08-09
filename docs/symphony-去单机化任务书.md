# 任务书：ztl-symphony 去单机化改造（Claude Code 云端会话方案）

> 下发方式：在 claude.ai/code 里对 **yangxiyun/ztl-symphony** 仓库新建一个云端会话，把本文件整段贴给它。
> 出处：ztl-mp 仓库 `backlog.md` 交接项 + `MP-PLATFORM-BLUEPRINT.md` 第 5 步（2026-08-09 用户选定）。

## 背景

ZTL「一人公司」Agent 平台的数据面已全部迁到 Zoho WorkDrive（云端），最后一块依赖单机的是 symphony 编排器 + Telegram 网关——它们常驻办公室 Windows 电脑，一关机就断。用户已拍板走 **Claude Code 云端会话** 路线彻底去掉常驻程序：入口改用 claude.ai App 直连 MP 会话，执行走云端会话，数据全走 MCP。

## 目标

关掉所有本地电脑，手机/网页照样能派单执行。为此需要 4 项改造：

### 1. 拆除 Telegram 常驻网关
- 移除/停用 `gateway/`（gateway.js 主循环、mp-dispatch.js、telegram.js）与 `scripts/gateway.ps1`。
- 环境变量 `MP_TG_TOKEN`/`MP_TG_CHAT_ID` 相关逻辑一并清理。
- 保留 mp-dispatch 里「MP 定域会话→任务包→建卡」的**纯逻辑**（若有复用价值），但触发源不再是 Telegram 长轮询。

### 2. 执行改云端会话
- orchestrator 起执行会话的方式，从本地 spawn `claude` CLI（`cwd = D:\ztl-agent-v2`）改为 Claude Code 云端会话在目标仓库起会话。
- 跨工作区仍按现有「工作区：<代号>」+ `cfg.workspaces` 白名单（bps/mgmt/laos-wiki/content/lao-law-lib/mp）定位，但 cwd 概念换成云端仓库 clone。

### 3. 淘汰盘符参数，数据全走 MCP
- 删除 orchestrator spawn 命令里的 `--add-dir Z:\10_BPS` 等 Windows 盘符参数。
- 数据访问改走 MCP：WorkDrive（zoho-workdrive）、Books（zoho-books）、GitHub、滴答（ticktick）。
- 校验 `orchestrator/orchestrator.js` 里所有硬编码盘符路径（`D:\`、`Z:\`），逐一改为 MCP 调用或云端相对路径。

### 4. 定时任务改云端
- 现有 symphony cron / 月度提醒 / 每日 AR 简报，改用 Routines 或 CronCreate 类云端定时触发，产出走同一 MCP 回报通道。

## 保持不变（不要动）

- **AGENT-RETURN v1 协议**：`return-parser.js` 六段解析、`prompt-builder.js` 契约嵌入——协议本身不变。
- **滴答「MP派工单」看板**：仍是单一状态源（Todo/In Progress/In Review/Done + agent-* 标签）。
- **`symphony: 1A 2B` 续跑应答机制**：保留（决策续跑逻辑不变，只是承载会话从本地换云端）。
- **模型分级新增项**：本次可**顺带**接入 ztl-mp 已定的任务包【模型】字段——解析 L/M/H → 映射 model id（L=claude-haiku-4-5、M=claude-sonnet-5、H=claude-opus-5）+ effort（low/medium/high）传给执行会话；无字段沿用默认；ERROR/UNPARSED 重派自动升一档。（详见 ztl-mp `routing-table.md`「模型分级规则」。）

## 验收

- 无任何常驻本地进程的前提下，从 claude.ai App 发一单（如「整理 CRCT 资料」）能全链路跑通：定域→起云端执行会话→WorkDrive MCP 读写→滴答建卡流转→AGENT-RETURN 回报。
- 改造完成后回写 ztl-mp 的 `workspace-registry.md`（symphony 条目去掉「改造前单机形态」标注）与 `backlog.md`（勾掉该交接项）。
