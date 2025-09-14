'use client'

import { apiFetch } from '@/libs/http'
import { useAuthStore } from '@/libs/stores/auth'
import { TodayAttendance, HistoryRecord, MonthlyStats } from '@/libs/stores/attendance'

export async function clockIn(): Promise<{ clockedIn: string }> {
  const userId = useAuthStore.getState().user?.id;
  return apiFetch('/attendance/clock-in', {
    method: 'POST',
    body: JSON.stringify({ userId })
  })
}

export async function clockOut(): Promise<{ clockedOut: string }> {
  const userId = useAuthStore.getState().user?.id;
  return apiFetch('/attendance/clock-out', {
    method: 'POST',
    body: JSON.stringify({ userId })
  })
}

export async function getTodayAttendance(): Promise<TodayAttendance> {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const format = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const startDate = format(today);
  const endDate = format(tomorrow);
  
  const userId = useAuthStore.getState().user?.id;
  if (!userId) {
    return { clockIn: null, clockOut: null };
  }
  
  const params = new URLSearchParams({
    userId,
    startDate,
    endDate
  });
  
  try {
    const response: any = await apiFetch(`/attendance/summary?${params.toString()}`);
    const todayStr = format(today);
    const todayRecords = response.filter((record: any) => 
      record.timestamp.startsWith(todayStr)
    );
    
    const clockInRecord = todayRecords.find((record: any) => record.status === 'CLOCK_IN');
    const clockOutRecord = todayRecords.find((record: any) => record.status === 'CLOCK_OUT');
    
    const formatTime = (timestamp: string) => {
      return new Date(timestamp).toLocaleTimeString('id-ID', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    };
    
    return {
      clockIn: clockInRecord ? formatTime(clockInRecord.timestamp) : null,
      clockOut: clockOutRecord ? formatTime(clockOutRecord.timestamp) : null
    };
  } catch (error) {
    return { clockIn: null, clockOut: null };
  }
}

export async function getAttendanceHistory(
  startDate?: string,
  endDate?: string
): Promise<HistoryRecord[]> {
  const userId = useAuthStore.getState().user?.id;
  
  if (!userId) {
    return [];
  }
  
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : (() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  })();
  
  const format = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  const params = new URLSearchParams({
    userId,
    startDate: format(start),
    endDate: format(end)
  });
  
  try {
    const response: any = await apiFetch(`/attendance/summary?${params.toString()}`);
    
    if (!Array.isArray(response)) {
      return [];
    }
    
    const recordsByDate: Record<string, any[]> = {};
    response.forEach((record: any) => {
      if (!record.timestamp || !record.status) {
        return;
      }
      
      const date = record.timestamp.split('T')[0];
      if (!recordsByDate[date]) {
        recordsByDate[date] = [];
      }
      recordsByDate[date].push(record);
    });
    
    const historyRecords: HistoryRecord[] = [];
    Object.keys(recordsByDate).forEach(date => {
      const records = recordsByDate[date];
      const clockInRecord = records.find((r: any) => r.status === 'CLOCK_IN');
      const clockOutRecord = records.find((r: any) => r.status === 'CLOCK_OUT');
      
      const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      };
      
      let status: 'Tepat Waktu' | 'Terlambat' | 'Alpa' = 'Alpa';
      if (clockInRecord) {
        const clockInTime = new Date(clockInRecord.timestamp);
        const workStartTime = new Date(clockInTime);
        workStartTime.setHours(8, 0, 0, 0);
        
        status = clockInTime <= workStartTime ? 'Tepat Waktu' : 'Terlambat';
      }
      
      historyRecords.push({
        id: historyRecords.length + 1,
        date,
        clockIn: clockInRecord ? formatTime(clockInRecord.timestamp) : '-',
        clockOut: clockOutRecord ? formatTime(clockOutRecord.timestamp) : '-',
        status
      });
    });
    
    const sortedRecords = historyRecords.sort((a, b) => b.date.localeCompare(a.date));
    
    return sortedRecords;
  } catch (error) {
    return [];
  }
}

export async function getMonthlyStats(
  startDate?: string, 
  endDate?: string
): Promise<MonthlyStats> {
  const userId = useAuthStore.getState().user?.id;
  
  if (!userId) {
    return { present: 0, late: 0, absent: 0 };
  }
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  
  const defaultStartDate = `${year}-${month}-01`;
  const defaultEndDate = `${year}-${month}-${new Date(year, now.getMonth() + 1, 0).getDate()}`;
  
  const params = new URLSearchParams({
    userId,
    startDate: startDate || defaultStartDate,
    endDate: endDate || defaultEndDate
  });
  
  try {
    const response: any = await apiFetch(`/attendance/summary?${params.toString()}`);
    
    const recordsByDate: Record<string, any[]> = {};
    response.forEach((record: any) => {
      const date = record.timestamp.split('T')[0];
      if (!recordsByDate[date]) {
        recordsByDate[date] = [];
      }
      recordsByDate[date].push(record);
    });
    
    let present = 0;
    let late = 0;
    let absent = 0;
    
    Object.keys(recordsByDate).forEach(date => {
      const records = recordsByDate[date];
      const clockInRecord = records.find((r: any) => r.status === 'CLOCK_IN');
      
      if (clockInRecord) {
        const clockInTime = new Date(clockInRecord.timestamp);
        const workStartTime = new Date(clockInTime);
        workStartTime.setHours(8, 0, 0, 0);
        
        if (clockInTime <= workStartTime) {
          present++;
        } else {
          late++;
        }
      } else {
        absent++;
      }
    });
    
    return { present, late, absent };
  } catch (error) {
    return { present: 0, late: 0, absent: 0 };
  }
}