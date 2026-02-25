# SDD 前置準備條件 (Prerequisites)

> 本文件定義專案正式開發前必須完成的所有準備工作。

## 1. 環境準備

### 1.1 開發工具
| 工具 | 版本要求 | 用途 |
|------|---------|------|
| Node.js | ≥ 20 LTS | Runtime |
| pnpm | ≥ 9.0 | Package manager / Workspace |
| TypeScript | ≥ 5.4 | 型別系統 |
| Antigravity / VS Code | Latest | IDE |
| Git | ≥ 2.40 | 版本控制 |

### 1.2 Monorepo 初始化
```bash
# 根目錄初始化
pnpm init
# 建立 workspace
# pnpm-workspace.yaml:
# packages:
#   - 'packages/*'
#   - 'docs'
```

### 1.3 環境變數範本
```env
# .env.example
NEXT_PUBLIC_DEMO_MODE=true
NEXT_PUBLIC_APP_NAME=銀行級虛擬資產保管平台
NEXT_PUBLIC_DEFAULT_LOCALE=zh-TW
```

---

## 2. 專案結構（已定案）

```
fininno/
├── packages/
│   ├── portal/                    # Next.js 14 (App Router)
│   │   ├── src/
│   │   │   ├── app/               # App Router pages
│   │   │   │   ├── (auth)/        # login
│   │   │   │   ├── (dashboard)/   # dashboard, customers, custody, approvals
│   │   │   │   ├── risk/          # alerts, cases
│   │   │   │   ├── reports/       # reconciliation, tax
│   │   │   │   ├── audit/         # audit trail
│   │   │   │   └── demo-runbook/  # Demo 引導頁
│   │   │   ├── components/        # UI components
│   │   │   │   ├── ui/            # shadcn/ui primitives
│   │   │   │   ├── layout/        # Sidebar, Header, Breadcrumb
│   │   │   │   ├── data-table/    # TanStack Table wrappers
│   │   │   │   └── charts/        # Recharts wrappers
│   │   │   ├── lib/               # Utilities, auth guard, i18n
│   │   │   ├── hooks/             # Custom React hooks
│   │   │   └── store/             # Zustand stores (mock data)
│   │   ├── public/
│   │   ├── next.config.js
│   │   ├── tailwind.config.ts
│   │   └── package.json
│   │
│   ├── client-app/                # Expo (React Native)
│   │   ├── src/
│   │   │   ├── navigation/        # React Navigation stacks/tabs
│   │   │   ├── screens/           # Screen components
│   │   │   ├── components/        # Shared UI components
│   │   │   ├── store/             # Zustand stores
│   │   │   └── api/               # Mock API client
│   │   ├── app.json
│   │   └── package.json
│   │
│   └── shared/                    # 共用模組
│       ├── src/
│       │   ├── domain/            # TypeScript types/interfaces
│       │   │   ├── customer.ts
│       │   │   ├── transfer.ts
│       │   │   ├── whitelist.ts
│       │   │   ├── alert.ts
│       │   │   ├── case.ts
│       │   │   ├── approval.ts
│       │   │   ├── audit.ts
│       │   │   ├── report.ts
│       │   │   └── index.ts
│       │   ├── state-machines/    # 純函式狀態機
│       │   │   ├── transfer.ts
│       │   │   ├── whitelist.ts
│       │   │   ├── alert.ts
│       │   │   ├── case.ts
│       │   │   └── __tests__/     # 單元測試
│       │   ├── rbac/              # 角色權限定義
│       │   │   ├── roles.ts
│       │   │   ├── permissions.ts
│       │   │   └── guard.ts
│       │   ├── seed/              # Mock / Seed data
│       │   │   ├── customers.ts
│       │   │   ├── transfers.ts
│       │   │   ├── alerts.ts
│       │   │   └── ...
│       │   └── audit/             # Audit event logger
│       │       └── logger.ts
│       ├── vitest.config.ts
│       └── package.json
│
├── docs/
│   ├── openapi.yaml               # OpenAPI 3.0 規格
│   ├── state-machines.md          # 狀態機文件
│   ├── SDD.md                     # Software Design Document
│   ├── PREREQUISITES.md           # 本檔案
│   └── ERD.md                     # Entity Relationship Diagram
│
├── CLAUDE.md
├── MEMORY.md
├── README.md
├── pnpm-workspace.yaml
├── package.json
├── tsconfig.base.json
└── .env.example
```

---

## 3. 前置文件清單

以下文件必須在開發前完成：

