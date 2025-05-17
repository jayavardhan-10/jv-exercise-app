import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useWorkoutHistory } from '../context/WorkoutHistoryContext';

const StreakModal = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('streak');
  const { workoutHistory, streak, streakData, loading } = useWorkoutHistory();
  const [debugInfo, setDebugInfo] = useState({});
  
  // Debug logs
  useEffect(() => {
    console.log('[DEBUG] workoutHistory:', workoutHistory);
    console.log('[DEBUG] streak:', streak);
    console.log('[DEBUG] streakData:', streakData);
    console.log('[DEBUG] loading:', loading);
    
    // Update debug info for display
    setDebugInfo({
      historyLength: workoutHistory?.length || 0,
      streak: streak,
      streakDatesLength: streakData?.streakDates?.length || 0,
      totalWorkouts: streakData?.totalWorkouts || 0,
      longestStreak: streakData?.longestStreak || 0,
      lastWorkout: streakData?.lastWorkout ? new Date(streakData.lastWorkout).toLocaleString() : 'None'
    });
  }, [workoutHistory, streak, streakData, loading]);

  // Format time properly (convert minutes to MM:SS format)
  const formatTime = (minutes) => {
    if (!minutes) return '0 min';
    
    // Convert to integer minutes and seconds
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    
    if (mins === 0) {
      return `${secs} sec`;
    } else if (secs === 0) {
      return `${mins} min`;
    } else {
      return `${mins}:${secs.toString().padStart(2, '0')} min`;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'None';
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Format time (HH:mm)
  const formatStartTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  // Get recent workouts
  const recentWorkouts = workoutHistory
    ?.sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5) || [];

  // Check if a date has a workout
  const hasWorkoutOnDate = (date) => {
    return workoutHistory?.some(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.toDateString() === date.toDateString();
    }) || false;
  };

  // Get workout intensity (1-3) based on duration and exercises
  const getWorkoutIntensity = (date) => {
    if (!workoutHistory) return 0;
    
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

  // Get streak dates in Date format
  const getStreakDates = () => {
    return streakData?.streakDates?.map(dateStr => new Date(dateStr)) || [];
  };

  // Check if date is in streak
  const isDateInStreak = (date) => {
    if (!streakData?.streakDates) return false;
    return streakData.streakDates.includes(date.toISOString().split('T')[0]);
  };

  // Calculate longest streak manually if not available in backend
  const calculateLongestStreak = () => {
    if (streakData?.longestStreak) return streakData.longestStreak;
    if (!workoutHistory?.length) return 0;
    
    // Get unique workout dates
    const uniqueDates = [...new Set(
      workoutHistory.map(w => new Date(w.date).toISOString().split('T')[0])
    )].sort();
    
    let maxStreak = 0;
    let currentStreak = 1;
    
    for (let i = 1; i < uniqueDates.length; i++) {
      const prevDate = new Date(uniqueDates[i-1]);
      const currDate = new Date(uniqueDates[i]);
      const diffDays = Math.floor((currDate - prevDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak++;
      } else {
        maxStreak = Math.max(maxStreak, currentStreak);
        currentStreak = 1;
      }
    }
    
    maxStreak = Math.max(maxStreak, currentStreak);
    return maxStreak;
  };
  
  // Use these reliable values instead of potentially missing streakData values
  const longestStreak = streakData?.longestStreak || calculateLongestStreak();
  const totalWorkouts = streakData?.totalWorkouts || workoutHistory?.length || 0;
  const lastWorkout = streakData?.lastWorkout || (workoutHistory?.length > 0 ? workoutHistory[0].date : null);

  // Helper: Get start of week (Sunday)
  const getStartOfWeek = (date) => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - d.getDay());
    return d;
  };

  // Helper: Get end of week (Saturday)
  const getEndOfWeek = (date) => {
    const d = new Date(date);
    d.setHours(23, 59, 59, 999);
    d.setDate(d.getDate() + (6 - d.getDay()));
    return d;
  };

  // Get workouts for this week (Sunday to Saturday)
  const now = new Date();
  const weekStart = getStartOfWeek(now);
  const weekEnd = getEndOfWeek(now);
  const workoutsThisWeek = workoutHistory?.filter(w => {
    const workoutDate = new Date(w.date);
    return workoutDate >= weekStart && workoutDate <= weekEnd;
  }) || [];
  const totalWorkoutsThisWeek = workoutsThisWeek.length;

  // Format date for recent workouts and last workout
  const formatRecentDate = (dateString) => {
    if (!dateString) return 'None';
    const date = new Date(dateString);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === yesterday.toDateString();
    const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    if (isToday) return `Today ${time}`;
    if (isYesterday) return `Yesterday ${time}`;
    return date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) + ` ${time}`;
  };

  if (!isOpen) return null;

  // Show loading state if data is not ready
  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(3px)' }}>
        <div className="bg-white rounded-2xl p-8 w-full max-w-lg sm:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col items-center justify-center">
          <span className="text-xl text-blue-600 font-semibold">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" style={{ backdropFilter: 'blur(3px)' }}>
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
                  {`${streak}-Day Streak`}
                </h3>
              </div>
              <p className="text-orange-600 text-center">
                {streak > 0 
                  ? "Keep up the great work!" 
                  : "Complete a workout today to start your streak!"}
              </p>
              
              {/* Longest streak info */}
              <p className="text-xs text-gray-700 mt-2">
                Longest streak: <span className="font-semibold">{longestStreak} {longestStreak === 1 ? 'day' : 'days'}</span>
              </p>
              
              {/* Streak Visualization */}
              {streak > 0 && (
                <div className="w-full mt-4">
                  <div className="flex justify-center gap-1 sm:gap-2 overflow-x-auto py-2">
                    {getStreakDates().map((date, index) => (
                      <div 
                        key={index} 
                        className="flex flex-col items-center min-w-[40px]"
                        title={date.toLocaleDateString()}
                      >
                        <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold mb-1">
                          {date.getDate()}
                        </div>
                        <span className="text-xs text-orange-800">
                          {date.toLocaleDateString(undefined, { weekday: 'short' })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Stats Summary */}
            <div className="bg-blue-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-3">Workouts This Week</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Workouts This Week</p>
                  <p className="text-2xl font-bold text-blue-600">{totalWorkoutsThisWeek}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-sm text-gray-600">Last Workout</p>
                  <p className="text-xl font-bold text-blue-600">
                    {formatRecentDate(lastWorkout)}
                  </p>
                </div>
              </div>
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
                          {formatRecentDate(workout.date)}
                        </p>
                      </div>
                      <div className="text-right mt-2 sm:mt-0">
                        <p className="font-medium text-sm sm:text-base">{workout.totalExercises || workout.exercises?.length || 0} exercises</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {formatTime(workout.duration)}
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
            <div className="rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
              <Calendar
                className="premium-calendar"
                tileClassName={({ date }) => {
                  if (isDateInStreak(date)) return 'streak-day';
                  return hasWorkoutOnDate(date) ? 'workout-day' : '';
                }}
                tileContent={({ date, view }) => {
                  if (view !== 'month') return null;
                  
                  const intensity = getWorkoutIntensity(date);
                  if (intensity === 0) return null;
                  
                  // Create a colored circle with size based on intensity
                  const isStreakDay = isDateInStreak(date);
                  const bgColor = isStreakDay 
                    ? (intensity === 1 ? '#f97316' : intensity === 2 ? '#ea580c' : '#c2410c')
                    : (intensity === 1 ? '#22c55e' : intensity === 2 ? '#16a34a' : '#15803d');
                  
                  return (
                    <div 
                      style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: intensity === 1 ? '28px' : intensity === 2 ? '32px' : '36px',
                        height: intensity === 1 ? '28px' : intensity === 2 ? '32px' : '36px',
                        backgroundColor: bgColor,
                        borderRadius: '50%',
                        opacity: intensity === 1 ? '0.4' : intensity === 2 ? '0.5' : '0.6',
                        zIndex: '-1',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)'
                      }}
                    />
                  );
                }}
                nextLabel={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                }
                prevLabel={
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                }
              />
            </div>
            
            {/* Legend */}
            <div className="flex justify-center gap-4 text-sm">
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-green-500 opacity-50 mr-1"></span>
                <span>Regular Workout</span>
              </div>
              <div className="flex items-center">
                <span className="inline-block w-3 h-3 rounded-full bg-orange-500 opacity-50 mr-1"></span>
                <span>Streak Workout</span>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx="true">{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        
        .premium-calendar {
          width: 100%;
          border: none !important;
          background: transparent !important;
          font-family: 'Inter', system-ui, -apple-system, sans-serif;
        }
        
        .premium-calendar .react-calendar__navigation {
          margin-bottom: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        
        .premium-calendar .react-calendar__navigation button {
          min-width: 44px;
          height: 44px;
          background: none;
          font-size: 16px;
          border-radius: 12px;
          color: #1a202c;
          margin: 0 2px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s;
        }
        
        .premium-calendar .react-calendar__navigation button:enabled:hover,
        .premium-calendar .react-calendar__navigation button:enabled:focus {
          background-color: rgba(0, 0, 0, 0.05);
          transform: scale(1.05);
        }
        
        .premium-calendar .react-calendar__navigation__label {
          font-weight: 600;
          font-size: 18px;
          flex-grow: 1;
        }
        
        .premium-calendar .react-calendar__month-view__weekdays {
          text-transform: uppercase;
          font-weight: 600;
          font-size: 0.85em;
          color: #4a5568;
          margin-bottom: 8px;
          text-align: center;
        }
        
        /* Remove the underline */
        .premium-calendar .react-calendar__month-view__weekdays__weekday {
          padding: 8px;
        }
        
        .premium-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
          border-bottom: none;
          cursor: default;
        }
        
        .premium-calendar .react-calendar__month-view__days__day {
          padding: 8px;
          position: relative;
        }
        
        .premium-calendar .react-calendar__tile {
          max-width: 100%;
          text-align: center;
          padding: 14px 0;
          background: none;
          border-radius: 12px;
          position: relative;
          z-index: 1;
          font-weight: 500;
          font-size: 16px;
          transition: all 0.15s ease;
        }
        
        .premium-calendar .react-calendar__tile:enabled:hover,
        .premium-calendar .react-calendar__tile:enabled:focus {
          background-color: rgba(0, 0, 0, 0.05);
          transform: scale(1.05);
        }
        
        .premium-calendar .react-calendar__tile--now {
          background: rgba(66, 153, 225, 0.1);
          font-weight: 700;
        }
        
        .premium-calendar .react-calendar__tile--now:enabled:hover,
        .premium-calendar .react-calendar__tile--now:enabled:focus {
          background: rgba(66, 153, 225, 0.2);
        }
        
        .premium-calendar .react-calendar__tile--active {
          background: #3182ce;
          color: white;
          font-weight: 600;
        }
        
        .premium-calendar .react-calendar__tile--active:enabled:hover,
        .premium-calendar .react-calendar__tile--active:enabled:focus {
          background: #2c5282;
        }
        
        .premium-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #a0aec0;
        }
        
        .premium-calendar .workout-day {
          font-weight: 700;
          color: #1a202c;
        }
        
        .premium-calendar .streak-day {
          font-weight: 700;
          color: #c2410c;
        }
        
        @media (max-width: 640px) {
          .premium-calendar .react-calendar__tile {
            padding: 10px 0;
            font-size: 0.9rem;
          }
          
          .premium-calendar .react-calendar__navigation button {
            min-width: 36px;
            height: 36px;
          }
          
          .premium-calendar .react-calendar__navigation__label {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default StreakModal; 