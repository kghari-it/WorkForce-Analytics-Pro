import { Card } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium" data-testid={`text-worker-name-${workerId}`}>
            {workerName}
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id={`worked-${workerId}`}
            checked={worked}
            onCheckedChange={(checked) => onWorkedChange(checked === true)}
            data-testid={`checkbox-worked-${workerId}`}
          />
          <Label
            htmlFor={`worked-${workerId}`}
            className="text-base font-normal cursor-pointer"
          >
            Worked today
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor={`sheets-${workerId}`}>
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
          />
        </div>

        <div className="pt-2 border-t">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Daily salary:</span>
            <span className="text-lg font-mono font-semibold" data-testid={`text-salary-${workerId}`}>
              ₹{salary.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}
