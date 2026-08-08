# SOP：新增员工（仓库）与新增技能（skill/agent）

> 两张操作规程。原则：**域内的事在域内改，跨域归属在本仓库改**；每次改完 git commit 两侧同步。

## SOP-A 新员工入职（把一个新仓库挂进 MP 系统）

适用：新建仓库，或把既有仓库纳入 MP 管辖。

1. **仓库自备岗位说明**：该仓库根写（或完善）`CLAUDE.md`——它是干什么的、接什么活（触发词）、入口是哪个 agent/skill/工作流、数据依赖在哪。没有这份文件 MP 只能靠猜。
2. **本地落位**：克隆到 `D:\<仓库名>`（与其他员工同级）。
3. **注册表登记**：在本仓库 `workspace-registry.md`「在编员工」加一节，六要素齐全：本地路径 / GitHub / 岗位 / 接单范围（触发词）/ 入口 / 数据依赖。
4. **路由表接线**：`routing-table.md` 主表加一行；**逐条过一遍「消歧规则」**——新触发词与现有员工有没有撞车（撞车就补一条消歧）。
5. **提交**：ztl-mp commit；若第二期 symphony 网关已上线，在其工作区配置注册该目录。
6. **验收**：开一个 MP 会话，用两三句典型指令试路由，确认命中新员工。

> 快捷方式：把新仓库挂进 MP 会话后直接说「新员工入职：<仓库名>，岗位是……」——MP 按本 SOP 代办第 3-6 步，你只需最后确认。

## SOP-B 仓库内新增 skill / agent

适用：在某个员工仓库（如 bps、mgmt）里新增能力。

1. **在该仓库按它自己的规范建**：bps 仓库遵守其三条铁律（引用全名/三处一名/改前快照）+ 同步 MANIFEST/ARCHITECTURE + 跑 `/skill-audit`；其他仓库按各自 CLAUDE.md。
2. **先判层级再写 description**（分层路由纪律）：
   - **管道内部/仅被编排层 dispatch** → frontmatter 加 `disable-model-invocation: true`，触发词写进上游编排 agent 的 description；
   - **用户直呼型** → 保持可见，description 按「路由标签」标准写：做什么 + 什么时候用 + 什么时候不用（消歧），别写成功能简介。
3. **跨仓库检查**：新触发词若可能与其他工作区混淆（例：又一个"文章"类 skill）→ 更新本仓库 `routing-table.md` 消歧规则。
4. **注册表要不要动？** 只有当它成为该工作区的**新入口**（新编排 agent、新的一类接单范围）才更新 `workspace-registry.md`；域内叶子 skill 不登记（MP 不管到那一层）。
5. **验收**：该仓库会话试触发 + （若动了路由表）MP 会话试定域。

## 变更时的同步责任表

| 你改了什么 | 要同步什么 |
|---|---|
| 新仓库入职 / 仓库弃用 | workspace-registry + routing-table |
| 仓库内新增/删除**入口级** agent | workspace-registry「入口」行 + routing-table |
| 仓库内新增/删除叶子 skill | 只改该仓库自己的 MANIFEST 等，MP 侧不动 |
| 改触发词/接单范围 | routing-table 对应行 + 消歧规则复查 |
| 换本地路径/同步盘上云 | workspace-registry「本地/数据依赖」+ routing-table「数据位置 gate」 |
