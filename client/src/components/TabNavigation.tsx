import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit3, BarChart3, Settings } from 'lucide-react';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3 h-12">
        <TabsTrigger value="daily" data-testid="tab-daily-entry" className="gap-2">
          <Edit3 className="w-4 h-4" />
          <span className="hidden sm:inline">Daily Entry</span>
          <span className="sm:hidden">Daily</span>
        </TabsTrigger>
        <TabsTrigger value="dashboard" data-testid="tab-dashboard" className="gap-2">
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Dashboard</span>
          <span className="sm:hidden">Stats</span>
        </TabsTrigger>
        <TabsTrigger value="settings" data-testid="tab-settings" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
