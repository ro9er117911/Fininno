# CLAUDE.md — Fininno 專案 AI 開發指引

## 專案概述
這是一個「虛擬資產保管與報表」MVP，包含三個工作區：
1. **bank-custody-portal** (Web)：銀行審核端 Portal (Next.js + TS + Tailwind + shadcn/ui)
2. **custody-client-app** (App)：客戶端 App (Expo + TS)
3. **shared** (Domain)：共用領域模型、狀態機、API 規格

## 工程約束 (Engineering Constraints)

### 語言與格式
- 所有 UI 文案使用 **zh-TW**（繁體中文），i18n 架構保留
- 欄位命名使用 **英文 camelCase**，UI label 使用中文
- Commit message 使用英文，格式：`feat:`, `fix:`, `docs:`, `refactor:`
- Mermaid 語法中所有標點符號必須使用半形（ASCII）字元

### 技術棧（已定案）
| 層級 | 技術 |
|------|------|
| Web Portal | Next.js 14 (App Router) + TypeScript + Tailwind CSS + shadcn/ui + TanStack Table + React Hook Form + Zod |
| Client App | React Native (Expo SDK 51+) + TypeScript + React Navigation + Zustand |
| API Mock | Next.js Route Handlers 或 MSW，保留 OpenAPI 3.0 規格 |
| 測試 | Vitest (純函式) + Playwright (E2E，可選) |
| Monorepo | pnpm workspace |

### 安全與合規
- **不連真鏈、不連真交易所**；所有鏈上資料用 mock
- 欄位需對齊真實世界：`txHash`, `chain`, `address`, `confirmations`, `riskScore`
- PII/敏感資料預設遮罩，解鎖行為寫入 audit log
- 所有關鍵操作必須有稽核軌跡 (audit trail)

### RBAC 角色
| 角色 | 權限 |
|------|------|
| Ops | 檢視全部、OpsReview、建立對帳處置 |
| Risk | 檢視全部、RiskReview、凍結/解凍（需理由） |
| Approver | Approvals 工作台、最終核決（簽核/退回） |

### 狀態機
所有狀態轉換必須：
1. 使用純函式 `xxxTransition(currentState, action, actorRole) -> nextState | error`
2. 每次 transition 生成 `AuditEvent`
3. 有對應的單元測試

### 必做清單（不可省略）
- [ ] 狀態機：TransferRequest, WhitelistAddress, Alert, Case
- [ ] RBAC 畫面級 + 操作級 guard
- [ ] CSV 匯出（交易明細、年度報表）
- [ ] 完整導覽、空狀態、錯誤狀態、Loading skeleton
- [ ] Demo Runbook 頁面 (/demo-runbook)
- [ ] Audit log 可查詢

## 檔案結構慣例
```
fininno/
├── packages/
│   ├── portal/          # Next.js Web Portal
│   ├── client-app/      # Expo Client App
│   └── shared/          # 共用 domain models, state machines, types
├── docs/
│   ├── openapi.yaml     # OpenAPI 3.0 規格
│   ├── state-machines.md
│   ├── SDD.md           # Software Design Document
│   └── PREREQUISITES.md
├── CLAUDE.md            # 本檔案
├── README.md
├── pnpm-workspace.yaml
└── package.json
```

## 開發順序
1. **Phase 0 (現在)**：SDD、Prerequisites、Domain Model、State Machines
2. **Phase 1**：shared domain + API mock + Portal 核心頁面
3. **Phase 2**：Client App + Demo Runbook + 視覺化圖表
4. **Phase 3**：E2E 測試、Polish、文檔完善

## 參考資料
- [prompt.md](./prompt.md) — 主需求文件
- [web_prompt.md](./web_prompt.md) — Portal 細節
- [app_prompt.md](./app_prompt.md) — Client App 細節
- [api.md](./api.md) — API 與狀態機規格
