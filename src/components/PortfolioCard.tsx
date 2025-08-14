import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { TrendingUpIcon, DollarSignIcon, BarChart3Icon, EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import AveragePriceCalculator from "./AveragePriceCalculator";

// Generate mock portfolio performance data
const generatePortfolioData = () => {
  const data = [];
  const baseValue = 280000;
  
  for (let i = 29; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    // Generate realistic portfolio fluctuation
    const randomVariation = (Math.random() - 0.5) * 0.02; // ±2% daily variation
    const trendFactor = (30 - i) * 0.001; // Slight upward trend
    const value = baseValue * (1 + trendFactor + randomVariation);
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: Math.round(value)
    });
  }
  
  return data;
};

const fetchPortfolioPerformance = async () => {
  // For demo purposes, return mock data
  // In production, this would calculate your actual portfolio performance
  await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
  return generatePortfolioData();
};

const PortfolioCard = () => {
  const [timeFrame, setTimeFrame] = useState<'d' | 'w' | 'm' | 'y'>('d');
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();
  
  const { data: portfolioData, isLoading } = useQuery({
    queryKey: ['portfolioPerformance'],
    queryFn: fetchPortfolioPerformance,
    refetchInterval: 300000, // Refetch every 5 minutes
  });

  // Calculate portfolio stats based on time frame
  const currentValue = portfolioData?.[portfolioData.length - 1]?.value || 287500;
  
  // Get reference value based on timeframe
  const getReferenceValue = () => {
    if (!portfolioData) return 285000;
    
    switch (timeFrame) {
      case 'd': return portfolioData[portfolioData.length - 2]?.value || 285000;
      case 'w': return portfolioData[Math.max(0, portfolioData.length - 7)]?.value || 280000;
      case 'm': return portfolioData[0]?.value || 275000;
      case 'y': return 250000; // Mock yearly starting value
      default: return portfolioData[portfolioData.length - 2]?.value || 285000;
    }
  };
  
  const referenceValue = getReferenceValue();
  const change = currentValue - referenceValue;
  const changePercent = (change / referenceValue) * 100;
  
  const getTimeFrameLabel = () => {
    switch (timeFrame) {
      case 'd': return 'Daily P&L';
      case 'w': return 'Weekly P&L';
      case 'm': return 'Monthly P&L';
      case 'y': return 'Yearly P&L';
      default: return 'Daily P&L';
    }
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
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-secondary/20 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <DollarSignIcon className="w-3 h-3 text-primary" />
            <span className="text-xs text-muted-foreground">Total Value</span>
          </div>
          <p className="text-lg font-semibold">
            {formatPrivateValue(currentValue, isPrivacyMode)}
          </p>
        </div>
        <div className="bg-secondary/20 rounded-lg p-3 relative">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <BarChart3Icon className="w-3 h-3 text-success" />
              <span className="text-xs text-muted-foreground">{getTimeFrameLabel()}</span>
            </div>
            <div className="flex gap-1 p-1 bg-muted/20 rounded">
              {(['d', 'w', 'm', 'y'] as const).map((period) => (
                <Button
                  key={period}
                  variant={timeFrame === period ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeFrame(period)}
                  className="h-5 w-5 p-0 text-xs"
                >
                  {period}
                </Button>
              ))}
            </div>
          </div>
          <p className={`text-lg font-semibold ${change >= 0 ? 'text-success' : 'text-warning'}`}>
            {isPrivacyMode ? '••••' : `${change >= 0 ? '+' : ''}$${change.toFixed(0)}`}
          </p>
          <span className={`text-xs ${change >= 0 ? 'text-success' : 'text-warning'}`}>
            {isPrivacyMode ? '••••' : `(${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`}
          </span>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="w-full h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={portfolioData}>
            <XAxis 
              dataKey="date" 
              stroke="#E6E4DD"
              fontSize={10}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#E6E4DD"
              fontSize={10}
              domain={['dataMin - 1000', 'dataMax + 1000']}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              contentStyle={{ 
                background: '#3A3935',
                border: '1px solid #605F5B',
                borderRadius: '8px'
              }}
              labelStyle={{ color: '#E6E4DD' }}
              itemStyle={{ color: '#8989DE' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Portfolio Value']}
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8989DE" 
              strokeWidth={2}
              dot={false}
              strokeDasharray="0"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      {/* Average Price Calculator */}
      <div className="mt-4">
        <AveragePriceCalculator />
      </div>
    </div>
  );
};

export default PortfolioCard;