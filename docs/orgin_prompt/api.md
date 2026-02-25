請在同一個 monorepo 或兩個 repo 中，都放一份一致的 /docs/openapi.yaml 與 /docs/state-machines.md。
OpenAPI 至少包含：
- Auth：login, me
- Customers：list/get
- Positions：get portfolio, nav history
- Transfers：list/get/create/cancel, approve actions（以 role 決定可呼叫的 action）
- Whitelist：list/get/create, approve actions
- Alerts：list/get, triage actions
- Cases：list/get/create(from alert), update status
- Reports：reconciliation list/get, tax report get, export csv
- Audit：list/query（filters）、get event detail

狀態機（必做，寫成純函式 + 單元測試）：
- transferTransition(currentState, action, actorRole) -> nextState | error
- whitelistTransition(...)
- alertTransition(...)
- caseTransition(...)
把每次 transition 生成 AuditEvent（含 actor、timestamp、entity、before/after、reason）。

稽核事件（必做）：
eventType 範例：TRANSFER_SUBMITTED, TRANSFER_APPROVED, TRANSFER_REJECTED, TRANSFER_FROZEN, WHITELIST_REQUESTED, WHITELIST_APPROVED, ALERT_ESCALATED, CASE_FILED, PII_UNMASKED, REPORT_EXPORTED
所有事件都可在 Portal 的 /audit 搜到，並可從任一 entity detail 頁跳到相關 audit event。