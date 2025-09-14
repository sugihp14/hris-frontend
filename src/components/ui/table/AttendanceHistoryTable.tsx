'use client'

import React from 'react'
import { HistoryRecord } from '@/libs/stores/attendance'

interface AttendanceHistoryTableProps {
  history: HistoryRecord[]
  isLoading?: boolean
}

const getStatusStyle = (status: HistoryRecord['status']) => {
  switch (status) {
    case 'Tepat Waktu':
      return 'bg-green-100 text-green-800'
    case 'Terlambat':
      return 'bg-yellow-100 text-yellow-800'
    case 'Alpa':
      return 'bg-red-100 text-red-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}


const AttendanceHistoryTable: React.FC<AttendanceHistoryTableProps> = ({ 
  history, 
  isLoading = false 
}) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Tanggal</th>
              <th className="text-center font-medium text-gray-500 px-4 py-3">Masuk</th>
              <th className="text-center font-medium text-gray-500 px-4 py-3">Pulang</th>
              <th className="text-center font-medium text-gray-500 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mt-1"></div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-semibold text-gray-500">Tidak ada data absensi</p>
        <p className="text-sm text-gray-400 mt-1">Silakan ubah rentang tanggal dan klik filter.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Tanggal</th>
            <th className="text-center font-medium text-gray-500 px-4 py-3">Masuk</th>
            <th className="text-center font-medium text-gray-500 px-4 py-3">Pulang</th>
            <th className="text-center font-medium text-gray-500 px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {history.map((record) => (
            <tr key={record.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 whitespace-nowrap text-gray-700 font-medium">
                {new Date(record.date).toLocaleDateString('id-ID', { 
                  day: 'numeric', 
                  month: 'long', 
                  year: 'numeric' 
                })}
                <span className="block text-xs text-gray-500 font-normal">
                  {new Date(record.date).toLocaleDateString('id-ID', { weekday: 'long' })}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-700">{record.clockIn}</td>
              <td className="px-4 py-3 text-center text-gray-700">{record.clockOut}</td>
              <td className="px-4 py-3 text-center">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusStyle(record.status)}`}>
                  {record.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AttendanceHistoryTable