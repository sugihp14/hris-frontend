'use client'

import React from 'react';
import { useAttendance } from '@/hooks';
import { 
  AttendanceActionCard, 
  MonthlyStatsCard, 
} from '@/components/hris/attendance';

export default function AttendancePage() {
  const {
    currentTime,
    showClockOutButton,
    isButtonDisabled,
    handleClockAction
  } = useAttendance();

  return (
    <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8 font-sans">
      <div className="mx-auto space-y-6 sm:space-y-8">
        <AttendanceActionCard
          currentTime={currentTime}
          showClockOutButton={showClockOutButton}
          isButtonDisabled={isButtonDisabled}
          onClockAction={handleClockAction}
        />
        
           <MonthlyStatsCard />
          
         
      </div>
    </div>
  );
}