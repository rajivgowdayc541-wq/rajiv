// TradeJournal — Interactive Application State & UI Logic

// Seed Data matching Figma / reference UI
const INITIAL_TRADES = [
  {
    id: 1,
    pair: 'BTC/USD',
    direction: 'LONG',
    pnl: 240.00,
    rr: '1 : 2.4',
    date: '3 Sep 2026',
    strategy: 'EMA Breakout',
    session: 'London',
    entry: '112,450',
    exit: '113,120',
    notes: 'EMA 50 breakout with strong volume. Retest and continuation.'
  },
  {
    id: 2,
    pair: 'ETH/USD',
    direction: 'SHORT',
    pnl: -120.00,
    rr: '1 : 1.1',
    date: '2 Sep 2026',
    strategy: 'Break & Retest',
    session: 'New York',
    entry: '4,450',
    exit: '4,485',
    notes: 'Key resistance rejection failed after quick sweep.'
  },
  {
    id: 3,
    pair: 'BTC/USD',
    direction: 'LONG',
    pnl: 380.00,
    rr: '1 : 3.2',
    date: '1 Sep 2026',
    strategy: 'EMA Breakout',
    session: 'Asia',
    entry: '110,200',
    exit: '111,500',
    notes: 'Clean continuation pattern off 4H order block.'
  },
  {
    id: 4,
    pair: 'SOL/USD',
    direction: 'LONG',
    pnl: -60.00,
    rr: '1 : 0.8',
    date: '31 Aug 2026',
    strategy: 'Support Bounce',
    session: 'London',
    entry: '198.50',
    exit: '196.20',
    notes: 'Stop triggered early on sudden liquidity hunt.'
  },
  {
    id: 5,
    pair: 'XRP/USD',
    direction: 'SHORT',
    pnl: 150.00,
    rr: '1 : 1.9',
    date: '30 Aug 2026',
    strategy: 'Trend Continuation',
    session: 'New York',
    entry: '0.6250',
    exit: '0.6120',
    notes: 'Clean downward channel continuation with high volume.'
  },
  {
    id: 6,
    pair: 'BTC/USD',
    direction: 'LONG',
    pnl: 210.00,
    rr: '1 : 2.1',
    date: '29 Aug 2026',
    strategy: 'EMA Breakout',
    session: 'London',
    entry: '109,100',
    exit: '109,800',
    notes: 'Confirmed MSS on 15m timeframe.'
  },
  {
    id: 7,
    pair: 'ETH/USD',
    direction: 'SHORT',
    pnl: -200.00,
    rr: '1 : 1.3',
    date: '28 Aug 2026',
    strategy: 'Reversal',
    session: 'New York',
    entry: '4,520',
    exit: '4,580',
    notes: 'Over-extended rally broke previous high.'
  }
];

let trades = [...INITIAL_TRADES];
let activeDirection = 'LONG';
let currentTab = 'dashboard';

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  renderDashboardTrades();
  renderHistoryTrades(trades);
  renderCalendar();
  lucide.createIcons();
});

