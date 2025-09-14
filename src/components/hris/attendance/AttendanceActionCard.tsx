'use client'

import React, { useEffect } from 'react'
import { LogInIcon, LogOutIcon } from './Icons'
import { useAttendanceStore } from '@/libs/stores/attendance'
import { useAuthStore } from '@/libs/stores/auth'

interface AttendanceActionCardProps {
  currentTime: Date
  showClockOutButton: boolean
  isButtonDisabled: boolean
  onClockAction: () => void
}

export function AttendanceActionCard({
  currentTime,
  showClockOutButton,
  isButtonDisabled,
  onClockAction
}: AttendanceActionCardProps) {
  const authUser = useAuthStore((s) => s.user)
  const attendanceUser = useAttendanceStore((s) => s.user)
  const setUser = useAttendanceStore((s) => s.setUser)
  
  const todayRecord = useAttendanceStore((s) => s.todayRecord)
  const status = useAttendanceStore((s) => s.status)
  const errorMessage = useAttendanceStore((s) => s.errorMessage)
  
  useEffect(() => {
    if (authUser && (!attendanceUser || attendanceUser.id !== authUser.id)) {
      setUser({
        id: authUser.id,
        email: authUser.email,
        name: authUser.name || authUser.email.split('@')[0],
        role: authUser.role
      })
    }
    else if (authUser && attendanceUser && authUser.id === attendanceUser.id && 
             authUser.name !== attendanceUser.name) {
      setUser({
        ...attendanceUser,
        name: authUser.name || authUser.email.split('@')[0]
      })
    }
  }, [authUser, attendanceUser, setUser])

  return (
    <div className="w-full bg-white rounded-2xl shadow-lg p-5 sm:p-8 text-center">
      <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
        Halo, {attendanceUser?.name || authUser?.name || authUser?.email?.split('@')[0] || 'Karyawan'}!
      </h1>
      <p className="text-sm sm:text-base text-gray-500 mb-6">
        {currentTime.toLocaleDateString('id-ID', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        })}
      </p>
      <div className="my-8">
        <p className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-wider">
          {currentTime.toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
          })}
        </p>
        <p className="text-sm text-gray-400 mt-2">Jadwal Kerja: 08:00 - 17:00</p>
      </div>

      <div className="max-w-xs mx-auto mb-8">
        {showClockOutButton ? (
          <button 
            onClick={onClockAction} 
            disabled={isButtonDisabled} 
            className="w-full flex items-center justify-center bg-red-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-red-600 disabled:bg-red-300 transition-transform transform hover:scale-105"
          >
            <LogOutIcon /> {status === 'loading' ? 'Memproses...' : 'Clock Out'}
          </button>
        ) : (
          <button 
            onClick={onClockAction} 
            disabled={isButtonDisabled} 
            className="w-full flex items-center justify-center bg-green-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-green-600 disabled:bg-gray-300 transition-transform transform hover:scale-105"
          >
            <LogInIcon /> {status === 'loading' ? 'Memproses...' : 'Clock In'}
          </button>
        )}
        {isButtonDisabled && status !== 'loading' && (
          <p className="text-xs text-gray-500 mt-2">Anda sudah menyelesaikan absensi hari ini.</p>
        )}
      </div>
      
      <div className="bg-gray-50 rounded-lg p-4 flex justify-around">
        <div>
          <p className="text-xs text-gray-500">Clock In</p>
          <p className="font-bold text-lg text-green-600">{todayRecord.clockIn || '--:--'}</p>
        </div>
        <div className="border-l border-gray-200"></div>
        <div>
          <p className="text-xs text-gray-500">Clock Out</p>
          <p className="font-bold text-lg text-red-600">{todayRecord.clockOut || '--:--'}</p>
        </div>
      </div>
      
      {errorMessage && <p className="text-red-500 text-sm mt-4">{errorMessage}</p>}
    </div>
  )
}