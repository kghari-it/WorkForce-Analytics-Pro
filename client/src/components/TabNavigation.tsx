import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TabNavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function TabNavigation({ activeTab, onTabChange }: TabNavigationProps) {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="daily" data-testid="tab-daily-entry">
          Daily Entry
        </TabsTrigger>
        <TabsTrigger value="dashboard" data-testid="tab-dashboard">
          Dashboard
        </TabsTrigger>
        <TabsTrigger value="settings" data-testid="tab-settings">
          Settings
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
