import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const PortfolioPerformance = () => {
  const [plTimeFrame, setPlTimeFrame] = useState<'d' | 'w' | 'm' | 'y'>('d');
  const [isPlExpanded, setIsPlExpanded] = useState(false);
  const {
    isPrivacyMode
  } = usePrivacy();

  // Mock P&L data for different time frames
  const plData = {
    d: {
      value: 8900,
      percentage: 3.2
    },
    w: {
      value: 15600,
      percentage: 5.7
    },
    m: {
      value: 34200,
      percentage: 13.5
    },
    y: {
      value: 82400,
      percentage: 40.1
    }
  };
  const currentData = plData[plTimeFrame];

  return (
    <div className="bg-card text-card-foreground rounded-lg border p-6 shadow-sm mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Portfolio Performance</h2>
      </div>
      
      <Collapsible open={isPlExpanded} onOpenChange={setIsPlExpanded}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto">
            <span className="text-sm font-medium">Time Frame: {plTimeFrame.toUpperCase()}</span>
            {isPlExpanded ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="space-y-2 mt-2">
          <div className="flex gap-2">
            {(['d', 'w', 'm', 'y'] as const).map((timeframe) => (
              <Button
                key={timeframe}
                variant={plTimeFrame === timeframe ? "default" : "outline"}
                size="sm"
                onClick={() => setPlTimeFrame(timeframe)}
              >
                {timeframe.toUpperCase()}
              </Button>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSignIcon className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Value</p>
            <p className="text-lg font-semibold">
              {formatPrivateValue(currentData.value, isPrivacyMode)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <div className="p-2 bg-green-500/10 rounded-full">
            <TrendingUpIcon className="h-5 w-5 text-green-500" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Gain/Loss</p>
            <p className="text-lg font-semibold text-green-500">
              +{formatPrivateValue(currentData.percentage, isPrivacyMode, "••••")}%
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
          <div className="p-2 bg-blue-500/10 rounded-full">
            {currentData.percentage > 0 ? (
              <ArrowUpIcon className="h-5 w-5 text-green-500" />
            ) : (
              <ArrowDownIcon className="h-5 w-5 text-red-500" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Performance</p>
            <p className={`text-lg font-semibold ${currentData.percentage > 0 ? 'text-green-500' : 'text-red-500'}`}>
              {currentData.percentage > 0 ? 'Positive' : 'Negative'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PortfolioPerformance;