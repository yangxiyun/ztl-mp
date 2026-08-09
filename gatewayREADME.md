# MP Telegram 网关 v1

手机 Telegram 发单 → 常驻机 spawn MP 无头会话（cwd=D:\ztl-mp，MP 人格自动生效）→ 结果/待决策推回手机 → 回 `symphony: 1A 2B` 续跑。引擎适配器与 ztl-symphony 同款 spawn 方式；symphony 升级多工作区后可换接（网关不用改）。

## 前置

- 常驻机装好 Node ≥18、Claude Code CLI（`claude` 已登录）
- BotFather 建 bot 拿 token；@userinfobot 查你的 user id
- `workspaces.json` 里的本地路径按实际盘符核对

## 配置与启动（PowerShell）

```powershell
setx MP_TG_TOKEN "123456:ABC-xxx"     # bot token（密钥，只进环境变量，勿入 git）
setx MP_TG_CHAT_ID "你的user id"
# 重开一个 PowerShell 使 setx 生效
cd D:\ztl-mp
node gateway\gateway.js
```

手机上给 bot 发一句「整理 CRCT 2026-06 资料」试跑。

## 开机自启（任务计划程序）

```powershell
schtasks /Create /TN "MP-Gateway" /SC ONLOGON /TR "node D:\ztl-mp\gateway\gateway.js" /RL LIMITED
```

## 用法

| 你发的 | 效果 |
|---|---|
| 任意一句任务 | 新任务，MP 定域派单执行，回报推回 |
| `symphony: 1A 2B` | 续跑最近未完任务（AGENT-RETURN 待决策裁定） |
| `#T3 symphony: …` | 指定续跑任务 T3 |
| `/status` | 任务列表与状态 |

多任务天然并行（每单独立会话）。任务事件落 `gateway/tasks.log.jsonl`（已 gitignore）。

## 安全须知

- 网关只响应 `MP_TG_CHAT_ID` 一个账号（白名单），其他人加 bot 无效。
- 无头会话带 `--dangerously-skip-permissions`（无人值守必需）。它只该跑在你自己的电脑与数据上；若想收紧，把 gateway.js 里该参数换成 `--permission-mode acceptEdits` 并接受部分任务会卡在权限确认。
- 对外提交类动作的保险不在权限层，在 MP 章程红线：GATE_CONFIRM 必须回到你手机裁定后才继续。

## 已知边界（v1）

- 网关重启后旧任务不能 resume（sessionId 在内存）；用 `#旧任务 symphony:…` 会提示重新派单。
- 滴答清单「MP 派工单」看板尚未接线（backlog 第③步）。
- 引擎为 claude 直驱；symphony 目前是 Linear 驱动的 bps 单域编排器，升级多工作区后在此换适配器。
