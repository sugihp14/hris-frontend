'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type TodayAttendance = { 
  clockIn: string | null; 
  clockOut: string | null 
}

export type AttendanceStatus = 'clocked-in' | 'clocked-out' | 'loading' | 'error'

export type HistoryRecord = { 
  id: number; 
  date: string; 
  clockIn: string; 
  clockOut: string; 
  status: 'Tepat Waktu' | 'Terlambat' | 'Alpa' 
}

export type MonthlyStats = { 
  present: number; 
  late: number; 
  absent: number 
}

export type User = { 
  id: string; 
  email: string; 
  name: string;
  role: string; 
}

type AttendanceState = {
  user: User | null
  status: AttendanceStatus
  todayRecord: TodayAttendance
  history: HistoryRecord[]
  stats: MonthlyStats
  errorMessage: string
  lastRefresh: number
  
  setUser: (user: User | null) => void
  setStatus: (status: AttendanceStatus) => void
  setTodayRecord: (record: TodayAttendance) => void
  setHistory: (history: HistoryRecord[]) => void
  setStats: (stats: MonthlyStats) => void
  setErrorMessage: (message: string) => void
  setLastRefresh: () => void
  reset: () => void
}

const initialState = {
  user: null,
  status: 'loading' as AttendanceStatus,
  todayRecord: { clockIn: null, clockOut: null },
  history: [] as HistoryRecord[],
  stats: { present: 0, late: 0, absent: 0 },
  errorMessage: '',
  lastRefresh: Date.now()
}

export const useAttendanceStore = create<AttendanceState>()(
  persist(
    (set) => ({
      ...initialState,
      
      setUser: (user) => {
        set({ user });
      },
      setStatus: (status) => {
        set({ status });
      },
      setTodayRecord: (record) => {
        set({ todayRecord: record });
      },
      setHistory: (history) => {
        set({ history });
      },
      setStats: (stats) => {
        set({ stats });
      },
      setErrorMessage: (errorMessage) => {
        set({ errorMessage });
      },
      setLastRefresh: () => {
        set({ lastRefresh: Date.now() });
      },
      reset: () => set(initialState)
    }),
    {
      name: 'attendance-storage',
      partialize: (state) => ({
        todayRecord: state.todayRecord,
        history: state.history,
        stats: state.stats
      })
    }
  )
)