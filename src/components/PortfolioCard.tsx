import { useState, useRef } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceArea } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { TrendingUpIcon, DollarSignIcon, BarChart3Icon, EyeIcon, EyeOffIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CompareDialog from "./CompareDialog";

// Generate mock portfolio performance data based on timeframe
const generatePortfolioData = (timeFrame: 'd' | 'w' | 'm' | 'y' | 'all') => {
  const data = [];
  let periods: number;
  let baseValue = 280000;
  
  // Set periods and base value based on timeframe
  switch (timeFrame) {
    case 'd': periods = 24; break; // 24 hours
    case 'w': periods = 7; break;  // 7 days  
    case 'm': periods = 30; break; // 30 days
    case 'y': periods = 12; break; // 12 months
    case 'all': periods = 60; baseValue = 180000; break; // 5 years of months
    default: periods = 30;
  }
  
  for (let i = 0; i < periods; i++) {
    const date = new Date();
    
    if (timeFrame === 'd') {
      date.setHours(date.getHours() - (periods - 1 - i));
    } else if (timeFrame === 'w') {
      date.setDate(date.getDate() - (periods - 1 - i));
    } else if (timeFrame === 'm') {
      date.setDate(date.getDate() - (periods - 1 - i));  
    } else if (timeFrame === 'y') {
      date.setMonth(date.getMonth() - (periods - 1 - i));
    } else { // all
      date.setMonth(date.getMonth() - (periods - 1 - i));
    }
    
    // Generate realistic portfolio fluctuation
    const randomVariation = (Math.random() - 0.5) * 0.02; // ±2% daily variation
    const trendFactor = i * 0.0015; // Slight upward trend
    const value = baseValue * (1 + trendFactor + randomVariation);
    
    const formatDate = () => {
      if (timeFrame === 'd') {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', hour12: true });
      } else if (timeFrame === 'w' || timeFrame === 'm') {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else {
        return date.toLocaleDateString('en-US', { year: '2-digit', month: 'short' });
      }
    };
    
    data.push({
      date: formatDate(),
      fullDate: date.toISOString(),
      value: Math.round(value),
      index: i
    });
  }
  
  return data;
};

// Generate benchmark data for comparison
const generateBenchmarkData = (timeFrame: 'd' | 'w' | 'm' | 'y' | 'all', symbol: string) => {
  const baseReturns: Record<string, number> = {
    'SPY': 0.08, 'QQQ': 0.12, 'VTI': 0.09, 'IWM': 0.06, 'DIA': 0.07,
    'TSLA': 0.25, 'AAPL': 0.15, 'MSFT': 0.18, 'GOOGL': 0.16, 
    'NVDA': 0.35, 'AMZN': 0.20, 'META': 0.22
  };
  
  const annualReturn = baseReturns[symbol] || 0.10;
  const periods = timeFrame === 'd' ? 24 : timeFrame === 'w' ? 7 : timeFrame === 'm' ? 30 : timeFrame === 'y' ? 12 : 60;
  
  // Calculate period-specific return
  let periodReturn: number;
  if (timeFrame === 'd') periodReturn = annualReturn / 365;
  else if (timeFrame === 'w') periodReturn = annualReturn / 52;
  else if (timeFrame === 'm') periodReturn = annualReturn / 12;
  else if (timeFrame === 'y') periodReturn = annualReturn;
  else periodReturn = annualReturn;
  
  const data = [];
  let baseValue = 100;
  
  for (let i = 0; i < periods; i++) {
    const randomVariation = (Math.random() - 0.5) * 0.015;
    const value = baseValue * Math.pow(1 + periodReturn + randomVariation, i);
    data.push({
      benchmarkValue: value
    });
  }
  
  return data;
};

const fetchPortfolioPerformance = async (timeFrame: 'd' | 'w' | 'm' | 'y' | 'all') => {
  // For demo purposes, return mock data
  // In production, this would calculate your actual portfolio performance
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return generatePortfolioData(timeFrame);
};

const PortfolioCard = () => {
  const [timeFrame, setTimeFrame] = useState<'d' | 'w' | 'm' | 'y' | 'all'>('d');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [comparisonSymbol, setComparisonSymbol] = useState<string | null>(null);
  const [comparisonName, setComparisonName] = useState<string>('');
  const [selectedPeriod, setSelectedPeriod] = useState<{start: number, end: number} | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState<number | null>(null);
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
  
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['portfolioPerformance', timeFrame],
    queryFn: () => fetchPortfolioPerformance(timeFrame),
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Generate comparison data when symbol is selected
  const comparisonData = comparisonSymbol && portfolioData ? 
    generateBenchmarkData(timeFrame, comparisonSymbol) : null;

  // Combine portfolio and benchmark data
  const chartData = portfolioData?.map((item, index) => ({
    ...item,
    benchmarkValue: comparisonData?.[index]?.benchmarkValue ? 
      (comparisonData[index].benchmarkValue / 100 * item.value) : undefined
  })) || [];

  // Calculate portfolio stats based on time frame
  const currentValue = portfolioData?.[portfolioData.length - 1]?.value || 287500;
  const initialValue = portfolioData?.[0]?.value || 275000;
  const change = currentValue - initialValue;
  const changePercent = (change / initialValue) * 100;
  
  // Calculate selected period stats
  const selectedPeriodStats = selectedPeriod && portfolioData ? (() => {
    const startData = portfolioData[selectedPeriod.start];
    const endData = portfolioData[selectedPeriod.end];
    if (startData && endData) {
      const periodChange = endData.value - startData.value;
      const periodChangePercent = (periodChange / startData.value) * 100;
      return {
        startValue: startData.value,
        endValue: endData.value,
        change: periodChange,
        changePercent: periodChangePercent,
        startDate: startData.date,
        endDate: endData.date
      };
    }
    return null;
  })() : null;

  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'd': return 'Daily P&L';
      case 'w': return 'Weekly P&L';
      case 'm': return 'Monthly P&L';
      case 'y': return 'Yearly P&L';
      case 'all': return 'All-Time P&L';
      default: return 'Daily P&L';
    }
  };

  const handleCompare = (symbol: string, name: string) => {
    setComparisonSymbol(symbol);
    setComparisonName(name);
  };

  const removeComparison = () => {
    setComparisonSymbol(null);
    setComparisonName('');
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Portfolio Performance</h2>
        <div className="w-full h-[200px] flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={togglePrivacyMode}
            className="h-8 w-8 p-0"
          >
            {isPrivacyMode ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          </Button>
        </div>
      </div>
      
      {/* Portfolio Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSignIcon className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Total Value</span>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold">
              {formatPrivateValue(currentValue, isPrivacyMode)}
            </p>
            <CompareDialog onCompare={handleCompare} />
          </div>
        </div>
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3Icon className="w-3 h-3 text-success" />
            <span className="text-xs text-muted-foreground">{getTimeFrameLabel()}</span>
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <button className="ml-auto px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full hover:bg-primary/30 transition-colors">
                  {timeFrame.toUpperCase()}
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-1 bg-card border border-border shadow-lg" align="end">
                <div className="flex flex-col gap-1">
                  {(['d', 'w', 'm', 'y', 'all'] as const).map((period) => (
                    <button
                      key={period}
                      onClick={() => {
                        setTimeFrame(period);
                        setIsPopoverOpen(false);
                        setSelectedPeriod(null); // Reset selection on timeframe change
                      }}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        timeFrame === period 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {period === 'd' ? 'Day' : period === 'w' ? 'Week' : period === 'm' ? 'Month' : period === 'y' ? 'Year' : 'All'}
                    </button>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
          </div>
          <p className={`text-lg font-semibold ${change >= 0 ? 'text-success' : 'text-warning'}`}>
            {isPrivacyMode ? '••••' : `${change >= 0 ? '+' : ''}$${change.toFixed(0)}`}
          </p>
          <span className={`text-xs ${change >= 0 ? 'text-success' : 'text-warning'}`}>
            {isPrivacyMode ? '••••' : `(${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`}
          </span>
        </div>
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <BarChart3Icon className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Active Stocks</span>
          </div>
          <p className="text-lg font-semibold">11</p>
          <span className="text-xs text-muted-foreground">Holdings</span>
        </div>
      </div>

      {/* Comparison Indicator */}
      {comparisonSymbol && (
        <div className="mb-4 flex items-center justify-between bg-primary/10 border border-primary/20 rounded-lg p-3">
          <div className="flex items-center gap-2">
            <TrendingUpIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium">Comparing against {comparisonSymbol}</span>
            <span className="text-xs text-muted-foreground">({comparisonName})</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={removeComparison}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>
      )}

      {/* Selected Period Stats */}
      {selectedPeriodStats && (
        <div className="mb-4 bg-secondary/10 border border-secondary/20 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-medium">Selected Period: {selectedPeriodStats.startDate} - {selectedPeriodStats.endDate}</span>
              <div className="flex items-center gap-4 mt-1">
                <span className={`text-sm font-medium ${selectedPeriodStats.change >= 0 ? 'text-success' : 'text-warning'}`}>
                  {selectedPeriodStats.change >= 0 ? '+' : ''}${selectedPeriodStats.change.toFixed(0)} 
                  ({selectedPeriodStats.changePercent >= 0 ? '+' : ''}{selectedPeriodStats.changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPeriod(null)}
              className="h-6 w-6 p-0"
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}

      {/* Performance Chart */}
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
           <LineChart 
            data={chartData}
            onMouseDown={(e) => {
              if (e && e.activeTooltipIndex !== undefined) {
                setIsSelecting(true);
                setSelectionStart(e.activeTooltipIndex);
                setSelectedPeriod({ start: e.activeTooltipIndex, end: e.activeTooltipIndex });
              }
            }}
            onMouseMove={(e) => {
              if (isSelecting && e && e.activeTooltipIndex !== undefined && selectionStart !== null) {
                const start = Math.min(selectionStart, e.activeTooltipIndex);
                const end = Math.max(selectionStart, e.activeTooltipIndex);
                setSelectedPeriod({ start, end });
              }
            }}
            onMouseUp={() => {
              setIsSelecting(false);
              setSelectionStart(null);
            }}
          >
            <XAxis 
              dataKey="date" 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={10}
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                color: 'hsl(var(--card-foreground))'
              }}
              labelStyle={{ color: 'hsl(var(--card-foreground))' }}
              formatter={(value: number, name: string) => [
                name === 'value' ? `$${value.toLocaleString()}` : `$${value.toLocaleString()}`, 
                name === 'value' ? 'Portfolio' : comparisonSymbol || 'Benchmark'
              ]}
            />
            {selectedPeriod && selectedPeriod.start !== selectedPeriod.end && (
              <ReferenceArea
                x1={chartData[selectedPeriod.start]?.date}
                x2={chartData[selectedPeriod.end]?.date}
                fill="hsl(var(--primary))"
                fillOpacity={0.1}
                stroke="hsl(var(--primary))"
                strokeOpacity={0.3}
              />
            )}
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2}
              dot={false}
              strokeDasharray="0"
            />
            {comparisonSymbol && (
              <Line 
                type="monotone" 
                dataKey="benchmarkValue" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioCard;