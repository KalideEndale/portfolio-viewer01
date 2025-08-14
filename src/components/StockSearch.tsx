import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Expanded stocks database for search
const POPULAR_STOCKS = [
  // Tech Giants
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "MSFT", name: "Microsoft Corporation" },
  { symbol: "GOOGL", name: "Alphabet Inc. Class A" },
  { symbol: "GOOG", name: "Alphabet Inc. Class C" },
  { symbol: "AMZN", name: "Amazon.com Inc." },
  { symbol: "META", name: "Meta Platforms Inc." },
  { symbol: "TSLA", name: "Tesla Inc." },
  { symbol: "NVDA", name: "NVIDIA Corporation" },
  { symbol: "NFLX", name: "Netflix Inc." },
  { symbol: "AMD", name: "Advanced Micro Devices Inc." },
  { symbol: "ORCL", name: "Oracle Corporation" },
  { symbol: "CRM", name: "Salesforce Inc." },
  { symbol: "ADBE", name: "Adobe Inc." },
  { symbol: "INTC", name: "Intel Corporation" },
  { symbol: "IBM", name: "International Business Machines" },
  { symbol: "CSCO", name: "Cisco Systems Inc." },
  
  // Financial Services
  { symbol: "JPM", name: "JPMorgan Chase & Co." },
  { symbol: "BAC", name: "Bank of America Corporation" },
  { symbol: "WFC", name: "Wells Fargo & Company" },
  { symbol: "GS", name: "Goldman Sachs Group Inc." },
  { symbol: "MS", name: "Morgan Stanley" },
  { symbol: "V", name: "Visa Inc." },
  { symbol: "MA", name: "Mastercard Incorporated" },
  { symbol: "PYPL", name: "PayPal Holdings Inc." },
  { symbol: "SQ", name: "Block Inc." },
  { symbol: "COIN", name: "Coinbase Global Inc." },
  { symbol: "AXP", name: "American Express Company" },
  { symbol: "C", name: "Citigroup Inc." },
  { symbol: "BRK.A", name: "Berkshire Hathaway Inc. Class A" },
  { symbol: "BRK.B", name: "Berkshire Hathaway Inc. Class B" },
  
  // Healthcare & Pharma
  { symbol: "JNJ", name: "Johnson & Johnson" },
  { symbol: "PFE", name: "Pfizer Inc." },
  { symbol: "UNH", name: "UnitedHealth Group Incorporated" },
  { symbol: "MRNA", name: "Moderna Inc." },
  { symbol: "ABBV", name: "AbbVie Inc." },
  { symbol: "BMY", name: "Bristol-Myers Squibb Company" },
  { symbol: "LLY", name: "Eli Lilly and Company" },
  { symbol: "MRK", name: "Merck & Co. Inc." },
  { symbol: "GILD", name: "Gilead Sciences Inc." },
  { symbol: "AMGN", name: "Amgen Inc." },
  
  // Consumer Goods
  { symbol: "KO", name: "Coca-Cola Company" },
  { symbol: "PEP", name: "PepsiCo Inc." },
  { symbol: "PG", name: "Procter & Gamble Company" },
  { symbol: "WMT", name: "Walmart Inc." },
  { symbol: "TGT", name: "Target Corporation" },
  { symbol: "HD", name: "Home Depot Inc." },
  { symbol: "LOW", name: "Lowe's Companies Inc." },
  { symbol: "MCD", name: "McDonald's Corporation" },
  { symbol: "SBUX", name: "Starbucks Corporation" },
  { symbol: "NKE", name: "Nike Inc." },
  { symbol: "COST", name: "Costco Wholesale Corporation" },
  
  // Entertainment & Media
  { symbol: "DIS", name: "Walt Disney Company" },
  { symbol: "CMCSA", name: "Comcast Corporation" },
  { symbol: "T", name: "AT&T Inc." },
  { symbol: "VZ", name: "Verizon Communications Inc." },
  { symbol: "ROKU", name: "Roku Inc." },
  { symbol: "SPOT", name: "Spotify Technology S.A." },
  
  // Growth & Emerging
  { symbol: "UBER", name: "Uber Technologies Inc." },
  { symbol: "LYFT", name: "Lyft Inc." },
  { symbol: "ABNB", name: "Airbnb Inc." },
  { symbol: "SNAP", name: "Snap Inc." },
  { symbol: "TWTR", name: "Twitter Inc." },
  { symbol: "SHOP", name: "Shopify Inc." },
  { symbol: "ZM", name: "Zoom Video Communications Inc." },
  { symbol: "DOCU", name: "DocuSign Inc." },
  { symbol: "PLTR", name: "Palantir Technologies Inc." },
  { symbol: "RBLX", name: "Roblox Corporation" },
  { symbol: "SNOW", name: "Snowflake Inc." },
  { symbol: "CRWD", name: "CrowdStrike Holdings Inc." },
  
  // International & ADRs
  { symbol: "MELI", name: "MercadoLibre Inc." },
  { symbol: "NU", name: "Nu Holdings Ltd." },
  { symbol: "ASML", name: "ASML Holding N.V." },
  { symbol: "NBIS", name: "Nebius Group N.V." },
  { symbol: "GRAB", name: "Grab Holdings Limited" },
  { symbol: "NIO", name: "NIO Inc." },
  { symbol: "BABA", name: "Alibaba Group Holding Limited" },
  { symbol: "JD", name: "JD.com Inc." },
  { symbol: "PDD", name: "PDD Holdings Inc." },
  { symbol: "BIDU", name: "Baidu Inc." },
  { symbol: "TSM", name: "Taiwan Semiconductor Manufacturing" },
  { symbol: "SAP", name: "SAP SE" },
  { symbol: "NVO", name: "Novo Nordisk A/S" },
  
  // Energy & Utilities
  { symbol: "XOM", name: "Exxon Mobil Corporation" },
  { symbol: "CVX", name: "Chevron Corporation" },
  { symbol: "COP", name: "ConocoPhillips" },
  { symbol: "SLB", name: "Schlumberger Limited" },
  { symbol: "NEE", name: "NextEra Energy Inc." },
  
  // Industrial & Materials
  { symbol: "BA", name: "Boeing Company" },
  { symbol: "CAT", name: "Caterpillar Inc." },
  { symbol: "MMM", name: "3M Company" },
  { symbol: "GE", name: "General Electric Company" },
  { symbol: "HON", name: "Honeywell International Inc." },
  
  // Real Estate & REITs
  { symbol: "SPG", name: "Simon Property Group Inc." },
  { symbol: "PLD", name: "Prologis Inc." },
  { symbol: "AMT", name: "American Tower Corporation" },
  { symbol: "CCI", name: "Crown Castle Inc." },
  
  // Others
  { symbol: "SPGI", name: "S&P Global Inc." },
  { symbol: "CME", name: "CME Group Inc." },
  { symbol: "ICE", name: "Intercontinental Exchange Inc." },
  { symbol: "BLK", name: "BlackRock Inc." },
  { symbol: "SCHW", name: "Charles Schwab Corporation" }
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