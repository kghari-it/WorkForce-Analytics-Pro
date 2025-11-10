import { useState, useEffect } from 'react';
import TabNavigation from '@/components/TabNavigation';
import DailyEntry from '@/components/DailyEntry';
import Dashboard from '@/components/Dashboard';
import Settings from '@/components/Settings';
import { storage } from '@/lib/storage';
import { Briefcase, Sparkles } from 'lucide-react';

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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/5 via-chart-1/5 to-chart-3/5">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <Sparkles className="w-8 h-8 text-primary absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
          </div>
          <p className="text-lg font-medium text-muted-foreground">Loading WorkForce Analytics...</p>
          <p className="text-sm text-muted-foreground/60 mt-2">Preparing your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-chart-1 flex items-center justify-center shadow-md">
              <Briefcase className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-chart-1 to-chart-3 bg-clip-text text-transparent tracking-tight">
                WorkForce Analytics Pro
              </h1>
              <p className="text-xs text-muted-foreground">Productivity & Payroll Management</p>
            </div>
          </div>
          <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 min-h-[calc(100vh-180px)]">
        {activeTab === 'daily' && <DailyEntry />}
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  );
}
