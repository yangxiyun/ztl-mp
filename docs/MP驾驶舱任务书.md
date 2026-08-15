# 任务书：MP 驾驶舱（本地单页派单/监控/决策/统计面板 · WorkBuddy 式）

> 2026-08-09 用户拍板一步到位：基础四功能+面板为 **P0**，下方「P1 三项加码」同分支一次交付。**按 P0 → P1 顺序开发**：P0 是保底可用线，P1 做不完先交 P0。

> 下发方式：在 claude.ai/code 对 **yangxiyun/ztl-symphony** 仓库开云端会话，把本文整段贴给它。
> 动工前必读 ztl-mp（main）三文件：`dida-board-contract.md`（含新扩展的 `* 类别：` 行与 §3.1 `## 产出` 段）、`routing-table.md`、`docs/MP-Project指令.md`。

## 用户需求（不删减地覆盖全部）

一、最基本核心功能（自动派单）：1. 任务录入——一句话写进去，如「整理CRCT2026年7月的PBC资料」；2. 自动派单——经 MP 定域自动派到滴答上。
二、其他核心功能（滴答上没有的）：1. 任务状态的监控；2. 对决策事项的反馈；3. 生成结果的链接，支持一键直达。
三、可视化面板：单页展示今天/本周/本月完成的任务、需后续跟进的事项；任务四类别：营销传播、项目销售前期对接、项目执行、财务人力资源管理。

## 架构（已拍板）

- 新目录 `dashboard/`：Node 小服务（server.js，监听 `0.0.0.0:8848`，LAN 可达、无公网）+ **单文件前端** `index.html`（原生 HTML/CSS/JS，零构建、零 CDN，响应式，手机浏览器可用）。
- 尽量零新 npm 依赖（node 内置 http 足够；仓库已有的依赖可复用）。
- 访问令牌：环境变量 `MP_DASH_TOKEN`，前端首次输入存 localStorage，每个 API 请求携带；未配置则仅允许 localhost。
- 运维 `scripts/dashboard.ps1 {start|stop|status|install-autostart}`，照抄 orchestrator.ps1 模式。⚠️ 脚本避免中文串或存 UTF-8 BOM（wecom-package.ps1 曾因 UTF-8 无 BOM 中文乱码导致 PowerShell 5.1 解析报错）。

## 四大功能 → 四个 API

1. `POST /api/dispatch` {text}：复用 `gateway/mp-dispatch.js` headless MP 定域（与 Telegram 网关同源，ANTHROPIC_API_KEY 走本地环境）→ 按契约建卡（Todo 列 + `agent-ready` + `ws-<代号>`，content 含 `* 类别：` 四选一）→ 返回 {定域结果, 卡片id, 标题}。orchestrator 10 秒内自动认领，驾驶舱不触发执行。
2. `GET /api/board`：`orchestrator/dida-client.js` 拉「MP派工单」四列卡片（含标签/描述），前端 15 秒轮询，按 排队/执行中/待决策(agent-parked)/待复核/完成 渲染。
3. `POST /api/decision` {taskId, text}：把 `symphony: <text>` 按契约 §5 追加到卡片 **content 末尾**（⛔ 绝不写评论）；前端在待决策卡下方给输入框，展示卡内【待决策】原文。
4. 结果直达：解析卡片 `## 产出` 段（契约 §3.1），WorkDrive 链接渲染成可点按钮；无产出段给「打开滴答原卡」兜底。

## 可视化面板（同页下半屏）

- 顶部统计：今日/本周/本月完成数（Done 列 + 滴答 completed 查询，dida-client 缺接口就补）。
- 四类别聚合：读 `* 类别：` 行；旧卡兜底映射 content→营销传播｜mgmt→销售前期｜bps/lao-law-lib/laos-wiki→项目执行｜mp→财务人力。每类一色块区，内按状态分组+计数。
- 「待跟进」置顶：全部 agent-parked 与 agent-error 卡。
- 风格干净克制，浅色，手机单列堆叠；不引图表库，计数+色块+列表。

## P1 三项加码（WorkBuddy 式体验，P0 完成后做）

1. **执行过程实时日志流**：dashboard 服务 tail orchestrator 的 `logs/events.jsonl`，经 SSE（`GET /api/events`）推前端；每张执行中卡片可展开「执行过程」时间线（认领/会话启动/关键事件/回报）。按 taskId/identifier 关联事件与卡片；events.jsonl 不存在或字段对不上时优雅降级（隐藏时间线，不报错）。
2. **空间浏览**：`GET /api/files?path=` 直接读本地 TrueSync 映射盘目录树（根白名单：`Z:\10_BPS` 与 ZTL-Manage 的映射路径，配置在 `dashboard/config.json`）；前端左侧「空间」面板可逐级浏览，pdf/图片经 HTTP 内联预览，其余点击下载。⚠️ 严格路径白名单校验防目录穿越（resolve 后必须仍在根内）。卡片 `## 产出` 段的 `wd:` 记号优先解析到此视图打开。
3. **场景芯片**：输入框上方一排快捷芯片，定义在 `dashboard/scenes.json`（用户可自行增改），预置：整理资料（「整理〈客户〉〈yyyy-mm〉PBC 资料」）/月度做账/月度报税/开票/写公众号文章/报价/查法规——点击把模板句填入输入框，用户改词即发。

**不做**（边界，勿超范围）：Office 文件生成、通用本地文件整理、多模型切换界面、桌面 App 打包——这些已有 skill/会话覆盖。

## 约束

- 不改 orchestrator 认领逻辑与现有网关；驾驶舱是纯外挂（读写滴答 + 调 mp-dispatch）。
- 凭据全走现有环境变量，代码/文档不出现真实密钥。
- 云端无法联调真实滴答没关系：逻辑对齐契约 + 写清本地自测步骤，不编造已验证。
- 交付含 `docs/驾驶舱使用说明.md`：启动命令、手机访问（内网 IP:8848 + 防火墙放行）、MP_DASH_TOKEN 配置、常见排查。

## 完成后

commit 推新分支 `feat/mp-dashboard`（不动 main）。回报：结果一句话 + 文件清单 + 用户本地启动三步 + 下一步一句话。
