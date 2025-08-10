import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, BarChartIcon } from "lucide-react";

const MarketStats = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Portfolio Value</h3>
          <DollarSignIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">$287.5K</p>
        <span className="text-sm text-success flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          3.2%
        </span>
      </div>
      
      <div className="glass-card p-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-muted-foreground">Today's P&L</h3>
          <TrendingUpIcon className="w-4 h-4 text-success" />
        </div>
        <p className="text-2xl font-semibold mt-2">+$8.9K</p>
        <span className="text-sm text-success flex items-center gap-1">
          <ArrowUpIcon className="w-3 h-3" />
          3.2%
        </span>
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