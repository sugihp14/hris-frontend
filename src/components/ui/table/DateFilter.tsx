'use client'

import React, { useState, useEffect } from 'react'

interface DateFilterProps {
  onFilter: (startDate: string, endDate: string) => void
  isLoading?: boolean
}

const DateFilter: React.FC<DateFilterProps> = ({ onFilter, isLoading = false }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    const today = new Date()
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
    
    const end = today.toISOString().split('T')[0]
    const start = firstDayOfMonth.toISOString().split('T')[0]

    setStartDate(start)
    setEndDate(end)
  }, [])

  const handleFilter = () => {
    if (startDate && endDate) {
      onFilter(startDate, endDate)
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
      <input 
        type="date" 
        value={startDate} 
        onChange={e => setStartDate(e.target.value)} 
        className="w-full sm:w-auto form-input px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" 
      />
      <span className="text-gray-500 hidden sm:block">-</span>
      <input 
        type="date" 
        value={endDate} 
        onChange={e => setEndDate(e.target.value)} 
        className="w-full sm:w-auto form-input px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500" 
      />
      <button 
        onClick={handleFilter} 
        className="w-full sm:w-auto flex items-center justify-center bg-indigo-500 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-600 transition duration-300 disabled:opacity-50"
        disabled={isLoading || !startDate || !endDate}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Memuat...
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            Filter
          </>
        )}
      </button>
    </div>
  )
}

export default DateFilter