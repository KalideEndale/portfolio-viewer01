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
  tags: string[];
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
      publishedDate: "2024-01-15T10:30:00Z",
      tags: ["earnings", "financial"]
    },
    {
      headline: `Analyst Upgrades ${symbol} to Buy Rating on Innovation Pipeline`,
      summary: `Leading investment firm raises price target following recent product announcements and strong competitive positioning in key markets.`,
      source: "Bloomberg",
      publishedDate: "2024-01-14T14:45:00Z",
      tags: ["analyst", "rating"]
    },
    {
      headline: `${symbol} Announces Strategic Partnership in AI Technology`,
      summary: `The company enters into a significant collaboration agreement that is expected to accelerate growth in artificial intelligence applications.`,
      source: "Reuters",
      publishedDate: "2024-01-13T09:15:00Z",
      tags: ["partnership", "product announcement"]
    },
    {
      headline: `${symbol} CEO Discusses Future Growth Strategy in Interview`,
      summary: `Company leadership outlines ambitious expansion plans and discusses market opportunities during recent investor call.`,
      source: "CNBC",
      publishedDate: "2024-01-12T16:20:00Z",
      tags: ["management", "strategy"]
    },
    {
      headline: `${symbol} Stock Volatility Increases Following Market News`,
      summary: `Trading volumes spike as investors react to broader market developments and sector-specific announcements.`,
      source: "MarketWatch",
      publishedDate: "2024-01-11T11:30:00Z",
      tags: ["market", "volatility"]
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
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [allNews] = useState(() => {
    // Generate news for all available stocks and sort by date (most recent first)
    return availableStocks
      .flatMap(stock => generateNewsForSymbol(stock.symbol))
      .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
  });

  // Get all unique tags from news
  const allTags = Array.from(new Set(allNews.flatMap(article => article.tags)));

  // Filter news based on selected stocks and tags
  let filteredNews = selectedStocks.length > 0 
    ? allNews.filter(article => selectedStocks.includes(article.symbol))
    : allNews;
  
  if (selectedTags.length > 0) {
    filteredNews = filteredNews.filter(article => 
      article.tags.some(tag => selectedTags.includes(tag))
    );
  }

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Market News</h2>
        <p className="text-sm text-muted-foreground">
          {filteredNews.length} articles • Sorted by latest
        </p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Stock Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Filter by Portfolio Companies</h3>
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

        {/* Tag Filter */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Filter by Category</h3>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <Badge
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                className="cursor-pointer hover:opacity-80 transition-opacity capitalize"
                onClick={() => toggleTag(tag)}
              >
                {tag}
              </Badge>
            ))}
            {selectedTags.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTags([])}
                className="text-xs h-6"
              >
                Clear Tags
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* News Feed */}
      <div className="space-y-3">
        {filteredNews.map(article => (
          <div key={article.id} className="border-l-2 border-border pl-4 py-3 hover:border-primary/50 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {article.symbol}
                  </Badge>
                  {article.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs capitalize">
                      {tag}
                    </Badge>
                  ))}
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatTimeAgo(article.publishedDate)}
                  </span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Building className="w-3 h-3" />
                    {article.source}
                  </span>
                </div>
                
                <h3 className="font-semibold leading-snug text-foreground hover:text-primary transition-colors cursor-pointer">
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
                className="flex-shrink-0 opacity-60 hover:opacity-100"
              >
                <a href={article.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-lg">No news articles found</p>
          <p className="text-sm">Try adjusting your filters or check back later</p>
        </div>
      )}
    </div>
  );
};

export default NewsSection;