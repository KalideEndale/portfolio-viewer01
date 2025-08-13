import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, X, GripVertical, Edit } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import StockSearch from "./StockSearch";

export interface Stock {
  symbol: string;
  name: string;
  shares?: number;
  averagePrice?: number;
}

interface PortfolioManagerProps {
  stocks: Stock[];
  onUpdateStocks: (stocks: Stock[]) => void;
}

const PortfolioManager = ({ stocks, onUpdateStocks }: PortfolioManagerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [editingStock, setEditingStock] = useState<string | null>(null);
  const [editShares, setEditShares] = useState("");
  const [editPrice, setEditPrice] = useState("");

  const handleAddStock = (selectedStock: { symbol: string; name: string }) => {
    const newStock = {
      ...selectedStock,
      shares: 0,
      averagePrice: 0
    };
    onUpdateStocks([...stocks, newStock]);
  };

  const handleEditStock = (symbol: string) => {
    const stock = stocks.find(s => s.symbol === symbol);
    if (stock) {
      setEditingStock(symbol);
      setEditShares(stock.shares?.toString() || "");
      setEditPrice(stock.averagePrice?.toString() || "");
    }
  };

  const handleSaveEdit = () => {
    if (editingStock) {
      const updatedStocks = stocks.map(stock => 
        stock.symbol === editingStock 
          ? { 
              ...stock, 
              shares: parseFloat(editShares) || 0,
              averagePrice: parseFloat(editPrice) || 0
            }
          : stock
      );
      onUpdateStocks(updatedStocks);
      setEditingStock(null);
      setEditShares("");
      setEditPrice("");
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
            <StockSearch 
              onSelect={handleAddStock}
              existingSymbols={stocks.map(s => s.symbol)}
            />
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
                            <div className="flex items-center gap-3 flex-1">
                              <div {...provided.dragHandleProps}>
                                <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab" />
                              </div>
                              <div className="flex-1">
                                <Badge variant="outline">{stock.symbol}</Badge>
                                <p className="text-sm text-muted-foreground mt-1">{stock.name}</p>
                                {editingStock === stock.symbol ? (
                                  <div className="flex gap-2 mt-2">
                                    <Input
                                      placeholder="Shares"
                                      value={editShares}
                                      onChange={(e) => setEditShares(e.target.value)}
                                      className="w-20 h-8 text-xs"
                                      type="number"
                                    />
                                    <Input
                                      placeholder="Avg Price"
                                      value={editPrice}
                                      onChange={(e) => setEditPrice(e.target.value)}
                                      className="w-24 h-8 text-xs"
                                      type="number"
                                      step="0.01"
                                    />
                                    <Button size="sm" onClick={handleSaveEdit} className="h-8">
                                      Save
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {stock.shares ? `${stock.shares} shares @ $${stock.averagePrice?.toFixed(2)}` : 'No position'}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditStock(stock.symbol)}
                                className="text-primary hover:text-primary"
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveStock(stock.symbol)}
                                className="text-warning hover:text-warning"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
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