let allStocks = [
    { ticker: "AAPL", name: "Apple Inc.", market: "SP500", sector: "Technology", price: 232.50, mcap: 3.55, pe: 34.2, pbv: 48.5, divYield: 0.45, roe: 147.2, de: 1.8, gpm: 46.2, npm: 23.9 },
    { ticker: "NVDA", name: "NVIDIA Corp.", market: "SP500", sector: "Technology", price: 138.20, mcap: 3.40, pe: 58.4, pbv: 52.1, divYield: 0.03, roe: 115.4, de: 0.4, gpm: 75.3, npm: 55.0 },
    { ticker: "MSFT", name: "Microsoft Corp.", market: "SP500", sector: "Technology", price: 420.10, mcap: 3.12, pe: 35.1, pbv: 12.3, divYield: 0.72, roe: 38.5, de: 0.5, gpm: 69.4, npm: 35.8 },
    { ticker: "ADVANC", name: "Advanced Info Service", market: "SET", sector: "Technology", price: 285.00, mcap: 0.85, pe: 24.5, pbv: 9.8, divYield: 3.85, roe: 35.4, de: 1.9, gpm: 35.2, npm: 15.6 },
    { ticker: "PTT", name: "PTT Public Co.", market: "SET", sector: "Energy", price: 33.50, mcap: 0.95, pe: 9.2, pbv: 0.85, divYield: 6.20, roe: 9.8, de: 0.9, gpm: 15.2, npm: 6.1 }
];

let filteredStocks = [...allStocks];
let currentSort = { column: null, asc: false };

function switchTab(tab) {
    if (tab === 'filter') {
        document.getElementById('tab-filter').classList.remove('hidden');
        document.getElementById('tab-results').classList.add('hidden');
        document.getElementById('btn-tab-filter').className = "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm transition";
        document.getElementById('btn-tab-results').className = "px-4 py-2 bg-slate-700 text-slate-200 font-medium rounded-lg text-sm transition";
    } else {
        document.getElementById('tab-filter').classList.add('hidden');
        document.getElementById('tab-results').classList.remove('hidden');
        document.getElementById('btn-tab-results').className = "px-4 py-2 bg-blue-600 text-white font-medium rounded-lg text-sm transition";
        document.getElementById('btn-tab-filter').className = "px-4 py-2 bg-slate-700 text-slate-200 font-medium rounded-lg text-sm transition";
    }
}

function applyFilters() {
    const universe = document.getElementById('filter-universe').value;
    const sector = document.getElementById('filter-sector').value;
    const watchlistStr = document.getElementById('filter-watchlist').value.toUpperCase();
    const watchlist = watchlistStr ? watchlistStr.split(',').map(s => s.trim()) : [];

    const roeMin = parseFloat(document.getElementById('filter-roe').value) || -Infinity;
    const deMax = parseFloat(document.getElementById('filter-de').value) || Infinity;
    const gpmMin = parseFloat(document.getElementById('filter-gpm').value) || -Infinity;
    const npmMin = parseFloat(document.getElementById('filter-npm').value) || -Infinity;
    const peMax = parseFloat(document.getElementById('filter-pe').value) || Infinity;
    const pbvMax = parseFloat(document.getElementById('filter-pbv').value) || Infinity;
    const divMin = parseFloat(document.getElementById('filter-div').value) || -Infinity;

    filteredStocks = allStocks.filter(s => {
        if (universe === 'SET' && s.market !== 'SET') return false;
        if (universe === 'SP500' && s.market !== 'SP500') return false;
        if (universe === 'WATCHLIST' && watchlist.length > 0 && !watchlist.includes(s.ticker)) return false;
        if (sector !== 'ALL' && s.sector !== sector) return false;
        if (s.roe < roeMin || s.de > deMax || s.gpm < gpmMin || s.npm < npmMin) return false;
        if (s.pe > peMax || s.pbv > pbvMax || s.divYield < divMin) return false;
        return true;
    });

    document.getElementById('summary-count').innerText = filteredStocks.length;
    document.getElementById('match-count').innerText = filteredStocks.length;
    renderTable();
}

function renderTable() {
    const tbody = document.getElementById('stock-table-body');
    tbody.innerHTML = '';
    filteredStocks.forEach(s => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-slate-700/50 transition cursor-pointer";
        tr.innerHTML = `
            <td class="p-3 font-bold text-blue-400 sticky-col border-r border-slate-700/50" onclick="openModal('${s.ticker}', '${s.name}', '${s.market}')">
                <div>${s.ticker}</div>
                <div class="text-xs font-normal text-slate-400 truncate max-w-28">${s.name}</div>
            </td>
            <td class="p-3">${s.price.toFixed(2)}</td>
            <td class="p-3">${s.mcap ? s.mcap.toFixed(2) + 'B' : '-'}</td>
            <td class="p-3">${s.pe ? s.pe.toFixed(1) : '-'}</td>
            <td class="p-3">${s.pbv ? s.pbv.toFixed(1) : '-'}</td>
            <td class="p-3 text-emerald-400">${s.divYield ? s.divYield.toFixed(2) + '%' : '-'}</td>
            <td class="p-3">${s.roe ? s.roe.toFixed(1) + '%' : '-'}</td>
            <td class="p-3">${s.de ? s.de.toFixed(1) : '-'}</td>
            <td class="p-3">${s.gpm ? s.gpm.toFixed(1) + '%' : '-'}</td>
            <td class="p-3">${s.npm ? s.npm.toFixed(1) + '%' : '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function sortTable(col) {
    if (currentSort.column === col) currentSort.asc = !currentSort.asc;
    else { currentSort.column = col; currentSort.asc = false; }
    filteredStocks.sort((a, b) => currentSort.asc ? (a[col]||0)-(b[col]||0) : (b[col]||0)-(a[col]||0));
    renderTable();
}

function openModal(ticker, name, market) {
    document.getElementById('modal-ticker').innerText = ticker;
    document.getElementById('modal-name').innerText = name;
    document.getElementById('btn-financials').onclick = () => {
        if (market === 'SET') window.open(`https://www.settrade.com/th/equities/quote/${ticker}/financial-statement/five-years`, '_blank');
        else window.open(`https://finance.yahoo.com/quote/${ticker}/financials`, '_blank');
    };
    document.getElementById('btn-chart').onclick = () => {
        window.open(`https://www.tradingview.com/chart/?symbol=${ticker}`, '_blank');
    };
    document.getElementById('btn-gemini').onclick = () => {
        const prompt = encodeURIComponent(`ช่วยวิเคราะห์งบการเงินและแนวโน้มของหุ้น ${ticker} (${name}) ให้หน่อยครับ`);
        window.open(`https://gemini.google.com/app?prompt=${prompt}`, '_blank');
    };
    document.getElementById('action-modal').classList.remove('hidden');
}

function closeModal() { document.getElementById('action-modal').classList.add('hidden'); }
function resetFilters() { applyFilters(); }
applyFilters();
