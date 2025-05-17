import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useWorkoutHistory } from '../context/WorkoutHistoryContext';
import { useNavigate } from 'react-router-dom';

function getQueryDate() {
  const params = new URLSearchParams(window.location.search);
  const dateStr = params.get('date');
  if (!dateStr) return new Date();
  const [yyyy, mm, dd] = dateStr.split('-');
  return new Date(Number(yyyy), Number(mm) - 1, Number(dd));
}

const WorkoutHistory = () => {
  const { workoutHistory, streakData } = useWorkoutHistory();
  const [selectedDate, setSelectedDate] = useState(getQueryDate());
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setSelectedDate(getQueryDate());
  }, [window.location.search]);

  // On mount, always apply the correct dark/light mode from localStorage
  useEffect(() => {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  // Helper functions for calendar styling
  const hasWorkoutOnDate = (date) => {
    return workoutHistory?.some(workout => {
      const workoutDate = new Date(workout.date);
      return workoutDate.toDateString() === date.toDateString();
    }) || false;
  };
  const isDateInStreak = (date) => {
    if (!streakData?.streakDates) return false;
    return streakData.streakDates.includes(date.toISOString().split('T')[0]);
  };
  const getWorkoutIntensity = (date) => {
    if (!workoutHistory) return 0;
    const workout = workoutHistory.find(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.toDateString() === date.toDateString();
    });
    if (!workout) return 0;
    const duration = workout.duration || 0;
    const exercises = workout.totalExercises || workout.exercises?.length || 0;
    return Math.min(3, Math.ceil((duration / 20) + (exercises / 4)));
  };

  // Filter workouts for selected day
  const workoutsForDay = workoutHistory?.filter(w => {
    const d = new Date(w.date);
    return d.toDateString() === selectedDate.toDateString();
  }) || [];

  // Search filter
  const filteredWorkouts = workoutsForDay.filter(w =>
    (w.workoutName || w.name || '').toLowerCase().includes(search.toLowerCase())
  );

  // Helper: Get workout count for a date
  const getWorkoutCount = (date) => {
    return workoutHistory?.filter(w => {
      const workoutDate = new Date(w.date);
      return workoutDate.toDateString() === date.toDateString();
    }).length || 0;
  };

  // Helper: Is today
  const isToday = (date) => {
    const now = new Date();
    return date.toDateString() === now.toDateString();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Workout History</h1>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold"
            onClick={() => navigate(-1)}
          >
            Back
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <Calendar
            value={selectedDate}
            onChange={setSelectedDate}
            className="premium-calendar mx-auto"
            tileClassName={({ date }) => {
              let classes = '';
              if (isDateInStreak(date)) classes += ' streak-day';
              else if (hasWorkoutOnDate(date)) classes += ' workout-day';
              if (selectedDate && date.toDateString() === selectedDate.toDateString()) classes += ' selected-day';
              return classes.trim();
            }}
            tileContent={({ date, view }) => {
              if (view !== 'month') return null;
              const count = getWorkoutCount(date);
              const isSelected = selectedDate && date.toDateString() === selectedDate.toDateString();
              const isCurrentDay = isToday(date);
              // Today: render as a green dot (like other workout days), but text is always white
              if (isCurrentDay) {
                let bg = count > 0 ? (count === 1 ? '#4ade80' : count <= 3 ? '#22c55e' : '#16a34a') : '#e0f2fe';
                let color = '#fff';
                return (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: bg,
                    zIndex: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color
                  }}>{date.getDate()}</div>
                );
              }
              // Selected day: blue with white text (strong contrast)
              if (isSelected) {
                return (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: '#2563eb',
                    zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    color: '#fff',
                    boxShadow: '0 0 0 2px #fff, 0 2px 8px rgba(0,0,0,0.10)'
                  }}>{date.getDate()}</div>
                );
              }
              // Not today, workout: green heatmap
              if (!isCurrentDay && count > 0) {
                let bg = '#bbf7d0';
                let color = '#166534';
                if (count === 2 || count === 3) { bg = '#4ade80'; color = '#065f46'; }
                if (count >= 4) { bg = '#22c55e'; color = '#fff'; }
                return (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: bg,
                    zIndex: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <span style={{ color: color, fontWeight: 700, fontSize: '1rem' }}>{date.getDate()}</span>
                  </div>
                );
              }
              // Default: normal day
              return null;
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
            onClickDay={date => setSelectedDate(date)}
          />
          {/* Legend */}
          <div className="flex justify-center gap-4 text-sm mt-4">
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
        <input
          type="text"
          placeholder="Search workouts..."
          className="w-full border border-gray-300 rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="space-y-3">
          {filteredWorkouts.length > 0 ? (
            filteredWorkouts.map((workout, idx) => {
              const date = new Date(workout.date);
              const time = date.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
              return (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                  <div>
                    <h4 className="font-semibold text-base sm:text-lg">{workout.workoutName || workout.name || 'Workout'}</h4>
                    <p className="text-xs text-gray-600">{date.toLocaleDateString()} {time}</p>
                  </div>
                  <div className="text-right mt-2 sm:mt-0">
                    <p className="font-medium text-sm sm:text-base">{workout.totalExercises || workout.exercises?.length || 0} exercises</p>
                    <p className="text-xs text-gray-600">{Math.round(workout.duration * 60) < 60 ? `${Math.round(workout.duration * 60)} sec` : `${Math.round(workout.duration)} min`}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-gray-500 text-center py-8">No workouts for this day.</div>
          )}
        </div>
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
          background: #fff !important;
          border-radius: 16px 16px 0 0;
        }
        .premium-calendar .react-calendar__navigation button,
        .premium-calendar .react-calendar__navigation__label {
          background: #fff !important;
          color: #18181b !important;
        }
        .dark .premium-calendar .react-calendar__navigation,
        .dark .premium-calendar .react-calendar__navigation button,
        .dark .premium-calendar .react-calendar__navigation__label {
          background: #fff !important;
          color: #18181b !important;
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
          /* No border for today */
        }
        .premium-calendar .today-highlight {
          /* No shadow for today */
        }
        .premium-calendar .react-calendar__tile--active {
          background: #2563eb !important;
          color: #fff !important;
          font-weight: 700;
        }
        .dark .premium-calendar .react-calendar__tile--active {
          background: #23262f !important;
          color: #fff !important;
          font-weight: 700;
        }
        .dark .premium-calendar .react-calendar__tile {
          color: #fff !important;
        }
        .premium-calendar .react-calendar__tile--active:enabled:hover,
        .premium-calendar .react-calendar__tile--active:enabled:focus {
          background: #1d4ed8 !important;
        }
        .premium-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #a0aec0;
        }
        .premium-calendar .workout-day {
          font-weight: 700;
        }
        .premium-calendar .streak-day {
          font-weight: 700;
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

export default WorkoutHistory; 