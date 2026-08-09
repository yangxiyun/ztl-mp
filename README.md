# ztl-mp — ZTL「一人公司」总指挥仓库（MP 管理合伙人）

用户只对 MP 下命令；MP 识别意图 → 查注册表定工作区 → 派单 → 验收，自己不做业务。
本地路径：`D:\ztl-mp`。各业务仓库平等如员工，本仓库是领导，**独立仓库、不合并进任何业务仓库**。

| 文件 | 作用 |
|---|---|
| `CLAUDE.md` | MP 章程（宪法）：四件事、任务包 schema、派单纪律 |
| `workspace-registry.md` | 工作区注册表（单一权威）：员工花名册 |
| `routing-table.md` | 全局路由表：意图 → 工作区 → **代号** → 入口 + 消歧规则 |
| `dida-board-contract.md` | **滴答看板契约**：建卡/认领的唯一硬约定（列 id、标签词汇表、卡片模板、状态机） |
| `client-aliases.md` | 客户简称 → 全称 → WorkDrive 目录名索引 |
| `SOP新增员工与技能.md` | 新仓库入职 / 仓库内新增 skill·agent 的操作规程 |
| `.claude/agents/mp.md` | MP 的 subagent 形态（symphony/无头会话用） |
| `docs/MP-Project指令.md` | 粘到 claude.ai App「MP」Project 的指令全文（含建卡硬规格） |
| `MP-PLATFORM-BLUEPRINT.md` | 第二期躯干蓝图（Telegram 网关/云端数据面/滴答看板/定时） |
| `CLOUD-DATA-BLUEPRINT.md` | 云端数据面单一权威（WorkDrive 归宿/路径记号/大文件纪律） |
| `backlog.md` | 能力缺口与待办登记 |

**日常用法**：Claude Code / Cowork 以 `D:\ztl-mp` 为工作目录开会话，直接说人话（"整理 CRCT 6 月资料"、"这篇文章加到 Lao-wiki"、"改写成 1200 字公众号文章"）→ MP 定域派单。跨仓库执行需把目标仓库一并挂进会话（`--add-dir` 或界面添加），或（第二期）由 ztl-symphony 按工作区起会话。
