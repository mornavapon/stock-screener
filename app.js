let allStocks = [
    { ticker: "AAPL", name: "Apple Inc.", market: "SP500", sector: "Technology", price: 232.50, mcap: 3.55, pe: 34.2, pbv: 48.5, divYield: 0.45, roe: 147.2, de: 1.8, gpm: 46.2, npm: 23.9 },
    { ticker: "NVDA", name: "NVIDIA Corp.", market: "SP500", sector: "Technology", price: 138.20, mcap: 3.40, pe: 58.4, pbv: 52.1, divYield: 0.03, roe: 115.4, de: 0.4, gpm: 75.3, npm: 55.0 },
    { ticker: "MSFT", name: "Microsoft Corp.", market: "SP500", sector: "Technology", price: 420.10, mcap: 3.12, pe: 35.1, pbv: 12.3, divYield: 0.72, roe: 38.5, de: 0.5, gpm: 69.4, npm: 35.8 },
    { ticker: "GOOGL", name: "Alphabet Inc.", market: "SP500", sector: "Technology", price: 180.50, mcap: 2.20, pe: 24.5, pbv: 6.8, divYield: 0.48, roe: 31.2, de: 0.5, gpm: 58.1, npm: 27.5 },
    { ticker: "META", name: "Meta Platforms", market: "SP500", sector: "Technology", price: 580.20, mcap: 1.48, pe: 27.8, pbv: 9.5, divYield: 0.34, roe: 35.8, de: 0.3, gpm: 81.5, npm: 35.2 },
    { ticker: "JNJ", name: "Johnson & Johnson", market: "SP500", sector: "Healthcare", price: 160.40, mcap: 0.38, pe: 15.2, pbv: 5.1, divYield: 3.10, roe: 24.5, de: 0.9, gpm: 68.2, npm: 20.1 },
    { ticker: "JPM", name: "JPMorgan Chase", market: "SP500", sector: "Financials", price: 220.10, mcap: 0.62, pe: 12.4, pbv: 2.1, divYield: 2.15, roe: 17.2, de: 1.4, gpm: 85.0, npm: 31.0 },
    { ticker: "PG", name: "Procter & Gamble", market: "SP500", sector: "Consumer Discretionary", price: 170.80, mcap: 0.40, pe: 26.1, pbv: 8.2, divYield: 2.35, roe: 32.4, de: 1.1, gpm: 51.2, npm: 18.2 },
    { ticker: "ADVANC", name: "Advanced Info Service", market: "SET", sector: "Technology", price: 285.00, mcap: 0.85, pe: 24.5, pbv: 9.8, divYield: 3.85, roe: 35.4, de: 1.9, gpm: 35.2, npm: 15.6 },
    { ticker: "PTT", name: "PTT Public Co.", market: "SET", sector: "Energy", price: 33.50, mcap: 0.95, pe: 9.2, pbv: 0.85, divYield: 6.20, roe: 9.8, de: 0.9, gpm: 15.2, npm: 6.1 },
    { ticker: "BDMS", name: "Bangkok Duset Medical", market: "SET", sector: "Healthcare", price: 28.25, mcap: 0.44, pe: 32.1, pbv: 4.2, divYield: 2.20, roe: 16.5, de: 0.5, gpm: 32.4, npm: 12.5 }
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

    // Render Active Badges (Summary Bar)
    const badgeContainer = document.getElementById('active-badges');
    const tagsContainer = document.getElementById('results-summary-tags');
    badgeContainer.innerHTML = '';
    tagsContainer.innerHTML = '<span class="font-semibold text-blue-400">Active Filters:</span>';

    const addBadge = (text) => {
        const badge = document.createElement('span');
        badge.className = "bg-slate-700 text-blue-300 text-xs px-2.5 py-1 rounded-full border border-slate-600 flex items-center gap-1";
        badge.innerText = text;
        badgeContainer.appendChild(badge);

        const tag = document.createElement('span');
        tag.className = "bg-slate-700 text-slate-200 text-xs px-2 py-0.5 rounded";
        tag.innerText = text;
        tagsContainer.appendChild(tag);
    };

    addBadge(`Market: ${universe}`);
    if (sector !== 'ALL') addBadge(`Sector: ${sector}`);
    if (roeMin !== -Infinity) addBadge(`ROE > ${roeMin}%`);
    if (deMax !== Infinity) addBadge(`D/E < ${deMax}`);
    if (gpmMin !== -Infinity) addBadge(`GPM > ${gpmMin}%`);
    if (npmMin !== -Infinity) addBadge(`NPM > ${npmMin}%`);
    if (peMax !== Infinity) addBadge(`P/E < ${peMax}`);
    if (pbvMax !== Infinity) addBadge(`P/BV < ${pbvMax}`);
    if (divMin !== -Infinity) addBadge(`Div > ${divMin}%`);

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

function resetFilters() {
    document.getElementById('filter-universe').value = 'SP500';
    document.getElementById('filter-sector').value = 'ALL';
    document.getElementById('filter-watchlist').value = '';
    document.getElementById('filter-roe').value = '';
    document.getElementById('filter-de').value = '';
    document.getElementById('filter-gpm').value = '';
    document.getElementById('filter-npm').value = '';
    document.getElementById('filter-pe').value = '';
    document.getElementById('filter-pbv').value = '';
    document.getElementById('filter-div').value = '';
    applyFilters();
}

applyFilters();
