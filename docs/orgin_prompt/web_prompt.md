請建立「bank-custody-portal」Web 專案（Next.js + TS）。
目標：內部審核端 Portal，用來處理客戶的入庫/出庫申請、白名單地址審批、警示與案件、稅務與對帳報表。

資訊架構與頁面（必做）：
- /login（Demo 版：帳密 + 角色切換）
- /dashboard：AUM、待審件數、凍結金額、警示數、SLA、風險熱點（含圖表）
- /customers：客戶列表、KYC 狀態、風險等級、資產總覽；點進去 /customers/[id]
- /custody/transfers：入庫/出庫列表（篩選：狀態/客戶/幣別/風險分數/時間），點進去 /custody/transfers/[id]
- /custody/whitelist：地址白名單申請列表與審批；點進去 /custody/whitelist/[id]
- /approvals：統一待審工作台（Maker-Checker-Approver 流程）
- /risk/alerts：警示列表（詐騙/可疑交易/異常行為），點進去 /risk/alerts/[id]
- /risk/cases：案件管理（警示可升級成案件），點進去 /risk/cases/[id]
- /reports/reconciliation：對帳（每日/每月），差異項目列表、處置狀態
- /reports/tax：成本基礎提示與年度報表產出（含 CSV 匯出）
- /audit：稽核軌跡（可依客戶/事件類型/操作者/時間查詢），事件可展開看到 before/after diff（JSON）

核心流程（必做，UI 要能跑狀態機）：
1) 出庫申請審核：
   - 狀態：Draft -> Submitted -> OpsReview -> RiskReview -> ApproverSignoff -> Scheduled (cooling) -> Executed / Rejected / Frozen
   - 風險分數高於門檻時：必須進入 RiskReview，且強制填寫「升級理由/處置」
2) 新增白名單地址審批：
   - 狀態：Requested -> OpsVerify -> RiskScoreCheck -> Approved / Rejected
   - Approved 後才可在出庫申請選取；未核准一律不可出庫
3) 警示到案件：
   - Alert：New -> Triage -> Dismissed / Escalated
   - Case：Open -> Investigating -> Filed(STR/內控通報) -> Closed
4) 稅務與對帳匯出：
   - 可選日期範圍、客戶、幣別
   - 匯出 CSV（交易明細）+ PDF/HTML（年度摘要頁面即可）

RBAC（必做）：
- Ops：可檢視全部、可做 OpsReview、可建立對帳處置
- Risk：可檢視全部、可做 RiskReview、可凍結/解凍（需理由）
- Approver：只看 Approvals 工作台與最終核決；可簽核/退回
- 所有敏感欄位（身分證字號/地址/電話/完整錢包地址）預設遮罩；只有 Risk/Approver 可解鎖，且解鎖寫入 audit log

資料模型（請在 /src/domain 定義 type）：
Customer, Account, AssetPosition, TransferRequest, WhitelistAddressRequest, Alert, Case, ApprovalTask, AuditEvent, ReconciliationReport, TaxReport
每個模型給 10–30 筆 seed，並讓 UI 能互相連動（例如 TransferRequest 關聯 customerId、whitelistAddressId、approvalTaskIds）。

視覺化（必做）：
- dashboard：AUM 折線、資產分布、警示趨勢、SLA 分布
- customer detail：淨值走勢、幣別分布、近期交易、近期警示

工程交付（必做）：
- 提供一鍵啟動：pnpm install && pnpm dev
- 提供 E2E 以外的最低限度測試（至少：狀態機轉移純函式測試、RBAC guard 測試）
- 所有關鍵操作（送審/核准/退回/凍結/解凍/匯出/解鎖敏感欄位）都呼叫 audit logger，並可在 /audit 查到