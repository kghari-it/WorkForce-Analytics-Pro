import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { storage, WorkerSettings } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw } from 'lucide-react';

export default function Settings() {
  const [workers, setWorkers] = useState<WorkerSettings[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkers();
  }, []);

  const loadWorkers = async () => {
    const workerSettings = await storage.getWorkerSettings();
    setWorkers(workerSettings);
  };

  const handleSave = async () => {
    await storage.saveWorkerSettings(workers);
    toast({
      title: 'Saved',
      description: 'Worker names updated successfully',
    });
  };

  const handleReset = async () => {
    const defaultWorkers = [
      { id: 'worker-a', name: 'Worker A' },
      { id: 'worker-b', name: 'Worker B' },
      { id: 'worker-c', name: 'Worker C' },
    ];
    await storage.saveWorkerSettings(defaultWorkers);
    setWorkers(defaultWorkers);
    toast({
      title: 'Reset',
      description: 'Worker names reset to defaults',
    });
  };

  const updateWorkerName = (id: string, name: string) => {
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, name } : w));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Worker Names</h2>
        <div className="space-y-4">
          {workers.map((worker, index) => (
            <div key={worker.id} className="space-y-2">
              <Label htmlFor={`worker-name-${worker.id}`}>
                Worker {String.fromCharCode(65 + index)}
              </Label>
              <Input
                id={`worker-name-${worker.id}`}
                value={worker.name}
                onChange={(e) => updateWorkerName(worker.id, e.target.value)}
                placeholder={`Worker ${String.fromCharCode(65 + index)}`}
                data-testid={`input-worker-name-${worker.id}`}
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-2">
        <Button onClick={handleSave} data-testid="button-save-settings">
          <Save className="w-4 h-4 mr-2" />
          Save Settings
        </Button>
        <Button onClick={handleReset} variant="outline" data-testid="button-reset-settings">
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset to Defaults
        </Button>
      </div>
    </div>
  );
}
