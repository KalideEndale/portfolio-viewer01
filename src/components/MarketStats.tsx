import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, BarChartIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";

const MarketStats = () => {
  const [plTimeFrame, setPlTimeFrame] = useState<'d' | 'w' | 'm' | 'y'>('d');
  const { isPrivacyMode } = usePrivacy();
  
  // Mock P&L data for different time frames
  const plData = {
    d: { value: 8900, percentage: 3.2 },
    w: { value: 15600, percentage: 5.7 },
    m: { value: 34200, percentage: 13.5 },
    y: { value: 82400, percentage: 40.1 }
  };
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Portfolio Value</h3>
          <DollarSignIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">
          {formatPrivateValue(287500, isPrivacyMode)}
        </p>
        <span className="text-sm text-success flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          3.2%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg relative">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">
            {plTimeFrame === 'd' ? "Today's" : plTimeFrame === 'w' ? "This Week's" : plTimeFrame === 'm' ? "This Month's" : "This Year's"} P&L
          </h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">
          {isPrivacyMode ? '••••' : `+$${(plData[plTimeFrame].value / 1000).toFixed(1)}K`}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-success flex items-center gap-1">
            <ArrowUpIcon className="w-3 h-3" />
            {isPrivacyMode ? '••••' : `${plData[plTimeFrame].percentage}%`}
          </span>
          <div className="flex gap-1 mt-2">
            {(['d', 'w', 'm', 'y'] as const).map((period) => (
              <Button
                key={period}
                variant={plTimeFrame === period ? "default" : "ghost"}
                size="sm"
                onClick={() => setPlTimeFrame(period)}
                className="text-xs px-2 py-1 h-6 rounded"
              >
                {period.toUpperCase()}
              </Button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Active Stocks</h3>
          <BarChartIcon className="w-4 h-4 text-primary" />
        </div>
        <p className="text-2xl font-semibold mt-2">11</p>
        <span className="text-sm text-muted-foreground flex items-center gap-1">
          Holdings
        </span>
      </div>
    </div>
  );
};

export default MarketStats;