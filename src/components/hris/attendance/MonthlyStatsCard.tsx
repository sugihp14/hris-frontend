'use client'

import React from 'react'
import { useAttendanceStore } from '@/libs/stores/attendance'

interface CalendarIconProps {
  className?: string;
}

const CalendarIcon = ({ className = "w-5 h-5 mr-2" }: CalendarIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
  </svg>
);

interface CheckCircleIconProps {
  className?: string;
}

const CheckCircleIcon = ({ className = "w-8 h-8 mx-auto text-green-500" }: CheckCircleIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

interface ClockWarningIconProps {
  className?: string;
}

const ClockWarningIcon = ({ className = "w-8 h-8 mx-auto text-yellow-500" }: ClockWarningIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
  </svg>
);

interface XCircleIconProps {
  className?: string;
}

const XCircleIcon = ({ className = "w-8 h-8 mx-auto text-red-500" }: XCircleIconProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
  </svg>
);

export function MonthlyStatsCard() {
  const stats = useAttendanceStore((s) => s.stats)

  return (
    <div className="lg:col-span-2 bg-white p-5 sm:p-6 rounded-2xl shadow-lg">
      <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <CalendarIcon />Statistik Bulan Ini
      </h2>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
        <div className="bg-green-50 p-4 rounded-lg">
          <CheckCircleIcon />
          <p className="text-2xl font-bold text-green-600 mt-2">{stats.present}</p>
          <p className="text-sm text-green-800">Tepat Waktu</p>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
          <ClockWarningIcon />
          <p className="text-2xl font-bold text-yellow-600 mt-2">{stats.late}</p>
          <p className="text-sm text-yellow-800">Terlambat</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <XCircleIcon />
          <p className="text-2xl font-bold text-red-600 mt-2">{stats.absent}</p>
          <p className="text-sm text-red-800">Alpa</p>
        </div>
      </div>
    </div>
  )
}