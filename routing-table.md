# 全局路由表（routing-table）— 意图 → 工作区 → 入口

> MP 定域用。第一列命中即派单；多列疑似命中 → 按「消歧规则」；仍不明 → 问用户。
> 域内细路由不在本表（归各仓库编排 agent）。最后更新：2026-08-08 初版。

## 主路由表

| 用户意图（触发词族） | 工作区 | 入口 | 备注 |
|---|---|---|---|
| 做账/loop/帮 XX 做 X 月/序时账到手 | ztl-bps-workspace | @accounting-loop-flow | 四要件：客户/月份/目录/卡片子集 |
| 整理客户资料/PBC 归位/资料清单（例：整理 CRCT 2026-06 资料） | ztl-bps-workspace | @accounting-loop-flow 卡片0（或直呼 lao-pbc-file-organizer） | 单纯归档不做账→直呼 skill |
| 月度报税/全套申报/交接包 | ztl-bps-workspace | @lao-tax-monthly-filing-flow | 税务先于会计 |
| WHT/预扣税/02/境外付款/补税台账 | ztl-bps-workspace | @wht-filing-flow | 按次，不入月度节奏 |
| 单独月结/关账/月底分录/期末调汇 | ztl-bps-workspace | @lao-month-end-close | 与 loop 卡片3 二选一 |
| 复核 TB/报表/底稿；复核申报表；文档预审/泛化把关 | ztl-bps-workspace | @qc-review-accounting-flow / @qc-review-tax-flow / @qc-review-flow | 只审不改 |
| 开票/应收/催款/核销/计算表复核 | ztl-bps-workspace | @ztl-ar | |
| 单点：录进项/销项、算个税、折旧表、附注、上传表、汇率、Excel 工具 | ztl-bps-workspace | 对应可见 skill 直连 | **直连白名单，禁扇出** |
| 报价/报价函/工时估算 | ztl-agent-mgmt | @pricing-quote-flow | |
| 商机/立项/归档/管线/证照/收件分拣 | ztl-agent-mgmt | @mgmt-workflow-router | |
| 新增代账客户建档 | ztl-bps-workspace | mgmt-new-bps-client | 管理域例外，留 bps |
| 加入知识库/收进 Lao-wiki/摄入法规（例：这篇文章加到 Lao-wiki） | laos-compliance-kb | laos-kb-ingest 摄入流 | 文件放 待摄入/ 起步 |
| 查老挝法规/税法/DTA/合规咨询 | laos-compliance-kb | 仓库会话直接提问 | 只查不摄入 |
| 写文章/公众号/改写成 N 字/按批注改（例：改写 1200 字公众号文章） | ztl-content | ztl-content-writing-loop（账户级插件） | 论据源=laos-compliance-kb |
| 翻译老挝法规/老文 OCR | lao-law-lib | lozh.py 管道 | 排版→lao-law-layout；沉淀→kb |

## 消歧规则（跨工作区易混点）

1. **"文章"三分**：写/改写 → ztl-content；收藏进知识库 → laos-compliance-kb；发布到个人网站 → 不管辖（my-web-blog）。
2. **"法规"三分**：翻译/OCR → lao-law-lib；结构化入库 → laos-compliance-kb；排版成交付 Word → lao-law-layout（bps 账户级）。
3. **"客户资料"**：代账客户的 PBC → bps；商机/合同类资料 → mgmt。
4. **"报价" vs "开票"**：报价（未成交）→ mgmt；开票/应收（已成交）→ bps @ztl-ar。
5. **"复核/把关"不带对象** → 先问对象；带对象按 qc 三 agent 分域。
6. **数据位置 gate**：任务要碰 D:\_BPS / Z:\10_BPS 而当前会话在云端且同步盘未覆盖 → 派回本地会话执行，不要在云端硬跑。

## 直连白名单（简单任务禁扇出，token 纪律）

bps 可见 24 skill 均可直连；bps 的 17 个隐藏 skill（清单见其分支 `claude/agent-orchestration-platform-uw5xvv` 的 `_archive\2026-08-MP分层路由改造记录.md`；该分支按用户裁定暂不并 master）只经编排 agent 或用户 /name，MP 不直接派它们；分支未合并期间 bps 域内为全可见状态，不影响 MP 定域。
