import { useState } from 'react';
import { useQuery } from "@tanstack/react-query";
import { XIcon, ExternalLinkIcon, CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// Mock news data - in production, you'd fetch from a news API
const generateMockNews = (symbol: string) => {
  const newsTypes = [
    'earnings', 'analyst upgrade', 'product launch', 'market analysis', 'insider trading'
  ];
  
  const baseNews = [
    {
      id: 1,
      headline: `${symbol} Reports Strong Q4 Earnings Beat`,
      summary: `${symbol} exceeded analyst expectations with robust revenue growth and improved margins.`,
      source: 'Financial Times',
      publishedAt: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      url: '#'
    },
    {
      id: 2,
      headline: `Analysts Upgrade ${symbol} Price Target`,
      summary: `Multiple investment firms raise price targets citing strong fundamentals and market position.`,
      source: 'Reuters',
      publishedAt: new Date(Date.now() - Math.random() * 48 * 60 * 60 * 1000).toISOString(),
      url: '#'
    },
    {
      id: 3,
      headline: `${symbol} Announces Strategic Partnership`,
      summary: `Company forms new alliance to expand market reach and accelerate growth initiatives.`,
      source: 'Bloomberg',
      publishedAt: new Date(Date.now() - Math.random() * 72 * 60 * 60 * 1000).toISOString(),
      url: '#'
    },
    {
      id: 4,
      headline: `Market Analysis: ${symbol} Outlook for 2025`,
      summary: `Industry experts weigh in on the company's prospects amid changing market conditions.`,
      source: 'MarketWatch',
      publishedAt: new Date(Date.now() - Math.random() * 96 * 60 * 60 * 1000).toISOString(),
      url: '#'
    },
    {
      id: 5,
      headline: `${symbol} Insider Trading Activity Reported`,
      summary: `Recent SEC filings show executive transactions that may signal confidence in company direction.`,
      source: 'SEC Filings',
      publishedAt: new Date(Date.now() - Math.random() * 120 * 60 * 60 * 1000).toISOString(),
      url: '#'
    }
  ];

  return baseNews;
};

const fetchStockNews = async (symbol: string) => {
  // For demo purposes, return mock data
  // In production, you'd fetch from a real news API like NewsAPI, Alpha Vantage, etc.
  await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
  return generateMockNews(symbol);
};

interface StockNewsProps {
  symbol: string;
  onClose: () => void;
}

const StockNews = ({ symbol, onClose }: StockNewsProps) => {
  const { data: news, isLoading } = useQuery({
    queryKey: ['stock-news', symbol],
    queryFn: () => fetchStockNews(symbol),
    enabled: !!symbol,
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden bg-background">
        <div className="flex items-center justify-between p-6 border-b border-secondary">
          <h2 className="text-xl font-semibold">Latest News for {symbol}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <XIcon className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="overflow-y-auto p-6 max-h-[60vh]">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-secondary rounded mb-2"></div>
                  <div className="h-3 bg-secondary rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-secondary rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {news?.map((article) => (
                <div key={article.id} className="border border-secondary rounded-lg p-4 hover:bg-secondary/20 transition-colors">
                  <h3 className="font-semibold text-lg mb-2 text-foreground">
                    {article.headline}
                  </h3>
                  <p className="text-muted-foreground mb-3 leading-relaxed">
                    {article.summary}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-4">
                      <span className="text-primary font-medium">{article.source}</span>
                      <span className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="w-3 h-3" />
                        {formatDate(article.publishedAt)}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" asChild>
                      <a href={article.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLinkIcon className="w-3 h-3 mr-1" />
                        Read more
                      </a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-secondary bg-secondary/10">
          <p className="text-sm text-muted-foreground text-center">
            📰 News data is for demonstration purposes. Connect to a real news API for live data.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default StockNews;