# 全局路由表（routing-table）— 意图 → 工作区 → 入口

> MP 定域用。第一列命中即派单；多列疑似命中 → 按「消歧规则」；仍不明 → 问用户。
> 域内细路由不在本表（归各仓库编排 agent）。最后更新：2026-08-09（加模型档列；数据位置 gate 改云覆盖 gate）。

## 主路由表

| 用户意图（触发词族） | 工作区 | 入口 | 模型档 | 备注 |
|---|---|---|---|---|
| 做账/loop/帮 XX 做 X 月/序时账到手 | ztl-bps-workspace | @accounting-loop-flow | H | 四要件：客户/月份/目录/卡片子集 |
| 整理客户资料/PBC 归位/资料清单（例：整理 CRCT 2026-06 资料） | ztl-bps-workspace | @accounting-loop-flow 卡片0（或直呼 lao-pbc-file-organizer） | M | 单纯归档不做账→直呼 skill |
| 月度报税/全套申报/交接包 | ztl-bps-workspace | @lao-tax-monthly-filing-flow | H | 税务先于会计 |
| WHT/预扣税/02/境外付款/补税台账 | ztl-bps-workspace | @wht-filing-flow | M | 按次，不入月度节奏 |
| 单独月结/关账/月底分录/期末调汇 | ztl-bps-workspace | @lao-month-end-close | M | 与 loop 卡片3 二选一 |
| 复核 TB/报表/底稿；复核申报表；文档预审/泛化把关 | ztl-bps-workspace | @qc-review-accounting-flow / @qc-review-tax-flow / @qc-review-flow | H | 只审不改，判断密集 |
| 开票/应收/催款/核销/计算表复核 | ztl-bps-workspace | @ztl-ar | M | |
| 单点：录进项/销项、算个税、折旧表、附注、上传表、汇率、Excel 工具 | ztl-bps-workspace | 对应可见 skill 直连 | L | **直连白名单，禁扇出**；附注生成判断量偏大可升 M |
| 报价/报价函/工时估算 | ztl-agent-mgmt | @pricing-quote-flow | H | |
| 商机/立项/归档/管线/证照/收件分拣 | ztl-agent-mgmt | @mgmt-workflow-router | M | |
| 新增代账客户建档 | ztl-bps-workspace | mgmt-new-bps-client | M | 管理域例外，留 bps |
| 加入知识库/收进 Lao-wiki/摄入法规（例：这篇文章加到 Lao-wiki） | laos-compliance-kb | laos-kb-ingest 摄入流 | M | 文件放 待摄入/ 起步 |
| 查老挝法规/税法/DTA/合规咨询 | laos-compliance-kb | 仓库会话直接提问 | M | 只查不摄入 |
| 写文章/公众号/改写成 N 字/按批注改（例：改写 1200 字公众号文章） | ztl-content | ztl-content-writing-loop（账户级插件） | H | 论据源=laos-compliance-kb |
| 翻译老挝法规/老文 OCR | lao-law-lib | lozh.py 管道 | M | 重活在 Google 管道，会话只做调度；排版→lao-law-layout；沉淀→kb |

## 模型分级规则（token/成本纪律的模型维度）

三档记号 → 模型 → effort（symphony spawn 时映射为 `--model`/`--effort`）：

| 档 | 模型 | effort | 适用 |
|---|---|---|---|
| L | haiku（claude-haiku-4-5） | low | 机械性单点任务：查汇率、录单张发票、开一张票、算个税、Excel 小工具 |
| M | sonnet（claude-sonnet-5） | medium | 单 skill 有判断量：资料整理、附注、WHT 单次、KB 摄入/查询、管道调度 |
| H | opus（claude-opus-5） | high | 编排 agent 复合任务：整月做账、全套申报、质控复核、报价、写文章 |

1. **命中即取**：路由命中行的模型档为该单默认，写入任务包【模型】字段。
2. **只升不降**：MP 可就地升档（如客户首次做账、期间数据异常、用户强调质量），须在任务包注明理由；**不得降档**——低档模型跑复杂任务的返工成本高于省下的 token。
3. **失败升档**：执行侧返回 ERROR/UNPARSED 重派时自动升一档再跑。
4. 无【模型】字段时执行侧沿用其默认配置（向后兼容）。

## 消歧规则（跨工作区易混点）

1. **"文章"三分**：写/改写 → ztl-content；收藏进知识库 → laos-compliance-kb；发布到个人网站 → 不管辖（my-web-blog）。
2. **"法规"三分**：翻译/OCR → lao-law-lib；结构化入库 → laos-compliance-kb；排版成交付 Word → lao-law-layout（bps 账户级）。
3. **"客户资料"**：代账客户的 PBC → bps；商机/合同类资料 → mgmt。
4. **"报价" vs "开票"**：报价（未成交）→ mgmt；开票/应收（已成交）→ bps @ztl-ar。
5. **"复核/把关"不带对象** → 先问对象；带对象按 qc 三 agent 分域。
6. **数据面已全云端**（原「数据位置/云覆盖 gate」，2026-08-09 迁移完成并经 MCP 读写验证后删除）：代账客户资料在 WorkDrive `10_BPS`、管理库在 WorkDrive `ZTL-Manage`（含 `03_customers` 客户主档），云端会话直接经 zoho-workdrive MCP 读写执行，本地盘符只是 TrueSync 视图，不再按数据位置派回本地。⛔ `D:\_BPS\` 旧 PBC 文件夹已废弃，任何路由/任务包不得指向。云端目录标准见 `CLOUD-DATA-BLUEPRINT.md`；碰商机/合同大文件遵其「大文件访问纪律」（索引先行、原件按需、摘要沉淀，禁泛读派单）。

## 直连白名单（简单任务禁扇出，token 纪律）

bps 可见 24 skill 均可直连；bps 的 17 个隐藏 skill（清单见其分支 `claude/agent-orchestration-platform-uw5xvv` 的 `_archive\2026-08-MP分层路由改造记录.md`；该分支按用户裁定暂不并 master）只经编排 agent 或用户 /name，MP 不直接派它们；分支未合并期间 bps 域内为全可见状态，不影响 MP 定域。直连任务默认 L 档模型。
