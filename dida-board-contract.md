# 滴答看板契约（dida-board-contract）— 「MP派工单」的唯一硬约定

> **单一权威。** 所有建卡方与认领方全部按本文件对齐。
>
> | 角色 | 谁 | 状态 |
> |---|---|---|
> | 建卡 | claude.ai App 的「MP」Project（走滴答 connector） | ✅ 规格见 §3 与 `docs/MP-Project指令.md` |
> | 建卡 | Telegram 网关 `ztl-symphony/gateway/`（bot `@ztl_mp_bot`） | ✅ 2026-08-09 已补 `ws-*` 标签 |
> | 认领 | 本地 orchestrator（10 秒轮询，已装开机自启） | ✅ 主认领方 |
> | 认领 | 云端 routine（兜底） | ⛔ 未实现，见 §6 |

> 本文件在 2026-08-09 之前**不存在**——这正是 App 侧 MP 建的卡全部卡死的根因：它无从知晓这套约定。
> 与各仓库文档冲突时，**看板字段以本文件为准**。最后更新：2026-08-09。

## 0. 三十秒速查

| 建一张能跑起来的卡，必须同时满足 | 值 |
|---|---|
| projectId | `6a74a5b8e9ae7900000002b0`（清单「MP派工单」） |
| columnId | `6a74a5e7e9ae7900000002d6`（**Todo 列**，最易漏，漏了必死） |
| tags | 含 `agent-ready` **和** 一个 `ws-<代号>` |
| status | `0`（未完成） |
| content | 第 3 节模板，段标题必须是 `## 任务信息` 而非 `【任务信息】` |

四项缺任何一项，卡片都会**静静躺在看板上永远没人捡**，且不会有任何报错。

## 1. 看板坐标

**清单「MP派工单」** `6a74a5b8e9ae7900000002b0`（看板视图）

| 列 | columnId | 含义 |
|---|---|---|
| Todo | `6a74a5e7e9ae7900000002d6` | 待认领。**唯一会被扫描的列** |
| In Progress | `6a74a5f3e9ae7900000002db` | 已认领，会话执行中（含 parked 挂起态） |
| In Review | `6a74a5fee9ae7900000002e1` | 已交付，等人工复核 |
| Done | `6a74a606e9ae7900000002e8` | 复核通过，同时勾原生完成 |

**id 失效怎么办**：重建看板会让上述 id 全部作废。典型症状是**新建的卡在看板上看不见**（落进"无列"区）。用滴答 MCP `list_columns(project_id)` 重查四个 columnId，回写本节，并同步更新 `docs/MP-Project指令.md` 里内联的那两个 id。

## 2. 标签词汇表（封闭集，禁止自造）

滴答标签按**名字**引用，没有 id。下面 12 个是全集，**任何人任何时候都不得新建看板标签**——自造标签零消费方，只会制造"标签加了却叫不醒技能"的幻觉。

### 2.1 生命周期标签（认领方写，人勿手动改）

| 标签 | 语义 | 谁写 |
|---|---|---|
| `agent-ready` | **唯一入队信号**。有它 + 在 Todo 列 = 可被认领 | MP 建卡时 / 重试拨回时 |
| `agent-running` | 执行中占位，崩溃后对账用 | 认领方 |
| `agent-parked` | 卡在人工 gate（MISSING_INPUT / GATE_CONFIRM / HUMAN_ESCALATION / UNPARSED），等 `symphony:` 决策 | 认领方 |
| `agent-error` | 双语义：重试耗尽待处置；**或人工叫停开关**——挂到执行中的卡上会杀掉进程 | 认领方 / 人工 |
| `agent-reviewable` | 已 DONE 交付，等复核意见 | 认领方 |
| `agent-cloud` | 该卡由**云端兜底 routine** 接管执行（不是本地）。本地 `recover()` 见此标签必须跳过 | 云端 routine |

注：`agent-ready` 是唯一**不会被自动补建**的标签（`orchestrator.js:141-149` 显式排除），它必须预先存在，否则编排器启动直接抛错。这是刻意的人工触发闸门。

### 2.2 路由标签（MP 建卡时写，一张卡恰好一个）

| 标签 | 工作区代号 | 目标仓库 |
|---|---|---|
| `ws-bps` | `bps` | ztl-bps-workspace（本地 `D:\ztl-agent-v2`） |
| `ws-mgmt` | `mgmt` | ztl-agent-mgmt（本地 `D:\ztl-agent-mgmt`） |
| `ws-laos-wiki` | `laos-wiki` | laos-compliance-kb（本地 `D:\laos-wiki`） |
| `ws-content` | `content` | ztl-content（本地 `D:\ztl-content`） |
| `ws-lao-law-lib` | `lao-law-lib` | lao-law-lib（本地 `D:\ztl-lao-law-lib`） |
| `ws-mp` | `mp` | ztl-mp（本地 `D:\ztl-mp`） |

⚠️ **标签后缀 = 派单代号 = `orchestrator.config.json` 的 `workspaces` 键**，三者必须字面一致。**不要填 GitHub 仓库名**——`ztl-bps-workspace`、`laos-compliance-kb` 都不是合法代号，填了会导致回落到默认仓库跑错地方。对照表另见 `routing-table.md` 主路由表的「代号」列。

标签值必须与描述里 `* 工作区：` 行的值一致。认领方**优先读标签**，读不到才回落描述文本。

## 3. 建卡模板（content 字段）

段标题与 `* 字段：` 的写法都是被正则硬匹配的，**不可改写成 `【】`**，`工作区：` 行必须落在 `## 任务信息` 段内否则解析不到。

