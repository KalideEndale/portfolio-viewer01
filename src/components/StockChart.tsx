import TradingViewWidget from 'react-tradingview-widget';
import { useState } from 'react';
import { Button } from "@/components/ui/button";

const PORTFOLIO_SYMBOLS = ['ASML', 'GOOG', 'NU', 'MELI', 'NVDA', 'NBIS', 'GRAB', 'TSLA', 'NIO', 'SPGI', 'AMZN'];

const StockChart = () => {
  const [selectedSymbol, setSelectedSymbol] = useState('NVDA');

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
          symbol={`NASDAQ:${selectedSymbol}`}
          theme="Dark"
          locale="en"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={true}
          interval="D"
          toolbar_bg="#141413"
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