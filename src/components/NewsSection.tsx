import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { ExternalLink, Calendar, Building } from "lucide-react";

interface NewsArticle {
  id: string;
  headline: string;
  summary: string;
  source: string;
  publishedDate: string;
  url: string;
  symbol: string;
}

interface NewsSectionProps {
  selectedStocks: string[];
  onToggleStock: (symbol: string) => void;
  availableStocks: { symbol: string; name: string; }[];
}

// Mock news data generator
const generateNewsForSymbol = (symbol: string): NewsArticle[] => {
  const mockNews = [
    {
      headline: `${symbol} Reports Strong Q4 Earnings, Beats Analyst Expectations`,
      summary: `${symbol} delivered exceptional quarterly results with revenue growth exceeding forecasts. The company's strategic initiatives continue to drive market share expansion.`,
      source: "Financial Times",
      publishedDate: "2024-01-15T10:30:00Z"
    },
    {
      headline: `Analyst Upgrades ${symbol} to Buy Rating on Innovation Pipeline`,
      summary: `Leading investment firm raises price target following recent product announcements and strong competitive positioning in key markets.`,
      source: "Bloomberg",
      publishedDate: "2024-01-14T14:45:00Z"
    },
    {
      headline: `${symbol} Announces Strategic Partnership in AI Technology`,
      summary: `The company enters into a significant collaboration agreement that is expected to accelerate growth in artificial intelligence applications.`,
      source: "Reuters",
      publishedDate: "2024-01-13T09:15:00Z"
    }
  ];

  return mockNews.map((article, index) => ({
    id: `${symbol}-${index}`,
    ...article,
    symbol,
    url: `https://example.com/news/${symbol.toLowerCase()}-${index}`
  }));
};

const formatTimeAgo = (dateString: string): string => {
  const now = new Date();
  const publishedDate = new Date(dateString);
  const diffInHours = Math.floor((now.getTime() - publishedDate.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 24) {
    return `${diffInHours}h ago`;
  } else {
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  }
};

const NewsSection = ({ selectedStocks, onToggleStock, availableStocks }: NewsSectionProps) => {
  const [allNews] = useState(() => {
    // Generate news for all available stocks
    return availableStocks.flatMap(stock => generateNewsForSymbol(stock.symbol));
  });

  // Filter news based on selected stocks
  const filteredNews = selectedStocks.length > 0 
    ? allNews.filter(article => selectedStocks.includes(article.symbol))
    : allNews;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Stock News</h2>
        <p className="text-sm text-muted-foreground">
          {filteredNews.length} articles from {selectedStocks.length || availableStocks.length} stocks
        </p>
      </div>

      {/* Stock Filter */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Filter by Stock</h3>
        <div className="flex flex-wrap gap-2">
          {availableStocks.map(stock => (
            <Badge
              key={stock.symbol}
              variant={selectedStocks.includes(stock.symbol) ? "default" : "outline"}
              className="cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => onToggleStock(stock.symbol)}
            >
              {stock.symbol}
            </Badge>
          ))}
          {selectedStocks.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => selectedStocks.forEach(onToggleStock)}
              className="text-xs h-6"
            >
              Clear All
            </Button>
          )}
        </div>
      </div>

      {/* News Articles */}
      <div className="grid gap-4">
        {filteredNews.map(article => (
          <Card key={article.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {article.symbol}
                  </Badge>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatTimeAgo(article.publishedDate)}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {article.source}
                  </span>
                </div>
                
                <h3 className="font-medium leading-snug">
                  {article.headline}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {article.summary}
                </p>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="flex-shrink-0"
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No news articles found for selected stocks.</p>
        </div>
      )}
    </div>
  );
};

export default NewsSection;