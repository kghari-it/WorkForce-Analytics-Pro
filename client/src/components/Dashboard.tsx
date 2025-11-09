import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { storage, WorkerRecord, WorkerSettings } from '@/lib/storage';
import { exportToCSV, parseCSV } from '@/lib/csv-utils';
import { useToast } from '@/hooks/use-toast';
import { Download, Upload, TrendingUp, IndianRupee, Calendar, FileText, Users } from 'lucide-react';

export default function Dashboard() {
  const [records, setRecords] = useState<WorkerRecord[]>([]);
  const [workers, setWorkers] = useState<WorkerSettings[]>([]);
  const [selectedWorker, setSelectedWorker] = useState<string>('all');
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  useEffect(() => {
    loadWorkers();
  }, []);

  useEffect(() => {
    loadRecords();
  }, [startDate, endDate]);

  const loadWorkers = async () => {
    const workerSettings = await storage.getWorkerSettings();
    setWorkers(workerSettings);
  };

  const loadRecords = async () => {
    const data = await storage.getRecordsByDateRange(startDate, endDate);
    setRecords(data.sort((a, b) => b.date.localeCompare(a.date)));
  };

  const filteredRecords = selectedWorker === 'all' 
    ? records 
    : records.filter(r => r.workerId === selectedWorker);

  const workerTotals = filteredRecords.reduce((acc, record) => {
    if (!acc[record.workerId]) {
      acc[record.workerId] = {
        name: record.workerName,
        daysWorked: 0,
        totalSalary: 0,
        totalSheets: 0,
      };
    }
    if (record.worked) acc[record.workerId].daysWorked++;
    acc[record.workerId].totalSalary += record.salary;
    acc[record.workerId].totalSheets += record.sheetsTapped;
    return acc;
  }, {} as Record<string, { name: string; daysWorked: number; totalSalary: number; totalSheets: number }>);

  const grandTotals = Object.values(workerTotals).reduce(
    (acc, worker) => ({
      daysWorked: acc.daysWorked + worker.daysWorked,
      totalSalary: acc.totalSalary + worker.totalSalary,
      totalSheets: acc.totalSheets + worker.totalSheets,
    }),
    { daysWorked: 0, totalSalary: 0, totalSheets: 0 }
  );

  const handleExport = () => {
    exportToCSV(filteredRecords);
    toast({
      title: 'Exported',
      description: 'CSV file downloaded successfully',
    });
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    try {
      const importedRecords = parseCSV(text);
      for (const record of importedRecords) {
        await storage.saveRecord(record);
      }
      await loadRecords();
      toast({
        title: 'Imported',
        description: `${importedRecords.length} records imported successfully`,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to import CSV file',
        variant: 'destructive',
      });
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 space-y-2">
          <Label htmlFor="start-date">Start Date</Label>
          <Input
            id="start-date"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            data-testid="input-start-date"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="end-date">End Date</Label>
          <Input
            id="end-date"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            data-testid="input-end-date"
          />
        </div>
        <div className="flex-1 space-y-2">
          <Label htmlFor="worker-filter" className="flex items-center gap-2 text-sm font-medium">
            <Users className="w-4 h-4 text-muted-foreground" />
            Worker Filter
          </Label>
          <Select value={selectedWorker} onValueChange={setSelectedWorker}>
            <SelectTrigger id="worker-filter" data-testid="select-worker-filter">
              <SelectValue placeholder="All Workers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Workers</SelectItem>
              {workers.map((worker) => (
                <SelectItem key={worker.id} value={worker.id}>
                  {worker.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-5 border-border/50 hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Total Days Worked
              </p>
              <p className="text-3xl font-bold font-mono" data-testid="text-grand-days">
                {grandTotals.daysWorked}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-chart-2" />
            </div>
          </div>
        </Card>
        <Card className="p-5 border-primary/20 bg-gradient-to-br from-primary/5 to-transparent hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <IndianRupee className="w-4 h-4" />
                Total Salary
              </p>
              <p className="text-3xl font-bold font-mono text-primary" data-testid="text-grand-salary">
                ₹{grandTotals.totalSalary.toLocaleString('en-IN')}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-5 border-border/50 hover-elevate transition-all">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Total Sheets
              </p>
              <p className="text-3xl font-bold font-mono" data-testid="text-grand-sheets">
                {grandTotals.totalSheets}
              </p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-chart-3" />
            </div>
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden border-border/50">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-muted/50">
              <tr className="border-b">
                <th className="text-left p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Worker</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Days Worked</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Salary</th>
                <th className="text-right p-4 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Sheets</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(workerTotals).map(([workerId, totals]) => (
                <tr key={workerId} className="border-b hover-elevate transition-all" data-testid={`row-worker-${workerId}`}>
                  <td className="p-4 font-semibold">{totals.name}</td>
                  <td className="p-4 text-right font-mono text-base">{totals.daysWorked}</td>
                  <td className="p-4 text-right font-mono text-base font-semibold text-primary">₹{totals.totalSalary.toLocaleString('en-IN')}</td>
                  <td className="p-4 text-right font-mono text-base">{totals.totalSheets}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={handleExport} variant="outline" size="lg" className="shadow-sm" data-testid="button-export">
          <Download className="w-5 h-5 mr-2" />
          Export CSV
        </Button>
        <Button variant="outline" size="lg" className="shadow-sm" asChild data-testid="button-import">
          <label className="cursor-pointer">
            <Upload className="w-5 h-5 mr-2" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImport}
              className="hidden"
            />
          </label>
        </Button>
      </div>
    </div>
  );
}
