import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X, GripVertical } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export interface Stock {
  symbol: string;
  name: string;
}

interface PortfolioManagerProps {
  stocks: Stock[];
  onUpdateStocks: (stocks: Stock[]) => void;
}

const PortfolioManager = ({ stocks, onUpdateStocks }: PortfolioManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSymbol, setNewSymbol] = useState("");
  const [newName, setNewName] = useState("");

  const handleAddStock = () => {
    if (newSymbol.trim() && newName.trim()) {
      const newStock = {
        symbol: newSymbol.toUpperCase().trim(),
        name: newName.trim()
      };
      onUpdateStocks([...stocks, newStock]);
      setNewSymbol("");
      setNewName("");
    }
  };

  const handleRemoveStock = (symbolToRemove: string) => {
    onUpdateStocks(stocks.filter(stock => stock.symbol !== symbolToRemove));
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(stocks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    onUpdateStocks(items);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Manage Portfolio
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Your Portfolio</DialogTitle>
          <DialogDescription>
            Add, remove, or reorder stocks in your portfolio
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Add New Stock */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Add New Stock</h3>
            <div className="flex gap-2">
              <Input
                placeholder="Symbol (e.g., AAPL)"
                value={newSymbol}
                onChange={(e) => setNewSymbol(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Company Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="flex-2"
              />
              <Button onClick={handleAddStock} disabled={!newSymbol.trim() || !newName.trim()}>
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Current Portfolio */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium">Current Portfolio ({stocks.length} stocks)</h3>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="portfolio">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-2 max-h-60 overflow-y-auto"
                  >
                    {stocks.map((stock, index) => (
                      <Draggable key={stock.symbol} draggableId={stock.symbol} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`flex items-center justify-between p-3 bg-secondary/20 rounded-lg border ${
                              snapshot.isDragging ? 'border-primary' : 'border-secondary'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                              </div>
                              <div>
                                <Badge variant="outline">{stock.symbol}</Badge>
                                <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveStock(stock.symbol)}
                              className="text-warning hover:text-warning"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PortfolioManager;