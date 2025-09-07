import { ArrowUpIcon, ArrowDownIcon, ChevronDownIcon, ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { useQuery } from "@tanstack/react-query";
import { useState } from 'react';
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import PortfolioManager from "./PortfolioManager";
import AveragePriceCalculator from "./AveragePriceCalculator";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

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
const getChangeForTimeFrame = (dailyChange: number, timeFrame: 'd' | 'w' | 'm' | 'y' | 'all'): number => {
  switch (timeFrame) {
    case 'd':
      return dailyChange;
    case 'w':
      return dailyChange * 1.2; // Mock weekly multiplier
    case 'm':
      return dailyChange * 2.1; // Mock monthly multiplier
    case 'y':
      return dailyChange * 8.5; // Mock yearly multiplier
    case 'all':
      return dailyChange * 15.2; // Mock all-time multiplier
    default:
      return dailyChange;
  }
};

// Mock AI-generated quarterly overviews and performance data
const getCompanyOverview = (symbol: string) => {
  const overviews: Record<string, { summary: string; quarterlyData: { quarter: string; actualRevenue: number; estimatedRevenue: number; actualEps: number; estimatedEps: number; }[] }> = {
    'AAPL': {
      summary: "Apple delivered strong performance over the past 4 quarters with consistent revenue growth driven by iPhone 15 launch and services expansion. The company maintained healthy margins despite supply chain challenges and showed resilience in emerging markets.",
      quarterlyData: [
        { quarter: 'Q1 24', actualRevenue: 119.6, estimatedRevenue: 117.9, actualEps: 2.18, estimatedEps: 2.10 },
        { quarter: 'Q2 24', actualRevenue: 90.8, estimatedRevenue: 90.3, actualEps: 1.53, estimatedEps: 1.50 },
        { quarter: 'Q3 24', actualRevenue: 85.8, estimatedRevenue: 85.0, actualEps: 1.40, estimatedEps: 1.39 },
        { quarter: 'Q4 24', actualRevenue: 94.9, estimatedRevenue: 93.2, actualEps: 1.64, estimatedEps: 1.60 }
      ]
    },
    'MSFT': {
      summary: "Microsoft showed exceptional growth in cloud services and AI integration across quarters. Azure revenue accelerated significantly while productivity tools benefited from enterprise digital transformation trends and AI-powered features.",
      quarterlyData: [
        { quarter: 'Q1 24', actualRevenue: 62.0, estimatedRevenue: 61.1, actualEps: 2.99, estimatedEps: 2.65 },
        { quarter: 'Q2 24', actualRevenue: 64.7, estimatedRevenue: 64.2, actualEps: 3.20, estimatedEps: 2.78 },
        { quarter: 'Q3 24', actualRevenue: 61.9, estimatedRevenue: 60.8, actualEps: 2.94, estimatedEps: 2.85 },
        { quarter: 'Q4 24', actualRevenue: 65.6, estimatedRevenue: 64.5, actualEps: 3.31, estimatedEps: 2.93 }
      ]
    },
    'GOOGL': {
      summary: "Alphabet demonstrated strong fundamentals with search advertising resilience and significant progress in AI capabilities. Cloud division showed accelerating growth while YouTube maintained solid performance despite competitive pressures.",
      quarterlyData: [
        { quarter: 'Q1 24', actualRevenue: 80.5, estimatedRevenue: 78.9, actualEps: 1.89, estimatedEps: 1.51 },
        { quarter: 'Q2 24', actualRevenue: 84.7, estimatedRevenue: 82.8, actualEps: 1.95, estimatedEps: 1.84 },
        { quarter: 'Q3 24', actualRevenue: 88.3, estimatedRevenue: 86.4, actualEps: 2.12, estimatedEps: 1.85 },
        { quarter: 'Q4 24', actualRevenue: 86.3, estimatedRevenue: 85.2, actualEps: 2.07, estimatedEps: 1.83 }
      ]
    },
    'TSLA': {
      summary: "Tesla navigated challenging market conditions with strategic pricing adjustments and production optimization. Energy business showed promising growth while autonomous driving capabilities continued advancing despite regulatory headwinds.",
      quarterlyData: [
        { quarter: 'Q1 24', actualRevenue: 21.3, estimatedRevenue: 22.4, actualEps: 0.45, estimatedEps: 0.51 },
        { quarter: 'Q2 24', actualRevenue: 25.0, estimatedRevenue: 24.7, actualEps: 0.52, estimatedEps: 0.62 },
        { quarter: 'Q3 24', actualRevenue: 25.2, estimatedRevenue: 25.4, actualEps: 0.72, estimatedEps: 0.60 },
        { quarter: 'Q4 24', actualRevenue: 25.2, estimatedRevenue: 25.8, actualEps: 0.71, estimatedEps: 0.73 }
      ]
    },
    'NVDA': {
      summary: "NVIDIA delivered exceptional performance driven by AI and data center demand surge. Gaming segment stabilized while professional visualization and automotive showed steady progress. Supply chain optimization improved margins significantly.",
      quarterlyData: [
        { quarter: 'Q1 24', actualRevenue: 18.4, estimatedRevenue: 16.2, actualEps: 5.16, estimatedEps: 4.08 },
        { quarter: 'Q2 24', actualRevenue: 30.0, estimatedRevenue: 28.7, actualEps: 10.11, estimatedEps: 8.65 },
        { quarter: 'Q3 24', actualRevenue: 35.1, estimatedRevenue: 32.5, actualEps: 12.96, estimatedEps: 10.32 },
        { quarter: 'Q4 24', actualRevenue: 22.1, estimatedRevenue: 20.4, actualEps: 5.98, estimatedEps: 5.28 }
      ]
    }
  };

  return overviews[symbol] || {
    summary: `${symbol} has shown mixed performance over the past 4 quarters with varying revenue trends and earnings volatility. The company continues to adapt to market conditions while focusing on operational efficiency and strategic growth initiatives.`,
    quarterlyData: [
      { quarter: 'Q1 24', actualRevenue: Math.random() * 50 + 10, estimatedRevenue: Math.random() * 50 + 10, actualEps: Math.random() * 3 + 0.5, estimatedEps: Math.random() * 3 + 0.5 },
      { quarter: 'Q2 24', actualRevenue: Math.random() * 50 + 10, estimatedRevenue: Math.random() * 50 + 10, actualEps: Math.random() * 3 + 0.5, estimatedEps: Math.random() * 3 + 0.5 },
      { quarter: 'Q3 24', actualRevenue: Math.random() * 50 + 10, estimatedRevenue: Math.random() * 50 + 10, actualEps: Math.random() * 3 + 0.5, estimatedEps: Math.random() * 3 + 0.5 },
      { quarter: 'Q4 24', actualRevenue: Math.random() * 50 + 10, estimatedRevenue: Math.random() * 50 + 10, actualEps: Math.random() * 3 + 0.5, estimatedEps: Math.random() * 3 + 0.5 }
    ]
  };
};

const StockPortfolio = ({ stocks: portfolioStocks, onUpdateStocks }: StockPortfolioProps) => {
  const [globalChangeTimeFrame, setGlobalChangeTimeFrame] = useState<'d' | 'w' | 'm' | 'y' | 'all'>('d');
  const [sortBy, setSortBy] = useState<'position' | 'pnl' | 'portfolio' | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
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

  // Sort stocks based on current sort criteria
  const sortedStocks = stocks ? [...stocks].sort((a, b) => {
    if (!sortBy) return 0;
    
    let aValue = 0, bValue = 0;
    
    if (sortBy === 'position') {
      aValue = (a.shares || 0) * (a.price || 0);
      bValue = (b.shares || 0) * (b.price || 0);
    } else if (sortBy === 'pnl') {
      const aPnL = ((a.shares || 0) * (a.price || 0)) - ((a.shares || 0) * (a.averagePrice || 0));
      const bPnL = ((b.shares || 0) * (b.price || 0)) - ((b.shares || 0) * (b.averagePrice || 0));
      aValue = aPnL;
      bValue = bPnL;
    } else if (sortBy === 'portfolio') {
      const aPosition = (a.shares || 0) * (a.price || 0);
      const bPosition = (b.shares || 0) * (b.price || 0);
      aValue = totalPortfolioValue > 0 ? (aPosition / totalPortfolioValue) * 100 : 0;
      bValue = totalPortfolioValue > 0 ? (bPosition / totalPortfolioValue) * 100 : 0;
    }
    
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  }) : [];

  const handleSort = (column: 'position' | 'pnl' | 'portfolio') => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('desc');
    }
  };

  const getSortIcon = (column: 'position' | 'pnl' | 'portfolio') => {
    if (sortBy !== column) return <ArrowUpDownIcon className="w-3 h-3 opacity-30" />;
    return sortDirection === 'asc' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />;
  };

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
              <th className="pb-4">
                <button 
                  onClick={() => handleSort('position')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  Position Value
                  {getSortIcon('position')}
                </button>
              </th>
              <th className="pb-4">
                <button 
                  onClick={() => handleSort('pnl')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  P&L
                  {getSortIcon('pnl')}
                </button>
              </th>
              <th className="pb-4">
                <button 
                  onClick={() => handleSort('portfolio')}
                  className="flex items-center gap-1 hover:text-foreground transition-colors"
                >
                  % Portfolio
                  {getSortIcon('portfolio')}
                </button>
              </th>
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
                    <DropdownMenuItem onClick={() => setGlobalChangeTimeFrame('all')} className={globalChangeTimeFrame === 'all' ? 'bg-secondary' : ''}>
                      All
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStocks.map((stock) => {
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
                       <HoverCard>
                         <HoverCardTrigger asChild>
                           <img 
                             src={`https://logo.clearbit.com/${getCompanyDomain(stock.symbol)}`}
                             alt={`${stock.symbol} logo`}
                             className="w-8 h-8 rounded-full bg-secondary/20 object-cover cursor-pointer hover:scale-105 transition-transform"
                             onError={(e) => {
                               e.currentTarget.src = `https://via.placeholder.com/32/8989DE/FFFFFF?text=${stock.symbol.charAt(0)}`;
                             }}
                           />
                         </HoverCardTrigger>
                          <HoverCardContent className="w-96" side="right">
                            {(() => {
                              const overview = getCompanyOverview(stock.symbol);
                              return (
                                <div className="space-y-4">
                                  <div>
                                    <h4 className="font-semibold text-sm mb-2">{stock.symbol} - Quarterly Performance</h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">
                                      {overview.summary}
                                    </p>
                                  </div>
                                  <div className="space-y-2">
                                    <h5 className="text-xs font-medium">Revenue: Actual vs Estimated (Billions)</h5>
                                    <div className="h-24">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={overview.quarterlyData}>
                                          <XAxis 
                                            dataKey="quarter" 
                                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                            axisLine={false}
                                            tickLine={false}
                                          />
                                          <YAxis hide />
                                          <Tooltip 
                                            content={({ active, payload, label }) => {
                                              if (active && payload && payload.length) {
                                                return (
                                                  <div className="bg-card border border-border rounded p-2 shadow-lg">
                                                    <p className="text-xs font-medium">{label}</p>
                                                    {payload.map((entry, index) => (
                                                      <p key={index} className="text-xs" style={{ color: entry.color }}>
                                                        {entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(1) : entry.value}B
                                                      </p>
                                                    ))}
                                                  </div>
                                                );
                                              }
                                              return null;
                                            }}
                                          />
                                          <Line 
                                            type="monotone" 
                                            dataKey="actualRevenue" 
                                            name="Actual"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                                          />
                                          <Line 
                                            type="monotone" 
                                            dataKey="estimatedRevenue" 
                                            name="Estimated"
                                            stroke="hsl(var(--muted-foreground))"
                                            strokeWidth={2}
                                            strokeDasharray="3 3"
                                            dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 0, r: 3 }}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                  <div className="space-y-2">
                                    <h5 className="text-xs font-medium">EPS: Actual vs Estimated ($)</h5>
                                    <div className="h-24">
                                      <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={overview.quarterlyData}>
                                          <XAxis 
                                            dataKey="quarter" 
                                            tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                                            axisLine={false}
                                            tickLine={false}
                                          />
                                          <YAxis hide />
                                          <Tooltip 
                                            content={({ active, payload, label }) => {
                                              if (active && payload && payload.length) {
                                                return (
                                                  <div className="bg-card border border-border rounded p-2 shadow-lg">
                                                    <p className="text-xs font-medium">{label}</p>
                                                    {payload.map((entry, index) => (
                                                      <p key={index} className="text-xs" style={{ color: entry.color }}>
                                                        {entry.name}: ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
                                                      </p>
                                                    ))}
                                                  </div>
                                                );
                                              }
                                              return null;
                                            }}
                                          />
                                          <Line 
                                            type="monotone" 
                                            dataKey="actualEps" 
                                            name="Actual"
                                            stroke="hsl(var(--primary))"
                                            strokeWidth={2}
                                            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                                          />
                                          <Line 
                                            type="monotone" 
                                            dataKey="estimatedEps" 
                                            name="Estimated"
                                            stroke="hsl(var(--muted-foreground))"
                                            strokeWidth={2}
                                            strokeDasharray="3 3"
                                            dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 0, r: 3 }}
                                          />
                                        </LineChart>
                                      </ResponsiveContainer>
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-4 gap-1 pt-2 border-t border-border text-xs">
                                    {overview.quarterlyData.map((quarter) => (
                                      <div key={quarter.quarter} className="text-center space-y-1">
                                        <div className="font-medium text-xs">{quarter.quarter}</div>
                                        <div className="space-y-0.5">
                                          <div className="text-xs text-muted-foreground">
                                            Rev: ${quarter.actualRevenue.toFixed(1)}B
                                          </div>
                                          <div className="text-xs text-muted-foreground">
                                            EPS: ${quarter.actualEps.toFixed(2)}
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              );
                            })()}
                          </HoverCardContent>
                       </HoverCard>
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