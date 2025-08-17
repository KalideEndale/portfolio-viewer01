import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, DollarSignIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { usePrivacy, formatPrivateValue } from "@/contexts/PrivacyContext";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
const PortfolioPerformance = () => {
  const [plTimeFrame, setPlTimeFrame] = useState<'d' | 'w' | 'm' | 'y'>('d');
  const [isPlExpanded, setIsPlExpanded] = useState(false);
  const {
    isPrivacyMode
  } = usePrivacy();

  // Mock P&L data for different time frames
  const plData = {
    d: {
      value: 8900,
      percentage: 3.2
    },
    w: {
      value: 15600,
      percentage: 5.7
    },
    m: {
      value: 34200,
      percentage: 13.5
    },
    y: {
      value: 82400,
      percentage: 40.1
    }
  };
  return;
};
export default PortfolioPerformance;