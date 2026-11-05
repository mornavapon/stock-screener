let allStocks = [];
let filteredStocks = [];
let currentSort = { column: null, asc: false };

// โหลดข้อมูลจริงจากไฟล์ JSON ที่ GitHub Actions ดึงมาให้
fetch('data/stocks.json')
    .then(res => res.json())
    .then(data => {
        if(data && data.length > 0) {
            allStocks = data;
            filteredStocks = [...allStocks];
            applyFilters();
        }
    })
    .catch(err => {
        console.log('Error loading stocks.json, using empty state', err);
    });

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
        // แยก Universe ห้ามหุ้นไทยกับหุ้นอเมริกาปะปนกันเด็ดขาด
        if (universe === 'SET' && s.market !== 'SET') return false;
        if (universe === 'SP500' && s.market !== 'SP500') return false;
        if (universe === 'WATCHLIST' && watchlist.length > 0 && !watchlist.includes(s.ticker)) return false;
        
        if (sector !== 'ALL' && s.sector !== sector) return false;
        if (s.roe < roeMin || s.de > deMax || s.gpm < gpmMin || s.npm < npmMin) return false;
        if (s.pe > peMax || s.pbv > pbvMax || s.divYield < divMin) return false;
        return true;
    });

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
            <td class="p-3">${s.price ? s.price.toFixed(2) : '-'}</td>
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
