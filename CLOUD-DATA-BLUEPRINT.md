# 云端数据面蓝图（CLOUD-DATA-BLUEPRINT）— Zoho WorkDrive 为主存储

> 2026-08-09 用户拍板：数据主存储 = Zoho WorkDrive。目标：任何电脑/云端会话都能做同样的操作，不再依赖一台常开机的电脑。
> 本文是数据面的单一权威；routing-table 云覆盖 gate、workspace-registry 数据依赖条目均以本文为准。

## 三层数据分治

| 数据类型 | 云端归宿 | 状态 |
|---|---|---|
| 流程/知识/台账（md、代码、注册表、KB） | GitHub 各工作区仓库 | ✅ 已云端 |
| 代账客户资料、PDF 原件、Excel 底稿 | WorkDrive `10_BPS`（本地 `Z:\10_BPS\` 即 TrueSync 映射视图） | ✅ 已在云端，只需路由改写记号 |
| 管理文档数据库：`D:\ZTL_Manage\`（含并入的 `D:\ZTL_Customers\` 商务客户主档） | WorkDrive `ZTL_Manage`（`ZTL_Customers` 作其子目录） | 🔄 待整体迁入 |
| `D:\_BPS\`（旧 PBC 文件夹） | ⛔ 废弃（2026-08-09 裁定），不迁移，路由不得指向 | 已从路由/注册表清除 |
| `D:\ZTL_Manage\_meta\` 中需流程消费的资料 | 按需整理修改后移入 ztl-agent-mgmt 仓库（git 化），移一批引用切一批 | 🔄 按需进行 |

## 路径记号

- 云端统一记号：`wd:10_BPS/<客户>/<年份>/...`、`wd:ZTL_Manage/...`（目录结构与 bps `shared\代账目录标准.md` 同构）。
- 本地盘符（Z: 等）只是 TrueSync 兼容视图，**权威在云端**；任何电脑装 TrueSync 即同构。

## 双通道访问

- **云端会话**：zoho-workdrive MCP（搜索/列目录/下载/上传/共享链接）。
- **本地会话**：TrueSync 映射盘符，习惯不变。
- **单写者纪律**：同一客户同一期间的写盘任务串行（防 MCP 上传与 TrueSync 同步冲突，沿用 bps §4.2 裁定）。

## 剩余步骤

1. `D:\ZTL_Manage\`（并入 `D:\ZTL_Customers\`）整体迁 WorkDrive `ZTL_Manage`（人工，TrueSync 或网页上传）。
2. 云端会话跑一单「整理资料」（如 CRCT）验证 zoho-workdrive MCP 读写全流程。
3. 验证通过后删除 routing-table 云覆盖 gate；bps 仓库 `shared\代账目录标准.md` 加云根记号（记 backlog 交接项）。
4. 去单机化收尾：symphony 网关/编排器迁云主机或改 Claude Code remote 会话，淘汰 `--add-dir Z:\10_BPS` 类盘符参数；定时任务走 Routines。
