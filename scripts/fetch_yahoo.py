import json
import os
import urllib.request
import pandas as pd
import yfinance as yf

print('Fetching S&P 500 ticker list...')
# ดึงรายชื่อหุ้น S&P 500 ล่าสุดจาก Wikipedia
url = 'https://en.wikipedia.org/wiki/List_of_S%26P_500_companies'
tables = pd.read_html(url)
sp500_tickers = tables[0]['Symbol'].tolist()

# ทำความสะอาดสัญลักษณ์ (เช่น บางตัวใช้จุด ให้เปลี่ยนเป็นขีดตามรูปแบบ yahoo)
sp500_tickers = [t.replace('.', '-') for t in sp500_tickers]

# รวมหุ้นไทย SET ที่คุณสนใจเข้าไปด้วย (เติม .BK)
set_tickers = ['ADVANC.BK', 'PTT.BK', 'BDMS.BK', 'CPALL.BK', 'SCC.BK']

all_tickers = sp500_tickers + set_tickers
print(f'Total tickers to fetch: {len(all_tickers)}')

results = []

# วิ่งดึงข้อมูล (แนะนำให้ดึงแบบทีละตัว หรือใช้ batch เพื่อความเสถียร)
for symbol in all_tickers:
  try:
    t = yf.Ticker(symbol)
    info = t.info

    market = 'SET' if '.BK' in symbol else 'SP500'
    clean_ticker = symbol.replace('.BK', '')

    stock_data = {
        'ticker': clean_ticker,
        'name': info.get('shortName', clean_ticker),
        'market': market,
        'sector': info.get('sector', 'N/A'),
        'price': info.get('currentPrice', info.get('regularMarketPrice', 0)),
        'mcap': (
            info.get('marketCap', 0) / 1e9 if info.get('marketCap') else 0
        ),
        'pe': info.get('trailingPE', 0),
        'pbv': info.get('priceToBook', 0),
        'divYield': (info.get('dividendYield', 0) or 0) * 100,
        'roe': (info.get('returnOnEquity', 0) or 0) * 100,
        'de': (info.get('debtToEquity', 0) or 0) / 100,
        'gpm': (info.get('grossMargins', 0) or 0) * 100,
        'npm': (info.get('profitMargins', 0) or 0) * 100,
    }
    results.append(stock_data)
  except Exception as e:
    # ข้ามตัวที่ดึงไม่ผ่าน
    continue

os.makedirs('data', exist_ok=True)
with open('data/stocks.json', 'w', encoding='utf-8') as f:
  json.dump(results, f, ensure_ascii=False, indent=2)

print(
    f'Successfully saved {len(results)} stocks to data/stocks.json successfully.'
)
