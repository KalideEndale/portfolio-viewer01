import TradingViewWidget from 'react-tradingview-widget';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

const PORTFOLIO_SYMBOLS = ['ASML', 'GOOG', 'NU', 'MELI', 'NVDA', 'NBIS', 'GRAB', 'TSLA', 'NIO', 'SPGI', 'AMZN'];

// Map symbols to their appropriate exchanges
const getSymbolWithExchange = (symbol: string): string => {
  const exchangeMap: Record<string, string> = {
    'ASML': 'NASDAQ:ASML',
    'GOOG': 'NASDAQ:GOOG',
    'NU': 'NYSE:NU',
    'MELI': 'NASDAQ:MELI',
    'NVDA': 'NASDAQ:NVDA',
    'NBIS': 'NASDAQ:NBIS',
    'GRAB': 'NASDAQ:GRAB',
    'TSLA': 'NASDAQ:TSLA',
    'NIO': 'NYSE:NIO',
    'SPGI': 'NYSE:SPGI',
    'AMZN': 'NASDAQ:AMZN'
  };
  
  return exchangeMap[symbol] || `NASDAQ:${symbol}`;
};

const StockChart = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');
  const { theme } = useTheme();

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Portfolio Chart</h2>
        <div className="flex flex-wrap gap-2">
          {PORTFOLIO_SYMBOLS.map((symbol) => (
            <Button
              key={symbol}
              variant={selectedSymbol === symbol ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSymbol(symbol)}
              className="text-xs"
            >
              {symbol}
            </Button>
          ))}
        </div>
      </div>
      <div className="h-[400px] w-full">
        <TradingViewWidget
          symbol={getSymbolWithExchange(selectedSymbol)}
          theme={theme === "dark" ? "Dark" : "Light"}
          locale="en"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={true}
          interval="D"
          toolbar_bg={theme === "dark" ? "#141413" : "#ffffff"}
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id="tradingview_stock_chart"
        />
      </div>
    </div>
  );
};

export default StockChart;