import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, FileText, IndianRupee, CheckCircle2, Circle } from 'lucide-react';

interface WorkerEntryCardProps {
  workerId: string;
  workerName: string;
  worked: boolean;
  sheetsTapped: number;
  onWorkedChange: (worked: boolean) => void;
  onSheetsTappedChange: (sheets: number) => void;
}

export default function WorkerEntryCard({
  workerId,
  workerName,
  worked,
  sheetsTapped,
  onWorkedChange,
  onSheetsTappedChange,
}: WorkerEntryCardProps) {
  const salary = worked ? 1100 : 0;

  return (
    <Card className={`p-5 hover-elevate transition-all duration-300 border-border/50 hover:shadow-lg ${
      worked ? 'bg-gradient-to-br from-green-50/50 to-transparent dark:from-green-950/20' : ''
    }`}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
              worked ? 'bg-green-100 dark:bg-green-900/30' : 'bg-primary/10'
            }`}>
              <User className={`w-5 h-5 transition-colors ${
                worked ? 'text-green-600 dark:text-green-400' : 'text-primary'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold" data-testid={`text-worker-name-${workerId}`}>
                {workerName}
              </h3>
              <p className="text-xs text-muted-foreground">
                {worked ? 'Active today' : 'Not working'}
              </p>
            </div>
          </div>
          {worked && (
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400">
              <CheckCircle2 className="w-5 h-5 animate-pulse" />
            </div>
          )}
        </div>

        <div className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
          worked ? 'bg-green-50/50 dark:bg-green-950/20 border border-green-200/50 dark:border-green-800/30' : 'bg-muted/50 border border-transparent'
        }`}>
          <Checkbox
            id={`worked-${workerId}`}
            checked={worked}
            onCheckedChange={(checked) => onWorkedChange(checked === true)}
            data-testid={`checkbox-worked-${workerId}`}
            className="w-5 h-5"
          />
          <Label
            htmlFor={`worked-${workerId}`}
            className="text-base font-medium cursor-pointer"
          >
            Worked today
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`sheets-${workerId}`} className="flex items-center gap-2 text-sm font-medium">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Sheets tapped
          </Label>
          <Input
            id={`sheets-${workerId}`}
            type="number"
            min="0"
            step="1"
            value={sheetsTapped}
            onChange={(e) => onSheetsTappedChange(Math.max(0, parseInt(e.target.value) || 0))}
            onFocus={(e) => e.target.select()}
            data-testid={`input-sheets-${workerId}`}
            className="text-lg"
          />
        </div>

        <div className="pt-3 border-t">
          <div className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
            worked ? 'bg-primary/10 border border-primary/20' : 'bg-muted/30'
          }`}>
            <span className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <IndianRupee className="w-4 h-4" />
              Daily salary
            </span>
            <span className={`text-xl font-mono font-bold transition-colors ${
              worked ? 'text-primary' : 'text-muted-foreground'
            }`} data-testid={`text-salary-${workerId}`}>
              ₹{salary.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
