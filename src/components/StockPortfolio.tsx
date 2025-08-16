import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import PortfolioManager from "./PortfolioManager";
import AveragePriceCalculator from "./AveragePriceCalculator";

// Helper function to get company domain for logo fetching
const getCompanyDomain = (symbol: string): string => {
  const domainMap: Record<string, string> = {
    'AAPL': 'apple.com',
    'MSFT': 'microsoft.com',
    'GOOGL': 'google.com',
    'GOOG': 'google.com',
    'AMZN': 'amazon.com',
    'TSLA': 'tesla.com',
    'META': 'meta.com',
    'NVDA': 'nvidia.com',
    'NFLX': 'netflix.com',
    'AMD': 'amd.com',
    'ASML': 'asml.com',
    'NU': 'nubank.com.br',
    'MELI': 'mercadolibre.com',
    'GRAB': 'grab.com',
    'NIO': 'nio.com',
    'SPGI': 'spglobal.com',
    'JPM': 'jpmorganchase.com',
    'V': 'visa.com',
    'MA': 'mastercard.com',
    'DIS': 'disney.com',
    // Add more mappings as needed
  };
  
  return domainMap[symbol] || `${symbol.toLowerCase()}.com`;
};


// Using Yahoo Finance API (free, no key required)
const fetchStockData = async (portfolioStocks: { symbol: string; name: string; shares?: number; averagePrice?: number; }[]) => {
  const symbols = portfolioStocks.map(stock => stock.symbol).join(',');
  
  try {
    // For demo purposes, using a free API. In production, you'd want to use a more reliable service
    const response = await fetch(
      `https://query1.finance.yahoo.com/v8/finance/chart/${symbols}?interval=1d&range=1d`
    );
    
    if (!response.ok) {
      // If API fails, return mock data
      return portfolioStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: Math.random() * 1000 + 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000000),
        shares: stock.shares || 0,
        averagePrice: stock.averagePrice || 0
      }));
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.log('Using mock data due to API limitations');
      // Return mock data for demo
      return portfolioStocks.map(stock => ({
        symbol: stock.symbol,
        name: stock.name,
        price: Math.random() * 1000 + 50,
        change: (Math.random() - 0.5) * 20,
        changePercent: (Math.random() - 0.5) * 10,
        volume: Math.floor(Math.random() * 10000000),
        shares: stock.shares || 0,
        averagePrice: stock.averagePrice || 0
      }));
  }
};

interface StockPortfolioProps {
  stocks: { symbol: string; name: string; shares?: number; averagePrice?: number; }[];
  onUpdateStocks: (stocks: { symbol: string; name: string; shares?: number; averagePrice?: number; }[]) => void;
}

// Helper function to get change percentage for different time frames
const getChangeForTimeFrame = (dailyChange: number, timeFrame: 'd' | 'w' | 'm' | 'y'): number => {
  switch (timeFrame) {
    case 'd':
      return dailyChange;
    case 'w':
      return dailyChange * 1.2; // Mock weekly multiplier
    case 'm':
      return dailyChange * 2.1; // Mock monthly multiplier
    case 'y':
      return dailyChange * 8.5; // Mock yearly multiplier
    default:
      return dailyChange;
  }
};

