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

1. **symphony 对接勘察**：通读 ztl-symphony（CLI 参数/会话生命周期/resume/应答协议实现），确认"外部程序如何提交一单+收回报"。缺 API 则加一个最小命令行/HTTP 入口。
2. **Telegram Bot**：BotFather 建 bot；网关服务实现 收消息→symphony 提交、回报→推送、`symphony: 1A 2B` → resume 续跑；**安全**：白名单 chat id、token 放环境变量、不回显敏感路径内容。
3. **任务看板**：网关在滴答「MP 派工单」项目建任务（标题=一句话意图，描述=任务包），状态随 AGENT-RETURN 流转；完成时附产出物路径。
4. **同步盘数据面**：选定 Google Drive 桌面版或 Zoho WorkDrive TrueSync，同步 `D:\_BPS\` 活跃客户（可分批）；在 bps 仓库 `shared\代账目录标准.md` 代账根注册表加「云根」条目；验证云端会话读写后，routing-table 的「数据位置 gate」按客户逐步放行云端执行。
5. **定时任务**：月度申报日历提醒、每日 AR 简报等走 Routines 或 symphony cron，产出走同一回报通道。
6. **验收场景**：三场景手机端全链路跑通（CRCT 资料整理需同步盘覆盖 CRCT；Lao-wiki 摄入与公众号改写纯云可跑）。

## 风险与对策

- 个人微信不做（无合规 API，封号风险）——已裁定 Telegram。
- 常驻机：办公室电脑或小云主机二选一；网关无状态、任务状态在滴答+git，宕机可重启续跑。
- token 失控：MP 直连白名单+禁扇出纪律已写入路由表；网关侧再加单任务预算上限。
- 安全：bot 仅白名单；执行会话权限沿用各仓库权限模式；对外提交类动作永远 GATE_CONFIRM 到 Telegram 人工确认。
