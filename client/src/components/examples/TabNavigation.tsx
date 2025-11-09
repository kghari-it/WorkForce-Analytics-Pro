import { useState } from 'react';
import TabNavigation from '../TabNavigation';

export default function TabNavigationExample() {
  const [activeTab, setActiveTab] = useState('daily');

  return (
    <div className="max-w-2xl p-4">
      <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="mt-4 p-4 border rounded-md">
        <p className="text-muted-foreground">Active tab: {activeTab}</p>
      </div>
    </div>
  );
}
