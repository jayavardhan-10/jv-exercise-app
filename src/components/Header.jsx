import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWorkoutHistory } from '../context/WorkoutHistoryContext';
import StreakModal from './StreakModal';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user } = useAuth();
  const { streak, workoutHistory } = useWorkoutHistory();
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();
  const location = useLocation();
  
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

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  const handleAppNameClick = () => {
    if (location.pathname.startsWith('/workout') || location.pathname.startsWith('/create') || location.pathname.startsWith('/edit')) {
      if (window.confirm('You have unsaved progress. Are you sure you want to leave?')) {
        navigate('/dashboard');
      }
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, []);

  return (
    <>
      <header className="w-full flex items-center justify-between px-6 py-4 bg-white shadow-sm sticky top-0 z-20">
        <div className="text-2xl font-bold text-gray-900 cursor-pointer select-none" onClick={handleAppNameClick}>JV Exercise App</div>
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
          <button
            className={`relative w-14 h-8 rounded-full transition-colors duration-500 focus:outline-none ${darkMode ? 'bg-blue-900' : 'bg-gray-300'}`}
            onClick={toggleDarkMode}
            aria-label="Toggle dark mode"
          >
            <span
              className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow transition-transform duration-500 ${darkMode ? 'translate-x-6' : ''}`}
              style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              {darkMode ? (
                <svg className="w-5 h-5 mx-auto my-1 text-blue-900 transition-colors duration-500" fill="currentColor" viewBox="0 0 20 20"><path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" /></svg>
              ) : (
                <svg className="w-5 h-5 mx-auto my-1 text-yellow-400 transition-colors duration-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4.22 2.47a1 1 0 011.42 1.42l-.7.7a1 1 0 11-1.42-1.42l.7-.7zM18 9a1 1 0 100 2h-1a1 1 0 100-2h1zM4.22 4.22a1 1 0 011.42 0l.7.7a1 1 0 01-1.42 1.42l-.7-.7a1 1 0 010-1.42zM2 9a1 1 0 100 2H3a1 1 0 100-2H2zm2.47 7.53a1 1 0 010-1.42l.7-.7a1 1 0 011.42 1.42l-.7.7a1 1 0 01-1.42 0zM10 16a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zm7.53-2.47a1 1 0 00-1.42 0l-.7.7a1 1 0 001.42 1.42l.7-.7a1 1 0 000-1.42z" /></svg>
              )}
            </span>
          </button>
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