```markdown
## 任务信息

* 客户：<简称，无则（无）>
* 期间：<yyyy-mm，无则（无）>
* 任务类型：<短词，如 月度记账/资料整理/知识库摄入/公众号改写>
* 工作区：<代号，与 ws-* 标签后缀一致>
* 入口：<@agent名 或 skill名>

## 执行技能

* Skill：<裸 skill 名；若入口是 @agent/工作流名则填「（留空则由 Claude Code 自行判断路由）」>

## 执行参数

* <参数并成一行>
* 验收：<一到三条并成一行>

## 备注

* 来源：MP Project（<yyyy-mm-dd HH:mm>）
* 用户原话：<原话>
```

**标题格式**：客户与期间齐全用 `<客户> - <期间> - <任务类型>`（会被解析回结构化字段，从而享受同客户单写者互斥）；否则用 `<任务类型>｜<一句话意图前40字>`。

**模型档**不进卡片字段——执行侧按任务类型关键词自行分档（`orchestrator.config.json` 的 `model`/`effort` 两表）。MP 仍按 `routing-table.md` 在汇报里说明档位。

## 4. 状态机

```
        MP 建卡                认领                DONE               复核通过
  ─────────────►  Todo  ──────────────►  In Progress ─────────►  In Review ─────────►  Done
                   ▲    +agent-ready      -agent-ready            -agent-running        (同时勾完成)
                   │                      +agent-running          +agent-reviewable
                   │
                   └──── ERROR 重试 / 崩溃对账时拨回，重挂 agent-ready
```

- **park 不改列**：MISSING_INPUT 等挂起时停在 In Progress，只换成 `agent-parked` 标签。
- **人工叫停**：给执行中的卡挂 `agent-error` 即杀进程。

## 5. 决策回填协议

人工裁定 **写进任务描述（content）末尾**，格式 `symphony: 1A 2B`：

```
symphony: 1A 2B
```

- ⛔ **不要写在评论里**——认领方只扫描描述，不读评论（`orchestrator.js:277-282`）。评论是单向的：认领方往里写回报，人不从那里输入。
- 复核通过可直接写 `symphony: 通过`（同义词：同意/验收/确认/没问题/ok/lgtm/pass）。
- 消费后描述里的指令会被自动改写成 `~~symphony~~[已处理 <时间>]:`，这是防重放标记，别手动改回去。
- 编辑后 30 秒内不会被消费（落笔缓冲），避免读到你还没打完的内容。

## 6. 双认领方约定（本地为主，云端兜底）

> ⛔ **云端兜底目前未实现——2026-08-09 勘察发现两条硬阻断**，本节是设计契约，不是现状：
> 1. **轮询间隔**：claude.ai Routines API 最小 cron 间隔 **1 小时**，`*/10 * * * *` 会被拒。
> 2. **云端够不到滴答**：cloud routine 只能挂 claude.ai connector，而滴答既不在已装 connector 列表里，MCP registry 里也搜不到。routine 无法读写「MP派工单」。
>
> 本地侧那一半（心跳写入、`recover()` 避让 `agent-cloud`）**已实现并验证**，云端接上即可用。当前实际形态=本地 orchestrator 单认领方 + 开机自启；关机期间卡片积压在 Todo，不丢单，开机后自动补跑。

两个认领方共用同一块看板，靠**心跳 + 静置时长**避免抢同一张卡。

| | 本地 orchestrator | 云端 routine |
|---|---|---|
| 角色 | **主认领方** | 纯兜底 |
| 轮询 | 每 10 秒 | 每 10 分钟 |
| 认领条件 | 标准五条（第 0 节） | 标准五条 **且** 心跳过期 >3 分钟 **且** 卡片已静置 ≥15 分钟 **且** 同客户无 in-flight |
| 接管标记 | `agent-running` | `agent-running` + `agent-cloud` |

**心跳**：独立清单 `__symphony-heartbeat__`（id `6a782cd1049e2ce726a1a894`）里标题为 `local-orchestrator` 的单张卡，本地 orchestrator 每 60 秒改写其 content：

```
本地 orchestrator 在线心跳

lastBeat: 2026-08-09T07:32:35.485Z
pid: 7676
running: 1/5
```

云端 routine 每轮第一件事就是读它——**心跳新鲜（<3 分钟）就立即结束本轮，不做任何其他动作**。这是 99% 轮次要走的路径，必须极廉价：一次 `get_task_by_id` 读完就退，别顺手做别的。

⚠️ **判活必须解析 content 里的 `lastBeat:` 行，不能用任务的 `modifiedTime`。** 实测滴答在只改 content 时**不刷新 `modifiedTime`**（心跳卡的 modifiedTime 一直停在创建时刻）。用 modifiedTime 判活会让云端永远认为本地已下线，从而每 10 分钟抢一次卡。

**防双跑铁律**：本地启动时的 `recover()` 会把「带 `agent-running` 但本地无记录」的卡拨回 Todo——这会直接抢走云端正在跑的任务。因此 **`recover()` 必须跳过带 `agent-cloud` 的卡**。

## 7. 认领判据（权威实现，改代码前先看这里）

`ztl-symphony/orchestrator/dida-client.js:325` 的硬过滤：

```js
.filter((t) => (t.status ?? 0) === 0 && t.columnId === columnId && (t.tags || []).includes(labelName))
// columnId = 名为 "Todo" 的列；labelName = "agent-ready"
```

之上还有编排器侧闸门（`orchestrator.js:418-453`）：并发槽位（5）、同 identifier 不重入、重试退避窗、同客户互斥、描述里「依赖：」行的前置未完成则等待。

**卡片没动静时的排查顺序**：① 在 Todo 列吗 → ② 有 `agent-ready` 吗 → ③ `ws-*` 标签是合法代号吗 → ④ 认领方在跑吗（本地看进程/日志，云端看心跳）→ ⑤ 同客户是否已有在跑的卡挡着。
