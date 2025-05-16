import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StreakModal = ({ isOpen, onClose, workoutHistory }) => {
  const [activeTab, setActiveTab] = useState('streak'); // 'streak' or 'calendar'
  
  // Calculate streak and recent workouts
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

  // Get recent workouts (last 5)
  const recentWorkouts = workoutHistory
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5) || [];

  // Helper: is this a streak day?
  const isStreakDay = (date) => {
    return workoutHistory?.some(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.toDateString() === date.toDateString();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg sm:max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Your Progress</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 mb-6">
          <button
            className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base ${
              activeTab === 'streak' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveTab('streak')}
          >
            Streak
          </button>
          <button
            className={`flex-1 px-2 sm:px-4 py-2 rounded-lg font-semibold text-sm sm:text-base ${
              activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
        </div>

        {/* Streak Tab */}
        {activeTab === 'streak' && (
          <div className="space-y-6">
            {/* Current Streak */}
            <div className="bg-gradient-to-r from-orange-200 to-orange-50 rounded-xl p-6 flex flex-col items-center">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">🔥</span>
                <h3 className="text-xl font-bold text-orange-800">
                  {calculateStreak()}-Day Streak
                </h3>
              </div>
              <p className="text-orange-600 text-center">Keep up the great work!</p>
            </div>

            {/* Recent Workouts */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Recent Workouts</h3>
              <div className="space-y-3">
                {recentWorkouts.map((workout, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                      <h4 className="font-semibold text-base sm:text-lg">{workout.name}</h4>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {new Date(workout.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right mt-2 sm:mt-0">
                      <p className="font-medium text-sm sm:text-base">{workout.exercises?.length || 0} exercises</p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {workout.duration ? `${workout.duration} min` : 'Custom'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 p-2 sm:p-4">
              <Calendar
                className="w-full border-none calendar-custom"
                tileContent={({ date, view }) => {
                  if (view === 'month' && isStreakDay(date)) {
                    return (
                      <div className="flex items-center justify-center h-full">
                        <span className="inline-block w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-md border-2 border-white animate-pulse"></span>
                      </div>
                    );
                  }
                  return null;
                }}
                tileClassName={({ date, view }) => {
                  if (view === 'month' && isStreakDay(date)) {
                    return 'relative calendar-streak-day';
                  }
                  return '';
                }}
              />
            </div>
          </div>
        )}
      </div>
      <style>{`
        /* Responsive calendar tweaks */
        .calendar-custom .react-calendar__tile {
          min-height: 2.5rem;
          font-size: 1rem;
          border-radius: 0.75rem;
          transition: background 0.2s;
        }
        .calendar-custom .calendar-streak-day {
          background: none !important;
        }
        @media (max-width: 640px) {
          .calendar-custom .react-calendar__tile {
            min-height: 2.2rem;
            font-size: 0.9rem;
            border-radius: 0.6rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StreakModal; 