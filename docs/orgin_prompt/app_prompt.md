請建立「custody-client-app」App（Expo + TS）。
目標：客戶端可視化資產與提交申請（出庫/新增白名單地址/客服或客訴），並能看到審批進度與風險狀態。

導覽結構（必做）：
- Auth Stack：登入、2FA（Demo 版）、裝置綁定提示（Demo 版）
- Tab：首頁 / 交易 / 風險與通知 / 報表 / 設定

畫面（必做）：
1) 首頁（Assets）：
   - 總資產（法幣+虛擬資產）、淨值折線（30D/90D/1Y）
   - 資產列表：BTC/ETH/USDT（託管中/待入庫/凍結中）
   - 快捷入口：入庫指引、出庫申請、白名單地址
2) 交易（Transfers）：
   - 入庫：顯示入庫地址（QR）、網路（BTC/ETH/TRON 等以 mock 呈現）、確認數、注意事項
   - 出庫：選幣別、選白名單地址、輸入金額、顯示手續費估算與到帳時間（mock）、送出申請
   - 出庫送出後：顯示狀態時間軸（Submitted/OpsReview/RiskReview/ApproverSignoff/Cooling/Executed）
3) 白名單地址（Address Book）：
   - 地址列表（遮罩顯示），狀態：Approved/Pending/Rejected
   - 新增地址：填寫 label、address、chain、用途聲明；送出後進入 Pending，並可看審批意見（若被退回）
4) 風險與通知（Risk Center）：
   - 安全通知：例如「出庫冷卻期中」「發現高風險收款地址」「交易需要補件」
   - 警示詳情：顯示原因（mock）、需要客戶提供的資料（例如：資金來源、交易目的、對手方資訊）
   - 客訴入口：建立 ticket（分類、描述、附件 mock）
5) 報表（Reports）：
   - 交易明細（可篩選日期/幣別/狀態），匯出 CSV（App 端可產出檔案或以分享 sheet mock）
   - 年度摘要：成本基礎提示（依證券性質與否分流的文案與提醒），顯示年度損益（mock）
6) 設定（Settings）：
   - 個人資料（遮罩）、通知設定、裝置管理、風險揭露與同意條款（Demo 文案）

流程限制（寫進 UI 與互動，必做）：
- 出庫只能選 Approved 白名單地址；若無 Approved 地址，強制引導去新增地址
- 出庫送出後不可修改；如需更改只能撤回（若狀態仍在 Submitted）並重新送出
- 高風險警示出現時，UI 顯示「交易暫停/需要補件」狀態，且在狀態時間軸中標記 Frozen/OnHold

資料對接（必做）：
- 使用同一份 OpenAPI 規格（/docs/openapi.yaml），用 mock client 實作
- seed 資料至少：3 種資產、20 筆交易、10 個地址、10 則通知、5 個補件需求

工程交付（必做）：
- 一鍵啟動：pnpm install && pnpm start
- 最低限度測試：狀態時間軸渲染測試、API client mock 測試
- 版面需可 Demo：空狀態、Loading、錯誤態完整