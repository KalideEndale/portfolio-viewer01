import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, BarChartIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
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
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Portfolio Value */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Total Portfolio Value</h3>
            <DollarSignIcon className="w-4 h-4 text-success" />
          </div>
          <p className="text-2xl font-semibold">
            {formatPrivateValue(287500, isPrivacyMode)}
          </p>
          <span className="text-sm text-success flex items-center gap-1 mt-1">
            <ArrowUpIcon className="w-3 h-3" />
            3.2%
          </span>
        </div>

        {/* P&L Section with Collapsible Time Frames */}
        <div className="p-4 border border-border rounded-lg">
          <Collapsible open={isPlExpanded} onOpenChange={setIsPlExpanded}>
            <CollapsibleTrigger asChild>
              <div className="flex items-center justify-between mb-2 cursor-pointer">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-medium text-muted-foreground">Profit & Loss</h3>
                  <TrendingUpIcon className="w-4 h-4 text-success" />
                </div>
                {isPlExpanded ? (
                  <ChevronUpIcon className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <ChevronDownIcon className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
            </CollapsibleTrigger>
            
            <p className="text-2xl font-semibold mb-2">
              {isPrivacyMode ? '••••' : `+$${(plData[plTimeFrame].value / 1000).toFixed(1)}K`}
            </p>
            <span className="text-sm text-success flex items-center gap-1">
              <ArrowUpIcon className="w-3 h-3" />
              {isPrivacyMode ? '••••' : `${plData[plTimeFrame].percentage}%`}
            </span>

            <CollapsibleContent className="mt-3">
              <div className="grid grid-cols-2 gap-2">
                {(['d', 'w', 'm', 'y'] as const).map((period) => (
                  <Button
                    key={period}
                    variant={plTimeFrame === period ? "default" : "outline"}
                    size="sm"
                    onClick={() => setPlTimeFrame(period)}
                    className="text-xs h-8"
                  >
                    {period === 'd' ? 'Day' : period === 'w' ? 'Week' : period === 'm' ? 'Month' : 'Year'}
                  </Button>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        {/* Active Stocks */}
        <div className="p-4 border border-border rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Stocks</h3>
            <BarChartIcon className="w-4 h-4 text-primary" />
          </div>
          <p className="text-2xl font-semibold">11</p>
          <span className="text-sm text-muted-foreground">
            Holdings
          </span>
        </div>
      </div>
    </div>
  );
};

export default PortfolioPerformance;