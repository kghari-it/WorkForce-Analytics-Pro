import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { storage, WorkerSettings } from '@/lib/storage';
import { useToast } from '@/hooks/use-toast';
import { Save, RotateCcw, Plus, Trash2, AlertTriangle } from 'lucide-react';

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
      description: 'Worker settings updated successfully',
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

  const addWorker = () => {
    const newId = `worker-${Date.now()}`;
    const newWorker: WorkerSettings = {
      id: newId,
      name: `Worker ${String.fromCharCode(65 + workers.length)}`,
    };
    setWorkers(prev => [...prev, newWorker]);
  };

  const removeWorker = (id: string) => {
    setWorkers(prev => prev.filter(w => w.id !== id));
  };

  const handleDeleteData = async (range: string) => {
    const today = new Date();
    let startDate = '';
    let endDate = today.toISOString().split('T')[0];

    switch (range) {
      case 'all':
        await storage.deleteAllRecords();
        toast({
          title: 'Data Deleted',
          description: 'All records have been deleted',
          variant: 'destructive',
        });
        return;
      
      case 'day':
        startDate = endDate;
        break;
      
      case 'week':
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        startDate = weekAgo.toISOString().split('T')[0];
        break;
      
      case 'month':
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        startDate = monthAgo.toISOString().split('T')[0];
        break;
      
      case 'year':
        const yearAgo = new Date(today);
        yearAgo.setFullYear(yearAgo.getFullYear() - 1);
        startDate = yearAgo.toISOString().split('T')[0];
        break;
    }

    await storage.deleteRecordsByDateRange(startDate, endDate);
    toast({
      title: 'Data Deleted',
      description: `Records from ${startDate} to ${endDate} have been deleted`,
      variant: 'destructive',
    });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Workers</h2>
          <Button onClick={addWorker} size="sm" variant="outline" data-testid="button-add-worker">
            <Plus className="w-4 h-4 mr-2" />
            Add Worker
          </Button>
        </div>
        <div className="space-y-4">
          {workers.map((worker, index) => (
            <div key={worker.id} className="flex gap-2 items-end">
              <div className="flex-1 space-y-2">
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
              {workers.length > 1 && (
                <Button
                  onClick={() => removeWorker(worker.id)}
                  size="icon"
                  variant="outline"
                  data-testid={`button-remove-worker-${worker.id}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
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

      <Card className="p-6 border-destructive/50">
        <div className="flex items-start gap-3 mb-4">
          <AlertTriangle className="w-5 h-5 text-destructive mt-0.5" />
          <div>
            <h2 className="text-lg font-semibold text-destructive">Danger Zone</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Delete records permanently. This action cannot be undone.
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" data-testid="button-delete-day">
                Today
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Today's Records?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all records for today. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteData('day')}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" data-testid="button-delete-week">
                This Week
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete This Week's Records?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all records from the last 7 days. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteData('week')}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" data-testid="button-delete-month">
                This Month
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete This Month's Records?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all records from the last 30 days. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteData('month')}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" data-testid="button-delete-year">
                This Year
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete This Year's Records?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete all records from the last 365 days. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteData('year')}>Delete</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" data-testid="button-delete-all" className="col-span-2">
                All Data
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete All Records?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete ALL records from the database. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDeleteData('all')}>Delete All</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  );
}
