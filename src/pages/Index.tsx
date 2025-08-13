import { useState } from "react";
import MarketStats from "@/components/MarketStats";
import StockChart from "@/components/StockChart";
import PortfolioCard from "@/components/PortfolioCard";
import StockPortfolio from "@/components/StockPortfolio";
import NewsSection from "@/components/NewsSection";

// Default portfolio stocks
const DEFAULT_STOCKS = [
  { symbol: 'ASML', name: 'ASML Holding N.V.' },
  { symbol: 'GOOG', name: 'Alphabet Inc.' },
  { symbol: 'NU', name: 'Nu Holdings Ltd.' },
  { symbol: 'MELI', name: 'MercadoLibre Inc.' },
  { symbol: 'NVDA', name: 'NVIDIA Corporation' },
  { symbol: 'NBIS', name: 'Nebius Group N.V.' },
  { symbol: 'GRAB', name: 'Grab Holdings Limited' },
  { symbol: 'TSLA', name: 'Tesla Inc.' },
  { symbol: 'NIO', name: 'NIO Inc.' },
  { symbol: 'SPGI', name: 'S&P Global Inc.' },
  { symbol: 'AMZN', name: 'Amazon.com Inc.' }
];

const Index = () => {
  const [portfolioStocks, setPortfolioStocks] = useState(DEFAULT_STOCKS);
  const [selectedNewsStocks, setSelectedNewsStocks] = useState<string[]>([]);

  const handleToggleNewsStock = (symbol: string) => {
    setSelectedNewsStocks(prev => 
      prev.includes(symbol) 
        ? prev.filter(s => s !== symbol)
        : [...prev, symbol]
    );
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Stock Portfolio Dashboard</h1>
          <p className="text-muted-foreground">Track your investments and stay updated with curated news</p>
        </header>
        
        <MarketStats />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <StockChart />
          </div>
          <div>
            <PortfolioCard />
          </div>
        </div>
        
        <StockPortfolio 
          stocks={portfolioStocks} 
          onUpdateStocks={setPortfolioStocks} 
        />
        
        <NewsSection 
          selectedStocks={selectedNewsStocks}
          onToggleStock={handleToggleNewsStock}
          availableStocks={portfolioStocks}
        />
      </div>
    </div>
  );
};

export default Index;