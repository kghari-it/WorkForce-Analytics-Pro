import { openDB, DBSchema, IDBPDatabase } from 'idb';

export interface WorkerRecord {
  id: string;
  date: string;
  workerId: string;
  workerName: string;
  worked: boolean;
  sheetsTapped: number;
  salary: number;
}

export interface WorkerSettings {
  id: string;
  name: string;
}

interface FarmDB extends DBSchema {
  records: {
    key: string;
    value: WorkerRecord;
    indexes: { 'by-date': string; 'by-worker': string };
  };
  settings: {
    key: string;
    value: WorkerSettings;
  };
}

const DB_NAME = 'rubber-farm-tracker';
const DB_VERSION = 1;

class StorageManager {
  private db: IDBPDatabase<FarmDB> | null = null;
  private useLocalStorage = false;

  async init() {
    try {
      this.db = await openDB<FarmDB>(DB_NAME, DB_VERSION, {
        upgrade(db: IDBPDatabase<FarmDB>) {
          if (!db.objectStoreNames.contains('records')) {
            const recordStore = db.createObjectStore('records', { keyPath: 'id' });
            recordStore.createIndex('by-date', 'date');
            recordStore.createIndex('by-worker', 'workerId');
          }
          if (!db.objectStoreNames.contains('settings')) {
            db.createObjectStore('settings', { keyPath: 'id' });
          }
        },
      });
      this.useLocalStorage = false;
    } catch (error) {
      console.warn('IndexedDB unavailable, falling back to localStorage', error);
      this.useLocalStorage = true;
    }
  }

  async saveRecord(record: WorkerRecord): Promise<void> {
    if (this.useLocalStorage) {
      const records = this.getLocalStorageRecords();
      const index = records.findIndex(r => r.date === record.date && r.workerId === record.workerId);
      if (index >= 0) {
        records[index] = record;
      } else {
        records.push(record);
      }
      localStorage.setItem('farm-records', JSON.stringify(records));
    } else {
      await this.db!.put('records', record);
    }
  }

  async getRecords(): Promise<WorkerRecord[]> {
    if (this.useLocalStorage) {
      return this.getLocalStorageRecords();
    } else {
      return await this.db!.getAll('records');
    }
  }

  async getRecordsByDateRange(startDate: string, endDate: string): Promise<WorkerRecord[]> {
    const allRecords = await this.getRecords();
    return allRecords.filter(r => r.date >= startDate && r.date <= endDate);
  }

  async saveWorkerSettings(settings: WorkerSettings[]): Promise<void> {
    if (this.useLocalStorage) {
      localStorage.setItem('farm-settings', JSON.stringify(settings));
    } else {
      const tx = this.db!.transaction('settings', 'readwrite');
      await Promise.all(settings.map(s => tx.store.put(s)));
      await tx.done;
    }
  }

  async getWorkerSettings(): Promise<WorkerSettings[]> {
    if (this.useLocalStorage) {
      const stored = localStorage.getItem('farm-settings');
      return stored ? JSON.parse(stored) : this.getDefaultWorkers();
    } else {
      const settings = await this.db!.getAll('settings');
      return settings.length > 0 ? settings : this.getDefaultWorkers();
    }
  }

  private getLocalStorageRecords(): WorkerRecord[] {
    const stored = localStorage.getItem('farm-records');
    return stored ? JSON.parse(stored) : [];
  }

  private getDefaultWorkers(): WorkerSettings[] {
    return [
      { id: 'worker-a', name: 'Worker A' },
      { id: 'worker-b', name: 'Worker B' },
      { id: 'worker-c', name: 'Worker C' },
    ];
  }

  async seedSampleData(): Promise<void> {
    const records = await this.getRecords();
    if (records.length > 0) return;

    const workers = await this.getWorkerSettings();
    const sampleRecords: WorkerRecord[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      workers.forEach((worker, idx) => {
        const worked = Math.random() > 0.2;
        const sheets = worked ? Math.floor(Math.random() * 50) + 10 : 0;
        sampleRecords.push({
          id: `${dateStr}-${worker.id}`,
          date: dateStr,
          workerId: worker.id,
          workerName: worker.name,
          worked,
          sheetsTapped: sheets,
          salary: worked ? 1100 : 0,
        });
      });
    }

    for (const record of sampleRecords) {
      await this.saveRecord(record);
    }
  }
}

export const storage = new StorageManager();
