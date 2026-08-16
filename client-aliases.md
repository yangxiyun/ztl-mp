# 客户简称索引（client-aliases）— MP 定域用

> MP 解析用户指令中的客户简称时**先查本表**（大小写不敏感）。查不到 → 用 zoho-workdrive MCP 在 `10_BPS` 目录名里模糊搜索，唯一命中直接采用并**回写本表**；多候选列 ≤3 个请用户选；仍无才问用户，答案回写本表。
> 目录名 = WorkDrive 团队文件夹 `10_BPS`（id `ls6157e78df7b7f7e4d3f89d1fd0f19f5c466`）下实际文件夹名。种子数据 2026-08-09 自动生成自云端目录，⚠️ 为待用户确认项。
> 维护：新客户建档（mgmt-new-bps-client）时同步加行；MP 会话中新解析成功的简称随手回写。

## 代账客户（10_BPS）

| 简称/变体 | 客户 | WorkDrive 目录名 |
|---|---|---|
| HBS / 华保盛 / huabaosheng | 华保盛 | `03_HUABAOSHEN_华保盛` |
| VHD / 维海德 | 维海德老挝 | `04_VHD` |
| WWGS / 万万高速 | 万万高速 | `05_WWGS_万万高速` |
| CRCT / 中铁集装箱 | 中铁集装箱东盟国际 | `06_CRCT` |
| UTIC / 联检 / 联检科技 | 联检科技老挝 | `07_UTIC` |
| C&D / CD / CNDL / 建发 | C&D 老挝（建发） | `08_C-AND-D` |
| FAL / 富安莱 | 富安莱纺织（老挝） | `09_FAL` |
| ZTL / 致同 | 致同老挝（本所自账） | `10_ZTL` |
| PSGL / 港航 | 港航物流（Port&Shipping Logistics） | `11_PSGL` |
| INJA / 营家 | 营家物流 | `12_INJA` |
| WANDA / 万达 / 万达酒店 | 万达酒店（LATSAVONG WANDA） | `13_WANDA_万达酒店` |
| LCPI | ⚠️ 待确认全称 | `60.1_LCPI` |
| EDLT | EDLT 集团 | `60.2-EDLT` |
| LCPC | ⚠️ 待确认全称 | `60.3_LCPC` |
| CGN-EL / CGNEL | 中广核老挝（EL）⚠️ 待确认全称 | `61.1_CGN-EL` |
| CGN-TV / CGNTV | 中广核老挝（TV）⚠️ 待确认全称 | `61.2_CGN-TV` |
| ANKUANG / 鞍矿 | 鞍矿 | `ANKUANG_鞍矿` |

## 备注

- ⚠️ `10_BPS` 根下另有一个无编号的 `HUABAOSHEN_华保盛` 目录，与 `03_HUABAOSHEN_华保盛` 疑似重复，建议用户核对后删除其一（未确认前 MP 以带编号目录为准）。
- 商务客户主档（非代账目录）在 WorkDrive `20_ZTLMGMT/03_customers`，跨项目长期资料查那边。
