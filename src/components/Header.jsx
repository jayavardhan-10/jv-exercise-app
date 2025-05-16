import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkoutHistory } from '../context/WorkoutHistoryContext';
import StreakModal from './StreakModal';

const Header = () => {
  const { user } = useAuth();
  const { streak, workoutHistory } = useWorkoutHistory();
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  
  const calculateStreak = () => {
    if (!workoutHistory?.length) return 0;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let streak = 0;
    let currentDate = today;
    
    while (true) {
      const hasWorkout = workoutHistory.some(workout => {
        const workoutDate = new Date(workout.date);
        workoutDate.setHours(0, 0, 0, 0);
        return workoutDate.getTime() === currentDate.getTime();
      });
      
      if (!hasWorkout) break;
      streak++;
      currentDate.setDate(currentDate.getDate() - 1);
    }
    
    return streak;
  };

  return (
    <>
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="text-2xl font-bold text-gray-900">JV Exercise App</div>
        <div className="flex items-center gap-6">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 hover:bg-orange-200 text-orange-600 font-semibold shadow transition-all"
            onClick={() => setIsStreakModalOpen(true)}
          >
            <span role="img" aria-label="streak">🔥</span>
            <span>{streak}-day streak</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700 border border-gray-300">
            {user?.displayName?.[0]?.toUpperCase() || 'U'}
          </div>
        </div>
      </header>

      <StreakModal
        isOpen={isStreakModalOpen}
        onClose={() => setIsStreakModalOpen(false)}
        workoutHistory={workoutHistory}
      />
    </>
  );
};

export default Header; 