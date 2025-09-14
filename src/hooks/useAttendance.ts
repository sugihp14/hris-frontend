'use client'

import { useState, useEffect } from 'react'
import { 
  getTodayAttendance, 
  getAttendanceHistory, 
  getMonthlyStats,
  clockIn as apiClockIn,
  clockOut as apiClockOut
} from '@/libs/attendance-api'
import { useAttendanceStore, HistoryRecord, TodayAttendance, MonthlyStats } from '@/libs/stores/attendance'
import { useAuthStore } from '@/libs/stores/auth'

export function useAttendance() {
  const { 
    user,
    status, 
    todayRecord, 
    history, 
    stats,
    errorMessage,
    lastRefresh,
    setUser,
    setStatus,
    setTodayRecord,
    setHistory,
    setStats,
    setErrorMessage,
    setLastRefresh
  } = useAttendanceStore()
  
  const authUser = useAuthStore((s) => s.user)
  
  const [currentTime, setCurrentTime] = useState(new Date())
  
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])
  
  useEffect(() => {
    if (authUser && (!user || user.id !== authUser.id)) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.email.split('@')[0],
        role: authUser.role
      })
    }
  }, [authUser, user, setUser])
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setStatus('loading')
        setErrorMessage('')
        
        const todayData: TodayAttendance = await getTodayAttendance()
        let historyData: HistoryRecord[] = [];
        try {
          const loadedHistoryData: HistoryRecord[] = await getAttendanceHistory();
          historyData = loadedHistoryData;
        } catch (historyError) {
        }
        const statsData: MonthlyStats = await getMonthlyStats()
        
        setTodayRecord(todayData)
        setHistory(historyData)
        setStats(statsData)
        
        if (todayData.clockIn && !todayData.clockOut) {
          setStatus('clocked-in')
        } else if (todayData.clockIn && todayData.clockOut) {
          setStatus('clocked-out')
        } else {
          setStatus('clocked-out')
        }
      } catch (error) {
        setErrorMessage('Gagal memuat data absensi')
        setStatus('error')
      }
    }
    
    if (user) {
      loadData()
    }
  }, [user, lastRefresh, setStatus, setTodayRecord, setHistory, setStats, setErrorMessage])
  
  const handleClockAction = async () => {
    try {
      setStatus('loading')
      setErrorMessage('')
      
      const isClockingIn = !todayRecord.clockIn
      
      if (isClockingIn) {
        const response = await apiClockIn()
        const updatedRecord = await getTodayAttendance()
        setTodayRecord(updatedRecord)
        setStatus('clocked-in')
      } else {
        const response = await apiClockOut()
        const updatedRecord = await getTodayAttendance()
        setTodayRecord(updatedRecord)
        setStatus('clocked-out')
      }
      
      try {
        const historyData = await getAttendanceHistory()
        const statsData = await getMonthlyStats()
        setHistory(historyData)
        setStats(statsData)
      } catch (refreshError) {
      }
      
      setLastRefresh()
    } catch (error) {
      setErrorMessage('Gagal melakukan absensi')
      setStatus('error')
      
      try {
        const updatedRecord = await getTodayAttendance()
        setTodayRecord(updatedRecord)
      } catch (refreshError) {
      }
    }
  }
  
  const hasClockedIn = !!todayRecord.clockIn
  const hasClockedOut = !!todayRecord.clockOut
  const showClockOutButton = hasClockedIn && !hasClockedOut
  const isButtonDisabled = status === 'loading' || (hasClockedIn && hasClockedOut)
  
  return {
    currentTime,
    status,
    todayRecord,
    history,
    stats,
    errorMessage,
    
    hasClockedIn,
    hasClockedOut,
    showClockOutButton,
    isButtonDisabled,
    
    handleClockAction
  }
}