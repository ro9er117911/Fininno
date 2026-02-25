# MEMORY.md — 工程限制與領域知識

## 領域背景 (Domain Context)

### 台灣虛擬資產保管業務
- 金管會要求虛擬資產服務提供者 (VASP) 遵循 AML/CFT 法規
- 銀行保管業務需符合「信託業法」及相關子法
- 高風險交易需升級審查並留痕（audit trail）
- 客戶盡職調查 (CDD/EDD) 分級：一般、加強、持續監控

### 核心合規要求
1. **轉出冷卻期 (Cooling Period)**：新增白名單地址後需等待一段時間才能使用
2. **地址白名單**：出庫只能轉至已審批的白名單地址
3. **權限分離 (Segregation of Duties)**：至少三角色，關鍵操作需多人授權
4. **稽核軌跡**：所有敏感操作必須可追溯（who / when / what / before / after）
5. **PII 遮罩**：身分證字號、電話、完整錢包地址預設遮罩

---

## 工程限制 (Engineering Constraints)

### EC-01: Mock Only — 不連真實區塊鏈
- 所有鏈上數據（txHash, confirmations, blockHeight）使用 seed data
- 不呼叫任何外部 API（Etherscan, Chainalysis）
- 風險分數 (riskScore) 為固定假資料，範圍 0–100

### EC-02: 前端優先 — 無後端資料庫
- 資料存放於前端 seed JSON / in-memory store
- API 透過 Next.js Route Handlers 模擬 REST endpoint
- 狀態變更寫入 memory，重新整理後 reset（Demo 用途）

### EC-03: 狀態機必須是純函式
```typescript
// 範例簽名
function transferTransition(
  currentState: TransferState,
  action: TransferAction,
  actorRole: Role
): { nextState: TransferState; auditEvent: AuditEvent } | { error: string }
```
- 不可有 side effect
- 每次呼叫必須產生 AuditEvent
- 必須有對應的單元測試（覆蓋所有合法/非法路徑）

### EC-04: RBAC 必須同時作用於畫面與操作
| Guard 類型 | 說明 | 實作方式 |
|-----------|------|---------|
| 畫面級 | 某些頁面/區塊只有特定角色可見 | Route middleware + 條件渲染 |
| 操作級 | 某些按鈕/動作只有特定角色可執行 | Action guard 純函式 |
| 欄位級 | PII 遮罩，僅授權角色可解鎖 | Field-level mask component |

### EC-05: i18n 架構保留但目前只做 zh-TW
- 使用 `next-intl` 或簡單的 JSON dict
- 所有 UI 字串不可寫死在 JSX 中
- 欄位 key 用英文，value 用中文

### EC-06: 視覺化圖表
- 使用 Recharts 或 Chart.js
- Dashboard: AUM 折線、資產分布、警示趨勢、SLA 分布
- Customer Detail: 淨值走勢、幣別分布、近期交易、近期警示

### EC-07: CSV 匯出
- 交易明細：可篩選日期/幣別/狀態
- 年度報表摘要：成本基礎提示（證券性質與否分流）
- 使用 `papaparse` 或原生 Blob

### EC-08: Demo Runbook
- Portal: `/demo-runbook` 頁面（只在 `NEXT_PUBLIC_DEMO_MODE=true` 時顯示）
- Client App: 內建 demo flow 引導

---

## 資料模型清單 (Domain Models)
> 詳細型別定義見 `packages/shared/src/domain/`

| Model | 關聯 | seed 數量 |
|-------|------|----------|
| Customer | — | 10+ |
| Account | → Customer | 10+ |
| AssetPosition | → Account | 10+ |
| TransferRequest | → Customer, WhitelistAddress, ApprovalTask[] | 30+ |
| WhitelistAddressRequest | → Customer | 10+ |
| Alert | → Customer, TransferRequest? | 20+ |
| Case | → Alert[] | 10+ |
| ApprovalTask | → TransferRequest \| WhitelistAddressRequest | 30+ |
| AuditEvent | → any entity | 自動生成 |
| ReconciliationReport | — | 5+ |
| TaxReport | → Customer | 5+ |

---

## 狀態機定義摘要

### TransferRequest
```
Draft → Submitted → OpsReview → RiskReview → ApproverSignoff → Scheduled(cooling) → Executed
                                    ↘ Rejected
                         ↘ Rejected
              ↘ Rejected
                                              ↘ Frozen (可由 Risk 隨時觸發)
```
- 風險分數 > 門檻 → 強制進入 RiskReview
- Frozen 狀態需 Risk 填寫理由

### WhitelistAddressRequest
```
Requested → OpsVerify → RiskScoreCheck → Approved
                            ↘ Rejected
                ↘ Rejected
```
- Approved 後才可在出庫申請中選取

### Alert
```
New → Triage → Dismissed
           ↘ Escalated (→ 建立 Case)
```

### Case
```
Open → Investigating → Filed(STR/內控通報) → Closed
```
