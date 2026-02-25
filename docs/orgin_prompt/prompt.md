你是「銀行級金融產品」的 Staff Product Designer + Staff Frontend Engineer + Security Engineer。
目標：做一個可 Demo 的「虛擬資產保管與報表」MVP（Phase 1–2），包含兩個前端：
A) 銀行審核端 Web（內部：Ops/Compliance/Risk/主管核決）
B) 客戶 App（外部：企業/高資產客戶檢視與提交申請）

核心範圍（必做）：
1) 資產總覽：法幣資產、虛擬資產（託管中/待入庫/凍結中）、歷史淨值、曝險分布
2) 入庫/出庫：白名單地址、風險分級、冷卻期、審批流程（多角色授權，Maker-Checker-Approver）
3) 風險中心：詐騙/可疑交易警示、可疑交易狀態、跨業照會紀錄、客訴入口
4) 稅務與對帳：交易明細匯出、成本基礎管理提示（證券性質與否分流）、年度報表

台灣金融環境假設（寫入 UI 文案與流程限制）：
- AML/CFT：高風險交易需升級審查與留痕；所有關鍵操作必須有稽核軌跡（audit trail）
- 轉出需冷卻期（cooling period）與地址白名單；新增白名單地址需獨立審批
- 權限分離：至少三種角色（Ops / Risk / Approver），並支援雙人/多人授權（m-of-n）
- PII/敏感資料：預設遮罩，僅授權角色可解鎖，且解鎖行為寫入 audit log

交付物要求：
- 直接產出可執行的 repo（含 README、環境變數範本、seed 資料、mock API）
- UI 全部使用 zh-TW（i18n 架構保留），欄位命名與錯誤訊息可直接 Demo
- 內建 Demo 資料：至少 10 個客戶、30 筆入庫/出庫、20 個警示、10 個案件、3 種資產（BTC/ETH/USDT）
- 視覺化：資產淨值折線、資產分布圓餅/長條、警示趨勢、審批 SLA 分布
- 驗收：每個核心流程至少 1 條 happy path + 1 條 risk/escalation path，且能在 UI 看到狀態機推進
- 所有關鍵事件（建立申請/送審/核准/退回/凍結/解凍/匯出）必須寫入 audit log，可在 UI 查到

技術建議（可改但要一次定案寫進 README）：
- Web：Next.js + TypeScript + Tailwind + shadcn/ui + TanStack Table + React Hook Form + Zod
- App：React Native (Expo) + TypeScript + React Navigation + Zustand
- API：先做 mock（Next route handlers 或 MSW），再保留 OpenAPI 3.0 規格檔（/docs/openapi.yaml）
- 不連真鏈、不連真交易所；所有鏈上資料用 mock，但欄位要對齊真實世界（txHash、chain、address、confirmations、riskScore）

不可省略：
- 狀態機（至少）：TransferRequest、WhitelistAddress、AlertCase
- RBAC 權限與畫面級/操作級 guard
- CSV 匯出（交易明細、年度報表摘要）
- 完整導覽、空狀態、錯誤狀態、Loading skeleton


請在 Portal 內建一個 /demo-runbook 頁面（只在 demo 模式顯示），按順序導引操作：
1) Dashboard：今日 AUM、待審、警示、凍結金額（用圖表與 KPI）
2) 客戶頁：某客戶資產總覽 + 近期出庫申請（點進去）
3) 出庫申請詳情：顯示白名單地址、風險分數、冷卻期、審批時間軸；一鍵「送審」
4) Approvals：用角色切換（Ops -> Risk -> Approver）完成核決，展示權限分離
5) Risk Center：拉出一筆高風險警示，示範升級成案件、凍結、補件要求
6) Reports：匯出交易明細 CSV、年度摘要頁
7) Audit：查到剛才所有操作的稽核事件（含 PII 解鎖）

同時在 Client App 內建 demo flow：
- 首頁看到出庫狀態時間軸推進
- 收到「需要補件」通知並提交（mock）
- 報表頁匯出交易明細