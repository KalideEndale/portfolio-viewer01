import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Calculator, Plus, X } from "lucide-react";

interface Position {
  id: string;
  shares: number;
  price: number;
}

const AveragePriceCalculator = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [positions, setPositions] = useState<Position[]>([
    { id: '1', shares: 0, price: 0 }
  ]);

  const addPosition = () => {
    setPositions([...positions, { 
      id: Date.now().toString(), 
      shares: 0, 
      price: 0 
    }]);
  };

  const removePosition = (id: string) => {
    if (positions.length > 1) {
      setPositions(positions.filter(p => p.id !== id));
    }
  };

  const updatePosition = (id: string, field: 'shares' | 'price', value: number) => {
    setPositions(positions.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  // Calculate weighted average price
  const totalShares = positions.reduce((sum, p) => sum + p.shares, 0);
  const totalCost = positions.reduce((sum, p) => sum + (p.shares * p.price), 0);
  const weightedAverage = totalShares > 0 ? totalCost / totalShares : 0;

  const reset = () => {
    setPositions([{ id: '1', shares: 0, price: 0 }]);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Calculator className="w-4 h-4 mr-2" />
          Avg. Price Calculator
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Average Price Calculator</DialogTitle>
          <DialogDescription>
            Calculate weighted average price across multiple positions
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {positions.map((position, index) => (
            <div key={position.id} className="flex items-center gap-2 p-3 bg-secondary/20 rounded-lg">
              <div className="flex-1 space-y-2">
                <div className="text-xs text-muted-foreground">Position {index + 1}</div>
                <div className="flex gap-2">
                  <Input
                    placeholder="Shares"
                    type="number"
                    value={position.shares || ''}
                    onChange={(e) => updatePosition(position.id, 'shares', parseFloat(e.target.value) || 0)}
                    className="w-20 h-8 text-xs"
                  />
                  <Input
                    placeholder="Price"
                    type="number"
                    step="0.01"
                    value={position.price || ''}
                    onChange={(e) => updatePosition(position.id, 'price', parseFloat(e.target.value) || 0)}
                    className="w-24 h-8 text-xs"
                  />
                </div>
              </div>
              {positions.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removePosition(position.id)}
                  className="text-warning hover:text-warning h-8 w-8 p-0"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
          ))}
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={addPosition}
            className="w-full"
          >
            <Plus className="w-3 h-3 mr-1" />
            Add Position
          </Button>
          
          {/* Results */}
          <div className="mt-6 p-4 bg-primary/10 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Total Shares:</span>
                <p className="font-semibold">{totalShares.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Total Cost:</span>
                <p className="font-semibold">${totalCost.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-border">
              <span className="text-muted-foreground text-sm">Weighted Average Price:</span>
              <p className="text-lg font-bold text-primary">
                ${weightedAverage.toFixed(2)}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={reset} className="flex-1">
              Reset
            </Button>
            <Button onClick={() => setIsOpen(false)} className="flex-1">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AveragePriceCalculator;