import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const PortfolioPerformance = () => {
  const [plTimeFrame, setPlTimeFrame] = useState<'d' | 'w' | 'm' | 'y'>('d');
  const [isPlExpanded, setIsPlExpanded] = useState(false);
  const { isPrivacyMode } = usePrivacy();
  
  // Mock P&L data for different time frames
  const plData = {
    d: { value: 8900, percentage: 3.2 },
    w: { value: 15600, percentage: 5.7 },
    m: { value: 34200, percentage: 13.5 },
    y: { value: 82400, percentage: 40.1 }
  };

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
      </div>
      
      {/* Active Stocks Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">Active Stocks</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { symbol: 'ASML', price: 756.40, change: 2.1 },
            { symbol: 'GOOG', price: 163.85, change: -0.9 },
            { symbol: 'NVDA', price: 445.20, change: 3.8 },
            { symbol: 'TSLA', price: 248.30, change: 1.5 }
          ].map((stock) => (
            <div key={stock.symbol} className="p-3 rounded-lg border border-border bg-card">
              <div className="font-medium text-sm">{stock.symbol}</div>
              <div className="text-lg font-semibold">${stock.price}</div>
              <div className={`text-xs ${stock.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stock.change >= 0 ? '+' : ''}{stock.change}%
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;