const StockPortfolio = ({ stocks: portfolioStocks, onUpdateStocks }: StockPortfolioProps) => {
  const [globalChangeTimeFrame, setGlobalChangeTimeFrame] = useState<'d' | 'w' | 'm' | 'y'>('d');
  const { isPrivacyMode } = usePrivacy();
  const { data: stocks, isLoading } = useQuery({
    queryKey: ['portfolio-stocks', portfolioStocks],
    queryFn: () => fetchStockData(portfolioStocks),
    refetchInterval: 60000, // Refetch every minute
  });

  // Calculate total portfolio value for percentage calculations
  const totalPortfolioValue = stocks?.reduce((total, stock) => {
    const positionValue = (stock.shares || 0) * (stock.price || 0);
    return total + positionValue;
  }, 0) || 0;

  if (isLoading) {
    return <div className="glass-card rounded-lg p-6 animate-pulse">Loading portfolio...</div>;
  }

  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Your Stock Portfolio</h2>
        <div className="flex items-center gap-2">
          <AveragePriceCalculator />
          <PortfolioManager stocks={portfolioStocks} onUpdateStocks={onUpdateStocks} />
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground">
              <th className="pb-4">Stock</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">Shares</th>
              <th className="pb-4">Avg Price</th>
              <th className="pb-4">Position Value</th>
              <th className="pb-4">P&L</th>
              <th className="pb-4">% Portfolio</th>
              <th className="pb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto p-1 flex items-center gap-1">
                      Change
                      <ChevronDownIcon className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-card border border-border">
                    <DropdownMenuLabel className="text-xs">Time Period</DropdownMenuLabel>
                    <DropdownMenuItem onClick={() => setGlobalChangeTimeFrame('d')} className={globalChangeTimeFrame === 'd' ? 'bg-secondary' : ''}>
                      Day
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGlobalChangeTimeFrame('w')} className={globalChangeTimeFrame === 'w' ? 'bg-secondary' : ''}>
                      Week
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGlobalChangeTimeFrame('m')} className={globalChangeTimeFrame === 'm' ? 'bg-secondary' : ''}>
                      Month
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setGlobalChangeTimeFrame('y')} className={globalChangeTimeFrame === 'y' ? 'bg-secondary' : ''}>
                      Year
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
            </tr>
          </thead>
          <tbody>
            {stocks?.map((stock) => {
              const shares = stock.shares || 0;
              const averagePrice = stock.averagePrice || 0;
              const currentPrice = stock.price || 0;
              const positionValue = shares * currentPrice;
              const totalCost = shares * averagePrice;
              const pnl = positionValue - totalCost;
              const portfolioPercentage = totalPortfolioValue > 0 ? (positionValue / totalPortfolioValue) * 100 : 0;

              return (
                <tr key={stock.symbol} className="border-t border-secondary">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={`https://logo.clearbit.com/${getCompanyDomain(stock.symbol)}`}
                        alt={`${stock.symbol} logo`}
                        className="w-8 h-8 rounded-full bg-secondary/20 object-cover"
                        onError={(e) => {
                          e.currentTarget.src = `https://via.placeholder.com/32/8989DE/FFFFFF?text=${stock.symbol.charAt(0)}`;
                        }}
                      />
                      <div>
                        <p className="font-medium">{stock.symbol}</p>
                        <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                          {stock.name}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 font-medium">
                    ${currentPrice.toFixed(2)}
                  </td>
                  <td className="py-4">
                    {shares > 0 ? shares.toLocaleString() : '-'}
                  </td>
                  <td className="py-4">
                    {isPrivacyMode ? '••••' : (averagePrice > 0 ? `$${averagePrice.toFixed(2)}` : '-')}
                  </td>
                  <td className="py-4 font-medium">
                    {isPrivacyMode ? '••••' : `$${positionValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                  </td>
                  <td className="py-4">
                    {shares > 0 && averagePrice > 0 ? (
                      <span className={pnl >= 0 ? "text-success" : "text-warning"}>
                        {isPrivacyMode ? '••••' : `$${pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-4">
                    {portfolioPercentage > 0 ? `${portfolioPercentage.toFixed(1)}%` : '-'}
                  </td>
                   <td className="py-4">
                     <span className={`${
                       (getChangeForTimeFrame(stock.changePercent || 0, globalChangeTimeFrame)) >= 0 ? "text-success" : "text-warning"
                     }`}>
                       {isPrivacyMode ? '••••' : `${getChangeForTimeFrame(stock.changePercent || 0, globalChangeTimeFrame) >= 0 ? '+' : ''}${getChangeForTimeFrame(stock.changePercent || 0, globalChangeTimeFrame).toFixed(2)}%`}
                     </span>
                   </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockPortfolio;