import json
import os
import yfinance as yf

# รายชื่อหุ้นตัวอย่างฝั่ง US (S&P 500) และหุ้นไทย (SET เติม .BK)
tickers = [
    "AAPL",
    "MSFT",
    "GOOGL",
    "AMZN",
    "META",
    "NVDA",
    "JNJ",
    "JPM",
    "V",
    "PG",
    "MA",
    "HD",
    "BAC",
    "DIS",
    "PFE",
    "ADVANC.BK",
    "PTT.BK",
    "BDMS.BK",
    "CPALL.BK",
    "SCC.BK",
]

results = []

for symbol in tickers:
  try:
    t = yf.Ticker(symbol)
    info = t.info

    market = "SET" if ".BK" in symbol else "SP500"
    clean_ticker = symbol.replace(".BK", "")

    stock_data = {
        "ticker": clean_ticker,
        "name": info.get("shortName", clean_ticker),
        "market": market,
        "sector": info.get("sector", "N/A"),
        "price": info.get("currentPrice", info.get("regularMarketPrice", 0)),
        "mcap": (
            info.get("marketCap", 0) / 1e9 if info.get("marketCap") else 0
        ),
        "pe": info.get("trailingPE", 0),
        "pbv": info.get("priceToBook", 0),
        "divYield": (info.get("dividendYield", 0) or 0) * 100,
        "roe": (info.get("returnOnEquity", 0) or 0) * 100,
        "de": (info.get("debtToEquity", 0) or 0) / 100,
        "gpm": (info.get("grossMargins", 0) or 0) * 100,
        "npm": (info.get("profitMargins", 0) or 0) * 100,
    }
    results.append(stock_data)
    print(f"Fetched {symbol} successfully.")
  except Exception as e:
    print(f"Error fetching {symbol}: {e}")

os.makedirs("data", exist_ok=True)
with open("data/stocks.json", "w", encoding="utf-8") as f:
  json.dump(results, f, ensure_ascii=False, indent=2)

print("Saved data/stocks.json successfully.")