// Render Recent Trades on Dashboard (Screen 1)
function renderDashboardTrades() {
  const tbody = document.getElementById('dashboard-trades-tbody');
  if (!tbody) return;

  const recent = trades.slice(0, 5);
  tbody.innerHTML = recent.map(t => {
    const isProfit = t.pnl > 0;
    const isShort = t.direction === 'SHORT';

    return `
      <tr class="hover:bg-[#15243E]/50 transition-colors cursor-pointer group" onclick="openTradeModal(${t.id})">
        <td class="py-3.5 px-5 font-semibold text-white">${t.pair}</td>
        <td class="py-3.5 px-5">
          <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold ${
            isShort ? 'badge-short' : 'badge-long'
          }">
            ${isShort ? 'Short' : 'Long'}
          </span>
        </td>
        <td class="py-3.5 px-5 font-bold ${isProfit ? 'text-emerald-400' : 'text-rose-400'}">
          ${isProfit ? '+' : ''}$${Math.abs(t.pnl).toFixed(2)}
        </td>
        <td class="py-3.5 px-5 text-slate-300 font-mono">${t.rr}</td>
        <td class="py-3.5 px-5 text-slate-400">${t.date}</td>
        <td class="py-3.5 px-5 text-right">
          <div class="flex items-center justify-end gap-2 text-slate-500 group-hover:text-slate-300 transition-colors">
            <i data-lucide="activity" class="w-3.5 h-3.5"></i>
            <i data-lucide="more-vertical" class="w-3.5 h-3.5"></i>
          </div>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

// Render Trade History Table (Screen 3)
function renderHistoryTrades(items) {
  const tbody = document.getElementById('history-trades-tbody');
  const info = document.getElementById('history-pagination-info');
  if (!tbody) return;

  if (info) {
    info.innerText = `Showing 1 to ${items.length} of ${trades.length} results`;
  }

  if (items.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="7" class="py-8 text-center text-slate-500 text-xs">
          No trade records match the selected filters.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(t => {
    const isProfit = t.pnl > 0;
    const isShort = t.direction === 'SHORT';

    return `
      <tr class="hover:bg-[#15243E]/50 transition-colors cursor-pointer group" onclick="openTradeModal(${t.id})">
        <td class="py-3.5 px-5 font-mono text-slate-400">${t.date}</td>
        <td class="py-3.5 px-5 font-semibold text-white">${t.pair}</td>
        <td class="py-3.5 px-5">
          <span class="px-2.5 py-1 rounded-md text-[11px] font-semibold ${
            isShort ? 'badge-short' : 'badge-long'
          }">
            ${isShort ? 'Short' : 'Long'}
          </span>
        </td>
        <td class="py-3.5 px-5 font-bold font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'}">
          ${isProfit ? '+' : ''}$${Math.abs(t.pnl).toFixed(2)}
        </td>
        <td class="py-3.5 px-5 text-slate-300 font-mono">${t.rr}</td>
        <td class="py-3.5 px-5 text-slate-300">${t.strategy}</td>
        <td class="py-3.5 px-5 text-right">
          <button class="p-1 rounded-lg text-slate-500 hover:text-white transition-colors">
            <i data-lucide="chevron-right" class="w-4 h-4"></i>
          </button>
        </td>
      </tr>
    `;
  }).join('');

  lucide.createIcons();
}

// Navigation Tab Switcher
function navigateToTab(tabId) {
  currentTab = tabId;

  // Update nav buttons
  document.querySelectorAll('.nav-item').forEach(btn => {
    btn.classList.remove('active');
    btn.classList.add('text-slate-400');
  });

  const activeNav = document.getElementById(`nav-${tabId}`);
  if (activeNav) {
    activeNav.classList.add('active');
    activeNav.classList.remove('text-slate-400');
  }

  // Update tab panes
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.add('hidden');
  });

  const activePane = document.getElementById(`screen-${tabId}`);
  if (activePane) {
    activePane.classList.remove('hidden');
  }

  // Scroll to top of content
  const main = document.querySelector('main');
  if (main) main.scrollTop = 0;

  lucide.createIcons();
}

// View Mode Switcher: Interactive App vs 4-Screen Presentation Canvas
function switchViewMode(mode) {
  const interactiveContainer = document.getElementById('interactive-app-container');
  const canvasContainer = document.getElementById('presentation-canvas-container');
  const btnInteractive = document.getElementById('btn-mode-interactive');
  const btnCanvas = document.getElementById('btn-mode-canvas');

  if (mode === 'canvas') {
    interactiveContainer.classList.add('hidden');
    canvasContainer.classList.remove('hidden');

    btnCanvas.className = 'px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 bg-emerald-500 text-white shadow-xs';
    btnInteractive.className = 'px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
  } else {
    canvasContainer.classList.add('hidden');
    interactiveContainer.classList.remove('hidden');

    btnInteractive.className = 'px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 bg-emerald-500 text-white shadow-xs';
    btnCanvas.className = 'px-3 py-1.5 rounded-lg font-medium text-slate-400 hover:text-white transition-all flex items-center gap-1.5';
  }

  lucide.createIcons();
}

// Open specific screen from 2x2 Canvas
function openScreenFromCanvas(screenId) {
  switchViewMode('interactive');
  navigateToTab(screenId);
}

// Direction Segmented Control Toggle (Screen 2: Add Trade)
function setTradeDirection(dir) {
  activeDirection = dir;
  document.getElementById('form-direction').value = dir;

  const btnLong = document.getElementById('btn-dir-long');
  const btnShort = document.getElementById('btn-dir-short');

  if (dir === 'LONG') {
    btnLong.className = 'py-2 rounded-lg text-xs font-semibold transition-all bg-[#2563EB] text-white shadow-sm';
    btnShort.className = 'py-2 rounded-lg text-xs font-semibold transition-all text-slate-400 hover:text-white';
  } else {
    btnShort.className = 'py-2 rounded-lg text-xs font-semibold transition-all bg-[#F59E0B] text-white shadow-sm';
    btnLong.className = 'py-2 rounded-lg text-xs font-semibold transition-all text-slate-400 hover:text-white';
  }
}

// Notes Character Counter
function updateCharCounter(el) {
  const counter = document.getElementById('char-counter');
  if (counter) {
    counter.innerText = `${el.value.length}/200`;
  }
}

// File Upload Drag & Drop Preview
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (file) {
    const preview = document.getElementById('file-preview-name');
    if (preview) {
      preview.innerText = `Selected: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`;
      preview.classList.remove('hidden');
    }
    showToast(`Attached chart screenshot: ${file.name}`, 'info');
  }
}

// Save Trade Form Submission (Screen 2)
function handleSaveTrade(e) {
  e.preventDefault();

  const pair = document.getElementById('form-pair').value;
  const direction = document.getElementById('form-direction').value;
  const entry = document.getElementById('form-entry').value;
  const exit = document.getElementById('form-exit').value;
  const pnl = parseFloat(document.getElementById('form-pnl').value) || 0;
  const rr = document.getElementById('form-rr').value;
  const session = document.getElementById('form-session').value;
  const strategy = document.getElementById('form-strategy').value;
  const notes = document.getElementById('form-notes').value;

  const newTrade = {
    id: Date.now(),
    pair,
    direction,
    pnl,
    rr,
    date: 'Today',
    strategy,
    session,
    entry,
    exit,
    notes
  };

  trades.unshift(newTrade);

  renderDashboardTrades();
  renderHistoryTrades(trades);

  showToast(`Trade for ${pair} (${direction}) saved successfully!`, 'success');
  navigateToTab('dashboard');
}

// History Table Filters (Screen 3)
function applyHistoryFilters() {
  const pair = document.getElementById('filter-pair').value;
  const direction = document.getElementById('filter-direction').value;
  const outcome = document.getElementById('filter-outcome').value;

  let filtered = trades.filter(t => {
    if (pair !== 'ALL' && t.pair !== pair) return false;
    if (direction !== 'ALL' && t.direction !== direction) return false;
    if (outcome === 'WIN' && t.pnl <= 0) return false;
    if (outcome === 'LOSS' && t.pnl >= 0) return false;
    return true;
  });

  renderHistoryTrades(filtered);
}

function resetHistoryFilters() {
  document.getElementById('filter-pair').value = 'ALL';
  document.getElementById('filter-direction').value = 'ALL';
  document.getElementById('filter-outcome').value = 'ALL';
  renderHistoryTrades(trades);
}

// Trade Details Modal
function openTradeModal(tradeId) {
  const t = trades.find(item => item.id === tradeId);
  if (!t) return;

  const isProfit = t.pnl > 0;
  const isShort = t.direction === 'SHORT';

  const badge = document.getElementById('modal-trade-dir-badge');
  badge.className = `px-2.5 py-0.5 rounded-md text-xs font-mono font-bold ${
    isShort ? 'badge-short' : 'badge-long'
  }`;
  badge.innerText = t.direction;

  document.getElementById('modal-trade-pair').innerText = `${t.pair} Execution`;
  
  const pnlEl = document.getElementById('modal-trade-pnl');
  pnlEl.className = `text-base font-bold font-mono ${isProfit ? 'text-emerald-400' : 'text-rose-400'} mt-0.5`;
  pnlEl.innerText = `${isProfit ? '+' : ''}$${Math.abs(t.pnl).toFixed(2)}`;

  document.getElementById('modal-trade-rr').innerText = t.rr;
  document.getElementById('modal-trade-strategy').innerText = t.strategy;
  document.getElementById('modal-trade-date').innerText = t.date;
  document.getElementById('modal-trade-notes').innerText = t.notes || 'No extra retrospective notes recorded for this execution.';

  const modal = document.getElementById('trade-detail-modal');
  modal.classList.remove('hidden');
  modal.classList.add('flex');
}

function closeTradeModal() {
  const modal = document.getElementById('trade-detail-modal');
  modal.classList.add('hidden');
  modal.classList.remove('flex');
}

// Export CSV Functionality
function exportTradeData() {
  const csvRows = [
    ['ID', 'Date', 'Pair', 'Direction', 'Profit/Loss', 'Risk:Reward', 'Strategy', 'Notes']
  ];

  trades.forEach(t => {
    csvRows.push([
      t.id,
      t.date,
      t.pair,
      t.direction,
      t.pnl,
      t.rr,
      `"${t.strategy}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
  });

  const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `TradeJournal_Export_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('Trade history exported to CSV successfully', 'success');
}

// Calendar Month Grid Renderer (Bonus)
function renderCalendar() {
  const container = document.getElementById('calendar-grid-container');
  if (!container) return;

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let html = `
    <div class="grid grid-cols-7 gap-2.5 mb-3 text-xs font-semibold text-slate-400 text-center uppercase tracking-wider">
      ${days.map(d => `<div>${d}</div>`).join('')}
    </div>
    <div class="grid grid-cols-7 gap-2.5 text-xs font-mono">
  `;

  // September 2026 starts on Tuesday (offset 1)
  for (let empty = 0; empty < 1; empty++) {
    html += `<div class="p-3 rounded-xl bg-[#0B1220]/40 border border-[#1E293B]/40 opacity-30"></div>`;
  }

  for (let day = 1; day <= 30; day++) {
    let pnlDisplay = '';
    let dayBg = 'bg-[#0B1220] border-[#1E293B]';

    if (day === 1) {
      pnlDisplay = '<span class="text-emerald-400 font-bold block mt-1">+$380.00</span><span class="text-[10px] text-slate-400">1 trade</span>';
      dayBg = 'bg-emerald-500/5 border-emerald-500/20';
    } else if (day === 2) {
      pnlDisplay = '<span class="text-rose-400 font-bold block mt-1">-$120.00</span><span class="text-[10px] text-slate-400">1 trade</span>';
      dayBg = 'bg-rose-500/5 border-rose-500/20';
    } else if (day === 3) {
      pnlDisplay = '<span class="text-emerald-400 font-bold block mt-1">+$240.00</span><span class="text-[10px] text-slate-400">1 trade</span>';
      dayBg = 'bg-emerald-500/5 border-emerald-500/20';
    }

    html += `
      <div class="p-3 rounded-xl ${dayBg} border min-h-[75px] flex flex-col justify-between hover:border-slate-600 transition-colors cursor-pointer">
        <span class="text-slate-400 font-bold">${day}</span>
        <div>${pnlDisplay}</div>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
}

// Toast Notifications
function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (!toast || !toastMsg) return;

  toastMsg.innerText = msg;
  toast.classList.remove('translate-y-20', 'opacity-0');
  toast.classList.add('translate-y-0', 'opacity-100');

  setTimeout(() => {
    toast.classList.remove('translate-y-0', 'opacity-100');
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3200);
}
