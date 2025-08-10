import { useState } from "react";
import MarketStats from "@/components/MarketStats";
import StockChart from "@/components/StockChart";
import PortfolioCard from "@/components/PortfolioCard";
import StockPortfolio from "@/components/StockPortfolio";
import StockNews from "@/components/StockNews";

const Index = () => {
  const [selectedStock, setSelectedStock] = useState<string | null>(null);

  const handleViewNews = (symbol: string) => {
    setSelectedStock(symbol);
  };

  const handleCloseNews = () => {
    setSelectedStock(null);
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
        
        <StockPortfolio onViewNews={handleViewNews} />
        
        {selectedStock && (
          <StockNews symbol={selectedStock} onClose={handleCloseNews} />
        )}
      </div>
    </div>
  );
};

export default Index;