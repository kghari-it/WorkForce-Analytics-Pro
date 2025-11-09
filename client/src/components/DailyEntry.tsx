import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import WorkerEntryCard from './WorkerEntryCard';
import { storage, WorkerSettings, WorkerRecord } from '@/lib/storage';
import { Save } from 'lucide-react';

export default function DailyEntry() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [workers, setWorkers] = useState<WorkerSettings[]>([]);
  const [entries, setEntries] = useState<Map<string, { worked: boolean; sheets: number }>>(new Map());
  const { toast } = useToast();

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    loadEntriesForDate();
  }, [date, workers]);

  const loadWorkers = async () => {
    const workerSettings = await storage.getWorkerSettings();
    setWorkers(workerSettings);
  };

  const loadEntriesForDate = async () => {
    if (workers.length === 0) return;
    
    const records = await storage.getRecords();
    const dateRecords = records.filter(r => r.date === date);
    
    const newEntries = new Map<string, { worked: boolean; sheets: number }>();
    workers.forEach(worker => {
      const record = dateRecords.find(r => r.workerId === worker.id);
      newEntries.set(worker.id, {
        worked: record?.worked ?? false,
        sheets: record?.sheetsTapped ?? 0,
      });
    });
    setEntries(newEntries);
  };

  const handleSave = async () => {
    const warnings: string[] = [];
    const records: WorkerRecord[] = [];

    workers.forEach(worker => {
      const entry = entries.get(worker.id);
      if (!entry) return;

      if (!entry.worked && entry.sheets > 0) {
        warnings.push(`${worker.name} has ${entry.sheets} sheets but is marked as not worked`);
      }

      records.push({
        id: `${date}-${worker.id}`,
        date,
        workerId: worker.id,
        workerName: worker.name,
        worked: entry.worked,
        sheetsTapped: entry.sheets,
        salary: entry.worked ? 1100 : 0,
      });
    });

    if (warnings.length > 0) {
      toast({
        title: 'Warning',
        description: warnings.join('. '),
        variant: 'default',
      });
    }

    for (const record of records) {
      await storage.saveRecord(record);
    }

    toast({
      title: 'Saved',
      description: `Records saved for ${new Date(date).toLocaleDateString('en-IN')}`,
    });
  };

  const totalSalary = Array.from(entries.values()).reduce((sum, entry) => {
    return sum + (entry.worked ? 1100 : 0);
  }, 0);

  const handleWorkedChange = (workerId: string, worked: boolean) => {
    setEntries(prev => new Map(prev).set(workerId, { ...prev.get(workerId)!, worked }));
  };

  const handleSheetsChange = (workerId: string, sheets: number) => {
    setEntries(prev => new Map(prev).set(workerId, { ...prev.get(workerId)!, sheets }));
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="entry-date">Date</Label>
        <div className="flex gap-2">
          <Input
            id="entry-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="max-w-xs"
            data-testid="input-date"
          />
          <Button
            variant="outline"
            onClick={() => setDate(new Date().toISOString().split('T')[0])}
            data-testid="button-today"
          >
            Today
          </Button>
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total salary for the day:</span>
          <span className="text-2xl font-mono font-bold text-primary" data-testid="text-daily-total">
            ₹{totalSalary.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {workers.map(worker => {
          const entry = entries.get(worker.id);
          if (!entry) return null;
          
          return (
            <WorkerEntryCard
              key={worker.id}
              workerId={worker.id}
              workerName={worker.name}
              worked={entry.worked}
              sheetsTapped={entry.sheets}
              onWorkedChange={(worked) => handleWorkedChange(worker.id, worked)}
              onSheetsTappedChange={(sheets) => handleSheetsChange(worker.id, sheets)}
            />
          );
        })}
      </div>

      <Button
        onClick={handleSave}
        className="w-full sm:w-auto min-w-32"
        data-testid="button-save"
      >
        <Save className="w-4 h-4 mr-2" />
        Save
      </Button>
    </div>
  );
}
