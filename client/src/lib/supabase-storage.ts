import { supabase } from '@/lib/supabase';
import { WorkerRecord, WorkerSettings } from '@/lib/storage';

class SupabaseStorageManager {
  async getWorkerSettings(userId: string): Promise<WorkerSettings[]> {
    try {
      const { data, error } = await supabase
        .from('worker_settings')
        .select('*')
        .eq('user_id', userId);

      if (error) {
        throw error;
      }

      return data?.map((item: any) => ({
        id: item.worker_id,
        name: item.name,
      })) || [];
    } catch (error) {
      console.error('Error fetching worker settings:', error);
      return [];
    }
  }

  async saveWorkerSettings(userId: string, settings: WorkerSettings[]): Promise<void> {
    try {
      const { error: deleteError } = await supabase
        .from('worker_settings')
        .delete()
        .eq('user_id', userId);

      if (deleteError) {
        throw deleteError;
      }

      const settingsToInsert = settings.map(s => ({
        user_id: userId,
        worker_id: s.id,
        name: s.name,
      }));

      const { error: insertError } = await supabase
        .from('worker_settings')
        .insert(settingsToInsert);

      if (insertError) {
        throw insertError;
      }
    } catch (error) {
      console.error('Error saving worker settings:', error);
      throw error;
    }
  }

  async getRecords(userId: string): Promise<WorkerRecord[]> {
    try {
      const { data, error } = await supabase
        .from('worker_records')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map((item: any) => ({
        id: item.id,
        date: item.date,
        workerId: item.worker_id,
        workerName: item.worker_name,
        worked: item.worked,
        sheetsTapped: item.sheets_tapped,
        salary: item.salary,
      })) || [];
    } catch (error) {
      console.error('Error fetching records:', error);
      return [];
    }
  }

  async getRecordsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<WorkerRecord[]> {
    try {
      const { data, error } = await supabase
        .from('worker_records')
        .select('*')
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: false });

      if (error) {
        throw error;
      }

      return data?.map((item: any) => ({
        id: item.id,
        date: item.date,
        workerId: item.worker_id,
        workerName: item.worker_name,
        worked: item.worked,
        sheetsTapped: item.sheets_tapped,
        salary: item.salary,
      })) || [];
    } catch (error) {
      console.error('Error fetching records by date range:', error);
      return [];
    }
  }

  async saveRecord(userId: string, record: WorkerRecord): Promise<void> {
    try {
      const existingRecord = await supabase
        .from('worker_records')
        .select('id')
        .eq('user_id', userId)
        .eq('date', record.date)
        .eq('worker_id', record.workerId)
        .maybeSingle();

      const recordData = {
        user_id: userId,
        date: record.date,
        worker_id: record.workerId,
        worker_name: record.workerName,
        worked: record.worked,
        sheets_tapped: record.sheetsTapped,
        salary: record.salary,
      };

      if (existingRecord.data?.id) {
        const { error } = await supabase
          .from('worker_records')
          .update(recordData)
          .eq('id', existingRecord.data.id);

        if (error) {
          throw error;
        }
      } else {
        const { error } = await supabase
          .from('worker_records')
          .insert([recordData]);

        if (error) {
          throw error;
        }
      }
    } catch (error) {
      console.error('Error saving record:', error);
      throw error;
    }
  }

  async deleteRecordsByDateRange(
    userId: string,
    startDate: string,
    endDate: string
  ): Promise<void> {
    try {
      const { error } = await supabase
        .from('worker_records')
        .delete()
        .eq('user_id', userId)
        .gte('date', startDate)
        .lte('date', endDate);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting records:', error);
      throw error;
    }
  }

  async deleteAllRecords(userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('worker_records')
        .delete()
        .eq('user_id', userId);

      if (error) {
        throw error;
      }
    } catch (error) {
      console.error('Error deleting all records:', error);
      throw error;
    }
  }
}

export const supabaseStorage = new SupabaseStorageManager();
