import { useState } from "react";
import StockChart from "@/components/StockChart";
import PortfolioCard from "@/components/PortfolioCard";
import StockPortfolio from "@/components/StockPortfolio";
import NewsSection from "@/components/NewsSection";
import { ThemeToggle } from "@/components/ThemeToggle";

// Default portfolio stocks
const DEFAULT_STOCKS = [
  { symbol: 'ASML', name: 'ASML Holding N.V.', shares: 50, averagePrice: 690.25 },
  { symbol: 'GOOG', name: 'Alphabet Inc.', shares: 25, averagePrice: 152.30 },
  { symbol: 'NU', name: 'Nu Holdings Ltd.', shares: 200, averagePrice: 12.85 },
  { symbol: 'MELI', name: 'MercadoLibre Inc.', shares: 10, averagePrice: 1450.75 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', shares: 30, averagePrice: 418.50 },
  { symbol: 'NBIS', name: 'Nebius Group N.V.', shares: 100, averagePrice: 28.90 },
  { symbol: 'GRAB', name: 'Grab Holdings Limited', shares: 300, averagePrice: 3.45 },
  { symbol: 'TSLA', name: 'Tesla Inc.', shares: 15, averagePrice: 242.80 },
  { symbol: 'NIO', name: 'NIO Inc.', shares: 150, averagePrice: 8.75 },
  { symbol: 'SPGI', name: 'S&P Global Inc.', shares: 8, averagePrice: 385.60 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', shares: 20, averagePrice: 178.25 }
];

const Index = () => {
  const [portfolioStocks, setPortfolioStocks] = useState<{ symbol: string; name: string; shares?: number; averagePrice?: number; }[]>(DEFAULT_STOCKS);
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
        <header className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Stock Portfolio Dashboard</h1>
            <p className="text-muted-foreground">Track your investments and stay updated with curated news</p>
          </div>
          <ThemeToggle />
        </header>
        
        <PortfolioCard />
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-4">
            <StockChart />
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