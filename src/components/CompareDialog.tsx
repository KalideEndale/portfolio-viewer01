import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { TrendingUpIcon, Search } from "lucide-react";

interface CompareDialogProps {
  onCompare: (symbol: string, name: string) => void;
}

// Mock benchmark data
const BENCHMARKS = {
  'SPY': { name: 'SPDR S&P 500 ETF', symbol: 'SPY' },
  'QQQ': { name: 'Invesco QQQ ETF', symbol: 'QQQ' },
  'VTI': { name: 'Vanguard Total Stock Market ETF', symbol: 'VTI' },
  'IWM': { name: 'iShares Russell 2000 ETF', symbol: 'IWM' },
  'DIA': { name: 'SPDR Dow Jones Industrial Average ETF', symbol: 'DIA' },
  'TSLA': { name: 'Tesla Inc.', symbol: 'TSLA' },
  'AAPL': { name: 'Apple Inc.', symbol: 'AAPL' },
  'MSFT': { name: 'Microsoft Corporation', symbol: 'MSFT' },
  'GOOGL': { name: 'Alphabet Inc.', symbol: 'GOOGL' },
  'NVDA': { name: 'NVIDIA Corporation', symbol: 'NVDA' },
  'AMZN': { name: 'Amazon.com Inc.', symbol: 'AMZN' },
  'META': { name: 'Meta Platforms Inc.', symbol: 'META' }
};

const CompareDialog = ({ onCompare }: CompareDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [customSymbol, setCustomSymbol] = useState('');

  const filteredBenchmarks = Object.entries(BENCHMARKS).filter(([symbol, data]) => 
    symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
    data.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCompare = (symbol: string, name: string) => {
    onCompare(symbol, name);
    setIsOpen(false);
  };

  const handleCustomCompare = () => {
    if (customSymbol.trim()) {
      handleCompare(customSymbol.trim().toUpperCase(), customSymbol.trim().toUpperCase());
      setCustomSymbol('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
          <TrendingUpIcon className="w-3 h-3 mr-1" />
          Compare
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Compare Portfolio</DialogTitle>
          <DialogDescription>
            Select a stock, ETF, or index to compare against your portfolio
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search stocks, ETFs, or indices..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          
          {/* Popular Options */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Popular Options</p>
            <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {filteredBenchmarks.map(([symbol, data]) => (
                <Button
                  key={symbol}
                  variant="outline"
                  size="sm"
                  onClick={() => handleCompare(symbol, data.name)}
                  className="justify-start text-left h-auto p-2"
                >
                  <div>
                    <div className="font-medium text-xs">{symbol}</div>
                    <div className="text-xs text-muted-foreground truncate">{data.name}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Custom Symbol */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Custom Symbol</p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter symbol (e.g., AMZN)"
                value={customSymbol}
                onChange={(e) => setCustomSymbol(e.target.value.toUpperCase())}
                className="flex-1"
              />
              <Button 
                onClick={handleCustomCompare}
                disabled={!customSymbol.trim()}
                size="sm"
              >
                Compare
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CompareDialog;