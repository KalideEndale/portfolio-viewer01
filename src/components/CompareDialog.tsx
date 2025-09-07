import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { TrendingUpIcon, Search } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CompareDialogProps {
  currentTimeFrame: 'd' | 'w' | 'm' | 'y' | 'all';
  portfolioReturn: number;
}

// Mock benchmark data
const BENCHMARKS = {
  'SPY': { name: 'SPDR S&P 500 ETF', symbol: 'SPY' },
  'QQQ': { name: 'Invesco QQQ ETF', symbol: 'QQQ' },
  'VTI': { name: 'Vanguard Total Stock Market ETF', symbol: 'VTI' },
  'TSLA': { name: 'Tesla Inc.', symbol: 'TSLA' },
  'AAPL': { name: 'Apple Inc.', symbol: 'AAPL' },
  'MSFT': { name: 'Microsoft Corporation', symbol: 'MSFT' },
  'GOOGL': { name: 'Alphabet Inc.', symbol: 'GOOGL' },
  'NVDA': { name: 'NVIDIA Corporation', symbol: 'NVDA' }
};

const generateComparisonData = (timeFrame: string, portfolioReturn: number, benchmarkReturn: number) => {
  const periods = timeFrame === 'd' ? 7 : timeFrame === 'w' ? 4 : timeFrame === 'm' ? 12 : 24;
  const data = [];
  
  for (let i = 0; i < periods; i++) {
    const progress = i / (periods - 1);
    const portfolioValue = 100 * (1 + (portfolioReturn / 100) * progress);
    const benchmarkValue = 100 * (1 + (benchmarkReturn / 100) * progress);
    
    data.push({
      period: i + 1,
      portfolio: portfolioValue,
      benchmark: benchmarkValue
    });
  }
  
  return data;
};

const CompareDialog = ({ currentTimeFrame, portfolioReturn }: CompareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('');
  const [customSymbol, setCustomSymbol] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const getTimeFrameLabel = () => {
    switch (currentTimeFrame) {
      case 'd': return 'Daily';
      case 'w': return 'Weekly';
      case 'm': return 'Monthly';
      case 'y': return 'Yearly';
      case 'all': return 'All-Time';
      default: return 'Daily';
    }
  };

  // Mock benchmark returns based on timeframe
  const getBenchmarkReturn = (symbol: string) => {
    const baseReturns: Record<string, number> = {
      'SPY': 2.1, 'QQQ': 2.8, 'VTI': 2.0, 'TSLA': -1.2, 
      'AAPL': 1.8, 'MSFT': 2.4, 'GOOGL': 1.5, 'NVDA': 3.2
    };
    
    const multipliers = { 'd': 1, 'w': 1.2, 'm': 2.1, 'y': 8.5, 'all': 15.2 };
    return (baseReturns[symbol] || 2.0) * (multipliers[currentTimeFrame] || 1);
  };

  const filteredBenchmarks = Object.entries(BENCHMARKS).filter(([symbol, data]) => 
    symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const benchmarkReturn = selectedBenchmark ? getBenchmarkReturn(selectedBenchmark) : 0;
  const comparisonData = selectedBenchmark ? 
    generateComparisonData(currentTimeFrame, portfolioReturn, benchmarkReturn) : [];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <TrendingUpIcon className="w-3 h-3 mr-1" />
          Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Compare Portfolio Performance</DialogTitle>
          <DialogDescription>
            Compare your {getTimeFrameLabel().toLowerCase()} returns against stocks, ETFs, or indices
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search and Select Benchmark */}
          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search stocks, ETFs, or indices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            {/* Popular Benchmarks */}
            <div className="flex flex-wrap gap-2">
              {filteredBenchmarks.slice(0, 6).map(([symbol, data]) => (
                <Button
                  key={symbol}
                  variant={selectedBenchmark === symbol ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedBenchmark(symbol)}
                  className="h-8"
                >
                  {symbol}
                </Button>
              ))}
            </div>

            {/* Custom Symbol Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Enter custom symbol (e.g., AMZN)"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button 
                variant="outline" 
                onClick={() => setSelectedBenchmark(customSymbol)}
                disabled={!customSymbol}
              >
                Compare
              </Button>
            </div>
          </div>

          {/* Comparison Results */}
          {selectedBenchmark && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-secondary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">Your Portfolio</Badge>
                  </div>
                  <p className={`text-2xl font-bold ${portfolioReturn >= 0 ? 'text-success' : 'text-warning'}`}>
                    {portfolioReturn >= 0 ? '+' : ''}{portfolioReturn.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground">{getTimeFrameLabel()} Return</p>
                </div>
                
                <div className="bg-secondary/20 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline">{selectedBenchmark}</Badge>
                  </div>
                  <p className={`text-2xl font-bold ${benchmarkReturn >= 0 ? 'text-success' : 'text-warning'}`}>
                    {benchmarkReturn >= 0 ? '+' : ''}{benchmarkReturn.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground">{getTimeFrameLabel()} Return</p>
                </div>
              </div>

              {/* Performance Difference */}
              <div className="bg-secondary/10 rounded-lg p-3 text-center">
                <p className={`text-lg font-semibold ${
                  (portfolioReturn - benchmarkReturn) >= 0 ? 'text-success' : 'text-warning'
                }`}>
                  {(portfolioReturn - benchmarkReturn) >= 0 ? 'Outperforming' : 'Underperforming'} by {Math.abs(portfolioReturn - benchmarkReturn).toFixed(2)}%
                </p>
              </div>

              {/* Comparison Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={comparisonData}>
                    <XAxis 
                      dataKey="period" 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(value) => `${(value - 100).toFixed(1)}%`}
                    />
                    <Tooltip 
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-card border border-border rounded p-2 shadow-lg">
                              <p className="text-xs font-medium">Period {label}</p>
                              {payload.map((entry, index) => (
                                <p key={index} className="text-xs" style={{ color: entry.color }}>
                                  {entry.name}: {((entry.value as number) - 100).toFixed(2)}%
                                </p>
                              ))}
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="portfolio" 
                      name="Your Portfolio"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="benchmark" 
                      name={selectedBenchmark}
                      stroke="hsl(var(--muted-foreground))"
                      strokeWidth={2}
                      strokeDasharray="3 3"
                      dot={{ fill: 'hsl(var(--muted-foreground))', strokeWidth: 0, r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareDialog;