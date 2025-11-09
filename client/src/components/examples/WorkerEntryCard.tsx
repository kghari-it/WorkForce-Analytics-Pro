import { useState } from 'react';
import WorkerEntryCard from '../WorkerEntryCard';

export default function WorkerEntryCardExample() {
  const [worked, setWorked] = useState(true);
  const [sheets, setSheets] = useState(35);

  return (
    <div className="max-w-md p-4">
      <WorkerEntryCard
        workerId="worker-a"
        workerName="Worker A"
        worked={worked}
        sheetsTapped={sheets}
        onWorkedChange={setWorked}
        onSheetsTappedChange={setSheets}
      />
    </div>
  );
}
