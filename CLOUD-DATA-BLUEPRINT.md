# 云端数据面蓝图（CLOUD-DATA-BLUEPRINT）— Zoho WorkDrive 为主存储

> 2026-08-09 用户拍板：数据主存储 = Zoho WorkDrive。目标：任何电脑/云端会话都能做同样的操作，不再依赖一台常开机的电脑。
> 本文是数据面的单一权威；routing-table 云覆盖 gate、workspace-registry 数据依赖条目均以本文为准。

## 三层数据分治

| 数据类型 | 云端归宿 | 状态 |
|---|---|---|
| 流程/知识/台账（md、代码、注册表、KB） | GitHub 各工作区仓库 | ✅ 已云端 |
| 代账客户资料、PDF 原件、Excel 底稿 | WorkDrive `10_BPS`（本地 `Z:\10_BPS\` 即 TrueSync 映射视图） | ✅ 已在云端，只需路由改写记号 |
| 管理文档数据库：原 `D:\ZTL_Manage\`（含并入的原 `D:\ZTL_Customers\` 商务客户主档） | WorkDrive 团队文件夹 `ZTL-Manage`（客户主档=其子目录 `03_customers`；根含 `_meta`/`00_Inbox`/`01_商机`/`02_合同和结算`/`05_模板`） | ✅ 2026-08-09 迁入完成，云端 MCP 读（列目录/下载）写（建文件/改名）已验证 |
| `D:\_BPS\`（旧 PBC 文件夹） | ⛔ 废弃（2026-08-09 裁定），不迁移，路由不得指向 | 已从路由/注册表清除 |
| `D:\ZTL_Manage\`、`D:\ZTL_Customers\`（本地旧根） | ⛔ **废弃（2026-08-09 用户裁定）**——迁移完成后二者即失效，**任何流程/skill/任务包不得再读写它们**，一律走 WorkDrive `ZTL-Manage`（客户主档 = 其 `03_customers`） | 🔄 MP 侧文档已切；mgmt 仓库 11 文件 37 处硬编码待切（见 backlog） |
| `D:\ZTL_Manage\_meta\` 中需流程消费的资料 | 按需整理修改后移入 ztl-agent-mgmt 仓库（git 化），移一批引用切一批 | 🔄 按需进行 |

## 路径记号

- 云端统一记号：`wd:10_BPS/<客户>/<年份>/...`、`wd:ZTL-Manage/...`（目录结构与 bps `shared\代账目录标准.md` 同构）。
  - ⚠️ 团队文件夹名是 **`ZTL-Manage`（连字符）**，不是 `ZTL_Manage`（下划线）——下划线是本地旧目录名，写进记号会指向已废弃的本地根。
  - 常用定位：客户主档 `wd:ZTL-Manage/03_customers/<客户简称>_<全称>/`；商机 `wd:ZTL-Manage/01_商机/<编号>_<名称>_<年.月>/`；六张索引表 `wd:ZTL-Manage/_meta/db/`。
- 本地盘符（Z: 等）只是 TrueSync 兼容视图，**权威在云端**；任何电脑装 TrueSync 即同构。
- ⛔ `D:\ZTL_Manage\`、`D:\ZTL_Customers\` 不在此列——它们**不是**云端的 TrueSync 视图，而是迁移前的旧副本，已废弃；写进去的东西不会同步到云端，等于丢件。

## 双通道访问

- **云端会话**：zoho-workdrive MCP（搜索/列目录/下载/上传/共享链接）。
- **本地会话**：TrueSync 映射盘符，习惯不变。
- **单写者纪律**：同一客户同一期间的写盘任务串行（防 MCP 上传与 TrueSync 同步冲突，沿用 bps §4.2 裁定）。

## 大文件访问纪律（ZTL-Manage 商机/合同原件的 token/速度治理）

原件（PDF/扫描件）体量大，直接读又慢又烧 token。三条纪律：

1. **索引先行**：`wd:ZTL-Manage/_meta/db/` 六张表是单一事实来源，每条含关键字段+原件 WorkDrive 路径指针。任何任务先查表——金额、期限、状态、对方是谁等 90% 的问题查表即答，全程不碰原件。
2. **原件按需**：索引答不了（要看条款原文）才下载原件，且只取命中的那一份；PDF 按页提取，不整本灌上下文。MP 任务包【参数】必须写明确指针（表行 ID/文件路径），禁止「把合同文件夹都读一遍」式泛读——用户命令若是泛读式表述，MP 先收窄为索引查询。
3. **摘要沉淀**：合同/商机归档时（mgmt-onboard-opportunity / mgmt-archive-project 流程）生成一页「档案卡」md（当事方/金额/期限/关键条款/原件指针），存 `_meta\db\` 旁；后续任务读档案卡（几百 token）而非原件（几万 token）。存量不补做，用到哪份惰性补哪份。

## 剩余步骤

1. ✅ `D:\ZTL_Manage\`（并入 `D:\ZTL_Customers\`）整体迁 WorkDrive `ZTL-Manage`（2026-08-09 完成，936 文件/472 文件夹/1.06 GB）。⚠️ 迁移只搬了数据，**没切引用**——同日广能发商机单执行时，mgmt 域 skill 仍按硬编码本地路径写盘，成果全落在已废弃的 `D:\ZTL_Manage\01_商机\` 与 `D:\ZTL_Customers\` 而非云端。教训：迁数据与切引用必须同批做，否则旧根会继续"看起来正常地"接收写入。
2. ✅ 云端 MCP 读写验证（2026-08-09）：列团队文件夹/列目录/下载解码 CLAUDE.md ✅；`00_Inbox` 下建文件+改名 ✅（遗留测试文件 `_MCP验证通过_请删除此文件`，MCP 无删除接口，请人工删）。
3. ✅ routing-table 云覆盖 gate 已删除（消歧规则 6 改为「数据面已全云端」）。bps 仓库 `shared\代账目录标准.md` 加云根记号仍在 backlog。
4. 去单机化收尾（**Claude Code 云端会话方案**，2026-08-09 用户选定）：入口改 claude.ai App 直连 MP 云端会话（拆除 Telegram 常驻网关）；执行走云端会话在目标仓库起会话，数据全 MCP，淘汰 `--add-dir Z:\10_BPS` 盘符参数；定时任务走 Routines/CronCreate。symphony 代码改造记 backlog，另会话执行。
