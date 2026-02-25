/**
 * 門戶數據定義
 */
const portalData = [{
        title: "數據監控儀表板",
        desc: "即時追蹤各項系統指標與專案進度，支援多維度視覺化報表。",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`,
        link: "#dashboard",
        category: "analytics"
    },
    {
        title: "文檔庫系統",
        desc: "存放開發指南、API 文件與標準作業流程 (SOP)。",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>`,
        link: "#docs",
        category: "info"
    },
    {
        title: "UI 元件中心",
        desc: "提供符合設計規範的 React 與 Vue 元件預覽與程式碼複製。",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
        link: "#ui-kits",
        category: "design"
    },
    {
        title: "API 自動化測試",
        desc: "整合測試環境 API 調用與連通性檢測工具。",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>`,
        link: "#testing",
        category: "dev"
    },
    {
        title: "資產部署管理",
        desc: "快速切換測試與正式環境，監控部署版本與狀態。",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.5 19c.703 0 1.352-.234 1.882-.63a4.5 4.5 0 0 0-1.382-8.37A6.5 6.5 0 1 0 5.5 17.5c.2 0 .393-.01.583-.028A4.492 4.492 0 0 0 10.5 22h7a4.5 4.5 0 0 0 0-9h-1.5"/></svg>`,
        link: "#deploy",
        category: "ops"
    },
    {
        title: "團隊技術討論區",
        desc: "內部經驗分享、QA 問答以及最新的技術選型討論。",
        icon: `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>`,
        link: "#forum",
        category: "community"
    }
];

/**
 * 動態渲染卡片列表
 */
function renderPortal(data) {
    const grid = document.getElementById('portalGrid');
    if (!grid) return;
    
    if (data.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 2rem; color: #64748b;">找不到相符的功能模組...</p>';
        return;
    }

    grid.innerHTML = data.map(item => `
        <a href="${item.link}" class="portal-card" data-title="${item.title}">
            <div class="card-icon">
                ${item.icon}
            </div>
            <h3>${item.title}</h3>
            <p>${item.desc}</p>
            <div class="card-footer">
                進入系統
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
        </a>
    `).join('');

    // 註冊卡片點擊後的模擬行為
    document.querySelectorAll('.portal-card').forEach(card => {
        card.addEventListener('click', (e) => {
            const link = card.getAttribute('href');
            if (link.startsWith('#')) {
                e.preventDefault();
                showToast(`系統提示：『${card.dataset.title}』目前為開發中狀態。`);
            }
        });
    });
}

/**
 * 顯示 Toast 訊息
 */
function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.innerText = message;
    toast.style.display = 'block';
    setTimeout(() => {
        toast.style.display = 'none';
    }, 3000);
}

/**
 * 頁面初始化與事件綁定
 */
document.addEventListener('DOMContentLoaded', () => {
    renderPortal(portalData);

    // 搜尋過濾功能
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            const filtered = portalData.filter(item =>
                item.title.toLowerCase().includes(term) ||
                item.desc.toLowerCase().includes(term)
            );
            renderPortal(filtered);
        });
    }

    // 導覽列滾動陰影效果
    const navbar = document.getElementById('mainNavbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 30) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
});