| # | 文件 | 狀態 | 說明 |
|---|------|------|------|
| 1 | `CLAUDE.md` | ✅ 完成 | AI 開發指引 |
| 2 | `MEMORY.md` | ✅ 完成 | 工程限制與領域知識 |
| 3 | `PREREQUISITES.md` | ✅ 完成 | 本文件 |
| 4 | `docs/state-machines.md` | 🔲 待做 | 狀態機完整轉換表 + Mermaid 圖 |
| 5 | `docs/openapi.yaml` | 🔲 待做 | API 規格（Phase 1 時建立） |
| 6 | `docs/SDD.md` | 🔲 待做 | 軟體設計文件 |
| 7 | `docs/ERD.md` | 🔲 待做 | 資料關聯圖 |
| 8 | `README.md` | 🔲 待更新 | 專案說明 + 啟動指引 |

---

## 4. 技術決策紀錄 (ADR)

### ADR-001: Monorepo with pnpm workspace
- **決策**：使用 pnpm workspace 管理三個 packages
- **理由**：Portal 與 Client App 共用 domain types 和 state machines，單一 repo 便於 type-safe 開發
- **替代方案**：多 repo + npm publish → 增加 CI 複雜度，不適合 MVP

### ADR-002: Next.js App Router
- **決策**：使用 Next.js 14 App Router（非 Pages Router）
- **理由**：Server Components 提升效能、Layout 嵌套適合複雜 Portal 結構
- **注意**：shadcn/ui 元件需標記 `"use client"`

### ADR-003: Zustand for State Management
- **決策**：兩端都使用 Zustand
- **理由**：輕量、TypeScript 友善、無 boilerplate、適合 mock data store

### ADR-004: shadcn/ui + TanStack Table
- **決策**：Portal 使用 shadcn/ui 元件庫 + TanStack Table
- **理由**：可客製化、無 CSS-in-JS 依賴、支援 Server Components

### ADR-005: Vitest for Unit Testing
- **決策**：狀態機與 RBAC guard 使用 Vitest 測試
- **理由**：與 TypeScript/ESM 完美相容、速度快

---

## 5. 開發階段規劃

### Phase 0：前置準備（當前）
- [x] 建立 CLAUDE.md、MEMORY.md、PREREQUISITES.md
- [ ] 初始化 monorepo + pnpm workspace
- [ ] 建立 `packages/shared` 並定義所有 domain types
- [ ] 實作狀態機純函式 + 單元測試
- [ ] 定義 RBAC roles/permissions
- [ ] 建立 seed data
- [ ] 撰寫 `docs/state-machines.md`（含 Mermaid 圖）

### Phase 1：Portal 核心（Web）
> 對應 `/Users/ro9air/Fininno/web_prompt.md`
- [ ] Next.js 初始化 + shadcn/ui 設定
- [ ] Layout（Sidebar + Header + Breadcrumb）
- [ ] /login（Demo 版角色切換）
- [ ] /dashboard（KPI 卡片 + 圖表）
- [ ] /customers + /customers/[id]
- [ ] /custody/transfers + /custody/transfers/[id]（含狀態機推進 UI）
- [ ] /custody/whitelist + /custody/whitelist/[id]
- [ ] /approvals（Maker-Checker-Approver 工作台）
- [ ] /risk/alerts + /risk/cases
- [ ] /reports/reconciliation + /reports/tax（含 CSV 匯出）
- [ ] /audit（稽核軌跡查詢 + before/after diff）
- [ ] /demo-runbook

### Phase 2：Client App（Mobile）
> 對應 `/Users/ro9air/Fininno/app_prompt.md`
- [ ] Expo 初始化 + Navigation 設定
- [ ] Auth Stack（登入 + 2FA mock）
- [ ] 首頁（資產總覽 + 淨值折線）
- [ ] 交易（入庫 QR + 出庫申請 + 狀態時間軸）
- [ ] 白名單地址（列表 + 新增）
- [ ] 風險與通知（安全通知 + 警示詳情 + 客訴）
- [ ] 報表（交易明細 + 年度摘要）
- [ ] 設定（個人資料 + 通知 + 裝置管理）

### Phase 3：Polish & Integration
- [ ] OpenAPI 3.0 規格檔
- [ ] E2E 測試（可選）
- [ ] 空狀態 / 錯誤態 / Loading skeleton 全面檢查
- [ ] Demo 影片錄製
- [ ] README 更新 + 部署指引

---

## 6. Seed Data 規劃

| 資料類型 | 數量 | 重點 |
|---------|------|------|
| Customer | 10 | 包含不同 KYC 狀態、風險等級 |
| Account | 10 | 每客戶至少 1 帳戶 |
| AssetPosition | 20 | BTC/ETH/USDT，含凍結中 |
| TransferRequest | 30 | 覆蓋所有狀態 |
| WhitelistAddressRequest | 10 | 包含 Approved/Pending/Rejected |
| Alert | 20 | 含高風險/已升級/已處理 |
| Case | 10 | 含 Open/Investigating/Filed/Closed |
| ApprovalTask | 30 | 關聯至 Transfer 和 Whitelist |
| AuditEvent | 自動生成 | 每次狀態變更自動建立 |
| ReconciliationReport | 5 | 日報/月報 |
| TaxReport | 5 | 年度報表 mock |
