import { WorkerRecord } from './storage';

export function exportToCSV(records: WorkerRecord[]): void {
  const headers = ['Date', 'Worker ID', 'Worker Name', 'Worked', 'Sheets Tapped', 'Salary'];
  const rows = records.map(r => [
    r.date,
    r.workerId,
    r.workerName,
    r.worked ? 'Yes' : 'No',
    r.sheetsTapped.toString(),
    r.salary.toString(),
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(field => `"${field}"`).join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `rubber-farm-data-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function parseCSV(csvText: string): WorkerRecord[] {
  const lines = csvText.split('\n').filter(line => line.trim());
  if (lines.length < 2) throw new Error('CSV file is empty or invalid');

  const records: WorkerRecord[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const match = lines[i].match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g);
    if (!match || match.length < 6) continue;

    const values = match.map(v => v.replace(/^"|"$/g, '').trim());
    const worked = values[3].toLowerCase() === 'yes';
    
    records.push({
      id: `${values[0]}-${values[1]}`,
      date: values[0],
      workerId: values[1],
      workerName: values[2],
      worked,
      sheetsTapped: parseInt(values[4]) || 0,
      salary: parseInt(values[5]) || 0,
    });
  }

  return records;
}
