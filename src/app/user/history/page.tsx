'use client'
import React, { useState, useEffect } from 'react';
import AttendanceHistoryTable from '@/components/ui/table/AttendanceHistoryTable';
import DateFilter from '@/components/ui/table/DateFilter';
import { useAttendanceStore } from '@/libs/stores/attendance';
import { getAttendanceHistory } from '@/libs/attendance-api';

const CalendarIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>;

const HistoryPage: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    
    const history = useAttendanceStore((s) => s.history);
    const setHistory = useAttendanceStore((s) => s.setHistory);

    const handleFilter = async (startDate: string, endDate: string) => {
        try {
            setIsLoading(true);
            const data = await getAttendanceHistory(startDate, endDate);
            setHistory(data);
        } catch (error) {
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 font-sans">
            <div className=" mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <CalendarIcon />
                            Riwayat Absensi
                        </h1>
                        <DateFilter onFilter={handleFilter} isLoading={isLoading} />
                    </div>
                    
                    <AttendanceHistoryTable history={history} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
