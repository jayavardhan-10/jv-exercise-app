import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const StreakModal = ({ isOpen, onClose, workoutHistory = [] }) => {
  const [activeTab, setActiveTab] = useState('streak');
  
  console.log('[DEBUG] Workout history in StreakModal:', workoutHistory);

  // Calculate streak
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

  // Get recent workouts
  const recentWorkouts = workoutHistory
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5) || [];

  // Check if a date has a workout
  const hasWorkoutOnDate = (date) => {
    return workoutHistory.some(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.toDateString() === date.toDateString();
    });
  };

  // Get workout intensity (1-3) based on duration and exercises
  const getWorkoutIntensity = (date) => {
    const workout = workoutHistory.find(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.toDateString() === date.toDateString();
    });
    
    if (!workout) return 0;
    
    const duration = workout.duration || 0;
    const exercises = workout.totalExercises || workout.exercises?.length || 0;
    
    // Calculate intensity: 1 (light), 2 (medium), 3 (intense)
    return Math.min(3, Math.ceil((duration / 20) + (exercises / 4)));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(2px)' }}>
      <div className="bg-white rounded-2xl p-4 sm:p-6 w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
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
        <div className="flex gap-2 mb-6">
          <button
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
              activeTab === 'streak' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
            }`}
            onClick={() => setActiveTab('streak')}
          >
            Streak
          </button>
          <button
            className={`flex-1 px-4 py-2 rounded-lg font-semibold ${
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
                {recentWorkouts.length > 0 ? (
                  recentWorkouts.map((workout, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                      <div>
                        <h4 className="font-semibold text-base sm:text-lg">{workout.workoutName || workout.name || "Workout"}</h4>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {new Date(workout.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-medium text-sm sm:text-base">{workout.totalExercises || workout.exercises?.length || 0} exercises</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {workout.duration ? `${workout.duration} min` : 'Custom'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-4">No recent workouts found</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 p-3">
              <Calendar
                className="modern-calendar"
                tileClassName={({ date }) => {
                  return hasWorkoutOnDate(date) ? 'workout-day' : '';
                }}
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  
                  const intensity = getWorkoutIntensity(date);
                  if (intensity === 0) return null;
                  
                  // Create a colored circle with size based on intensity
                  return (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: intensity === 1 ? '24px' : intensity === 2 ? '28px' : '32px',
                        height: intensity === 1 ? '24px' : intensity === 2 ? '28px' : '32px',
                        backgroundColor: intensity === 1 ? '#4ade80' : intensity === 2 ? '#22c55e' : '#16a34a',
                        borderRadius: '50%',
                        opacity: intensity === 1 ? '0.3' : intensity === 2 ? '0.4' : '0.5',
                        zIndex: '-1'
                      }}
                    />
                  );
                }}
              />
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        .modern-calendar {
          width: 100%;
          border: none !important;
          background: transparent !important;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .modern-calendar .react-calendar__navigation {
          margin-bottom: 10px;
        }
        
        .modern-calendar .react-calendar__navigation button {
          min-width: 44px;
          background: none;
          font-size: 16px;
          border-radius: 8px;
        }
        
        .modern-calendar .react-calendar__navigation button:enabled:hover,
        .modern-calendar .react-calendar__navigation button:enabled:focus {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .modern-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: bold;
          font-size: 0.8em;
        }
        
        .modern-calendar .react-calendar__month-view__days__day {
          padding: 8px;
          position: relative;
        }
        
        .modern-calendar .react-calendar__tile {
          max-width: 100%;
          text-align: center;
          padding: 12px 0;
          background: none;
          border-radius: 12px;
          position: relative;
          z-index: 1;
          font-weight: 500;
        }
        
        .modern-calendar .react-calendar__tile:enabled:hover,
        .modern-calendar .react-calendar__tile:enabled:focus {
          background-color: rgba(0, 0, 0, 0.05);
        }
        
        .modern-calendar .react-calendar__tile--now {
          background: rgba(66, 153, 225, 0.1);
        }
        
        .modern-calendar .react-calendar__tile--now:enabled:hover,
        .modern-calendar .react-calendar__tile--now:enabled:focus {
          background: rgba(66, 153, 225, 0.2);
        }
        
        .modern-calendar .react-calendar__tile--active {
          background: #3182ce;
          color: white;
        }
        
        .modern-calendar .react-calendar__tile--active:enabled:hover,
        .modern-calendar .react-calendar__tile--active:enabled:focus {
          background: #2c5282;
        }
        
        .modern-calendar .react-calendar__tile--hasActive {
          background: #76baff;
        }
        
        .modern-calendar .react-calendar__tile--hasActive:enabled:hover,
        .modern-calendar .react-calendar__tile--hasActive:enabled:focus {
          background: #a9d4ff;
        }
        
        .modern-calendar .workout-day {
          font-weight: 600;
          color: #1a202c;
        }
        
        @media (max-width: 640px) {
          .modern-calendar .react-calendar__tile {
            padding: 8px 0;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

export default StreakModal; 