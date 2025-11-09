import { useState, useEffect } from 'react';
import TabNavigation from '@/components/TabNavigation';
import DailyEntry from '@/components/DailyEntry';
import Dashboard from '@/components/Dashboard';
import Settings from '@/components/Settings';
import { storage } from '@/lib/storage';

export default function Home() {
  const [activeTab, setActiveTab] = useState('daily');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initStorage = async () => {
      await storage.init();
      await storage.seedSampleData();
      setInitialized(true);
    };
    initStorage();
  }, []);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-semibold mb-4 bg-gradient-to-r from-primary to-chart-3 bg-clip-text text-transparent">
            Productivity & Salary Tracker
          </h1>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'daily' && <DailyEntry />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
