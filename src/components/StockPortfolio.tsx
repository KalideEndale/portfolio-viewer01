import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import PortfolioManager from "./PortfolioManager";


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

const StockPortfolio = ({ stocks: portfolioStocks, onUpdateStocks }: StockPortfolioProps) => {
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
        <PortfolioManager stocks={portfolioStocks} onUpdateStocks={onUpdateStocks} />
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
              <th className="pb-4">Change</th>
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
                    <div>
                      <p className="font-medium">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                        {stock.name}
                      </p>
                    </div>
                  </td>
                  <td className="py-4 font-medium">
                    ${currentPrice.toFixed(2)}
                  </td>
                  <td className="py-4">
                    {shares > 0 ? shares.toLocaleString() : '-'}
                  </td>
                  <td className="py-4">
                    {averagePrice > 0 ? `$${averagePrice.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-4 font-medium">
                    {positionValue > 0 ? `$${positionValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : '-'}
                  </td>
                  <td className="py-4">
                    {shares > 0 && averagePrice > 0 ? (
                      <span className={pnl >= 0 ? "text-success" : "text-warning"}>
                        ${pnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                      </span>
                    ) : '-'}
                  </td>
                  <td className="py-4">
                    {portfolioPercentage > 0 ? `${portfolioPercentage.toFixed(1)}%` : '-'}
                  </td>
                  <td className="py-4">
                    <span
                      className={`flex items-center gap-1 ${
                        (stock.changePercent || 0) >= 0 ? "text-success" : "text-warning"
                      }`}
                    >
                      {(stock.changePercent || 0) >= 0 ? (
                        <ArrowUpIcon className="w-3 h-3" />
                      ) : (
                        <ArrowDownIcon className="w-3 h-3" />
                      )}
                      {Math.abs(stock.changePercent || 0).toFixed(2)}%
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      ${(stock.change || 0).toFixed(2)}
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