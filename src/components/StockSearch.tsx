import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Popular stocks database for search
const POPULAR_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A" },
  { symbol: "GOOG", name: "Alphabet Inc. Class C" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices Inc." },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ORCL", name: "Oracle Corporation" },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "UBER", name: "Uber Technologies Inc." },
  { symbol: "SPOT", name: "Spotify Technology S.A." },
  { symbol: "SNAP", name: "Snap Inc." },
  { symbol: "SQ", name: "Block Inc." },
  { symbol: "SHOP", name: "Shopify Inc." },
  { symbol: "ZM", name: "Zoom Video Communications Inc." },
  { symbol: "DOCU", name: "DocuSign Inc." },
  { symbol: "PLTR", name: "Palantir Technologies Inc." },
  { symbol: "RBLX", name: "Roblox Corporation" },
  { symbol: "COIN", name: "Coinbase Global Inc." },
  { symbol: "ABNB", name: "Airbnb Inc." },
  { symbol: "MELI", name: "MercadoLibre Inc." },
  { symbol: "NU", name: "Nu Holdings Ltd." },
  { symbol: "ASML", name: "ASML Holding N.V." },
  { symbol: "NBIS", name: "Nebius Group N.V." },
  { symbol: "GRAB", name: "Grab Holdings Limited" },
  { symbol: "NIO", name: "NIO Inc." },
  { symbol: "SPGI", name: "S&P Global Inc." },
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "BAC", name: "Bank of America Corporation" },
  { symbol: "WFC", name: "Wells Fargo & Company" },
  { symbol: "GS", name: "Goldman Sachs Group Inc." },
  { symbol: "MS", name: "Morgan Stanley" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "MA", name: "Mastercard Incorporated" },
  { symbol: "DIS", name: "Walt Disney Company" },
  { symbol: "NIKE", name: "Nike Inc." },
  { symbol: "KO", name: "Coca-Cola Company" },
  { symbol: "PEP", name: "PepsiCo Inc." },
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "MRNA", name: "Moderna Inc." },
  { symbol: "UNH", name: "UnitedHealth Group Incorporated" }
];

interface StockSearchProps {
  onSelect: (stock: { symbol: string; name: string }) => void;
  existingSymbols: string[];
}

const StockSearch = ({ onSelect, existingSymbols }: StockSearchProps) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStocks = POPULAR_STOCKS.filter(stock => 
    !existingSymbols.includes(stock.symbol) &&
    (stock.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
     stock.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSelect = (stock: { symbol: string; name: string }) => {
    onSelect(stock);
    setValue("");
    setSearchTerm("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          {value ? value : "Search stocks..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 bg-background border border-border" side="bottom" align="start">
        <Command>
          <CommandInput 
            placeholder="Search stocks..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No stocks found.</CommandEmpty>
            <CommandGroup>
              {filteredStocks.slice(0, 10).map((stock) => (
                <CommandItem
                  key={stock.symbol}
                  value={`${stock.symbol} ${stock.name}`}
                  onSelect={() => handleSelect(stock)}
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{stock.symbol}</span>
                    <span className="text-sm text-muted-foreground">{stock.name}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default StockSearch;